/*
 * Unit tests for src/registry.ts - turning "every light in the kitchen" into the list of
 * copies a template is repeated over. Run with `npm test`.
 */
const {
  isRegistrySource,
  resolveRegistryItems,
  registryKey,
  registryNames,
  sameRegistry,
} = require('../.test-build/registry.js');

const { check, report } = require('./harness');

// A small house: two areas on one floor, one of them holding a lamp on a device.
const hass = {
  floors: {
    ground: { floor_id: 'ground', name: 'Ground floor' },
    upstairs: { floor_id: 'upstairs', name: 'Upstairs' },
  },
  areas: {
    kitchen: { area_id: 'kitchen', name: 'Kitchen', icon: 'mdi:silverware', floor_id: 'ground', labels: [] },
    bedroom: { area_id: 'bedroom', name: 'Bedroom', floor_id: 'upstairs', labels: ['quiet'] },
  },
  devices: {
    lamp_device: { id: 'lamp_device', area_id: 'bedroom', labels: ['night'] },
  },
  labels: {
    night: { label_id: 'night', name: 'Night light' },
    quiet: { label_id: 'quiet', name: 'Quiet' },
  },
  entities: {
    'light.kitchen_ceiling': { entity_id: 'light.kitchen_ceiling', area_id: 'kitchen', labels: [], platform: 'hue' },
    'light.bedside': { entity_id: 'light.bedside', device_id: 'lamp_device', labels: [] },
    'sensor.kitchen_temp': { entity_id: 'sensor.kitchen_temp', area_id: 'kitchen', labels: [], platform: 'zha' },
    'binary_sensor.hall_motion': { entity_id: 'binary_sensor.hall_motion', area_id: 'kitchen', labels: [] },
    'light.secret': { entity_id: 'light.secret', area_id: 'kitchen', labels: [], hidden: true },
  },
  states: {
    'light.kitchen_ceiling': { attributes: { friendly_name: 'Ceiling' } },
    'light.bedside': { attributes: { friendly_name: 'Bedside' } },
    'sensor.kitchen_temp': { attributes: { friendly_name: 'Kitchen temperature', device_class: 'temperature' } },
    'binary_sensor.hall_motion': { attributes: { friendly_name: 'Hall motion', device_class: 'motion' } },
  },
};

const ids = (items) => items.map((item) => item.entity ?? item.area_id);

/* ------------------------------------------------------------- what is a source */

check('a mapping naming a source is one', isRegistrySource({ entities: 'light.*' }), true);

check('a mapping naming only a filter is still one', isRegistrySource({ label: 'night' }), true);

check('a list of written-out items is not one', isRegistrySource([{ entity: 'light.hall' }]), false);

check('a mapping of plain variables is not one', isRegistrySource({ entity: 'light.hall' }), false);

check('nothing at all is not one', [isRegistrySource(undefined), isRegistrySource('lights')], [false, false]);

/* --------------------------------------------------------------- entity sources */

check('every entity, sorted by the name shown', ids(resolveRegistryItems(hass, { entities: '*' })), [
  'light.bedside',
  'light.kitchen_ceiling',
  'binary_sensor.hall_motion',
  'sensor.kitchen_temp',
]);

check('a glob picks a domain out', ids(resolveRegistryItems(hass, { entities: 'light.*' })), [
  'light.bedside',
  'light.kitchen_ceiling',
]);

check('a domain filter does the same thing more plainly', ids(resolveRegistryItems(hass, { domain: 'light' })), [
  'light.bedside',
  'light.kitchen_ceiling',
]);

check(
  'an area filter matches by name as well as by id',
  ids(resolveRegistryItems(hass, { domain: 'light', area: 'Kitchen' })),
  ['light.kitchen_ceiling'],
);

check(
  'an entity inherits the area of its device',
  ids(resolveRegistryItems(hass, { domain: 'light', area: 'bedroom' })),
  ['light.bedside'],
);

check('a floor filter reaches entities through their area', ids(resolveRegistryItems(hass, { floor: 'Upstairs' })), [
  'light.bedside',
]);

check('a label on the device counts as a label on its entities', ids(resolveRegistryItems(hass, { label: 'night' })), [
  'light.bedside',
]);

check('a label matches by its name too', ids(resolveRegistryItems(hass, { label: 'Night light' })), ['light.bedside']);

check('a hidden entity is left out', ids(resolveRegistryItems(hass, { entities: 'light.secret' })), []);

check(
  'a list of patterns is the union of them',
  ids(resolveRegistryItems(hass, { entities: ['sensor.*', 'light.bedside'] })),
  ['light.bedside', 'sensor.kitchen_temp'],
);

check('matching nothing is an empty list, not a mistake', resolveRegistryItems(hass, { domain: 'vacuum' }), []);

check(
  'each copy carries the entity, its name, its domain and its area',
  resolveRegistryItems(hass, { entities: 'light.kitchen_ceiling' }),
  [
    {
      entity: 'light.kitchen_ceiling',
      name: 'Ceiling',
      domain: 'light',
      area: 'Kitchen',
      area_id: 'kitchen',
      total: 1,
    },
  ],
);

