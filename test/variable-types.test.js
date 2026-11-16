/*
 * Named variable types (#472): `decluttering_types:` on the dashboard and the library, a
 * template's own `types:`, and `type: <name>` on a declaration or an object selector's field.
 * Run with `npm test`.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const { check } = require('./check');
const {
  collectAllTemplates,
  collectTemplates,
  setLibraryForTest,
  LIBRARY_DASHBOARD,
} = require('../.test-build/templates');
const {
  declarationSelector,
  declarationShown,
  getDeclarations,
  resolveVariables,
  typesOf,
  typesUsed,
  unknownTypes,
  variableValues,
} = require('../.test-build/variables');
const { lintTemplate } = require('../.test-build/lint');
const { buildExport } = require('../.test-build/share');
const { requiredUnset } = require('../.test-build/preview-hold');
const { warnings } = require('../.test-build/warnings');

// console.warn is what the card says these through; the suite only wants the log.
console.warn = () => undefined;

const COLOURS = ['red', 'cyan', 'blue', 'darkblue', 'lightblue', 'purple', 'yellow', 'lime', 'magenta', 'pink'];
const colourSelector = { select: { options: COLOURS } };

// The issue's example, as near as the narrow form allows: a colour list and a 1 to 10 number.
const DASHBOARD = {
  decluttering_types: {
    custom_number: {
      label: 'One to 10 picker',
      description: 'pick a number from 1 to 10',
      type: 'number',
      min: 1,
      max: 10,
    },
    color_picker: { label: 'Pick Color', default: 'red', selector: colourSelector },
  },
  decluttering_templates: {
    my_template: {
      variables: [
        { name: 'something', default: 'foobar' },
        { name: 'count_of_items', type: 'custom_number', label: 'Number of items', description: 'pick how many items' },
        { name: 'main_color', type: 'color_picker', default: 'grey' },
        { name: 'accent', type: 'color_picker' },
        {
          name: 'more_toggle_items',
          label: 'Additional Toggles',
          selector: {
            object: {
              label_field: 'name',
              multiple: true,
              fields: {
                name: { label: 'Name', selector: { text: null } },
                on_bg_color: { label: 'BG Color', type: 'color_picker', default: 'yellow' },
                on_fg_color: { label: 'FG Color', type: 'color_picker' },
                off_bg_color: { label: 'BG Color', type: 'color_picker', default: 'black' },
                priority: { label: 'Placement', type: 'custom_number' },
                show: { label: 'Show', type: 'boolean', default: true },
              },
            },
          },
        },
      ],
      card: { type: 'tile', color: '[[main_color]]' },
    },
  },
  views: [],
};

const myTemplate = collectTemplates(DASHBOARD).my_template;
const declared = Object.fromEntries(getDeclarations(myTemplate).map((each) => [each.name, each]));

check('a declaration naming a type takes its keys', declared.accent, {
  name: 'accent',
  label: 'Pick Color',
  default: 'red',
  selector: colourSelector,
});
check('its own keys win over the type, top-level only', declared.main_color, {
  name: 'main_color',
  label: 'Pick Color',
  default: 'grey',
  selector: colourSelector,
});
check('a type saying a built-in type keeps it, and the declaration words win', declared.count_of_items, {
  name: 'count_of_items',
  label: 'Number of items',
  description: 'pick how many items',
  type: 'number',
  min: 1,
  max: 10,
});
check('so the built-in type picks the editor control as it always has', declarationSelector(declared.count_of_items), {
  number: { mode: 'slider', min: 1, max: 10 },
});
check('a declaration naming no type is left as written', declared.something, { name: 'something', default: 'foobar' });
check(
  "a type's default is the variable's default when building",
  variableValues(resolveVariables(undefined, myTemplate)),
  { something: 'foobar', main_color: 'grey', accent: 'red' },
);
check(
  'and a card still wins over it',
  variableValues(resolveVariables([{ accent: 'blue' }], myTemplate)).accent,
  'blue',
);

// The object selector's fields (the issue's first case).
const fields = declared.more_toggle_items.selector.object.fields;
check('a field naming a type takes it, keeping only what a field can carry', fields.on_bg_color, {
  label: 'BG Color',
  default: 'yellow',
  selector: colourSelector,
});
check("a field's default falls back on the type's", fields.on_fg_color.default, 'red');
check(
  'two fields on one type keep their own words',
  [fields.on_bg_color.label, fields.off_bg_color.default],
  ['BG Color', 'black'],
);
check('a field on a type with a built-in type gets its selector from it, its description dropped', fields.priority, {
  label: 'Placement',
  selector: { number: { mode: 'slider', min: 1, max: 10 } },
});
check('a field with a built-in type gets that selector', fields.show, {
  label: 'Show',
  default: true,
  selector: { boolean: {} },
});
check('a field naming no type is left exactly as written', fields.name, { label: 'Name', selector: { text: null } });
check(
  'the rest of the object selector is kept',
  [declared.more_toggle_items.selector.object.label_field, declared.more_toggle_items.selector.object.multiple],
  ['name', true],
);
check(
  'the template itself is not changed: the dashboard config keeps type: color_picker',
  DASHBOARD.decluttering_templates.my_template.variables[2].type,
  'color_picker',
);

/* ------------------------------------------------------------ a template's own types: */

