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
