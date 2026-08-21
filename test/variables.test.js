/*
 * Unit tests for src/variables.ts - how a template declares its variables, which values
 * win when the same name is defined in more than one place, and what the editors warn
 * about. Run with `npm test`.
 */
const {
  applyTransform,
  resolveFallback,
  isFallback,
  orTarget,
  hasRequiredVariables,
  isOptional,
  withoutOptional,
  isResolver,
  usesResolver,
  getDeclarations,
  usedVariables,
  resolveVariables,
  diagnoseInstance,
  diagnoseTemplate,
  mergeVariables,
  variableName,
  variableValues,
  forEachVariables,
  forEachNames,
  forEachItems,
  normaliseVariables,
} = require('../.test-build/variables.js');

const { check, report } = require('./harness');

/* ------------------------------------------------------------------ declarations */

check('a template with no variables key declares nothing', getDeclarations({ card: { type: 'tile' } }), []);

check(
  'declarations keep their order, label, description and selector',
  getDeclarations({
    variables: [
      { name: 'entity', label: 'Light', description: 'Which light', selector: { entity: {} } },
      { name: 'colour', default: 'red' },
    ],
    card: {},
  }),
  [
    { name: 'entity', label: 'Light', description: 'Which light', selector: { entity: {} } },
    { name: 'colour', default: 'red' },
  ],
);

check(
  'a declaration without a name is dropped rather than breaking the card',
  getDeclarations({ variables: [{ label: 'Nameless' }, { name: 'kept' }], card: {} }),
  [{ name: 'kept' }],
);

check(
  'a declaration whose name repeats an earlier one is dropped',
  getDeclarations({
    variables: [
      { name: 'a', label: 'First' },
      { name: 'a', label: 'Second' },
    ],
    card: {},
  }),
  [{ name: 'a', label: 'First' }],
);

check('a variables key that is not a list declares nothing', getDeclarations({ variables: 'nonsense', card: {} }), []);

/* ------------------------------------------------------------------- usage */

check('placeholders are found anywhere in the content', usedVariables({ card: { entity: '[[entity]]' } }), ['entity']);

check('placeholders are found in the style block', usedVariables({ card: {}, style: 'border: [[colour]]' }), [
  'colour',
]);

check(
  'a placeholder reached only through another variable counts as used',
  usedVariables({ card: { name: '[[label]]' }, default: [{ label: '[[area]] sensor' }] }),
  ['label', 'area'],
);

check(
  'a placeholder inside a variable nothing refers to does not count as used',
  usedVariables({ card: { name: 'fixed' }, default: [{ unused: '[[invisible]]' }] }),
  [],
);

check(
  'a variable that refers to itself does not loop',
  usedVariables({ card: { name: '[[a]]' }, default: [{ a: '[[a]]' }] }),
  ['a'],
);

check(
  'a transformed placeholder is a use of the variable, not of a name with a bar in it',
  usedVariables({ card: { entity: 'light.[[room|slug]]' } }),
  ['room'],
);

check(
  'a variable used only through a transform is not reported as missing',
  diagnoseInstance([{ room: 'Hall' }], { card: { entity: 'light.[[room|slug]]' } }),
  { missing: [], unused: [], required: [] },
);

/* ------------------------------------------------------------ normalising */

check('a mapping of variables becomes one entry per key', normaliseVariables({ entity: 'sun.sun', label: 'Sun' }), [
  { entity: 'sun.sun' },
  { label: 'Sun' },
]);

check(
  'a list entry with several keys becomes one entry per key',
  normaliseVariables([{ entity: 'sun.sun', label: 'Sun' }, { colour: 'red' }]),
  [{ entity: 'sun.sun' }, { label: 'Sun' }, { colour: 'red' }],
);

check('a list of one-key entries is unchanged', normaliseVariables([{ a: 1 }, { b: 2 }]), [{ a: 1 }, { b: 2 }]);

check('nothing normalises to nothing', normaliseVariables(undefined), []);

