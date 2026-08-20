/*
 * Unit tests for src/registry.ts - turning "every light in the kitchen" into the list of
 * copies a template is repeated over. Run with `npm test`.
 */
const {
  isRegistrySource,
  resolveRegistryItems,
  registryKey,
  registryNames,
  sameRegistry,
} = require('../.test-build/registry.js');

const { check, report } = require('./harness');

// A small house: two areas on one floor, one of them holding a lamp on a device.
const hass = {
  floors: {
    ground: { floor_id: 'ground', name: 'Ground floor' },
    upstairs: { floor_id: 'upstairs', name: 'Upstairs' },
  },
  areas: {
    kitchen: { area_id: 'kitchen', name: 'Kitchen', icon: 'mdi:silverware', floor_id: 'ground', labels: [] },
    bedroom: { area_id: 'bedroom', name: 'Bedroom', floor_id: 'upstairs', labels: ['quiet'] },
  },
  devices: {
    lamp_device: { id: 'lamp_device', area_id: 'bedroom', labels: ['night'] },
  },
  labels: {
    night: { label_id: 'night', name: 'Night light' },
    quiet: { label_id: 'quiet', name: 'Quiet' },
  },
  entities: {
    'light.kitchen_ceiling': { entity_id: 'light.kitchen_ceiling', area_id: 'kitchen', labels: [] },
    'light.bedside': { entity_id: 'light.bedside', device_id: 'lamp_device', labels: [] },
    'sensor.kitchen_temp': { entity_id: 'sensor.kitchen_temp', area_id: 'kitchen', labels: [] },
    'light.secret': { entity_id: 'light.secret', area_id: 'kitchen', labels: [], hidden: true },
  },
  states: {
    'light.kitchen_ceiling': { attributes: { friendly_name: 'Ceiling' } },
    'light.bedside': { attributes: { friendly_name: 'Bedside' } },
    'sensor.kitchen_temp': { attributes: { friendly_name: 'Kitchen temperature' } },
  },
};

const ids = (items) => items.map((item) => item.entity ?? item.area_id);

/* ------------------------------------------------------------- what is a source */

check('a mapping naming a source is one', isRegistrySource({ entities: 'light.*' }), true);

check('a mapping naming only a filter is still one', isRegistrySource({ label: 'night' }), true);

check('a list of written-out items is not one', isRegistrySource([{ entity: 'light.hall' }]), false);

check('a mapping of plain variables is not one', isRegistrySource({ entity: 'light.hall' }), false);

check('nothing at all is not one', [isRegistrySource(undefined), isRegistrySource('lights')], [false, false]);

/* --------------------------------------------------------------- entity sources */

check('every entity, sorted by the name shown', ids(resolveRegistryItems(hass, { entities: '*' })), [
  'light.bedside',
  'light.kitchen_ceiling',
  'sensor.kitchen_temp',
]);

check('a glob picks a domain out', ids(resolveRegistryItems(hass, { entities: 'light.*' })), [
  'light.bedside',
  'light.kitchen_ceiling',
]);

check('a domain filter does the same thing more plainly', ids(resolveRegistryItems(hass, { domain: 'light' })), [
  'light.bedside',
  'light.kitchen_ceiling',
]);

check(
  'an area filter matches by name as well as by id',
  ids(resolveRegistryItems(hass, { domain: 'light', area: 'Kitchen' })),
  ['light.kitchen_ceiling'],
);

check(
  'an entity inherits the area of its device',
  ids(resolveRegistryItems(hass, { domain: 'light', area: 'bedroom' })),
  ['light.bedside'],
);

check('a floor filter reaches entities through their area', ids(resolveRegistryItems(hass, { floor: 'Upstairs' })), [
  'light.bedside',
]);

check('a label on the device counts as a label on its entities', ids(resolveRegistryItems(hass, { label: 'night' })), [
  'light.bedside',
]);

check('a label matches by its name too', ids(resolveRegistryItems(hass, { label: 'Night light' })), ['light.bedside']);

check('a hidden entity is left out', ids(resolveRegistryItems(hass, { entities: 'light.secret' })), []);

check(
  'a list of patterns is the union of them',
  ids(resolveRegistryItems(hass, { entities: ['sensor.*', 'light.bedside'] })),
  ['light.bedside', 'sensor.kitchen_temp'],
);

check('matching nothing is an empty list, not a mistake', resolveRegistryItems(hass, { domain: 'vacuum' }), []);

check(
  'each copy carries the entity, its name, its domain and its area',
  resolveRegistryItems(hass, { entities: 'light.kitchen_ceiling' }),
  [{ entity: 'light.kitchen_ceiling', name: 'Ceiling', domain: 'light', area: 'Kitchen', area_id: 'kitchen' }],
);

check(
  'an entity in no area still produces a copy, with the area left empty',
  resolveRegistryItems({ entities: { 'light.loose': { entity_id: 'light.loose' } }, states: {} }, { domain: 'light' }),
  [{ entity: 'light.loose', name: 'light.loose', domain: 'light', area: '', area_id: '' }],
);

/* ----------------------------------------------------------------- area sources */

check('every area, sorted by name', ids(resolveRegistryItems(hass, { areas: true })), ['bedroom', 'kitchen']);

check('a star means the same as true', ids(resolveRegistryItems(hass, { areas: '*' })), ['bedroom', 'kitchen']);

check('areas can be picked by a pattern on their name', ids(resolveRegistryItems(hass, { areas: 'kitch*' })), [
  'kitchen',
]);

check('areas can be narrowed by floor', ids(resolveRegistryItems(hass, { areas: true, floor: 'ground' })), ['kitchen']);

check('areas can be narrowed by their own labels', ids(resolveRegistryItems(hass, { areas: true, label: 'quiet' })), [
  'bedroom',
]);

check('each area copy carries its id, name, icon and floor', resolveRegistryItems(hass, { areas: 'kitchen' }), [
  { area_id: 'kitchen', area: 'Kitchen', area_icon: 'mdi:silverware', floor: 'Ground floor' },
]);

check(
  'an area with no icon still produces a copy, with the icon left empty',
  resolveRegistryItems(hass, { areas: 'bedroom' }),
  [{ area_id: 'bedroom', area: 'Bedroom', area_icon: '', floor: 'Upstairs' }],
);

/* ------------------------------------------------------- when to work it out again */

check('the same registry is recognised as unchanged', sameRegistry(registryKey(hass), registryKey(hass)), true);

check(
  'a state change alone does not count as a registry change',
  sameRegistry(registryKey(hass), registryKey({ ...hass, states: { 'light.bedside': {} } })),
  true,
);

check(
  'a changed entity registry does count',
  sameRegistry(registryKey(hass), registryKey({ ...hass, entities: { ...hass.entities } })),
  false,
);

check('nothing to compare against is not a match', sameRegistry(undefined, registryKey(hass)), false);

/* --------------------------------------------------- what a source always supplies */

check('an entity source names what every copy gets', registryNames({ domain: 'light' }), [
  'entity',
  'name',
  'domain',
  'area',
  'area_id',
]);

check('an area source names its own set', registryNames({ areas: true }), ['area_id', 'area', 'area_icon', 'floor']);

check('something that is not a source supplies nothing', registryNames({ entity: 'light.hall' }), []);

report();
