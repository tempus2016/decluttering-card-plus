/*
 * Unit tests for the variable substitution in src/deep-replace.ts.
 * Run with `npm test`, which transpiles the source into .test-build first.
 */
const deepReplace = require('../.test-build/deep-replace.js').default;

const { check, report } = require('./harness');

// The substitution code warns about variables it cannot resolve, and one test is about
// that warning, so console.warn is captured for the length of the run.
const warnings = [];
const realWarn = console.warn;
console.warn = (m) => warnings.push(m);

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

check(
  'slug turns a name into an entity id fragment',
  deepReplace([{ room: 'Living Room' }], {}, { entity: 'light.[[room|slug]]' }),
  { entity: 'light.living_room' },
);

check('upper and lower change case', deepReplace([{ a: 'MiXeD' }], {}, { u: '[[a|upper]]', l: '[[a|lower]]' }), {
  u: 'MIXED',
  l: 'mixed',
});

check('title capitalises each word', deepReplace([{ a: 'living room light' }], {}, { t: '[[a|title]]' }), {
  t: 'Living Room Light',
});

check('a transform on a whole value produces a string', deepReplace([{ a: 'Hall' }], {}, { name: '[[a|upper]]' }), {
  name: 'HALL',
});

check(
  'the same variable can be used raw and transformed at once',
  deepReplace([{ room: 'Back Garden' }], {}, { name: '[[room]]', entity: 'light.[[room|slug]]' }),
  { name: 'Back Garden', entity: 'light.back_garden' },
);

check(
  'an unknown transform is not a transform, so nothing is replaced',
  deepReplace([{ a: 'x' }], {}, { v: '[[a|shout]]' }),
  { v: '[[a|shout]]' },
);

check(
  'slug collapses runs of punctuation and trims the ends',
  deepReplace([{ a: "  John's  Shed!  " }], {}, { v: '[[a|slug]]' }),
  { v: 'john_s_shed' },
);

check(
  'a transform applies to a default as well as a passed value',
  deepReplace(undefined, { default: [{ room: 'Front Door' }] }, { v: '[[room|slug]]' }),
  { v: 'front_door' },
);

warnings.length = 0;
const started = Date.now();
deepReplace([{ a: 'x[[a]]' }], {}, { v: '[[a]]' });
const elapsed = Date.now() - started;
check('a self-referencing variable terminates', elapsed < 2000, true);
check('a self-referencing variable warns', warnings.length > 0, true);

/* ------------------------------------------- warning about a transformed mapping */

warnings.length = 0;
deepReplace([{ tap: { action: 'toggle' } }], {}, { a: '[[tap|lower]]' });
check('a transform on a mapping says something rather than nothing', warnings.length, 1);

check(
  'the warning names the placeholder, what the value is, and what to do',
  /\[\[tap\|lower\]\]/.test(warnings[0]) && /mapping/.test(warnings[0]) && /scalar/.test(warnings[0]),
  true,
);

warnings.length = 0;
deepReplace([{ items: [1, 2] }], {}, { a: '[[items|upper]]' });
check('a list is described as a list', /list/.test(warnings[0]), true);

warnings.length = 0;
deepReplace([{ tap: { action: 'toggle' } }], {}, { a: '[[tap|lower]]', b: 'x [[tap|lower]] y', c: '[[tap|lower]]' });
check('the same mistake in several places is said once', warnings.length, 1);

warnings.length = 0;
deepReplace([{ tap: { action: 'toggle' } }], {}, { a: '[[tap|lower]]', b: '[[tap|upper]]' });
check('two different transforms on it are both named', warnings.length, 1);
check('and both appear in the one warning', /tap\|lower/.test(warnings[0]) && /tap\|upper/.test(warnings[0]), true);

warnings.length = 0;
deepReplace([{ tap: { action: 'toggle' } }], {}, { a: '[[tap]]' });
check('using a mapping without a transform is fine, and silent', warnings.length, 0);

warnings.length = 0;
deepReplace([{ room: 'Hall' }], {}, { a: '[[room|slug]]' });
check('a transform that works says nothing', warnings.length, 0);

warnings.length = 0;
deepReplace([{ nothing: null }], {}, { a: '[[nothing|upper]]' });
check('null is a scalar, so it transforms and stays silent', warnings.length, 0);

console.warn = realWarn;

