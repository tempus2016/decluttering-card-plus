/*
 * The debug report as a tree (idea 51): built from the trace, searchable, and turned into a
 * prefilled GitHub issue.
 */
const { check } = require('./check');
const {
  reportTree,
  searchTree,
  highlightParts,
  issueUrl,
  issueFromReport,
  ISSUE_URL_LIMIT,
} = require('../.test-build/report-tree');

const section = (label, warnings = []) => ({
  label,
  variables: [
    { variable: 'entity', value: 'light.kitchen_ceiling', from: 'this card' },
    { variable: 'password', value: 'hunter22', from: 'this card' },
  ],
  trace: {
    placeholders: new Map([
      ['[[entity]]', 'light.kitchen_ceiling'],
      ['[[password]]', 'hunter22'],
    ]),
    dropped: ['card.icon ([[icon]] was empty)'],
    warnings,
  },
  built: { type: 'tile', entity: 'light.kitchen_ceiling', secret: 'hunter22' },
});
const room = {
  label: 'room_light_tile',
  chain: [],
  ms: 14.2,
  sections: [section(undefined, ['[[brightness_step|default:10]] left as written: no variable named brightness_step'])],
  template: { name: 'room_light_tile', config: { card: { type: 'tile', entity: '[[entity]]' } } },
};
const nested = {
  label: 'sensor_line',
  chain: ['room_light_tile'],
  at: 'card.cards[1]',
  ms: 4,
  sections: [section('Copy 1 of 2'), section('Copy 2 of 2')],
};

const tree = reportTree({
  reports: [room, nested],
  neverBuilt: ['card.cards[2]'],
  full: { type: 'tile', secret: 'hunter22' },
});

check('the warnings lead, open', [tree[0].id, tree[0].open, tree[0].children.length], ['warnings', true, 1]);
check(
  'then the end result, open',
  [tree[1].kind, tree[1].open, tree[1].title.startsWith('decluttering-card-plus: room_light_tile in full')],
  ['code', true, true],
);
check(
  'what never built is a group with a count',
  [tree[2].kind, tree[2].meta, tree[2].children.length],
  ['group', '1', 1],
);
check(
  'one card node per report',
  tree.slice(3).map((n) => [n.kind, n.title.split(' built')[0]]),
  [
    ['card', 'decluttering-card-plus: room_light_tile'],
    ['card', 'decluttering-card-plus: sensor_line'],
  ],
);
check('the first card is open and says its time and warnings', [tree[3].open, tree[3].meta], [true, '14 ms · 1 ⚠']);
check(
  'a card with a template starts with its YAML',
  [tree[3].children[0].kind, tree[3].children[0].title],
  ['code', 'Template "room_light_tile"'],
);
check(
  'then variables, placeholders, taken out, warnings and the result',
  tree[3].children.slice(1).map((n) => n.kind),
  ['group', 'group', 'group', 'group', 'code'],
);
check('variables are leaves with where they came from', tree[3].children[1].children[0], {
  id: 'r0-s0-v0',
  kind: 'leaf',
  title: 'entity: light.kitchen_ceiling',
  meta: 'this card',
});
check(
  'a secret is redacted in the leaf, the placeholder and the result',
  [
    tree[3].children[1].children[1].title.includes('hunter22'),
    tree[3].children[2].children[1].title.includes('hunter22'),
    tree[3].children[5].text.includes('hunter22'),
    tree[1].text.includes('hunter22'),
  ],
  [false, false, false, false],
);
check('warnings are open and marked', [tree[3].children[4].open, tree[3].children[4].children[0].warn], [true, true]);
check(
  'a nested card groups its copies by label',
  tree[4].children.map((n) => [n.kind, n.title]),
  [
    ['group', 'Copy 1 of 2'],
    ['group', 'Copy 2 of 2'],
  ],
);
check('a nested card says where it sits', tree[4].title.includes('inside room_light_tile, at card.cards[1]'), true);

const plain = reportTree({
  reports: [room],
  neverBuilt: [],
  full: { type: 'tile', secret: 'hunter22' },
  unredacted: true,
});
check('redact: false leaves the secret in', plain[1].text.includes('hunter22'), true);
const failed = reportTree({ reports: [], neverBuilt: [], error: 'Refused: [[x]] is not set', built: { type: 'tile' } });
check(
  'an error leads, as a warning leaf, then what was built',
  failed.map((n) => [n.kind, n.warn === true]),
  [
    ['leaf', true],
    ['code', false],
  ],
);

// ---- search
const found = searchTree(tree, 'brightness');
check(
  'a search keeps only the branches that hit, opened',
  [found.matches, found.nodes.length, found.nodes[0].open, found.nodes[0].children.map((n) => n.id)],
  [2, 2, true, ['warnings-0']],
);
check('a search looks inside code too', searchTree(tree, 'kitchen_ceiling').matches >= 4, true);
check('search is case-insensitive', searchTree(tree, 'BRIGHTNESS').matches, 2);
check('an empty search is the whole tree', searchTree(tree, '  ').nodes === tree, true);
check('a miss is empty with a zero count', searchTree(tree, 'zzzz'), { nodes: [], matches: 0 });
check('highlighting cuts the text at every hit', highlightParts('a Kitchen in the kitchen', 'kitchen'), [
  { text: 'a ', hit: false },
  { text: 'Kitchen', hit: true },
  { text: ' in the ', hit: false },
  { text: 'kitchen', hit: true },
]);
check('no query, no cuts', highlightParts('abc', ''), [{ text: 'abc', hit: false }]);

// ---- GitHub issue
const url = issueUrl({ title: '[Bug]: x', card_version: '2.3.0', ha_version: '2026.10.1', what_happened: 'a & b' });
check(
  'the issue address names the form and its fields',
  url.startsWith(
    'https://github.com/tempus2016/decluttering-card-plus/issues/new?template=bug_report.yml&title=%5BBug%5D%3A+x&card_version=2.3.0&ha_version=2026.10.1&what_happened=a+%26+b',
  ),
  true,
);
check('empty fields are left out', issueUrl({ title: 't', browser: '' }).includes('browser'), false);

const short = issueFromReport({
  version: '2.3.0',
  haVersion: '2026.10.1',
  templateName: 'room_light_tile',
  templateYaml: 'card:\n  type: tile',
  cardYaml: 'type: custom:decluttering-card-plus',
  warnings: ['w1'],
  report: '# report\nshort',
});
check(
  'a short report rides in the address',
  [
    short.fits,
    short.url.includes('what_happened='),
    short.url.includes('console=w1'),
    short.url.length <= ISSUE_URL_LIMIT,
  ],
  [true, true, true, true],
);
const long = issueFromReport({ version: '2.3.0', warnings: [], report: 'x'.repeat(ISSUE_URL_LIMIT) });
check(
  'a long report is left for the clipboard and the field says so',
  [long.fits, long.url.length <= ISSUE_URL_LIMIT, long.url.includes('what_happened=')],
  [false, true, true],
);
const huge = issueFromReport({
  version: '2.3.0',
  templateYaml: 'y'.repeat(ISSUE_URL_LIMIT),
  cardYaml: 'z'.repeat(ISSUE_URL_LIMIT),
  warnings: ['w'.repeat(ISSUE_URL_LIMIT)],
  report: 'r',
});
check(
  'fields are dropped largest-last until the address fits',
  [huge.url.length <= ISSUE_URL_LIMIT, huge.url.includes('template_yaml'), huge.url.includes('card_version=2.3.0')],
  [true, false, true],
);
