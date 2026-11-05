/*
 * Unit tests for src/checks.ts - a template's `checks:` (#389): which fail with the values a
 * card gives, what each says, and what `[[__alerts__]]` holds. Run with `npm test`.
 */
const deepReplace = require('../.test-build/deep-replace.js').default;
const {
  runChecks,
  checkLevel,
  checksOf,
  conditionResult,
  alertsValue,
  withAlerts,
  wantsAlerts,
  stoppingError,
  alertConsoleMessage,
} = require('../.test-build/checks.js');
const { lintTemplate } = require('../.test-build/lint.js');
const { diagnoseInstance, usedVariables } = require('../.test-build/variables.js');
const { formatReport } = require('../.test-build/report.js');

const { check } = require('./check');

const hass = {
  states: { 'camera.front': { state: 'idle', attributes: {} }, 'camera.dummy_back': { state: 'idle', attributes: {} } },
  entities: {},
};

// The checks a template fails with a card's variables, filled in the way the card fills them.
const run = (template, variables = [], name = 'cam') =>
  runChecks(template, name, (content) => deepReplace(variables, template, content, name, hass, true), hass);

const camera = {
  default: [{ prefix: 'front' }, { camera: 'camera.[[prefix]]' }],
  checks: [
    {
      name: 'No camera',
      condition: '[[camera|exists]]',
      fail_on: false,
      level: 'error',
      message: 'The camera [[camera]] is not in Home Assistant.',
      continue_rendering: false,
    },
    { name: 'Dummy', condition: '[[camera|contains:dummy]]', level: 'warning', message: '[[camera]] is a dummy.' },
    { level: 'info', condition: true, message: 'Building for [[camera]]' },
  ],
  card: { type: 'picture-entity', entity: '[[camera]]' },
};

/* ---------------------------------------------------------------- which fail */

check('a camera that exists fails only the info', run(camera), [
  { level: 'info', message: 'Building for camera.front', template: 'cam', stop: false },
]);
check('one that does not fails the error, with its message filled in', run(camera, [{ prefix: 'garage' }]), [
  {
    level: 'error',
    message: 'The camera camera.garage is not in Home Assistant.',
    name: 'No camera',
    template: 'cam',
    stop: true,
  },
  { level: 'info', message: 'Building for camera.garage', template: 'cam', stop: false },
]);
check(
  'a dummy fails the warning - warning reads as warn',
  run(camera, [{ prefix: 'dummy_back' }]).map((alert) => [alert.level, alert.message]),
  [
    ['warn', 'camera.dummy_back is a dummy.'],
    ['info', 'Building for camera.dummy_back'],
  ],
);

const showIf = {
  default: [{ mode: 'auto' }],
  checks: [
    { condition: 'entity', fail_on: false, message: 'No entity.' },
    { condition: '!name', level: 'info', message: 'Unnamed.' },
    { condition: 'mode=manual', message: 'Manual.' },
    { condition: 'if:mode!=auto', message: 'Not auto.' },
  ],
  card: { type: 'tile' },
};
check(
  "show_if's conditions read the values the card builds with",
  run(showIf).map((alert) => alert.message),
  ['No entity.', 'Unnamed.'],
);
check(
  'and change as they do',
  run(showIf, [{ entity: 'light.a' }, { name: 'A' }, { mode: 'manual' }]).map((alert) => alert.message),
  ['Manual.', 'Not auto.'],
);
check(
  'a value written with placeholders is read filled in',
  run({ default: [{ room: 'kitchen' }, { light: 'light.[[room]]' }], checks: [{ condition: 'light=light.kitchen' }] })
    .length,
  1,
);

check(
  'a condition nobody can read is passed over, as show_if does',
  run({ checks: [{ condition: 'a b c' }, { condition: ['x'] }, { message: 'no condition' }] }),
  [],
);
check(
  'true and false, as YAML or text',
  [true, false, 'true', 'FALSE', 1, 0].map((condition) => conditionResult(condition, () => undefined)),
  [true, false, true, false, true, false],
);
check(
  'text whose placeholders had nothing to fill them is a no',
  conditionResult('[[nothing]]', (text) => text),
  false,
);

