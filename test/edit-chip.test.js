/*
 * Unit tests for the pure parts of src/edit-chip.ts (idea 47) and the source lookup in
 * src/templates.ts. The element itself is checked in a browser.
 */
const { chipLabel, copiesLabel, CHIP_TAG } = require('../.test-build/edit-chip-pure.js');
const { templateSourcePath } = require('../.test-build/templates.js');

const { check } = require('./check');

check('a local template is named alone', chipLabel('room_light_tile'), 'room_light_tile');
check(
  'a borrowed one carries its dashboard after a dot',
  chipLabel('room_light_tile', 'upstairs'),
  'room_light_tile · upstairs',
);
check(
  'a repeat says how many copies; a single card says nothing',
  [copiesLabel(4), copiesLabel(1), copiesLabel(undefined)],
  ['×4', '', ''],
);
check('the chip tag', CHIP_TAG, 'decluttering-card-plus-chip');

/* ------------------------------------------------------- where a template comes from */

const local = { decluttering_templates: { here: { card: {} } }, decluttering_templates_from: ['upstairs'], views: [] };
const upstairs = { decluttering_templates: { there: { card: {} } }, views: [] };
const hass = {
  callWS: (msg) =>
    Promise.resolve(msg.url_path === 'upstairs' ? upstairs : msg.url_path === null ? { views: [] } : null),
};

(async () => {
  check('a template defined here has no source', await templateSourcePath(hass, local, 'here'), undefined);
  check(
    'a borrowed template names the dashboard it comes from',
    await templateSourcePath(hass, local, 'there'),
    'upstairs',
  );
  check('a template nobody has is nowhere', await templateSourcePath(hass, local, 'nowhere'), undefined);
})();
