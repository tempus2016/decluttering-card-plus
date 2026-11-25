/*
 * `is:` and `not` (#499): `is:text` asks whether the value is exactly that text, and `not`
 * turns a yes into a no. Run with `npm test`.
 */
const deepReplace = require('../.test-build/deep-replace.js').default;
const { isBuiltinStep, yieldsBoolean, answersUnset } = require('../.test-build/variables.js');
const { lintTemplate } = require('../.test-build/lint.js');

const { check } = require('./check');

const vars = [
  { test_var: 'foobar' },
  { other_var: 'foobar' },
  { mode: 'off' },
  { count: 3 },
  { tags: ['a', 'b'] },
  { room: { name: 'a' } },
];
const run = (card) => deepReplace(vars, {}, card);

check(
  'is: gives a real true or false for an exact match',
  run({
    a: '[[test_var|is:foobar]]',
    b: '[[test_var|is:"foobar"]]',
    c: '[[test_var|is:foo]]',
    d: '[[test_var|is:[[other_var]]]]',
    e: '[[missing|is:foobar]]',
    f: '[[count|is:3]]',
  }),
  { a: true, b: true, c: false, d: true, e: false, f: true },
);

check(
  'is: matches a "no" word as text, unlike if: followed by bool',
  run({ a: '[[mode|is:off]]', b: '[[mode|is:on]]' }),
  { a: true, b: false },
);

check(
  'is: on a list or a mapping is no, not a match on its JSON',
  run({ a: '[[tags|is:a]]', b: '[[room|is:a]]', c: 'x=[[tags|is:a]]' }),
  { a: false, b: false, c: 'x=false' },
);

check('is: inside text writes the word', run({ a: 'match=[[test_var|is:foobar]]' }), { a: 'match=true' });

check(
  'not turns any yes or no round',
  run({
    a: '[[test_var|is:foobar|not]]',
    b: '[[test_var|is:snafu|not]]',
    c: '[[test_var|not]]',
    d: '[[missing|not]]',
    e: '[[mode|not]]',
    f: '[[tags|not]]',
    g: '[[tags|contains:a|not]]',
    h: '[[test_var|is:foobar|not|not]]',
  }),
  { a: false, b: true, c: false, d: true, e: true, f: false, g: false, h: true },
);

check(
  'a closed if: before not reads as unset',
  run({ a: '[[test_var|if:mode=on|not]]', b: '[[test_var|if:mode=off|not]]' }),
  { a: true, b: false },
);

check('is: and not are built-in steps', [isBuiltinStep('is:x'), isBuiltinStep('not')], [true, true]);
check('a chain ending in is: or not is a yes or no', [yieldsBoolean('is:x'), yieldsBoolean('is:x|not')], [true, true]);
check('is: and not answer an unset variable', [answersUnset('is:x'), answersUnset('not')], [true, true]);

{
  const unknown = (card) =>
    lintTemplate({ variables: [{ name: 'v' }], card })
      .filter((f) => f.key === 'lint.unknown_step')
      .map((f) => f.path);
  check('lint knows is: and not', unknown({ type: 'tile', a: '[[v|is:foo|not]]' }), []);
  check('lint still flags a misspelt not', unknown({ type: 'tile', b: '[[v|nott]]' }).length, 1);
}
