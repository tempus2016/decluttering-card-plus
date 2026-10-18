/*
 * Categories - the folders automations, scripts and helpers are filed in - are on neither
 * hass.entities nor any registry hass carries, so categories.ts fetches them, and a repeat
 * can then ask for "every automation in Lighting". Run with `npm test`.
 */
const { check, report } = require('./harness');
const {
  buildCategoryRegistry,
  categoriesOf,
  categoryRegistry,
  loadCategories,
  resetCategories,
  wantsCategories,
  whenCategoriesChange,
} = require('../.test-build/categories.js');
const { resolveRegistryItems, registryKey, registryNames, isRegistrySource } = require('../.test-build/registry.js');

// Three automations and a helper, as hass.entities has them: no categories anywhere.
const hass = {
  entities: {
    'automation.porch_on': { entity_id: 'automation.porch_on' },
    'automation.porch_off': { entity_id: 'automation.porch_off' },
    'automation.heating': { entity_id: 'automation.heating' },
    'input_boolean.guest_mode': { entity_id: 'input_boolean.guest_mode' },
  },
  devices: {},
  areas: {},
  floors: {},
  states: {
    'automation.porch_on': { attributes: { friendly_name: 'Porch on' } },
    'automation.porch_off': { attributes: { friendly_name: 'Porch off' } },
    'automation.heating': { attributes: { friendly_name: 'Heating' } },
    'input_boolean.guest_mode': { attributes: { friendly_name: 'Guest mode' } },
  },
};

// What config/entity_registry/list and config/category_registry/list answer.
const ENTRIES = [
  { entity_id: 'automation.porch_on', categories: { automation: 'cat_light' } },
  { entity_id: 'automation.porch_off', categories: { automation: 'cat_light' } },
  { entity_id: 'automation.heating', categories: { automation: 'cat_heat' } },
  { entity_id: 'input_boolean.guest_mode', categories: { helpers: 'cat_house' } },
  { entity_id: 'light.unfiled', categories: {} },
];
const NAMES = {
  automation: [
    { category_id: 'cat_light', name: 'Lighting' },
    { category_id: 'cat_heat', name: 'Heating' },
  ],
  helpers: [{ category_id: 'cat_house', name: 'House' }],
};

const calls = [];
const subscribed = [];
const withWS = {
  ...hass,
  callWS: async (msg) => {
    calls.push(msg);
    if (msg.type === 'config/entity_registry/list') return ENTRIES;
    if (msg.type === 'config/category_registry/list') return NAMES[msg.scope] ?? [];
    throw new Error('unexpected ' + msg.type);
  },
  connection: {
    subscribeEvents: (callback, event) => {
      subscribed.push({ callback, event });
      return Promise.resolve(() => undefined);
    },
  },
};

const ids = (items) => items.map((item) => item.entity);

