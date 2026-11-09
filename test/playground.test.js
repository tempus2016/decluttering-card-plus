/*
 * Unit tests for src/playground.ts: the docs site's "Try a placeholder", which runs a
 * placeholder through the card's own substitution one step at a time. Run with `npm test`.
 */
const { tryPlaceholder, splitPlaceholder, kindOf } = require('../.test-build/playground.js');

const { placeholderRuns } = require('../.test-build/docs-dom.js');

const { check } = require('./check');

const VARS = `
entity: light.kitchen_ceiling
room: Back Garden
count: 3
offset: 2
level: warning
colours: { error: red, warning: amber, good: green }
rooms: [kitchen, hall, study]
`;

const steps = (expression, vars = VARS) =>
  tryPlaceholder(vars, expression).steps.map((each) => [each.step, each.value, each.kind]);

/* -------------------------------------------------------------- taking apart */

check('a placeholder splits at its own pipes', splitPlaceholder('[[room|slug|upper]]'), {
  name: 'room',
  steps: ['slug', 'upper'],
  optional: false,
});
check('not at the pipes of one inside it', splitPlaceholder('[[count|add:[[offset|mul:2]]|round]]'), {
  name: 'count',
  steps: ['add:[[offset|mul:2]]', 'round'],
  optional: false,
});
check(
  'a lookup by another variable is the name',
  splitPlaceholder('[[colours.[[level]]|default:grey]]').name,
  'colours.[[level]]',
);
check('the optional marker is kept apart', splitPlaceholder('[[room|upper?]]'), {
  name: 'room',
  steps: ['upper'],
  optional: true,
});
check('text around it is not one placeholder', splitPlaceholder('x [[room]]'), undefined);
check('nor are two side by side', splitPlaceholder('[[a]] [[b]]'), undefined);

/* -------------------------------------------------------------------- kinds */

check(
  'kinds are named the way the docs name them',
  [kindOf('a'), kindOf(1), kindOf(true), kindOf([]), kindOf({}), kindOf(null), kindOf('[[x]]')],
  ['text', 'number', 'boolean', 'list', 'mapping', 'null', 'unresolved'],
);

/* -------------------------------------------------------------------- steps */

check('every step of a chain shows what it gave, and as what', steps('[[count|add:[[offset]]|mul:2]]'), [
  ['count', 3, 'number'],
  ['add:[[offset]]', 5, 'number'],
  ['mul:2', 10, 'number'],
]);

check('text transforms give text', steps('[[room|slug|upper]]'), [
  ['room', 'Back Garden', 'text'],
  ['slug', 'back_garden', 'text'],
  ['upper', 'BACK_GARDEN', 'text'],
]);

check('a list stays a list until a step makes it something else', steps('[[rooms|count]]'), [
  ['rooms', ['kitchen', 'hall', 'study'], 'list'],
  ['count', 3, 'number'],
]);

check('a yes-or-no step gives a real true', steps('[[room|contains:Garden]]')[1], ['contains:Garden', true, 'boolean']);

check(
  'a lookup by another variable resolves the inner one first',
  tryPlaceholder(VARS, '[[colours.[[level]]|default:grey]]').whole,
  { value: 'amber', kind: 'text' },
);

check('a placeholder with no steps has no rows', tryPlaceholder(VARS, '[[room]]').steps, []);

/* --------------------------------------------------------------- the house */

check('area_id is the id, as text', tryPlaceholder(VARS, '[[entity|area_id]]').whole, {
  value: 'kitchen',
  kind: 'text',
});
check('area is the name', tryPlaceholder(VARS, '[[entity|area]]').whole.value, 'Kitchen');
check(
  'an area comes from the device when the entity has none',
  tryPlaceholder(VARS, '[[entity|floor]]').whole.value,
  'Ground floor',
);
check('labels are named', tryPlaceholder(VARS, '[[entity|labels]]').whole.value, 'Evening lights');
check('state answers for the sample entities', tryPlaceholder(VARS, '[[entity|state]]').whole.value, 'on');
check('an attribute is text, and a sum makes it a number', steps('[[entity|attr:brightness|add:0]]').slice(1), [
  ['attr:brightness', '180', 'text'],
  ['add:0', 180, 'number'],
]);
check('an entity id stands for itself', tryPlaceholder('', '[[sensor.garden_temperature|state]]').whole.value, '14.6');

