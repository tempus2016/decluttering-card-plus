/*
 * Unit tests for `debug: console` (discussion #160): what deepReplace notes down while it
 * builds, and how src/trace.ts turns that into what the console is given.
 * Run with `npm test`.
 */
const deepReplace = require('../.test-build/deep-replace.js').default;
const {
  newTrace,
  variableRows,
  describeSection,
  workOutRows,
  headline,
  handedDownNames,
  wantsTrace,
  withTrace,
  traceLabel,
  tracePlace,
  TRACE_KEY,
  TRACE_PLACE_KEY,
  TRACE_ROOT_KEY,
  traceRoot,
  nestedCardPaths,
  formatPath,
  startExpansion,
  reportExpansion,
  endExpansion,
} = require('../.test-build/trace.js');
const { withoutStamps } = require('../.test-build/cycles.js');
const { OWN_DEFAULTS } = require('../.test-build/variables.js');

const { check } = require('./check');

// Unresolved and refused placeholders warn as well, which is not what these tests are about.
console.warn = () => {};

/** Builds with a trace and hands back both, so a test can look at either. */
function traced(variables, template, content) {
  const trace = newTrace();
  const built = deepReplace(variables, template, content, 'test', undefined, false, undefined, 0, trace);
  return { built, trace, placeholders: Object.fromEntries(trace.placeholders) };
}

/* ------------------------------------------------------------------ placeholders */

check(
  'a plain placeholder is noted with the value it became',
  traced([{ name: 'Kitchen' }], {}, { title: '[[name]]' }).placeholders,
  { '[[name]]': 'Kitchen' },
);

check(
  'a transform is noted under the placeholder as written',
  traced([{ name: 'Living Room' }], {}, { title: '[[name|upper]]', id: 'light.[[name|slug]]' }).placeholders,
  { '[[name|upper]]': 'LIVING ROOM', '[[name|slug]]': 'living_room' },
);

check(
  'a whole value keeps its type - a number, a mapping',
  traced([{ size: 3 }, { tap: { action: 'toggle' } }], {}, { columns: '[[size]]', tap_action: '[[tap]]' }).placeholders,
  { '[[size]]': 3, '[[tap]]': { action: 'toggle' } },
);

check(
  'a let value shows its own placeholder resolving, so the chain can be followed',
  traced([{ room: 'Hall' }], { let: { slug: '[[room|slug]]' } }, { entity: 'light.[[slug]]' }).placeholders,
  { '[[slug]]': '[[room|slug]]', '[[room|slug]]': 'hall' },
);

check(
  'a default: stand-in is noted like any other value',
  traced(undefined, {}, { name: '[[room|default:Somewhere]]' }).placeholders,
  { '[[room|default:Somewhere]]': 'Somewhere' },
);

check('a placeholder nothing sets says so', traced([{ other: 1 }], {}, { name: '[[missing]]' }).placeholders, {
  '[[missing]]': 'nothing sets it, so it is left as written',
});

check(
  'a with: on a name that is no item template says so (#349)',
  traced([{ other: 1 }], {}, { row: '[[camera_entri|with:a=1]]' }).placeholders,
  { '[[camera_entri|with:a=1]]': 'there is no item template called camera_entri here, so it is left as written' },
);

check(
  'an optional placeholder with nothing says it is taken out',
  traced([{ other: 1 }], {}, { name: '[[missing?]]' }).placeholders,
  { '[[missing?]]': 'nothing, so the option is taken out' },
);

check(
  'an escaped placeholder is meant to be there and is not mentioned',
  traced([{ name: 'x' }], {}, { text: '[[!name]]' }).placeholders,
  {},
);

{
  const { placeholders } = traced([{ tap: { action: 'toggle' } }], {}, { name: '[[tap|upper]]' });
  check('a refused transform gives its reason', placeholders['[[tap|upper]]'].startsWith('left as written: '), true);
}

