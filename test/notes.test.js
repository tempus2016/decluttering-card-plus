/*
 * Unit tests for notes among a template's variables (#509): `- note: ...` entries the card
 * editor draws as text between the fields. Run with `npm test`.
 */
const {
  isNoteEntry,
  getNotes,
  withNotes,
  isPlacedNote,
  getDeclarations,
  groupDeclarations,
  declarationShown,
  usedVariables,
  diagnoseInstance,
} = require('../.test-build/variables.js');
const { collectTemplates } = require('../.test-build/templates.js');
const { rowsFrom, variablesFrom, shapeOf, isNoteRow, emptyNoteRow } = require('../.test-build/declarations-rows.js');
const { translatedForDisplay } = require('../.test-build/translations.js');
const { lintTemplate } = require('../.test-build/lint.js');

const { check } = require('./check');

// ---------------------------------------------------------------- what counts as a note

check('a note is an entry with a note: text', isNoteEntry({ note: 'Read me' }), true);
check(
  'a note may say when it shows and where',
  isNoteEntry({ note: 'x', show_if: 'a', hide_if: 'b', group: 'g' }),
  true,
);
check('a mapping-form note keeps its key as a name', isNoteEntry({ note: 'x', name: 'intro' }), true);
check(
  'a declaration with a note: of its own stays a declaration',
  isNoteEntry({ name: 'a', note: 'x', type: 'text' }),
  false,
);
check('a note: that is not text is no note', isNoteEntry({ note: 5 }), false);
check('nothing else is a note', [null, 'note', ['note'], { name: 'a' }].map(isNoteEntry), [false, false, false, false]);

const template = {
  variables: [
    { note: 'Top' },
    { name: 'camera', type: 'entity' },
    { note: 'Stream [[camera]]' },
    { name: 'colour', type: 'color' },
    { note: 'Last' },
  ],
  card: { type: 'tile', entity: '[[camera]]' },
};

check(
  'notes declare nothing',
  getDeclarations(template).map((each) => each.name),
  ['camera', 'colour'],
);
check(
  'each note knows the names written after it',
  getNotes(template).map((each) => [each.index, each.note.note, each.before]),
  [
    [0, 'Top', ['camera', 'colour']],
    [1, 'Stream [[camera]]', ['colour']],
    [2, 'Last', []],
  ],
);
check(
  'notes in the mapping form too',
  getNotes({ variables: { intro: { note: 'Hi' }, a: 1 } }).map((each) => [each.note.note, each.before]),
  [['Hi', ['a']]],
);
check('a template without notes has none', getNotes({ variables: [{ name: 'a' }] }), []);
check('no variables, no notes', getNotes(undefined), []);

// ---------------------------------------------------------------- where they go

const placed = (declarations, notes) =>
  withNotes(declarations, notes).map((each) => (isPlacedNote(each) ? `note:${each.note.note}` : each.name));

check('notes sit where they are written', placed(getDeclarations(template), getNotes(template)), [
  'note:Top',
  'camera',
  'note:Stream [[camera]]',
  'colour',
  'note:Last',
]);
check(
  'a note above a hidden field moves to the next field shown',
  placed(
    getDeclarations(template).filter((each) => each.name !== 'colour'),
    getNotes(template),
  ),
  ['note:Top', 'camera', 'note:Stream [[camera]]', 'note:Last'],
);
check('with nothing after it shown, a note goes last', placed([], getNotes(template)), [
  'note:Top',
  'note:Stream [[camera]]',
  'note:Last',
]);
check('no notes leaves the list as it was', withNotes([{ name: 'a' }], []), [{ name: 'a' }]);

const grouped = {
  variables: [
    { name: 'a' },
    { note: 'About the details', group: 'Details' },
    { name: 'b', group: 'Details' },
    { note: 'Only text', group: 'Notes' },
  ],
};
check(
  'a note goes in the group it names, even a group of notes alone',
  groupDeclarations(withNotes(getDeclarations(grouped), getNotes(grouped))).map((bucket) => [
    bucket.group ?? null,
    bucket.declarations.map((each) => (isPlacedNote(each) ? `note:${each.note.note}` : each.name)),
  ]),
  [
    [null, ['a']],
    ['Details', ['note:About the details', 'b']],
    ['Notes', ['note:Only text']],
  ],
);

