/* eslint-disable @typescript-eslint/no-explicit-any */

import { labelRegistry } from './labels';
import { categoryRegistry } from './categories';

/*
 * One lookup table over the registries (idea 11). `[[entity|area]]` used to find the
 * entity, then its device, then the device's area, and `floor` one step further - cheap
 * each, but a repeat over two hundred entities whose template reads area, floor, device
 * and labels did it eight hundred times a build, and once more on every rebuild. The
 * registries change about as often as the dashboard does, so the table is built once per
 * registry and every resolver and repeat on the page reads from it.
 *
 * Keyed the way `_resolveFromRegistry` already decides whether to work a repeat out again:
 * Home Assistant replaces `hass.entities` and friends as whole objects only when a registry
 * changes, so comparing them by identity is what tells a lamp being added from a lamp being
 * switched on. `hass.states` is not in the key: it changes every second and nothing here
 * reads it.
 */

export interface RegistryIndex {
  /** The area an entity is in: its own, or its device's when it has none of its own. */
  areaOfEntity: Map<string, any>;
  /** An area's floor. */
  floorOfArea: Map<string, any>;
  /** The device an entity belongs to. */
  deviceOfEntity: Map<string, any>;
  /** The label ids on an entity and on its device, the device's after the entity's own. */
  labelsOfEntity: Map<string, string[]>;
}

/**
 * What the resolved list depends on, for deciding whether to work it out again. hass is
 * replaced on every state change, many times a second, but these collections are replaced
 * only when the registry itself changes - so comparing them is the difference between
 * rebuilding a card when a lamp is added and rebuilding it when a lamp is switched on.
 */
export function registryKey(hass: any): unknown[] {
  // The label registry is fetched rather than carried on hass - see labels.ts - so it is part
  // of the key: the fetch landing is what turns label ids into names on screen.
  // Categories likewise, fetched by categories.ts for the cards that narrow by one.
  return [hass?.entities, hass?.devices, hass?.areas, hass?.floors, labelRegistry(hass), categoryRegistry()];
}

/** Whether two registry keys describe the same registry, compared entry by entry. */
export function sameRegistry(a: unknown[] | undefined, b: unknown[]): boolean {
  return !!a && a.length === b.length && a.every((value, index) => value === b[index]);
}

let builtFor: unknown[] | undefined;
let index: RegistryIndex | undefined;
// How many times the table has been built since the page loaded - what the tests count.
let builds = 0;

function build(hass: any): RegistryIndex {
  const entities: Record<string, any> = hass?.entities ?? {};
  const devices: Record<string, any> = hass?.devices ?? {};
  const areas: Record<string, any> = hass?.areas ?? {};
  const floors: Record<string, any> = hass?.floors ?? {};
  const areaOfEntity = new Map<string, any>();
  const deviceOfEntity = new Map<string, any>();
  const labelsOfEntity = new Map<string, string[]>();
  for (const [id, entity] of Object.entries(entities)) {
    const device = entity?.device_id ? devices[entity.device_id] : undefined;
    if (device) deviceOfEntity.set(id, device);
    const areaId = entity?.area_id ?? device?.area_id;
    const area = areaId ? areas[areaId] : undefined;
    if (area) areaOfEntity.set(id, area);
    // A label is usually put on the device rather than on each of its entities, so both
    // count - otherwise "everything labelled upstairs" would miss almost everything.
    labelsOfEntity.set(id, [...(entity?.labels ?? []), ...(device?.labels ?? [])]);
  }
  const floorOfArea = new Map<string, any>();
  for (const [id, area] of Object.entries(areas)) {
    const floor = area?.floor_id ? floors[area.floor_id] : undefined;
    if (floor) floorOfArea.set(id, floor);
  }
  return { areaOfEntity, floorOfArea, deviceOfEntity, labelsOfEntity };
}

/** The lookup table for this hass's registries, built once per registry and shared by every card. */
export function registryIndex(hass: any): RegistryIndex {
  const key = registryKey(hass);
  if (index && sameRegistry(builtFor, key)) return index;
  index = build(hass);
  builtFor = key;
  builds += 1;
  return index;
}

/** How many times the table has been built since the page loaded. For tests. */
export function registryIndexBuilds(): number {
  return builds;
}
