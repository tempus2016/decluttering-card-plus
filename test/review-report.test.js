/*
 * The debug report after the 2026-11-27 review: the secret-name pattern on a long word, which
 * values are hunted down by value, what Try a placeholder hides, and the tree's titles and counts.
 * Run with `npm test`.
 */
const deepReplace = require('../.test-build/deep-replace.js').default;
const { newTrace } = require('../.test-build/trace.js');
const { redact, secretValues, formatReport, SECRET_NAME } = require('../.test-build/report.js');
const { reportTree } = require('../.test-build/report-tree.js');
const { tryScopes, tryInReport } = require('../.test-build/report-try.js');
const { registerLanguage } = require('../.test-build/localize.js');

const { check } = require('./check');

console.warn = () => {};

/* ------------------------------------------------------------------ a long word of secret words */

for (const unit of ['pass_', 'token-', 'x_code_']) {
  const started = Date.now();
  redact(unit.repeat(800));
  check(`a 4000-character word of "${unit}" is read in well under two seconds`, Date.now() - started < 2000, true);
}
check('a name of many parts is still a secret name', SECRET_NAME.test('a_b_c_d_e_f_api_key_g_h'), true);
check(
  'and its value still goes',
  redact('front_door_camera_stream_password_main: hunter2'),
  'front_door_camera_stream_password_main: <redacted>',
);
check(
  'a query key still goes',
  redact('http://x/y?my_access_token=abc&z=1').includes('my_access_token=<redacted>'),
  true,
);

/* ------------------------------------------------------------------ everyday values are not hunted */

const built = {
  type: 'entities',
  show_header_toggle: false,
  title: 'Lights on the light circuit',
  entities: [{ entity: 'light.kitchen', secondary_info: 'none', name: 'Zone 123 hunter2pass 4321' }],
};
const row = (variable, value) => ({ variable, value, from: 'card' });
const reportsWith = (variables) => [
  { label: '"alarm"', chain: [], ms: 1, sections: [{ variables, trace: newTrace(), built }] },
];

const everyday = reportsWith([
  row('show_code', false),
  row('code_format', 'none'),
  row('pin_entity', 'light'),
  row('pin', 123),
  row('auth', 'Auto'),
  row('lat', 57.1),
]);
check('a boolean, a common word, a domain and a short number are not looked for by value', secretValues(everyday), []);
const everydayReport = formatReport({ context: { version: '0' }, reports: everyday, built });
check('so false stays in what the card built', everydayReport.includes('show_header_toggle: false'), true);
check('and the entity id keeps its domain', everydayReport.includes('entity: light.kitchen'), true);
check('and a word in a title stays', everydayReport.includes('Lights on the light circuit'), true);
check(
  'the value at the secret-named key is still blanked',
  everydayReport.includes('| show\\_code | `<redacted>`'),
  true,
);
check('each of them', everydayReport.includes('| pin\\_entity | `<redacted>`'), true);
check('the number too', /\| pin \| `<redacted>`/.test(everydayReport), true);

const real = reportsWith([
  row('password', 'hunter2pass'),
  row('pin', 4321),
  row('creds', { api_key: 'AbCdEfGh', note: 'x' }),
]);
check('a real secret is still looked for by value, longest first', secretValues(real), [
  'hunter2pass',
  'AbCdEfGh',
  '4321',
]);
const realReport = formatReport({ context: { version: '0' }, reports: real, built });
check('and taken out wherever it turns up', realReport.includes('hunter2pass') || realReport.includes('4321'), false);
check(
  'a late build is read as well',
  (() => {
    const later = reportsWith([row('password', 'firstsecret')]);
    secretValues(later);
    later.push(reportsWith([row('token', 'secondsecret')])[0]);
    return secretValues(later);
  })(),
  ['secondsecret', 'firstsecret'],
);

/* ------------------------------------------------------------------ Try a placeholder */

