import { HomeAssistant } from 'custom-card-helpers';
import { DeclutteringCardConfig, FormSchemaEntry } from '../types';
import { isRegistrySource, RegistrySource } from '../registry';
import { localize } from '../localize';

/*
 * Ideas 15 and 46: the repeat builder. `for_each_from` was a box of YAML; this draws the
 * shapes a form can draw - one copy per entity, area, device, floor, label or view, narrowed
 * by the filters a repeat takes - and writes back exactly the keys a hand would write. A
 * shape it cannot draw (a Jinja `template:` source, a `range:`, an `exclude:` mapping, an
 * area source gathering entities with `with:`) keeps the object field, so nothing is lost.
 *
 * A hand-written `for_each` list gets a sortable list with one small YAML editor per item.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export type SourceKind = 'entities' | 'areas' | 'devices' | 'floors' | 'labels' | 'views';

const KINDS: SourceKind[] = ['entities', 'areas', 'devices', 'floors', 'labels', 'views'];

/** The mode dropdown: no repeat, a list written here, one of the collections, or a source the form leaves alone. */
export type RepeatMode = 'none' | 'list' | SourceKind | 'other';

/** Which collection a source repeats over, when it is one the form can draw. */
export function sourceKind(source: unknown): SourceKind | undefined {
  if (!source || typeof source !== 'object' || Array.isArray(source)) return undefined;
  const written = source as RegistrySource;
  if (written.template !== undefined || written.range !== undefined || written.with !== undefined) return undefined;
  if (written.exclude !== undefined && typeof written.exclude === 'object' && !Array.isArray(written.exclude))
    return undefined;
  const named = KINDS.filter((kind) => written[kind] !== undefined);
  if (named.length > 1) return undefined;
  if (named.length === 1) return named[0];
  // Filters alone mean entities, exactly as the card reads them.
  return isRegistrySource(source) ? 'entities' : undefined;
}

export function isDrawableSource(source: unknown): boolean {
  return sourceKind(source) !== undefined;
}

export function repeatMode(config: DeclutteringCardConfig): RepeatMode {
  if (config.for_each_from !== undefined) return sourceKind(config.for_each_from) ?? 'other';
  if (config.for_each !== undefined) return 'list';
  return 'none';
}

/**
 * The card switched to another mode. A collection keeps the filters and the order written for
 * the last one, since a repeat over devices narrowed to a domain reads the same way one over
 * entities does; a list starts empty; none takes both keys away.
 */
export function withRepeatMode(config: DeclutteringCardConfig, mode: RepeatMode): DeclutteringCardConfig {
  if (repeatMode(config) === mode || mode === 'other') return config;
  const out = { ...config } as Record<string, unknown>;
  delete out.for_each;
  delete out.for_each_from;
  if (mode === 'list') out.for_each = [];
  else if (mode !== 'none') {
    const previous = (
      sourceKind(config.for_each_from) ? { ...(config.for_each_from as Record<string, unknown>) } : {}
    ) as Record<string, unknown>;
    for (const kind of KINDS) delete previous[kind];
    out.for_each_from = { [mode]: true, ...previous };
  }
  return out as DeclutteringCardConfig;
}

export interface RepeatData {
  /** Patterns narrowing the collection itself; empty for all of it. */
  patterns: string[];
  domain?: string[];
  area?: string[];
  floor?: string[];
  label?: string[];
  device_class?: string[];
  integration?: string[];
  exclude?: string[];
  sort?: string;
  then?: string;
  reverse: boolean;
  limit?: number;
  offset?: number;
  group_by?: string;
  /** On means diagnostic and config entities are kept: `entity_category: all`. */
  entity_category: boolean;
}

function asList(value: unknown): string[] | undefined {
  if (value === undefined || value === null || value === true) return undefined;
  const list = Array.isArray(value) ? value : [value];
  const strings = list
    .filter((each): each is string => typeof each === 'string' && each.trim() !== '')
    .map((each) => each.trim());
  return strings;
}

function asNumber(value: unknown): number | undefined {
  const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : NaN;
  return Number.isFinite(number) ? number : undefined;
}

const FILTER_KEYS = ['domain', 'area', 'floor', 'label', 'device_class', 'integration', 'exclude'] as const;