check('a scalar has no variables in it', normaliseVariables('nonsense'), []);

check('an entry that is not a mapping is dropped', normaliseVariables([{ a: 1 }, 'nonsense', null]), [{ a: 1 }]);

/* -------------------------------------------------------------- resolution */

check(
  'a declared default is used when the instance says nothing',
  resolveVariables(undefined, { variables: [{ name: 'colour', default: 'red' }], card: {} }),
  [{ colour: 'red' }],
);

check(
  'an instance value beats a declared default',
  resolveVariables([{ colour: 'blue' }], { variables: [{ name: 'colour', default: 'red' }], card: {} }),
  [{ colour: 'blue' }],
);

check(
  'a declared default beats the older default list',
  resolveVariables(undefined, {
    variables: [{ name: 'colour', default: 'red' }],
    default: [{ colour: 'green' }],
    card: {},
  }),
  [{ colour: 'red' }],
);

check(
  'a declaration with no default contributes no value',
  resolveVariables(undefined, { variables: [{ name: 'entity' }], default: [{ entity: 'sun.sun' }], card: {} }),
  [{ entity: 'sun.sun' }],
);

check(
  'a declared default of false is a value, not an absence',
  resolveVariables(undefined, { variables: [{ name: 'shown', default: false }], card: {} }),
  [{ shown: false }],
);

check(
  'every key of a mapping default is resolved, not just the first',
  resolveVariables(undefined, { default: { what: 'sun.sun', how: 'Boop' }, card: {} }),
  [{ what: 'sun.sun' }, { how: 'Boop' }],
);

check(
  'variables written as a mapping are resolved too',
  resolveVariables({ entity: 'sun.sun', label: 'Sun' }, { card: {} }),
  [{ entity: 'sun.sun' }, { label: 'Sun' }],
);

check(
  'a mapping of variables still beats the template default',
  resolveVariables({ colour: 'blue' }, { default: [{ colour: 'red' }], card: {} }),
  [{ colour: 'blue' }],
);

check(
  'the older default list still works on its own',
  resolveVariables([{ a: 1 }], { default: [{ b: 2 }], card: {} }),
  [{ a: 1 }, { b: 2 }],
);

/* ------------------------------------------------------------- diagnostics */

check(
  'a placeholder with no value anywhere is reported as missing',
  diagnoseInstance(undefined, { card: { entity: '[[entity]]' } }),
  { missing: ['entity'], unused: [], required: [] },
);

check(
  'a placeholder the instance supplies is not missing',
  diagnoseInstance([{ entity: 'sun.sun' }], { card: { entity: '[[entity]]' } }),
  { missing: [], unused: [], required: [] },
);

check(
  'a placeholder with a declared default is not missing',
  diagnoseInstance(undefined, { variables: [{ name: 'entity', default: 'sun.sun' }], card: { entity: '[[entity]]' } }),
  { missing: [], unused: [], required: [] },
);

check(
  'a mapping of variables is not reported as missing',
  diagnoseInstance({ entity: 'sun.sun' }, { card: { entity: '[[entity]]' } }),
  { missing: [], unused: [], required: [] },
);

check(
  'every key of a mapping is checked for being unused, not just the first',
  diagnoseInstance({ entity: 'sun.sun', colour: 'red' }, { card: { entity: '[[entity]]' } }),
  { missing: [], unused: ['colour'], required: [] },
);

check(
  'a value the template never uses is reported as unused',
  diagnoseInstance([{ colour: 'red' }], { card: { entity: '[[entity]]' } }),
  { missing: ['entity'], unused: ['colour'], required: [] },
);

check(
  'a declaration the template never uses is reported',
  diagnoseTemplate({ variables: [{ name: 'colour' }], card: { entity: '[[entity]]' } }),
  { unused: ['colour'], duplicated: [], contradictory: [] },
);

