/*
 * Unit tests for src/declarations-rows.ts - the declarations editor's table (idea 23).
 * Run with `npm test`.
 */
const {
  shapeOf,
  rowsFrom,
  variablesFrom,
  emptyRow,
  uniqueName,
  withField,
  moveRow,
  groupStarts,
  rowType,
  withType,
} = require('../.test-build/declarations-rows.js');

const { check } = require('./check');

const roundTrip = (variables) => variablesFrom(rowsFrom(variables), shapeOf(variables));

// --- shapes ---------------------------------------------------------------------------
check('a list is a list', shapeOf([{ name: 'a' }]), 'list');
check('a mapping is a mapping', shapeOf({ a: 'x' }), 'mapping');
check('nothing is none', [shapeOf(undefined), shapeOf(null), shapeOf('x')], ['none', 'none', 'none']);

// --- round trips, list form ------------------------------------------------------------
const list = [
  { name: 'entity', type: 'entity', domain: 'light', required: true, description: 'The light' },
  { name: 'name', label: 'Name', default: '[[entity|area]]' },
  { name: 'colour', type: 'select', allowed: ['amber', 'blue'], group: 'Appearance', default: 'amber' },
  { name: 'odd', weird_key: { nested: true }, default: 1, another: 'kept' },
  { name: 'cardy', selector: { card: {} } },
];
check('a list round-trips unchanged, unknown keys included', roundTrip(list), list);
check(
  'key order of a written declaration survives the round trip',
  Object.keys(roundTrip([{ name: 'x', default: 1, type: 'number', label: 'X' }])[0]),
  ['name', 'default', 'type', 'label'],
);

// --- round trips, mapping form (#223) --------------------------------------------------
const mapping = {
  colour: 'red',
  size: 3,
  flags: ['a', 'b'],
  bare: null,
  full: { type: 'entity', domain: 'light', default: 'light.x' },
  objDefault: { default: { a: 1 } },
};
check('a mapping round-trips unchanged in every short form', roundTrip(mapping), mapping);
check(
  'rows read from a mapping carry the right fields',
  rowsFrom(mapping).map((row) => [row.name, row.default, row.type]),
  [
    ['colour', 'red', undefined],
    ['size', 3, undefined],
    ['flags', ['a', 'b'], undefined],
    ['bare', undefined, undefined],
    ['full', 'light.x', 'entity'],
    ['objDefault', { a: 1 }, undefined],
  ],
);
check('nothing in gives nothing out', roundTrip(undefined), undefined);
check('an emptied list of rows from a list is an empty list', variablesFrom([], 'list'), []);

// --- editing ---------------------------------------------------------------------------
const rows = rowsFrom(list);
check('a new row takes a free name', emptyRow(rows).name, 'variable');
check('free names count up past the taken ones', uniqueName(rows, 'name'), 'name_2');
check(
  'changing a field writes it, removing one drops the key',
  (() => {
    const changed = withField(rows[1], 'label', 'Room');
    const dropped = withField(changed, 'default', undefined);
    return [changed.label, changed.default, dropped.default, 'default' in dropped];
  })(),
  ['Room', '[[entity|area]]', undefined, false],
);
check(
  'a new field goes after the written ones, in a round trip',
  Object.keys(variablesFrom([withField(rows[1], 'required', true)], 'list')[0]),
  ['name', 'label', 'default', 'required'],
);
check(
  'moving a row reorders, and a no-op move returns the same list',
  [moveRow(rows, 0, 2).map((row) => row.name), moveRow(rows, 1, 1) === rows, moveRow(rows, 9, 0) === rows],
  [['name', 'colour', 'entity', 'odd', 'cardy'], true, true],
);
check(
  'a group heading starts where the group changes',
  groupStarts(
    rowsFrom([{ name: 'a' }, { name: 'b', group: 'G' }, { name: 'c', group: 'G' }, { name: 'd', group: 'H' }]),
  ),
  [undefined, 'G', undefined, 'H'],
);
check('the type column shows a type, card for a card selector, blank otherwise', rows.map(rowType), [
  'entity',
  '',
  'select',
  '',
  'card',
]);
check(
  'setting the type to card writes a selector and clears the type; blank clears both',
  (() => {
    const asCard = withType(rows[0], 'card');
    const blank = withType(asCard, '');
    const number = withType(blank, 'number');
    return [asCard.type, asCard.selector, blank.type, blank.selector, number.type, number.selector];
  })(),
  [undefined, { card: {} }, undefined, undefined, 'number', undefined],
);

// --- review: an edit to one field leaves the others as written ---------------------------
const {
  isOpaqueRow,
  rowKeys,
  builtinType,
  shownDefault,
  defaultFromEdit,
  moreData,
  withMore,
} = require('../.test-build/declarations-rows.js');