check(
  'a transform on a mapping or list is left unsubstituted, as a visible mistake',
  deepReplace([{ tap: { action: 'toggle' } }], {}, { a: 'x [[tap]]', b: 'x [[tap|lower]]', c: '[[tap|lower]]' }),
  { a: 'x {"action":"toggle"}', b: 'x [[tap|lower]]', c: '[[tap|lower]]' },
);

check('a transform on a number still works, it is a scalar', deepReplace([{ n: 42 }], {}, { a: 'x [[n|upper]]' }), {
  a: 'x 42',
});

check('transforms chain, left to right', deepReplace([{ room: 'Living Room' }], {}, { a: '[[room|slug|upper]]' }), {
  a: 'LIVING_ROOM',
});

check('kebab spells a slug with dashes', deepReplace([{ room: 'Living Room' }], {}, { a: 'x-[[room|kebab]]' }), {
  a: 'x-living-room',
});

check(
  'an unknown transform anywhere in a chain leaves the placeholder visible',
  deepReplace([{ room: 'Hall' }], {}, { a: '[[room|slug|shout]]' }),
  { a: '[[room|slug|shout]]' },
);

check(
  'an escaped placeholder is written out literally, even when the variable exists',
  deepReplace([{ room: 'Hall' }], {}, { a: '[[!room]]', b: '[[room]]' }),
  { a: '[[room]]', b: 'Hall' },
);

check('an escape works when there are no variables at all', deepReplace(undefined, {}, { a: '[[!room]]' }), {
  a: '[[room]]',
});

check('an escape keeps a transform suffix intact', deepReplace([{ room: 'Hall' }], {}, { a: '[[!room|slug]]' }), {
  a: '[[room|slug]]',
});

check(
  'an escape inside a variable value survives to the end',
  deepReplace([{ room: 'Hall' }, { note: 'write [[!room]] for the name' }], {}, { a: '[[note]]' }),
  { a: 'write [[room]] for the name' },
);

// console.warn was handed back above; take it again for the warnings below.
console.warn = (m) => warnings.push(m);

// A variable nobody set renders as the literal [[name]]. The editors say so while you are
// editing; these are about the running card saying it too.

warnings.length = 0;
check(
  'a variable with no value at all still renders as written',
  deepReplace(undefined, {}, { type: 'tile', name: '[[name]]' }),
  { type: 'tile', name: '[[name]]' },
);
check('and warns about it', warnings.length, 1);
check('naming the variable', /\[\[name\]\]/.test(warnings[0]), true);

warnings.length = 0;
deepReplace(undefined, {}, { name: '[[name]]' }, 'room_tile');
check('the warning names the template when it is known', /room_tile/.test(warnings[0]), true);

warnings.length = 0;
deepReplace([{ other: 1 }], {}, { name: '[[name]]' });
check('an unset variable warns even when other variables resolved', warnings.length, 1);

warnings.length = 0;
check('several unset variables are said once', deepReplace(undefined, {}, { a: '[[one]]', b: '[[two]]' }), {
  a: '[[one]]',
  b: '[[two]]',
});
check('in a single warning', warnings.length, 1);
check('naming both', /\[\[one\]\]/.test(warnings[0]) && /\[\[two\]\]/.test(warnings[0]), true);

warnings.length = 0;
deepReplace([{ room: 'Hall' }], {}, { a: '[[room]]' });
check('a variable that resolves says nothing', warnings.length, 0);

warnings.length = 0;
deepReplace(undefined, {}, { a: '[[!room]]' });
check('an escaped placeholder is not an unset variable', warnings.length, 0);

warnings.length = 0;
deepReplace([{ room: 'Hall' }], {}, { a: '[[!room]]', b: '[[room]]' });
check('nor is one sitting beside a real variable', warnings.length, 0);

warnings.length = 0;
deepReplace([{ tap: { action: 'toggle' } }], {}, { a: '[[tap|lower]]' });
check('a refused transform warns once, not twice', warnings.length, 1);
check('and it is the transform message, not this one', /transform/.test(warnings[0]), true);

warnings.length = 0;
deepReplace([{ room: 'Hall' }], {}, { a: '[[room]]', b: '[[missing]]' });
check('an unset variable is still caught alongside one that resolved', warnings.length, 1);
check('naming only the unset one', /\[\[missing\]\]/.test(warnings[0]) && !/\[\[room\]\]/.test(warnings[0]), true);

console.warn = realWarn;

report();
