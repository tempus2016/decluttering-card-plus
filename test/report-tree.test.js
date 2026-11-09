/*
 * The debug report as a tree (idea 51): built from the trace, searchable, and turned into a
 * prefilled GitHub issue.
 */
const { check } = require('./check');
const {
  reportTree,
  searchTree,
  nodeHits,
  highlightParts,
  issueUrl,
  issueFromReport,
  ISSUE_URL_LIMIT,
} = require('../.test-build/report-tree');

const section = (label, warnings = []) => ({
  label,
  variables: [
    { variable: 'entity', value: 'light.kitchen_ceiling', from: 'card' },
    { variable: 'password', value: 'hunter22', from: 'card' },
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
check("variables are a table with the report's columns (#412)", tree[3].children[1].children[0].kind, 'table');
check('the variables table has every column the Markdown table has', tree[3].children[1].children[0].columns, [
  'variable',
  'value',
  'from',
  'worked out to',
  'how',
]);
check(
  'a variable row has its value, where it came from and what it worked out to',
  tree[3].children[1].children[0].rows[0].slice(0, 4),
  ['entity', 'light.kitchen_ceiling', 'this card', 'light.kitchen_ceiling'],
);
check(
  'placeholders are a table too',
  [tree[3].children[2].children[0].kind, tree[3].children[2].children[0].rows[0][0]],
  ['table', '[[entity]]'],
);
check(
  'a secret is redacted in the table, the placeholder and the result',
  [
    JSON.stringify(tree[3].children[1].children[0].rows).includes('hunter22'),
    JSON.stringify(tree[3].children[2].children[0].rows).includes('hunter22'),
    tree[3].children[5].text.includes('hunter22'),
    tree[1].text.includes('hunter22'),
  ],
  [false, false, false, false],
);
check('a search finds a table cell', searchTree(tree, 'this card').matches > 0, true);
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
  [4, 2, true, ['warnings-0']],
);
check('a search looks inside code too', searchTree(tree, 'kitchen_ceiling').matches >= 4, true);
check('search is case-insensitive, and counts both hits in each warning', searchTree(tree, 'BRIGHTNESS').matches, 4);
check('an empty search is the whole tree', searchTree(tree, '  ').nodes === tree, true);
check('a miss is empty with a zero count', searchTree(tree, 'zzzz'), { nodes: [], matches: 0 });
// #412 follow-up: the count is the number of highlights drawn, not the number of nodes hit.
const shownHits = (nodes, query) => {
  let marks = 0;
  const mark = (text) => (marks += text ? highlightParts(text, query).filter((part) => part.hit).length : 0);
  const draw = (node) => {
    if (node.kind === 'table') [...node.columns, ...node.rows.flat()].forEach(mark);
    else [node.title, node.meta, node.kind === 'code' ? node.text : ''].forEach(mark);
    (node.children ?? []).forEach(draw);
  };
  nodes.forEach(draw);
  return marks;
};
for (const query of ['this card', 'kitchen_ceiling', 'entity', 'copy', 'e']) {
  const result = searchTree(tree, query);
  check(`the count is the highlights drawn: "${query}"`, result.matches, shownHits(result.nodes, query));
}
const oneTable = [
  {
    id: 'g',
    kind: 'group',
    title: 'Variables',
    children: [
      {
        id: 't',
        kind: 'table',
        title: 'ceiling',
        columns: ['name', 'value'],
        rows: [
          ['a', 'Ceiling'],
          ['b', 'ceiling ceiling'],
        ],
      },
    ],
  },
];
check('a table counts each hit in it, and not its hidden title', searchTree(oneTable, 'ceiling').matches, 3);
check('a hidden table title alone is no hit', searchTree(oneTable, 'variab').matches, 1);
check('nodeHits counts one node', nodeHits({ id: 'l', kind: 'leaf', title: 'aa aa', meta: 'aa' }, 'AA'), 3);
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

/*
 * Parity with the Markdown report (#412): every table the formatted report draws for a build,
 * the tree has with the same columns, including item template fills. 2.9.0 shipped a tree
 * that dropped the Worked out and How columns because nothing compared the two.
 */
{
  const { formatReport } = require('../.test-build/report');
  const inner = {
    placeholders: new Map([['[[entity|exists]]', false]]),
    dropped: [],
    warnings: [],
    values: new Map([
      ['entity', 'sensor.a'],
      ['api_password', 'swordfish'],
    ]),
  };
  const withItems = {
    label: 'list',
    chain: [],
    ms: 1,
    sections: [
      {
        variables: [{ variable: 'entity', value: 'sensor.a', from: 'card' }],
        trace: {
          placeholders: new Map([['[[entity]]', 'sensor.a']]),
          dropped: [],
          warnings: [],
          items: [{ placeholder: '[[row|repeat:rooms]]', copy: { number: 1, count: 2 }, trace: inner }],
        },
        built: {},
      },
    ],
  };
  const reports = [room, nested, withItems];
  const text = formatReport({ context: { version: '1' }, reports, neverBuilt: [] });
  const headers = text
    .split('\n')
    .filter((line, i, all) => line.startsWith('| ') && !line.startsWith('| |') && all[i + 1]?.startsWith('| ---'))
    .map((line) =>
      line
        .slice(2, -2)
        .split(' | ')
        .map((cell) => cell.trim().replace(/\\(.)/g, '$1')),
    );
  const tables = [];
  const walk = (nodes) => {
    for (const node of nodes) {
      if (node.kind === 'table') tables.push(node.columns);
      if (node.children) walk(node.children);
    }
  };
  walk(reportTree({ reports, neverBuilt: [] }));
  check('the tree has as many tables as the Markdown report', tables.length, headers.length);
  check('and each has the same columns, in order', tables, headers);
  check("an item fill's secret stays out of the tree", JSON.stringify(tables).includes('swordfish'), false);
}