check(
  'tracing does not change what is built',
  traced([{ name: 'Hall' }], { let: { slug: '[[name|slug]]' } }, { a: '[[slug]]', b: '[[x?]]', c: '[[name]] x' }).built,
  deepReplace([{ name: 'Hall' }], { let: { slug: '[[name|slug]]' } }, { a: '[[slug]]', b: '[[x?]]', c: '[[name]] x' }),
);

/* ---------------------------------------------------------------------- dropped */

check(
  'an empty option names the key it took out',
  traced([{ other: 1 }], {}, { type: 'tile', name: '[[title?]]' }).trace.dropped,
  ['name ([[title?]] was empty)'],
);

check(
  'a block left empty is named too, with its path',
  traced([{ other: 1 }], {}, { type: 'tile', features: [{ type: '[[kind?]]' }] }).trace.dropped,
  ['features[0].type ([[kind?]] was empty)', 'features[0] (nothing left in it)', 'features (nothing left in it)'],
);

/* --------------------------------------------------------------------- variables */

check(
  'variables say where each came from, and the first definition is the one listed',
  variableRows([{ room: 'Hall' }, { icon: 'mdi:x' }], {
    let: { slug: '[[room|slug]]' },
    variables: [
      { name: 'icon', default: 'mdi:lamp' },
      { name: 'size', default: 2 },
    ],
    default: [{ room: 'nowhere' }, { colour: 'red' }],
  }),
  [
    { variable: 'slug', value: '[[room|slug]]', from: 'let' },
    { variable: 'room', value: 'Hall', from: 'card' },
    { variable: 'icon', value: 'mdi:x', from: 'card' },
    { variable: 'size', value: 2, from: 'declared' },
    { variable: 'colour', value: 'red', from: 'default' },
  ],
);

check(
  "a repeat's item values are told apart from the card's own",
  variableRows([{ light: 'light.a' }, { room: 'Hall' }], {}, [], ['light']).map((row) => row.from),
  ['repeat', 'card'],
);

check(
  'a handed-down variable is marked as such',
  variableRows([{ room: 'Hall' }, { colour: 'red' }], {}, ['colour']).map((row) => row.from),
  ['card', 'handed_down'],
);

{
  const template = { default: [{ own: 1 }, { shared: 2 }] };
  template[OWN_DEFAULTS] = [{ own: 1 }];
  check(
    "a dashboard's shared value is told apart from the template's own default",
    variableRows(undefined, template).map((row) => row.from),
    ['default', 'dashboard'],
  );
}

check(
  'a decluttering_let value says which level wrote it',
  variableRows(
    [{ room: 'Hall' }],
    require('../.test-build/templates.js').collectTemplates(
      {
        decluttering_let: { a: 'dashboard', b: 'dashboard', c: 'dashboard' },
        decluttering_templates: { tile: { card: {}, let: { a: 'template' } } },
        views: [{ decluttering_let: { b: 'view' }, sections: [{ decluttering_let: { room: 'section' } }] }],
      },
      0,
      undefined,
      0,
    ).tile,
  ).map((row) => `${row.variable}:${row.from}`),
  ['a:let', 'room:section_let', 'b:view_let', 'c:dashboard_let'],
);

check(
  'a defaults: value is listed as a default',
  variableRows(undefined, { default: [{ a: 1 }], defaults: { a: 2, b: 3 } }),
  [
    { variable: 'a', value: 1, from: 'default' },
    { variable: 'b', value: 3, from: 'default' },
  ],
);

check(
  'handed-down names are the inherited ones the card did not set itself',
  handedDownNames({
    inherit_variables: true,
    variables: [{ room: 'Mine' }],
    decluttering_inherited_variables: [{ room: 'Theirs' }, { colour: 'red' }],
  }),
  ['colour'],
);

check('nothing is handed down without inherit_variables', handedDownNames({ variables: [] }), []);

/* ---------------------------------------------------------------------- describe */

{
  const { trace } = traced([{ name: 'Hall' }, { tap: { action: 'toggle' } }], {}, { a: '[[name]]', b: '[[tap]]' });
  const described = describeSection({ variables: variableRows([{ name: 'Hall' }], {}), trace, built: {} });
  check('the variables table is in plain words', described.variables, [
    { variable: 'name', value: 'Hall', from: 'this card', 'worked out to': 'Hall', how: '' },
  ]);
  check('a mapping is shown as its JSON in the table', described.placeholders[1], {
    placeholder: '[[tap]]',
    became: '{"action":"toggle"}',
  });
}

