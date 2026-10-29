/*
 * Idea 22: our entry first in the add-card dialog, so the By entity tab offers our
 * suggestions before the other custom cards'. Pure part.
 */
const { check } = require('./check');
const { moveToFront } = require('../.test-build/picker');

const list = [{ type: 'a' }, { type: 'ours' }, { type: 'c' }];
check('our entry moves to the front, in place', (moveToFront(list, list[1]), list.map((e) => e.type)), [
  'ours',
  'a',
  'c',
]);
check(
  'an entry not in the list is added at the front',
  moveToFront([{ type: 'a' }], { type: 'new' }).map((e) => e.type),
  ['new', 'a'],
);
