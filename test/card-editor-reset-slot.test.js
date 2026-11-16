/*
 * #255 follow-up: only a declared field that could ever show a Reset keeps the Reset's place.
 * Pure: the decision from the field's reset target and whether the field is disabled.
 */
const { check } = require('./check');
const { hasResetSlot } = require('../.test-build/card-editor/defaults');

check('a field with a default the card sets keeps the slot', hasResetSlot({ set: true }, false), true);
check('a field with a default the card does not set yet keeps the slot', hasResetSlot({ set: false }, false), true);
check('a field with no default has no slot', hasResetSlot(undefined, false), false);
check('disabled not given counts as enabled', hasResetSlot({ set: false }), true);
check('a disabled field never has a slot, even with a default', hasResetSlot({ set: true }, true), false);
check('a disabled field with no default has no slot', hasResetSlot(undefined, true), false);
