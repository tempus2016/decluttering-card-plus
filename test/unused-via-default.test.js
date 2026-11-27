/*
 * #511: a variable the card sets whose only read is inside another variable's own default
 * is unused only because that default never comes into play. It is still unused, but it is
 * said apart, with the variable whose default reads it and why that default does not apply.
 */
const { diagnoseInstance } = require('../.test-build/variables.js');

const { check } = require('./check');

// The reporter's declarations, as written on the issue.
const declarations = [
  { name: 'weather_scale', default: '[[default_weather_scale]]', type: 'number', group: 'Weather' },
  {
    name: 'weather_r_offset',
    default: '[[default_weather_r_offset]]',
    show_if: 'offer.weather_exists',
    required: true,
    selector: { number: { min: 5, max: 200, unit_of_measurement: 'px' } },
    group: 'Weather',
  },
  {
    name: 'weather_offset_diff',
    type: 'number',
    group: 'Weather',
    default: '[[default_weather_offset_diff|mul:[[weather_scale]]]]',
  },
];
const reading = { variables: declarations, card: { type: 'x', a: '[[weather_r_offset]] [[weather_offset_diff]]' } };
const notReading = { variables: declarations, card: { type: 'x', a: '[[weather_r_offset]]' } };

check('a name read through a used default is used', diagnoseInstance([{ weather_scale: 2 }], reading), {
  missing: ['default_weather_r_offset', 'default_weather_offset_diff'],
  unused: [],
  required: [],
});

check(
  'a name read only by a default nothing uses is said with that variable',
  diagnoseInstance([{ weather_scale: 2 }], notReading).unusedVia,
  [{ name: 'weather_scale', via: ['weather_offset_diff'], set: false }],
);

check(
  'a name read only by a default the card overrides is said as set',
  diagnoseInstance([{ weather_scale: 2 }, { weather_offset_diff: 4 }], reading).unusedVia,
  [{ name: 'weather_scale', via: ['weather_offset_diff'], set: true }],
);

check(
  'it is still among the unused',
  diagnoseInstance([{ weather_scale: 2 }, { weather_offset_diff: 4 }], reading).unused,
  ['weather_scale'],
);

check('a plain unused name has no feeder', diagnoseInstance([{ stray: 1 }], reading).unusedVia, undefined);

check(
  'a default: list entry counts as a feeder too',
  diagnoseInstance([{ scale: 2 }], { default: [{ size: '[[scale]]px' }], card: { type: 'x' } }).unusedVia,
  [{ name: 'scale', via: ['size'], set: false }],
);

check(
  'a feeder is followed through a chain of defaults',
  diagnoseInstance([{ scale: 2 }], {
    variables: [
      { name: 'size', default: '[[middle]]' },
      { name: 'middle', default: '[[scale|mul:2]]' },
    ],
    card: { type: 'x' },
  }).unusedVia.map((each) => [each.name, each.via.sort()]),
  [['scale', ['middle', 'size']]],
);

check(
  'an unused feeder is not itself named as a feeder of its own unused name',
  diagnoseInstance([{ scale: 2 }, { size: 3 }], {
    variables: [{ name: 'size', default: '[[scale]]' }],
    card: { type: 'x' },
  }).unusedVia,
  undefined,
);
