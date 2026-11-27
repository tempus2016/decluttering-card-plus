/*
 * #514: a declared variable with a default could not be left empty in the card editor -
 * clearing the field took the card's line out, so the default came straight back. A
 * declaration with `allow_empty: true` now writes `''` when its field is cleared, which the
 * build puts ahead of the default; Reset still takes the line out. Without the key a cleared
 * field sets nothing, as before. Run with `npm test`.
 */
const { check } = require('./check.js');
const deepReplace = require('../.test-build/deep-replace.js').default;
const { fieldWrite, resetVariable, resetTarget, shownDefaults } = require('../.test-build/card-editor/defaults.js');
const {
  diagnoseInstance,
  diagnoseTemplate,
  requiredButEmpty,
  mergeVariables,
  validateDeclared,
  variableValues,
} = require('../.test-build/variables.js');
const { rowsFrom, variablesFrom, withField } = require('../.test-build/declarations-rows.js');
const { unknownTemplateKeys } = require('../.test-build/template-keys.js');
const { lintTemplate } = require('../.test-build/lint.js');
const { healthEntries } = require('../.test-build/health-card-pure.js');
const { variableRows } = require('../.test-build/trace.js');

const plain = (value) => JSON.parse(JSON.stringify(value));
const quiet = (fn) => {
  const was = console.warn;
  console.warn = () => {};
  try {
    return fn();
  } finally {
    console.warn = was;
  }
};

const optional = { allow_empty: true };
const plainField = {};
const defaultShown = { shown: 'camera.frontporch', written: undefined };

// The editor's value logic, field by field.
check(
  'allow_empty: a cleared field that showed the default writes empty (#514)',
  fieldWrite(optional, undefined, defaultShown, false),
  '',
);
check(
  'allow_empty: a field emptied to an empty string writes empty too (#514)',
  fieldWrite(optional, '', defaultShown, false),
  '',
);
check(
  'allow_empty: a cleared field the card set writes empty (#514)',
  fieldWrite(optional, undefined, undefined, true),
  '',
);
check(
  'allow_empty: a field the card already sets to empty keeps it (#514)',
  fieldWrite(optional, '', undefined, true),
  '',
);
check(
  'allow_empty: a field left showing its default still writes nothing (#514)',
  fieldWrite(optional, 'camera.frontporch', defaultShown, false),
  undefined,
);
check(
  'allow_empty: an unset field with no default shown writes nothing (#514)',
  fieldWrite(optional, undefined, undefined, false),
  undefined,
);
check(
  'allow_empty: a value typed in is written as it is (#514)',
  fieldWrite(optional, 'camera.garage', defaultShown, false),
  'camera.garage',
);
check(
  'without allow_empty a cleared field that showed the default writes nothing (#514)',
  fieldWrite(plainField, undefined, defaultShown, false),
  undefined,
);
check(
  'without allow_empty a cleared field the card set writes nothing (#514)',
  fieldWrite(plainField, '', undefined, true),
  undefined,
);
check(
  'allow_empty: false is the same as leaving it out (#514)',
  fieldWrite({ allow_empty: false }, undefined, defaultShown, true),
  undefined,
);
check(
  'a switch shown for a written word keeps the word (#514)',
  fieldWrite(optional, true, { shown: true, written: 'on' }, true),
  'on',
);

const template = {
  variables: [
    {
      name: 'backup_camera',
      description: 'select the backup camera or leave blank for no backup',
      default: 'camera.frontporch',
      type: 'entity',
      domain: 'camera',
      allow_empty: true,
    },
    { name: 'main_camera', type: 'entity', domain: 'camera' },
  ],
  default: [{ no_backup: 'No backup camera' }],
  card: {
    type: 'vertical-stack',
    main: '[[main_camera]]',
    backup: '[[backup_camera]]',
    shown: '[[backup_camera|if:backup_camera|default:none]]',
    hidden: '[[no_backup|if:!backup_camera|default:none]]',
    list: ['[[main_camera]]', '[[backup_camera?]]'],
    or: '[[backup_camera|default:no backup]]',
  },
};

// What the card's variables come to after a clear, the way _valueChanged merges them.
{
  const before = [{ main_camera: 'camera.drive' }, { backup_camera: 'camera.garage' }];
  const wrote = fieldWrite(template.variables[0], undefined, undefined, true);
  const after = mergeVariables(before, [{ main_camera: 'camera.drive' }, { backup_camera: wrote }]);
  check('a cleared allow_empty field stays on the card as empty (#514)', after, [
    { main_camera: 'camera.drive' },
    { backup_camera: '' },
  ]);
  const without = fieldWrite({}, undefined, undefined, true);
  check(
    'without allow_empty the line goes (#514)',
    mergeVariables(before, without === undefined ? [{ main_camera: 'camera.drive' }] : []),
    [{ main_camera: 'camera.drive' }],
  );
}

