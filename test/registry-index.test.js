/*
 * Unit tests for src/registry-index.ts (idea 11): one lookup table per registry, read by the
 * resolvers and the repeat filters instead of walking entity, device and area each time.
 */
const { registryIndex, registryIndexBuilds, registryKey, sameRegistry } = require('../.test-build/registry-index.js');
const { applyTransform } = require('../.test-build/variables.js');
const { resolveRegistryItems } = require('../.test-build/registry.js');
const { check } = require('./check');

function house() {
  let deviceReads = 0;
  const devices = new Proxy(
    {
      dev1: { id: 'dev1', name: 'Lamp Module', area_id: 'hall', labels: ['upstairs'] },
      dev2: { id: 'dev2', area_id: 'kitchen' },
    },
    {
      get(target, key) {
        deviceReads += 1;
        return target[key];
      },
    },
  );
  const hass = {
    states: {
      'light.hall': { attributes: { friendly_name: 'Hall' } },
      'light.kitchen': { attributes: { friendly_name: 'Kitchen' } },
    },
    entities: {
      'light.hall': { device_id: 'dev1', labels: ['evening'] },
      'light.kitchen': { area_id: 'kitchen', device_id: 'dev2' },
      'sensor.lonely': {},
    },
    devices,
    areas: {
      hall: { area_id: 'hall', name: 'Hallway', floor_id: 'up' },
      kitchen: { area_id: 'kitchen', name: 'Kitchen', floor_id: 'down' },
    },
    floors: { up: { floor_id: 'up', name: 'Upstairs' }, down: { floor_id: 'down', name: 'Downstairs' } },
  };
  return { hass, reads: () => deviceReads };
}

{
  const { hass, reads } = house();
  const index = registryIndex(hass);
  check(
    'an entity with no area of its own takes its device area',
    index.areaOfEntity.get('light.hall').name,
    'Hallway',
  );
  check('an entity with its own area keeps it', index.areaOfEntity.get('light.kitchen').name, 'Kitchen');
  check('an entity in no area is not in the table', index.areaOfEntity.has('sensor.lonely'), false);
  check('a floor is found from the area', index.floorOfArea.get('hall').name, 'Upstairs');
  check('labels are the entity own then the device', index.labelsOfEntity.get('light.hall'), ['evening', 'upstairs']);
  check('an entity with no labels has an empty list', index.labelsOfEntity.get('sensor.lonely'), []);
  check('the same hass gives the same table', registryIndex(hass) === index, true);
  const afterBuild = reads();
  const builds = registryIndexBuilds();
  for (let i = 0; i < 200; i += 1) {
    applyTransform('area', 'light.hall', hass);
    applyTransform('floor', 'light.hall', hass);
    applyTransform('device', 'light.hall', hass);
  }
  check('two hundred resolutions read the devices registry no more than the build did', reads(), afterBuild);
  check('and build no new table', registryIndexBuilds(), builds);
  check('area still resolves', applyTransform('area', 'light.hall', hass), 'Hallway');
  check('floor still resolves', applyTransform('floor', 'light.kitchen', hass), 'Downstairs');
  check('device still resolves', applyTransform('device', 'light.hall', hass), 'Lamp Module');
  check('area_id still resolves', applyTransform('area_id', 'light.hall', hass), 'hall');
}

{
  const { hass } = house();
  registryIndex(hass);
  const builds = registryIndexBuilds();
  // A state change replaces hass but not the registries: no rebuild.
  const ticked = { ...hass, states: { ...hass.states } };
  registryIndex(ticked);
  check('a state change does not rebuild the table', registryIndexBuilds(), builds);
  // A registry change replaces the entities object: one rebuild.
  const changed = { ...hass, entities: { ...hass.entities, 'light.new': { area_id: 'hall' } } };
  check('a new entity is in the rebuilt table', registryIndex(changed).areaOfEntity.get('light.new').name, 'Hallway');
  check('which was built once', registryIndexBuilds(), builds + 1);
  check('registryKey compares entry by entry', sameRegistry(registryKey(hass), registryKey(ticked)), true);
  check('and tells a registry change apart', sameRegistry(registryKey(hass), registryKey(changed)), false);
}

{
  const { hass } = house();
  const ids = resolveRegistryItems(hass, { domain: 'light', area: 'Hallway' }).map((item) => item.entity);
  check('a repeat narrowed by area reads the same table', ids, ['light.hall']);
  const byLabel = resolveRegistryItems(hass, { domain: 'light', label: 'upstairs' }).map((item) => item.entity);
  check('a repeat narrowed by a device label finds the device entity', byLabel, ['light.hall']);
  const byFloor = resolveRegistryItems(hass, { entities: true, group_by: 'floor' }).map(
    (group) => group.floor ?? group.name,
  );
  check('group_by floor names the floors', byFloor.sort(), ['Downstairs', 'Upstairs']);
}
