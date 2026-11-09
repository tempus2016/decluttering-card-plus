/*
 * Unit tests for "Try a template" (#427): src/try-template.ts, which builds a card from the
 * templates box the way the card builds it, src/try-template-form.ts, the stand-in form, and
 * src/try-template-gist.ts, reading a gist. The browser suite (test/dom/try-template.test.ts)
 * builds the same cards in the real card element and checks the two agree.
 */
const deepReplace = require('../.test-build/deep-replace.js').default;
const { readTemplates, readCard, runTemplate, tryTemplate } = require('../.test-build/try-template.js');
const { standInFields, controlFor, controlValue, withVariable } = require('../.test-build/try-template-form.js');
const { boxesFromGist, gistId, loadGist } = require('../.test-build/try-template-gist.js');
const { encodeState, decodeHash, readableHash } = require('../.test-build/playground-share.js');
const { ownEntities } = require('../.test-build/playground-house.js');
const { check } = require('./check');

const test = require('node:test');
const assert = require('node:assert/strict');

const HOUSE = ownEntities('').house;
const CARD = 'custom:decluttering-card-plus';
const dashboard = (templates, extra = {}) => ({ decluttering_templates: templates, ...extra });
const run = (templates, card, extra, readAll) =>
  runTemplate(dashboard(templates, extra), { type: CARD, ...card }, HOUSE, readAll);

/* --------------------------------------------- the same as substitution alone */

/*
 * Cases from test/deep-replace.test.js: a template whose card is `content`, used by a card
 * with `variables`. Built through the page it must give exactly what deepReplace gives.
 */
const SAME = [
  ['plain substitution', [{ entity: 'sun.sun' }], {}, { type: 'tile', entity: '[[entity]]' }],
  ['default values', undefined, { default: [{ entity: 'sun.sun' }] }, { type: 'tile', entity: '[[entity]]' }],
  [
    'a let variable',
    [{ room: 'Living Room' }],
    { let: { room_slug: '[[room|slug]]' } },
    { type: 'tile', entity: 'light.[[room_slug]]', name: '[[room]]' },
  ],
  [
    'a let the card cannot override',
    [{ room_slug: 'hacked' }, { room: 'Hall' }],
    { let: { room_slug: '[[room|slug]]' } },
    { type: 'markdown', content: '[[room_slug]]' },
  ],
  [
    'two placeholders in one value',
    [{ a: 'one' }, { b: 'two' }],
    {},
    { type: 'markdown', v: '[[a]][[b]]', w: '[[a]] [[b]]' },
  ],
  [
    'an optional placeholder takes its option out',
    [],
    {},
    { type: 'tile', entity: 'light.hall', features: [{ type: '[[light_type?]]' }] },
  ],
  ['a step chain', [{ n: 3 }, { offset: 2 }], {}, { type: 'grid', columns: '[[n|add:[[offset]]|mul:2]]', cards: [] }],
  [
    'declared defaults',
    [],
    { variables: [{ name: 'colour', default: 'amber' }] },
    { type: 'tile', color: '[[colour]]' },
  ],
];
for (const [name, variables, template, content] of SAME) {
  const built = run({ t: { ...template, card: content } }, { template: 't', ...(variables ? { variables } : {}) });
  check(
    `page = card substitution: ${name}`,
    built.final,
    deepReplace(variables, template, content, 't', undefined, true),
  );
}

/* ------------------------------------------------------------------- one card */

