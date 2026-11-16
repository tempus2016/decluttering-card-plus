/*
 * #474: the debug report shows the card as written, the last few rebuild_on rebuilds and the
 * checks that passed, in the Markdown and in the tree, redacted like everything else. The
 * rebuild log's comparison - which entity, which part - is checked against real snapshots.
 * Run with `npm test`.
 */
const { check } = require('./check');
const deepReplace = require('../.test-build/deep-replace.js').default;
const { runChecks } = require('../.test-build/checks.js');
const { formatReport, passedChecks, passedText } = require('../.test-build/report.js');
const { reportTree } = require('../.test-build/report-tree.js');
const { localize } = require('../.test-build/localize.js');
const {
  stateSnapshot,
  snapshotChanges,
  noteRebuild,
  changesText,
  clockTime,
  REBUILD_LOG_SIZE,
} = require('../.test-build/rebuild.js');

/* ------------------------------------------------------------ passed checks */

const hass = { states: { 'camera.front': { state: 'idle', attributes: {} } }, entities: {} };
const template = {
  default: [{ camera: 'camera.front' }, { mode: 'night' }],
  checks: [
    { name: 'No camera', condition: '[[camera|exists]]', fail_on: false, message: 'gone' },
    { condition: 'mode=day', fail_on: true, message: 'day mode' },
    { name: 'Daytime', condition: 'mode=night', message: 'night' },
  ],
  card: { type: 'picture-entity', entity: '[[camera]]' },
};
const fill = (content) => deepReplace([], template, content, 'cam', hass, true);
const passed = [];
const alerts = runChecks(template, 'cam', fill, hass, passed);

check(
  'the failed check is still the only alert',
  alerts.map((alert) => alert.message),
  ['night'],
);
check('the checks that passed are written down, with what each read', passed, [
  { name: 'No camera', condition: '[[camera|exists]]', values: [['[[camera|exists]]', true]] },
  { condition: 'mode=day', values: [['[[mode]]', 'night']] },
]);
check(
  'without a list to fill, runChecks says the same as before',
  runChecks(template, 'cam', fill, hass).map((alert) => alert.message),
  ['night'],
);
check(
  'a passed check in one line: a condition that is one placeholder says what it became',
  passed.map((each) => passedText(each, true)),
  ['No camera: [[camera|exists]] → true', 'mode=day ([[mode]] → night)'],
);
check(
  'a value read through a secret-looking name is taken out when redacting',
  [
    passedText({ condition: 'pin=1234', values: [['[[pin]]', '9876']] }, true),
    passedText({ condition: 'pin=1234', values: [['[[pin]]', '9876']] }, false),
  ],
  ['pin=1234 ([[pin]] → <redacted>)', 'pin=1234 ([[pin]] → 9876)'],
);

/* ------------------------------------------------------------ the report */

const section = { variables: [], trace: { placeholders: new Map(), dropped: [], warnings: [] }, built: { type: 'x' } };
const at = new Date(2026, 10, 16, 9, 5, 7).getTime();
const report = {
  label: '"cam"',
  chain: [],
  ms: 1,
  sections: [section],
  template: { name: 'cam', config: { card: { type: 'x' } } },
  card: {
    type: 'custom:decluttering-card-plus',
    template: 'cam',
    rebuild_on: 'input_select.layout',
    variables: [{ password: 'hunter22' }, { url: 'http://192.168.1.20:8123/x' }],
  },
  alerts: [{ level: 'warn', message: 'night' }],
  passed,
  rebuilds: [
    { at, changes: [{ entity: 'input_select.layout', parts: ['state'] }] },
    { at: at - 60000, changes: [{ entity: 'camera.front', parts: ['attr:camera_name', 'last_updated'] }] },
  ],
};
const input = { context: { version: '9.9.9' }, reports: [report] };
const text = formatReport(input);
const unredacted = formatReport({ ...input, unredacted: true });

check(
  'the card as written comes just ahead of the template',
  text.indexOf('### This card, as written') > -1 &&
    text.indexOf('### This card, as written') < text.indexOf('### Template "cam"'),
  true,
);
check(
  'the card is redacted like the rest: the password and the address go',
  [text.includes('hunter22'), text.includes('192.168.1.20'), text.includes('rebuild_on: input_select.layout')],
  [false, false, true],
);
check(
  'redact: false leaves the card as written',
  [unredacted.includes('password: hunter22'), unredacted.includes('192.168.1.20')],
  [true, true],
);
check(
  'the rebuilds are listed newest first, with the time, the entity and what moved',
  text.split('\n').filter((line) => line.startsWith('- `')),
  ['- `09:05:07` input\\_select.layout (state)', '- `09:04:07` camera.front (attr:camera\\_name, last\\_updated)'],
);
check(
  'the checks that passed come after the failed ones, folded',
  [
    text.indexOf('## Failed checks') < text.indexOf('<summary><b>Checks that passed</b></summary>'),
    text.includes('<details>\n<summary><b>Checks that passed</b></summary>'),
  ],
  [true, true],
);
check(
  'each passed check says where it came from',
  text.includes('- No camera: \\[\\[camera\\|exists\\]\\] → true (on "cam")'),
  true,
);
check(
  'a report with no passed checks, rebuilds or card has none of the sections',
  ['This card, as written', 'Recent rebuilds', 'Checks that passed'].map((heading) =>
    formatReport({
      context: { version: '1' },
      reports: [{ ...report, card: undefined, passed: undefined, rebuilds: undefined }],
    }).includes(heading),
  ),
  [false, false, false],
);
check(
  'passedChecks gathers every build, each with its label',
  passedChecks([report, { ...report, label: 'inner' }]).map((each) => each.label),
  ['"cam"', '"cam"', 'inner', 'inner'],
);

