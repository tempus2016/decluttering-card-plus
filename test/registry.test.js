/*
 * Unit tests for src/registry.ts - turning "every light in the kitchen" into the list of
 * copies a template is repeated over. Run with `npm test`.
 */
const {
  globMatches,
  isRegistrySource,
  resolveRegistryItems,
  registryKey,
  registryNames,
  sameRegistry,
} = require('../.test-build/registry.js');

const { check } = require('./check');

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

check('a hidden entity is left out of a sweep', ids(resolveRegistryItems(hass, { entities: 'light.*' })), [
  'light.bedside',
  'light.kitchen_ceiling',
]);

check('a hidden entity named outright is kept', ids(resolveRegistryItems(hass, { entities: 'light.secret' })), [
  'light.secret',
]);

check(
  'named outright means without a star, whatever the case it was written in',
  ids(resolveRegistryItems(hass, { entities: ['Light.Secret', 'light.secr*'] })),
  ['light.secret'],
);

check(
  'include_hidden brings hidden entities back into a sweep',
  ids(resolveRegistryItems(hass, { domain: 'light', include_hidden: true })),
  ['light.bedside', 'light.kitchen_ceiling', 'light.secret'],
);

/* ---------------------------------------------- diagnostic and config entities */

// A plug with the extras integrations hang off a device: a diagnostic sensor and a config switch.
const plugHass = {
  floors: {},
  areas: {},
  devices: {},
  entities: {
    'switch.plug': { entity_id: 'switch.plug' },
    'sensor.plug_rssi': { entity_id: 'sensor.plug_rssi', entity_category: 'diagnostic' },
    'switch.plug_led': { entity_id: 'switch.plug_led', entity_category: 'config' },
    'button.plug_identify': { entity_id: 'button.plug_identify', entity_category: 'config', hidden: true },
  },
  states: {},
};
const plugIds = (source) => ids(resolveRegistryItems(plugHass, { ...source, sort: 'entity' }));

check('diagnostic and config entities are left out by default', plugIds({ entities: '*plug*' }), ['switch.plug']);

check(
  'entity_category: diagnostic also keeps diagnostic ones',
  plugIds({ entities: '*', entity_category: 'diagnostic' }),
  ['sensor.plug_rssi', 'switch.plug'],
);

check(
  'a list of categories keeps each of them',
  plugIds({ entities: '*', entity_category: ['diagnostic', 'config'] }),
  ['sensor.plug_rssi', 'switch.plug', 'switch.plug_led'],
);

check('entity_category: all keeps every category', plugIds({ entities: '*', entity_category: 'all' }), [
  'sensor.plug_rssi',
  'switch.plug',
  'switch.plug_led',
]);

check(
  'a hidden config entity needs both opt-ins',
  [
    plugIds({ entities: '*', entity_category: 'all' }).includes('button.plug_identify'),
    plugIds({ entities: '*', entity_category: 'all', include_hidden: true }).includes('button.plug_identify'),
  ],
  [false, true],
);

check('a diagnostic entity named outright is kept', plugIds({ entities: ['switch.plug', 'sensor.plug_rssi'] }), [
  'sensor.plug_rssi',
  'switch.plug',
]);

check(
  'the same applies to what a device gathers',
  resolveRegistryItems(
    {
      ...plugHass,
      devices: { plug: { id: 'plug', name: 'Plug', labels: [] } },
      entities: Object.fromEntries(
        Object.entries(plugHass.entities).map(([id, entity]) => [id, { ...entity, device_id: 'plug' }]),
      ),
    },
    { devices: true, with: { entities: '*' } },
  ).map((device) => device.entities),
  [['switch.plug']],
);

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

/* ------------------------------------------------------------ unit and state_class */

// Energy meters in two units and a power sensor, the case a unit filter is for.
const meterHass = {
  floors: {},
  areas: {},
  devices: {},
  entities: {
    'sensor.grid_import': { entity_id: 'sensor.grid_import' },
    'sensor.solar_wh': { entity_id: 'sensor.solar_wh' },
    'sensor.house_power': { entity_id: 'sensor.house_power' },
    'sensor.mega': { entity_id: 'sensor.mega' },
    'sensor.no_state': { entity_id: 'sensor.no_state' },
  },
  states: {
    'sensor.grid_import': { attributes: { unit_of_measurement: 'kWh', state_class: 'total_increasing' } },
    'sensor.solar_wh': { attributes: { unit_of_measurement: 'Wh', state_class: 'total' } },
    'sensor.house_power': { attributes: { unit_of_measurement: 'mW', state_class: 'measurement' } },
    'sensor.mega': { attributes: { unit_of_measurement: 'MW', state_class: 'measurement' } },
  },
};
const meterIds = (source) => ids(resolveRegistryItems(meterHass, { ...source, sort: 'entity' }));