check(
  'the card override is laid over what was built',
  run(
    { t: { card: { type: 'tile', entity: '[[e]]', color: 'red' } } },
    { template: 't', variables: [{ e: 'light.hall' }], card: { color: 'blue' } },
  ).final,
  { type: 'tile', entity: 'light.hall', color: 'blue' },
);
check(
  "grid_options go to the card inside, the card's beating the template's",
  run({ t: { grid_options: { columns: 6 }, card: { type: 'tile' } } }, { template: 't', grid_options: { columns: 12 } })
    .final,
  { type: 'tile', grid_options: { columns: 12 } },
);
check(
  'a group builds the card that lays it out',
  run({ t: { group: [{ type: 'tile', entity: 'light.hall' }] } }, { template: 't' }).final.type,
  'custom:decluttering-card-plus-group',
);
{
  const result = run({ room_tile: { card: { type: 'tile' } } }, { template: 'room_tiles' });
  check(
    'a missing template says so, with the nearest name',
    [result.final, /room_tile/.test(result.error)],
    [undefined, true],
  );
}
check('no template at all is an error', /template/i.test(run({}, {}).error), true);
check(
  'a template that defines two things says so',
  /card/.test(run({ t: { card: {}, badge: {} } }, { template: 't' }).error),
  true,
);
check(
  'a card that is not ours is refused',
  /custom:decluttering-card-plus/.test(runTemplate(dashboard({}), { type: 'tile' }, HOUSE).error),
  true,
);
{
  const result = run({ t: { card: { type: 'markdown', content: '[[missing]]' } } }, { template: 't' });
  check('a placeholder nothing sets is listed', result.builds[0].unresolved, ['missing']);
}
{
  const result = run(
    { t: { card: { type: 'tile', entity: '[[e|state]]' } } },
    { template: 't', variables: [{ e: 'light.kitchen_ceiling' }] },
  );
  check('a state outside rebuild_on is not read, as on a dashboard', result.final.entity, '[[e|state]]');
  check('and the card says why', result.builds[0].warnings.length > 0, true);
  const listed = run(
    { t: { card: { type: 'tile', entity: '[[e|state]]' } } },
    { template: 't', variables: [{ e: 'light.kitchen_ceiling' }], rebuild_on: ['light.kitchen_ceiling'] },
  );
  check('listed in rebuild_on, it is', listed.final.entity, 'on');
  const all = run(
    { t: { card: { type: 'tile', entity: '[[e|state]]' } } },
    { template: 't', variables: [{ e: 'light.kitchen_ceiling' }] },
    {},
    true,
  );
  check('and with every state readable', all.final.entity, 'on');
}
check(
  'dashboard defaults reach the template',
  run(
    { t: { card: { type: 'tile', color: '[[accent]]' } } },
    { template: 't' },
    { decluttering_defaults: [{ accent: 'amber' }] },
  ).final,
  { type: 'tile', color: 'amber' },
);
check(
  'extends folds the parent in',
  run(
    {
      base: { default: [{ colour: 'red' }], card: { type: 'tile', color: '[[colour]]' } },
      child: { extends: 'base', default: [{ colour: 'blue' }] },
    },
    { template: 'child' },
  ).final,
  { type: 'tile', color: 'blue' },
);
check(
  'item templates fill a repeat inside the card',
  run(
    {
      row: { item: { entity: '[[entity]]' } },
      t: { card: { type: 'entities', entities: '[[row|repeat:lights]]' } },
    },
    { template: 't', variables: [{ lights: [{ entity: 'light.a' }, { entity: 'light.b' }] }] },
  ).final,
  { type: 'entities', entities: [{ entity: 'light.a' }, { entity: 'light.b' }] },
);
check(
  'a function template is a step of its own (#307)',
  run(
    { shout: { function: '[[value|upper]]!' }, t: { card: { type: 'markdown', content: '[[room|shout]]' } } },
    { template: 't', variables: [{ room: 'hall' }] },
  ).final.content,
  'HALL!',
);

/* -------------------------------------------------------- checks and strict */

