/*
 * Unit tests for `groups:` (#473): a template's settings for each `group:` of its variables -
 * show_if and hide_if for the whole group, whether its section starts open, and a line under
 * its title - read by the editor, the stand-in form, template lint, `extends:` and the export.
 */
const {
  declarationShown,
  hasVisibilityConditions,
  templateGroups,
  groupDeclarations,
} = require('../.test-build/variables.js');
const { collectTemplates } = require('../.test-build/templates.js');
const { lintTemplate } = require('../.test-build/lint.js');
const { buildExport } = require('../.test-build/share.js');
const { standInFields } = require('../.test-build/try-template-form.js');
const { check } = require('./check');

const reader = (values) => (name) => values[name];

/* ---------------------------------------------------------------- templateGroups */

check('a template without groups: has none', Object.keys(templateGroups({ card: {} })), []);
check('no template has none', Object.keys(templateGroups(undefined)), []);
check('groups: written as a list is not read', Object.keys(templateGroups({ groups: [{ show_if: 'a' }] })), []);
check(
  'only the entries that are mappings are read',
  Object.keys(templateGroups({ groups: { A: { show_if: 'a' }, B: 'nope', C: null, D: [] } })),
  ['A'],
);
check(
  'a group named __proto__ is an entry, not a prototype',
  templateGroups({ groups: JSON.parse('{"__proto__": {"hide_if": "x"}}') }).__proto__,
  { hide_if: 'x' },
);

/* ---------------------------------------------------------------- declarationShown */

const groups = { Debug: { show_if: 'test3', hide_if: 'test4' } };
const inDebug = { name: 'turn_on_1', group: 'Debug' };

check('without groups a grouped field shows as before', declarationShown(inDebug, reader({})), true);
check('a group whose show_if does not hold hides its field', declarationShown(inDebug, reader({}), groups), false);
check('a group whose show_if holds shows its field', declarationShown(inDebug, reader({ test3: true }), groups), true);
check(
  "a group's hide_if wins over its show_if",
  declarationShown(inDebug, reader({ test3: true, test4: true }), groups),
  false,
);
check(
  'a shown group still leaves the field its own say',
  declarationShown({ ...inDebug, hide_if: 'quiet' }, reader({ test3: true, quiet: 'on' }), groups),
  false,
);
check(
  'a field showing by its own show_if is still hidden by its group',
  declarationShown({ ...inDebug, show_if: 'loud' }, reader({ loud: true }), groups),
  false,
);
check(
  'a field in a group with no groups: entry answers only to itself',
  declarationShown({ name: 'x', group: 'Other', show_if: 'y' }, reader({ y: true }), groups),
  true,
);
check('an ungrouped field is not touched by any group', declarationShown({ name: 'x' }, reader({}), groups), true);
check(
  'a group condition written the if: way, and as a list, reads the same',
  [
    declarationShown(inDebug, reader({ kind: 'a' }), { Debug: { show_if: ['if:kind=a'] } }),
    declarationShown(inDebug, reader({ kind: 'b' }), { Debug: { show_if: ['if:kind=a'] } }),
  ],
  [true, false],
);
check(
  'a malformed group condition is passed over, never hiding the group for good',
  declarationShown(inDebug, reader({}), { Debug: { show_if: '[[nope]]' } }),
  true,
);

check('nothing written means nothing to read', hasVisibilityConditions([{ name: 'a', group: 'G' }], {}), false);
check(
  "a group's condition is something to read",
  hasVisibilityConditions([{ name: 'a', group: 'G' }], { G: { hide_if: 'b' } }),
  true,
);
check(
  "a group's expanded alone is not",
  hasVisibilityConditions([{ name: 'a', group: 'G' }], { G: { expanded: true } }),
  false,
);

// The editor drops hidden fields before bucketing, so a group whose fields are all hidden has no section.
check(
  'a group with every field hidden leaves no bucket',
  groupDeclarations(
    [{ name: 'a' }, inDebug, { name: 'turn_on_2', group: 'Debug' }].filter((d) =>
      declarationShown(d, reader({}), groups),
    ),
  ).map((bucket) => bucket.group ?? null),
  [null],
);

/* ---------------------------------------------------------------- extends */

{
  const templates = collectTemplates({
    decluttering_templates: {
      base: {
        card: { type: 'tile' },
        groups: { Debug: { show_if: 'debug', description: 'For testing' }, Looks: { expanded: true } },
        variables: [{ name: 'a', group: 'Debug' }],
      },
      child: {
        extends: 'base',
        groups: { Debug: { show_if: 'really_debug' }, Extra: { hide_if: 'x' } },
      },
      plain: { extends: 'base' },
    },
  });
  check('extends merges groups: group by group, the child winning each key', templates.child.groups, {
    Debug: { show_if: 'really_debug', description: 'For testing' },
    Looks: { expanded: true },
    Extra: { hide_if: 'x' },
  });
  check("a child that writes no groups: keeps its parent's", templates.plain.groups, {
    Debug: { show_if: 'debug', description: 'For testing' },
    Looks: { expanded: true },
  });
}
check(
  "a child's groups: null takes the parent's away",
  collectTemplates({
    decluttering_templates: {
      base: { card: {}, groups: { A: { hide_if: 'x' } } },
      child: { extends: 'base', groups: null },
    },
  }).child.groups,
  null,
);

