/*
 * A variable that is a placeholder, with dotted names asked of it (#493): filling it in once
 * for those names built it again, and that build asked the same names and filled it in again,
 * one level deeper each time until the depth limit. Other placeholder values on the way doubled
 * it at every level, and a camera card took 15 seconds to build. The shape below is the
 * reporter's template cut down to what still did it. Counted by reads of hass.states, which
 * is the same on every machine, rather than timed.
 * Run with `npm test`.
 */
const { check } = require('./check.js');
const { buildThing, contentFor } = require('../.test-build/build.js');

const iand = {
  parameters: ['opt2'],
  defaults: { opt2: true, true_val: true, false_val: false },
  function: '[[true_val|if:value|if:opt2|or:false_val|bool]]',
};
const itemTemplates = {
  iand,
  more_info_popup: { item: '[[with_popup|if:show.popup_as_popup|or:no_popup]]' },
  camera_display_item: { item: '[[vert_stack|if:inc_vs|or:cam_card]]' },
};
const template = {
  defaults: {
    offer: { ha_exists: '[[ha_camera|exists]]' },
    _show: { ele_backup_disp: '[[has_ha_backup|iand:[[offer.ha_exists]]]]' },
    show: '[[_show|merge:debug]]',
  },
  variables: [
    { name: 'has_ha_backup', default: '[[default_use_ha]]' },
    { name: 'ha_camera', default: 'camera.[[ha_name]]_balanced' },
  ],
  card: '[[camera_display_item|with]]',
};

const build = (states, cardVariables) =>
  buildThing({
    variables: cardVariables,
    templateConfig: template,
    content: contentFor(template, []),
    templateName: 'camera_card',
    hass: { states },
    quiet: true,
    extras: { itemTemplates },
    instance: {},
    kind: 'card',
  });

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

const variables = [
  { default_use_ha: true },
  { ha_name: 'porch' },
  { cam_card: { type: 'markdown', content: '[[show.ele_backup_disp]]' } },
];

const missing = build(counted({}), variables);
check('a dotted name of a placeholder mapping still fills in when the camera is missing (#493)', missing, {
  type: 'markdown',
  content: false,
});
check('the mapping is filled in once, not again inside itself (#493)', reads <= 10, true);

reads = 0;
const there = build(
  counted({ 'camera.porch_balanced': { entity_id: 'camera.porch_balanced', state: 'idle' } }),
  variables,
);
check('and fills in true when the camera is there (#493)', there, { type: 'markdown', content: true });
check('the camera is looked up a handful of times, not hundreds (#493)', reads <= 10, true);