const CAMERA = {
  checks: [
    { name: 'No camera', condition: '[[camera|exists]]', fail_on: false, level: 'warn', message: 'No [[camera]].' },
  ],
  card: { type: 'markdown', content: '[[__alerts__.all.count]]' },
};
{
  const result = run({ t: CAMERA }, { template: 't', variables: [{ camera: 'camera.gone' }] });
  check(
    'a failed check is kept, and __alerts__ counts it',
    [result.builds[0].alerts.map((a) => a.message), result.final.content],
    [['No camera.gone.'], 1],
  );
  const notice = run(
    { t: { ...CAMERA, strict: { warnings: 'notice' } } },
    { template: 't', variables: [{ camera: 'camera.gone' }] },
  );
  check('strict warnings: notice shows the check as a notice', notice.builds[0].notice, ['No camera.gone.']);
}
{
  const stop = { ...CAMERA, checks: [{ ...CAMERA.checks[0], level: 'error', continue_rendering: false }] };
  const result = run({ t: stop }, { template: 't', variables: [{ camera: 'camera.gone' }] });
  check(
    'an error check that does not continue stops the card',
    [result.final, typeof result.error],
    [undefined, 'string'],
  );
}
{
  const result = run({ t: { strict: true, card: { type: 'markdown', content: '[[missing]]' } } }, { template: 't' });
  check(
    'strict: true refuses a card with an unset placeholder',
    [result.final, /missing/.test(result.error)],
    [undefined, true],
  );
}
check(
  "a template's alert: replaces the card while a check fails",
  run(
    { t: { ...CAMERA, alert: { type: 'markdown', content: 'alert' } } },
    { template: 't', variables: [{ camera: 'camera.gone' }] },
  ).final,
  { type: 'markdown', content: 'alert' },
);
{
  const result = run(
    { t: { visibility: [{ variable: 'show', equals: 'yes' }], card: { type: 'tile' } } },
    { template: 't', variables: [{ show: 'no' }] },
  );
  check(
    "the template's visibility: hides the card",
    [result.final, typeof result.builds[0].hidden],
    [undefined, 'string'],
  );
}

/* ------------------------------------------------------- cards inside cards */

const NESTED = {
  tile: { default: [{ colour: 'amber' }], card: { type: 'tile', entity: '[[entity]]', color: '[[colour]]' } },
  pair: {
    let: [{ upstairs: 'light.landing' }],
    card: {
      type: 'horizontal-stack',
      cards: [
        { type: CARD, template: 'tile', variables: [{ entity: 'light.kitchen_ceiling' }] },
        { type: CARD, template: 'tile', inherit_variables: true, variables: [{ entity: '[[upstairs]]' }] },
      ],
    },
  },
};
{
  const result = run(NESTED, { template: 'pair', variables: [{ colour: 'blue' }] });
  check('cards of ours inside are built in their places', result.final, {
    type: 'horizontal-stack',
    cards: [
      { type: 'tile', entity: 'light.kitchen_ceiling', color: 'amber' },
      { type: 'tile', entity: 'light.landing', color: 'blue' },
    ],
  });
  check(
    'one build each, with where it sits',
    result.builds.map((b) => [b.where, b.template]),
    [
      ['.', 'pair'],
      ['cards[0]', 'tile'],
      ['cards[1]', 'tile'],
    ],
  );
  check(
    'each report knows the card around it',
    result.reports.map((r) => r.chain),
    [[], ['"pair"'], ['"pair"']],
  );
}
{
  const result = run(
    { loop: { card: { type: 'vertical-stack', cards: [{ type: CARD, template: 'loop' }] } } },
    { template: 'loop' },
  );
  check(
    'a template that uses itself stops, and says so',
    [result.builds.length, typeof result.builds[1].error],
    [2, 'string'],
  );
  check('and the card it could not build is left as it was', result.neverBuilt, ['cards[0]']);
}

check(
  'a card of ours that is the whole card is built in its place too',
  run(
    {
      inner: { card: { type: 'tile', entity: '[[entity]]' } },
      outer: { card: { type: CARD, template: 'inner', inherit_variables: true } },
    },
    { template: 'outer', variables: [{ entity: 'light.hall' }] },
  ).final,
  { type: 'tile', entity: 'light.hall' },
);

/* ------------------------------------------------------------------ repeats */

