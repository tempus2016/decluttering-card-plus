/*
 * #344: `editor_hide:` - what a template says its card editor can do without. Pure: which
 * parts are left out for a card, and that a part the card already uses never is.
 */
const { check } = require('./check');
const { hiddenNames, unknownHidden, editorHidden, withoutFields } = require('../.test-build/card-editor/hide');

const base = { type: 'custom:decluttering-card-plus', template: 'camera' };
const nothing = {
  repeat: false,
  extras: false,
  fit: false,
  advanced: false,
  defaults: false,
  preview: false,
  advancedFields: [],
};

check('no editor_hide hides nothing', editorHidden({ card: {} }, base), nothing);
check('no template hides nothing', editorHidden(undefined, base), nothing);
check('one name on its own counts as a list of one', hiddenNames({ editor_hide: 'repeat' }), ['repeat']);
check(
  'names are trimmed and lower-cased, and what is not a name is dropped',
  hiddenNames({ editor_hide: [' Repeat ', 'ADVANCED', 3, null, ''] }),
  ['repeat', 'advanced'],
);

check(
  'every part named is hidden on a card that uses none of them',
  editorHidden({ editor_hide: ['repeat', 'extras', 'fit', 'advanced'] }, base),
  { repeat: true, extras: true, fit: true, advanced: true, defaults: false, preview: false, advancedFields: [] },
);

// A part the card uses is kept, or what is written there could never be seen or taken out.
for (const key of ['for_each', 'for_each_from', 'columns', 'min_column_width', 'gap', 'lazy', 'lazy_eager', 'empty']) {
  check(
    `repeat stays while the card has ${key}`,
    editorHidden({ editor_hide: 'repeat' }, { ...base, [key]: 1 }).repeat,
    false,
  );
}
check(
  'extras stay while the card has some',
  editorHidden({ editor_hide: 'extras' }, base, [{ other: 1 }]).extras,
  false,
);
check('an empty extras list does not count', editorHidden({ editor_hide: 'extras' }, base, []).extras, true);
check(
  'fit stays while the card sets it',
  editorHidden({ editor_hide: 'fit' }, { ...base, fit: 'contents' }).fit,
  false,
);
check(
  'advanced stays while the card sets any of it',
  editorHidden({ editor_hide: 'advanced' }, { ...base, strict: true }).advanced,
  false,
);

check(
  'Advanced fields are hidden one by one, under the names the form uses',
  editorHidden({ editor_hide: ['rebuild_on', 'inherit_variables', 'grid_options', 'on_error'] }, base).advancedFields,
  ['grid_columns', 'grid_rows', 'on_error_mode', 'rebuild_on', 'inherit_variables'],
);
check(
  'an Advanced field the card sets is kept',
  editorHidden({ editor_hide: ['rebuild_on', 'inherit_variables'] }, { ...base, rebuild_on: 'light.a' }).advancedFields,
  ['inherit_variables'],
);

check(
  'unknown names are reported with the closest known one',
  unknownHidden({ editor_hide: ['repeat', 'advnced', 'repeating_for_with'] }),
  [{ name: 'advnced', closest: 'advanced' }, { name: 'repeating_for_with' }],
);
check('known names are not reported', unknownHidden({ editor_hide: ['repeat', 'rebuild_on'] }), []);

const schema = [{ name: 'style' }, { name: 'strict' }, { name: 'debug' }];
check('withoutFields drops the fields named', withoutFields(schema, ['strict']), [
  { name: 'style' },
  { name: 'debug' },
]);
check('withoutFields with nothing named returns the schema as it was', withoutFields(schema, []), schema);

check(
  'editor_hide: strict hides both strict dropdowns (#390)',
  editorHidden({ editor_hide: 'strict' }, base).advancedFields,
  ['strict_errors', 'strict_warnings'],
);

// #483: the default line under a set field can be left out too.
check('defaults hides the default lines', editorHidden({ editor_hide: 'defaults' }, base).defaults, true);
check('defaults is a name the editor knows', unknownHidden({ editor_hide: 'defaults' }), []);

// #488: the "What it builds" panel can be left out. Nothing is written from it, so it goes
// whatever the card holds.
check('editor_hide: preview leaves the panel out', editorHidden({ editor_hide: 'preview' }, base).preview, true);
check(
  'preview goes even on a card that sets everything else',
  editorHidden({ editor_hide: ['preview'] }, { ...base, for_each: ['a'], fit: 'contents', strict: true }).preview,
  true,
);
check('preview is a known name, so lint says nothing', unknownHidden({ editor_hide: ['Preview'] }), []);
check('a near miss is pointed at preview', unknownHidden({ editor_hide: 'preveiw' }), [
  { name: 'preveiw', closest: 'preview' },
]);
