/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * Repeating a template over a written-out list means the dashboard stops being true the
 * moment a lamp is added. Home Assistant already knows what exists - its areas, its
 * entities, and the labels put on them - so a card can ask for "every light in the
 * kitchen" and grow by itself.
 */

/** What to repeat over. `areas` and `entities` choose the kind of copy; the rest narrow. */
export interface RegistrySource {
  /** Repeat over areas. `true` or `'*'` for all of them, or patterns to pick some. */
  areas?: boolean | string | string[];
  /** Repeat over entities, matching these entity id patterns. Defaults to all of them. */
  entities?: boolean | string | string[];
  /** Narrows to entities of these domains. */
  domain?: string | string[];
  /** Narrows to these areas, by area id or by name. */
  area?: string | string[];
  /** Narrows to these floors, by floor id or by name. */
  floor?: string | string[];
  /** Narrows to things carrying these labels, by label id or by name. */
  label?: string | string[];
}

const SOURCE_KEYS = ['areas', 'entities', 'domain', 'area', 'floor', 'label'];

/** Whether a `for_each_from:` value is a description of what to repeat over. */
export function isRegistrySource(value: any): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return SOURCE_KEYS.some((key) => value[key] !== undefined);
}

function asList(value: boolean | string | string[] | undefined): string[] | undefined {
  if (value === undefined || value === false) return undefined;
  // `areas: true` is every area, which is the same as asking for the pattern that matches
  // everything - so both spellings take the same path.
  if (value === true) return ['*'];
  const list = (Array.isArray(value) ? value : [value]).filter((item) => typeof item === 'string');
  return list.length ? list : undefined;
}

/** One pattern with `*` standing for anything, anchored, matched without regard to case. */
function matches(value: string | undefined | null, patterns: string[]): boolean {
  if (value === undefined || value === null) return false;
  const text = String(value).toLowerCase();
  return patterns.some((pattern) => {
    const source = pattern
      .toLowerCase()
      .split('*')
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('.*');
    return new RegExp(`^${source}$`).test(text);
  });
}

/** Matches when any spelling of a thing matches any pattern. No patterns narrows nothing. */
function matchesAny(values: (string | undefined | null)[], patterns: string[] | undefined): boolean {
  if (!patterns) return true;
  return values.some((value) => matches(value, patterns));
}

function areaOf(hass: any, entity: any): any {
  const areaId = entity?.area_id ?? hass?.devices?.[entity?.device_id]?.area_id;
  return areaId ? hass?.areas?.[areaId] : undefined;
}

function labelsOf(hass: any, entity: any): string[] {
  // A label is usually put on the device rather than on each of its entities, so both
  // count - otherwise "everything labelled upstairs" would miss almost everything.
  const device = hass?.devices?.[entity?.device_id];
  return [...(entity?.labels ?? []), ...(device?.labels ?? [])];
}

/** A label matches by its id or by the name shown in the interface. */
function labelMatches(hass: any, labels: string[], patterns: string[] | undefined): boolean {
  if (!patterns) return true;
  return labels.some((id) => matchesAny([id, hass?.labels?.[id]?.name], patterns));
}

function floorMatches(hass: any, area: any, patterns: string[] | undefined): boolean {
  if (!patterns) return true;
  const floor = area?.floor_id ? hass?.floors?.[area.floor_id] : undefined;
  return matchesAny([area?.floor_id, floor?.name], patterns);
}

function nameOf(hass: any, entityId: string, entity: any): string {
  return hass?.states?.[entityId]?.attributes?.friendly_name ?? entity?.name ?? entity?.original_name ?? entityId;
}

/*
 * Sorted by what is shown and then by id, so the order is the one a person would expect
 * and never depends on the order the registry happened to hand things over in.
 */