// ---------------------------------------------------------------- when they show

const read = (values) => (name) => values[name];
check('a note shows by default', declarationShown({ note: 'x' }, read({})), true);
check(
  'show_if: a note shows while it holds',
  declarationShown({ note: 'x', show_if: 'zones' }, read({ zones: true })),
  true,
);
check(
  'show_if: and is hidden while it does not',
  declarationShown({ note: 'x', show_if: 'zones' }, read({ zones: false })),
  false,
);
check(
  "a quoted '!name' shows the note while the switch is off",
  declarationShown({ note: 'x', show_if: '!use_zone' }, read({ use_zone: false })),
  true,
);
check(
  'and hides it while the switch is on',
  declarationShown({ note: 'x', show_if: '!use_zone' }, read({ use_zone: true })),
  false,
);
check(
  'a hidden group hides its notes',
  declarationShown({ note: 'x', group: 'g' }, read({ on: false }), { g: { show_if: 'on' } }),
  false,
);

// ---------------------------------------------------------------- extends

const extended = collectTemplates({
  decluttering_templates: {
    base: { variables: [{ note: 'From the parent' }, { name: 'a' }], card: { type: 'tile' } },
    child: { extends: 'base', variables: [{ note: 'From the child' }, { name: 'b' }] },
  },
}).child;
check(
  "a child's notes are kept beside its parent's",
  (extended.variables || []).map((each) => each.note ?? each.name),
  ['From the parent', 'a', 'From the child', 'b'],
);

// ---------------------------------------------------------------- the template editor's table

const roundTrip = (variables) => variablesFrom(rowsFrom(variables), shapeOf(variables));
check('a note in a list goes round the table unchanged', roundTrip(template.variables), template.variables);
check('a note with conditions keeps them', roundTrip([{ note: 'x', show_if: 'a', group: 'g' }, { name: 'a' }]), [
  { note: 'x', show_if: 'a', group: 'g' },
  { name: 'a' },
]);
check('a note in the mapping form keeps its key', roundTrip({ intro: { note: 'Hi' }, a: 1 }), {
  intro: { note: 'Hi' },
  a: 1,
});
check('the table knows its notes', rowsFrom(template.variables).map(isNoteRow), [true, false, true, false, true]);
check('a new note in a list has no name', variablesFrom([emptyNoteRow([], 'list')], 'list'), [{ note: '' }]);
check(
  'a new note in a mapping gets a key of its own',
  variablesFrom(
    [...rowsFrom({ note: { note: 'a' } }), emptyNoteRow(rowsFrom({ note: { note: 'a' } }), 'mapping')],
    'mapping',
  ),
  { note: { note: 'a' }, note_2: { note: '' } },
);

// ---------------------------------------------------------------- translation, lint, diagnostics

const translated = translatedForDisplay(
  {
    language: { en: { intro: 'Hello' }, de: { intro: 'Hallo' } },
    variables: [{ note: '[[$intro]]' }, { name: 'a' }],
    card: { type: 'tile' },
  },
  { language: 'de', locale: { language: 'de' } },
);
check('a note is translated like a label', translated.variables[0].note, 'Hallo');

const findings = (written) => lintTemplate(written).map((f) => f.key);
check(
  'a note is no unnamed declaration to lint',
  findings({ variables: [{ note: 'Pick a camera' }, { name: 'a' }], card: { type: 'tile', entity: '[[a]]' } }),
  [],
);
check(
  'a lookup in a note must be in the language block',
  findings({
    language: { en: { other: 'x' } },
    variables: [{ note: '[[$missing]]' }],
    card: { type: 'tile' },
  }),
  ['lint.translation_unknown'],
);

check(
  'a variable a note shows is one the template uses',
  usedVariables({ variables: [{ note: 'Uses [[shown_only]]' }], card: { type: 'tile' } }),
  ['shown_only'],
);
const diagnosis = diagnoseInstance(
  { template: 't', variables: [] },
  { variables: [{ note: 'Stream [[stream]]' }], card: { type: 'tile' } },
);
check('a note never makes a variable needed', JSON.stringify(diagnosis).includes('stream'), false);