check(
  'a name defined both as a declaration and in the default list is reported',
  diagnoseTemplate({
    variables: [{ name: 'colour', default: 'red' }],
    default: [{ colour: 'green' }],
    card: { name: '[[colour]]' },
  }),
  { unused: [], duplicated: ['colour'], contradictory: [] },
);

/* ------------------------------------------------------------------ reading */

check('the name of an entry is its first key', variableName({ a: 1, b: 2 }), 'a');

check('an entry that is not an object has no name', variableName('nonsense'), undefined);

check('values are read one name per entry, first definition winning', variableValues([{ a: 1 }, { a: 2 }, { b: 3 }]), {
  a: 1,
  b: 3,
});

check('reading no variables gives nothing', variableValues(undefined), {});

/* ------------------------------------------------------------------- merging */

check('merging into nothing keeps the new order', mergeVariables(undefined, [{ a: 1 }, { b: 2 }]), [
  { a: 1 },
  { b: 2 },
]);

check(
  'a value already in the config keeps its place when it changes',
  mergeVariables([{ b: 1 }, { a: 2 }], [{ a: 3 }, { b: 4 }]),
  [{ b: 4 }, { a: 3 }],
);

check('a name that is no longer wanted is dropped', mergeVariables([{ a: 1 }, { b: 2 }], [{ a: 1 }]), [{ a: 1 }]);

check('a new name is appended rather than reordering the rest', mergeVariables([{ b: 1 }], [{ b: 1 }, { a: 2 }]), [
  { b: 1 },
  { a: 2 },
]);

check('merging nothing in empties the list', mergeVariables([{ a: 1 }], []), []);

/* ------------------------------------------------------------------ for_each */

check(
  'an item written as a mapping becomes one entry per key, in order',
  forEachVariables({ entity: 'light.kitchen', name: 'Kitchen' }, undefined),
  [{ entity: 'light.kitchen' }, { name: 'Kitchen' }],
);

check(
  "an item's own values come before the card's, so the item wins",
  forEachVariables({ entity: 'light.hall' }, [{ entity: 'light.kitchen' }, { colour: 'red' }]),
  [{ entity: 'light.hall' }, { entity: 'light.kitchen' }, { colour: 'red' }],
);

check(
  'an item already written as a list of entries is taken as it is',
  forEachVariables([{ entity: 'light.hall' }], [{ colour: 'red' }]),
  [{ entity: 'light.hall' }, { colour: 'red' }],
);

check('an item that is not a set of values contributes nothing', forEachVariables('nonsense', [{ a: 1 }]), [{ a: 1 }]);

check('an item with no card variables stands alone', forEachVariables({ a: 1 }, undefined), [{ a: 1 }]);

check(
  'every name any item sets is collected, once each',
  forEachNames([{ entity: 'a', name: 'A' }, { entity: 'b' }, [{ colour: 'red' }]]),
  ['index', 'index0', 'count', 'first', 'last', 'entity', 'name', 'colour'],
);

check('names of nothing is nothing', forEachNames(undefined), []);

check(
  'card variables written as a mapping still reach every copy',
  forEachVariables({ entity: 'light.hall' }, { name: 'Kitchen' }),
  [{ entity: 'light.hall' }, { name: 'Kitchen' }],
);

check(
  'a multi-key entry in a list-form item is flattened, as substitution reads it',
  forEachVariables([{ entity: 'light.hall', name: 'Hall' }], undefined),
  [{ entity: 'light.hall' }, { name: 'Hall' }],
);

check(
  'every key of a multi-key entry counts as a name the items set',
  forEachNames([[{ entity: 'light.hall', name: 'Hall' }]]),
  ['index', 'index0', 'count', 'first', 'last', 'entity', 'name'],
);

check('a list of items passes through', forEachItems([{ a: 1 }, { b: 2 }]), [{ a: 1 }, { b: 2 }]);

check('a single mapping is one item, not a mistake', forEachItems({ entity: 'light.hall' }), [
  { entity: 'light.hall' },
]);

