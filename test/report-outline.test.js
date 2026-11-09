/*
 * The report's outline (#428): what built what, nested as it sits, each line pointing at its
 * part of the report.
 */
const { check } = require('./check');
const { reportOutline, parentIndexes, outlineTags, outlineLines } = require('../.test-build/report-outline');
const { formatReport } = require('../.test-build/report');
const { reportTree } = require('../.test-build/report-tree');
const deepReplace = require('../.test-build/deep-replace.js').default;
const { newTrace } = require('../.test-build/trace');

const DCP = 'custom:decluttering-card-plus';
const trace = (extra = {}) => ({ placeholders: new Map(), dropped: [], warnings: [], ...extra });
const fill = (name, extra = {}) => ({
  placeholder: `[[${name}|with:]]`,
  name,
  source: 'item',
  step: 'with',
  trace: trace(),
  ...extra,
});
const copies = (name, count, source = 'variable') =>
  Array.from({ length: count }, (_, i) => ({
    placeholder: `[[${name}|repeat:triggers]]`,
    name,
    source,
    step: 'repeat',
    copy: { number: i + 1, count },
    trace: trace({ values: new Map([['name', `trigger ${i + 1}`]]) }),
  }));
const report = (label, extra = {}) => ({
  label,
  chain: [],
  ms: 1,
  template: { name: label.replace(/^"|"$/g, ''), config: { card: { type: 'tile' } } },
  sections: [{ variables: [], trace: trace(), built: {} }],
  ...extra,
});

// The user's example in #428, near enough.
const root = report('"camera_card"', {
  sections: [
    {
      variables: [],
      trace: trace({
        items: [fill('vertical_stack_item', { cards: ['camera'] })],
        skipped: [
          {
            placeholder: '[[popup_item|if:has_popup|with:]]',
            name: 'popup_item',
            step: 'with',
            reason: 'closed',
            condition: 'if:has_popup',
          },
          { placeholder: '[[ha_cam_items|with:]]', name: 'ha_cam_items', step: 'with', reason: 'missing' },
        ],
      }),
      built: { type: 'vertical-stack', cards: [{ type: DCP, template: 'camera' }] },
    },
  ],
});
const porch = report('"porch_camera_view" [camera]', {
  chain: ['"camera_card"'],
  at: 'cards[0]',
  path: ['cards', 0],
  template: { name: 'camera', config: { card: { type: 'picture-glance' } } },
  sections: [
    {
      variables: [],
      trace: trace({ items: [fill('fr_main_cam_item', { trace: trace({ items: copies('fr_trigger', 3) }) })] }),
      built: {},
    },
  ],
});

const outline = reportOutline([root, porch]);
const lines = outlineLines(outline).map(
  ({ node, depth }) =>
    `${'  '.repeat(depth)}${node.skipped && !node.target ? 'x' : '-'} ${node.name}${node.copy ? ` ${node.copy}` : ''} (${outlineTags(node).join('|')})${node.target ? ` #${node.target}` : ''}${node.skipped ? ` ${node.skipped}` : ''}`,
);
check('the outline nests what built what, each line pointing at its part', lines, [
  '- camera_card (card) #r0',
  '  - vertical_stack_item (item|with) #r0-s0-i0',
  '    - porch_camera_view (card camera|nested card) #r1',
  '      - fr_main_cam_item (item|with) #r1-s0-i0',
  '        - fr_trigger (variable|repeat|3 copies) #r1-s0-i0-i0',
  '          - trigger 1 1/3 () #r1-s0-i0-i0',
  '          - trigger 2 2/3 () #r1-s0-i0-i1',
  '          - trigger 3 3/3 () #r1-s0-i0-i2',
  '  x popup_item (with) not built: if:has_popup did not hold',
  '  x ha_cam_items (with) not built: no item template or variable by this name',
]);

check(
  'the targets are the ids the tree gives the same parts',
  (() => {
    const ids = new Set();
    const walk = (nodes) => nodes.forEach((n) => (ids.add(n.id), walk(n.children ?? [])));
    walk(reportTree({ reports: [root, porch], neverBuilt: [] }));
    return outlineLines(outline)
      .map(({ node }) => node.target)
      .filter((target) => target !== undefined && !ids.has(target));
  })(),
  [],
);

/* --- nesting --- */

const twin = (path, chain = ['"camera_card"']) =>
  report('"camera"', { chain, path, template: { name: 'camera', config: { card: {} } } });