/* ------------------------------------------------------- nothing to give */

{
  const result = tryPlaceholder(VARS, '[[missing]]');
  check('an unset variable is left as written', result.whole, { value: '[[missing]]', kind: 'unresolved' });
  check('and named as unset', result.unset, ['missing']);
  check('by its name alone, steps taken off', tryPlaceholder(VARS, '[[nope|upper]]').unset, ['nope']);
  check('an optional one is not called unset', tryPlaceholder(VARS, '[[nope|upper?]]').unset, []);
}
check('an optional one takes its option out', tryPlaceholder(VARS, '[[missing?]]').whole, {
  value: undefined,
  kind: 'removed',
});
check('a default stands in', tryPlaceholder(VARS, '[[missing|default:none]]').whole.value, 'none');

/* ------------------------------------------------------------- in a string */

{
  const result = tryPlaceholder(VARS, '[[count|add:1]]');
  check('the entire value keeps its type', result.whole, { value: 4, kind: 'number' });
  check('written inside text it is text', result.inText, '4');
}
check('a list inside text is written as JSON', tryPlaceholder(VARS, '[[rooms]]').inText, '["kitchen","hall","study"]');
check('text around a placeholder is kept', tryPlaceholder(VARS, 'The [[room|lower]]').whole.value, 'The back garden');

/* ----------------------------------------------------------------- reading */

check(
  'variables can be a list of one-name entries',
  tryPlaceholder('- n: 2\n- m: 3', '[[n|add:[[m]]]]').whole.value,
  5,
);
check('YAML that does not read says so', typeof tryPlaceholder('a: [b', '[[a]]').error, 'string');
check('no variables at all is fine', tryPlaceholder('', '[[a|default:x]]').whole.value, 'x');

/* ----------------------------------------------------- the sandbox dashboard */