check('unit narrows to one unit', meterIds({ unit: 'kWh' }), ['sensor.grid_import']);

check('a list of units is either of them', meterIds({ unit: ['kWh', 'Wh'] }), [
  'sensor.grid_import',
  'sensor.solar_wh',
]);

check('a unit is matched exactly, so mW is not MW', meterIds({ unit: 'mW' }), ['sensor.house_power']);

check('unit on its own is a source', isRegistrySource({ unit: 'kWh' }), true);

check('state_class narrows the same way', meterIds({ state_class: 'measurement' }), [
  'sensor.house_power',
  'sensor.mega',
]);

check('a list of state classes is either of them', meterIds({ state_class: ['total', 'total_increasing'] }), [
  'sensor.grid_import',
  'sensor.solar_wh',
]);

check('both together narrow by both', meterIds({ unit: ['kWh', 'Wh'], state_class: 'total_increasing' }), [
  'sensor.grid_import',
]);

check('an entity with no state matches neither', meterIds({ entities: 'sensor.no_state', unit: 'kWh' }), []);

check('exclude takes a unit too', meterIds({ domain: 'sensor', exclude: { unit: ['mW', 'MW'] } }), [
  'sensor.grid_import',
  'sensor.no_state',
  'sensor.solar_wh',
]);

check('registryNames still names an entity copy', registryNames({ unit: 'kWh' }).includes('entity'), true);

/* ------------------------------------------------------------------- views */

// A dashboard's views as its configuration lists them: one without a path, one subview.
const dashboard = {
  dashboard: 'dashboard-home',
  views: [
    { title: 'Home', path: 'home', icon: 'mdi:home' },
    { title: 'Lights', path: 'lights' },
    { path: 'energy', icon: 'mdi:lightning-bolt' },
    { title: 'Untitled and unpathed' },
    { title: 'Boiler details', path: 'boiler', subview: true },
  ],
};
const viewPaths = (source, context = dashboard) => resolveRegistryItems({}, source, context).map((item) => item.path);

check("views: true is one copy per view, in the dashboard's order, subviews left out", viewPaths({ views: true }), [
  'home',
  'lights',
  'energy',
  '3',
]);

check(
  'each copy has what a navigation button needs',
  resolveRegistryItems({}, { views: true }, dashboard).slice(0, 3),
  [
    { name: 'Home', path: 'home', navigation_path: '/dashboard-home/home', icon: 'mdi:home', view_index: 0, total: 4 },
    { name: 'Lights', path: 'lights', navigation_path: '/dashboard-home/lights', icon: '', view_index: 1, total: 4 },
    {
      name: 'energy',
      path: 'energy',
      navigation_path: '/dashboard-home/energy',
      icon: 'mdi:lightning-bolt',
      view_index: 2,
      total: 4,
    },
  ],
);

check(
  'a view with no path is reached by its position',
  resolveRegistryItems({}, { views: 'Untitled*' }, dashboard).map((item) => item.navigation_path),
  ['/dashboard-home/3'],
);

check('subviews: true keeps subviews', viewPaths({ views: true, subviews: true }), [
  'home',
  'lights',
  'energy',
  '3',
  'boiler',
]);

check('patterns narrow by title or path', viewPaths({ views: ['Home', 'energy'] }), ['home', 'energy']);

check('exclude leaves views out by title or path', viewPaths({ views: true, exclude: ['Lights', '3'] }), [
  'home',
  'energy',
]);

check('sort orders views only when asked', viewPaths({ views: true, sort: 'name' }), ['energy', 'home', 'lights', '3']);

check('limit, offset and reverse work as elsewhere', viewPaths({ views: true, offset: 1, limit: 2, reverse: true }), [
  'energy',
  'lights',
]);

check(
  'overrides match a view by path or title',
  resolveRegistryItems(
    {},
    { views: true, overrides: { Lights: { icon: 'mdi:lamp' }, home: { name: 'Start' } } },
    dashboard,
  )
    .slice(0, 2)
    .map((item) => [item.name, item.icon]),
  [
    ['Start', 'mdi:home'],
    ['Lights', 'mdi:lamp'],
  ],
);

