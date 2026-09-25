/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * Repeating a template over a written-out list means the dashboard stops being true the
 * moment a lamp is added. Home Assistant already knows what exists - its areas, its
 * entities, and the labels put on them - so a card can ask for "every light in the
 * kitchen" and grow by itself.
 */

import { labelRegistry } from './labels';

/** What to repeat over. `areas` and `entities` choose the kind of copy; the rest narrow. */
export interface RegistrySource {
  /** Repeat over areas. `true` or `'*'` for all of them, or patterns to pick some. */
  areas?: boolean | string | string[];
  /** Repeat over devices, by id or name pattern. */
  devices?: boolean | string | string[];
  /** Repeat over floors, by id or name pattern. */
  floors?: boolean | string | string[];
  /** Repeat over labels, by id or name pattern. */
  labels?: boolean | string | string[];
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
  /** Narrows to entities of these device classes. */
  device_class?: string | string[];
  /** Narrows to entities provided by these integrations. */
  integration?: string | string[];
  /** What to leave out. Patterns for entity ids, or a mapping of the same filters. */
  exclude?: string | string[] | RegistrySource;
  /** What to order the copies by, `-key` for descending, a list for tiebreaks. */
  sort?: string | string[];
  /** Reverses whatever order was chosen. */
  reverse?: boolean;
  /** At most this many copies, after everything else has been applied. */
  limit?: number;
  /** Skip this many copies first, so `offset` and `limit` cut one list into windows. */
  offset?: number;
  /** Repeat a fixed number of times, with nothing but the position to go on. */
  range?: number;
  /** Skip a copy when any of these keys came out empty - entities in no area, say. */
  require?: string | string[];
  /** Extra or different variables for particular copies, keyed by entity or area pattern. */
  overrides?: Record<string, Record<string, any>>;
  /** Fold entity copies into one per `domain`, `floor`, `label` or `area`. */
  group_by?: string;
  /** For an area source: the entities to gather for each area. */
  with?: RegistrySource & { keep_empty?: boolean };
}

// The most copies a `range:` will make. A row of slots is a handful; anything past this is
// a mistake or a crafted config, and either way not worth allocating an array for.
const MAX_RANGE = 1000;

// `sort`, `reverse` and `limit` are deliberately not here: on their own they say nothing
// about what to repeat over, so a mapping holding only those is not a source.
const SOURCE_KEYS = [
  'areas',
  'devices',
  'floors',
  'labels',
  'entities',
  'domain',
  'area',
  'floor',
  'label',
  'device_class',
  'integration',
  'exclude',
  'range',
];

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

// Each pattern is compiled once and kept: the same handful of patterns is tested against
// every entity in the registry, and rebuilding the regexp per entity was most of the work.
const patternCache = new Map<string, RegExp>();

/** The anchored, case-insensitive regexp one `*` pattern compiles to. */
function patternRegExp(pattern: string): RegExp {
  const cached = patternCache.get(pattern);
  if (cached) return cached;
  // Runs of `*` are collapsed to one. Left as written they compile to `.*.*.*`, which backs
  // off exponentially against a subject that never matches - a pattern like `**********z`
  // freezes the tab for the better part of a minute on a single entity id. `.*` repeated is
  // no more expressive than a single `.*`, so nothing is lost by folding them together.
  const source = pattern
    .toLowerCase()
    .replace(/\*+/g, '*')
    .split('*')
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  const compiled = new RegExp(`^${source}$`);
  patternCache.set(pattern, compiled);
  return compiled;
}