check(
  'an entity in no area still produces a copy, with the area left empty',
  resolveRegistryItems({ entities: { 'light.loose': { entity_id: 'light.loose' } }, states: {} }, { domain: 'light' }),
  [{ entity: 'light.loose', name: 'light.loose', domain: 'light', area: '', area_id: '', total: 1 }],
);

/* ----------------------------------------------------------------- area sources */

check('every area, sorted by name', ids(resolveRegistryItems(hass, { areas: true })), ['bedroom', 'kitchen']);

check('a star means the same as true', ids(resolveRegistryItems(hass, { areas: '*' })), ['bedroom', 'kitchen']);

check('areas can be picked by a pattern on their name', ids(resolveRegistryItems(hass, { areas: 'kitch*' })), [
  'kitchen',
]);

check('areas can be narrowed by floor', ids(resolveRegistryItems(hass, { areas: true, floor: 'ground' })), ['kitchen']);

check('areas can be narrowed by their own labels', ids(resolveRegistryItems(hass, { areas: true, label: 'quiet' })), [
  'bedroom',
]);

check('each area copy carries its id, name, icon and floor', resolveRegistryItems(hass, { areas: 'kitchen' }), [
  { area_id: 'kitchen', area: 'Kitchen', area_icon: 'mdi:silverware', floor: 'Ground floor', total: 1 },
]);

check(
  'an area with no icon still produces a copy, with the icon left empty',
  resolveRegistryItems(hass, { areas: 'bedroom' }),
  [{ area_id: 'bedroom', area: 'Bedroom', area_icon: '', floor: 'Upstairs', total: 1 }],
);

/* ------------------------------------------------------- when to work it out again */

check('the same registry is recognised as unchanged', sameRegistry(registryKey(hass), registryKey(hass)), true);

check(
  'a state change alone does not count as a registry change',
  sameRegistry(registryKey(hass), registryKey({ ...hass, states: { 'light.bedside': {} } })),
  true,
);

check(
  'a changed entity registry does count',
  sameRegistry(registryKey(hass), registryKey({ ...hass, entities: { ...hass.entities } })),
  false,
);

check('nothing to compare against is not a match', sameRegistry(undefined, registryKey(hass)), false);

/* --------------------------------------------------- what a source always supplies */

check('an entity source names what every copy gets', registryNames({ domain: 'light' }), [
  'entity',
  'name',
  'domain',
  'area',
  'area_id',
  'total',
]);

check('an area source names its own set', registryNames({ areas: true }), [
  'area_id',
  'area',
  'area_icon',
  'floor',
  'total',
]);

check('something that is not a source supplies nothing', registryNames({ entity: 'light.hall' }), []);

/* -------------------------------------------------------------------- excluding */

check(
  'a pattern says what to leave out',
  ids(resolveRegistryItems(hass, { domain: 'light', exclude: 'light.bedside' })),
  ['light.kitchen_ceiling'],
);

check(
  'a list of patterns leaves all of them out',
  ids(resolveRegistryItems(hass, { entities: '*', exclude: ['light.*', 'binary_sensor.*'] })),
  ['sensor.kitchen_temp'],
);

check(
  'exclude can narrow by anything the source can',
  ids(resolveRegistryItems(hass, { entities: '*', exclude: { area: 'bedroom' } })),
  ['light.kitchen_ceiling', 'binary_sensor.hall_motion', 'sensor.kitchen_temp'],
);

check(
  'what to leave out wins over what to take in',
  ids(resolveRegistryItems(hass, { entities: 'light.*', exclude: 'light.*' })),
  [],
);

check('areas are excluded by their own name', ids(resolveRegistryItems(hass, { areas: true, exclude: 'bedroom' })), [
  'kitchen',
]);

/* ------------------------------------------------------- device class and integration */

check(
  'a device class picks one kind of sensor out',
  ids(resolveRegistryItems(hass, { domain: 'binary_sensor', device_class: 'motion' })),
  ['binary_sensor.hall_motion'],
);

check(
  'a device class that nothing reports matches nothing',
  ids(resolveRegistryItems(hass, { device_class: 'smoke' })),
  [],
);

check('an integration picks out what one thing provides', ids(resolveRegistryItems(hass, { integration: 'hue' })), [
  'light.kitchen_ceiling',
]);

/* ------------------------------------------------------------------ order and limit */

check(
  'the default order is the name shown',
  resolveRegistryItems(hass, { domain: 'light' }).map((i) => i.name),
  ['Bedside', 'Ceiling'],
);

check(
  'sorting by entity id orders by the id instead',
  ids(resolveRegistryItems(hass, { domain: 'light', sort: 'entity' })),
  ['light.bedside', 'light.kitchen_ceiling'],
);

check(
  'reverse turns whatever order was chosen around',
  resolveRegistryItems(hass, { domain: 'light', reverse: true }).map((i) => i.name),
  ['Ceiling', 'Bedside'],
);

