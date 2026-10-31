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
