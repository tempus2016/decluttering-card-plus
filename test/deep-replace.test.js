/*
 * Unit tests for the variable substitution in src/deep-replace.ts.
 * Run with `npm test`, which transpiles the source into .test-build first.
 */
const deepReplace = require('../.test-build/deep-replace.js').default;

let passed = 0;
let failed = 0;
const warnings = [];
const realWarn = console.warn;
console.warn = (m) => warnings.push(m);

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

check('plain substitution', deepReplace([{ entity: 'sun.sun' }], {}, { type: 'tile', entity: '[[entity]]' }), {
  type: 'tile',
  entity: 'sun.sun',
});

check('default values', deepReplace(undefined, { default: [{ entity: 'sun.sun' }] }, { entity: '[[entity]]' }), {
  entity: 'sun.sun',
});

check(
  'passed value beats default',
  deepReplace([{ entity: 'person.john' }], { default: [{ entity: 'sun.sun' }] }, { entity: '[[entity]]' }),
  { entity: 'person.john' },
);

check(
  'passed value beats default introduced by a nested substitution',
  deepReplace([{ area: 'Shed' }], { default: [{ label: '[[area]] sun' }, { area: 'Garden' }] }, { name: '[[label]]' }),
  { name: 'Shed sun' },
);

check(
  'nested, dependency declared first',
  deepReplace(undefined, { default: [{ inner: 'sun.sun' }, { outer: '[[inner]]' }] }, { entity: '[[outer]]' }),
  { entity: 'sun.sun' },
);

check(
  'nested, dependency declared last',
  deepReplace(undefined, { default: [{ outer: '[[inner]]' }, { inner: 'sun.sun' }] }, { entity: '[[outer]]' }),
  { entity: 'sun.sun' },
);

check('nested three deep', deepReplace([{ a: '[[b]]' }, { b: '[[c]]' }, { c: 'sun.sun' }], {}, { entity: '[[a]]' }), {
  entity: 'sun.sun',
});

check(
  'nested inside a longer string',
  deepReplace([{ name: 'Sun' }, { label: 'The [[name]] card' }], {}, { title: '[[label]]!' }),
  { title: 'The Sun card!' },
);

check('number value stays a number', deepReplace([{ cols: 3 }], {}, { columns: '[[cols]]' }), { columns: 3 });

check('boolean value stays a boolean', deepReplace([{ flag: true }], {}, { on: '[[flag]]' }), { on: true });

check('object value is injected whole', deepReplace([{ obj: { a: 1 } }], {}, { thing: '[[obj]]' }), {
  thing: { a: 1 },
});

check(
  'nested object value',
  deepReplace([{ inner: 'sun.sun' }, { obj: { entity: '[[inner]]' } }], {}, { thing: '[[obj]]' }),
  { thing: { entity: 'sun.sun' } },
);

check('unknown placeholder is left alone', deepReplace([{ known: 'x' }], {}, { a: '[[known]]', b: '[[unknown]]' }), {
  a: 'x',
  b: '[[unknown]]',
});

check('no variables at all returns the content untouched', deepReplace(undefined, {}, { entity: '[[entity]]' }), {
  entity: '[[entity]]',
});

// Regressions from the upstream issue tracker. Substitution is string surgery on JSON
// text, so any value inserted into a JSON string has to be escaped for one.

check(
  'a value containing a newline (upstream #47)',
  deepReplace([{ v: 'line one\nline two' }], {}, { content: '[[v]]' }),
  { content: 'line one\nline two' },
);

check(
  'a multi-line Jinja template (upstream #60)',
  deepReplace([{ v: "{% if false -%}\n{{states('zone.home')}}\n{%- endif %}" }], {}, { content: '[[v]]' }),
  { content: "{% if false -%}\n{{states('zone.home')}}\n{%- endif %}" },
);

check('a value containing a double quote', deepReplace([{ v: 'say "hi"' }], {}, { content: '[[v]]' }), {
  content: 'say "hi"',
});

check('a value containing a backslash', deepReplace([{ v: 'C:\\Users' }], {}, { content: '[[v]]' }), {
  content: 'C:\\Users',
});

check('a value containing a tab', deepReplace([{ v: 'a\tb' }], {}, { content: '[[v]]' }), { content: 'a\tb' });

// String.replace reads $& and $1 in the replacement as patterns, which corrupted the
// value and, with substitution looping, grew it on every pass.
check('a value containing $& is inserted literally', deepReplace([{ v: 'a$&b' }], {}, { content: '[[v]]' }), {
  content: 'a$&b',
});

check('a value containing $1 is inserted literally', deepReplace([{ v: 'cost $1' }], {}, { content: '[[v]]' }), {
  content: 'cost $1',
});

check(
  'an object used inside a longer string becomes its JSON text (upstream #83)',
  deepReplace([{ VALUE: ['tst1.x', 'tst2.y'] }], {}, { content: "{{ '[[VALUE]]' }}" }),
  { content: '{{ \'["tst1.x","tst2.y"]\' }}' },
);

check('a variable name containing regexp characters', deepReplace([{ 'my.var': 'x' }], {}, { content: '[[my.var]]' }), {
  content: 'x',
});

check('null value', deepReplace([{ v: null }], {}, { content: '[[v]]' }), { content: null });

// The examples from the two nested-variable issues, verbatim.

check(
  'default referencing another variable (upstream #62)',
  deepReplace([{ room: 'office' }], { default: [{ light_entity: 'light.[[room]]' }] }, { entity: '[[light_entity]]' }),
  { entity: 'light.office' },
);

check(
  'default referencing another variable, overridden (upstream #62)',
  deepReplace(
    [{ room: 'office' }, { light_entity: 'light.office_floor_lamp' }],
    { default: [{ light_entity: 'light.[[room]]' }] },
    { entity: '[[light_entity]]' },
  ),
  { entity: 'light.office_floor_lamp' },
);

check(
  'a variable falling back to another variable (upstream #84)',
  deepReplace(
    [{ entity: 'sensor.my_entity' }],
    { default: [{ history_entity: '[[entity]]' }] },
    { entity: '[[entity]]', history: '[[history_entity]]' },
  ),
  { entity: 'sensor.my_entity', history: 'sensor.my_entity' },
);

check(
  'a declared default is substituted',
  deepReplace(undefined, { variables: [{ name: 'entity', default: 'sun.sun' }] }, { entity: '[[entity]]' }),
  { entity: 'sun.sun' },
);

check(
  'a passed value beats a declared default',
  deepReplace(
    [{ entity: 'sun.moon' }],
    { variables: [{ name: 'entity', default: 'sun.sun' }] },
    {
      entity: '[[entity]]',
    },
  ),
  { entity: 'sun.moon' },
);

check(
  'a declared default beats the older default list',
  deepReplace(
    undefined,
    { variables: [{ name: 'entity', default: 'sun.sun' }], default: [{ entity: 'sun.moon' }] },
    { entity: '[[entity]]' },
  ),
  { entity: 'sun.sun' },
);

warnings.length = 0;
const started = Date.now();
deepReplace([{ a: 'x[[a]]' }], {}, { v: '[[a]]' });
const elapsed = Date.now() - started;
check('a self-referencing variable terminates', elapsed < 2000, true);
check('a self-referencing variable warns', warnings.length > 0, true);

console.warn = realWarn;
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