/* ---------------------------------------------------------------- what each says */

check(
  'no message gets a generic one, naming the check when it has a name',
  run({ checks: [{ condition: true }, { name: 'Always', condition: true }] }).map((alert) => alert.message),
  ['A check on template "cam" failed.', 'Check "Always" on template "cam" failed.'],
);
check(
  'no level is a warning, and one nobody knows is too',
  [undefined, null, '', 'warn', 'WARNING', 'info', 'error', 'loud'].map(checkLevel),
  ['warn', 'warn', 'warn', 'warn', 'warn', 'info', 'error', undefined],
);
check(
  'only an error stops, and only with continue_rendering: false',
  run({
    checks: [
      { condition: true, level: 'warn', continue_rendering: false },
      { condition: true, level: 'error' },
      { condition: true, level: 'error', continue_rendering: true },
      { condition: true, level: 'error', continue_rendering: false },
    ],
  }).map((alert) => alert.stop),
  [false, false, false, true],
);
check(
  'a single mapping counts as a list of one, and anything not a mapping is left out',
  [
    checksOf({ checks: { condition: true } }).length,
    checksOf({ checks: [1, 'x', null, {}] }).length,
    checksOf({}).length,
  ],
  [1, 1, 0],
);
check(
  'the stopping checks are the error the card fails with',
  [
    stoppingError([
      { level: 'error', message: 'Gone.', stop: true },
      { level: 'error', message: 'Also.', stop: true },
    ]),
    stoppingError([{ level: 'error', message: 'Gone.', stop: false }]),
  ],
  ['A check stopped this card being built: Gone. Also.', undefined],
);
check(
  'the console line names the template',
  alertConsoleMessage({ level: 'warn', message: 'Hm.', template: 'cam', stop: false }),
  'decluttering-card-plus: a check on template "cam" failed: Hm.',
);

/* ---------------------------------------------------------------- __alerts__ */

const alerts = [
  { level: 'warn', message: 'this is a warning', name: 'W', template: 'cam', stop: false },
  { level: 'error', message: 'this was an error', template: 'cam', stop: false },
];
check('__alerts__ holds every alert and each level on its own', alertsValue(alerts), {
  all: {
    count: 2,
    highest_level: 'error',
    items: [
      { level: 'warn', message: 'this is a warning', name: 'W', template: 'cam' },
      { level: 'error', message: 'this was an error', template: 'cam' },
    ],
  },
  info: { count: 0, items: [] },
  warn: { count: 1, items: ['this is a warning'] },
  error: { count: 1, items: ['this was an error'] },
});
check('with nothing failed it is still there, empty', alertsValue([]).all, { count: 0, highest_level: '', items: [] });

const shows = {
  card: {
    type: 'markdown',
    content: '[[__alerts__.all.count]]: [[__alerts__.warn.items|join:, ]]',
    raw: '[[__alerts__]]',
  },
};
check(
  'a template can show them itself',
  deepReplace(withAlerts([{ x: 1 }], alerts), shows, shows.card, 'cam', hass, true),
  { type: 'markdown', content: '2: this is a warning', raw: alertsValue(alerts) },
);
check(
  "the build's own beats one handed down from the card around it, or set by hand",
  deepReplace(withAlerts([{ __alerts__: 'mine' }], alerts), shows, '[[__alerts__.all.count]]', 'cam', hass, true),
  2,
);
check(
  'only a template with checks, or one that reads __alerts__, is given it',
  [
    wantsAlerts({ checks: [{ condition: true }], card: {} }),
    wantsAlerts(shows),
    wantsAlerts({ card: { type: 'tile' } }),
  ],
  [true, true, false],
);

/* ---------------------------------------------------------------- editor diagnostics */