check(
  'sort none keeps the registry order rather than guessing',
  resolveRegistryItems(hass, { domain: 'light', sort: 'none' }).length,
  2,
);

/* ---------------------------------------------------- sort by a carried key */

check(
  'a sort not in the list is read as a key the items carry',
  ids(resolveRegistryItems(hass, { domain: 'light', sort: 'area_id' })),
  ['light.bedside', 'light.kitchen_ceiling'],
);

check(
  'a key no item carries changes nothing, so sort total is harmless',
  ids(resolveRegistryItems(hass, { domain: 'light', sort: 'total' })),
  ids(resolveRegistryItems(hass, { domain: 'light' })),
);

// Three areas whose alphabetical order (Attic, Cellar, Garage) differs from their entity
// counts (2, 10, 9), so a carried-key sort is distinguishable from the default - and 9
// against 10 tells a numeric comparison from a lexicographic one, which would put "10"
// first.
const countedHass = {
  floors: {},
  areas: {
    attic: { area_id: 'attic', name: 'Attic', labels: [] },
    cellar: { area_id: 'cellar', name: 'Cellar', labels: [] },
    garage: { area_id: 'garage', name: 'Garage', labels: [] },
  },
  devices: {},
  labels: {},
  entities: Object.fromEntries(
    [
      ['attic', 2],
      ['cellar', 10],
      ['garage', 9],
    ].flatMap(([area, count]) =>
      Array.from({ length: count }, (_, i) => [
        `sensor.${area}_${i}`,
        { entity_id: `sensor.${area}_${i}`, area_id: area, labels: [] },
      ]),
    ),
  ),
  states: {},
};

check(
  'a grouped repeat can order by how much each area holds, numerically',
  resolveRegistryItems(countedHass, { areas: true, with: { domain: 'sensor' }, sort: 'entity_count' }).map(
    (a) => a.area_id,
  ),
  ['attic', 'garage', 'cellar'],
);

check('a limit takes the first few', ids(resolveRegistryItems(hass, { entities: '*', limit: 2 })).length, 2);

check(
  'total counts what matched, not what was kept, so a card can say 2 of 4',
  resolveRegistryItems(hass, { entities: '*', limit: 2 }).map((i) => i.total),
  [4, 4],
);

check('a limit of zero is a repeat of nothing', resolveRegistryItems(hass, { entities: '*', limit: 0 }), []);

/* ------------------------------------------------------------------------- range */

check('a range repeats a fixed number of times', resolveRegistryItems(hass, { range: 3 }).length, 3);

check('every copy of a range knows the total', resolveRegistryItems(hass, { range: 3 }), [
  { total: 3 },
  { total: 3 },
  { total: 3 },
]);

check('a range of nothing is nothing', resolveRegistryItems(hass, { range: 0 }), []);

check('a range supplies only the total', registryNames({ range: 3 }), ['total']);

check('an entity source now supplies the total too', registryNames({ domain: 'light' }).includes('total'), true);

/* ------------------------------------------------- a copy per area, knowing what is in it */

check(
  'each area is given the entities inside it',
  resolveRegistryItems(hass, { areas: true, with: { domain: 'light' } }).map((a) => [a.area_id, a.entities]),
  [
    ['bedroom', ['light.bedside']],
    ['kitchen', ['light.kitchen_ceiling']],
  ],
);

check(
  'the count comes with them',
  resolveRegistryItems(hass, { areas: true, with: { domain: 'light' } }).map((a) => a.entity_count),
  [1, 1],
);

check(
  'items carries the whole mapping, ready for a nested repeat',
  resolveRegistryItems(hass, { areas: 'kitchen', with: { domain: 'light' } })[0].items,
  [{ entity: 'light.kitchen_ceiling', name: 'Ceiling', domain: 'light', area: 'Kitchen', area_id: 'kitchen' }],
);

check(
  'an area with nothing in it is left out',
  resolveRegistryItems(hass, { areas: true, with: { domain: 'vacuum' } }),
  [],
);

check(
  'unless the card asks to keep it, so it can say there is nothing here',
  resolveRegistryItems(hass, { areas: true, with: { domain: 'vacuum', keep_empty: true } }).map((a) => [
    a.area_id,
    a.entity_count,
  ]),
  [
    ['bedroom', 0],
    ['kitchen', 0],
  ],
);

check(
  'the area being grouped wins over any area the gathering names',
  resolveRegistryItems(hass, { areas: 'kitchen', with: { domain: 'light', area: 'bedroom' } })[0].entities,
  ['light.kitchen_ceiling'],
);

check('a grouped source supplies the gathered names too', registryNames({ areas: true, with: { domain: 'light' } }), [
  'area_id',
  'area',
  'area_icon',
  'floor',
  'total',
  'items',
  'entities',
  'entity_count',
]);

check('an area source without gathering supplies only its own', registryNames({ areas: true }), [
  'area_id',
  'area',
  'area_icon',
  'floor',
  'total',
]);

report();
