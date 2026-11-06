/*
 * Idea 44: a template's examples as presets a card can be filled from at any time.
 */
const { check } = require('./check');
const { exampleSets, exampleNames } = require('../.test-build/examples');
const { presetOptions, presetMatching, presetConflicts, applyPreset } = require('../.test-build/card-editor/presets');

const named = {
  card: { type: 'tile' },
  examples: [
    { name: 'Power', values: { entity: 'sensor.power', unit: 'W', icon: 'mdi:flash', colour: 'amber' } },
    { name: 'Temperature', values: { entity: 'sensor.temp', unit: '°C', icon: 'mdi:thermometer', colour: 'blue' } },
  ],
};
const unnamed = { card: {}, examples: [{ entity: 'a' }, [{ entity: 'b' }, { name: 'B' }]] };

check('a named example still reads as its values', exampleSets(named)[0], [
  { entity: 'sensor.power' },
  { unit: 'W' },
  { icon: 'mdi:flash' },
  { colour: 'amber' },
]);
check('an unnamed example reads as before', exampleSets(unnamed)[1], [{ entity: 'b' }, { name: 'B' }]);
check('names come from the entries', exampleNames(named), ['Power', 'Temperature']);
check('unnamed examples are numbered', exampleNames(unnamed), ['Example 1', 'Example 2']);
check(
  'a mapping with name and values and something else is an ordinary example',
  exampleSets({ examples: { name: 'x', values: 'y', other: 1 } })[0],
  [{ name: 'x' }, { values: 'y' }, { other: 1 }],
);

check('options pair the index with the name', presetOptions(named), [
  { value: '0', label: 'Power' },
  { value: '1', label: 'Temperature' },
]);
check('no examples, no options', presetOptions({ card: {} }), []);

check(
  'a card whose values match a preset shows it',
  presetMatching(named, [
    { entity: 'sensor.power' },
    { unit: 'W' },
    { icon: 'mdi:flash' },
    { colour: 'amber' },
    { name: 'Hall' },
  ]),
  0,
);
check(
  'one differing value and nothing matches',
  presetMatching(named, [{ entity: 'sensor.power' }, { unit: 'kW' }, { icon: 'mdi:flash' }, { colour: 'amber' }]),
  undefined,
);
check(
  'a mapping of variables matches too',
  presetMatching(named, { entity: 'sensor.temp', unit: '°C', icon: 'mdi:thermometer', colour: 'blue' }),
  1,
);

check(
  'conflicts are the hand-set names the preset would change',
  presetConflicts(named, 1, [{ entity: 'sensor.power' }, { name: 'Hall' }, { colour: 'blue' }]),
  ['entity'],
);
check('no values set means no conflicts', presetConflicts(named, 0, undefined), []);

check(
  'applying keeps what the preset does not name and overwrites what it does',
  applyPreset({ type: 'x', template: 't', variables: [{ name: 'Hall' }, { entity: 'sensor.old' }] }, named, 1)
    .variables,
  [{ name: 'Hall' }, { entity: 'sensor.temp' }, { unit: '°C' }, { icon: 'mdi:thermometer' }, { colour: 'blue' }],
);
check('an index out of range changes nothing', applyPreset({ type: 'x', variables: [{ a: 1 }] }, named, 7), {
  type: 'x',
  variables: [{ a: 1 }],
});