/** What the builder shows for a source. */
export function repeatData(source: unknown): RepeatData {
  const written = (source ?? {}) as Record<string, unknown>;
  const kind = sourceKind(source) ?? 'entities';
  const data: RepeatData = {
    patterns: asList(written[kind]) ?? [],
    reverse: written.reverse === true,
    entity_category: false,
  };
  for (const key of FILTER_KEYS) {
    const list = asList(written[key]);
    if (list && list.length) data[key] = list;
  }
  const sort = asList(written.sort) ?? [];
  if (sort[0]) data.sort = sort[0];
  if (sort[1]) data.then = sort[1];
  const limit = asNumber(written.limit);
  if (limit !== undefined) data.limit = limit;
  const offset = asNumber(written.offset);
  if (offset !== undefined) data.offset = offset;
  if (typeof written.group_by === 'string' && written.group_by) data.group_by = written.group_by;
  const category = written.entity_category;
  data.entity_category =
    category === true ||
    category === 'all' ||
    (typeof category === 'string' && !!category) ||
    (Array.isArray(category) && category.length > 0);
  return data;
}

// One name is written as a word, several as a list - the way the docs write them.
function wordOrList(list: string[] | undefined): string | string[] | undefined {
  if (!list || !list.length) return undefined;
  return list.length === 1 ? list[0] : list;
}

/** The source with the builder's values written in; keys the builder does not draw stay as they were. */
export function applyRepeat(source: unknown, data: RepeatData): Record<string, unknown> {
  const out = { ...((source ?? {}) as Record<string, unknown>) };
  const kind = sourceKind(source) ?? 'entities';
  out[kind] =
    data.patterns && data.patterns.length ? wordOrList(data.patterns.map((each) => each.trim()).filter(Boolean)) : true;
  for (const key of FILTER_KEYS) {
    const value = wordOrList(data[key]?.filter((each) => each.trim()));
    if (value === undefined) delete out[key];
    else out[key] = value;
  }
  const sort = [data.sort, data.then].filter((each): each is string => typeof each === 'string' && each.trim() !== '');
  if (!sort.length) delete out.sort;
  else out.sort = sort.length === 1 ? sort[0] : sort;
  if (data.reverse === true) out.reverse = true;
  else delete out.reverse;
  const limit = asNumber(data.limit);
  if (limit === undefined) delete out.limit;
  else out.limit = limit;
  const offset = asNumber(data.offset);
  if (offset === undefined || offset === 0) delete out.offset;
  else out.offset = offset;
  if (typeof data.group_by === 'string' && data.group_by) out.group_by = data.group_by;
  else delete out.group_by;
  if (data.entity_category === true) {
    // A written list of categories already keeps them; only a bare on needs the word.
    if (!Array.isArray(out.entity_category) && typeof out.entity_category !== 'string') out.entity_category = 'all';
  } else delete out.entity_category;
  return out;
}

/* ------------------------------------------------------------ what Home Assistant knows */

function domainOf(entityId: string): string {
  return entityId.split('.')[0];
}

export function knownDomains(hass: HomeAssistant | undefined): string[] {
  return [...new Set(Object.keys(hass?.states ?? {}).map(domainOf))].sort();
}

export function knownDeviceClasses(hass: HomeAssistant | undefined): string[] {
  const classes = new Set<string>();
  for (const state of Object.values(hass?.states ?? {})) {
    const written = (state as any)?.attributes?.device_class;
    if (typeof written === 'string' && written) classes.add(written);
  }
  return [...classes].sort();
}

export function knownIntegrations(hass: HomeAssistant | undefined): string[] {
  const platforms = new Set<string>();
  for (const entry of Object.values(((hass as any)?.entities ?? {}) as Record<string, any>)) {
    if (typeof entry?.platform === 'string' && entry.platform) platforms.add(entry.platform);
  }
  return [...platforms].sort();
}

/* ------------------------------------------------------------ the form */

const SORT_KEYS = ['name', '-name', 'entity', 'area', 'floor', 'domain', 'entity_count', 'none'];
const GROUP_KEYS = ['', 'area', 'floor', 'domain', 'label'];

function chips(options: string[], extra?: string[]): Record<string, unknown> {
  const all = [...options, ...(extra ?? []).filter((each) => !options.includes(each))];
  return {
    select: {
      mode: 'dropdown',
      multiple: true,
      custom_value: true,
      options: all.map((value) => ({ value, label: value })),
    },
  };
}

