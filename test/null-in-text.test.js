/*
 * A null placed inside text reads as nothing, the way an empty value does, rather than as
 * the word "null". A null standing as the whole value stays null, and a mapping holding a
 * null still goes in whole.
 */
const { check } = require('./check');
const deepReplace = require('../.test-build/deep-replace.js').default;

const realWarn = console.warn;
console.warn = () => {};
const run = (variables, content) => deepReplace(variables, {}, content, 't');

check(
  'a null mapping value inside text is empty, whole it stays null',
  run([{ m: { a: null, b: 1 } }], { v: '[[m.a]]', w: 'x[[m.a]]y', z: '[[m]]' }),
  { v: null, w: 'xy', z: { a: null, b: 1 } },
);
check('a plain variable set to null is empty inside text', run([{ n: null }], { v: '[[n]]', w: 'x[[n]]y' }), {
  v: null,
  w: 'xy',
});
check(
  'a null through a text step is empty, not NULL',
  run([{ n: null, m: { a: null } }], { a: 'x[[n|upper]]y', b: '[[n|upper]]', c: 'x[[m.a|lower]]y' }),
  { a: 'xy', b: '', c: 'xy' },
);
check(
  'json and yaml still write a null as null',
  run([{ n: null }], { a: '[[n|json]]', b: 'x[[n|json]]y', c: '[[n|yaml]]' }),
  { a: 'null', b: 'xnully', c: 'null' },
);
check(
  'a null item value inside text is empty in each repeat copy',
  run([{ l: [{ x: null }, { x: 2 }] }, { t: { e: 'x[[item.x]]y', f: '[[item.x]]' } }], { r: '[[t|repeat:l]]' }),
  {
    r: [
      { e: 'xy', f: null },
      { e: 'x2y', f: 2 },
    ],
  },
);
check(
  'a null list item inside text is empty in its repeat copy',
  run([{ l: [null, 2] }, { t: { e: 'x[[item]]y' } }], { r: '[[t|repeat:l]]' }),
  { r: [{ e: 'xy' }, { e: 'x2y' }] },
);
check(
  'default: still stands in for a null, inside text and whole',
  run([{ n: null, m: { a: null } }], { a: 'x[[n|default:D]]y', b: '[[n|default:D]]', c: 'x[[m.a|default:D]]y' }),
  { a: 'xDy', b: 'D', c: 'xDy' },
);
check(
  'a null is still optional-empty, and bool still reads it as no',
  run([{ n: null }], { a: 'x[[n?]]y', b: '[[n|bool]]' }),
  { a: 'xy', b: false },
);
check('if: on a null still does not hold', run([{ n: null }], { a: '[[n|if:n]]' }), { a: '[[n|if:n]]' });

console.warn = realWarn;