{
  const result = run(NESTED, {
    template: 'tile',
    for_each: [{ entity: 'light.a' }, { entity: 'light.b', colour: 'red' }],
  });
  check('for_each builds a copy per item in a vertical stack', result.final, {
    type: 'vertical-stack',
    cards: [
      { type: 'tile', entity: 'light.a', color: 'amber' },
      { type: 'tile', entity: 'light.b', color: 'red' },
    ],
  });
  check('with one section per copy in the report', result.reports[0].sections.length, 2);
  check(
    'columns: lays them out in a grid',
    run(NESTED, { template: 'tile', columns: 2, for_each: [{ entity: 'light.a' }] }).final,
    { type: 'grid', columns: 2, square: false, cards: [{ type: 'tile', entity: 'light.a', color: 'amber' }] },
  );
  check(
    'empty: stands in for a repeat with nothing in it',
    run(NESTED, { template: 'tile', for_each: [], empty: { type: 'markdown', content: 'none' } }).final,
    { type: 'markdown', content: 'none' },
  );
  check(
    'for_each_from says it is not built here',
    /for_each_from/.test(run(NESTED, { template: 'tile', for_each_from: { domain: 'light' } }).error),
    true,
  );
}
{
  const ROWS = {
    light_row: { row: { entity: '[[entity]]', icon: 'mdi:lightbulb' } },
    plain_row: { row: { entity: '[[entity]]' } },
  };
  const by = { template_by_domain: { light: 'light_row', default: 'plain_row' } };
  check(
    'template_by_domain picks one template for a single card',
    run(ROWS, { ...by, variables: [{ entity: 'light.hall' }] }).final,
    { entity: 'light.hall', icon: 'mdi:lightbulb' },
  );
  const rows = run(ROWS, { ...by, for_each: [{ entity: 'light.hall' }, { entity: 'sensor.x' }] }).final;
  check('and one per copy in a repeat of rows', rows, {
    type: 'custom:decluttering-card-plus-many',
    kind: 'row',
    items: [{ entity: 'light.hall', icon: 'mdi:lightbulb' }, { entity: 'sensor.x' }],
  });
}

/* --------------------------------------------------------------- the boxes */

check('the templates box reads bare templates', readTemplates('t:\n  card: {type: tile}').names, ['t']);
check('with decluttering_templates: around them', readTemplates('decluttering_templates:\n  t: {card: {}}').names, [
  't',
]);
check(
  'or a whole dashboard, defaults and all',
  Object.keys(
    readTemplates('decluttering_defaults: [{a: 1}]\ndecluttering_templates: {t: {card: {}}}\nviews: []').dashboard,
  ),
  ['decluttering_defaults', 'decluttering_templates', 'views'],
);
check('a box that is not YAML says so', typeof readTemplates('t: [').error, 'string');
check('the card box reads card: around a card too', readCard(`card:\n  type: ${CARD}\n  template: t`).template, 't');
test('an empty card box is an error in words', () => assert.throws(() => readCard('  '), /empty/));

{
  const result = tryTemplate({
    templates:
      'decluttering_templates:\n' +
      Object.entries(NESTED)
        .map(([n, t]) => `  ${n}: ${JSON.stringify(t)}`)
        .join('\n'),
    card: `type: ${CARD}\ntemplate: pair`,
    entities: '',
    onlyMine: false,
    readAll: false,
  });
  check(
    "the report is the card's Markdown, the outline first",
    /^# /.test(result.report) && result.report.includes('<summary><b>'),
    true,
  );
  check('with the whole card built in it', result.report.includes('light.landing'), true);
  check('and the outline has the two cards inside', result.outline[0].children.length, 2);
}
check(
  'a card box that does not read leaves the rest alone',
  typeof tryTemplate({ templates: '', card: 'type: [', entities: '', onlyMine: false, readAll: false }).cardError,
  'string',
);

/* ---------------------------------------------------------- the stand-in form */

