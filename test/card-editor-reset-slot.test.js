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

/*
 * #483: the line under a field that says what it would go back to. It only shows once the
 * card sets the field - an unset field already shows its default in the field itself - and a
 * template can leave it out with `editor_hide: defaults`.
 */
const { defaultLine } = require('../.test-build/card-editor/defaults');

check(
  'a field the card sets says what its default is',
  defaultLine({ text: 'camera.porch', source: 'template', set: true }),
  { key: 'editor.default.template', value: 'camera.porch' },
);
check('a default from somewhere else keeps its source', defaultLine({ text: 'red', source: 'view', set: true }), {
  key: 'editor.default.view',
  value: 'red',
});
check(
  'a field still at its default has no line',
  defaultLine({ text: 'camera.porch', source: 'template', set: false }),
  undefined,
);
check('a field with no default has no line', defaultLine(undefined), undefined);
check(
  'a template that hides defaults has no line',
  defaultLine({ text: 'camera.porch', source: 'template', set: true }, true),
  undefined,
);