const OWN = {
  decluttering_types: { colour: { label: 'Dashboard colour', default: 'red' } },
  decluttering_templates: {
    tile: {
      types: { colour: { label: 'Template colour' }, size: { type: 'number', min: 0, max: 5, default: 2 } },
      variables: { colour: { type: 'colour' }, size: { type: 'size' }, other: { type: 'colour_two' } },
      card: { type: 'tile' },
    },
    child: { extends: 'tile', types: { size: { type: 'number', min: 0, max: 9 } }, card: { name: 'child' } },
    elsewhere: { variables: [{ name: 'colour', type: 'colour' }], card: { type: 'tile' } },
  },
  views: [],
};
const own = collectTemplates(OWN);
const ownDeclared = (name) => Object.fromEntries(getDeclarations(own[name]).map((each) => [each.name, each]));
check("a template's own types: win over the dashboard's of the same name, whole", ownDeclared('tile').colour, {
  label: 'Template colour',
  name: 'colour',
});
check(
  'another template on the dashboard still gets the dashboard type',
  ownDeclared('elsewhere').colour.label,
  'Dashboard colour',
);
check('a mapping declaration takes a type too', ownDeclared('tile').size.max, 5);
check(
  "extends: merges types: by name, the child's winning",
  [ownDeclared('child').size.max, ownDeclared('child').colour.label],
  [9, 'Template colour'],
);
check(
  'a raw template with its own types: resolves without being collected',
  getDeclarations({ types: { t: { label: 'From t' } }, variables: [{ name: 'x', type: 't' }] }),
  [{ name: 'x', label: 'From t' }],
);

/* -------------------------------------------------------- what everything else reads */

const READERS = {
  decluttering_types: {
    asked: { required: true, show_if: 'mode=advanced', label: 'Asked' },
  },
  decluttering_templates: {
    reader: {
      variables: [
        { name: 'mode', default: 'basic' },
        { name: 'detail', type: 'asked' },
      ],
      card: { type: 'tile' },
    },
  },
  views: [],
};
const reader = getDeclarations(collectTemplates(READERS).reader)[1];
check('required: from a type counts', requiredUnset([reader], ['detail']), ['detail']);
check(
  'show_if from a type hides the field',
  declarationShown(reader, () => 'basic'),
  false,
);
check(
  'and shows it when it holds',
  declarationShown(reader, () => 'advanced'),
  true,
);

/* ------------------------------------------------------------------------- mistakes */

const before = warnings().length;
const BAD = {
  decluttering_types: {
    number: { label: 'Not allowed' },
    stacked: { type: 'color_picker_x', label: 'Stacked' },
  },
  decluttering_templates: {
    bad: {
      variables: [
        { name: 'n', type: 'number' },
        { name: 's', type: 'stacked' },
        { name: 'u', type: 'colur_picker' },
        { name: 'o', selector: { object: { fields: { f: { label: 'F', type: 'nope' } } } } },
      ],
      types: { colour_picker: { label: 'C' } },
      card: { type: 'tile' },
    },
  },
  views: [],
};
const bad = collectTemplates(BAD).bad;
const badDeclared = Object.fromEntries(getDeclarations(bad).map((each) => [each.name, each]));
getDeclarations(bad);
const said = warnings()
  .slice(before)
  .map((each) => each.message);
check('a type named after a built-in is never used: the built-in wins', badDeclared.n, { name: 'n', type: 'number' });
check(
  'and is said',
  said.some((message) => /called number/.test(message)),
  true,
);
check('a type naming a type of its own loses that key, keeping the rest', badDeclared.s, {
  name: 's',
  label: 'Stacked',
});
check(
  'and is said',
  said.some((message) => /the type stacked says type: color_picker_x/.test(message)),
  true,
);
check('a declaration naming no type there is is left untyped as written', badDeclared.u, {
  name: 'u',
  type: 'colur_picker',
});
check('a field naming no type there is loses it', badDeclared.o.selector.object.fields.f, {
  label: 'F',
  selector: { text: {} },
});
check(
  'and is said once, however often it is read',
  said.filter((message) => /field f of the variable o/.test(message)).length,
  1,
);
check('typesOf leaves out what cannot be used', Object.keys(typesOf(bad)).sort(), ['colour_picker', 'stacked']);
check(
  'unknownTypes finds the declaration and the field',
  unknownTypes(bad).map((each) => [each.variable, each.field, each.type]),
  [
    ['u', undefined, 'colur_picker'],
    ['o', 'f', 'nope'],
  ],
);

