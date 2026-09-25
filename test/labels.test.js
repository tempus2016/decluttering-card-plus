/*
 * The label registry is not on hass (Home Assistant 2026.7 carries entities, devices,
 * areas and floors, but not labels), so labels.ts fetches it. Before it did, every label
 * showed by its id. Run with `npm test`.
 */
const { check, report } = require('./harness');
const { labelName, loadLabels, resetLabels } = require('../.test-build/labels.js');
const { resolveRegistryItems, registryKey } = require('../.test-build/registry.js');
const { applyTransform } = require('../.test-build/variables.js');

// hass as 2026.7 has it: labels on the entities, no label registry.
const hass = {
  entities: {
    'light.lamp': { entity_id: 'light.lamp', labels: ['living_room_lights'] },
    'light.other': { entity_id: 'light.other', labels: [] },
  },
  devices: {},
  areas: {},
  floors: {},
  states: { 'light.lamp': { attributes: {} }, 'light.other': { attributes: {} } },
};
let calls = 0;
const withWS = {
  ...hass,
  callWS: async (msg) => {
    calls += 1;
    if (msg.type !== 'config/label_registry/list') throw new Error('unexpected ' + msg.type);
    return [{ label_id: 'living_room_lights', name: 'Living room lights' }];
  },
};

(async () => {
  resetLabels();
  check(
    'before anything is fetched, a label is known only by its id',
    labelName(hass, 'living_room_lights'),
    'living_room_lights',
  );
  check(
    'and a repeat over labels names each copy by id',
    resolveRegistryItems(hass, { labels: true }).map((l) => l.name),
    ['living_room_lights'],
  );
  const keyBefore = registryKey(withWS);

  await loadLabels(withWS);
  check(
    'once fetched, the name is the one the interface shows',
    labelName(withWS, 'living_room_lights'),
    'Living room lights',
  );
  check(
    'a repeat over labels names each copy properly',
    resolveRegistryItems(withWS, { labels: true }).map((l) => l.name),
    ['Living room lights'],
  );
  check('the labels resolver says the name too', applyTransform('labels', 'light.lamp', withWS), 'Living room lights');
  check(
    'group_by label names its groups',
    resolveRegistryItems(withWS, { entities: 'light.*', group_by: 'label' }).map((g) => g.name),
    ['Living room lights'],
  );
  check(
    'a label filter matches the name as well as the id',
    resolveRegistryItems(withWS, { label: 'Living*' }).map((e) => e.entity),
    ['light.lamp'],
  );
  check('the fetch landing changes the registry key, so cards rebuild', registryKey(withWS)[4] !== keyBefore[4], true);

  await loadLabels(withWS);
  check('it is fetched once, not on every call', calls, 1);

  check('a label the registry does not know still shows its id', labelName(withWS, 'no_such_label'), 'no_such_label');

  const theirs = { ...hass, labels: { living_room_lights: { label_id: 'living_room_lights', name: 'From hass' } } };
  check('if hass ever carries the registry, that wins', labelName(theirs, 'living_room_lights'), 'From hass');

  resetLabels();
  const failing = {
    ...hass,
    callWS: async () => {
      throw new Error('nope');
    },
  };
  await loadLabels(failing);
  check('a failed fetch leaves the ids, as before', labelName(failing, 'living_room_lights'), 'living_room_lights');

  report();
})();