check('anything else is not a list to repeat over', [forEachItems('nonsense'), forEachItems(undefined)], [null, null]);

check(
  'a transform only shapes scalars; deep-replace leaves a transformed mapping visible',
  applyTransform('upper', 'toggle'),
  'TOGGLE',
);

check(
  'supplements count as supplied for missing, but are never called unused',
  diagnoseInstance([{ junk: 1 }], { card: { entity: '[[entity]]' } }, [{ entity: null }]),
  { missing: [], unused: ['junk'], required: [] },
);

check(
  'without the supplement the same variable is missing',
  diagnoseInstance([{ junk: 1 }], { card: { entity: '[[entity]]' } }),
  { missing: ['entity'], unused: ['junk'], required: [] },
);

check(
  'a supplement does not shadow a declared default, so its references still count as used',
  diagnoseInstance(
    [{ room: 'Hall' }],
    {
      variables: [{ name: 'label', default: '[[room]] light' }, { name: 'room' }],
      card: { name: '[[label]]' },
    },
    [{ label: null }],
  ),
  { missing: [], unused: [], required: [] },
);

/* ------------------------------------------------------- chained transforms */

check('transforms chain left to right', applyTransform('slug|upper', 'Living Room'), 'LIVING_ROOM');

check(
  'the order of a chain matters, because slug lowercases',
  applyTransform('upper|slug', 'Living Room'),
  'living_room',
);

check('kebab is the dashed spelling of slug', applyTransform('kebab', 'Living Room'), 'living-room');

check('a chain of one is still just that transform', applyTransform('title', 'living ROOM'), 'Living Room');

check('no transform leaves the value as its text', applyTransform(undefined, 42), '42');

/* --------------------------------------------------------- escaped placeholders */

check(
  'an escaped placeholder is not a variable the template uses',
  usedVariables({ card: { name: '[[!literal]]', entity: '[[entity]]' } }),
  ['entity'],
);

check(
  'an escaped placeholder is never reported missing',
  diagnoseInstance(undefined, { card: { name: '[[!literal]]' } }),
  { missing: [], unused: [], required: [] },
);

/* ------------------------------------------------------ for_each index and count */

check('a copy knows its position and how many there are', forEachVariables({ entity: 'light.hall' }, undefined, 0, 3), [
  { entity: 'light.hall' },
  { index: 1 },
  { index0: 0 },
  { count: 3 },
  { first: true },
  { last: false },
]);

check(
  'index counts from one, so a copy can number itself',
  forEachVariables({}, undefined, 2, 3).find((entry) => 'index' in entry),
  { index: 3 },
);

check('an item setting index itself wins over the automatic one', forEachVariables({ index: 'A' }, undefined, 0, 2), [
  { index: 'A' },
  { index: 1 },
  { index0: 0 },
  { count: 2 },
  { first: true },
  { last: false },
]);

check(
  'without a position nothing extra is added, so a plain call is unchanged',
  forEachVariables({ entity: 'light.hall' }, undefined),
  [{ entity: 'light.hall' }],
);

check(
  'index and count count as supplied, so a template using them is not missing them',
  forEachNames([{ entity: 'light.hall' }, { entity: 'light.kitchen' }]).sort(),
  ['count', 'entity', 'first', 'index', 'index0', 'last'],
);

check('an empty list supplies nothing at all', forEachNames(undefined), []);

/* ------------------------------------------------------------ required variables */

check(
  'a required variable with a default contradicts itself',
  diagnoseTemplate({
    variables: [{ name: 'entity', required: true, default: 'sun.sun' }],
    card: { entity: '[[entity]]' },
  }).contradictory,
  ['entity'],
);

check(
  'a required variable with no default is fine',
  diagnoseTemplate({ variables: [{ name: 'entity', required: true }], card: { entity: '[[entity]]' } }),
  { unused: [], duplicated: [], contradictory: [] },
);

