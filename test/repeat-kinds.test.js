/*
 * Unit tests for src/repeat-kinds.ts and the config of the wrapper in src/row-repeat.ts (idea 34).
 */
const { canRepeat, ignoredRepeatOptions } = require('../.test-build/repeat-kinds.js');

const { check } = require('./check');

check(
  'cards, rows and elements repeat; a badge does not',
  [canRepeat('card'), canRepeat('row'), canRepeat('element'), canRepeat('badge'), canRepeat(undefined)],
  [true, true, true, false, false],
);

check('a card ignores none of its options', ignoredRepeatOptions({ columns: 2, lazy: true }, 'card'), []);
check(
  'a row ignores the grid and lazy options, named in the order written',
  ignoredRepeatOptions({ template: 't', columns: 2, gap: 4, lazy: true, for_each: [1], empty: {} }, 'row'),
  ['columns', 'gap', 'lazy'],
);
check('an element the same', ignoredRepeatOptions({ min_column_width: 200, lazy_eager: 2 }, 'element'), [
  'min_column_width',
  'lazy_eager',
]);
check(
  'nothing written, nothing ignored',
  [ignoredRepeatOptions({}, 'row'), ignoredRepeatOptions(undefined, 'row')],
  [[], []],
);
