const { entitySuggestions, publishTag, publishedTemplates, publishedStub } = require('../.test-build/picker.js');
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

/* ----------------------------------------------------------- published templates */

check('a template name becomes a valid element name', publishTag('My Camera!'), 'decluttering-card-plus--my-camera');
check('a name with nothing usable in it still gets one', publishTag('!!!'), 'decluttering-card-plus--template');

const PUBLISHED = publishedTemplates({
  house_light: { publish: true, description: 'A light tile', card: { type: 'tile' } },
  'House Light': { publish: 'The other light', card: { type: 'tile' } },
  'house-light': { publish: true, card: { type: 'tile' } },
  quiet_badge: { publish: true, badge: { type: 'entity' } },
  a_row: { publish: true, row: { entity: 'light.a' } },
  not_asked: { card: { type: 'tile' } },
  blank: { publish: '  ', card: { type: 'tile' } },
});
const each = (key) => PUBLISHED.map((p) => p[key]);
check('only templates that ask, and only cards and badges, are listed', each('template'), [
  'House Light',
  'house-light',
  'house_light',
  'quiet_badge',
]);
check('a string names the entry, true uses the template name', each('name'), [
  'The other light',
  'house-light',
  'house_light',
  'quiet_badge',
]);
check('two names that make the same element name are told apart', each('tag'), [
  'decluttering-card-plus--house-light',
  'decluttering-card-plus--house-light-2',
  'decluttering-card-plus--house_light',
  'decluttering-card-plus--quiet_badge',
]);
check('a badge is listed as a badge', PUBLISHED[3].kind, 'badge');
check('the description comes along', PUBLISHED[2].description, 'A light tile');

const stateful = { ...hass, states: { 'camera.hall': {}, 'camera.garden': {}, 'light.garden': {} } };
check(
  'a published card starts as the template and nothing else',
  publishedStub(stateful, 'plain', { card: {} }, TYPE),
  {
    type: TYPE,
    template: 'plain',
  },
);
check(
  'with suggest_for it starts with the first matching entity filled in',
  publishedStub(stateful, 'any_camera', TEMPLATES.any_camera, TYPE),
  { type: TYPE, template: 'any_camera', variables: [{ entity: 'camera.garden' }] },
);
check(
  'and with nothing matching, without one',
  publishedStub(stateful, 'x', { suggest_for: { domain: 'vacuum' }, card: {} }, TYPE),
  { type: TYPE, template: 'x' },
);

report();
