/*
 * #373: an unset field in the card editor shows the default the card will be built with.
 * Pure: which value each unset variable shows, and when what comes back is still that value.
 */
const { check } = require('./check');
const { shownDefaults, filledDefault, isShownValue } = require('../.test-build/card-editor/defaults');
const { VIEW_VALUES } = require('../.test-build/variables');

const template = (variables, extra = {}) => ({ card: { type: 'tile', entity: '[[entity]]' }, variables, ...extra });
const shown = (...args) => Object.fromEntries(shownDefaults(...args));

const plain = template([
  { name: 'colour', selector: { select: { options: ['red', 'blue'] } }, default: 'red' },
  { name: 'size', selector: { number: {} }, default: 3 },
  { name: 'entity', selector: { entity: {} } },
]);

check('a declared default is shown, a variable with none is not', shown(['colour', 'size', 'entity'], [], plain), {
  colour: 'red',
  size: 3,
});
check('only the names asked about are shown', shown(['size'], [], plain), { size: 3 });
check('no template shows nothing', shown(['colour'], [], undefined), {});
check('a numeric default keeps its type', shownDefaults(['size'], [], plain).get('size'), 3);

// The older `default:` list counts as well as a declaration's own default.
check(
  'a default from the default: list is shown',
  shown(['colour'], [], template([{ name: 'colour', selector: { text: {} } }], { default: [{ colour: 'green' }] })),
  { colour: 'green' },
);

// A view's decluttering_defaults is nearer the card than the template, and the card builds with it.
const inView = template([{ name: 'colour', selector: { text: {} }, default: 'red' }]);
inView[VIEW_VALUES] = [{ colour: 'purple' }];
check('a view default beats the template default', shown(['colour'], [], inView), { colour: 'purple' });

// A default made from other variables is filled in from what the card holds now.
const computed = template([
  { name: 'room', selector: { text: {} } },
  { name: 'title', selector: { text: {} }, default: '[[room]] lights' },
  { name: 'count', selector: { number: {} }, default: '[[base]]' },
  { name: 'base', selector: { number: {} }, default: 4 },
]);
check('a computed default follows the variable it is made from', shown(['title'], [{ room: 'Kitchen' }], computed), {
  title: 'Kitchen lights',
});
check('and changes when that variable does', shown(['title'], [{ room: 'Hall' }], computed), { title: 'Hall lights' });
check('a computed default it cannot fill yet is left blank', shown(['title'], [], computed), {});
check(
  'a default that is one placeholder comes back as the value it stands for',
  shownDefaults(['count'], [], computed).get('count'),
  4,
);
check(
  'a default with a fallback fills in without the other variable',
  shown(['title'], [], template([{ name: 'title', selector: { text: {} }, default: '[[room|default:Home]] lights' }])),
  { title: 'Home lights' },
);

check('an empty default is not shown', shown(['colour'], [], template([{ name: 'colour', default: '' }])), {});
check('a default with no placeholders is handed back as it is', filledDefault({ a: 1 }, [], plain), { a: 1 });

check('the same value is still the shown one', isShownValue('red', 'red'), true);
check('a changed value is not', isShownValue('blue', 'red'), false);
check('a copy of a shown list is still the shown one', isShownValue(['a', 'b'], ['a', 'b']), true);
check('a changed list is not', isShownValue(['a'], ['a', 'b']), false);
check('a cleared field is not the shown value', isShownValue(undefined, 'red'), false);

// #404: a default made with an item template is filled in from the dashboard's item templates.
{
  const hass = {
    states: {
      'binary_sensor.porch_car_occupancy': {
        entity_id: 'binary_sensor.porch_car_occupancy',
        state: 'off',
        attributes: {},
      },
      'binary_sensor.porch_cat_occupancy': {
        entity_id: 'binary_sensor.porch_cat_occupancy',
        state: 'off',
        attributes: {},
      },
    },
    entities: {
      'binary_sensor.porch_car_occupancy': { entity_id: 'binary_sensor.porch_car_occupancy' },
      'binary_sensor.porch_cat_occupancy': { entity_id: 'binary_sensor.porch_cat_occupancy' },
    },
  };
  const itemTemplates = {
    detect_row: {
      default: { kind: '[[entity|object_id|replace:_occupancy|replace:porch_]]' },
      item: { type: '[[kind]]', entity: '[[entity]]' },
    },
    detect_list: {
      default: { filter: { entities: 'binary_sensor.porch_*_occupancy' } },
      item: ['[[detect_row|repeat:filter]]'],
    },
  };
  const tpl = template([
    { name: 'detections', selector: { object: { multiple: true } }, default: '[[detect_list|with]]' },
  ]);
  check('a with: default is left blank without the item templates', shown(['detections'], [], tpl, hass), {});
  check(
    'a with: default is filled in from the item templates (#404)',
    shown(['detections'], [], tpl, hass, { itemTemplates }),
    {
      detections: [
        { type: 'car', entity: 'binary_sensor.porch_car_occupancy' },
        { type: 'cat', entity: 'binary_sensor.porch_cat_occupancy' },
      ],
    },
  );
}