check('require drops views missing a value', viewPaths({ views: true, require: 'icon' }), ['home', 'energy']);

check(
  'the default dashboard is lovelace',
  resolveRegistryItems({}, { views: 'home' }, { views: dashboard.views }).map((item) => item.navigation_path),
  ['/lovelace/home'],
);

check('no dashboard to read is no copies', resolveRegistryItems({}, { views: true }), []);

check('a views source names its variables', registryNames({ views: true }), [
  'name',
  'path',
  'navigation_path',
  'icon',
  'view_index',
  'total',
]);

check(
  'a view title shaped like a placeholder renders as that text',
  resolveRegistryItems({}, { views: true }, { views: [{ title: '[[x]]', path: 'p' }] })[0].name.startsWith('[[x]]'),
  false,
);

/* ------------------------------------------------------------------- require */

// Two lights, one of them in no area, for skipping copies whose key is empty.
const looseHass = {
  entities: {
    'light.placed': { entity_id: 'light.placed', area_id: 'kitchen' },
    'light.loose': { entity_id: 'light.loose' },
  },
  areas: { kitchen: { area_id: 'kitchen', name: 'Kitchen', labels: [] } },
  states: {},
};

check(
  'require skips a copy whose key came out empty',
  ids(resolveRegistryItems(looseHass, { domain: 'light', require: 'area' })),
  ['light.placed'],
);

check(
  'require can name more than one key',
  ids(resolveRegistryItems(looseHass, { domain: 'light', require: ['area', 'name'] })),
  ['light.placed'],
);

check(
  'require of a key nothing carries keeps nothing',
  resolveRegistryItems(looseHass, { domain: 'light', require: 'floor' }),
  [],
);

check(
  'total counts what require kept, not what matched',
  resolveRegistryItems(looseHass, { domain: 'light', require: 'area' })[0].total,
  1,
);

/* ----------------------------------------------------------------- overrides */

check(
  'an override gives one copy different variables without excluding it',
  resolveRegistryItems(hass, {
    domain: 'light',
    overrides: { 'light.bedside': { icon: 'mdi:bed', name: 'Reading light' } },
  }).map((i) => [i.entity, i.name, i.icon]),
  [
    ['light.kitchen_ceiling', 'Ceiling', undefined],
    ['light.bedside', 'Reading light', 'mdi:bed'],
  ],
);

check(
  'an override key is a pattern, like everything else here',
  resolveRegistryItems(hass, { domain: 'light', overrides: { 'light.*': { row: 'compact' } } }).map((i) => i.row),
  ['compact', 'compact'],
);

check(
  'an override that renames also re-sorts, since the shown order is by name',
  resolveRegistryItems(hass, { domain: 'light', overrides: { 'light.kitchen_ceiling': { name: 'A ceiling' } } }).map(
    (i) => i.entity,
  ),
  ['light.kitchen_ceiling', 'light.bedside'],
);

check(
  'an area copy is overridden by its area id',
  resolveRegistryItems(hass, { areas: true, overrides: { bedroom: { icon: 'mdi:sleep' } } }).map((i) => i.icon),
  ['mdi:sleep', undefined],
);

check(
  'an area copy is overridden by its name too',
  resolveRegistryItems(hass, { areas: true, overrides: { Bedroom: { icon: 'mdi:sleep' } } }).map((i) => i.icon),
  ['mdi:sleep', undefined],
);

check(
  'a device copy is overridden by its own id, not its area',
  [
    resolveRegistryItems(hass, { devices: true, overrides: { lamp_device: { icon: 'mdi:lamp' } } }).map((i) => i.icon),
    resolveRegistryItems(hass, { devices: true, overrides: { bedroom: { icon: 'mdi:lamp' } } }).map((i) => i.icon),
  ],
  [['mdi:lamp'], [undefined]],
);

check(
  'a floor copy is overridden by its id or name',
  resolveRegistryItems(hass, { floors: true, overrides: { ground: { a: 1 }, Upstairs: { a: 2 } } }).map((i) => [
    i.floor_id,
    i.a,
  ]),
  [
    ['ground', 1],
    ['upstairs', 2],
  ],
);

check(
  'a label copy is overridden by its id or name',
  resolveRegistryItems(hass, { labels: true, overrides: { night: { a: 1 }, Quiet: { a: 2 } } }).map((i) => [
    i.label_id,
    i.a,
  ]),
  [
    ['night', 1],
    ['quiet', 2],
  ],
);