check(
  'missing values are split by whether the template insists on them',
  diagnoseInstance(undefined, {
    variables: [{ name: 'entity', required: true }, { name: 'name' }],
    card: { entity: '[[entity]]', name: '[[name]]' },
  }),
  { missing: ['entity', 'name'], unused: [], required: ['entity'] },
);

// Values that come from Home Assistant rather than from the card's own config. A small
// house: a lamp with a friendly name, on a device, in an area.
const houseHass = {
  states: {
    'light.hall': { attributes: { friendly_name: "John's Hall Lamp", brightness: 128, icon: 'mdi:lamp' } },
    'light.bare': { attributes: {} },
  },
  entities: {
    'light.hall': { area_id: 'hall', device_id: 'dev1', name: null, original_name: 'Hall' },
    'light.bare': { device_id: 'dev2' },
  },
  devices: { dev1: { name: 'Lamp Module', name_by_user: 'Hall Lamp Module' }, dev2: { area_id: 'hall' } },
  areas: { hall: { name: 'Hallway' } },
};

check(
  'friendly_name reads the entity name',
  applyTransform('friendly_name', 'light.hall', houseHass),
  "John's Hall Lamp",
);
check('area reads the area the entity is in', applyTransform('area', 'light.hall', houseHass), 'Hallway');
check('area falls back to the device area', applyTransform('area', 'light.bare', houseHass), 'Hallway');
check(
  'device prefers the name the user gave it',
  applyTransform('device', 'light.hall', houseHass),
  'Hall Lamp Module',
);
check('attr reads one named attribute', applyTransform('attr:brightness', 'light.hall', houseHass), '128');
check('attr works for a text attribute too', applyTransform('attr:icon', 'light.hall', houseHass), 'mdi:lamp');

check(
  'a resolver runs before a transform that follows it',
  applyTransform('friendly_name|slug', 'light.hall', houseHass),
  'john_s_hall_lamp',
);
check('and chains through more than one', applyTransform('area|slug|upper', 'light.hall', houseHass), 'HALLWAY');

check(
  'an entity that does not exist resolves to nothing',
  applyTransform('friendly_name', 'light.nope', houseHass),
  undefined,
);
check(
  'an attribute it does not carry resolves to nothing',
  applyTransform('attr:nope', 'light.hall', houseHass),
  undefined,
);
check('no area on it resolves to nothing', applyTransform('area', 'light.nope', houseHass), undefined);
check('no hass at all resolves to nothing', applyTransform('friendly_name', 'light.hall', undefined), undefined);
check(
  'a transform after a resolver that found nothing gives nothing',
  applyTransform('friendly_name|slug', 'light.nope', houseHass),
  undefined,
);

check('a resolver is recognised as one', [isResolver('friendly_name'), isResolver('attr:x')], [true, true]);
check('a transform is not', [isResolver('slug'), isResolver('bogus')], [false, false]);

check(
  'a template asking Home Assistant for something says so',
  usesResolver({ card: { name: '[[entity|friendly_name]]' } }),
  true,
);
check('one using only transforms does not', usesResolver({ card: { name: '[[room|slug]]' } }), false);
check('nor does one using no placeholders', usesResolver({ card: { name: 'Hall' } }), false);
check('an escaped placeholder does not count', usesResolver({ card: { name: '[[!entity|friendly_name]]' } }), false);

check(
  'a resolver tail is stripped when counting which variables are used',
  usedVariables({ card: { entity: '[[entity]]', name: '[[entity|friendly_name]]', x: '[[room|slug]]' } }).sort(),
  ['entity', 'room'],
);

// Which items of a repeat there is actually something to render for.
const needsEntity = { variables: [{ name: 'entity', required: true }], card: { type: 'tile', entity: '[[entity]]' } };
const needsNothing = { card: { type: 'tile', entity: '[[entity]]' } };