// Reset takes the empty line out, so the default applies again.
{
  const config = { type: 'custom:decluttering-card-plus', template: 'cams', variables: [{ backup_camera: '' }] };
  check('Reset removes an empty line (#514)', plain(resetVariable(config, 'backup_camera')), {
    type: 'custom:decluttering-card-plus',
    template: 'cams',
  });
  check(
    'Reset on an empty line falls back to the default (#514)',
    resetTarget('backup_camera', config.variables, template)?.value,
    'camera.frontporch',
  );
  check(
    'an empty value counts as set, so the field shows empty, not the default (#514)',
    'backup_camera' in variableValues(config.variables),
    true,
  );
  check(
    'and no default is shown for it (#514)',
    shownDefaults(['backup_camera'], config.variables, template).has('backup_camera'),
    false,
  );
}

// The build: the card's empty value comes before the declaration's default.
{
  const build = (variables) => quiet(() => plain(deepReplace(variables, template, template.card, 'cams')));
  const empty = build([{ main_camera: 'camera.drive' }, { backup_camera: '' }]);
  check('the card sets empty: [[backup_camera]] is empty, not the default (#514)', empty.backup, '');
  check('if:backup_camera does not hold for an empty value (#514)', empty.shown, 'none');
  check('if:!backup_camera holds for an empty value (#514)', empty.hidden, 'No backup camera');
  check('? drops an empty value from a list (#514)', empty.list, ['camera.drive']);
  check('default: steps in for an empty value (#514)', empty.or, 'no backup');

  const unset = build([{ main_camera: 'camera.drive' }]);
  check('unset still builds with the default (#514)', unset.backup, 'camera.frontporch');
  check('and a set entity holds for if: (#514)', unset.shown, 'camera.frontporch');
  check('and if:! does not (#514)', unset.hidden, 'none');
  check('and is kept in the list (#514)', unset.list, ['camera.drive', 'camera.frontporch']);
}

// Diagnostics: an empty value on such a field is set, not missing, unset or of the wrong type.
{
  const variables = [{ main_camera: 'camera.drive' }, { backup_camera: '' }];
  const { missing, required } = diagnoseInstance(variables, template);
  check('an empty allow_empty value is not missing (#514)', missing, []);
  check('nor required (#514)', required, []);
  check('nor a wrong value for type: entity (#514)', validateDeclared(variables, template), []);

  const ll = {
    decluttering_templates: { cams: template },
    views: [{ cards: [{ type: 'custom:decluttering-card-plus', template: 'cams', variables }] }],
  };
  const health = healthEntries(ll, { cams: template }, 'test');
  check(
    'the health panel counts nothing unset or missing (#514)',
    [health.counts.unset, health.counts.missing],
    [0, 0],
  );
  const row = variableRows(variables, template).find((each) => each.variable === 'backup_camera');
  check('the report shows the card setting it empty (#514)', [row?.value, row?.from], ['', 'card']);
}

// The template side: the key is known, kept by the declarations table, and checked.
{
  check(
    'allow_empty in a declaration is not an unknown template key (#514)',
    unknownTemplateKeys({ decluttering_templates: { cams: template } }),
    [],
  );
  check(
    'lint has nothing to say about allow_empty (#514)',
    lintTemplate(template).filter((each) => JSON.stringify(each).includes('allow_empty')),
    [],
  );

  const rows = rowsFrom(template.variables);
  check('the declarations table reads allow_empty (#514)', rows[0].allow_empty, true);
  check('and keeps it out of the extra keys (#514)', 'allow_empty' in rows[0].extra, false);
  check('and writes it back where it was (#514)', variablesFrom(rows, 'list'), template.variables);
  const switchedOff = withField(rows[0], 'allow_empty', undefined);
  check(
    'switched off in the table, the key goes (#514)',
    'allow_empty' in variablesFrom([switchedOff], 'list')[0],
    false,
  );
  const added = withField(rowsFrom([{ name: 'note_text', type: 'text' }])[0], 'allow_empty', true);
  check('switched on, it is written after the other keys (#514)', variablesFrom([added], 'list'), [
    { name: 'note_text', type: 'text', allow_empty: true },
  ]);

  check('requiredButEmpty: allow_empty alone is fine (#514)', requiredButEmpty(template), []);
  const both = {
    variables: [{ name: 'camera', type: 'entity', required: true, allow_empty: true }],
    card: { type: 'picture-entity', entity: '[[camera]]' },
  };
  check('requiredButEmpty: required with allow_empty is flagged (#514)', requiredButEmpty(both), ['camera']);
  check('and not as a required-with-default contradiction (#514)', diagnoseTemplate(both).contradictory, []);
}
