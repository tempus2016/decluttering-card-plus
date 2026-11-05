/*
 * Idea 21 on a Home Assistant with ha-generic-picker: the editor's rows become that
 * picker's items, and the headings go back in front of their groups after it has filtered.
 */
const { check } = require('./check');
const { comboItems, pickerList } = require('../.test-build/card-editor/generic-picker');

const items = [
  { value: 'plain', label: 'plain', count: 2, deprecated: false, search: 'plain' },
  {
    value: 'room_tile',
    label: 'room_tile',
    description: 'A tile per room',
    category: 'Rooms',
    count: 0,
    deprecated: false,
    search: 'room_tile a tile per room rooms',
  },
  { value: 'room_row', label: 'room_row', category: 'Rooms', count: 1, deprecated: false, search: 'room_row rooms' },
  { value: 'lent', label: 'lent', borrowed: 'library', count: 3, deprecated: false, search: 'lent library' },
];

const combo = comboItems(items);
check(
  'every row becomes an item with the name first and the description and count under it',
  combo.map((item) => [item.id, item.primary, item.secondary]),
  [
    ['plain', 'plain', 'used by 2 cards'],
    ['room_tile', 'room_tile', 'A tile per room · unused'],
    ['room_row', 'room_row', 'used by 1 card'],
    ['lent', 'lent', 'used by 3 cards'],
  ],
);
check(
  "the sorting label keeps the editor's order when the picker sorts anyway",
  combo.map((item) => item.sorting_label),
  ['000000', '000001', '000002', '000003'],
);
check('the search text travels with the item', combo[1].search, 'room_tile a tile per room rooms');

// Round 2 (idea 21): Home Assistant draws a plain string in the item list as a section
// title, and calls searchFn only once something is typed - so the headings come from the
// list itself, with and without a search, and the search is the editor's own.
const label = (entry) => (typeof entry === 'string' ? '# ' + entry : entry.id);
check(
  'the unfiltered list leads each group with its heading: none for the plain ones, the category, the lender',
  pickerList(items, '').map(label),
  ['plain', '# Rooms', 'room_tile', 'room_row', '# Borrowed from library', 'lent'],
);
check(
  'a search keeps only what matches, with the headings of the groups that keep something',
  pickerList(items, 'row').map(label),
  ['# Rooms', 'room_row'],
);
check('every word has to match, as in the editor', pickerList(items, 'room tile').map(label), ['# Rooms', 'room_tile']);
check('the lender is searchable', pickerList(items, 'library').map(label), ['# Borrowed from library', 'lent']);
check('nothing matches, nothing shown', pickerList(items, 'zzz'), []);
check('items are the picker items, not copies with a different shape', pickerList(items, 'plain')[0], combo[0]);