// #411: a default read from an entity's state is shown once the card rebuilds on that entity,
// the same as the card builds it - and left blank when it does not, as the card leaves it.
{
  const { withStateScope } = require('../.test-build/variables');
  const hass = { states: { 'camera.front': { state: 'idle', attributes: { camera_name: 'Front_Door' } } } };
  const camera = template([
    { name: 'camera', selector: { entity: {} } },
    { name: 'stream', default: '[[camera|attr:camera_name]]' },
    { name: 'zone', default: '[[stream|lower]]_zone' },
  ]);
  const card = [{ camera: 'camera.front' }];
  check(
    'an attr: default is blank when the card does not rebuild on the entity',
    shown(['stream', 'zone'], card, camera, hass),
    {},
  );
  check(
    'an attr: default is shown when the card rebuilds on the entity, and a default made from it follows',
    shown(['stream', 'zone'], card, camera, withStateScope(hass, ['camera.front'])),
    { stream: 'Front_Door', zone: 'front_door_zone' },
  );
}

/*
 * #255 (idea 18): Reset to default. A field the card sets, where something else would give
 * the variable a value, gets a Reset that takes the card's own line out - in whatever shape
 * the card wrote its variables - and says where the value it goes back to is written.
 */
{
  const {
    resetTarget,
    defaultTarget,
    resetVariable,
    withoutVariable,
    defaultText,
  } = require('../.test-build/card-editor/defaults');
  const { OWN_DEFAULTS, OUTER_LET } = require('../.test-build/variables');

  const tpl = template(
    [
      { name: 'entity', selector: { entity: {} } },
      { name: 'icon', selector: { icon: {} }, default: 'mdi:lightbulb' },
      { name: 'colour', selector: { text: {} } },
      { name: 'title', selector: { text: {} }, default: '[[room]] lights' },
      { name: 'room', selector: { text: {} } },
      { name: 'show', selector: { boolean: {} }, default: false },
    ],
    { default: [{ colour: 'amber' }] },
  );

  // What Reset removes, in each form a card can write its variables.
  check(
    'list form: reset takes out the line and nothing else',
    resetVariable({ type: 'x', template: 't', variables: [{ entity: 'light.a' }, { icon: 'mdi:x' }] }, 'icon'),
    { type: 'x', template: 't', variables: [{ entity: 'light.a' }] },
  );
  check(
    'list form: a line with two names keeps the other one',
    resetVariable({ type: 'x', variables: [{ entity: 'light.a', icon: 'mdi:x' }] }, 'icon').variables,
    [{ entity: 'light.a' }],
  );
  check(
    'list form: a name written twice goes both times',
    resetVariable({ type: 'x', variables: [{ icon: 'a' }, { room: 'Hall' }, { icon: 'b' }] }, 'icon').variables,
    [{ room: 'Hall' }],
  );
  check(
    'mapping form: reset takes out the key and the mapping stays a mapping',
    resetVariable({ type: 'x', variables: { entity: 'light.a', icon: 'mdi:x' } }, 'icon').variables,
    { entity: 'light.a' },
  );
  check(
    'resetting the last variable takes the variables key out, list form',
    'variables' in resetVariable({ type: 'x', variables: [{ icon: 'mdi:x' }] }, 'icon'),
    false,
  );
  check('and mapping form', 'variables' in resetVariable({ type: 'x', variables: { icon: 'mdi:x' } }, 'icon'), false);
  check(
    "a variable's dotted parts go with it, other names' stay",
    withoutVariable([{ style: { a: 1 } }, { 'style.b': 2 }, { 'styles.c': 3 }, { room: 'Hall' }], 'style'),
    [{ 'styles.c': 3 }, { room: 'Hall' }],
  );
  check(
    'the config itself is left alone',
    (() => {
      const config = { type: 'x', variables: [{ icon: 'mdi:x' }] };
      resetVariable(config, 'icon');
      return config;
    })(),
    { type: 'x', variables: [{ icon: 'mdi:x' }] },
  );

  // When a field gets a Reset, and what it goes back to.
  check('a set field with a declared default resets to the template', resetTarget('icon', [{ icon: 'mdi:x' }], tpl), {
    value: 'mdi:lightbulb',
    source: 'template',
  });
  check('a field the card does not set has no Reset', resetTarget('icon', [{ entity: 'light.a' }], tpl), undefined);
  check(
    'a set field nothing else gives a value has no Reset',
    resetTarget('entity', [{ entity: 'light.a' }], tpl),
    undefined,
  );
  check('the default: list is the template too', resetTarget('colour', { colour: 'red' }, tpl), {
    value: 'amber',
    source: 'template',
  });
  check(
    'mapping form is read the same as the list form',
    resetTarget('icon', { icon: 'mdi:x', entity: 'light.a' }, tpl),
    { value: 'mdi:lightbulb', source: 'template' },
  );
  check('a false default still has a Reset', resetTarget('show', [{ show: true }], tpl), {
    value: false,
    source: 'template',
  });
  check(
    'a computed default is handed back as written',
    resetTarget('title', [{ room: 'Hall' }, { title: 'Mine' }], tpl),
    { value: '[[room]] lights', source: 'template' },
  );
  check('no template, no Reset', resetTarget('icon', [{ icon: 'mdi:x' }], undefined), undefined);

  // The helper names the default before the card sets the field, so it does not appear on the first keystroke.
  check('an unset field still names its default', defaultTarget('icon', [{ entity: 'light.a' }], tpl), {
    value: 'mdi:lightbulb',
    source: 'template',
  });
  check('and with no variables at all', defaultTarget('icon', undefined, tpl), {
    value: 'mdi:lightbulb',
    source: 'template',
  });
  check('a set field names the same default', defaultTarget('icon', [{ icon: 'mdi:x' }], tpl), {
    value: 'mdi:lightbulb',
    source: 'template',
  });
  check('a field nothing gives a value names none', defaultTarget('entity', [{ entity: 'light.a' }], tpl), undefined);

  // Values from where the card sits.
  const inView = { ...tpl, [VIEW_VALUES]: [{ icon: 'mdi:sofa' }] };
  check(
    "a view's decluttering_defaults beat the template's and say so",
    resetTarget('icon', [{ icon: 'mdi:x' }], inView, {}),
    { value: 'mdi:sofa', source: 'view' },
  );
  check(
    "a section's say they are the section's",
    resetTarget('icon', [{ icon: 'mdi:x' }], inView, { section: [{ icon: 'mdi:sofa' }] }),
    { value: 'mdi:sofa', source: 'section' },
  );
  const shared = {
    ...tpl,
    variables: [...tpl.variables, { name: 'size' }],
    default: [{ colour: 'amber' }, { size: 'big' }],
  };
  shared[OWN_DEFAULTS] = [{ colour: 'amber' }];
  check(
    "a dashboard's decluttering_defaults, folded into the template's list, are the dashboard's",
    resetTarget('size', [{ size: 'small' }], shared, { dashboard: [{ size: 'big' }] }),
    { value: 'big', source: 'dashboard' },
  );
  check(
    "the library dashboard's, which the dashboard does not set, are the library's",
    resetTarget('size', [{ size: 'small' }], shared, { dashboard: [], library: [{ size: 'big' }] }),
    { value: 'big', source: 'library' },
  );
  check(
    "and the template's own are still the template's",
    resetTarget('colour', [{ colour: 'red' }], shared, { dashboard: [{ size: 'big' }] }).source,
    'template',
  );
  const lets = { ...tpl, [OUTER_LET]: [{ from: 'view_let', values: [{ room: 'Den' }] }] };
  check("a view's decluttering_let says it is the view's", resetTarget('room', [{ room: 'Hall' }], lets), {
    value: 'Den',
    source: 'view',
  });

  check('text: a word', defaultText('mdi:x'), 'mdi:x');
  check('text: false', defaultText(false), 'false');
  check('text: a number', defaultText(3), '3');
  check('text: a mapping as one line', defaultText({ a: 1, b: 'x' }), '{a: 1, b: x}');
  check('text: a list as one line', defaultText(['a', { b: 2 }]), '[a, {b: 2}]');
}