/** The builder's fields for one collection, in the order the mockup shows them. */
export function repeatBuilderSchema(
  hass: HomeAssistant | undefined,
  kind: SourceKind,
  written?: RepeatData,
): FormSchemaEntry[] {
  const text = (key: string): string => localize(key, undefined, hass);
  const sortOptions = (current?: string): Record<string, unknown> => ({
    select: {
      mode: 'dropdown',
      custom_value: true,
      options: [...SORT_KEYS, ...(current && !SORT_KEYS.includes(current) ? [current] : [])].map((value) => ({
        value,
        label: SORT_KEYS.includes(value) ? text(`editor.repeat.sort_${value.replace('-', 'desc_')}`) : value,
      })),
    },
  });
  const forEntities = kind === 'entities';
  const forAreas = kind === 'areas';
  const forDevices = kind === 'devices';
  const fields: (FormSchemaEntry | false)[] = [
    {
      name: 'patterns',
      label: text(`editor.repeat.patterns_${kind}`),
      helper: text('editor.repeat.patterns_helper'),
      selector: chips([], written?.patterns),
    },
    forEntities && {
      name: 'domain',
      label: text('editor.repeat.domain_label'),
      selector: chips(knownDomains(hass), written?.domain),
    },
    (forEntities || forDevices) && {
      name: 'area',
      label: text('editor.repeat.area_label'),
      selector: { area: { multiple: true } },
    },
    (forEntities || forAreas || forDevices) && {
      name: 'floor',
      label: text('editor.repeat.floor_label'),
      selector: { floor: { multiple: true } },
    },
    (forEntities || forAreas || forDevices) && {
      name: 'label',
      label: text('editor.repeat.label_label'),
      selector: { label: { multiple: true } },
    },
    forEntities && {
      name: 'device_class',
      label: text('editor.repeat.device_class_label'),
      selector: chips(knownDeviceClasses(hass), written?.device_class),
    },
    forEntities && {
      name: 'integration',
      label: text('editor.repeat.integration_label'),
      selector: chips(knownIntegrations(hass), written?.integration),
    },
    {
      name: 'exclude',
      label: text('editor.repeat.exclude_label'),
      helper: text('editor.repeat.exclude_helper'),
      selector: forEntities ? { entity: { multiple: true } } : chips([], written?.exclude),
    },
    { name: 'sort', label: text('editor.repeat.sort_label'), selector: sortOptions(written?.sort) },
    { name: 'then', label: text('editor.repeat.then_label'), selector: sortOptions(written?.then) },
    { name: 'reverse', label: text('editor.repeat.reverse_label'), selector: { boolean: {} } },
    {
      name: 'limit',
      label: text('editor.repeat.limit_label'),
      selector: { number: { min: 0, max: 500, mode: 'box' } },
    },
    {
      name: 'offset',
      label: text('editor.repeat.offset_label'),
      helper: text('editor.repeat.offset_helper'),
      selector: { number: { min: 0, max: 500, mode: 'box' } },
    },
    forEntities && {
      name: 'group_by',
      label: text('editor.repeat.group_by_label'),
      helper: text('editor.repeat.group_by_helper'),
      selector: {
        select: {
          mode: 'dropdown',
          options: GROUP_KEYS.map((value) => ({ value, label: text(`editor.repeat.group_${value || 'none'}`) })),
        },
      },
    },
    forEntities && {
      name: 'entity_category',
      label: text('editor.repeat.entity_category_label'),
      helper: text('editor.repeat.entity_category_helper'),
      selector: { boolean: {} },
    },
  ];
  return fields.filter((field): field is FormSchemaEntry => field !== false);
}

/** The mode dropdown's options. A source the form leaves alone is offered only while it is written. */
export function repeatModeOptions(
  hass: HomeAssistant | undefined,
  current: RepeatMode,
): { value: string; label: string }[] {
  const modes: RepeatMode[] = ['none', 'list', ...KINDS];
  if (current === 'other') modes.push('other');
  return modes.map((value) => ({ value, label: localize(`editor.repeat.mode_${value}`, undefined, hass) }));
}

/* ------------------------------------------------------------ the hand-written list (idea 46) */

/** One line to stand for an item: its name, its entity, or its first value. */
export function listItemLabel(item: unknown): string {
  const entries = Array.isArray(item)
    ? Object.assign({}, ...item.filter((each) => each && typeof each === 'object'))
    : item && typeof item === 'object'
      ? (item as Record<string, unknown>)
      : {};
  const first = (value: unknown): string | undefined =>
    typeof value === 'string' && value.trim() ? value.trim() : undefined;
  const firstValue = Object.values(entries).find((value) => typeof value === 'string' && value.trim());
  return first(entries.name) ?? first(entries.entity) ?? (typeof firstValue === 'string' ? firstValue.trim() : '');
}

export function withListItem<T>(list: T[], index: number, item: T): T[] {
  return list.map((each, at) => (at === index ? item : each));
}

export function withoutListItem<T>(list: T[], index: number): T[] {
  return list.filter((_, at) => at !== index);
}

/** A new item shaped like the last one, every value emptied, so the keys do not have to be typed again. */
export function withNewListItem(list: unknown[]): unknown[] {
  const last = list[list.length - 1];
  const keys = last && typeof last === 'object' && !Array.isArray(last) ? Object.keys(last) : [];
  const fresh: Record<string, string> = {};
  for (const key of keys.length ? keys : ['entity']) fresh[key] = '';
  return [...list, fresh];
}
