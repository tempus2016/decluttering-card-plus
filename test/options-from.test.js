/*
 * #404: `options_from:` - a declaration's dropdown filled from what a for_each_from source
 * finds, each option filled in like a repeat copy. Run with `npm test`.
 */
const { check } = require('./check');
const { hasOptionsFrom, optionsFrom, optionsFromSelector } = require('../.test-build/options-from.js');

const state = (name) => ({ attributes: { friendly_name: name } });
const hass = {
  states: {
    'sensor.driveway_zone_all_count': state('Driveway zone'),
    'sensor.garden_zone_all_count': state('Garden zone'),
    'sensor.garden_zone_car_count': state('Garden cars'),
    'light.hall': state('Hall'),
  },
  entities: Object.fromEntries(
    [
      'sensor.driveway_zone_all_count',
      'sensor.garden_zone_all_count',
      'sensor.garden_zone_car_count',
      'light.hall',
    ].map((id) => [id, { entity_id: id, labels: [] }]),
  ),
  areas: { kitchen: { area_id: 'kitchen', name: 'Kitchen' } },
  devices: {},
};

// The example from the discussion, without the broken item template around it.
const zones = {
  name: 'zone_name',
  options_from: { entities: 'sensor.*_zone_all_count' },
  option_value: '[[entity|object_id|replace:_all_count:]]',
};

check(
  'a source is what turns it on',
  [hasOptionsFrom(zones), hasOptionsFrom({ name: 'x' }), hasOptionsFrom({ name: 'x', options_from: 'sensor.*' })],
  [true, false, false],
);

check('each entity found is one option, value filled in per entity', optionsFrom(zones, hass), [
  { value: 'driveway_zone', label: 'driveway_zone' },
  { value: 'garden_zone', label: 'garden_zone' },
]);

check('option_label sets what the dropdown shows', optionsFrom({ ...zones, option_label: '[[name]]' }, hass), [
  { value: 'driveway_zone', label: 'Driveway zone' },
  { value: 'garden_zone', label: 'Garden zone' },
]);

check(
  'without option_value an option is the entity id',
  optionsFrom({ name: 'l', options_from: { domain: 'light' } }, hass),
  [{ value: 'light.hall', label: 'light.hall' }],
);

check('an area source offers area ids', optionsFrom({ name: 'a', options_from: { areas: true } }, hass), [
  { value: 'kitchen', label: 'kitchen' },
]);

check(
  'two things filled to the same value are one option',
  optionsFrom(
    {
      name: 'z',
      options_from: { entities: 'sensor.*_zone_*' },
      option_value: '[[entity|object_id|replace:_all_count:|replace:_car_count:]]',
    },
    hass,
  ).map((o) => o.value),
  ['driveway_zone', 'garden_zone'],
);

check('a value that fills to nothing is dropped', optionsFrom({ ...zones, option_value: '' }, hass), []);

check('no hass, no options', optionsFrom(zones, undefined), []);

check('the selector is a dropdown of them', optionsFromSelector(zones, hass), {
  select: {
    mode: 'dropdown',
    options: [
      { value: 'driveway_zone', label: 'driveway_zone' },
      { value: 'garden_zone', label: 'garden_zone' },
    ],
  },
});

check(
  'a written select keeps its own settings and has its options replaced',
  optionsFromSelector({ ...zones, selector: { select: { multiple: true, custom_value: true, options: ['x'] } } }, hass),
  {
    select: {
      multiple: true,
      custom_value: true,
      options: [
        { value: 'driveway_zone', label: 'driveway_zone' },
        { value: 'garden_zone', label: 'garden_zone' },
      ],
    },
  },
);
