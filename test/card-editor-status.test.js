/*
 * The card editor's order: the required-set counter over the variables, and the one status
 * line the diagnostics fold into under the preview. Pure parts.
 */
const { check } = require('./check');
const {
  requiredProgress,
  statusParts,
  statusLevel,
  namesToFill,
  repeatsNow,
} = require('../.test-build/card-editor/status');

const declarations = [
  { name: 'entity', required: true },
  { name: 'name', required: true },
  { name: 'icon' },
  { name: 'secret', required: true },
];

// --- requiredProgress ---

check('none set', requiredProgress(declarations, new Set(), ['entity', 'name', 'secret']), { set: 0, total: 3 });
check('one of two, a hidden one not counted', requiredProgress(declarations, new Set(['secret']), ['name']), {
  set: 1,
  total: 2,
});
check('all set', requiredProgress(declarations, new Set(), []), { set: 3, total: 3 });
check('an optional one unset is not counted', requiredProgress(declarations, new Set(), ['icon']), {
  set: 3,
  total: 3,
});
check('no required variables, nothing to count', requiredProgress([{ name: 'a' }], new Set(), []), {
  set: 0,
  total: 0,
});

// --- statusParts ---

check('nothing to say', statusParts({ toFill: 0, errors: 0, warnings: 0, notes: 0 }), []);
check('the mockup line: one to fill and one warning', statusParts({ toFill: 1, errors: 0, warnings: 1, notes: 0 }), [
  { key: 'editor.status.fill_one', count: 1 },
  { key: 'editor.status.warning_one', count: 1 },
]);
check('plurals, in reading order', statusParts({ toFill: 2, errors: 3, warnings: 0, notes: 4 }), [
  { key: 'editor.status.fill_many', count: 2 },
  { key: 'editor.status.error_many', count: 3 },
  { key: 'editor.status.note_many', count: 4 },
]);

// --- statusLevel ---

check('nothing: no level', statusLevel({ toFill: 0, errors: 0, warnings: 0, notes: 0 }), undefined);
check('notes only: info', statusLevel({ toFill: 0, errors: 0, warnings: 0, notes: 2 }), 'info');
check('a variable to fill: warning', statusLevel({ toFill: 1, errors: 0, warnings: 0, notes: 0 }), 'warning');
check('an error wins', statusLevel({ toFill: 1, errors: 1, warnings: 1, notes: 1 }), 'error');

// --- namesToFill ---

check('the two lists, once each', namesToFill(['a', 'b'], ['b', 'c']), ['a', 'b', 'c']);

// --- repeatsNow ---

check('a single card does not repeat', repeatsNow({ template: 't' }), false);
check('for_each repeats', repeatsNow({ template: 't', for_each: [] }), true);
check('for_each_from repeats', repeatsNow({ template: 't', for_each_from: { area: 'x' } }), true);
check('an empty card left over counts', repeatsNow({ template: 't', empty: { type: 'markdown' } }), true);
check('a mapping by domain repeats', repeatsNow({ template_by_domain: { light: 'a' } }), true);
check('no config', repeatsNow(undefined), false);