const lint = lintTemplate(bad).filter((finding) => finding.key === 'lint.unknown_type');
check(
  'the lint says so, with the nearest name',
  lint.map((finding) => [finding.path, finding.params.name, finding.params.closest]),
  [
    ['variables[2].type', 'u', 'colour_picker'],
    ['variables[3].selector.object.fields.f.type', 'o.f', undefined],
  ],
);
check(
  'the lint says nothing about types that are there',
  lintTemplate(myTemplate).filter((finding) => finding.key === 'lint.unknown_type'),
  [],
);
check(
  'a raw template is linted against the types it is handed',
  lintTemplate(DASHBOARD.decluttering_templates.my_template, [], { types: typesOf(myTemplate) }).filter(
    (finding) => finding.key === 'lint.unknown_type',
  ),
  [],
);

/* --------------------------------------------------------------------- the library */

setLibraryForTest({
  decluttering_types: {
    color_picker: { label: 'Library colour', default: 'blue' },
    library_only: { label: 'From the library', default: 'lib' },
  },
  views: [],
});
const LIBRARY_USER = {
  decluttering_types: { color_picker: { label: 'Here colour' } },
  decluttering_templates: {
    t: {
      variables: [
        { name: 'a', type: 'color_picker' },
        { name: 'b', type: 'library_only' },
      ],
      card: { type: 'tile' },
    },
  },
  views: [],
};
const fromLibrary = Object.fromEntries(
  getDeclarations(collectTemplates(LIBRARY_USER).t).map((each) => [each.name, each]),
);
check('a library type reaches every dashboard', fromLibrary.b, {
  name: 'b',
  label: 'From the library',
  default: 'lib',
});
check("a dashboard's own type of the same name wins, whole", fromLibrary.a, { name: 'a', label: 'Here colour' });
setLibraryForTest(undefined);
check('before the library is read its types are not there', getDeclarations(collectTemplates(LIBRARY_USER).t)[1], {
  name: 'b',
  type: 'library_only',
});

/* ------------------------------------------------------------------------ the export */

const OBJECT_TYPES = {
  decluttering_types: {
    color_picker: { label: 'Pick Color', default: 'red', selector: colourSelector },
    on_off_colours: {
      label: 'Colours',
      selector: { object: { fields: { on: { type: 'color_picker' }, off: { type: 'color_picker' } } } },
    },
    unused: { label: 'Nobody uses this' },
  },
  decluttering_templates: {
    exported: {
      types: { mine: { label: 'Mine' } },
      variables: [
        { name: 'colours', type: 'on_off_colours' },
        { name: 'm', type: 'mine' },
      ],
      card: { type: 'tile' },
    },
  },
  views: [],
};
const exportedTemplates = collectTemplates(OBJECT_TYPES);
check('typesUsed follows a type into its own fields', typesUsed(exportedTemplates.exported), [
  'on_off_colours',
  'color_picker',
  'mine',
]);
const exported = buildExport(
  { type: 'custom:decluttering-template-plus', template: 'exported', ...OBJECT_TYPES.decluttering_templates.exported },
  exportedTemplates,
);
check(
  'an export carries the dashboard types it uses under its own types:, its own kept',
  Object.keys(exported.payload.types),
  ['mine', 'on_off_colours', 'color_picker'],
);
check('and nothing it does not use', 'unused' in exported.payload.types, false);
check(
  'types: goes before variables:',
  Object.keys(exported.payload).indexOf('types') < Object.keys(exported.payload).indexOf('variables'),
  true,
);
check(
  'and says so',
  exported.notes.some((note) => /on_off_colours/.test(note) && /color_picker/.test(note)),
  true,
);
check(
  'what was exported builds the same on a dashboard with no types',
  getDeclarations(exported.payload)[0].selector.object.fields.on,
  { label: 'Pick Color', default: 'red', selector: colourSelector },
);
check(
  'a template with no types exports without a types: key',
  'types' in buildExport({ template: 'x', variables: [{ name: 'a' }], card: {} }, {}).payload,
  false,
);

/* ---------------------------------------------------------------- borrowed dashboards */

const LENDER = {
  decluttering_types: { lent: { label: 'Lender words', default: 'lender' }, both: { label: 'Lender both' } },
  decluttering_templates: {
    borrowed: {
      variables: [
        { name: 'a', type: 'lent' },
        { name: 'b', type: 'both' },
      ],
      card: { type: 'tile' },
    },
  },
};
const BORROWER = {
  decluttering_templates_from: ['lender'],
  decluttering_types: { both: { label: 'Borrower both' } },
  decluttering_templates: { mine: { variables: [{ name: 'c', type: 'lent' }], card: { type: 'tile' } } },
  views: [],
};
test('a borrowed template takes its lender types, the borrower winning a name', async () => {
  const hass = {
    callWS: ({ url_path }) =>
      Promise.resolve(url_path === LIBRARY_DASHBOARD ? null : url_path === 'lender' ? LENDER : null),
  };
  const all = await collectAllTemplates(hass, BORROWER);
  const borrowed = getDeclarations(all.borrowed);
  assert.deepEqual(
    borrowed.map((each) => each.label),
    ['Lender words', 'Borrower both'],
  );
  // The borrower's own template does not reach into a lender's types.
  assert.deepEqual(getDeclarations(all.mine)[0], { name: 'c', type: 'lent' });
});