check(
  'a group_by copy is overridden by its group',
  resolveRegistryItems(hass, { domain: 'light', group_by: 'domain', overrides: { light: { a: 1 } } }).map((i) => i.a),
  [1],
);

/* ------------------------------------------------------------------- group_by */

check(
  'group_by domain gives one copy per domain, counting what is in it',
  resolveRegistryItems(hass, { entities: '*', group_by: 'domain' }).map((g) => [g.group, g.entity_count]),
  [
    ['binary_sensor', 1],
    ['light', 2],
    ['sensor', 1],
  ],
);

check(
  'a group carries its members, ids and items both',
  resolveRegistryItems(hass, { entities: '*', group_by: 'domain' })[1].entities,
  ['light.bedside', 'light.kitchen_ceiling'],
);

check(
  'group_by floor reaches the floor through each entity area',
  resolveRegistryItems(hass, { entities: '*', group_by: 'floor' }).map((g) => [g.name, g.entity_count]),
  [
    ['Ground floor', 3],
    ['Upstairs', 1],
  ],
);

check(
  'group_by label reads labels off the entity and its device, named from the registry',
  resolveRegistryItems(hass, { entities: '*', group_by: 'label' }).map((g) => [g.group, g.name, g.entity_count]),
  [['night', 'Night light', 1]],
);

check(
  'groups order by a carried key like any other copies, busiest first',
  resolveRegistryItems(hass, { entities: '*', group_by: 'domain', sort: '-entity_count' })[0].group,
  'light',
);

/* --------------------------------------------------------------- device sources */

// Two devices: a named plug in the kitchen, and a renamed motion sensor with a label.
const deviceHass = {
  devices: {
    d1: { id: 'd1', name: 'Zigbee Plug', area_id: 'kitchen', labels: [], manufacturer: 'Tuya', model: 'TS011F' },
    d2: { id: 'd2', name: 'Motion Sensor', name_by_user: 'Hall Motion', labels: ['night'] },
  },
  areas: { kitchen: { area_id: 'kitchen', name: 'Kitchen', labels: [] } },
  labels: { night: { label_id: 'night', name: 'Night light' } },
  floors: {},
  entities: {
    'switch.plug': { entity_id: 'switch.plug', device_id: 'd1' },
    'binary_sensor.hall': { entity_id: 'binary_sensor.hall', device_id: 'd2' },
  },
  states: {},
};

check(
  'a copy per device, named as the user did, sorted by that name',
  resolveRegistryItems(deviceHass, { devices: true }).map((d) => [d.device_id, d.device, d.area]),
  [
    ['d2', 'Hall Motion', ''],
    ['d1', 'Zigbee Plug', 'Kitchen'],
  ],
);

check(
  'devices narrow by name pattern',
  resolveRegistryItems(deviceHass, { devices: 'Zigbee*' }).map((d) => d.device_id),
  ['d1'],
);

check(
  'devices narrow by label like everything else',
  resolveRegistryItems(deviceHass, { devices: '*', label: 'night' }).map((d) => d.device_id),
  ['d2'],
);

check(
  'a device gathers its own entities, and one with none of the asked-for kind goes',
  resolveRegistryItems(deviceHass, { devices: '*', with: { domain: 'switch' } }).map((d) => [d.device_id, d.entities]),
  [['d1', ['switch.plug']]],
);

check(
  'a device copy carries manufacturer and model for the hardware-minded',
  resolveRegistryItems(deviceHass, { devices: 'Zigbee*' })[0].manufacturer,
  'Tuya',
);

/* -------------------------------------------------------- floor and label sources */

check(
  'a copy per floor, knowing its level, sorted by name',
  resolveRegistryItems(hass, { floors: true }).map((f) => [f.floor_id, f.floor]),
  [
    ['ground', 'Ground floor'],
    ['upstairs', 'Upstairs'],
  ],
);

check(
  'a floor gathers the entities on it, through their areas',
  resolveRegistryItems(hass, { floors: 'Ground*', with: { domain: 'light' } })[0].entities,
  ['light.kitchen_ceiling'],
);

check(
  'a floor with none of the asked-for kind goes, like an empty area',
  resolveRegistryItems(hass, { floors: true, with: { domain: 'sensor' } }).map((f) => f.floor_id),
  ['ground'],
);