/* ---------------------------------------------------------- worked out (#376) */

{
  // The chain from the report on #376: a name built from a name built from a resolver.
  const template = {
    default: [
      { fr_camera: 'camera.[[frigate_name|lower]]' },
      { fr_name: '[[fr_camera|object_id]]' },
      { cam_id: '[[fr_name]]_sub' },
      { unused: '[[fr_name]]-[[nobody]]' },
      { icons: { hd: 'mdi:hd', sd: '[[fr_name]]' } },
    ],
  };
  const variables = [{ frigate_name: 'FrontPorch' }];
  const { trace, built } = traced(variables, template, {
    id: '[[cam_id]]',
    icons: '[[icons]]',
    gone: '[[missing?]]',
    stays: '[[nobody]]',
  });
  check('the build itself came out right', built.id, 'frontporch_sub');
  const rows = describeSection({ variables: variableRows(variables, template), trace, built }).variables;
  const row = (name) => rows.find((entry) => entry.variable === name);
  check('a chain of names is followed to the end', row('cam_id')['worked out to'], 'frontporch_sub');
  check(
    'each step of the chain is listed, in the order it was taken',
    row('cam_id').how,
    '[[fr_name]] → [[fr_camera|object_id]]; [[fr_camera|object_id]] → frontporch',
  );
  check(
    'a name the build only reached through a resolver is not worked out from the build alone',
    row('fr_camera')['worked out to'],
    'camera.[[frigate_name|lower]]',
  );

  // The second, quiet build asks for every name, so each one is worked out.
  const worked = workOutRows(variableRows(variables, template), (content, probe) =>
    deepReplace(variables, template, content, 'test', undefined, true, undefined, 0, probe),
  );
  const probed = describeSection({ variables: worked, trace, built }).variables;
  const probedRow = (name) => probed.find((entry) => entry.variable === name);
  check(
    'the quiet build works out a name the card only met inside a resolver',
    probedRow('fr_camera')['worked out to'],
    'camera.frontporch',
  );
  check('with its step', probedRow('fr_camera').how, '[[frigate_name|lower]] → frontporch');
  check('a name the card never used is worked out too', probedRow('unused')['worked out to'], 'frontporch-[[nobody]]');
  check('a mapping comes back as a mapping', probedRow('icons')['worked out to'], '{"hd":"mdi:hd","sd":"frontporch"}');
  const emptied = workOutRows([{ variable: 'gone', value: '[[missing?]]', from: 'card' }], (content, probe) =>
    deepReplace([{ gone: '[[missing?]]' }], {}, content, 'test', undefined, true, undefined, 0, probe),
  );
  check('one that comes to nothing says so', emptied[0].worked.value, '(nothing)');
  check(
    'a build that throws leaves the rows as they were',
    workOutRows([{ variable: 'a', value: 1, from: 'card' }], () => {
      throw new Error('no');
    }),
    [{ variable: 'a', value: 1, from: 'card' }],
  );
  check('a value with nothing in it to work out is itself, with no steps', row('frigate_name'), {
    variable: 'frigate_name',
    value: 'FrontPorch',
    from: 'this card',
    'worked out to': 'FrontPorch',
    how: '',
  });
  check('a placeholder nothing sets keeps its place', row('unused')['worked out to'], 'frontporch-[[nobody]]');
  check(
    'and the step says why',
    row('unused').how.endsWith('[[nobody]] → nothing sets it, so it is left as written'),
    true,
  );
  check('a mapping is worked out inside', row('icons')['worked out to'], '{"hd":"mdi:hd","sd":"frontporch"}');
}