const FORM = {
  variables: [
    { name: 'entity', type: 'entity', domain: 'light', required: true },
    { name: 'show_name', type: 'boolean', default: true },
    { name: 'name', default: '[[entity|friendly_name]]', show_if: 'show_name' },
    {
      name: 'colour',
      selector: { select: { options: ['red', { value: 'amber', label: 'Amber' }] } },
      default: 'amber',
      group: 'Looks',
    },
    { name: 'size', type: 'number', min: 1, max: 4, default: 2, group: 'Looks' },
    { name: 'inner', selector: { card: {} } },
    { name: 'area', options_from: { areas: true } },
  ],
  card: { type: 'tile' },
};
const fields = (variables) =>
  standInFields(FORM, variables, 't', require('../.test-build/variables.js').withEveryStateReadable(HOUSE, []), {});
{
  const got = fields([{ entity: 'light.kitchen_ceiling' }]);
  check(
    'each declared variable is a field, ungrouped first',
    got.map((f) => [f.name, f.control, f.group ?? null]),
    [
      ['entity', 'text', null],
      ['show_name', 'checkbox', null],
      ['name', 'text', null],
      ['inner', 'card', null],
      ['area', 'select', null],
      ['colour', 'select', 'Looks'],
      ['size', 'number', 'Looks'],
    ],
  );
  const by = Object.fromEntries(got.map((f) => [f.name, f]));
  check(
    'a field the card sets shows its value',
    [by.entity.set, by.entity.value, by.entity.selector],
    [true, 'light.kitchen_ceiling', 'entity'],
  );
  check('an unset one shows its default worked out', [by.name.set, by.name.shown], [false, 'Kitchen ceiling']);
  check('a switch default shows as on', by.show_name.shown, true);
  check('select options keep their labels', by.colour.options, [
    { value: 'red', label: 'red' },
    { value: 'amber', label: 'Amber' },
  ]);
  check('a number keeps its range', [by.size.min, by.size.max, by.size.shown], [1, 4, 2]);
  check(
    'options_from finds its options in the house',
    by.area.options.length > 2 && by.area.options.some((o) => o.value === 'kitchen'),
    true,
  );
  check('a show_if that holds shows the field', by.name.hidden, false);
  check('required is said', by.entity.required, true);
  const off = Object.fromEntries(
    fields([{ entity: 'light.kitchen_ceiling' }, { show_name: false }]).map((f) => [f.name, f]),
  );
  check('a show_if that fails hides it, and says which', [off.name.hidden, off.name.showIf], [true, ['show_name']]);
}
check('a template with no declarations has no form', standInFields({ card: {} }, [], 't', HOUSE, {}), []);
check('an unknown selector is a text box named after it', controlFor({ icon: {} }), {
  control: 'text',
  selector: 'icon',
});
check('a multiline text selector is a box of lines', controlFor({ text: { multiline: true } }).multiline, true);
check('a number box gives a number', controlValue({ control: 'number' }, '3'), 3);
check('but leaves text that is not one', controlValue({ control: 'number' }, '[[x]]'), '[[x]]');
check('a checkbox gives true or false', controlValue({ control: 'checkbox' }, true), true);

check(
  'setting a variable in a list replaces its entry',
  withVariable({ variables: [{ a: 1 }, { b: 2 }] }, 'a', 5).variables,
  [{ a: 5 }, { b: 2 }],
);
check('or adds one at the end', withVariable({ variables: [{ a: 1 }] }, 'c', 'x').variables, [{ a: 1 }, { c: 'x' }]);
check('in a mapping it sets the key', withVariable({ variables: { a: 1 } }, 'b', 2).variables, { a: 1, b: 2 });
check('emptying it takes it out', withVariable({ variables: [{ a: 1 }, { b: 2 }] }, 'a', undefined).variables, [
  { b: 2 },
]);
check(
  'the last one takes variables: out',
  'variables' in withVariable({ variables: [{ a: 1 }] }, 'a', undefined),
  false,
);
check('a card with none gets a list', withVariable({ type: CARD }, 'a', 1).variables, [{ a: 1 }]);

/* ------------------------------------------------------------------- gists */

check('a bare id is a gist id', gistId(' 0123456789abcdef0123456789abcdef '), '0123456789abcdef0123456789abcdef');
check(
  'so is a gist address',
  gistId('https://gist.github.com/dstrohl/abcdef0123456789#file-card-yaml'),
  'abcdef0123456789',
);
check('and one without a user', gistId('https://gist.github.com/abcdef0123'), 'abcdef0123');
check(
  'anything else is not',
  [gistId('https://github.com/x/y'), gistId('hello'), gistId('')],
  [undefined, undefined, undefined],
);

