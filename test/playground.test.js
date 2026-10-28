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