{
  // Two names that read each other: the table stops, rather than the report never arriving.
  const trace = newTrace();
  trace.placeholders.set('[[a]]', '[[b]]');
  trace.placeholders.set('[[b]]', '[[a]]');
  const rows = describeSection({ variables: [{ variable: 'a', value: '[[b]]', from: 'card' }], trace, built: {} });
  check('names that read each other do not go round for ever', typeof rows.variables[0]['worked out to'], 'string');
  check('and each step is listed once', rows.variables[0].how, '[[b]] → [[a]]; [[a]] → [[b]]');
}

{
  // A whole placeholder that became a list or a number keeps its kind.
  const trace = newTrace();
  trace.placeholders.set('[[rooms]]', ['hall', 'study']);
  trace.placeholders.set('[[count]]', 3);
  const rows = describeSection({
    variables: [
      { variable: 'list', value: '[[rooms]]', from: 'card' },
      { variable: 'n', value: '[[count]]', from: 'card' },
    ],
    trace,
    built: {},
  }).variables;
  check('a whole placeholder that became a list is that list', rows[0]['worked out to'], '["hall","study"]');
  check('and the step calls it a list rather than spelling it out', rows[0].how, '[[rooms]] → (a list)');
  check('a whole placeholder that became a number is that number', rows[1]['worked out to'], 3);
}

check(
  'the headline names the template and the time',
  headline({ label: traceLabel('room'), chain: [], ms: 1.234, sections: [] }),
  'decluttering-card-plus: "room" built in 1.2 ms',
);

check(
  'a nested card says which templates it sits inside',
  headline({ label: traceLabel('light'), chain: ['"page"', '"room"'], ms: 0.5, sections: [] }),
  'decluttering-card-plus: "light" built in 0.5 ms (inside "page" › "room")',
);

check('a name leads the label, with the template after it', traceLabel('camera', 'back_yard'), '"back_yard" [camera]');
check('an empty name is no name', traceLabel('camera', '  '), '"camera"');
check('a name that is not text is ignored', traceLabel('camera', 3), '"camera"');

check(
  'a card a logging card told to log says where it sits',
  headline({
    label: traceLabel('button', 'but2 button'),
    chain: ['"back_yard" [camera]'],
    at: 'elements[1]',
    ms: 3.4,
    sections: [],
  }),
  'decluttering-card-plus: "but2 button" [button] built in 3.4 ms (inside "back_yard" [camera], at elements[1])',
);

/* ----------------------------------------------------------------- nested cards */

check('debug: console asks for the log', wantsTrace({ debug: 'console' }), true);
check('a card told to by the card around it logs', wantsTrace({ [TRACE_KEY]: true }), true);
check('but its own debug: wins', wantsTrace({ [TRACE_KEY]: true, debug: false }), false);
check('debug: true logs as well as showing the view', wantsTrace({ debug: true }), true);
check('so does debug: yaml', wantsTrace({ debug: 'yaml' }), true);
check('debug: false does not', wantsTrace({ debug: false }), false);

{
  const config = {
    type: 'vertical-stack',
    cards: [
      { type: 'custom:decluttering-card-plus', template: 'inner' },
      { type: 'tile', entity: 'sun.sun' },
    ],
  };
  const stamped = withTrace(config, ['"page"', '"back_yard" [camera]']);
  check('every nested card of ours is told to log', stamped.cards[0][TRACE_KEY], true);
  check('and where it sits, and what the cards around it are called', tracePlace(stamped.cards[0]), {
    parents: ['"page"', '"back_yard" [camera]'],
    at: 'cards[0]',
  });
  check(
    'a deeper card is placed by its whole path',
    tracePlace(
      withTrace({ type: 'picture-elements', elements: [{ type: 'icon' }, { type: 'custom:decluttering-card-plus' }] }, [
        '"a"',
      ]).elements[1],
    ),
    { parents: ['"a"'], at: 'elements[1]' },
  );
  check('a card nobody placed has no place', tracePlace({ type: 'custom:decluttering-card-plus' }), undefined);
  check('the place is not shown in the debug view', TRACE_PLACE_KEY in withoutStamps(stamped).cards[0], false);
  check('other cards are left alone', stamped.cards[1][TRACE_KEY], undefined);
  check('the original is not written to', config.cards[0][TRACE_KEY], undefined);
  check('the stamp is not shown in the debug view', withoutStamps(stamped), config);
}

