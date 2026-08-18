/*
 * Unit tests for the variable substitution in src/deep-replace.ts.
 * Run with `npm test`, which transpiles the source into .test-build first.
 */
const deepReplace = require('../.test-build/deep-replace.js').default;

let passed = 0;
let failed = 0;
const warnings = [];
const realWarn = console.warn;
console.warn = m => warnings.push(m);

function check(name, actual, expected) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    passed += 1;
    realWarn.call(console, `PASS ${name}`);
  } else {
    failed += 1;
    realWarn.call(console, `FAIL ${name}\n  got      ${a}\n  expected ${e}`);
  }
}

check('plain substitution',
  deepReplace([{ entity: 'sun.sun' }], {}, { type: 'tile', entity: '[[entity]]' }),
  { type: 'tile', entity: 'sun.sun' });

check('default values',
  deepReplace(undefined, { default: [{ entity: 'sun.sun' }] }, { entity: '[[entity]]' }),
  { entity: 'sun.sun' });

check('passed value beats default',
  deepReplace([{ entity: 'person.john' }], { default: [{ entity: 'sun.sun' }] }, { entity: '[[entity]]' }),
  { entity: 'person.john' });

check('passed value beats default introduced by a nested substitution',
  deepReplace([{ area: 'Shed' }], { default: [{ label: '[[area]] sun' }, { area: 'Garden' }] }, { name: '[[label]]' }),
  { name: 'Shed sun' });

check('nested, dependency declared first',
  deepReplace(undefined, { default: [{ inner: 'sun.sun' }, { outer: '[[inner]]' }] }, { entity: '[[outer]]' }),
  { entity: 'sun.sun' });

check('nested, dependency declared last',
  deepReplace(undefined, { default: [{ outer: '[[inner]]' }, { inner: 'sun.sun' }] }, { entity: '[[outer]]' }),
  { entity: 'sun.sun' });

check('nested three deep',
  deepReplace([{ a: '[[b]]' }, { b: '[[c]]' }, { c: 'sun.sun' }], {}, { entity: '[[a]]' }),
  { entity: 'sun.sun' });

check('nested inside a longer string',
  deepReplace([{ name: 'Sun' }, { label: 'The [[name]] card' }], {}, { title: '[[label]]!' }),
  { title: 'The Sun card!' });

check('number value stays a number',
  deepReplace([{ cols: 3 }], {}, { columns: '[[cols]]' }),
  { columns: 3 });

check('boolean value stays a boolean',
  deepReplace([{ flag: true }], {}, { on: '[[flag]]' }),
  { on: true });

check('object value is injected whole',
  deepReplace([{ obj: { a: 1 } }], {}, { thing: '[[obj]]' }),
  { thing: { a: 1 } });

check('nested object value',
  deepReplace([{ inner: 'sun.sun' }, { obj: { entity: '[[inner]]' } }], {}, { thing: '[[obj]]' }),
  { thing: { entity: 'sun.sun' } });

check('unknown placeholder is left alone',
  deepReplace([{ known: 'x' }], {}, { a: '[[known]]', b: '[[unknown]]' }),
  { a: 'x', b: '[[unknown]]' });

check('no variables at all returns the content untouched',
  deepReplace(undefined, {}, { entity: '[[entity]]' }),
  { entity: '[[entity]]' });

warnings.length = 0;
const started = Date.now();
deepReplace([{ a: 'x[[a]]' }], {}, { v: '[[a]]' });
const elapsed = Date.now() - started;
check('a self-referencing variable terminates', elapsed < 2000, true);
check('a self-referencing variable warns', warnings.length > 0, true);

console.warn = realWarn;
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