check(
  'a copy per label, named from the registry',
  resolveRegistryItems(hass, { labels: true }).map((l) => [l.label_id, l.label]),
  [
    ['night', 'Night light'],
    ['quiet', 'Quiet'],
  ],
);

check(
  'a label gathers what carries it, device labels counting for their entities',
  resolveRegistryItems(hass, { labels: 'night', with: {} })[0].entities,
  ['light.bedside'],
);

check(
  'labels still repeat when hass has no label registry, named by their id',
  resolveRegistryItems(
    {
      entities: {
        'light.a': { entity_id: 'light.a', labels: ['night'] },
        'light.b': { entity_id: 'light.b', labels: [] },
      },
      areas: {},
      states: {},
    },
    { labels: true, with: {} },
  ).map((l) => [l.label, l.entity_count]),
  [['night', 1]],
);

check(
  'a label nothing of the asked-for kind carries goes',
  resolveRegistryItems(hass, { labels: true, with: { domain: 'light' } }).map((l) => l.label_id),
  ['night'],
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

// `constructor` read straight off SORTS answers with Object, whose return value has no
// localeCompare - the sort threw rather than falling through to a carried key.
check(
  'a sort named after an inherited property is a carried key, not a comparator',
  ids(resolveRegistryItems(hass, { domain: 'light', sort: 'constructor' })),
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

check(
  'a leading minus turns one key around, busiest first',
  resolveRegistryItems(countedHass, { areas: true, with: { domain: 'sensor' }, sort: '-entity_count' }).map(
    (a) => a.area_id,
  ),
  ['cellar', 'garage', 'attic'],
);

check(
  'minus works on a listed sort too',
  resolveRegistryItems(hass, { domain: 'light', sort: '-name' }).map((i) => i.name),
  ['Ceiling', 'Bedside'],
);

check(
  'a list of keys sorts by the first and breaks ties with the next',
  ids(resolveRegistryItems(countedHass, { domain: 'sensor', sort: ['area_id', '-entity'], limit: 2 })),
  ['sensor.attic_1', 'sensor.attic_0'],
);

// Three temperatures whose numeric order (3 < 19 < 21.5) disagrees with their names.
const temperaturesHass = {
  entities: {
    'sensor.hall': { entity_id: 'sensor.hall' },
    'sensor.attic': { entity_id: 'sensor.attic' },
    'sensor.porch': { entity_id: 'sensor.porch' },
  },
  areas: {},
  states: {
    'sensor.hall': { attributes: { temperature: 21.5 } },
    'sensor.attic': { attributes: { temperature: 19 } },
    'sensor.porch': { attributes: { temperature: 3 } },
  },
};

check(
  'sort attr reads an attribute at build time, coldest first',
  ids(resolveRegistryItems(temperaturesHass, { domain: 'sensor', sort: 'attr:temperature' })),
  ['sensor.porch', 'sensor.attic', 'sensor.hall'],
);

check(
  'and minus attr is warmest first',
  ids(resolveRegistryItems(temperaturesHass, { domain: 'sensor', sort: '-attr:temperature' })),
  ['sensor.hall', 'sensor.attic', 'sensor.porch'],
);

check(
  'an entity without the attribute sorts ahead as empty, not on top as zero',
  ids(
    resolveRegistryItems(
      { ...temperaturesHass, states: { ...temperaturesHass.states, 'sensor.hall': { attributes: {} } } },
      { domain: 'sensor', sort: 'attr:temperature' },
    ),
  )[0],
  'sensor.hall',
);

check('a limit takes the first few', ids(resolveRegistryItems(hass, { entities: '*', limit: 2 })).length, 2);

check(
  'offset skips the first few, so two cards can split one list',
  ids(resolveRegistryItems(hass, { entities: '*', offset: 1, limit: 2 })),
  ids(resolveRegistryItems(hass, { entities: '*' })).slice(1, 3),
);

check('offset past the end keeps nothing', resolveRegistryItems(hass, { entities: '*', offset: 99 }), []);

check(
  'total ignores offset like it ignores limit, so every window says the same of-how-many',
  resolveRegistryItems(hass, { entities: '*', offset: 1, limit: 1 })[0].total,
  resolveRegistryItems(hass, { entities: '*' }).length,
);

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

/* --------------------------------------------------- crafted patterns cannot hang */

// Runs of `*` are folded to one, so a pattern like `**********z` no longer compiles to
// `.*.*.*...` and backtracks for the better part of a minute against a subject that never
// matches. It returns - empty - straight away. That this completes at all is the test.
check(
  'a pattern of many wildcards returns rather than hanging',
  resolveRegistryItems(hass, { entities: '**********z' }),
  [],
);

// Folding the wildcards must not change what a pattern matches: `light.****` still means
// every light, the same as `light.*`.
check(
  'collapsed wildcards still match what they should',
  resolveRegistryItems(hass, { entities: 'light.****' }).map((item) => item.entity),
  ['light.bedside', 'light.kitchen_ceiling'],
);

// range is clamped, so `range: 1000000000` cannot allocate a billion copies and hang the
// tab before one is drawn.
check('a modest range is honoured as written', resolveRegistryItems(hass, { range: 5 }).length, 5);
check('an enormous range is clamped', resolveRegistryItems(hass, { range: 1000000000 }).length, 1000);

/* ------------------------------------------- names from the registry are text, not code */

const deepReplace = require('../.test-build/deep-replace.js').default;
const { forEachVariables } = require('../.test-build/variables.js');

const spoofHass = {
  floors: {},
  areas: {},
  devices: {
    evil: {
      id: 'evil',
      name_by_user: '[[model|trim|json|bool]]',
      name: 'x',
      model: 'true, "type": "iframe", "url": "https://evil.example/"',
      manufacturer: 'm',
      labels: [],
    },
  },
  labels: {},
  entities: {},
  states: {},
};

const spoofed = resolveRegistryItems(spoofHass, { devices: true }).map((item) =>
  deepReplace(forEachVariables(item, undefined, 0, 1), {}, { type: 'tile', name: '[[name]]' }),
);
check('a device name shaped like a placeholder renders as that text', spoofed, [
  { type: 'tile', name: '[[model|trim|json|bool]]' },
]);

{
  // sun.sun has a state but no registry entry - no unique id - so it is not in hass.entities.
  const NO_ENTRY = {
    entities: { 'light.kitchen': { entity_id: 'light.kitchen' } },
    states: {
      'light.kitchen': { state: 'on', attributes: { friendly_name: 'Kitchen' } },
      'sun.sun': { state: 'above_horizon', attributes: { friendly_name: 'Sun' } },
    },
    devices: {},
    areas: {},
    floors: {},
  };
  const named = (source) => resolveRegistryItems(NO_ENTRY, source).map((item) => item.entity);
  check('an id named outright is kept even with no registry entry', named({ entities: ['light.kitchen', 'sun.sun'] }), [
    'light.kitchen',
    'sun.sun',
  ]);
  check('the other filters still apply to it', named({ entities: ['light.kitchen', 'sun.sun'], domain: 'light' }), [
    'light.kitchen',
  ]);
  check('one with no state either is not', named({ entities: ['sun.sun', 'nothing.here'] }), ['sun.sun']);
  check('and a pattern still only sweeps the registry', named({ entities: 'sun.*' }), []);
}

// Review 2026-10-18. Folding adjacent stars was not enough: `*a*a*a*z` still backtracks
// polynomially against a run of a's. The matcher is linear now, so this returns at once.
const slowStart = Date.now();
check(
  'a pattern of alternating wildcards returns rather than hanging',
  globMatches('a'.repeat(200), '*a*a*a*a*a*a*a*a*a*a*z'),
  false,
);
check('and does so in linear time', Date.now() - slowStart < 100, true);
check(
  'the walk matches what it should',
  [
    globMatches('light.hall', 'light.*'),
    globMatches('light.hall', '*'),
    globMatches('light.hall', '*.hall'),
    globMatches('light.hall', 'l*t.h*l'),
    globMatches('light.hall', 'light.hall'),
    globMatches('light.hall', 'LIGHT.HALL'),
    globMatches('light.hall', '***'),
    globMatches('', '*'),
    globMatches('', ''),
    globMatches('light.hall', 'light.hal'),
    globMatches('light.hall', 'ight.*'),
    globMatches('light.hall', '*x*'),
    globMatches('light.hall', ''),
  ],
  [true, true, true, true, true, true, true, true, true, false, false, false, false],
);
check(
  'the linear matcher still matches as the regexp did: anchored, case-blind, any run of stars',
  resolveRegistryItems(hass, { entities: ['L*T.B*E', 'light.**_ceiling'] }).map((item) => item.entity),
  ['light.bedside', 'light.kitchen_ceiling'],
);
check(
  'a star in the middle does not match across nothing when the ends are wrong',
  resolveRegistryItems(hass, { entities: 'ight.*' }),
  [],
);