check(
  'a variable only a check reads is used, and not missing when the check reads it the show_if way',
  [
    usedVariables({ checks: [{ condition: '!flag', message: '[[note]]' }], card: { type: 'tile' } }).sort(),
    diagnoseInstance([{ flag: true }], { checks: [{ condition: '!flag' }], card: { type: 'tile' } }),
  ],
  [['flag', 'note'], { missing: [], unused: [], required: [] }],
);
check(
  '__alerts__ is never missing',
  diagnoseInstance([], { card: { type: 'markdown', content: '[[__alerts__.all.count]] [[__alerts__]]' } }).missing,
  [],
);
check(
  'what the alert: reads is used too',
  usedVariables({ alert: { type: 'markdown', content: '[[help_text]]' }, card: { type: 'tile' } }),
  ['help_text'],
);

/* ---------------------------------------------------------------- lint */

const lint = (template) =>
  lintTemplate(template).map((f) => `${f.level} ${f.key} ${JSON.stringify(f.params)} @${f.path}`);

check(
  'well-written checks say nothing',
  lint({
    variables: [{ name: 'camera' }, { name: 'mode' }],
    checks: [
      {
        name: 'a',
        condition: '[[camera|exists]]',
        fail_on: false,
        level: 'error',
        message: '[[camera]] is gone',
        continue_rendering: false,
      },
      { condition: '!mode', level: 'info' },
      { condition: true, level: 'warning' },
    ],
    card: { type: 'markdown', content: '[[__alerts__.all.count]] [[camera]] [[mode]]' },
  }),
  [],
);
check('checks that are not a list', lint({ checks: 'x', card: {} }), ['warning lint.checks_not_list {} @checks']);
check(
  'what is wrong with one check',
  lint({
    variables: [{ name: 'camera' }],
    checks: [
      'x',
      { condition: 'camera', levle: 'error' },
      { condition: 'camera', level: 'loud' },
      { message: 'no condition' },
      { condition: 'a b' },
      { condition: 'camra' },
      { condition: '[[camera|uper]]', message: '[[camera]' },
    ],
    card: { type: 'tile', entity: '[[camera]]' },
  }),
  [
    'warning lint.check_not_mapping {} @checks[0]',
    'warning lint.check_key_unknown {"key":"levle"} @checks[1]',
    'warning lint.check_level_unknown {"level":"loud"} @checks[2].level',
    'warning lint.check_no_condition {} @checks[3]',
    'warning lint.check_condition_malformed {"condition":"a b"} @checks[4].condition',
    'warning lint.unclosed {} @checks[6].message',
    'warning lint.unknown_step {"step":"uper","placeholder":"[[camera|uper]]","closest":"upper"} @checks[6].condition',
    'warning lint.target_unknown {"name":"camra","placeholder":"condition: camra","closest":"camera"} @checks[5].condition',
  ],
);

/* ---------------------------------------------------------------- the report */

const report = formatReport({
  context: { version: '2.8.0' },
  reports: [
    {
      label: '"cam"',
      chain: [],
      ms: 1,
      sections: [],
      alerts: [
        { level: 'error', message: 'The camera is gone.', name: 'No camera' },
        { level: 'warn', message: 'A dummy.' },
      ],
    },
    { label: '"inner"', chain: [], ms: 1, sections: [], alerts: [{ level: 'info', message: 'Hello.' }] },
  ],
});
const checksAt = report.indexOf('## Failed checks');
check(
  'the report lists every failed check, the cards inside too, ahead of the builds',
  [
    checksAt > 0 && checksAt < report.indexOf('<details>'),
    report.includes('- **error** The camera is gone. (check "No camera" on "cam")'),
    report.includes('- **warn** A dummy. (on "cam")'),
    report.includes('- **info** Hello. (on "inner")'),
  ],
  [true, true, true, true],
);
check(
  'and says nothing when none failed',
  formatReport({
    context: { version: '2.8.0' },
    reports: [{ label: '"cam"', chain: [], ms: 1, sections: [] }],
  }).includes('Failed checks'),
  false,
);
