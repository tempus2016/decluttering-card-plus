/*
 * Unit tests for src/undo.ts: rewriting dashboards so the last rewrite can be put back,
 * and refusing to put it back silently over changes made since. Run with `npm test`.
 */
const undo = require('../.test-build/undo.js');

const { check, report } = require('./harness');

// A sessionStorage stand-in, so the persistence can be seen. Node has none of its own.
const stored = new Map();
let storageFull = false;
global.sessionStorage = {
  getItem: (key) => (stored.has(key) ? stored.get(key) : null),
  setItem: (key, value) => {
    if (storageFull) throw new Error('QuotaExceededError');
    stored.set(key, value);
  },
  removeItem: (key) => stored.delete(key),
};

/* A dashboard on the page, and a websocket holding two others, recording every save. */
function rig() {
  const saves = [];
  const dashboards = {
    other: { views: [{ title: 'Other' }] },
    lovelace: { views: [{ title: 'Default' }] },
  };
  const panel = {
    config: { views: [{ title: 'Here' }] },
    saveConfig: async (config) => {
      saves.push(['panel', config]);
      panel.config = config;
      // The page saves over the websocket like anything else.
      dashboards.here = config;
    },
  };
  dashboards.here = panel.config;
  const hass = {
    callWS: async (message) => {
      const key = message.url_path ?? 'lovelace';
      if (message.type === 'lovelace/config') {
        if (!(key in dashboards)) throw new Error('no such dashboard');
        return dashboards[key];
      }
      if (message.type === 'lovelace/config/save') {
        if (key === 'broken') throw new Error('refused');
        saves.push([key, message.config]);
        dashboards[key] = message.config;
        return null;
      }
      throw new Error(`unexpected ${message.type}`);
    },
  };
  return { saves, dashboards, panel, hass, saver: { ownPath: 'here', panel, hass } };
}

const retitle = (title) => (config) => ({ ...config, views: [{ title }] });