{
  const config = { type: 'tile', entity: 'sun.sun' };
  check('a config with nothing of ours in it is not copied', withTrace(config) === config, true);
}

/* ------------------------------------------------------------ the whole thing (#160) */

{
  const config = {
    type: 'vertical-stack',
    cards: [
      { type: 'custom:decluttering-card-plus', template: 'camera' },
      { type: 'tile', entity: 'sun.sun' },
    ],
  };
  const stamped = withTrace(config, ['"page"'], { id: 'r1', path: ['elements', 2] });
  check('a nested card is told which card to report to, and its whole path in it', traceRoot(stamped.cards[0]), {
    id: 'r1',
    path: ['elements', 2, 'cards', 0],
  });
  check(
    'without a card to report to there is no stamp',
    TRACE_ROOT_KEY in withTrace(config, ['"page"']).cards[0],
    false,
  );
  check('the stamp is not shown in the debug view', withoutStamps(stamped), config);
  check('a card nobody stamped reports nowhere', traceRoot({ type: 'custom:decluttering-card-plus' }), undefined);
}

check(
  'every card of ours is found, and not the cards inside its own config',
  nestedCardPaths({
    cards: [
      { type: 'custom:decluttering-card-plus', template: 'a', card: { type: 'custom:decluttering-card-plus' } },
      { type: 'picture-elements', elements: [{ type: 'icon' }, { type: 'custom:decluttering-card' }] },
    ],
  }),
  [
    ['cards', 0],
    ['cards', 1, 'elements', 1],
  ],
);

check('a path reads the way it is written in YAML', formatPath(['cards', 0, 'elements', 3]), 'cards[0].elements[3]');
check('the card itself is a dot', formatPath([]), '.');

{
  // The console is what is being checked, so it is listened to rather than printed.
  const logged = [];
  const saved = { groupCollapsed: console.groupCollapsed, log: console.log, groupEnd: console.groupEnd };
  console.groupCollapsed = (...args) => logged.push(['group', ...args]);
  console.log = (...args) => logged.push(['log', ...args]);
  console.groupEnd = () => logged.push(['end']);

  const outer = { type: 'vertical-stack', cards: [{ type: 'custom:decluttering-card-plus', template: 'camera' }] };
  startExpansion('x1', '"page"', outer, [['cards', 0]]);
  check('nothing is logged while a nested card has still to build', logged.length, 0);
  reportExpansion(
    { id: 'x1', path: ['cards', 0] },
    { type: 'picture-glance', elements: [{ type: 'custom:decluttering-card-plus' }] },
    [['elements', 0]],
  );
  check('nor while a card inside that one has', logged.length, 0);
  reportExpansion({ id: 'x1', path: ['cards', 0, 'elements', 0] }, { type: 'icon', icon: 'mdi:car' }, []);
  check('once all of them have, the whole thing is logged once', logged[0], [
    'group',
    'decluttering-card-plus: "page" in full, with the cards inside it built',
  ]);
  check('with every nested card replaced by what it built', logged[1][2], {
    type: 'vertical-stack',
    cards: [{ type: 'picture-glance', elements: [{ type: 'icon', icon: 'mdi:car' }] }],
  });
  check('and nothing listed as missing', logged.length, 3);
  reportExpansion({ id: 'x1', path: ['cards', 0] }, { type: 'tile' }, []);
  check('a report after it is finished is ignored', logged.length, 3);
  check('the card that started it is not written to', outer.cards[0].type, 'custom:decluttering-card-plus');

  logged.length = 0;
  startExpansion('x2', '"plain"', { type: 'tile' }, []);
  check('a card with nothing of ours inside it logs nothing more', logged.length, 0);

  Object.assign(console, saved);
}

/* ------------------------------------------------------------- build timings */

