/*
 * Unit tests for templates used as steps (#307): src/functions.ts, the chain in
 * src/variables.ts, and everything that has to know a function step is a step - the lint,
 * the unknown-step warning, the autocomplete, the dashboard sweep, sharing and the CLI.
 */
const deepReplace = require('../.test-build/deep-replace.js').default;
const { functionArguments, functionTemplatesOf } = require('../.test-build/functions.js');
const { lintTemplate } = require('../.test-build/lint.js');
const { knownStep, closestStep, setFunctionNames } = require('../.test-build/closest.js');
const { orderedSteps } = require('../.test-build/code-hooks.js');
const { checkDashboard, itemTemplatesOf } = require('../.test-build/templates.js');
const { buildExport } = require('../.test-build/share.js');
const { lintDashboard } = require('../.test-build/cli-lint.js');
const { usesResolver, itemTemplatesReached } = require('../.test-build/variables.js');
const { listPlaceholders } = require('../.test-build/placeholders.js');
const { check } = require('./check');

const warnings = [];
const realWarn = console.warn;
console.warn = (m) => warnings.push(String(m));
const said = (fragment) => warnings.some((w) => w.includes(fragment));

// The issue's own example, written the way the issue thread settled on.
const occ_sens = {
  parameters: ['detect_type', 'suffix'],
  default: [{ detect_type: 'car' }, { suffix: 'occupancy' }],
  let: {
    sensor_name: 'binary_sensor.[[value|lower]]_[[detect_type]]_[[suffix]]',
    sensor_exists: '[[sensor_name|exists]]',
  },
  function: '[[sensor_name|if:sensor_exists?]]',
};
const hass = {
  states: {
    'binary_sensor.frontdoor_car_occupancy': { state: 'on', attributes: {} },
    'binary_sensor.frontdoor_cat_occupancy': { state: 'off', attributes: {} },
    'binary_sensor.frontdoor_cat_detected': { state: 'off', attributes: {} },
    'binary_sensor.frontdoor_animal_found': { state: 'on', attributes: {} },
  },
};
const templates = {
  occ_sens,
  double: { function: '[[value|mul:2]]' },
  yes: { function: '[[value|bool]]' },
  shout: { parameters: ['mark'], default: [{ mark: '!' }], function: '[[value|upper]][[mark]]' },
  sees_card: { function: '[[value]]-[[secret]]' },
  sees_default: { default: [{ secret: 'own' }], function: '[[value]]-[[secret]]' },
  loop: { function: '[[value|loop]]' },
  ping: { function: '[[value|pong]]' },
  pong: { function: '[[value|ping]]' },
  upper: { function: 'never [[value]]' },
  mapping: { function: { a: '[[value]]' } },
  calls_other: { function: '[[value|shout:#]]' },
  row: { item: { entity: '[[entity|occ_sens:cat]]' } },
};
const build = (
  content,
  variables = [{ var1: 'FrontDoor' }, { detect_type: 'animal' }],
  extras = { itemTemplates: templates },
) => deepReplace(variables, {}, content, 'card', hass, false, undefined, 0, undefined, undefined, false, extras);

// The four calls in the issue, with a sensor that exists and one that does not.
check('a function called with just a value', build({ a: '[[var1|occ_sens]]' }), {
  a: 'binary_sensor.frontdoor_car_occupancy',
});
check('one unnamed argument takes the first parameter', build({ a: '[[var1|occ_sens:cat]]' }), {
  a: 'binary_sensor.frontdoor_cat_occupancy',
});
check('two unnamed arguments take the parameters in order', build({ a: '[[var1|occ_sens:cat,detected]]' }), {
  a: 'binary_sensor.frontdoor_cat_detected',
});
check(
  'named arguments, one of them a placeholder filled from the card first',
  build({ a: '[[var1|occ_sens:suffix=found,detect_type=[[detect_type]]]]' }),
  { a: 'binary_sensor.frontdoor_animal_found' },
);
warnings.length = 0;
check('a sensor that does not exist leaves the placeholder', build({ a: '[[var1|occ_sens:foobar]]' }), {
  a: '[[var1|occ_sens:foobar]]',
});
check('and says which function gave nothing', said('occ_sens gave nothing for "FrontDoor"'), true);
warnings.length = 0;
check('with ? the option goes', build({ a: '[[var1|occ_sens:foobar?]]', b: 1 }), { b: 1 });
check('quietly', warnings, []);
check('a default: after it stands in', build({ a: '[[var1|occ_sens:foobar|default:none]]' }), { a: 'none' });
check('an or: after it stands in', build({ a: '[[var1|occ_sens:foobar|or:spare]]' }, [{ var1: 'x' }, { spare: 'y' }]), {
  a: 'y',
});