(async () => {
  /* ------------------------------------------------------------------ paths */

  check('the original dashboard has one name', ['lovelace', 'default', '', null, undefined].map(undo.dashboardKey), [
    'lovelace',
    'lovelace',
    'lovelace',
    'lovelace',
    'lovelace',
  ]);
  check('any other dashboard keeps its own', undo.dashboardKey('rooms'), 'rooms');
  check(
    'the websocket wants null for the original dashboard',
    [undo.wsUrlPath('lovelace'), undo.wsUrlPath('rooms')],
    [null, 'rooms'],
  );

  check(
    'key order does not make two configs different',
    undo.sameConfig({ a: 1, b: [{ c: 1, d: 2 }] }, { b: [{ d: 2, c: 1 }], a: 1 }),
    true,
  );
  check('a different value does', undo.sameConfig({ a: 1 }, { a: 2 }), false);

  /* ------------------------------------------------------------------ holding */

  undo.forgetUndo();
  check('nothing held to begin with', undo.heldUndo(), undefined);

  {
    const { saver, saves, panel } = rig();
    const entry = await undo.applyRewrite(saver, 'rename_template', [{ urlPath: 'here', build: retitle('Renamed') }]);
    check(
      'the dashboard on the page is saved through the page',
      saves.map(([where]) => where),
      ['panel'],
    );
    check('what it was, and what was written, are kept', entry.dashboards, [
      { urlPath: 'here', before: { views: [{ title: 'Here' }] }, after: { views: [{ title: 'Renamed' }] } },
    ]);
    check('the operation is named', [entry.operation, typeof entry.at], ['rename_template', 'number']);
    check('it is the one held', undo.heldUndo(), entry);
    check(
      'and it is in sessionStorage too',
      JSON.parse(stored.get('decluttering-card-plus:undo')).operation,
      'rename_template',
    );

    const outcome = await undo.runUndo(saver, undo.heldUndo());
    check('undoing puts it back', [outcome, panel.config], [{ result: 'done' }, { views: [{ title: 'Here' }] }]);
    check('and lets it go', [undo.heldUndo(), stored.size], [undefined, 0]);
  }

  {
    const { saver, saves, dashboards } = rig();
    const entry = await undo.applyRewrite(saver, 'rename_variable', [
      { urlPath: 'here', build: retitle('A') },
      { urlPath: 'other', build: retitle('B') },
      { urlPath: 'lovelace', build: (config) => config },
      { urlPath: 'default', build: (config) => ({ ...config }) },
    ]);
    check(
      'other dashboards go over the websocket, and one left as it was is not saved',
      saves.map(([where]) => where),
      ['panel', 'other'],
    );
    check(
      'only the dashboards written are kept',
      entry.dashboards.map((each) => each.urlPath),
      ['here', 'other'],
    );

    // Somebody edits the other dashboard after the rename.
    dashboards.other = { views: [{ title: 'Edited since' }] };
    const refused = await undo.runUndo(saver, entry);
    check(
      'a dashboard changed since is named, and nothing is written',
      [refused, saves.length],
      [{ result: 'changed', dashboards: ['other'] }, 2],
    );
    check('the undo is still held after a refusal', undo.heldUndo() === entry, true);

    const forced = await undo.runUndo(saver, entry, true);
    check(
      'told and agreed, it goes ahead',
      [forced, dashboards.other, saver.panel.config],
      [{ result: 'done' }, { views: [{ title: 'Other' }] }, { views: [{ title: 'Here' }] }],
    );
  }

  {
    // Saved from another tab, or over the websocket: the page's own copy never hears of it.
    const { saver, saves, dashboards, panel } = rig();
    const entry = await undo.applyRewrite(saver, 'rename_template', [{ urlPath: 'here', build: retitle('Renamed') }]);
    dashboards.here = { views: [{ title: 'Saved elsewhere' }] };
    const refused = await undo.runUndo(saver, entry);
    check(
      'the page dashboard saved from somewhere else is read as it is saved, and named',
      [refused, saves.length, panel.config],
      [{ result: 'changed', dashboards: ['here'] }, 1, { views: [{ title: 'Renamed' }] }],
    );
  }

  {
    // A rewrite starts from what is saved, not from a stale copy on the page.
    const { saver, dashboards } = rig();
    dashboards.here = { views: [{ title: 'Saved elsewhere' }] };
    const entry = await undo.applyRewrite(saver, 'rename_template', [
      { urlPath: 'here', build: (config) => ({ ...config, title: 'x' }) },
    ]);
    check('a rewrite of the page dashboard starts from what is saved', entry.dashboards[0].before, {
      views: [{ title: 'Saved elsewhere' }],
    });
  }

  {
    // The original dashboard before anyone took control of it has nothing saved.
    const { saver, panel } = rig();
    const fresh = {
      ...saver,
      ownPath: 'lovelace',
      hass: { callWS: async () => Promise.reject(new Error('No config found.')) },
    };
    check(
      'with nothing saved for the page dashboard, the page has the answer',
      await undo.readDashboard(fresh, 'lovelace'),
      panel.config,
    );
    check('and with no websocket at all', await undo.readDashboard({ ...saver, hass: null }, 'here'), panel.config);
  }

  {
    const { saver, saves } = rig();
    const entry = await undo.applyRewrite(saver, 'declutter', [{ urlPath: 'here', build: retitle('X') }]);
    await saver.panel.saveConfig(entry.dashboards[0].before);
    const outcome = await undo.runUndo(saver, entry);
    check(
      'a dashboard already back as it was has nothing to undo',
      [outcome, saves.length],
      [{ result: 'nothing' }, 2],
    );
    check('and the undo is let go', undo.heldUndo(), undefined);
  }

  {
    const { saver } = rig();
    const entry = await undo.applyRewrite(saver, 'modernise', [{ urlPath: 'here', build: (config) => config }]);
    check(
      'a rewrite that changes nothing saves nothing and holds nothing',
      [entry, undo.heldUndo()],
      [undefined, undefined],
    );
  }

  {
    const { saver } = rig();
    let error;
    try {
      await undo.applyRewrite(saver, 'rename_variable', [
        { urlPath: 'here', build: retitle('Saved') },
        { urlPath: 'broken', build: retitle('Never') },
      ]);
    } catch (err) {
      error = err.message;
    }
    check('a failed save is passed on', error, 'no such dashboard');
    check(
      'and what was saved before it can still be undone',
      undo.heldUndo().dashboards.map((each) => each.urlPath),
      ['here'],
    );
  }

  {
    const { saver } = rig();
    const noSocket = { ownPath: 'here', panel: saver.panel, hass: null };
    let error;
    try {
      await undo.readDashboard(noSocket, 'other');
    } catch (err) {
      error = err.message;
    }
    check('another dashboard cannot be read without the websocket', error, 'cannot read the dashboard "other"');
    try {
      await undo.writeDashboard(noSocket, 'other', {});
    } catch (err) {
      error = err.message;
    }
    check('nor written', error, 'cannot save the dashboard "other"');
    const noPanel = { ownPath: 'here', panel: null, hass: saver.hass };
    try {
      await undo.readDashboard(noPanel, 'nowhere');
    } catch (err) {
      error = err.message;
    }
    check('a dashboard the websocket does not have is an error', error, 'no such dashboard');
  }

  /* ------------------------------------------------------------------ storage */

  {
    undo.forgetUndo();
    const entry = { operation: 'import', at: 1, dashboards: [] };
    stored.set('decluttering-card-plus:undo', JSON.stringify(entry));
    check('an undo kept in sessionStorage is found after a reload', undo.heldUndo(), entry);
    undo.forgetUndo();
    stored.set('decluttering-card-plus:undo', '{not json');
    check('an unreadable one is nothing', undo.heldUndo(), undefined);
    stored.set('decluttering-card-plus:undo', JSON.stringify({ something: 'else' }));
    check('nor is one of the wrong shape', undo.heldUndo(), undefined);

    stored.set('decluttering-card-plus:undo', JSON.stringify(entry));
    storageFull = true;
    const big = { operation: 'library_install', at: 2, dashboards: [] };
    undo.holdUndo(big);
    check('too big for sessionStorage, it is still held in memory', undo.heldUndo(), big);
    check('and the stale one in storage is gone', stored.has('decluttering-card-plus:undo'), false);
    storageFull = false;
    undo.forgetUndo();
  }

  {
    const saved = global.sessionStorage;
    delete global.sessionStorage;
    const entry = { operation: 'duplicate', at: 3, dashboards: [] };
    undo.holdUndo(entry);
    check('with no sessionStorage at all, memory still holds it', undo.heldUndo(), entry);
    undo.forgetUndo();
    check('and lets it go', undo.heldUndo(), undefined);
    global.sessionStorage = saved;
  }

  report();
})();