const clash = [
  report('"camera_card"'),
  twin(['cards', 0]),
  twin(['cards', 1]),
  twin(['cards', 1, 'card'], ['"camera_card"', '"camera"']),
  twin(undefined, ['"camera_card"', '"camera"']),
];
check('nesting goes by where a card sits, so two cards of one name are told apart', parentIndexes(clash), [
  undefined,
  0,
  0,
  2,
  2,
]);
check(
  'without a place it goes by the names around it, the nearest earlier one of that name',
  parentIndexes([report('"a"'), report('"b"', { chain: ['"a"'] }), report('"c"', { chain: ['"a"', '"b"'] })]),
  [undefined, 0, 1],
);
check(
  'a card whose surroundings are not in the report goes under the outermost',
  parentIndexes([report('"a"'), report('"b"', { chain: ['"zz"', '"y"'] })]),
  [undefined, 0],
);

{
  // Built out of order: the outline still lists them in the order they sit.
  const parent = report('"stack"', {
    sections: [
      {
        variables: [],
        trace: trace(),
        built: {
          cards: [
            { type: DCP, template: 'one' },
            { type: DCP, template: 'two' },
          ],
        },
      },
    ],
  });
  const one = report('"one"', { chain: ['"stack"'], path: ['cards', 0], template: { name: 'one', config: {} } });
  const two = report('"two"', { chain: ['"stack"'], path: ['cards', 1], template: { name: 'two', config: {} } });
  check(
    'nested cards in the order they sit, not the order they built',
    reportOutline([parent, two, one])[0].children.map((n) => n.name),
    ['one', 'two'],
  );
}

{
  // Two fills each build a card of the same template: each nested card under its own fill.
  const parent = report('"stack"', {
    sections: [
      {
        variables: [],
        trace: trace({ items: [fill('a', { cards: ['cam'] }), fill('b', { cards: ['cam'] })] }),
        built: {
          cards: [
            { type: DCP, template: 'cam' },
            { type: DCP, template: 'cam' },
          ],
        },
      },
    ],
  });
  const first = report('"cam"', { chain: ['"stack"'], path: ['cards', 0], template: { name: 'cam', config: {} } });
  const second = report('"cam"', { chain: ['"stack"'], path: ['cards', 1], template: { name: 'cam', config: {} } });
  const kids = reportOutline([parent, first, second])[0].children;
  check(
    'one nested card under each fill that built one',
    kids.map((n) => [n.name, n.children.map((c) => c.target)]),
    [
      ['a', ['r1']],
      ['b', ['r2']],
    ],
  );
}

{
  // A fill inside a fill: the card goes to the innermost one that built it.
  const inner = fill('inner', { cards: ['cam'] });
  const outer = fill('outer', { cards: ['cam'], trace: trace({ items: [inner] }) });
  const parent = report('"stack"', {
    sections: [{ variables: [], trace: trace({ items: [outer] }), built: { card: { type: DCP, template: 'cam' } } }],
  });
  const cam = report('"cam"', { chain: ['"stack"'], path: ['card'], template: { name: 'cam', config: {} } });
  const top = reportOutline([parent, cam])[0].children[0];
  check(
    'a nested card goes under the innermost fill that built it',
    [top.children.length, top.children[0].children[0].target],
    [1, 'r1'],
  );
}

{
  // A for_each card: its copies folded under one line, each its own section.
  const repeatCard = report('"row"', {
    sections: [1, 2].map((n) => ({ label: `Copy ${n} of 2`, variables: [], trace: trace(), built: {} })),
  });
  const node = reportOutline([repeatCard])[0];
  check(
    "a card's own copies fold under it, each pointing at its section",
    [node.copies, node.children.map((c) => c.target)],
    [2, ['r0-s0', 'r0-s1']],
  );
}

{
  const badge = report('"chip"', { template: { name: 'chip', config: { badge: { type: 'entity' } } } });
  check('a badge template says so', reportOutline([badge])[0].kind, 'badge');
}

/* --- from a real build --- */