// Chains, both ways round.
check('steps after a function shape what it gave', build({ a: 'x [[var1|occ_sens|upper]] y' }), {
  a: 'x BINARY_SENSOR.FRONTDOOR_CAR_OCCUPANCY y',
});
check('steps before a function shape what it is given', build({ a: '[[var1|lower|occ_sens]]' }), {
  a: 'binary_sensor.frontdoor_car_occupancy',
});
check('two functions in one chain', build({ a: '[[var1|shout|shout:#]]' }), { a: 'FRONTDOOR!#' });
check('a function can call another', build({ a: '[[var1|calls_other]]' }), { a: 'FRONTDOOR#' });
check('a function after split shapes each item', build({ a: '[[list|split|shout|join:+]]' }, [{ list: 'a,b' }]), {
  a: 'A!+B!',
});

// What it sees: the value, its arguments, its own defaults - never the card's variables.
warnings.length = 0;
check(
  "the card's variables are not the function's",
  build({ a: '[[var1|sees_card]]' }, [{ var1: 'v' }, { secret: 'card' }]),
  { a: '[[var1|sees_card]]' },
);
check('and its own unset placeholder is reported as its own', said('[[secret]]'), true);
check('its own default is', build({ a: '[[var1|sees_default]]' }, [{ var1: 'v' }, { secret: 'card' }]), { a: 'v-own' });
check('an argument wins over its default', build({ a: '[[var1|shout:#]]' }, [{ var1: 'hi' }]), { a: 'HI#' });
check('a named argument too', build({ a: '[[var1|shout:mark=#]]' }, [{ var1: 'hi' }]), { a: 'HI#' });

// Quoting (#398): a quoted argument keeps its commas and its spaces.
check('a quoted argument keeps a comma', build({ a: '[[var1|shout:", "]]' }, [{ var1: 'hi' }]), { a: 'HI, ' });
check('single quotes work too', build({ a: "[[var1|shout:mark=' !']]" }, [{ var1: 'hi' }]), { a: 'HI !' });
check('unquoted arguments are trimmed', functionArguments('a, b', ['x', 'y']), { values: [{ x: 'a' }, { y: 'b' }] });
check('a named and an unnamed one mix', functionArguments('y=2,1', ['x', 'y']), { values: [{ y: '2' }, { x: '1' }] });
check('an equals sign in quotes is not a name', functionArguments('"a=b"', ['x']), { values: [{ x: 'a=b' }] });
check('no argument gives no values', functionArguments(undefined, ['x']), { values: [] });
check('more unnamed arguments than parameters is refused', 'refused' in functionArguments('a,b', ['x']), true);
warnings.length = 0;
check('and the placeholder stays', build({ a: '[[var1|shout:a,b]]' }, [{ var1: 'hi' }]), { a: '[[var1|shout:a,b]]' });
check('saying why', said('takes at most 1 unnamed arguments'), true);

// Simple values only, and a number or a true goes in as one.
check('a number result goes in as a number', build({ a: '[[n|double]]' }, [{ n: 4 }]), { a: 8 });
check('inside text it is text', build({ a: 'x[[n|double]]' }, [{ n: 4 }]), { a: 'x8' });
check('a yes or no goes in as one', build({ a: '[[n|yes]]' }, [{ n: 'on' }]), { a: true });
warnings.length = 0;
check('a mapping result is refused', build({ a: '[[n|mapping]]' }, [{ n: 'x' }]), { a: '[[n|mapping]]' });
check('saying so', said('gave a mapping or a list'), true);

// Built-in steps always win.
warnings.length = 0;
const shadowed = functionTemplatesOf({ lower: { function: 'x' }, mine: { function: 'y' } });
functionTemplatesOf({ lower: { function: 'x' } });
check('a template named after a built-in step is not a function', [...shadowed.keys()], ['mine']);
check('the console says so once', warnings.filter((w) => w.includes('The template lower')).length, 1);
check('and the built-in step runs', build({ a: '[[n|upper]]' }, [{ n: 'x' }]), { a: 'X' });

// Recursion is refused, not a hang.
warnings.length = 0;
check('a function calling itself gives nothing', build({ a: '[[n|loop]]' }, [{ n: 'x' }]), { a: '[[n|loop]]' });
check('and says so', said('loop calls itself (loop > loop)'), true);
warnings.length = 0;
check('two calling each other too', build({ a: '[[n|ping]]' }, [{ n: 'x' }]), { a: '[[n|ping]]' });
check('naming the loop', said('ping > pong > ping'), true);

// An unknown step is still an unknown step.
warnings.length = 0;
check('a step that is no function is left as written', build({ a: '[[n|nope]]' }, [{ n: 'x' }]), { a: '[[n|nope]]' });
check('reported as an unknown step', said('"nope" is not a step this card knows'), true);
check('with no templates at all, the same', build({ a: '[[n|occ_sens]]' }, [{ n: 'x' }], {}), { a: '[[n|occ_sens]]' });
check('a near miss suggests the function', closestStep('occ_sen', ['occ_sens']), 'occ_sens');