const variables = [{ password: 'hunter2secret' }, { pin: '123' }, { name: '' }, { creds: { api_key: 'AbCdEfGh' } }];
const evaluate = (content, onMissing, values) =>
  deepReplace(values ?? variables, {}, content, undefined, undefined, true, onMissing);
const tried = [
  {
    label: '"t"',
    chain: [],
    ms: 1,
    sections: [
      {
        variables: variables.map((each) => row(Object.keys(each)[0], Object.values(each)[0])),
        trace: newTrace(),
        built: {},
        evaluate,
      },
    ],
  },
];
const scope = tryScopes(tried)[0];
const shown = (expression) => {
  const result = tryInReport(scope, expression, tried, true);
  return [result.whole.value, ...result.steps.map((step) => step.value)];
};
check(
  'a secret read through or: and reshaped is hidden',
  shown('[[name|or:password|upper]]').includes('HUNTER2SECRET'),
  false,
);
check('a short one read through or: is hidden', shown('[[name|or:pin]]').includes('123'), false);
check('one split and joined is hidden', shown('[[name|or:password|split:2|join:-]]').includes('hunter-secret'), false);
check('a secret-named key of a mapping is hidden', shown('[[creds.api_key|lower]]').includes('abcdefgh'), false);
check('a condition on a secret hides the lot', shown('[[name|if:password|default:x]]'), [
  '<redacted>',
  '<redacted>',
  '<redacted>',
  '<redacted>',
]);
check(
  'an ordinary one is still shown',
  tryInReport(scope, '[[missing|default:shown]]', tried, true).whole.value,
  'shown',
);
check(
  'unredacted shows everything',
  tryInReport(scope, '[[name|or:password|upper]]', tried, false).whole.value,
  'HUNTER2SECRET',
);

/* ------------------------------------------------------------------ the tree's titles and counts */

const titles = (hass) => {
  const trace = newTrace();
  trace.items = [{ placeholder: '[[row|with:x=1]]', trace: newTrace() }];
  const nodes = reportTree(
    { reports: [{ label: '"t"', chain: [], ms: 1, sections: [{ variables: [], trace, built: {} }] }], neverBuilt: [] },
    hass,
  );
  const card = nodes[nodes.length - 1];
  const item = card.children.find((node) => node.id === 'r0-s0-i0');
  return [...card.children.slice(0, 2).map((node) => node.title), ...item.children.map((node) => node.title)];
};
check('in English the groups are titled as they were', titles({ language: 'en' }), [
  'Variables',
  'Placeholders',
  'Its values, as each ended up',
  'Placeholders',
]);
registerLanguage('zh-Hans', require('../.test-build/locales/zh-Hans.json'));
registerLanguage('fr', require('../.test-build/locales/fr.json'));
registerLanguage('de', require('../.test-build/locales/de.json'));
for (const language of ['zh-Hans', 'fr', 'de']) {
  const got = titles({ language });
  check(
    `in ${language} no title ends in a colon, a comma or a space`,
    got.filter((title) => /[\s,:，：]$/.test(title)),
    [],
  );
  check(
    `in ${language} the two table titles are the short ones`,
    [got[0].length < 20, got[1].length < 20],
    [true, true],
  );
}

const outer = newTrace();
outer.warnings.push('one');
const inner = newTrace();
inner.warnings.push('two', 'one');
outer.items = [{ placeholder: '[[row|with:x=1]]', trace: inner }];
const counted = reportTree(
  {
    reports: [{ label: '"t"', chain: [], ms: 1, sections: [{ variables: [], trace: outer, built: {} }] }],
    neverBuilt: [],
  },
  { language: 'en' },
);
const top = counted.find((node) => node.id === 'warnings');
const cardNode = counted[counted.length - 1];
check('the list at the top has both warnings', top.meta, '2');
check("and the card's own count agrees, a fill's warning included", cardNode.meta.endsWith('2 ⚠'), true);
check('as does its own warnings group', cardNode.children.find((node) => node.id === 'r0-s0-warnings').meta, '2');