{
  const fs = require('fs');
  const path = require('path');
  const { load } = require('js-yaml');
  const deepReplace = require('../.test-build/deep-replace.js').default;
  const { SAMPLE_HOUSE } = require('../.test-build/playground.js');
  const { withStateScope } = require('../.test-build/variables.js');
  const sandbox = load(fs.readFileSync(path.join(__dirname, '../examples/playground-dashboard.yaml'), 'utf8'));
  const defaults = { ...sandbox.decluttering_defaults, entity: 'light.kitchen_ceiling' };
  const hass = withStateScope(SAMPLE_HOUSE, ['light.kitchen_ceiling']);
  const leftovers = [];
  for (const [name, template] of Object.entries(sandbox.decluttering_templates)) {
    const built = deepReplace([defaults], {}, template.card, name, hass, true);
    // What each line shows as written sits in backticks; only what it turns into is checked.
    const shown = built.content.replace(/`[^`]*`/g, '');
    for (const left of shown.match(/\[\[[^\]]*\]\]/g) || []) leftovers.push(left);
  }
  check('every line of the sandbox resolves, but for the one that shows an unset variable', leftovers, ['[[nothing]]']);
  check(
    'every card on it is one of its templates',
    sandbox.views[0].cards.every((card) => card.template in sandbox.decluttering_templates),
    true,
  );
}

/* ------------------------------------------------------------- lighting */

check('a placeholder with one inside it is lit whole', placeholderRuns('a [[count|add:[[offset]]|mul:2]] b'), [
  { text: 'a ', placeholder: false },
  { text: '[[count|add:[[offset]]|mul:2]]', placeholder: true },
  { text: ' b', placeholder: false },
]);
check('an opening with no closing stays plain', placeholderRuns('x [[open'), [
  { text: 'x [[open', placeholder: false },
]);
check(
  'two side by side are two',
  placeholderRuns('[[a]][[b]]').map((run) => run.text),
  ['[[a]]', '[[b]]'],
);

{
  const started = Date.now();
  const runs = placeholderRuns('['.repeat(40000) + '\nok [[x]]');
  check(
    'a line of forty thousand brackets is text, read in no time, and the next line is still read',
    [Date.now() - started < 500, runs[runs.length - 1]],
    [true, { text: '[[x]]', placeholder: true }],
  );
}

/* ------------------------------------------------- the docs page's house (#427) */

const {
  DOCS_HOUSE,
  addEntities,
  ownEntities,
  itemTemplates,
  tryOnPage,
  houseRows,
  MAX_COUNT,
} = require('../.test-build/playground-house.js');
const { registryIndexBuilds } = require('../.test-build/registry-index.js');

const page = (placeholder, more = {}) =>
  tryOnPage({ variables: '', placeholder, entities: '', onlyMine: false, templates: '', ...more });

check(
  "the page house keeps the card's four and adds more",
  [
    'light.kitchen_ceiling',
    'sensor.garden_temperature',
    'binary_sensor.bedroom_window',
    'input_select.house_mode',
  ].every((id) => id in DOCS_HOUSE.states) && Object.keys(DOCS_HOUSE.states).length > 20,
  true,
);
check(
  'lights across two floors, for a repeat to narrow',
  page('[[row|repeat:up]]', {
    variables: 'up: {domain: light, floor: first_floor}',
    templates: 'row: {item: "[[entity]]"}',
  }).whole.value,
  ['light.bedroom_lamp', 'light.landing', 'light.study_desk'],
);
check(
  'by label too',
  page('[[row|repeat:lit]]', {
    variables: 'lit: {label: Night lights}',
    templates: 'row: {item: "[[entity]]"}',
  }).whole.value,
  ['light.bedroom_lamp', 'light.landing'],
);
check(
  'and by area, the made-up one included',
  page('[[row|repeat:here]]', {
    variables: 'here: {area: Living Room, domain: sensor}',
    templates: 'row: {item: "[[name]]"}',
  }).whole.value,
  ['Living room humidity', 'Living room temperature'],
);
check(
  'every sample entity has a last_changed',
  Object.values(DOCS_HOUSE.states).every((state) => /^2026-/.test(state.last_changed) && state.last_updated),
  true,
);
check('and the step reads it', page('[[light.landing|last_changed]]').whole.value, '2026-11-08T18:00:00+00:00');
check('the four keep what the card has', page('[[light.kitchen_ceiling|floor]]').whole.value, 'Ground floor');

/* ------------------------------------------------------------ own entities */

{
  const made = addEntities(
    { states: {}, entities: {}, devices: {}, areas: {}, floors: {}, labels: {} },
    {
      my_sensors: { domain: 'sensor', count: 20, name: 'sensor_[[index]]' },
    },
  );
  check('count: makes that many', made.added.length, 20);
  check(
    'numbered from 01 where [[index]] is written',
    [made.added[0], made.added[19]],
    ['sensor.sensor_01', 'sensor.sensor_20'],
  );
  check('the name is the friendly name', made.house.states['sensor.sensor_07'].attributes.friendly_name, 'sensor_07');
  check('anything not given is blank', made.house.states['sensor.sensor_07'].state, '');
}
{
  const made = addEntities(DOCS_HOUSE, {
    plain: { domain: 'light', count: 3 },
    'switch.porch': { state: 'on' },
    named: { domain: 'fan', name: 'Attic Fan' },
    wide: { domain: 'sensor', count: 100, entity_id: 'sensor.probe_[[index]]', state: '[[index]]' },
  });
  check('a run with no [[index]] is numbered after the key', made.added.slice(0, 3), [
    'light.plain_01',
    'light.plain_02',
    'light.plain_03',
  ]);
  check('a key that is an entity id is the id', made.added[3], 'switch.porch');
  // r5: one entity takes its id from its key, its name only names it (#427).
  check('one entity takes its id from its key', made.added[4], 'fan.named');
  check('and its name is the friendly name', made.house.states['fan.named'].attributes.friendly_name, 'Attic Fan');
  const bare = addEntities(DOCS_HOUSE, { frontporch: { domain: 'camera' } });
  check(
    'an entity with no name gets one made from its id, as Home Assistant does',
    [bare.added[0], bare.house.states['camera.frontporch'].attributes.friendly_name],
    ['camera.frontporch', 'Frontporch'],
  );
  check(
    'the number is as wide as the count',
    [made.added[5], made.house.states['sensor.probe_100'].state],
    ['sensor.probe_001', '100'],
  );
  check('the sample house is not changed', 'switch.porch' in DOCS_HOUSE.states, false);
}
{
  const made = addEntities(DOCS_HOUSE, {
    one: { domain: 'light', area: 'kitchen' },
    two: { domain: 'light', area: 'Kitchen' },
    three: { domain: 'light', area: 'Garage', floor: 'Basement', labels: ['Evening lights', 'Outside'] },
  });
  check('an area by id', made.house.entities['light.one'].area_id, 'kitchen');
  check('or by name', made.house.entities['light.two'].area_id, 'kitchen');
  check('one that does not exist is made, on the floor given', made.house.areas.garage, {
    area_id: 'garage',
    name: 'Garage',
    floor_id: 'basement',
    icon: null,
  });
  check('and so is the floor', made.house.floors.basement.name, 'Basement');
  check('labels by name, made when missing', made.house.entities['light.three'].labels, ['evening', 'outside']);
  check(
    'and the steps read them',
    tryOnPage({
      variables: '',
      placeholder: '[[light.three|floor]] [[light.three|labels]]',
      entities: 'three: {domain: light, area: Garage, floor: Basement, labels: [Evening lights, Outside]}',
      onlyMine: false,
      templates: '',
    }).whole.value,
    'Basement Evening lights, Outside',
  );
}
{
  const made = addEntities(DOCS_HOUSE, {
    bad: 'light',
    nodomain: { state: 'on' },
    typo: { domain: 'light', aera: 'kitchen' },
    huge: { domain: 'light', count: MAX_COUNT + 1 },
    lonely: { domain: 'light', floor: 'first_floor' },
    clash: { domain: 'light', area: 'kitchen', floor: 'first_floor' },
    fine: { domain: 'light' },
  });
  check(
    'each bad entry says what is wrong, and the rest still go in',
    [made.problems.length, made.added],
    [6, ['light.fine']],
  );
  check('a misspelt key is named', made.problems[2].includes('aera'), true);
  check('an area already on another floor says so', made.problems[5].includes('already on Ground floor'), true);
}
check('own entities can replace the house', Object.keys(ownEntities('mine: {domain: light}', true).house.states), [
  'light.mine',
]);
check(
  'YAML that does not read is an error, and the house stays',
  [typeof ownEntities('a: [b', false).error, 'light.landing' in ownEntities('a: [b', false).house.states],
  ['string', true],
);
check("the user's own wrapper is accepted", ownEntities('ha_test_objects:\n  my_light: {domain: light}', false).added, [
  'light.my_light',
]);
{
  // The registry index is cached by the house's identity: new entities must not be read
  // through an index worked out for the last house.
  const vars = 'garage: {area: Garage}';
  const tpl = 'row: {item: "[[entity]]"}';
  const first = page('[[row|repeat:garage]]', {
    variables: vars,
    templates: tpl,
    entities: 'a: {domain: light, area: Garage}',
  });
  const builds = registryIndexBuilds();
  const same = page('[[row|repeat:garage]]', {
    variables: vars,
    templates: tpl,
    entities: 'a: {domain: light, area: Garage}',
  });
  const afterSame = registryIndexBuilds();
  const second = page('[[row|repeat:garage]]', {
    variables: vars,
    templates: tpl,
    entities: 'a: {domain: light, area: Garage}\nb: {domain: light, area: Garage}',
  });
  check('a repeat over own entities finds them', first.whole.value, ['light.a']);
  check('the same box keeps the index', [same.whole.value, afterSame], [['light.a'], builds]);
  check(
    'a changed box is read afresh',
    [second.whole.value, registryIndexBuilds() > afterSame],
    [['light.a', 'light.b'], true],
  );
}

/* ------------------------------------------------------------ item templates */

{
  const tpl = `light_row:
  default:
    - area: no area
  item:
    entity: '[[entity]]'
    area: '[[area]]'
`;
  check('with: fills an item template', page('[[light_row|with:entity=light.hall]]', { templates: tpl }).whole.value, {
    entity: 'light.hall',
    area: 'no area',
  });
  check(
    'repeat: fills it once per copy',
    page('[[light_row|repeat:st]]', { templates: tpl, variables: 'st: {entities: [light.hall, light.landing]}' }).whole
      .value,
    [
      { entity: 'light.hall', area: 'Hall' },
      { entity: 'light.landing', area: 'Landing' },
    ],
  );
  check(
    'a list variable repeats too',
    page('[[light_row|repeat:ids]]', { templates: tpl, variables: 'ids: [{entity: a}, {entity: b}]' }).whole.value,
    [
      { entity: 'a', area: 'no area' },
      { entity: 'b', area: 'no area' },
    ],
  );
  check(
    'extends: works, and decluttering_templates: around them is fine',
    page('[[child|with:entity=x]]', {
      templates: `decluttering_templates:\n  base: {item: {entity: '[[entity]]', kind: base}}\n  child: {extends: base, item: {kind: child}}`,
    }).whole.value,
    { entity: 'x', kind: 'child' },
  );
  const read = itemTemplates('card_one: {card: {type: button}}\nrow: {item: x}\nodd: 3');
  check(
    'a card template is named as not built here, and a non-mapping too',
    [Object.keys(read.templates), read.problems.length],
    [['row'], 2],
  );
  check('templates YAML that does not read is an error', typeof itemTemplates('a: [').error, 'string');
  // #307: a function template from the same box is a step, on its own and inside an item.
  const functions = `shout: {function: '[[value|upper]]!'}\nrow: {item: {name: '[[room|shout]]'}}`;
  check(
    'a function template in the box is a step of its own',
    page('[[room|shout]]', { variables: '- room: kitchen', templates: functions }).whole.value,
    'KITCHEN!',
  );
  check(
    'and an item template from the box can use it',
    page('[[row|with]]', { variables: '- room: kitchen', templates: functions }).whole.value,
    { name: 'KITCHEN!' },
  );
  check('without the box, with: is not found', page('[[nope|with:a=1]]').whole.kind, 'unresolved');
}

/* ---------------------------------------------------------- the house table */

{
  const rows = houseRows(DOCS_HOUSE);
  check('one row per entity', rows.length, Object.keys(DOCS_HOUSE.states).length);
  const ceiling = rows.find((row) => row.entity === 'light.kitchen_ceiling');
  check(
    'a row says where it is, by its device when it has no area of its own',
    ceiling.where,
    "Kitchen, Ground floor (its device's)",
  );
  check(
    'and what device',
    ceiling.more.some((each) => each === 'device Hue ceiling by Signify (Hue White)'),
    true,
  );
  check('labels by name', ceiling.labels, ['Evening lights']);
  check(
    'a garden on no floor says so',
    rows.find((row) => row.entity === 'sensor.garden_temperature').where,
    "Back Garden, on no floor (its device's)",
  );
  const own = ownEntities('mine: {domain: light}', false);
  check(
    'own entities are marked',
    houseRows(own.house, own.added)
      .filter((row) => row.own)
      .map((row) => row.entity),
    ['light.mine'],
  );
}

/* -------------------------------------------------------------- share links */

const { encodeState, decodeHash, readableHash } = require('../.test-build/playground-share.js');

(async () => {
  const state = {
    variables: 'room: Back Garden\nnote: "ünïcödé ✓ 🏠"\n',
    placeholder: '[[room|slug|upper]]',
    entities: 'my_light: {domain: light}',
    onlyMine: true,
    templates: 'row: {item: x}',
  };
  const plain = await encodeState(state, false);
  check('a plain link is j. and base64url', /^try=j\.[A-Za-z0-9_-]+$/.test(plain), true);
  check('and reads back as it was', await decodeHash(`#${plain}`), { state });
  const squeezed = await encodeState({ ...state, variables: state.variables.repeat(40) }, true);
  check('a long one is squeezed when it can be', squeezed.startsWith('try=z.'), true);
  check('and still reads back', (await decodeHash(squeezed)).state.variables, state.variables.repeat(40));
  check('empty boxes are left out', await decodeHash(await encodeState({ placeholder: '[[a]]' }, false)), {
    state: { placeholder: '[[a]]' },
  });
  check('no hash says nothing', await decodeHash(''), undefined);
  check('a heading id says nothing', await decodeHash('#the-sample-house'), undefined);
  check('a cut-short link is a problem, not a throw', 'problem' in (await decodeHash(plain.slice(0, 20))), true);
  check('a mangled squeezed one too', 'problem' in (await decodeHash('try=z.AAAA')), true);
  check('an unknown kind too', 'problem' in (await decodeHash('try=q.AAAA')), true);
  {
    const bytes = Buffer.from(JSON.stringify({ v: 9, vars: 'a: 1', ph: 42, tpl: ['x'], future: true }));
    const link = `try=j.${bytes.toString('base64url')}`;
    check('a later version gives what it can', await decodeHash(link), { state: { variables: 'a: 1' } });
  }
  check(
    'a hand-written link reads',
    await decodeHash('#placeholder=%5B%5Broom%7Cupper%5D%5D&variables=room%3A%20Hall'),
    { state: { placeholder: '[[room|upper]]', variables: 'room: Hall' } },
  );
  check(
    'and readableHash writes one',
    readableHash({ placeholder: '[[room|upper]]', variables: 'room: Hall', onlyMine: true }),
    'placeholder=%5B%5Broom%7Cupper%5D%5D&variables=room%3A%20Hall&only=1',
  );
  check(
    'which reads back',
    (await decodeHash(readableHash({ placeholder: 'a + b', templates: 'x: {item: 1}', onlyMine: true }))).state,
    { placeholder: 'a + b', templates: 'x: {item: 1}', onlyMine: true },
  );
  {
    // A tiny link that inflates past the ceiling is refused rather than read.
    const zeros = new Uint8Array(3_000_000);
    const stream = new CompressionStream('deflate-raw');
    const zipped = new Uint8Array(await new Response(new Blob([zeros]).stream().pipeThrough(stream)).arrayBuffer());
    const link = `try=z.${Buffer.from(zipped).toString('base64url')}`;
    check('a link that inflates too far is a problem', 'problem' in (await decodeHash(link)), true);
  }
})();

// r4: the page reads every state, but only the entities written in its boxes stand as
// variables, so a repeat over a large house stays quick and every copy still reads its state.
{
  const { withEveryStateReadable, stateAllowed, stateScope } = require('../.test-build/variables.js');
  const house = { states: { 'light.a': { state: 'on' }, 'light.b': { state: 'off' } } };
  const readable = withEveryStateReadable(house, ['light.a']);
  check(
    'every state can be read',
    [stateAllowed(readable, 'light.a'), stateAllowed(readable, 'light.b')],
    [true, true],
  );
  check('only the written ones stand for themselves', stateScope(readable), ['light.a']);
  check('a card never reads every state', stateAllowed(house, 'light.b'), false);
  const big = tryOnPage({
    variables: '- filter:\n    domain: sensor\n    area: garage\n',
    placeholder: '[[row|repeat:filter]]',
    entities: 'many:\n  domain: sensor\n  count: 300\n  name: s_[[index]]\n  area: garage\n  state: "7"\n',
    onlyMine: false,
    templates: 'row:\n  item:\n    entity: "[[entity]]"\n    st: "[[entity|state]]"\n',
  }).whole.value;
  check('each of 300 copies reads its own state', [big.length, big.every((copy) => copy.st === '7')], [300, true]);
}
