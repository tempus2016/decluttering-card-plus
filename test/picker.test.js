const { entitySuggestions } = require('../.test-build/picker.js');
const { check, report } = require('./harness');

const hass = {
  entities: {
    'camera.garden': { entity_id: 'camera.garden', platform: 'frigate', area_id: 'garden' },
    'camera.hall': { entity_id: 'camera.hall', platform: 'generic', area_id: 'hall' },
    'light.garden': { entity_id: 'light.garden', platform: 'hue', area_id: 'garden' },
  },
  areas: { garden: { area_id: 'garden', name: 'Garden' }, hall: { area_id: 'hall', name: 'Hall' } },
  devices: {},
  states: {},
};

const TEMPLATES = {
  any_camera: { suggest_for: { domain: 'camera' }, card: { type: 'picture-entity', entity: '[[entity]]' } },
  garden_camera: { suggest_for: { domain: 'camera', area: 'Garden' }, card: { type: 'picture-entity' } },
  not_frigate: { suggest_for: { domain: 'camera', exclude: { integration: 'frigate' } }, card: { type: 'tile' } },
  camera_badge: { suggest_for: { domain: 'camera' }, badge: { type: 'entity' } },
  never_offered: { card: { type: 'tile' } },
};
const TYPE = 'custom:decluttering-card-plus';
const names = (entityId, kind = 'card') =>
  entitySuggestions(hass, entityId, TEMPLATES, kind, TYPE).map((suggestion) => suggestion.label);

check('a template is offered for the entities it names, by name', names('camera.garden'), [
  'any_camera',
  'garden_camera',
]);
check('the narrower filters and exclude are honoured', names('camera.hall'), ['any_camera', 'not_frigate']);
check('an entity nothing is meant for gets nothing', names('light.garden'), []);
check('a badge template is only offered as a badge', names('camera.hall', 'badge'), ['camera_badge']);
check(
  'the suggestion is a ready card with the entity filled in',
  entitySuggestions(hass, 'camera.hall', TEMPLATES, 'card', TYPE)[0],
  {
    label: 'any_camera',
    config: { type: TYPE, template: 'any_camera', variables: [{ entity: 'camera.hall' }] },
  },
);
check(
  'a suggest_for that is not a mapping offers nothing',
  entitySuggestions(hass, 'camera.hall', { odd: { suggest_for: 'camera', card: {} } }, 'card', TYPE),
  [],
);

report();
