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
console.warn = realWarn;
