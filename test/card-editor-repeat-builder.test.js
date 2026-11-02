/*
 * Ideas 15 and 46: the repeat builder. Pure: which for_each_from shapes the form can draw,
 * what it shows for one, what it writes back, and the hand-written list's helpers.
 */
const { check } = require('./check');
const {
  sourceKind,
  isDrawableSource,
  repeatData,
  applyRepeat,
  repeatBuilderSchema,
  repeatMode,
  withRepeatMode,
  knownDomains,
  knownDeviceClasses,
  knownIntegrations,
  listItemLabel,
  withListItem,
  withoutListItem,
  withNewListItem,
} = require('../.test-build/card-editor/repeat-builder');

// --- what the form can draw

check(
  'entities with filters is drawable',
  isDrawableSource({ entities: true, domain: 'light', area: ['Kitchen', 'Hallway'] }),
  true,
);
check('areas is drawable', sourceKind({ areas: true }), 'areas');
check('views of the dashboard is drawable', sourceKind({ views: true }), 'views');
check(
  'a Jinja template source is not',
  isDrawableSource({ template: '{{ states.light | map(attribute="entity_id") | list }}' }),
  false,
);
check('a range is not', isDrawableSource({ range: 5 }), false);
check(
  'an exclude written as a mapping is not',
  isDrawableSource({ entities: true, exclude: { domain: 'switch' } }),
  false,
);
check(
  'an area source gathering entities with with: is not',
  isDrawableSource({ areas: true, with: { domain: 'light' } }),
  false,
);
check('not a source at all', sourceKind({ sort: 'name' }), undefined);
check('undefined is not drawable', isDrawableSource(undefined), false);

// --- the mode dropdown

check('no repeat', repeatMode({ template: 't' }), 'none');
check('a hand-written list', repeatMode({ template: 't', for_each: [{ entity: 'light.a' }] }), 'list');
check(
  'a registry source names its collection',
  repeatMode({ template: 't', for_each_from: { entities: true, domain: 'light' } }),
  'entities',
);
check(
  'a source the form cannot draw is its own mode',
  repeatMode({ template: 't', for_each_from: { template: '{{ [] }}' } }),
  'other',
);

check(
  'switching to a list starts an empty list',
  withRepeatMode({ template: 't', for_each_from: { areas: true } }, 'list'),
  {
    template: 't',
    for_each: [],
  },
);
check(
  'switching to areas writes areas: true and drops the list',
  withRepeatMode({ template: 't', for_each: [{ entity: 'x' }] }, 'areas'),
  {
    template: 't',
    for_each_from: { areas: true },
  },
);
check(
  'switching collections keeps the filters and the order',
  withRepeatMode(
    { template: 't', for_each_from: { entities: true, domain: 'light', sort: 'name', limit: 3 } },
    'devices',
  ).for_each_from,
  { devices: true, domain: 'light', sort: 'name', limit: 3 },
);
check(
  'switching to none removes both keys',
  withRepeatMode({ template: 't', for_each: [{}], for_each_from: { areas: true }, columns: 2 }, 'none'),
  {
    template: 't',
    columns: 2,
  },
);
check(
  'switching to the same mode changes nothing',
  withRepeatMode({ template: 't', for_each_from: { areas: true } }, 'areas'),
  {
    template: 't',
    for_each_from: { areas: true },
  },
);

// --- what the form shows

check('an all-entities source shows no patterns', repeatData({ entities: true }), {
  patterns: [],
  reverse: false,
  entity_category: false,
});
check(
  'every drawn key is read',
  repeatData({
    entities: ['light.*', 'switch.a'],
    domain: 'light',
    area: ['Kitchen', 'Hallway'],
    floor: 'ground',
    label: 'outdoor',
    device_class: ['motion'],
    integration: 'hue',
    exclude: 'light.kitchen_display_backlight',
    sort: ['area', '-name'],
    reverse: true,
    limit: 12,
    offset: 2,
    group_by: 'area',
    entity_category: 'all',
  }),
  {
    patterns: ['light.*', 'switch.a'],
    domain: ['light'],
    area: ['Kitchen', 'Hallway'],
    floor: ['ground'],
    label: ['outdoor'],
    device_class: ['motion'],
    integration: ['hue'],
    exclude: ['light.kitchen_display_backlight'],
    sort: 'area',
    then: '-name',
    reverse: true,
    limit: 12,
    offset: 2,
    group_by: 'area',
    entity_category: true,
  },
);
check('a single sort key has no second', repeatData({ areas: true, sort: 'name' }).then, undefined);
check(
  'a diagnostic list counts as on',
  repeatData({ entities: true, entity_category: ['diagnostic'] }).entity_category,
  true,
);

// --- what it writes

