/*
 * #458: a variable whose value is a placeholder - `alert: '[[mdi|merge:fr]]'`, or just
 * `alert: '[[mdi]]'` - ends up as a mapping, so its keys are reached with dotted names like
 * one written out in full.
 */
const { check } = require('./check');
const deepReplace = require('../.test-build/deep-replace.js').default;

const realWarn = console.warn;
const said = [];
console.warn = (...args) => said.push(args.join(' '));
const run = (content, variables) => deepReplace(JSON.parse(JSON.stringify(variables)), {}, content, 't');

const icons = [{ mdi: { cat: 'mdi:cat', dog: 'mdi:dog' } }, { fr: { cat: 'ca' } }, { alert: '[[mdi|merge:fr]]' }];

check('a dotted name reaches into a merged mapping (#458)', run({ v: '[[alert.cat]]' }, icons), { v: 'ca' });
check('the key the merge did not change is there too (#458)', run({ v: '[[alert.dog]]' }, icons), { v: 'mdi:dog' });
check(
  'a plain reference to a mapping has dotted names (#458)',
  run({ v: '[[ref.cat]]' }, [...icons, { ref: '[[mdi]]' }]),
  {
    v: 'mdi:cat',
  },
);
check('steps after the dotted name still apply (#458)', run({ v: '[[alert.dog|upper]]' }, icons), { v: 'MDI:DOG' });
check('a key that is not there still reads as unset (#458)', run({ v: '[[alert.zebra|default:x]]' }, icons), {
  v: 'x',
});
check('if: reads a dotted name of a settled mapping (#458)', run({ v: '[[alert.cat|if:alert.cat]]' }, icons), {
  v: 'ca',
});
check(
  'nested keys in a settled mapping are reached (#458)',
  run({ v: '[[two.room.light]]' }, [{ base: { room: { light: 'light.a' } } }, { two: '[[base]]' }]),
  { v: 'light.a' },
);
check(
  'a value set on the card for the dotted name still wins (#458)',
  run({ v: '[[alert.cat]]' }, [{ 'alert.cat': 'mine' }, ...icons]),
  { v: 'mine' },
);
check(
  'a settled value that is not a mapping gives no dotted names (#458)',
  run({ v: '[[txt.cat]]' }, [{ s: 'hello' }, { txt: '[[s]]' }]),
  { v: '[[txt.cat]]' },
);
check(
  'a variable that reads its own dotted name does not loop (#458)',
  run({ v: '[[self.x]]' }, [{ self: '[[self.x]]' }]).v.includes('self.x'),
  true,
);
check(
  'the dotted name inside a variable value is reached as well (#458)',
  run({ v: '[[icon]]' }, [...icons, { icon: '[[alert.cat]]' }]),
  { v: 'ca' },
);
said.length = 0;
run({ v: '[[alert.cat]]' }, icons);
check('no unset warning for a reachable dotted name (#458)', said.length, 0);

// #489: the key is a placeholder, so which one is wanted is known only once it is in.
const pets = [
  { m1: { cat: 'meow', dog: 'bark' } },
  { m2: { cat: 'purr', pig: 'oink' } },
  { m3: '[[m1|merge:m2]]' },
  { pet: 'cat' },
];
check('a placeholder key reaches into a merged mapping (#489)', run({ v: '[[m3.[[pet]]]]' }, pets), { v: 'purr' });
check(
  'a placeholder key reaches a key only the first mapping had (#489)',
  run({ v: '[[m3.[[pet]]]]' }, [...pets.slice(0, 3), { pet: 'dog' }]),
  { v: 'bark' },
);
check(
  'a placeholder key that names nothing still reads as unset (#489)',
  run({ v: '[[m3.[[pet]]|default:none]]' }, [...pets.slice(0, 3), { pet: 'zebra' }]),
  { v: 'none' },
);
check('steps after a placeholder key still apply (#489)', run({ v: '[[m3.[[pet]]|upper]]' }, pets), { v: 'PURR' });
check('a placeholder key works inside if: too (#489)', run({ v: '[[pet|if:m3.[[pet]]]]' }, pets), { v: 'cat' });
check(
  'a placeholder key in a variable value reaches it as well (#489)',
  run({ v: '[[sound]]' }, [...pets, { sound: '[[m3.[[pet]]]]' }]),
  { v: 'purr' },
);
said.length = 0;
run({ v: '[[m3.[[pet]]]]' }, pets);
check('no unset warning for a placeholder key that is there (#489)', said.length, 0);
console.warn = realWarn;

// #489: the editor and the health card do not call names only a build can answer unset.
{
  const { diagnoseInstance } = require('../.test-build/variables.js');
  const template = {
    default: pets,
    card: { type: 'markdown', content: '[[m3.[[pet]]]] [[m1.[[pet]]]] [[m3.goat]] [[nope.x]] [[gone]]' },
  };
  check('only the truly unset names are missing (#489)', diagnoseInstance([], template).missing.sort(), [
    'gone',
    'nope.x',
  ]);
}