{
  const extras = {
    itemTemplates: {
      stack: { item: { type: 'vertical-stack', cards: [{ type: DCP, template: 'camera' }, '[[trig|repeat:list]]'] } },
      trig: { item: { t: '[[name]]' } },
      popup: { item: { p: 1 } },
      gated: { default: [{ on: false }], item: '[[b|if:on?]]' },
    },
  };
  const t = newTrace();
  deepReplace(
    [{ list: [{ name: 'a' }, { name: 'b' }] }, { has_popup: false }, { b: { x: 1 } }, { m: { k: 1 } }],
    {},
    {
      cards: [
        '[[stack|with:]]',
        '[[popup|if:has_popup|with:]]',
        '[[nothere|with:a=1]]',
        '[[gated|repeat:list]]',
        '[[m|with:]]',
        '[[popup|if:has_popup|with:size=2?]]',
      ],
    },
    't',
    undefined,
    true,
    undefined,
    0,
    t,
    undefined,
    false,
    extras,
  );
  check(
    'a fill records what it filled in, from where, and by which step',
    t.items.map((i) => [i.name, i.source, i.step, i.copy?.number ?? null]),
    [
      ['stack', 'item', 'with', null],
      ['gated', 'item', 'repeat', 1],
      ['gated', 'item', 'repeat', 2],
      ['m', 'variable', 'with', null],
    ],
  );
  check('and the templates of the cards of ours it built', t.items[0].cards, ['camera']);
  check(
    'and its repeat inside it',
    t.items[0].trace.items.map((i) => [i.name, i.step, i.copy.count]),
    [
      ['trig', 'repeat', 2],
      ['trig', 'repeat', 2],
    ],
  );
  check('a copy whose own if:...? took its body out is marked empty', t.items[1].empty, true);
  check(
    'a closed if: and a missing template are recorded as not built, an optional one too',
    t.skipped.map((s) => [s.name, s.step, s.reason, s.condition ?? null]),
    [
      ['popup', 'with', 'closed', 'if:has_popup'],
      ['popup', 'with', 'closed', 'if:has_popup'],
      ['nothere', 'with', 'missing', null],
    ],
  );
}

/* --- the Markdown --- */

{
  const text = formatReport({ context: { version: '9.9.9' }, reports: [root, porch], neverBuilt: [] });
  const start = text.indexOf('<summary><b>Outline</b></summary>');
  check(
    'the Markdown opens with the outline, ahead of the builds',
    start > 0 && start < text.indexOf('<a id="dcp-r0"'),
    true,
  );
  const list = text
    .slice(start, text.indexOf('</details>', start))
    .split('\n')
    .filter((l) => /^\s*- /.test(l));
  check('as a nested list of links to the anchors', list, [
    '- [camera\\_card](#dcp-r0) · card',
    '  - [vertical\\_stack\\_item](#dcp-r0-s0-i0) · item · with',
    '    - [porch\\_camera\\_view](#dcp-r1) · card camera · nested card',
    '      - [fr\\_main\\_cam\\_item](#dcp-r1-s0-i0) · item · with',
    '        - [fr\\_trigger](#dcp-r1-s0-i0-i0) · variable · repeat · 3 copies: [trigger 1 1/3](#dcp-r1-s0-i0-i0), [trigger 2 2/3](#dcp-r1-s0-i0-i1), [trigger 3 3/3](#dcp-r1-s0-i0-i2)',
    '  - ~~popup\\_item~~ · with · *not built: if:has\\_popup did not hold*',
    '  - ~~ha\\_cam\\_items~~ · with · *not built: no item template or variable by this name*',
  ]);
  for (const id of ['dcp-r0', 'dcp-r1', 'dcp-r0-s0-i0', 'dcp-r1-s0-i0', 'dcp-r1-s0-i0-i2']) {
    check(`every link has its anchor: ${id}`, text.includes(`<a id="${id}" title="${id}"></a>`), true);
  }
  check(
    'the anchor sits right before the part it names',
    text
      .split('\n')
      .slice(text.split('\n').indexOf('<a id="dcp-r1-s0-i0" title="dcp-r1-s0-i0"></a>'))[2]
      .startsWith('#### '),
    true,
  );

  const single = formatReport({ context: { version: '9.9.9' }, reports: [report('"tile"')], neverBuilt: [] });
  check('one card with nothing inside it has no outline', single.includes('<b>Outline</b>'), false);

  // A name is somebody's text: it goes through the report's redaction like everything else.
  const leaky = report('"Gate 192.168.1.20" [gate]', {
    template: { name: 'gate', config: { card: {} } },
    sections: [
      {
        variables: [],
        trace: trace({
          items: [fill('cam', { trace: trace({ values: new Map([['name', 'http://user:pw@nas.local/x']]) }) })],
        }),
        built: {},
      },
    ],
  });
  const redacted = formatReport({ context: { version: '9.9.9' }, reports: [leaky], neverBuilt: [] });
  const outlineText = redacted.slice(redacted.indexOf('<b>Outline</b>'), redacted.indexOf('<a id="dcp-r0"'));
  check(
    'names in the outline are redacted',
    [outlineText.includes('192.168'), outlineText.includes('pw@'), outlineText.includes('redacted-ip')],
    [false, false, true],
  );
  const kept = formatReport({ context: { version: '9.9.9' }, reports: [leaky], neverBuilt: [], unredacted: true });
  check('unless the report keeps everything', kept.includes('[Gate 192.168.1.20]'), true);
}
