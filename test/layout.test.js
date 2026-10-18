/*
 * Unit tests for src/layout.ts - how many columns a repeated template gets at a given
 * width. Run with `npm test`.
 */
const {
  columnsFor,
  gridSize,
  eagerCopies,
  placeholderHeight,
  LAZY_EAGER,
  LAZY_MIN_HEIGHT,
  LAZY_MARGIN,
} = require('../.test-build/layout.js');

const { check, report } = require('./harness');

check('without a minimum width the count is exactly what was asked for', columnsFor(300, 4), 4);

check('a width that fits every column uses them all', columnsFor(1200, 4, 250), 4);

check('a narrower card drops columns to keep each one wide enough', columnsFor(700, 4, 250), 2);

check('a phone gets a single column', columnsFor(380, 4, 250), 1);

check('columns is a ceiling, never a floor', columnsFor(4000, 2, 250), 2);

check('never fewer than one column, however narrow', columnsFor(10, 4, 250), 1);

check('an unmeasured card lays out at the most columns, then narrows', columnsFor(0, 3, 250), 3);

check('a nonsense minimum width is ignored', columnsFor(700, 3, 0), 3);

check('a nonsense column count still gives one column', columnsFor(700, 0), 1);

/* ------------------------------------------------------- a group's cells (#176) */

check('a card that asks for nothing gets the whole row, as high as it needs', gridSize({}), {
  columns: 12,
  rows: 'auto',
});

check('nothing at all is the same as nothing asked for', gridSize(undefined), { columns: 12, rows: 'auto' });

check('a tile keeps the size it asks for', gridSize({ columns: 6, rows: 1, min_columns: 6, min_rows: 1 }), {
  columns: 6,
  rows: 1,
});

check('a size below the card minimum is raised to it', gridSize({ columns: 3, min_columns: 6 }), {
  columns: 6,
  rows: 'auto',
});

check('a size above the card maximum is lowered to it', gridSize({ rows: 9, max_rows: 4 }), { columns: 12, rows: 4 });

check('full stays full', gridSize({ columns: 'full' }), { columns: 'full', rows: 'auto' });

/* ------------------------------------------------------------- lazy repeats */

check('a repeat that is not lazy builds every copy', eagerCopies(200, undefined, undefined), 200);

check('a lazy repeat builds the first six', eagerCopies(200, true, undefined), 6);

check('or as many as it asks for', eagerCopies(200, true, 20), 20);

check('none at once is allowed', eagerCopies(200, true, 0), 0);

check('never more than there are', eagerCopies(4, true, 10), 4);

check(
  'a count that is not a number is the default',
  [eagerCopies(50, true, 'many'), eagerCopies(50, true, '')],
  [6, 6],
);

check(
  'a negative count builds nothing at once, a fraction rounds down',
  [eagerCopies(50, true, -3), eagerCopies(50, true, 2.7)],
  [0, 2],
);

check('only true turns it on', eagerCopies(50, 'yes', 2), 50);

check('a preview or debug builds everything', eagerCopies(50, true, 2, true), 50);

check('a waiting copy keeps the room a built one took', placeholderHeight(120), 120);

check(
  'with nothing measured it keeps the default',
  [placeholderHeight(0), placeholderHeight(undefined), placeholderHeight(NaN)],
  [LAZY_MIN_HEIGHT, LAZY_MIN_HEIGHT, LAZY_MIN_HEIGHT],
);

check(
  'the default is 56 pixels, and copies start building 300 pixels out',
  [LAZY_MIN_HEIGHT, LAZY_MARGIN, LAZY_EAGER],
  [56, '300px', 6],
);

report();