const rowOf = (declaration) => rowsFrom([declaration])[0];

// The row form sends the default back as the text it showed.
const unchanged = (declaration) => {
  const row = rowOf(declaration);
  return defaultFromEdit(row, shownDefault(row), builtinType(row));
};
check(
  'a number default with no type is not an edit when it comes back as text',
  unchanged({ name: 'columns', default: 3 }),
  {
    changed: false,
  },
);
check('nor is a false', unchanged({ name: 'show', default: false }), { changed: false });
check('nor a select default', unchanged({ name: 'n', type: 'select', allowed: [1, 2], default: 2 }), {
  changed: false,
});
check('nor a mapping handed back as a copy', defaultFromEdit(rowOf({ name: 'm', default: { a: 1 } }), { a: 1 }, ''), {
  changed: false,
});
check('an empty box where there was no default is not an edit', defaultFromEdit(rowOf({ name: 'x' }), '', ''), {
  changed: false,
});
check('typed text is the text', defaultFromEdit(rowOf({ name: 'x', default: 3 }), '4', ''), {
  changed: true,
  value: '4',
});
check(
  'typed into a number variable it is a number',
  defaultFromEdit(rowOf({ name: 'x', type: 'number' }), '4', 'number'),
  {
    changed: true,
    value: 4,
  },
);
check(
  'typed into a boolean variable it is yes or no',
  defaultFromEdit(rowOf({ name: 'x', type: 'boolean' }), 'False', 'boolean'),
  {
    changed: true,
    value: false,
  },
);
check('an emptied box takes the default out', defaultFromEdit(rowOf({ name: 'x', default: 3 }), '', ''), {
  changed: true,
});
check(
  'a named type comes down to the built-in one it says',
  [
    builtinType(rowOf({ name: 'x', type: 'percent' }), { percent: { type: 'number' } }),
    builtinType(rowOf({ name: 'x', type: 'number' })),
    builtinType(rowOf({ name: 'x', type: 'mystery' })),
  ],
  ['number', 'number', 'mystery'],
);

// More settings: only the field that was edited is written.
const rich = rowOf({
  name: 'level',
  type: 'select',
  allowed: [1, 2, 3],
  min: '[[lowest]]',
  max: 10,
  domain: ['light', 'switch'],
  multiple: false,
});
const describedRow = withMore(rich, { ...moreData(rich), description: 'How bright' });
check('a description typed leaves a list of numbers as numbers', describedRow.allowed, [1, 2, 3]);
check('and a placeholder minimum where it was', [describedRow.min, describedRow.max], ['[[lowest]]', 10]);
check('and the domains a list', describedRow.domain, ['light', 'switch']);
check('and an explicit false as written', describedRow.multiple, false);
check('the description is set', describedRow.description, 'How bright');
check(
  'an edit to the allowed values is read as a list',
  withMore(rich, { ...moreData(rich), allowed: 'a, b' }).allowed,
  ['a', 'b'],
);
check(
  'one made from a placeholder stays text',
  withMore(rich, { ...moreData(rich), allowed: '[[choices]]' }).allowed,
  '[[choices]]',
);
check('a cleared number goes', withMore(rich, { ...moreData(rich), max: undefined }).max, undefined);
check('one domain is a word', withMore(rich, { ...moreData(rich), domain: 'light' }).domain, 'light');
check('a switch turned on is written', withMore(rich, { ...moreData(rich), multiple: true }).multiple, true);
check('nothing edited is the same row', withMore(rich, moreData(rich)), rich);

// Entries the table cannot draw pass through as they were written.
const odd = ['entity', { entity: 'sun.sun' }, null, { name: 'real', default: 1 }, { note: 'a note' }];
check('a list with entries the table cannot draw round-trips', roundTrip(odd), odd);
check('they are rows the table does not draw', rowsFrom(odd).map(isOpaqueRow), [true, true, true, false, false]);
const editedOdd = rowsFrom(odd).map((row) => (row.name === 'real' ? withField(row, 'label', 'Real') : row));
check('and survive an edit to the row beside them', variablesFrom(editedOdd, 'list'), [
  'entity',
  { entity: 'sun.sun' },
  null,
  { name: 'real', default: 1, label: 'Real' },
  { note: 'a note' },
]);

// Two rows of one name get a key each.
const twice = rowsFrom([{ name: 'a' }, { name: 'a' }, { note: 'x' }, { note: 'y' }, 'bare', { name: 'b' }]);
check('every row has a key no other row has', new Set(rowKeys(twice)).size, twice.length);
check('a name used once keeps it as its key', [rowKeys(twice)[0], rowKeys(twice)[5]], ['a', 'b']);
