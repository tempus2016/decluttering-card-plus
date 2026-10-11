/*
 * `debug: yaml` (#156). The output is only worth anything if pasting it back gives the
 * same card, so every case is read back with js-yaml - the parser Home Assistant itself
 * uses - as well as checked for how it looks. Run with `npm test`.
 */
const { check, report } = require('./harness');
const yaml = require('js-yaml');
const { toYaml } = require('../.test-build/yaml.js');

const roundTrips = (name, value) => check(`${name} reads back as itself`, yaml.load(toYaml(value)), value);

check(
  'a card reads the way it is written',
  toYaml({
    type: 'tile',
    entity: 'light.lamp',
    icon: 'mdi:lightbulb',
    features: [{ type: 'light-brightness' }],
    tap_action: { action: 'toggle' },
  }),
  [
    'type: tile',
    'entity: light.lamp',
    'icon: mdi:lightbulb',
    'features:',
    '  - type: light-brightness',
    'tap_action:',
    '  action: toggle',
  ].join('\n'),
);

check(
  'a mapping in a list starts on the dash',
  toYaml({ cards: [{ type: 'entity', entity: 'sensor.a' }, 'x'] }),
  ['cards:', '  - type: entity', '    entity: sensor.a', '  - x'].join('\n'),
);

check(
  'text that YAML would read as something else is quoted',
  toYaml({ a: 'true', b: 'off', c: '42', d: '', e: 'null', f: ' padded', g: '[[name]]', h: 'a: b', i: 'x #y' }),
  [
    'a: "true"',
    'b: "off"',
    'c: "42"',
    'd: ""',
    'e: "null"',
    'f: " padded"',
    'g: "[[name]]"',
    'h: "a: b"',
    'i: "x #y"',
  ].join('\n'),
);

check('real values stay unquoted', toYaml({ a: true, b: 0, c: null, d: -1.5 }), 'a: true\nb: 0\nc: null\nd: -1.5');
check('empty collections', toYaml({ a: [], b: {} }), 'a: []\nb: {}');
check('undefined is dropped, as in the JSON view', toYaml({ a: 1, b: undefined }), 'a: 1');
check('a multi-line template is a block', toYaml({ content: 'one\ntwo\n' }), 'content: |\n  one\n  two');

roundTrips('a card', {
  type: 'custom:button-card',
  entity: 'light.lamp',
  name: 'Lamp',
  show_state: false,
  size: 40,
  styles: { card: [{ height: '80px' }, { 'border-radius': '12px' }] },
  state: [{ value: 'on', color: 'rgb(255, 200, 0)' }],
});
roundTrips('awkward strings', {
  a: 'true',
  b: 'Yes',
  c: '0x1F',
  d: '1e3',
  e: '.inf',
  f: '- dash',
  g: '{{ states("sensor.x") }}',
  h: "it's",
  i: 'say "hi"',
  j: 'trailing ',
  k: 'colon:',
  l: '@at',
  m: '%pct',
  n: '*star',
  o: '!tag',
  p: '|pipe',
  q: '>fold',
  r: 'tab\there',
  s: 'cr\r\nlf',
  t: 'ünïcödé ✓',
  u: '2026-10-08',
  v: '~',
});
roundTrips('blocks with every ending', {
  none: 'a\nb',
  one: 'a\nb\n',
  two: 'a\nb\n\n',
  blank: 'a\n\nb',
  indented: 'a\n  b\n    c',
  leading: '  starts indented\nsecond',
  last: 'x\n\n',
});
roundTrips('lists of lists and empties', { a: [[1, 2], [], {}, [{ b: [] }], null, 'x\ny'] });
roundTrips('keys that need quoting', { 'a b': 1, 1: 2, true: 3, 'x:': 4, '': 5 });
roundTrips('a list at the top', [{ type: 'a' }, 'b', 3]);
roundTrips('a lone string', 'just text');
roundTrips('a lone multi-line string', 'one\ntwo');

/*
 * Strings built from the characters YAML cares about, in every order. Seeded, so a failure
 * is the same failure next time.
 */
let seed = 156;
const random = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const alphabet = [
  'a',
  'Z',
  '0',
  '1',
  '.',
  '-',
  '_',
  ' ',
  ':',
  '#',
  '\n',
  '\t',
  '"',
  "'",
  '[',
  ']',
  '{',
  '}',
  ',',
  '?',
  '|',
  '>',
  '!',
  '&',
  '*',
  '%',
  '@',
  '`',
  '~',
  '\\',
  'é',
];
const fuzz = {};
for (let i = 0; i < 3000; i += 1) {
  let text = '';
  const length = Math.floor(random() * 8);
  for (let j = 0; j < length; j += 1) text += alphabet[Math.floor(random() * alphabet.length)];
  fuzz['k' + i] = text;
  fuzz[text + i] = [text];
}
const read = yaml.load(toYaml(fuzz));
const wrong = Object.keys(fuzz).filter((k) => JSON.stringify(read[k]) !== JSON.stringify(fuzz[k]));
check('3000 random strings, as keys, values and list items, all read back', wrong.slice(0, 5), []);

report();