/* ------------------------------------------------------------ the tree */

const tree = reportTree({ reports: [report], neverBuilt: [] });
const card = tree.find((node) => node.id === 'r0');
check(
  'the passed checks sit right after the failed ones, closed',
  tree.map((node) => [node.id, node.open]),
  [
    ['checks', true],
    ['checks-passed', undefined],
    ['r0', true],
  ],
);
check(
  'each passed check is a leaf with where it came from',
  tree[1].children.map((leaf) => [leaf.title, leaf.meta]),
  [
    ['No camera: [[camera|exists]] → true', 'on "cam"'],
    ['mode=day ([[mode]] → night)', 'on "cam"'],
  ],
);
check(
  'the card as written leads the build, then the template and the rebuilds',
  card.children.slice(0, 3).map((node) => [node.id, node.kind, node.title]),
  [
    ['r0-card', 'code', 'This card, as written'],
    ['r0-template', 'code', 'Template "cam"'],
    ['r0-rebuilds', 'group', 'Recent rebuilds, newest first'],
  ],
);
check(
  'the tree redacts the card too, unless asked not to',
  [
    card.children[0].text.includes('hunter22'),
    reportTree({ reports: [report], neverBuilt: [], unredacted: true })
      .find((node) => node.id === 'r0')
      .children[0].text.includes('hunter22'),
  ],
  [false, true],
);
check(
  'each rebuild is a leaf with its time beside it',
  card.children[2].children.map((leaf) => [leaf.title, leaf.meta]),
  [
    ['input_select.layout (state)', '09:05:07'],
    ['camera.front (attr:camera_name, last_updated)', '09:04:07'],
  ],
);

/* ------------------------------------------------------------ the rebuild log */

const state = (value, extra = {}) => ({
  state: value,
  last_updated: '2026-11-16T09:00:00+00:00',
  attributes: { camera_name: 'Front' },
  ...extra,
});
const entities = ['input_select.layout', 'camera.front'];
const before = { states: { 'input_select.layout': state('grid'), 'camera.front': state('idle') } };
const layout = { states: { ...before.states, 'input_select.layout': state('list') } };
const attribute = {
  states: {
    ...before.states,
    'camera.front': state('idle', { last_updated: 'later', attributes: { camera_name: 'Porch' } }),
  },
};

check(
  'a state that moved is named with its entity',
  snapshotChanges(entities, stateSnapshot(before, entities), stateSnapshot(layout, entities)),
  [{ entity: 'input_select.layout', parts: ['state'] }],
);
check(
  'reading attr: an attribute moving shows as last_updated, the state as unchanged',
  snapshotChanges(entities, stateSnapshot(before, entities, true), stateSnapshot(attribute, entities, true), true),
  [{ entity: 'camera.front', parts: ['last_updated'] }],
);
const watched = [undefined, ['state', 'attr:camera_name']];
check(
  'with parts to watch, the attribute that moved is named',
  snapshotChanges(
    entities,
    stateSnapshot(before, entities, false, watched),
    stateSnapshot(attribute, entities, false, watched),
    false,
    watched,
  ),
  [{ entity: 'camera.front', parts: ['attr:camera_name'] }],
);
check(
  'an entity that comes or goes says so',
  [
    snapshotChanges(['a.b'], [undefined], ['on']),
    snapshotChanges(['a.b'], ['on'], [undefined]),
    changesText([
      { entity: 'a.b', parts: ['appeared'] },
      { entity: 'c.d', parts: ['gone'] },
    ]),
  ],
  [[{ entity: 'a.b', parts: ['appeared'] }], [{ entity: 'a.b', parts: ['gone'] }], 'a.b (appeared), c.d (gone)'],
);
check('nothing moved is no change', snapshotChanges(entities, ['a', 'b'], ['a', 'b']), []);

let log = [];
for (let i = 0; i < REBUILD_LOG_SIZE + 3; i++) log = noteRebuild(log, { at: i, changes: [] });
check(
  'the log keeps the last ten, newest first',
  log.map((each) => each.at),
  [12, 11, 10, 9, 8, 7, 6, 5, 4, 3],
);
check('a time reads as the clock does', clockTime(new Date(2026, 0, 1, 7, 3, 9).getTime()), '07:03:09');
check(
  'the console line names the card and what moved',
  localize('rebuild.console', { label: '"cam"', changes: 'input_select.layout (state)' }),
  'decluttering-card-plus: "cam" rebuilt because input_select.layout (state) changed',
);