/** One pattern with `*` standing for anything, anchored, matched without regard to case. */
function matches(value: string | undefined | null, patterns: string[]): boolean {
  if (value === undefined || value === null) return false;
  const text = String(value).toLowerCase();
  return patterns.some((pattern) => patternRegExp(pattern).test(text));
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
  return labels.some((id) => matchesAny([id, labelRegistry(hass)?.[id]?.name], patterns));
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

/** What each `sort:` orders by. Any other name is read as a key on the items themselves. */
const SORTS: Record<string, (item: Record<string, any>) => string> = {
  name: (item) => String(item.name ?? item.area ?? ''),
  entity: (item) => String(item.entity ?? item.area_id ?? ''),
  id: (item) => String(item.entity ?? item.area_id ?? ''),
  area: (item) => String(item.area ?? ''),
  domain: (item) => String(item.domain ?? ''),
  floor: (item) => String(item.floor ?? ''),
};

/**
 * The copies in the order they should be drawn, and no more of them than were asked for.
 * `total` goes on every copy before the limit is applied, so a template can say "8 of 23"
 * rather than "8 of 8".
 */
function ordered(items: Record<string, any>[], source: RegistrySource, hass?: any): Record<string, any>[] {
  /*
   * `overrides:` gives particular copies different variables - a special icon for one
   * light - without the exclude-and-rewrite dance. Applied before anything else looks at
   * the items, so a renamed copy sorts under its new name and `require:` sees the
   * overridden values. Keys are patterns, and every matching one applies in turn.
   */
  const overrides = source.overrides && typeof source.overrides === 'object' ? source.overrides : undefined;
  if (overrides) {
    items = items.map((item) => {
      let merged = item;
      for (const [pattern, extra] of Object.entries(overrides)) {
        if (!extra || typeof extra !== 'object' || Array.isArray(extra)) continue;
        if (matches(item.entity ?? item.area_id, [pattern])) merged = { ...merged, ...extra };
      }
      return merged;
    });
  }

  // `require:` drops a copy whose key came out empty - an entity in no area, an area on
  // no floor - before anything is counted, so `total` says what is actually shown.
  const wanted = asList(source.require) ?? [];
  if (wanted.length) items = items.filter((item) => wanted.every((key) => String(item[key] ?? '') !== ''));

  /*
   * `sort: none` keeps the registry's own order, which is the only way to ask for
   * "however Home Assistant listed them". Any other name outside SORTS is read as a key
   * on each item - `sort: area_id`, or `sort: entity_count` on a grouped repeat - and
   * compared numerically as well as alphabetically, since what items carry is as often a
   * count as a word. An item without the key sorts as empty, ahead of everything.
   *
   * A leading minus turns one key around, and a list of keys sorts by the first and
   * breaks ties with the next - `sort: [floor, -entity_count]`. `reverse:` still flips
   * the whole order at the end, tiebreaks and all.
   */
  const asked =
    source.sort === undefined
      ? undefined
      : (Array.isArray(source.sort) ? source.sort : [source.sort]).filter(
          (each): each is string => typeof each === 'string' && !!each,
        );
  const comparators = (asked ?? [])
    .filter((each) => each !== 'none')
    .map((raw) => {
      const descending = raw.startsWith('-');
      const key = descending ? raw.slice(1) : raw;
      // Own properties only, or an inherited name like `toString` answers the lookup with a
      // function that is not a comparator at all - same reasoning as the parameterised
      // transform lookup in variables.ts.
      const known = Object.prototype.hasOwnProperty.call(SORTS, key) ? SORTS[key] : undefined;
      // `attr:temperature` reads the state's attribute as it is right now. A build-time
      // snapshot on purpose: the order will not follow the value, and the docs say so.
      const read =
        known ??
        (key.startsWith('attr:')
          ? (item: Record<string, any>): string => {
              const value = hass?.states?.[item.entity]?.attributes?.[key.slice(5)];
              return value === undefined || value === null ? '' : String(value);
            }
          : (item: Record<string, any>): string => String(item[key] ?? ''));
      return (a: Record<string, any>, b: Record<string, any>): number => {
        const compared = known
          ? read(a).localeCompare(read(b))
          : read(a).localeCompare(read(b), undefined, { numeric: true });
        return descending ? -compared : compared;
      };
    });
  const sorted =
    asked === undefined
      ? [...items].sort(byName)
      : comparators.length
        ? [...items].sort((a, b) => {
            for (const compare of comparators) {
              const result = compare(a, b);
              if (result) return result;
            }
            return byName(a, b);
          })
        : [...items];
  if (source.reverse) sorted.reverse();

  const total = sorted.length;
  const withTotal = sorted.map((item) => ({ ...item, total }));
  // `total` ignores the window on purpose: every page of a split list says the same
  // "of 23", which is the point of splitting it.
  const offset = Number(source.offset);
  const from = Number.isFinite(offset) && offset > 0 ? Math.floor(offset) : 0;
  const limit = Number(source.limit);
  return Number.isFinite(limit) && limit >= 0 ? withTotal.slice(from, from + limit) : withTotal.slice(from);
}

/** Whether one area answers to a set of filters. */
function areaMatches(hass: any, area: any, source: RegistrySource): boolean {
  if (!matchesAny([area.area_id, area.name], asList(source.areas))) return false;
  if (!matchesAny([area.area_id, area.name], asList(source.area))) return false;
  if (!floorMatches(hass, area, asList(source.floor))) return false;
  if (!labelMatches(hass, area.labels ?? [], asList(source.label))) return false;
  return true;
}

function areaItems(hass: any, source: RegistrySource): Record<string, any>[] {
  const drop = excluded(source.exclude);
  // An area is left out by name or id, so patterns mean areas here rather than entities.
  const dropAreas = drop?.entities !== undefined ? { areas: drop.entities, ...drop } : drop;
  const gather = source.with;
  const items: Record<string, any>[] = [];

  for (const area of Object.values(hass?.areas ?? {}) as any[]) {
    if (!areaMatches(hass, area, source)) continue;
    if (dropAreas && areaMatches(hass, area, dropAreas)) continue;

    const floor = area.floor_id ? hass?.floors?.[area.floor_id] : undefined;
    const item: Record<string, any> = {
      area_id: area.area_id,
      area: area.name ?? area.area_id,
      area_icon: area.icon ?? '',
      floor: floor?.name ?? '',
    };

    /*
     * A copy per area that knows what is in it. The area is fixed to this one, whatever
     * `with` said about areas, because that is the whole point of grouping - and `items`
     * is handed straight to a nested repeat, which is how one card becomes a tile per room
     * each listing that room's lights.
     */
    if (gather) {
      const inside = entityItems(hass, { ...gather, area: area.area_id });
      const ordered = [...inside].sort(byName);
      // A room with no lights in it is usually noise rather than news, so it goes - unless
      // the card says otherwise, which is how "no lights in here" gets to be shown.
      if (!ordered.length && !gather.keep_empty) continue;
      item.items = ordered;
      item.entities = ordered.map((entity) => entity.entity);
      item.entity_count = ordered.length;
    }

    items.push(item);
  }
  return items;
}

/*
 * A copy per device, floor or label, the same shape a copy per area takes: what the thing
 * is, and - with `with:` - what of the registry falls inside it. An empty one goes unless
 * `keep_empty` says otherwise, exactly as an empty area does.
 */
function gatherInto(
  item: Record<string, any>,
  inside: Record<string, any>[],
  gather: (RegistrySource & { keep_empty?: boolean }) | undefined,
): Record<string, any> | undefined {
  if (!gather) return item;
  const ordered = [...inside].sort(byName);
  if (!ordered.length && !gather.keep_empty) return undefined;
  item.items = ordered;
  item.entities = ordered.map((entity) => entity.entity);
  item.entity_count = ordered.length;
  return item;
}

function deviceItems(hass: any, source: RegistrySource): Record<string, any>[] {
  const drop = asList(excluded(source.exclude)?.entities);
  const gather = source.with;
  const items: Record<string, any>[] = [];
  const gathered = gather ? entityItems(hass, gather) : [];

  for (const device of Object.values(hass?.devices ?? {}) as any[]) {
    const name = device.name_by_user ?? device.name ?? device.id;
    if (!matchesAny([device.id, name], asList(source.devices))) continue;
    if (drop && matchesAny([device.id, name], drop)) continue;
    const area = device.area_id ? hass?.areas?.[device.area_id] : undefined;
    if (!matchesAny([device.area_id, area?.name], asList(source.area))) continue;
    if (!floorMatches(hass, area, asList(source.floor))) continue;
    if (!labelMatches(hass, device.labels ?? [], asList(source.label))) continue;

    const item = gatherInto(
      {
        device_id: device.id,
        device: name,
        name,
        area: area?.name ?? '',
        area_id: device.area_id ?? '',
        manufacturer: device.manufacturer ?? '',
        model: device.model ?? '',
      },
      gathered.filter((inside) => hass?.entities?.[inside.entity]?.device_id === device.id),
      gather,
    );
    if (item) items.push(item);
  }
  return items;
}

function floorItems(hass: any, source: RegistrySource): Record<string, any>[] {
  const drop = asList(excluded(source.exclude)?.entities);
  const gather = source.with;
  const items: Record<string, any>[] = [];

  for (const floor of Object.values(hass?.floors ?? {}) as any[]) {
    const name = floor.name ?? floor.floor_id;
    if (!matchesAny([floor.floor_id, name], asList(source.floors))) continue;
    if (drop && matchesAny([floor.floor_id, name], drop)) continue;

    const item = gatherInto(
      { floor_id: floor.floor_id, floor: name, name, level: floor.level ?? '' },
      gather ? entityItems(hass, { ...gather, floor: floor.floor_id }) : [],
      gather,
    );
    if (item) items.push(item);
  }
  return items;
}

function labelItems(hass: any, source: RegistrySource): Record<string, any>[] {
  const drop = asList(excluded(source.exclude)?.entities);
  const gather = source.with;
  const items: Record<string, any>[] = [];

  /*
   * The label registry arrived on `hass` later than labels themselves did, so the set is
   * drawn from both: the registry where there is one, and otherwise the labels that
   * entities and devices actually carry - named by their id, which is at least visible.
   */
  const known = new Map<string, any>();
  for (const label of Object.values(labelRegistry(hass) ?? {}) as any[]) known.set(label.label_id, label);
  for (const entity of Object.values(hass?.entities ?? {}) as any[]) {
    for (const id of entity?.labels ?? []) if (!known.has(id)) known.set(id, { label_id: id });
  }
  for (const device of Object.values(hass?.devices ?? {}) as any[]) {
    for (const id of device?.labels ?? []) if (!known.has(id)) known.set(id, { label_id: id });
  }

  for (const label of known.values() as Iterable<any>) {
    const name = label.name ?? label.label_id;
    if (!matchesAny([label.label_id, name], asList(source.labels))) continue;
    if (drop && matchesAny([label.label_id, name], drop)) continue;

    const item = gatherInto(
      { label_id: label.label_id, label: name, name },
      gather ? entityItems(hass, { ...gather, label: label.label_id }) : [],
      gather,
    );
    if (item) items.push(item);
  }
  return items;
}

/** The device class an entity reports, which is on its state rather than its registry entry. */
function deviceClassOf(hass: any, entityId: string, entity: any): string | undefined {
  return hass?.states?.[entityId]?.attributes?.device_class ?? entity?.device_class;
}

/** Whether one entity answers to a set of filters. Shared by what to keep and what to drop. */
function entityMatches(hass: any, entityId: string, entity: any, source: RegistrySource): boolean {
  const patterns = asList(source.entities);
  if (!matchesAny([entityId], patterns)) return false;

  const domains = asList(source.domain);
  if (domains && !matches(entityId.split('.')[0], domains)) return false;

  const classes = asList(source.device_class);
  if (classes && !matches(deviceClassOf(hass, entityId, entity), classes)) return false;

  const integrations = asList(source.integration);
  if (integrations && !matchesAny([entity?.platform], integrations)) return false;

  const area = areaOf(hass, entity);
  const areas = asList(source.area);
  if (areas && !matchesAny([area?.area_id, area?.name], areas)) return false;
  if (!floorMatches(hass, area, asList(source.floor))) return false;
  if (!labelMatches(hass, labelsOf(hass, entity), asList(source.label))) return false;
  return true;
}

/**
 * What a source says to leave out, as a set of filters. Written as patterns it means entity
 * ids, which is what it is nearly always used for; written as a mapping it can narrow by
 * anything the source itself can.
 */
function excluded(exclude: RegistrySource['exclude']): RegistrySource | undefined {
  if (exclude === undefined || exclude === null) return undefined;
  if (typeof exclude === 'object' && !Array.isArray(exclude)) return exclude as RegistrySource;
  return { entities: exclude as string | string[] };
}

function entityItems(hass: any, source: RegistrySource): Record<string, any>[] {
  const drop = excluded(source.exclude);
  const items: Record<string, any>[] = [];

  for (const [entityId, entity] of Object.entries(hass?.entities ?? {}) as [string, any][]) {
    // Something hidden was hidden on purpose, and a dashboard built from the registry
    // should no more show it than Home Assistant's own automatic dashboards do.
    if (entity?.hidden) continue;
    if (!entityMatches(hass, entityId, entity, source)) continue;
    // What to leave out wins over what to take in, so one sweep can say "all of these
    // except those three" without listing everything it does want.
    if (drop && entityMatches(hass, entityId, entity, drop)) continue;

    const area = areaOf(hass, entity);
    items.push({
      entity: entityId,
      name: nameOf(hass, entityId, entity),
      domain: entityId.split('.')[0],
      area: area?.name ?? '',
      area_id: area?.area_id ?? '',
    });
  }
  return items;
}

// What each kind of copy is given, which is also what an editor must not report as a
// variable the card has forgotten to set.
const ENTITY_NAMES = ['entity', 'name', 'domain', 'area', 'area_id', 'total'];
const AREA_NAMES = ['area_id', 'area', 'area_icon', 'floor', 'total'];
const DEVICE_NAMES = ['device_id', 'device', 'name', 'area', 'area_id', 'manufacturer', 'model', 'total'];
const FLOOR_NAMES = ['floor_id', 'floor', 'name', 'level', 'total'];
const LABEL_NAMES = ['label_id', 'label', 'name', 'total'];
const GATHERED_NAMES = ['items', 'entities', 'entity_count'];
const GROUPED_NAMES = ['group', 'name', 'items', 'entities', 'entity_count', 'total'];
const RANGE_NAMES = ['total'];

/** The variable names a source supplies to every copy, whatever the registry holds. */
export function registryNames(source: any): string[] {
  if (!isRegistrySource(source)) return [];
  if (source.range !== undefined) return [...RANGE_NAMES];
  const gathered = source.with ? GATHERED_NAMES : [];
  if (source.areas !== undefined) return [...AREA_NAMES, ...gathered];
  if (source.devices !== undefined) return [...DEVICE_NAMES, ...gathered];
  if (source.floors !== undefined) return [...FLOOR_NAMES, ...gathered];
  if (source.labels !== undefined) return [...LABEL_NAMES, ...gathered];
  return typeof source.group_by === 'string' ? [...GROUPED_NAMES] : [...ENTITY_NAMES];
}

/**
 * The copies a `for_each_from:` asks for, one set of variables each. Order is by the name
 * shown, so the dashboard does not reshuffle itself when the registry does.
 */
export function resolveRegistryItems(hass: any, source: any): Record<string, any>[] {
  if (!isRegistrySource(source)) return [];

  /*
   * A plain count, with nothing but the position to go on. Useful for a row of slots, or
   * for laying something out before the entities behind it exist. Asked for at all, it is
   * the whole answer - a range of none is none, not a sweep of everything there is.
   */
  if (source.range !== undefined) {
    const range = Number(source.range);
    // Clamped: `range: 1000000000` would otherwise allocate a billion copies and hang the
    // tab before a single one is drawn. Well past any real row of slots.
    const asked = Number.isFinite(range) && range > 0 ? Math.floor(range) : 0;
    const count = Math.min(asked, MAX_RANGE);
    return Array.from({ length: count }, () => ({ total: count }));
  }

  const items =
    source.areas !== undefined
      ? areaItems(hass, source)
      : source.devices !== undefined
        ? deviceItems(hass, source)
        : source.floors !== undefined
          ? floorItems(hass, source)
          : source.labels !== undefined
            ? labelItems(hass, source)
            : entityItems(hass, source);
  if (isEntitySource(source) && typeof source.group_by === 'string') {
    return ordered(groupedItems(hass, items, source.group_by), source, hass);
  }
  return ordered(items, source, hass);
}

/** Whether the copies are entities, rather than areas, devices, floors or labels. */
function isEntitySource(source: RegistrySource): boolean {
  return (
    source.areas === undefined &&
    source.devices === undefined &&
    source.floors === undefined &&
    source.labels === undefined
  );
}

/*
 * `group_by:` folds entity copies into one copy per distinct value - a copy per domain,
 * per floor, per label, or per area - each knowing what fell into it, the same shape
 * `with:` gives an area. An entity with nothing to group on (no floor, no label) is
 * left out: a group of the unplaceable is noise, and `areas: true` with `keep_empty`
 * already covers "show the empty ones" for the area case.
 */
function groupedItems(hass: any, items: Record<string, any>[], by: string): Record<string, any>[] {
  const groups = new Map<string, Record<string, any>>();
  const add = (id: string | undefined, name: string | undefined, item: Record<string, any>): void => {
    if (!id) return;
    const group = groups.get(id) ?? { group: id, name: name || id, items: [], entities: [], entity_count: 0 };
    group.items.push(item);
    group.entities.push(item.entity);
    group.entity_count = group.items.length;
    groups.set(id, group);
  };

  for (const item of items) {
    const entity = hass?.entities?.[item.entity];
    if (by === 'domain') add(item.domain, item.domain, item);
    else if (by === 'area') add(item.area_id, item.area, item);
    else if (by === 'floor') {
      const floorId = areaOf(hass, entity)?.floor_id;
      add(floorId, floorId ? hass?.floors?.[floorId]?.name : undefined, item);
    } else if (by === 'label') {
      for (const labelId of labelsOf(hass, entity)) add(labelId, labelRegistry(hass)?.[labelId]?.name, item);
    }
  }

  return [...groups.values()].map((group) => {
    const inside = [...group.items].sort(byName);
    return { ...group, items: inside, entities: inside.map((item) => item.entity) };
  });
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
  return [hass?.entities, hass?.devices, hass?.areas, hass?.floors, labelRegistry(hass)];
}

/** Whether two registry keys describe the same registry, compared entry by entry. */
export function sameRegistry(a: unknown[] | undefined, b: unknown[]): boolean {
  return !!a && a.length === b.length && a.every((value, index) => value === b[index]);
}
