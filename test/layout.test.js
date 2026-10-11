/*
 * Unit tests for src/layout.ts - how many columns a repeated template gets at a given
 * width. Run with `npm test`.
 */
const { columnsFor, gridSize } = require('../.test-build/layout.js');

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

report();