const file = (content, extra = {}) => ({ content, ...extra });
check(
  'named files fill their boxes',
  boxesFromGist({
    owner: { login: 'dan' },
    files: { 'templates.yaml': file('t: 1'), 'Card.yml': file('type: x'), 'notes.md': file('#') },
  }),
  { boxes: { templates: 't: 1', card: 'type: x' }, files: ['templates.yaml', 'Card.yml'], owner: 'dan' },
);
check(
  'one YAML file with every key fills every box',
  boxesFromGist({
    files: {
      'example.yaml': file(
        `decluttering_defaults: [{a: 1}]\ndecluttering_templates: {t: {card: {}}}\ncard: {type: ${CARD}, template: t}\nentities: {x: {domain: light}}`,
      ),
    },
  }).boxes,
  {
    templates: 'decluttering_defaults:\n  - a: 1\ndecluttering_templates:\n  t:\n    card: {}\n',
    card: `type: ${CARD}\ntemplate: t\n`,
    entities: 'x:\n  domain: light\n',
  },
);
check(
  'a cut-off file is too large',
  /too large/.test(boxesFromGist({ files: { 'card.yaml': file('', { truncated: true }) } }).problem),
  true,
);
check('a gist with nothing to read says so', typeof boxesFromGist({ files: { 'a.txt': file('x') } }).problem, 'string');
check(
  'nor with two YAML files and no names',
  typeof boxesFromGist({ files: { 'a.yaml': file('x: 1'), 'b.yaml': file('y: 1') } }).problem,
  'string',
);
check(
  'one YAML file that is not ours says so',
  /neither/.test(boxesFromGist({ files: { 'a.yaml': file('x: 1') } }).problem),
  true,
);
check('nor with no files', typeof boxesFromGist({}).problem, 'string');

const answer =
  (status, body, headers = {}) =>
  async (url, init) => {
    answer.last = { url, init };
    return {
      ok: status >= 200 && status < 300,
      status,
      headers: { get: (name) => headers[name.toLowerCase()] ?? null },
      json: async () => {
        if (body instanceof Error) throw body;
        return body;
      },
    };
  };
test('a gist loads from the API by id, without credentials', async () => {
  const got = await loadGist('abcdef0123', answer(200, { files: { 'card.yaml': file('type: x') } }));
  assert.deepEqual(got, { boxes: { card: 'type: x' }, files: ['card.yaml'] });
  assert.equal(answer.last.url, 'https://api.github.com/gists/abcdef0123');
  assert.equal(answer.last.init.credentials, 'omit');
});
test('a missing gist is a 404 in words', async () => {
  assert.match((await loadGist('abcdef0123', answer(404, {}))).problem, /no public gist/);
});
test('the rate limit says when to try again', async () => {
  const got = await loadGist(
    'abcdef0123',
    answer(403, {}, { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': '2000000000' }),
  );
  assert.match(got.problem, /sixty/);
});
test('so does a 403 whose headers the browser was not shown, by its message', async () => {
  const got = await loadGist('abcdef0123', answer(403, { message: 'API rate limit exceeded for 1.2.3.4.' }));
  assert.match(got.problem, /sixty/);
});
test('any other 403 is a refusal', async () => {
  assert.match((await loadGist('abcdef0123', answer(403, { message: 'Forbidden' }))).problem, /refused/);
});
test('GitHub out of reach is said softly', async () => {
  const got = await loadGist('abcdef0123', async () => {
    throw new TypeError('Failed to fetch');
  });
  assert.match(got.problem, /could not be reached/);
});
test('an answer that is not JSON is said too', async () => {
  assert.match((await loadGist('abcdef0123', answer(200, new SyntaxError('x')))).problem, /not a gist/);
});
test('a huge answer is refused before it is read', async () => {
  assert.match((await loadGist('abcdef0123', answer(200, {}, { 'content-length': '99999999' }))).problem, /too large/);
});
test('what is not an id is never fetched', async () => {
  let asked = false;
  const got = await loadGist('https://evil.example/x', async () => {
    asked = true;
  });
  assert.equal(asked, false);
  assert.match(got.problem, /not a gist id/);
});

/* ------------------------------------------------------------------ links */

test('a link carries the card box and every-state-readable', async () => {
  const state = { templates: 't: {card: {}}', card: `type: ${CARD}\ntemplate: t`, readAll: true };
  for (const deflate of [false, true]) {
    const hash = await encodeState(state, deflate);
    const read = await decodeHash(`#${hash}`);
    assert.deepEqual(read.state, state);
  }
});
test('and a hand-written one can name the card', async () => {
  const read = await decodeHash(`#${readableHash({ card: 'template: t' })}`);
  assert.deepEqual(read.state, { card: 'template: t' });
});