(async () => {
  /* ------------------------------------------------------------ the pure parts */

  const built = buildCategoryRegistry(ENTRIES, NAMES);
  check('an entity filed nowhere is not kept', Object.keys(built.entities).includes('light.unfiled'), false);
  check('names are kept per scope', built.names.automation.cat_light, 'Lighting');
  check(
    'a category with no name is named by its id',
    buildCategoryRegistry([], { x: [{ category_id: 'c' }] }).names.x.c,
    'c',
  );

  check('category is a source on its own', isRegistrySource({ category: 'Lighting' }), true);
  check(
    'a source naming a category wants them fetched',
    wantsCategories({ domain: 'automation', category: 'x' }),
    true,
  );
  check('so does one inside with:', wantsCategories({ areas: true, with: { category: 'x' } }), true);
  check('entity_category is a different thing', wantsCategories({ entities: '*', entity_category: 'all' }), false);
  check(
    'a copy names its category only when the source narrows by one',
    registryNames({ category: 'x' }).includes('category'),
    true,
  );
  check('and not otherwise', registryNames({ domain: 'light' }).includes('category'), false);

  /* -------------------------------------------------------- before the fetch */

  resetCategories();
  check(
    'before anything is fetched, a category matches nothing',
    resolveRegistryItems(hass, { category: 'Lighting' }),
    [],
  );
  check('and nothing is known about any entity', categoriesOf('automation.porch_on'), []);
  const keyBefore = registryKey(withWS);

  /* --------------------------------------------------------------- the fetch */

  await loadCategories(withWS);
  check(
    'the entity registry is fetched, then the names of each scope found in it',
    calls.map((msg) => (msg.scope ? `${msg.type}:${msg.scope}` : msg.type)),
    [
      'config/entity_registry/list',
      'config/category_registry/list:automation',
      'config/category_registry/list:helpers',
    ],
  );
  check('the registry key moves when it lands, so the card rebuilds', registryKey(withWS)[5] === keyBefore[5], false);
  check('categoryRegistry hands back what was fetched', !!categoryRegistry(), true);

  check('a category matches by name', ids(resolveRegistryItems(withWS, { category: 'Lighting' })), [
    'automation.porch_off',
    'automation.porch_on',
  ]);
  check('and by id', ids(resolveRegistryItems(withWS, { category: 'cat_heat' })), ['automation.heating']);
  check('a list is either', ids(resolveRegistryItems(withWS, { category: ['Heating', 'House'] })), [
    'input_boolean.guest_mode',
    'automation.heating',
  ]);
  check('patterns work as they do for labels', ids(resolveRegistryItems(withWS, { category: 'light*' })), [
    'automation.porch_off',
    'automation.porch_on',
  ]);
  check(
    'a category combines with the other filters',
    ids(resolveRegistryItems(withWS, { category: ['Lighting', 'House'], domain: 'input_boolean' })),
    ['input_boolean.guest_mode'],
  );
  check(
    'and can be left out',
    ids(resolveRegistryItems(withWS, { domain: 'automation', exclude: { category: 'Lighting' } })),
    ['automation.heating'],
  );
  check(
    'each copy says which category it is in',
    resolveRegistryItems(withWS, { category: 'cat_*', sort: 'entity' }).map((item) => item.category),
    ['Heating', 'Lighting', 'Lighting', 'House'],
  );
  check(
    'a copy of a repeat that does not narrow by category has no category key',
    Object.keys(resolveRegistryItems(withWS, { entities: 'automation.heating' })[0]).includes('category'),
    false,
  );

  /* ------------------------------------------------------------ keeping fresh */

  const before = calls.length;
  await loadCategories(withWS);
  check('a second ask is answered from what was fetched', calls.length, before);
  check(
    'both registries are watched',
    subscribed.map((each) => each.event),
    ['entity_registry_updated', 'category_registry_updated'],
  );
  // A category renamed: the registry answers the new name from now on.
  const told = [];
  const stop = whenCategoriesChange(() => told.push(categoryRegistry()));
  const old = categoryRegistry();
  NAMES.automation[0].name = 'Lights';
  subscribed[1].callback();
  check('a change fetches again straight away, without waiting for a card to ask', calls.length > before, true);
  check('and keeps the old answer until the new one lands, so nothing builds empty', categoryRegistry(), old);
  const underway = calls.length;
  void loadCategories(withWS);
  check('a card asking meanwhile is answered from the old one, not with a fetch of its own', calls.length, underway);
  await new Promise((resolve) => setTimeout(resolve, 10));
  check('when the new answer lands the cards are told, so they rebuild', told.length, 1);
  check('with the new answer in place by then', told[0] !== old && told[0] === categoryRegistry(), true);
  check('which has the new name', ids(resolveRegistryItems(withWS, { category: 'Lights' })), [
    'automation.porch_off',
    'automation.porch_on',
  ]);

  // A burst of changes: one fetch under way, and only one more after it.
  const burst = calls.length;
  subscribed[0].callback();
  subscribed[0].callback();
  subscribed[1].callback();
  await new Promise((resolve) => setTimeout(resolve, 10));
  check('a burst of changes fetches once, then once more for what came in meanwhile', calls.length - burst, 6);
  check('and tells the cards once, when it has settled', told.length, 2);
  stop();
  subscribed[1].callback();
  await new Promise((resolve) => setTimeout(resolve, 10));
  check('a card that stopped asking is not told', told.length, 2);
  NAMES.automation[0].name = 'Lighting';

  resetCategories();
  const failing = { ...hass, callWS: async () => Promise.reject(new Error('nope')) };
  await loadCategories(failing);
  check('a failed fetch leaves nothing cached, to try again later', categoryRegistry(), undefined);

  report();
})();