// Inside an item template filled by with:, a function still works.
check('a function inside a with: fill', build({ rows: ['[[row|with:entity=frontdoor]]'] }), {
  rows: [{ entity: 'binary_sensor.frontdoor_cat_occupancy' }],
});

// A function template is a step, not a variable or an item.
check('a bare [[occ_sens]] is not its result', build({ a: '[[occ_sens?]]', b: 1 }), { b: 1 });

// itemTemplatesOf carries function templates, and notes their names for everything else.
const ll = { decluttering_templates: { occ_sens, plain: { card: { type: 'tile' } } }, views: [] };
check('the dashboard read offers function templates', Object.keys(itemTemplatesOf(ll)), ['occ_sens']);
check('and the step is known everywhere after', knownStep('occ_sens:cat'), true);
check('but no other name', knownStep('occ_senz'), false);
check('the autocomplete offers it', orderedSteps().includes('occ_sens'), true);
check('an explicit list wins over the noted one', knownStep('occ_sens', []), false);

// The lint.
const lint = (template, known, options) =>
  lintTemplate(template, known, options).map((f) => `${f.level} ${f.key} @${f.path}`);
check(
  'a card calling a function is not an unknown step',
  lint({ card: { entity: '[[room|occ_sens:cat]]' } }, ['room']),
  [],
);
check(
  'a step that is no function still is',
  lint({ card: { entity: '[[room|occ_senz]]' } }, ['room'], { functions: ['occ_sens'] }),
  ['warning lint.unknown_step @card.entity'],
);
check('a function template reads value and its parameters freely', lint(occ_sens), []);
check('its function: is linted', lint({ function: '[[value|slgu]]' }), ['warning lint.unknown_step @function']);
check('one named after a built-in step is warned about', lint({ function: '[[value]]' }, [], { name: 'upper' }), [
  'warning lint.function_shadowed @function',
]);
check('parameters: without function: is pointed out', lint({ parameters: ['a'], card: { type: 'tile' } }), [
  'info lint.parameters_without_function @parameters',
]);
check(
  'the placeholder tool lists what a function writes',
  listPlaceholders(occ_sens).includes('[[sensor_name|if:sensor_exists?]]'),
  true,
);

// Rebuilding: a function that asks Home Assistant makes the card that calls it ask too.
const card = { card: { entity: '[[room|occ_sens]]' } };
check('a function template is reached through its step', itemTemplatesReached(card, { occ_sens }).length, 1);
check('so a card calling one rebuilds on the registry', usesResolver(card, { occ_sens }), true);
check('but not a card that does not', usesResolver({ card: { entity: '[[room|upper]]' } }, { occ_sens }), false);

// The dashboard sweep: a function template used as a step is used.
const swept = (cards) =>
  checkDashboard({
    decluttering_templates: { occ_sens, tile: { card: { type: 'tile', entity: '[[room|occ_sens]]' } } },
    views: [{ cards }],
  }).unusedTemplates;
check(
  'a function called by a used template is not unused',
  swept([{ type: 'custom:decluttering-card-plus', template: 'tile', variables: [{ room: 'x' }] }]),
  [],
);
check(
  'one named after a built-in step is unused however often the step is written',
  checkDashboard({
    decluttering_templates: { upper: { function: 'x' }, tile: { card: { type: 'tile', name: '[[room|upper]]' } } },
    views: [{ cards: [{ type: 'custom:decluttering-card-plus', template: 'tile', variables: [{ room: 'x' }] }] }],
  }).unusedTemplates,
  ['upper'],
);
check(
  'one nothing calls is',
  checkDashboard({ decluttering_templates: { occ_sens }, views: [{ cards: [] }] }).unusedTemplates,
  ['occ_sens'],
);

// Sharing: a template that calls a function carries it under includes:.
const shared = buildExport(
  { template: 'tile', card: { type: 'tile', entity: '[[room|occ_sens:cat]]' } },
  { tile: { card: { type: 'tile', entity: '[[room|occ_sens:cat]]' } }, occ_sens, upper: { function: 'x' } },
);
check('the function goes along', Object.keys(shared.payload.includes ?? {}), ['occ_sens']);

// The CLI linter knows the dashboard's functions.
const cli = lintDashboard(
  {
    decluttering_templates: {
      occ_sens,
      tile: { card: { type: 'tile', entity: '[[room|occ_sens]]' } },
      upper: { function: 'x' },
    },
    views: [],
  },
  'dash.yaml',
).map((f) => f.message);
check(
  'the CLI calls no function step unknown',
  cli.some((m) => m.includes('occ_sens') && m.includes('not a')),
  false,
);
check(
  'and warns about the shadowed one',
  cli.some((m) => m.includes('upper has the name of a built-in step')),
  true,
);

setFunctionNames([]);
console.warn = realWarn;
