/*
 * Unit tests for src/trash.ts - keeping the templates a save took away or changed, and
 * putting one back. Run with `npm test`.
 */
const {
  templateChanges,
  addToTrash,
  readTrash,
  restoreTemplate,
  withoutEntry,
  TRASH_SIZE,
  watchForTrash,
} = require('../.test-build/trash.js');

const { check } = require('./check');

const room = { card: { type: 'tile', entity: '[[entity]]' } };
const before = {
  decluttering_templates: { room, kept: { card: { type: 'markdown' } } },
  views: [{ cards: [{ type: 'custom:decluttering-template-plus', template: 'onview', card: { type: 'button' } }] }],
};

check('nothing changed is nothing to keep', templateChanges(before, JSON.parse(JSON.stringify(before))), []);

check(
  'a template that left is kept as it was',
  templateChanges(before, { ...before, decluttering_templates: { kept: before.decluttering_templates.kept } }),
  [{ name: 'room', template: room, reason: 'removed' }],
);

check(
  'a changed template keeps its old version',
  templateChanges(before, {
    ...before,
    decluttering_templates: { ...before.decluttering_templates, room: { card: { type: 'tile' } } },
  }).map((change) => [change.name, change.reason]),
  [['room', 'replaced']],
);

check(
  'a template card taken off a view is kept too',
  templateChanges(before, { ...before, views: [{ cards: [] }] }).map((change) => [change.name, change.reason]),
  [['onview', 'removed']],
);

check(
  'a key order change is not a change',
  templateChanges({ decluttering_templates: { a: { x: 1, y: 2 } } }, { decluttering_templates: { a: { y: 2, x: 1 } } }),
  [],
);

const entry = (name, at, template = room) => ({ name, dashboard: 'lovelace', template, reason: 'removed', at });

check(
  'newest first',
  addToTrash([entry('a', 1)], [entry('b', 2)]).map((each) => each.name),
  ['b', 'a'],
);
check('the same version is not kept twice', addToTrash([entry('a', 1)], [entry('a', 2)]).length, 1);
check(
  'a different version of the same name is kept',
  addToTrash([entry('a', 1)], [entry('a', 2, { card: {} })]).length,
  2,
);
check(
  'only the last few are kept',
  addToTrash(
    [],
    Array.from({ length: TRASH_SIZE + 5 }, (_, index) => entry(`t${index}`, index)),
  ).length,
  TRASH_SIZE,
);
check('bad entries are dropped on reading', readTrash([entry('a', 1), { name: 1 }, null, 'x']).length, 1);
check('not a list reads as empty', readTrash({ a: 1 }), []);
check(
  'an entry can be taken out',
  withoutEntry([entry('a', 1), entry('b', 2)], entry('a', 1)).map((each) => each.name),
  ['b'],
);

check(
  'a removed template comes back under decluttering_templates',
  restoreTemplate({ views: [] }, { ...entry('onview', 1), template: before.views[0].cards[0] }).decluttering_templates,
  { onview: { card: { type: 'button' } } },
);
check(
  'a template still there is replaced where it sits',
  restoreTemplate(before, { ...entry('onview', 1), template: { card: { type: 'tile' } } }).views[0].cards[0],
  { type: 'custom:decluttering-template-plus', template: 'onview', card: { type: 'tile' } },
);

/*
 * A YAML-mode dashboard, the way Home Assistant serves one: a read with `force` loads the
 * file again and announces lovelace_updated, which the watcher answers by reading again.
 * Forum thread post 19 - the dashboard redrew itself thousands of times a minute.
 */
(async () => {
  global.document = { location: { pathname: '/tableau-ha/principale' } };
  let handler;
  const reads = [];
  const hass = {
    user: { is_admin: true },
    connection: { subscribeEvents: (callback) => (handler = callback) },
    callWS: async (message) => {
      if (message.type === 'lovelace/dashboards/list') return [{ url_path: 'tableau-ha', mode: 'yaml' }];
      if (message.type !== 'lovelace/config') return null;
      reads.push(message);
      if (message.force) setTimeout(() => handler({ data: { url_path: message.url_path } }), 0);
      return { views: [] };
    },
  };
  watchForTrash(hass);
  await new Promise((resolve) => setTimeout(resolve, 50));
  check('a YAML-mode dashboard is never read with force', reads.filter((each) => each.force).length, 0);
  const settled = reads.length;
  handler({ data: { url_path: 'tableau-ha' } });
  await new Promise((resolve) => setTimeout(resolve, 50));
  check('a YAML-mode dashboard announcing itself is not read again', reads.length, settled);
})();
