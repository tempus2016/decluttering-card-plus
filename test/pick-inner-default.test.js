/*
 * A placeholder inside a step's argument that nothing sets leaves that step with nothing to
 * work with, so a `default:` or `or:` after it stands in, as it would for an unset variable:
 * `[[l|pick:k=[[who]],n|default:zz]]` with no `who` is "zz", and nothing is said about `who`.
 */
const { check } = require('./check');
const deepReplace = require('../.test-build/deep-replace.js').default;

const realWarn = console.warn;
const said = [];
console.warn = (...args) => said.push(args.join(' '));
const run = (content, variables) => {
  said.length = 0;
  return deepReplace(JSON.parse(JSON.stringify(variables)), {}, content, 't');
};

const list = [
  {
    l: [
      { k: 'a', n: 1 },
      { k: 'b', n: 2 },
    ],
  },
];

check(
  'an unset placeholder inside pick: lets the default after it stand in',
  run({ v: '[[l|pick:k=[[who]],n|default:zz]]' }, list),
  { v: 'zz' },
);
check(
  'nothing is said about the unset placeholder the default covered',
  said.some((m) => m.includes('[[who]]')),
  false,
);
check(
  'a plain unset placeholder with a default says nothing either',
  [run({ v: '[[x|default:y]]' }, list), said.length],
  [{ v: 'y' }, 0],
);
check('in a longer string too', run({ v: 'icon [[l|pick:k=[[who]],n|default:zz]] here' }, list), { v: 'icon zz here' });
check(
  'an or: after it stands in the same way',
  run({ v: '[[l|pick:k=[[who]],n|or:other]]' }, [...list, { other: 'from other' }]),
  { v: 'from other' },
);
check(
  'steps between the pick: and the default still see a gap',
  run({ v: '[[l|pick:k=[[who]],n|upper|default:zz]]' }, list),
  { v: 'zz' },
);
check('a default for the inner placeholder still picks with it', run({ v: '[[l|pick:k=[[who|default:a]],n]]' }, list), {
  v: '1',
});
check(
  'a set inner placeholder still picks with it, default and all',
  run({ v: '[[l|pick:k=[[who]],n|default:zz]]' }, [...list, { who: 'b' }]),
  { v: '2' },
);
check(
  'a whole value gets what a plain unset placeholder with the same default gets',
  run({ v: '[[l|pick:k=[[who]],n|default:5]]' }, list),
  run({ v: '[[x|default:5]]' }, list),
);
check(
  'only a default: or or: stands in: a bool after it leaves the placeholder as written',
  run({ v: '[[l|pick:k=[[who]],n|bool]]' }, list),
  { v: '[[l|pick:k=[[who]],n|bool]]' },
);
check('without a default it is still left as written', run({ v: '[[l|pick:k=[[who]],n]]' }, list), {
  v: '[[l|pick:k=[[who]],n]]',
});
check(
  'and says the inner placeholder has no value',
  said.some((m) => m.includes('[[who]]')),
  true,
);
check(
  'an escaped inner placeholder is text, not a gap',
  run({ v: '[[l|pick:k=[[!who]],n|default:zz]]' }, list).v === 'zz',
  false,
);
check('a default holding the unset placeholder is not stood in for', run({ v: '[[x|default:[[who]]]]' }, list), {
  v: '[[x|default:[[who]]]]',
});

console.warn = realWarn;