/* ---------------------------------------------------------------- lint */

const lint = (template) =>
  lintTemplate(template).map((f) => `${f.level} ${f.key} ${JSON.stringify(f.params)} @${f.path}`);

check(
  'a group naming declared variables in its conditions says nothing',
  lint({
    groups: { Debug: { show_if: 'test3', hide_if: ['!test4'], expanded: false, description: 'x' } },
    variables: [{ name: 'test3' }, { name: 'test4' }, { name: 'turn_on_1', group: 'Debug' }],
    card: { type: 'tile', name: '[[test3]] [[test4]] [[turn_on_1]]' },
  }),
  [],
);
check(
  'a group condition naming a variable nobody defines is called out',
  lint({
    groups: { Debug: { show_if: 'test9' } },
    variables: [{ name: 'test3' }, { name: 'turn_on_1', group: 'Debug' }],
    card: { type: 'tile', name: '[[test3]] [[turn_on_1]]' },
  }),
  [
    'warning lint.target_unknown {"name":"test9","placeholder":"show_if: test9","closest":"test3"} @groups.Debug.show_if',
  ],
);
check(
  'a malformed group condition is called out',
  lint({
    groups: { Debug: { hide_if: '[[x]]' } },
    variables: [{ name: 'turn_on_1', group: 'Debug' }],
    card: { type: 'tile', name: '[[turn_on_1]]' },
  }),
  ['warning lint.condition_malformed {"key":"hide_if","condition":"[[x]]"} @groups.Debug.hide_if'],
);
check(
  'a group no variable is in is called out',
  lint({
    groups: { Debgu: { show_if: 'a' } },
    variables: [{ name: 'a' }, { name: 'turn_on_1', group: 'Debug' }],
    card: { type: 'tile', name: '[[a]] [[turn_on_1]]' },
  }),
  ['warning lint.group_unused {"group":"Debgu"} @groups.Debgu'],
);
check(
  "a template that extends another may be naming its parent's groups",
  lint({ extends: 'base', groups: { Debug: { expanded: true } }, card: { type: 'tile' } }),
  [],
);
check('groups: that is not a mapping is called out', lint({ groups: ['Debug'], card: { type: 'tile' } }), [
  'warning lint.groups_not_mapping {} @groups',
]);
check(
  'a group entry that is not a mapping is called out',
  lint({
    groups: { Debug: 'show' },
    variables: [{ name: 'a', group: 'Debug' }],
    card: { type: 'tile', name: '[[a]]' },
  }),
  ['warning lint.group_not_mapping {"group":"Debug"} @groups.Debug'],
);

/* ---------------------------------------------------------------- export */

check(
  'an export carries groups:, next to the variables',
  Object.keys(
    buildExport({
      type: 'custom:decluttering-template-plus',
      template: 't',
      card: { type: 'tile' },
      groups: { Debug: { show_if: 'a' } },
      variables: [{ name: 'a', group: 'Debug' }],
    }).payload,
  ),
  ['type', 'template', 'variables', 'groups', 'card'],
);

/* ---------------------------------------------------------------- stand-in form */

{
  const FORM = {
    groups: { Debug: { show_if: 'debug' } },
    variables: [
      { name: 'debug', selector: { boolean: {} } },
      { name: 'turn_on_1', group: 'Debug', selector: { boolean: {} } },
    ],
    card: { type: 'tile' },
  };
  const hidden = (variables) =>
    standInFields(FORM, variables, 't', {}, {}).map((f) => [f.name, f.hidden, f.groupShowIf ?? null]);
  check('the stand-in form hides a field its group hides, and says why', hidden([]), [
    ['debug', false, null],
    ['turn_on_1', true, ['debug']],
  ]);
  check('and shows it once the group says so', hidden([{ debug: true }]), [
    ['debug', false, null],
    ['turn_on_1', false, ['debug']],
  ]);
}

/* --------------------------------------------- a condition's variable is used */

{
  const { diagnoseInstance } = require('../.test-build/variables.js');
  const template = {
    groups: { 'Debug Switches': { show_if: 'debug' } },
    variables: [
      { name: 'debug', type: 'boolean' },
      { name: 'mode' },
      { name: 'colour', show_if: 'mode=fancy' },
      { name: 'turn_on_1', group: 'Debug Switches' },
    ],
    card: { type: 'markdown', content: '[[colour?]] [[turn_on_1?]]' },
  };
  const result = diagnoseInstance([{ debug: true }, { mode: 'fancy' }], template);
  check('a variable only a group show_if reads is not unused', result.unused.includes('debug'), false);
  check('a variable only a field show_if reads is not unused', result.unused.includes('mode'), false);
  check('nor is either one missing', result.missing, []);
}
