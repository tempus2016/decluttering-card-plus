/*
 * #430: the card editor keeps each build until something it reads changes - the card, its
 * template, the dashboard, the registries, the language, or the state of an entity the card
 * rebuilds on. A state changing anywhere else keeps every build.
 */
const { check } = require('./check');
const { BuildCache, buildKey } = require('../.test-build/card-editor/build-cache');
const { shownDefaults } = require('../.test-build/card-editor/defaults');
const { withStateScope } = require('../.test-build/variables');

const config = { template: 't', variables: [{ camera: 'camera.front' }], rebuild_on: ['camera.front'] };
const template = {
  card: { type: 'tile', entity: '[[camera]]' },
  variables: [
    { name: 'camera', selector: { entity: {} } },
    { name: 'stream', default: '[[camera|attr:camera_name]]' },
  ],
};
const front = (name) => ({ entity_id: 'camera.front', state: 'idle', attributes: { camera_name: name } });
const lamp = (state) => ({ entity_id: 'light.lamp', state, attributes: {} });
const house = (camera, light) => ({
  states: { 'camera.front': camera, 'light.lamp': light },
  entities: {},
  config: {},
  language: 'en',
});

const cache = new BuildCache();
const scope = ['camera.front'];
const stream = (hass) =>
  cache.get('defaults', buildKey(hass, scope, config, template), () =>
    shownDefaults(['stream'], config.variables, template, withStateScope(hass, scope)).get('stream'),
  );

const camera = front('Front_Door');
const first = house(camera, lamp('off'));
check('the default reads the attribute of the entity rebuilt on', stream(first), 'Front_Door');
check('it was built once', cache.builds, 1);

// A lamp switching on somewhere else: a new hass and states, the camera's state object the same.
check(
  'an unrelated state changing keeps the build',
  stream({ ...first, states: { ...first.states, 'light.lamp': lamp('on') } }),
  'Front_Door',
);
check('and builds nothing', cache.builds, 1);

// The entity the card rebuilds on changing its attribute builds again, and the default follows.
const renamed = house(front('Back_Door'), lamp('on'));
check('an attr: default follows the rebuild_on entity it reads', stream(renamed), 'Back_Door');
check('which is one more build', cache.builds, 2);

// A new config, as every edit hands the editor, builds again.
check(
  'a new config is a new key',
  buildKey(renamed, scope, { ...config }, template).length === buildKey(renamed, scope, config, template).length &&
    cache.get('defaults', buildKey(renamed, scope, { ...config }, template), () => 'rebuilt'),
  'rebuilt',
);

// The registries and the language are read too.
check(
  'a registry changing builds again',
  cache.get('defaults', buildKey({ ...renamed, entities: {} }, scope, { ...config }, template), () => 'registry'),
  'registry',
);
check(
  'a change of language builds again',
  cache.get('defaults', buildKey({ ...renamed, language: 'fr' }, scope, { ...config }, template), () => 'fr'),
  'fr',
);

// A scope that grows to take in another entity builds again, even with every state the same.
check(
  'a different scope is a different key',
  cache.get('scope', buildKey(renamed, ['camera.front']), () => 'one') === 'one' &&
    cache.get('scope', buildKey(renamed, ['camera.front', 'light.lamp']), () => 'two'),
  'two',
);

cache.clear();
check('cleared, nothing is kept', cache.last('defaults'), undefined);
