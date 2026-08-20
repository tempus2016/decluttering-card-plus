/*
 * Unit tests for src/variables.ts - how a template declares its variables, which values
 * win when the same name is defined in more than one place, and what the editors warn
 * about. Run with `npm test`.
 */
const {
  applyTransform,
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
  ['index', 'count', 'entity', 'name', 'colour'],
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
  ['index', 'count', 'entity', 'name'],
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
  { count: 3 },
]);

check(
  'index counts from one, so a copy can number itself',
  forEachVariables({}, undefined, 2, 3).find((entry) => 'index' in entry),
  { index: 3 },
);

check('an item setting index itself wins over the automatic one', forEachVariables({ index: 'A' }, undefined, 0, 2), [
  { index: 'A' },
  { index: 1 },
  { count: 2 },
]);

check(
  'without a position nothing extra is added, so a plain call is unchanged',
  forEachVariables({ entity: 'light.hall' }, undefined),
  [{ entity: 'light.hall' }],
);

check(
  'index and count count as supplied, so a template using them is not missing them',
  forEachNames([{ entity: 'light.hall' }, { entity: 'light.kitchen' }]).sort(),
  ['count', 'entity', 'index'],
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

report();