function byName(a: Record<string, any>, b: Record<string, any>): number {
  const shown = (item: Record<string, any>): string => String(item.name ?? item.area ?? '');
  const id = (item: Record<string, any>): string => String(item.entity ?? item.area_id ?? '');
  return shown(a).localeCompare(shown(b)) || id(a).localeCompare(id(b));
}

function areaItems(hass: any, source: RegistrySource): Record<string, any>[] {
  const patterns = asList(source.areas);
  const items: Record<string, any>[] = [];

  for (const area of Object.values(hass?.areas ?? {}) as any[]) {
    if (!matchesAny([area.area_id, area.name], patterns)) continue;
    if (!matchesAny([area.area_id, area.name], asList(source.area))) continue;
    if (!floorMatches(hass, area, asList(source.floor))) continue;
    if (!labelMatches(hass, area.labels ?? [], asList(source.label))) continue;

    const floor = area.floor_id ? hass?.floors?.[area.floor_id] : undefined;
    items.push({
      area_id: area.area_id,
      area: area.name ?? area.area_id,
      area_icon: area.icon ?? '',
      floor: floor?.name ?? '',
    });
  }
  return items.sort(byName);
}

function entityItems(hass: any, source: RegistrySource): Record<string, any>[] {
  const patterns = asList(source.entities);
  const domains = asList(source.domain);
  const areas = asList(source.area);
  const floors = asList(source.floor);
  const labels = asList(source.label);
  const items: Record<string, any>[] = [];

  for (const [entityId, entity] of Object.entries(hass?.entities ?? {}) as [string, any][]) {
    // Something hidden was hidden on purpose, and a dashboard built from the registry
    // should no more show it than Home Assistant's own automatic dashboards do.
    if (entity?.hidden) continue;
    if (!matchesAny([entityId], patterns)) continue;

    const domain = entityId.split('.')[0];
    if (domains && !matches(domain, domains)) continue;

    const area = areaOf(hass, entity);
    if (areas && !matchesAny([area?.area_id, area?.name], areas)) continue;
    if (!floorMatches(hass, area, floors)) continue;
    if (!labelMatches(hass, labelsOf(hass, entity), labels)) continue;

    items.push({
      entity: entityId,
      name: nameOf(hass, entityId, entity),
      domain,
      area: area?.name ?? '',
      area_id: area?.area_id ?? '',
    });
  }
  return items.sort(byName);
}

// What each kind of copy is given, which is also what an editor must not report as a
// variable the card has forgotten to set.
const ENTITY_NAMES = ['entity', 'name', 'domain', 'area', 'area_id'];
const AREA_NAMES = ['area_id', 'area', 'area_icon', 'floor'];

/** The variable names a source supplies to every copy, whatever the registry holds. */
export function registryNames(source: any): string[] {
  if (!isRegistrySource(source)) return [];
  return source.areas !== undefined ? [...AREA_NAMES] : [...ENTITY_NAMES];
}

/**
 * The copies a `for_each_from:` asks for, one set of variables each. Order is by the name
 * shown, so the dashboard does not reshuffle itself when the registry does.
 */
export function resolveRegistryItems(hass: any, source: any): Record<string, any>[] {
  if (!isRegistrySource(source)) return [];
  return source.areas !== undefined ? areaItems(hass, source) : entityItems(hass, source);
}

/**
 * What the resolved list depends on, for deciding whether to work it out again. hass is
 * replaced on every state change, many times a second, but these collections are replaced
 * only when the registry itself changes - so comparing them is the difference between
 * rebuilding a card when a lamp is added and rebuilding it when a lamp is switched on.
 */
export function registryKey(hass: any): unknown[] {
  return [hass?.entities, hass?.devices, hass?.areas, hass?.floors, hass?.labels];
}

/** Whether two registry keys describe the same registry, compared entry by entry. */
export function sameRegistry(a: unknown[] | undefined, b: unknown[]): boolean {
  return !!a && a.length === b.length && a.every((value, index) => value === b[index]);
}
