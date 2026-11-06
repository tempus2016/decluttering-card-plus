/*
 * Unit tests for src/skeleton.ts (idea 48): how much room a card holds while it is on its way.
 */
const { skeletonHeight, skeletonRows, SKELETON_ROW_HEIGHT, SKELETON_ROW_GAP } = require('../.test-build/skeleton.js');

const { check } = require('./check');

check('a section row is 56px with 8px between', [SKELETON_ROW_HEIGHT, SKELETON_ROW_GAP], [56, 8]);
check('three rows hold three rows and two gaps', skeletonHeight({ rows: 3 }), 3 * 56 + 2 * 8);
check('one row for a card that asks for nothing', [skeletonHeight(undefined), skeletonHeight({})], [56, 56]);
check('rows written as text still count', skeletonHeight({ rows: '2' }), 2 * 56 + 8);
check(
  'auto, full or nonsense rows hold one row',
  [skeletonHeight({ rows: 'auto' }), skeletonHeight({ rows: 'full' }), skeletonHeight({ rows: -1 })],
  [56, 56, 56],
);
check(
  'skeletonRows reads the number or nothing',
  [skeletonRows({ rows: 4 }), skeletonRows({ rows: 'auto' })],
  [4, undefined],
);