check(
  'an item with the required variable is wanted',
  hasRequiredVariables(needsEntity, { entity: 'light.hall' }),
  true,
);
check('one leaving it out is not', hasRequiredVariables(needsEntity, { name: 'Hall' }), false);
check('nor is one leaving it empty', hasRequiredVariables(needsEntity, { entity: '' }), false);
check('nor null', hasRequiredVariables(needsEntity, { entity: null }), false);
check('a template requiring nothing wants every item', hasRequiredVariables(needsNothing, {}), true);
check('no template at all wants every item', hasRequiredVariables(undefined, {}), true);
check(
  'a shared value counts for an item that does not set it',
  hasRequiredVariables(needsEntity, { name: 'Hall' }, [{ entity: 'light.hall' }]),
  true,
);
check(
  'and the item still wins where it does set it',
  hasRequiredVariables(needsEntity, { entity: '' }, [{ entity: 'light.hall' }]),
  false,
);

check('the optional marker is recognised', [isOptional('name?'), isOptional('name')], [true, false]);
check('and taken off', [withoutOptional('name?'), withoutOptional('name|slug?')], ['name', 'name|slug']);

check(
  'an optional placeholder still counts as using its variable',
  usedVariables({ card: { a: '[[name?]]', b: '[[room|slug?]]' } }).sort(),
  ['name', 'room'],
);

/* --------------------------------------------------- stand-ins for what is missing */

check('a default step is a stand-in', [isFallback('default:Hall'), isFallback('or:other')], [true, true]);

check('a transform is not', [isFallback('slug'), isFallback('friendly_name')], [false, false]);

check('or: names the variable to try', orTarget('or:fallback'), 'fallback');

check('anything else names nothing', [orTarget('slug'), orTarget('default:x')], [null, null]);

check('a placeholder with no stand-in is left for someone else', [resolveFallback('room|slug', {})], [null]);

check('a stand-in fills a name nothing sets', resolveFallback('room|default:Hall', {}), 'Hall');

check(
  'a value that is set wins over the stand-in',
  resolveFallback('room|default:Hall', { room: 'Kitchen' }),
  'Kitchen',
);

check('null counts as nothing to show', resolveFallback('room|default:Hall', { room: null }), 'Hall');

check('a zero is a value, not a gap', resolveFallback('room|default:Hall', { room: 0 }), '0');

check('a false is a value too', resolveFallback('room|default:Hall', { room: false }), 'false');

check('or: reads another variable', resolveFallback('room|or:other', { other: 'Hall' }), 'Hall');

check(
  'or: pointing at nothing leaves it for the next stand-in',
  resolveFallback('room|or:other|default:Last resort', {}),
  'Last resort',
);

check('a mapping cannot stand in as text', [resolveFallback('room|or:other', { other: { a: 1 } })], [null]);

check('an escaped placeholder is never filled in', [resolveFallback('!room|default:Hall', {})], [null]);

check(
  'a stand-in still counts the variable as used, and or: counts its target too',
  usedVariables({ card: { a: '[[room|or:other|default:x]]' } }).sort(),
  ['other', 'room'],
);

/* ------------------------------------------------ reaching into a nested value */

check(
  'a mapping can be reached whole and a piece at a time',
  normaliseVariables({ room: { light: 'light.hall', name: 'Hall' } }),
  [{ room: { light: 'light.hall', name: 'Hall' } }, { 'room.light': 'light.hall' }, { 'room.name': 'Hall' }],
);

check(
  'nesting goes down as far as three',
  normaliseVariables({ a: { b: { c: { d: 1 } } } }).map((e) => Object.keys(e)[0]),
  ['a', 'a.b', 'a.b.c', 'a.b.c.d'],
);

check('a list is reached whole or not at all', normaliseVariables({ items: [1, 2] }), [{ items: [1, 2] }]);

check('a plain value gains nothing', normaliseVariables({ name: 'Hall' }), [{ name: 'Hall' }]);

check(
  'a for_each item can carry a room together',
  forEachVariables({ room: { light: 'light.hall' } }, undefined).map((e) => Object.keys(e)[0]),
  ['room', 'room.light'],
);

report();
