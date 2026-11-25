/*
 * A variable that is a placeholder, filled in for its dotted names, and a name asked of it
 * that the mapping does not have (#497): every item template's build inside the card filled
 * it in again to look, and a camera card asking `show.ha_cam` of a mapping with `cam_ha`
 * took 29 seconds. Filled in once by the card, a build further in now takes what that fill
 * gave. Counted by reads of hass.states, the same on every machine, rather than timed.
 * Run with `npm test`.
 */
const { check } = require('./check.js');
const { buildThing, contentFor } = require('../.test-build/build.js');

const itemTemplates = {
  camera: { item: { camera_entity: '[[entity]]', backup: '[[ha_block|if:show.ha_cam?]]' } },
  cameras: { item: '[[camera|repeat:entities]]' },
};
const template = {
  defaults: {
    _show: { cam_ha: '[[ha_camera|exists]]', live: true },
    show: '[[_show|merge:debug]]',
    ha_block: 'backup',
    entities: [{ entity: 'camera.a' }, { entity: 'camera.b' }, { entity: 'camera.c' }, { entity: 'camera.d' }],
  },
  card: {
    type: 'custom:camera',
    cameras: '[[cameras|with]]',
    live: '[[show.live]]',
    ha: '[[show.cam_ha]]',
  },
};

let reads = 0;
const counted = (states) =>
  new Proxy(states, {
    get: (target, key) => {
      reads += 1;
      return target[key];
    },
    has: (target, key) => {
      reads += 1;
      return key in target;
    },
    getOwnPropertyDescriptor: (target, key) => {
      reads += 1;
      return Reflect.getOwnPropertyDescriptor(target, key);
    },
  });

const build = (states, variables) =>
  buildThing({
    variables,
    templateConfig: template,
    content: contentFor(template, []),
    templateName: 'camera_card',
    hass: { states: counted(states) },
    quiet: true,
    extras: { itemTemplates },
    instance: {},
    kind: 'card',
  });

const camera = (id) => [id, { entity_id: id, state: 'idle' }];
const built = build(Object.fromEntries([camera('camera.porch')]), [{ ha_camera: 'camera.porch' }]);
check('the card is built as before (#497)', built, {
  type: 'custom:camera',
  cameras: [
    { camera_entity: 'camera.a' },
    { camera_entity: 'camera.b' },
    { camera_entity: 'camera.c' },
    { camera_entity: 'camera.d' },
  ],
  live: true,
  ha: true,
});
check('the mapping is filled in once for the card, not again in each copy (#497)', reads, 1);

// A `with:` that sets a value the mapping is made from fills it in itself, and finds a name only it gives.
reads = 0;
const inner = {
  defaults: { _show: { cam_ha: '[[ha_camera|exists]]' }, show: '[[_show|merge:debug]]', debug: {} },
  card: { outer: '[[show.cam_ha]]', inner: '[[box|with:inner_values]]' },
};
const own = buildThing({
  variables: [{ ha_camera: 'camera.porch' }, { inner_values: { debug: { shown: 'yes' } } }],
  templateConfig: inner,
  content: contentFor(inner, []),
  templateName: 'own',
  hass: { states: counted(Object.fromEntries([camera('camera.porch')])) },
  quiet: true,
  extras: { itemTemplates: { box: { item: { shown: '[[show.shown]]' } } } },
  instance: {},
  kind: 'card',
});
check('a with: that changes what the mapping is made from still gets its own answer (#497)', own, {
  outer: true,
  inner: { shown: 'yes' },
});