{
  const { BuildLog, slowestBuilds, TIMINGS_KEPT, BUILD_LOG } = require('../.test-build/trace.js');

  const log = new BuildLog(3);
  for (let i = 1; i <= 5; i += 1) log.add({ template: `t${i}`, copies: 1, ms: i });
  check(
    'the log keeps the most recent builds and drops the oldest',
    log
      .entries()
      .map((entry) => entry.template)
      .sort(),
    ['t3', 't4', 't5'],
  );

  check('it never grows past its size', log.entries().length, 3);

  log.clear();
  check('and can be emptied', log.entries(), []);

  check('the page keeps the last 500 builds', [TIMINGS_KEPT, BUILD_LOG.entries().length], [500, 0]);

  const builds = [
    { template: 'tile', copies: 1, ms: 2 },
    { template: 'tile', copies: 1, ms: 3 },
    { template: 'tile', copies: 1, ms: 4 },
    { template: 'heavy', copies: 1, ms: 7 },
    { template: 'rooms', name: 'Upstairs', copies: 12, ms: 1 },
    { template: 'rooms', name: 'Upstairs', copies: 30, ms: 2 },
    { template: 'rooms', copies: 20, ms: 1.5 },
  ];
  const slowest = slowestBuilds(builds);

  check('templates by total time, with their slowest build and how many there were', slowest.byTotal, [
    { template: 'tile', total: 9, max: 4, builds: 3 },
    { template: 'heavy', total: 7, max: 7, builds: 1 },
    { template: 'rooms', total: 4.5, max: 2, builds: 3 },
  ]);

  check(
    'and by their slowest single build, which is a different list',
    slowest.byMax.map((each) => each.template),
    ['heavy', 'tile', 'rooms'],
  );

  check('the biggest repeats, each once at its largest, told apart by name', slowest.repeats, [
    { template: 'rooms', name: 'Upstairs', copies: 30 },
    { template: 'rooms', copies: 20 },
  ]);

  check(
    'only the top ones are kept',
    slowestBuilds(builds, 1).byTotal.map((each) => each.template),
    ['tile'],
  );

  check('nothing built is nothing to show', slowestBuilds([]), { byTotal: [], byMax: [], repeats: [] });
}

/* ------------------------------------------------- a nested card that builds late */

(async () => {
  // A camera card can take longer to start than the report waits; what builds after that still counts (#218).
  const saved = { groupCollapsed: console.groupCollapsed, log: console.log, groupEnd: console.groupEnd };
  console.groupCollapsed = console.log = console.groupEnd = () => {};
  const results = [];
  const cam = {
    type: 'custom:advanced-camera-card',
    elements: [{ type: 'custom:decluttering-card-plus' }, { type: 'custom:decluttering-card-plus' }],
  };
  startExpansion(
    'late',
    '"cam"',
    cam,
    [
      ['elements', 0],
      ['elements', 1],
    ],
    undefined,
    undefined,
    (r) => results.push(r),
  );
  reportExpansion({ id: 'late', path: ['elements', 0] }, { type: 'icon', icon: 'mdi:car' }, []);
  await new Promise((resolve) => setTimeout(resolve, 3200));
  check(
    'once the reports stop, the card still to build is listed as never built',
    results.length && results[0].neverBuilt,
    ['elements[1]'],
  );
  reportExpansion({ id: 'late', path: ['elements', 1] }, { type: 'icon', icon: 'mdi:dog' }, [], { label: 'dog' });
  check('when it builds after all, the report is made again', results.length, 2);
  check('with it in its place', results[1].full.elements[1], { type: 'icon', icon: 'mdi:dog' });
  check('and nothing left listed as never built', results[1].neverBuilt, []);
  check('its own entry is included', results[1].reports.length, 1);
  reportExpansion({ id: 'late', path: ['elements', 1] }, { type: 'tile' }, []);
  check('once nothing is missing, later reports are ignored', results.length, 2);

  const ended = [];
  startExpansion('gone', '"cam"', cam, [['elements', 0]], undefined, undefined, (r) => ended.push(r));
  endExpansion('gone');
  reportExpansion({ id: 'gone', path: ['elements', 0] }, { type: 'tile' }, []);
  await new Promise((resolve) => setTimeout(resolve, 50));
  check('a build the card has moved on from takes no more reports', ended.length, 0);

  Object.assign(console, saved);
})();
