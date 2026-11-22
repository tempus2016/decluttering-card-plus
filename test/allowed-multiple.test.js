/*
 * #491: a dropdown of `allowed:` values that takes more than one, three ways in - `multiple: true`
 * on the declaration, a written `select:` with no options of its own, and `allowed:` made from
 * a placeholder - and a list value checked entry by entry. Run with `npm test`.
 */
const { check } = require('./check');
const { declarationSelector, validateDeclared } = require('../.test-build/variables');
const { filledAllowed } = require('../.test-build/card-editor/defaults');

const three = ['show_diagnostics', 'toggle_show_alerts', 'toggle_triggered_view'];
const options = three.map((value) => ({ value, label: value }));

// multiple: true on the declaration, the way multiline: is.
check(
  'multiple: true makes the allowed dropdown take several',
  declarationSelector({ name: 'menu', allowed: three, multiple: true }),
  { select: { mode: 'dropdown', options, multiple: true } },
);
check('and with type: select', declarationSelector({ name: 'menu', type: 'select', allowed: three, multiple: true }), {
  select: { mode: 'dropdown', options, multiple: true },
});
check(
  'multiple: false is the single dropdown it always was',
  declarationSelector({ name: 'menu', allowed: three, multiple: false }),
  { select: { mode: 'dropdown', options } },
);
check('multiple: with no allowed values makes nothing new', declarationSelector({ name: 'menu', multiple: true }), {
  text: {},
});

// A written select: with no options takes them from allowed:, keeping its own settings.
check(
  'a written select: with no options gets the allowed values',
  declarationSelector({ name: 'menu', allowed: three, selector: { select: { multiple: true } } }),
  { select: { multiple: true, options } },
);
check(
  'its other settings stay as written',
  declarationSelector({
    name: 'menu',
    allowed: three,
    selector: { select: { multiple: true, mode: 'list', custom_value: true } },
  }),
  { select: { multiple: true, mode: 'list', custom_value: true, options } },
);
check(
  'labelled allowed values come through as labelled options',
  declarationSelector({
    name: 'menu',
    allowed: [{ label: 'Show Diagnostics', value: 'show_diagnostics' }],
    selector: { select: { multiple: true } },
  }).select.options,
  [{ value: 'show_diagnostics', label: 'Show Diagnostics' }],
);
check(
  'a select: with options of its own keeps them',
  declarationSelector({
    name: 'menu',
    allowed: three,
    selector: { select: { multiple: true, options: ['a', 'b'] } },
  }),
  { select: { multiple: true, options: ['a', 'b'] } },
);
check(
  'a selector that is not a select is left alone',
  declarationSelector({ name: 'menu', allowed: three, selector: { text: {} } }),
  { text: {} },
);
check(
  'a select: with no options and no allowed values is left alone',
  declarationSelector({ name: 'menu', selector: { select: { multiple: true } } }),
  { select: { multiple: true } },
);
check(
  'a null select: (select: written with nothing under it) is filled too',
  declarationSelector({ name: 'menu', allowed: ['a'], selector: { select: null } }),
  { select: { options: [{ value: 'a', label: 'a' }] } },
);

// A list value is checked entry by entry.
const template = (declaration) => ({ card: { type: 'tile' }, variables: [{ name: 'menu', ...declaration }] });
check(
  'a list of allowed values is valid',
  validateDeclared(
    [{ menu: ['show_diagnostics', 'toggle_show_alerts'] }],
    template({ allowed: three, multiple: true }),
  ),
  [],
);
check(
  'a list holding one that is not allowed is reported',
  validateDeclared([{ menu: ['show_diagnostics', 'nope'] }], template({ allowed: three, multiple: true })),
  [{ name: 'menu', expected: three.join(', '), value: '"["show_diagnostics","nope"]"' }],
);
check(
  'an empty list is unset, not invalid',
  validateDeclared([{ menu: [] }], template({ allowed: three, multiple: true })),
  [],
);
check('a single value still checks as one', validateDeclared([{ menu: 'nope' }], template({ allowed: three })), [
  { name: 'menu', expected: three.join(', '), value: '"nope"' },
]);

// allowed: made from a placeholder, filled the way a default is.
const items = {
  choices: {
    defaults: { return: { label: '[[title]]', value: '[[title|slug]]' } },
    item: '[[return|repeat:opts|if:enabled?]]',
  },
};
const opts = [
  { title: 'Show Alerts', enabled: true },
  { title: 'Show Diagnostics', enabled: true },
  { title: 'Hidden One', enabled: false },
];
const tpl = {
  card: { type: 'tile' },
  default: [{ opts }],
  variables: [{ name: 'menu', allowed: '[[choices|with]]', multiple: true }],
};
const declaration = tpl.variables[0];
const filled = filledAllowed(declaration, [], tpl, undefined, { itemTemplates: items });
check('a placeholder allowed: is filled from the item template', filled.allowed, [
  { label: 'Show Alerts', value: 'show_alerts' },
  { label: 'Show Diagnostics', value: 'show_diagnostics' },
]);
check('and the dropdown is made from it', declarationSelector(filled), {
  select: {
    mode: 'dropdown',
    options: [
      { value: 'show_alerts', label: 'Show Alerts' },
      { value: 'show_diagnostics', label: 'Show Diagnostics' },
    ],
    multiple: true,
  },
});
check('a written list is handed back as it was', filledAllowed({ name: 'menu', allowed: three }, [], tpl), {
  name: 'menu',
  allowed: three,
});
check(
  'one that cannot be filled yet is dropped, not shown as brackets',
  filledAllowed({ name: 'menu', allowed: '[[nobody]]' }, [], tpl).allowed,
  undefined,
);
check(
  'one that fills to a single value becomes a list of one',
  filledAllowed({ name: 'menu', allowed: '[[one]]' }, [{ one: 'only' }], tpl).allowed,
  ['only'],
);
check(
  'validation reads the filled list when given the filler',
  validateDeclared([{ menu: ['show_alerts', 'nope'] }], tpl, undefined, undefined, (each) =>
    filledAllowed(each, [], tpl, undefined, { itemTemplates: items }),
  ),
  [{ name: 'menu', expected: 'show_alerts, show_diagnostics', value: '"["show_alerts","nope"]"' }],
);
check('without the filler a placeholder allowed: checks nothing', validateDeclared([{ menu: ['nope'] }], tpl), []);
check(
  'a placeholder value is not judged against allowed:',
  validateDeclared([], {
    card: { type: 'tile' },
    variables: [{ name: 'menu', allowed: ['a'], default: '[[elsewhere|with]]' }],
  }),
  [],
);
