/*
 * Unit tests for src/promote.ts - turning one setting of a template into a variable.
 * Run with `npm test`.
 */
const { listSettings, nameForSetting, namesInUse, promoteSetting } = require('../.test-build/promote.js');

const { check } = require('./check');

const tile = {
  template: 'room',
  card: {
    type: 'tile',
    entity: 'light.hall',
    name: '[[name]]',
    tap_action: { action: 'navigate', navigation_path: '/lights' },
    features: [{ type: 'light-brightness' }],
  },
};

check(
  'settings are the plain values, without types or placeholders',
  listSettings(tile.card).map((setting) => setting.label),
  ['entity', 'tap_action › action', 'tap_action › navigation_path'],
);

check(
  'list items are counted from one',
  listSettings({ type: 'entities', entities: ['light.a', { entity: 'light.b' }] }).map((setting) => setting.label),
  ['entities › #1', 'entities › #2 › entity'],
);

check(
  'a name comes from the key the value sits under',
  nameForSetting(['tap_action', 'navigation_path'], []),
  'navigation_path',
);
check('a list item is named for its list and place', nameForSetting(['entities', 0], []), 'entities_1');
check('a taken name is numbered', nameForSetting(['entity'], ['entity']), 'entity_2');

check('names in use include declared and used ones', namesInUse({ ...tile, variables: [{ name: 'colour' }] }).sort(), [
  'colour',
  'name',
]);

check('promoting replaces the value and declares it with the old value', promoteSetting(tile, ['entity'], 'light'), {
  ok: true,
  template: {
    ...tile,
    card: { ...tile.card, entity: '[[light]]' },
    variables: [{ name: 'light', type: 'entity', default: 'light.hall' }],
  },
});

check(
  'a value deep in the card is reached, the rest untouched',
  promoteSetting(tile, ['tap_action', 'navigation_path'], 'path').template.card.tap_action,
  { action: 'navigate', navigation_path: '[[path]]' },
);

check(
  'a number keeps its type in the default',
  promoteSetting({ card: { type: 'gauge', min: 0 } }, ['min'], 'low').template.variables,
  [{ name: 'low', type: 'number', default: 0 }],
);

check(
  'existing declarations are kept',
  promoteSetting({ ...tile, variables: [{ name: 'a' }] }, ['entity'], 'light').template.variables.length,
  2,
);

check(
  'a group template is promoted inside its group',
  promoteSetting({ group: [{ type: 'tile', entity: 'light.a' }] }, [0, 'entity'], 'e').template.group,
  [{ type: 'tile', entity: '[[e]]' }],
);

check('a taken name is refused', promoteSetting(tile, ['entity'], 'name'), { ok: false, error: 'name_taken' });
check('a name with a space is refused', promoteSetting(tile, ['entity'], 'my light'), {
  ok: false,
  error: 'name_invalid',
});
check('a path that is gone is refused', promoteSetting(tile, ['nothing'], 'x'), { ok: false, error: 'gone' });
check('the original is not mutated', tile.card.entity, 'light.hall');

check(
  'a template declaring by mapping keeps the mapping when a setting is promoted',
  promoteSetting({ variables: { colour: 'red' }, card: { type: 'gauge', min: 0 } }, ['min'], 'low').template.variables,
  { colour: 'red', low: { type: 'number', default: 0 } },
);
check('a mapping declaration counts as a name in use', namesInUse({ variables: { colour: 'red' } }), ['colour']);
