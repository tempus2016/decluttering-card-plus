/*
 * Unit tests for a function template (#307) written as a template card, and for the tools
 * that try a placeholder - the template editor's and the debug report's - running function
 * steps. Run with `npm test`.
 */
const deepReplace = require('../.test-build/deep-replace.js').default;
const {
  collectUsages,
  collectTemplates,
  isStepOnlyTemplate,
  itemTemplatesOf,
  totalUsages,
} = require('../.test-build/templates.js');
const { firstRowUnset, tryPlaceholderIn } = require('../.test-build/playground.js');
const { tryInReport } = require('../.test-build/report-try.js');
const { check } = require('./check');

console.warn = () => {};

// The tester's config: a function template written as a template card, and one using it.
const occCard = {
  type: 'custom:decluttering-template-plus',
  template: 'occ_sens',
  parameters: ['detect_type'],
  default: [{ detect_type: 'car' }],
  function: '[[value|lower|prefix:binary_sensor.]]_[[detect_type]]_occupancy',
};
const usesCard = {
  type: 'custom:decluttering-template-plus',
  template: 'uses',
  card: { type: 'markdown', content: 'ok [[room|occ_sens:cat]] and [[room|occ_sens]]' },
};
const ll = {
  views: [
    {
      title: 'T',
      cards: [
        occCard,
        usesCard,
        { type: 'custom:decluttering-card-plus', template: 'uses', variables: [{ room: 'FrontDoor' }] },
        { type: 'custom:decluttering-card-plus', template: 'uses', variables: [{ room: '[[who|occ_sens]]' }] },
      ],
    },
  ],
};

check('a function template has nothing to show', isStepOnlyTemplate(occCard), true);
check('an item template has nothing to show', isStepOnlyTemplate({ item: { entity: '[[e]]' } }), true);
check(
  'a function that also defines a card has one',
  isStepOnlyTemplate({ function: '[[value]]', card: { type: 'markdown' } }),
  false,
);
check('a card template is not step-only', isStepOnlyTemplate({ card: { type: 'markdown' } }), false);
check('nothing is not step-only', isStepOnlyTemplate(undefined), false);

check(
  'a template card holding a function puts it in the dashboard templates',
  Object.keys(collectTemplates(ll)).sort(),
  ['occ_sens', 'uses'],
);
check('and among the templates a build calls as steps', 'occ_sens' in itemTemplatesOf(ll), true);

const built = deepReplace(
  [{ room: 'FrontDoor' }],
  collectTemplates(ll).uses,
  usesCard.card,
  'uses',
  { states: {} },
  true,
  undefined,
  0,
  undefined,
  undefined,
  false,
  { itemTemplates: itemTemplatesOf(ll) },
);
check(
  'a card elsewhere calls the function defined in the template card',
  built.content,
  'ok binary_sensor.frontdoor_cat_occupancy and binary_sensor.frontdoor_car_occupancy',
);

// Where used: called as a step by one template and by one card's variables.
check('a function is used where it is called as a step', collectUsages(ll, 'occ_sens'), {
  views: [{ title: 'T', path: '', index: 0, count: 1 }],
  templates: ['uses'],
});
check('and the count says so', totalUsages(ll, 'occ_sens'), 2);
check('a card template still counts the cards naming it', totalUsages(ll, 'uses'), 2);
check(
  'a step named like a template that is not a function is no use of it',
  totalUsages(
    {
      views: [
        {
          cards: [
            {
              type: 'custom:decluttering-template-plus',
              template: 'x',
              card: { type: 'markdown', content: '[[a|uses]]' },
            },
          ],
        },
      ],
    },
    'uses',
  ),
  0,
);
check(
  'a longer step name that starts the same is not a call',
  totalUsages(
    {
      views: [
        {
          cards: [
            occCard,
            {
              type: 'custom:decluttering-template-plus',
              template: 'x',
              card: { type: 'markdown', content: '[[a|occ_sens_b]]' },
            },
          ],
        },
      ],
    },
    'occ_sens',
  ),
  0,
);

// The template editor's placeholder tool: the dashboard's templates handed in.
const lamp = { template: 'lamp', default: [{ room: 'Hall' }], card: { type: 'markdown', content: '[[room|upper]]' } };
const extras = { itemTemplates: itemTemplatesOf(ll) };
const tried = tryPlaceholderIn(lamp, [{ room: 'Hall' }], '[[room|upper|occ_sens]]', { states: {} }, extras);
check(
  'the placeholder tool runs a function step',
  tried.steps.map((s) => [s.step, s.value, s.kind]),
  [
    ['room', 'Hall', 'text'],
    ['upper', 'HALL', 'text'],
    ['occ_sens', 'binary_sensor.hall_car_occupancy', 'text'],
  ],
);
check(
  'with its argument too',
  tryPlaceholderIn(lamp, [{ room: 'Hall' }], '[[room|occ_sens:cat]]', {}, extras).whole.value,
  'binary_sensor.hall_cat_occupancy',
);
const without = tryPlaceholderIn(lamp, [{ room: 'Hall' }], '[[room|upper|occ_sens]]', { states: {} });
check('without the templates the step is left as written', without.whole.kind, 'unresolved');
check(
  'a set variable is not called unset because a later step refused',
  firstRowUnset(without.steps[0], without),
  false,
);
const unset = tryPlaceholderIn(lamp, [], '[[ghost|upper]]', { states: {} }, extras);
check('a variable nothing sets still is', firstRowUnset(unset.steps[0], unset), true);
check(
  'with: finds its item template in the tool',
  tryPlaceholderIn(lamp, [], '[[row|with:e=light.a]]', {}, { itemTemplates: { row: { item: { entity: '[[e]]' } } } })
    .whole.value,
  { entity: 'light.a' },
);

// The debug report's box runs a placeholder through the build's own call, extras and all.
const scope = {
  label: 'card',
  evaluate: (content, onMissing, values) =>
    deepReplace(
      values ?? [{ room: 'FrontDoor' }],
      {},
      content,
      undefined,
      {},
      true,
      onMissing,
      0,
      undefined,
      undefined,
      false,
      extras,
    ),
  offered: [],
};
check(
  'the report box runs a function step',
  tryInReport(scope, '[[room|occ_sens:cat]]', [], false).whole.value,
  'binary_sensor.frontdoor_cat_occupancy',
);