check(
  'the form writes the same keys a hand would',
  applyRepeat(
    { entities: true },
    {
      patterns: [],
      domain: ['light'],
      area: ['Kitchen', 'Hallway'],
      exclude: ['light.kitchen_display_backlight'],
      sort: 'name',
      reverse: false,
      limit: undefined,
      entity_category: false,
    },
  ),
  {
    entities: true,
    domain: 'light',
    area: ['Kitchen', 'Hallway'],
    exclude: 'light.kitchen_display_backlight',
    sort: 'name',
  },
);
check(
  'patterns replace true',
  applyRepeat({ areas: true }, { patterns: ['Kitchen', 'Hall*'], reverse: false, entity_category: false }),
  { areas: ['Kitchen', 'Hall*'] },
);
check(
  'a second sort key makes a list',
  applyRepeat({ entities: true }, { patterns: [], sort: 'area', then: '-name', reverse: false, entity_category: false })
    .sort,
  ['area', '-name'],
);
check(
  'a second key with no first is the only key',
  applyRepeat({ entities: true }, { patterns: [], then: 'name', reverse: false, entity_category: false }).sort,
  'name',
);
check(
  'keys the form does not draw are kept exactly',
  applyRepeat(
    {
      entities: true,
      domain: 'light',
      overrides: { 'light.a': { icon: 'mdi:x' } },
      require: 'area',
      unit: 'kWh',
      state_class: 'total',
      include_hidden: true,
    },
    { patterns: [], domain: ['light', 'switch'], reverse: false, entity_category: false },
  ),
  {
    entities: true,
    domain: ['light', 'switch'],
    overrides: { 'light.a': { icon: 'mdi:x' } },
    require: 'area',
    unit: 'kWh',
    state_class: 'total',
    include_hidden: true,
  },
);
check(
  'entity_category on writes all',
  applyRepeat({ entities: true }, { patterns: [], reverse: false, entity_category: true }).entity_category,
  'all',
);
check(
  'entity_category off removes a written list too',
  'entity_category' in
    applyRepeat(
      { entities: true, entity_category: ['diagnostic'] },
      { patterns: [], reverse: false, entity_category: false },
    ),
  false,
);
check(
  'a cleared domain removes the key',
  'domain' in
    applyRepeat(
      { entities: true, domain: 'light' },
      { patterns: [], domain: [], reverse: false, entity_category: false },
    ),
  false,
);
check(
  'reverse on writes true',
  applyRepeat({ entities: true }, { patterns: [], reverse: true, entity_category: false }).reverse,
  true,
);
check(
  'group_by none removes the key',
  'group_by' in
    applyRepeat(
      { entities: true, group_by: 'area' },
      { patterns: [], group_by: '', reverse: false, entity_category: false },
    ),
  false,
);

// --- the schema

const hass = {
  states: {
    'light.a': { attributes: { device_class: undefined } },
    'binary_sensor.b': { attributes: { device_class: 'motion' } },
    'sensor.c': { attributes: { device_class: 'power' } },
  },
  entities: { 'light.a': { platform: 'hue' }, 'binary_sensor.b': { platform: 'zha' }, 'sensor.c': { platform: 'hue' } },
};
check('domains come from the states, sorted once each', knownDomains(hass), ['binary_sensor', 'light', 'sensor']);
check('device classes come from the attributes', knownDeviceClasses(hass), ['motion', 'power']);
check('integrations come from the entity registry', knownIntegrations(hass), ['hue', 'zha']);

const entitySchema = repeatBuilderSchema(hass, 'entities');
check(
  'an entity repeat offers the entity filters',
  entitySchema.map((e) => e.name),
  [
    'patterns',
    'domain',
    'area',
    'floor',
    'label',
    'device_class',
    'integration',
    'exclude',
    'sort',
    'then',
    'reverse',
    'limit',
    'offset',
    'group_by',
    'entity_category',
  ],
);
check(
  'an area repeat offers only what an area has',
  repeatBuilderSchema(hass, 'areas').map((e) => e.name),
  ['patterns', 'floor', 'label', 'exclude', 'sort', 'then', 'reverse', 'limit', 'offset'],
);
check(
  'views offer patterns and order only',
  repeatBuilderSchema(hass, 'views').map((e) => e.name),
  ['patterns', 'exclude', 'sort', 'then', 'reverse', 'limit', 'offset'],
);
check(
  'the domain field lists the known domains and takes a typed one',
  entitySchema.find((e) => e.name === 'domain').selector.select,
  {
    mode: 'dropdown',
    multiple: true,
    custom_value: true,
    options: [
      { value: 'binary_sensor', label: 'binary_sensor' },
      { value: 'light', label: 'light' },
      { value: 'sensor', label: 'sensor' },
    ],
  },
);
check('areas are picked with the area selector', entitySchema.find((e) => e.name === 'area').selector, {
  area: { multiple: true },
});

// --- the hand-written list (idea 46)

check(
  'an item is named by its entity',
  listItemLabel({ entity: 'camera.front_door', name: 'Front door' }),
  'Front door',
);
check('without a name, the entity', listItemLabel({ entity: 'camera.front_door' }), 'camera.front_door');
check('a mapping with neither shows its first value', listItemLabel({ area: 'Kitchen', icon: 'mdi:x' }), 'Kitchen');
check('a list-form item reads its entries', listItemLabel([{ entity: 'light.a' }, { name: 'A' }]), 'A');
check('an empty item is numbered by the caller', listItemLabel({}), '');
check('an item is replaced in place', withListItem([{ a: 1 }, { a: 2 }], 1, { a: 3 }), [{ a: 1 }, { a: 3 }]);
check('an item is removed', withoutListItem([{ a: 1 }, { a: 2 }], 0), [{ a: 2 }]);
check('a new item copies the keys of the last one, empty', withNewListItem([{ entity: 'light.a', name: 'A' }]), [
  { entity: 'light.a', name: 'A' },
  { entity: '', name: '' },
]);
check('a new item in an empty list is an entity', withNewListItem([]), [{ entity: '' }]);
