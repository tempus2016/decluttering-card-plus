/*
 * The report tree (idea 51) leads with the failed checks (#389) and every warning (#391), the
 * way the Markdown report does, so a folded nested build cannot hide one. An info check is
 * said in the console only, so neither view lists it. Run with `npm test`.
 */
const { check } = require('./check');
const { reportTree } = require('../.test-build/report-tree');
const { formatReport } = require('../.test-build/report');

const trace = (warnings, items) => ({ placeholders: new Map(), dropped: [], warnings, items });
const section = (warnings, label, items) => ({ label, variables: [], trace: trace(warnings, items), built: {} });
const build = (label, sections, extra = {}) => ({ label, chain: [], ms: 1, sections, ...extra });

// The repro from ha-dev: outer with a missing placeholder, inner nested inside it with another.
const outer = build('outer', [section(['[[missing_one]] left as written: no variable named missing_one'])], {
  alerts: [
    { level: 'info', message: 'just so you know' },
    { level: 'error', message: 'The camera is not there.', name: 'No camera' },
  ],
});
const inner = build(
  'inner',
  [
    section(['[[inner_missing]] left as written: no variable named inner_missing'], 'copy 1', [
      { name: 'row', trace: trace(['in a fill']) },
    ]),
  ],
  { chain: ['outer'], alerts: [{ level: 'warn', message: 'token=abc123secret is odd' }] },
);
const input = { reports: [outer, inner], neverBuilt: [], full: { type: 'vertical-stack' }, error: 'it broke' };
const tree = reportTree(input);

check(
  'the error, failed checks and warnings lead, then the end result and the builds',
  tree.map((node) => node.id),
  ['error', 'checks', 'warnings', 'full', 'r0', 'r1'],
);
check(
  'both top nodes are open groups',
  [tree[1].kind, tree[1].open, tree[2].kind, tree[2].open],
  ['group', true, 'group', true],
);
check('the checks node uses the report heading and a count', [tree[1].title, tree[1].meta], ['Failed checks', '2']);
check(
  'each failed check says its level, its message and where it came from, info left out',
  tree[1].children.map((leaf) => [leaf.title, leaf.meta, leaf.warn]),
  [
    ['error: The camera is not there.', 'check "No camera" on outer', true],
    ['warn: token=<redacted> is odd', 'on inner', true],
  ],
);
check('the warnings node has a count', [tree[2].title, tree[2].meta], ['Warnings', '3']);
check(
  'every warning, nested and from a fill, with the build it came from',
  tree[2].children.map((leaf) => [leaf.title, leaf.meta, leaf.warn]),
  [
    ['[[missing_one]] left as written: no variable named missing_one', 'outer', true],
    ['[[inner_missing]] left as written: no variable named inner_missing', 'inner › copy 1', true],
    ['in a fill', 'inner › copy 1', true],
  ],
);
check(
  'the nested build stays folded and its warning is still in view',
  [tree[5].open, tree[2].children[1].title.includes('inner_missing')],
  [false, true],
);
check(
  'redact: false leaves a check message as written',
  reportTree({ ...input, unredacted: true })[1].children[1].title,
  'warn: token=abc123secret is odd',
);

{
  const one = reportTree({ reports: [build('solo', [section(['only one'])])], neverBuilt: [] });
  check('one build with one section does not say where a warning came from', one[0].children[0].meta, undefined);
}

{
  const clean = reportTree({ reports: [build('clean', [section([])])], neverBuilt: [], built: { type: 'tile' } });
  check(
    'neither top node shows when it has nothing',
    clean.map((node) => node.id),
    ['built', 'r0'],
  );
  const quiet = reportTree({
    reports: [build('quiet', [section([])], { alerts: [{ level: 'info', message: 'fyi' }] })],
    neverBuilt: [],
  });
  check(
    'a report with only info checks has no checks node',
    quiet.map((node) => node.id),
    ['r0'],
  );
}

{
  const text = formatReport({ context: { version: '1' }, ...input });
  check('the Markdown report lists the failed checks', text.includes('## Failed checks'), true);
  check('and leaves the info check out of them', text.includes('just so you know'), false);
  check(
    'in the same order as the tree: checks, then warnings',
    text.indexOf('## Failed checks') < text.indexOf('## Warnings'),
    true,
  );
  const quiet = formatReport({
    context: { version: '1' },
    reports: [build('quiet', [section([])], { alerts: [{ level: 'info', message: 'fyi' }] })],
    neverBuilt: [],
  });
  check('only info checks give no Failed checks section', quiet.includes('## Failed checks'), false);
}
