import { loadAll } from 'js-yaml';
import deepReplace from './deep-replace';
import {
  PlaceholderBuild,
  PlaygroundResult,
  SAMPLE_HOUSE,
  readVariables,
  tryPlaceholderWith,
  unreadable,
} from './playground';
import { withEveryStateReadable } from './variables';
import { itemTemplatesOf } from './templates';
import { TemplateConfig } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * The docs page's side of "Try a placeholder" (#427): a bigger made-up house than the four
 * entities the card falls back on, the visitor's own test entities on top of it, and item
 * templates for `with:` and `repeat:` to fill. Kept apart from playground.ts, which the card
 * imports for the template editor and the debug report, so none of this goes into the card.
 *
 * Own entities are written as a mapping, one entry per entity (or per run of them):
 *
 *   my_light:
 *     domain: light
 *     state: 'on'
 *     area: kitchen
 *     attributes: {brightness: 120}
 *   my_sensors:
 *     domain: sensor
 *     count: 20
 *     name: sensor_[[index]]
 *
 * The entity id is the domain and the name made into an id, or the key when there is no
 * name - or the key itself when it already is one (`light.porch:`). `count:` makes that
 * many, numbered `01`, `02`... in place of `[[index]]` wherever it is written, or after the
 * name when it is not. Areas, floors and labels are found by id or by name, and made when
 * there is none by that id or name. Anything not given is left out, so a floor is only
 * there to filter on when you give one.
 */

/** As many entities as one entry may make, and as many as the box may make altogether. */
export const MAX_COUNT = 500;
export const MAX_OWN = 1000;
const MAX_ALIASES = 50;

const KEYS = new Set([
  'domain',
  'entity_id',
  'name',
  'state',
  'attributes',
  'area',
  'floor',
  'labels',
  'device_class',
  'unit',
  'state_class',
  'icon',
  'last_changed',
  'last_updated',
  'count',
]);

export interface House {
  states: Record<string, any>;
  entities: Record<string, any>;
  devices: Record<string, any>;
  areas: Record<string, any>;
  floors: Record<string, any>;
  labels: Record<string, any>;
  [key: string]: any;
}

export interface OwnEntities {
  house: House;
  /** The entity ids the box made, in the order it made them. */
  added: string[];
  /** What was wrong with an entry, one line each; the entry is left out. */
  problems: string[];
  /** The box is not YAML at all. */
  error?: string;
}

export function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// A fresh copy of each collection, so the registry index - keyed by their identity - is
// worked out again for a house with different entities in it.
function copyHouse(base: House): House {
  return {
    ...base,
    states: { ...base.states },
    entities: { ...base.entities },
    devices: { ...base.devices },
    areas: { ...base.areas },
    floors: { ...base.floors },
    labels: { ...base.labels },
  };
}

function find(collection: Record<string, any>, idKey: string, wanted: string): any {
  if (Object.prototype.hasOwnProperty.call(collection, wanted)) return collection[wanted];
  const lower = wanted.toLowerCase();
  return Object.values(collection).find(
    (entry) => String(entry?.name ?? '').toLowerCase() === lower || entry?.[idKey] === slug(wanted),
  );
}

function floorFor(house: House, wanted: string): any {
  const found = find(house.floors, 'floor_id', wanted);
  if (found) return found;
  const floor = { floor_id: slug(wanted), name: wanted, icon: null };
  house.floors[floor.floor_id] = floor;
  return floor;
}

function labelFor(house: House, wanted: string): any {
  const found = find(house.labels, 'label_id', wanted);
  if (found) return found;
  const label = { label_id: slug(wanted), name: wanted };
  house.labels[label.label_id] = label;
  return label;
}

/** The area, made when there is none by that id or name; a problem when its floor disagrees. */
function areaFor(house: House, wanted: string, floorName: string | undefined): any | string {
  const found = find(house.areas, 'area_id', wanted);
  const floor = floorName === undefined ? undefined : floorFor(house, floorName);
  if (found) {
    if (!floor || found.floor_id === floor.floor_id) return found;
    if (found.floor_id) return `${found.name} is already on ${house.floors[found.floor_id]?.name ?? found.floor_id}`;
    const placed = { ...found, floor_id: floor.floor_id };
    house.areas[found.area_id] = placed;
    return placed;
  }
  const area = { area_id: slug(wanted), name: wanted, floor_id: floor?.floor_id ?? null, icon: null };
  house.areas[area.area_id] = area;
  return area;
}

// `[[index]]` filled in through the whole entry, in its texts and in its attributes'.
function filled(value: any, index: string): any {
  if (typeof value === 'string') return value.split('[[index]]').join(index);
  if (Array.isArray(value)) return value.map((each) => filled(each, index));
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    const out: Record<string, any> = {};
    for (const [key, each] of Object.entries(value)) out[key] = filled(each, index);
    return out;
  }
  return value;
}

// A YAML timestamp written bare reads as a date; Home Assistant hands over text.
function asText(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return value === undefined || value === null ? '' : String(value);
}

function textList(value: unknown): string[] | undefined {
  if (value === undefined || value === null) return [];
  const list = Array.isArray(value) ? value : [value];
  return list.every((each) => typeof each === 'string' || typeof each === 'number') ? list.map(String) : undefined;
}

const DOMAIN = /^[a-z_][a-z0-9_]*$/;

/**
 * Add entries written in the own-entities format to a copy of a house. Each entry that is
 * wrong in some way is named in `problems` and left out; the rest still go in.
 */
export function addEntities(base: House, specs: Record<string, any>): OwnEntities {
  const house = copyHouse(base);
  const added: string[] = [];
  const problems: string[] = [];
  for (const [key, spec] of Object.entries(specs ?? {})) {
    if (!spec || typeof spec !== 'object' || Array.isArray(spec)) {
      problems.push(`${key}: should be a mapping - domain:, state: and the rest`);
      continue;
    }
    const unknown = Object.keys(spec).filter((name) => !KEYS.has(name));
    if (unknown.length) {
      problems.push(`${key}: ${unknown.join(', ')} is not something an entity here can have`);
      continue;
    }
    // An entity id written as the key, or as entity_id:, brings its own domain.
    const written = typeof spec.entity_id === 'string' && spec.entity_id.includes('.') ? spec.entity_id : undefined;
    const keyDomain = (written ?? (key.includes('.') ? key : '')).split('.')[0] || undefined;
    const domain = keyDomain ?? (typeof spec.domain === 'string' ? spec.domain : '');
    if (!DOMAIN.test(domain)) {
      problems.push(`${key}: needs a domain:, such as light or sensor`);
      continue;
    }
    const counted = spec.count !== undefined;
    const count = counted ? Number(spec.count) : 1;
    if (!Number.isInteger(count) || count < 1 || count > MAX_COUNT) {
      problems.push(`${key}: count: should be a whole number from 1 to ${MAX_COUNT}`);
      continue;
    }
    if (added.length + count > MAX_OWN) {
      problems.push(`${key}: more than ${MAX_OWN} entities altogether - left out`);
      continue;
    }
    if (spec.floor !== undefined && spec.area === undefined) {
      problems.push(`${key}: a floor: goes with an area: - an entity's floor is its area's`);
      continue;
    }
    if (spec.attributes !== undefined && (typeof spec.attributes !== 'object' || Array.isArray(spec.attributes))) {
      problems.push(`${key}: attributes: should be a mapping`);
      continue;
    }
    const labels = textList(spec.labels);
    if (!labels) {
      problems.push(`${key}: labels: should be a label or a list of them`);
      continue;
    }
    const width = Math.max(2, String(count).length);
    const marked = JSON.stringify(spec).includes('[[index]]');
    for (let at = 1; at <= count; at += 1) {
      const index = String(at).padStart(width, '0');
      const one = filled(spec, index);
      // A run with no [[index]] in it is still numbered, or every copy would be one entity.
      const tail = counted && !marked ? index : '';
      const name = typeof one.name === 'string' ? one.name + (tail ? ` ${tail}` : '') : undefined;
      let objectId: string;
      if (typeof one.entity_id === 'string') {
        const id = one.entity_id.includes('.') ? one.entity_id.split('.').slice(1).join('.') : one.entity_id;
        objectId = slug(id) + (tail ? `_${tail}` : '');
      } else if (key.includes('.')) objectId = slug(key.slice(key.indexOf('.') + 1)) + (tail ? `_${tail}` : '');
      // One entity takes its id from its key, as `frontporch:` gives camera.frontporch; a run
      // made with count: takes it from its numbered name, so each copy is its own entity.
      else if (counted) objectId = slug(name ?? key) + (name === undefined && tail ? `_${tail}` : '');
      else objectId = slug(key);
      if (!objectId) {
        problems.push(`${key}: makes no entity id - give it a name: with letters or numbers in it`);
        break;
      }
      const entityId = `${domain}.${objectId}`;

      let area: any;
      if (one.area !== undefined) {
        area = areaFor(house, asText(one.area), one.floor === undefined ? undefined : asText(one.floor));
        if (typeof area === 'string') {
          problems.push(`${key}: ${area}, not ${asText(one.floor)}`);
          break;
        }
      }
      const attributes: Record<string, any> = { ...(one.attributes ?? {}) };
      // Home Assistant always has a friendly name: the one given, or one made from the id.
      attributes.friendly_name = name ?? objectId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      if (one.device_class !== undefined) attributes.device_class = asText(one.device_class);
      if (one.unit !== undefined) attributes.unit_of_measurement = asText(one.unit);
      if (one.state_class !== undefined) attributes.state_class = asText(one.state_class);
      if (one.icon !== undefined) attributes.icon = asText(one.icon);
      const lastChanged = asText(one.last_changed);
      house.states[entityId] = {
        entity_id: entityId,
        state: asText(one.state),
        attributes,
        last_changed: lastChanged,
        last_updated: one.last_updated === undefined ? lastChanged : asText(one.last_updated),
      };
      house.entities[entityId] = {
        entity_id: entityId,
        ...(area ? { area_id: area.area_id } : {}),
        ...(one.icon !== undefined ? { icon: asText(one.icon) } : {}),
        labels: labels.map((label) => labelFor(house, label).label_id),
      };
      if (!added.includes(entityId)) added.push(entityId);
    }
  }
  return { house, added, problems };
}

/*
 * More of a house for the page than the card's four (#427): lights in rooms on two floors,
 * temperature and humidity around it, doors and motion, a few labels - something for a
 * repeat to sweep and a filter to narrow. Written in the own-entities format, so the format
 * is used by the page itself every time it loads.
 */
const MORE_OF_THE_HOUSE: Record<string, any> = {
  'light.kitchen_spots': {
    name: 'Kitchen spots',
    state: 'on',
    area: 'kitchen',
    attributes: { brightness: 255 },
    labels: ['evening'],
    last_changed: '2026-11-08T17:05:00+00:00',
  },
  'light.living_room_lamp': {
    name: 'Living room lamp',
    state: 'on',
    area: 'Living Room',
    floor: 'ground_floor',
    attributes: { brightness: 90 },
    labels: ['evening'],
    last_changed: '2026-11-08T16:40:00+00:00',
  },
  'light.living_room_ceiling': {
    name: 'Living room ceiling',
    state: 'off',
    area: 'Living Room',
    last_changed: '2026-11-08T08:15:00+00:00',
  },
  'light.hall': {
    name: 'Hall',
    state: 'off',
    area: 'Hall',
    floor: 'ground_floor',
    last_changed: '2026-11-08T07:30:00+00:00',
  },
  'light.landing': {
    name: 'Landing',
    state: 'on',
    area: 'Landing',
    floor: 'first_floor',
    attributes: { brightness: 40 },
    labels: ['evening', 'Night lights'],
    last_changed: '2026-11-08T18:00:00+00:00',
  },
  'light.bedroom_lamp': {
    name: 'Bedroom lamp',
    state: 'off',
    area: 'bedroom',
    labels: ['Night lights'],
    last_changed: '2026-11-08T06:55:00+00:00',
  },
  'light.study_desk': {
    name: 'Study desk',
    state: 'on',
    area: 'Study',
    floor: 'first_floor',
    attributes: { brightness: 200 },
    last_changed: '2026-11-08T09:10:00+00:00',
  },
  'sensor.kitchen_temperature': {
    name: 'Kitchen temperature',
    state: '21.4',
    area: 'kitchen',
    device_class: 'temperature',
    unit: '°C',
    state_class: 'measurement',
    labels: ['Climate'],
    last_changed: '2026-11-08T18:02:00+00:00',
  },
  'sensor.kitchen_humidity': {
    name: 'Kitchen humidity',
    state: '48',
    area: 'kitchen',
    device_class: 'humidity',
    unit: '%',
    state_class: 'measurement',
    labels: ['Climate'],
    last_changed: '2026-11-08T17:58:00+00:00',
  },
  'sensor.living_room_temperature': {
    name: 'Living room temperature',
    state: '20.1',
    area: 'Living Room',
    device_class: 'temperature',
    unit: '°C',
    state_class: 'measurement',
    labels: ['Climate'],
    last_changed: '2026-11-08T18:01:00+00:00',
  },
  'sensor.living_room_humidity': {
    name: 'Living room humidity',
    state: '45',
    area: 'Living Room',
    device_class: 'humidity',
    unit: '%',
    state_class: 'measurement',
    labels: ['Climate'],
    last_changed: '2026-11-08T17:50:00+00:00',
  },
  'sensor.bedroom_temperature': {
    name: 'Bedroom temperature',
    state: '18.7',
    area: 'bedroom',
    device_class: 'temperature',
    unit: '°C',
    state_class: 'measurement',
    labels: ['Climate'],
    last_changed: '2026-11-08T17:59:00+00:00',
  },
  'sensor.bedroom_humidity': {
    name: 'Bedroom humidity',
    state: '52',
    area: 'bedroom',
    device_class: 'humidity',
    unit: '%',
    state_class: 'measurement',
    labels: ['Climate'],
    last_changed: '2026-11-08T17:45:00+00:00',
  },
  'sensor.study_temperature': {
    name: 'Study temperature',
    state: '19.6',
    area: 'Study',
    device_class: 'temperature',
    unit: '°C',
    state_class: 'measurement',
    labels: ['Climate'],
    last_changed: '2026-11-08T18:03:00+00:00',
  },
  'sensor.bathroom_humidity': {
    name: 'Bathroom humidity',
    state: '71',
    area: 'Bathroom',
    floor: 'first_floor',
    device_class: 'humidity',
    unit: '%',
    state_class: 'measurement',
    labels: ['Climate'],
    last_changed: '2026-11-08T07:20:00+00:00',
  },
  'binary_sensor.front_door': {
    name: 'Front door',
    state: 'off',
    area: 'Hall',
    device_class: 'door',
    labels: ['Security'],
    last_changed: '2026-11-08T08:31:00+00:00',
  },
  'binary_sensor.hall_motion': {
    name: 'Hall motion',
    state: 'on',
    area: 'Hall',
    device_class: 'motion',
    labels: ['Security'],
    last_changed: '2026-11-08T18:04:00+00:00',
  },
  'binary_sensor.landing_motion': {
    name: 'Landing motion',
    state: 'off',
    area: 'Landing',
    device_class: 'motion',
    labels: ['Security'],
    last_changed: '2026-11-08T17:12:00+00:00',
  },
};

// The card's four, given the times they last changed.
const FOUR_CHANGED: Record<string, string> = {
  'light.kitchen_ceiling': '2026-11-08T16:30:00+00:00',
  'sensor.garden_temperature': '2026-11-08T18:00:00+00:00',
  'binary_sensor.bedroom_window': '2026-11-08T07:05:00+00:00',
  'input_select.house_mode': '2026-11-08T22:00:00+00:00',
};

function sampleHouse(): House {
  const base = copyHouse(SAMPLE_HOUSE as unknown as House);
  for (const [id, at] of Object.entries(FOUR_CHANGED)) {
    base.states[id] = { ...base.states[id], last_changed: at, last_updated: at };
  }
  return addEntities(base, MORE_OF_THE_HOUSE).house;
}

/** The house the docs page reads: the card's four entities and the rest of the house. */
export const DOCS_HOUSE: House = sampleHouse();

/** A house with no entities, areas, floors or labels, for "only my entities". */
const EMPTY_HOUSE: House = { ...DOCS_HOUSE, states: {}, entities: {}, devices: {}, areas: {}, floors: {}, labels: {} };

function readMapping(text: string, wrapper: string): { mapping: Record<string, any>; error?: string } {
  try {
    const documents = loadAll(text, { maxAliases: MAX_ALIASES }).filter((doc) => doc != null);
    let doc: any = documents[0] ?? {};
    if (doc && typeof doc === 'object' && !Array.isArray(doc) && Object.keys(doc).length === 1 && doc[wrapper]) {
      doc = doc[wrapper];
    }
    if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
      return { mapping: {}, error: 'should be a mapping, one entry per name' };
    }
    return { mapping: doc };
  } catch (err) {
    return { mapping: {}, error: (err as Error).message };
  }
}

/*
 * The last box read, kept so the house keeps its identity while only the variables or the
 * placeholder change - the registry index is keyed by that identity, and a new house on
 * every keystroke would have it worked out again each time for nothing.
 */
let lastEntities: { text: string; onlyMine: boolean; read: OwnEntities } | undefined;

/** The own-entities box read onto the sample house, or onto nothing when only they are wanted. */
export function ownEntities(text: string, onlyMine = false): OwnEntities {
  if (lastEntities && lastEntities.text === text && lastEntities.onlyMine === onlyMine) return lastEntities.read;
  const base = onlyMine ? EMPTY_HOUSE : DOCS_HOUSE;
  let read: OwnEntities;
  if (!text.trim()) read = { house: base, added: [], problems: [] };
  else {
    // The pieces the house is read from are swapped out, never edited: an earlier box's
    // registry index must not outlive the entities it was worked out for.
    const { mapping, error } = readMapping(text, 'ha_test_objects');
    read = error ? { house: base, added: [], problems: [], error } : addEntities(base, mapping);
  }
  lastEntities = { text, onlyMine, read };
  return read;
}

export interface ItemTemplates {
  templates: Record<string, TemplateConfig>;
  problems: string[];
  error?: string;
}

/**
 * The templates box, read as a `decluttering_templates:` mapping - with or without that key
 * around it - into the item templates `with:` and `repeat:` fill, `extends:` and all. Only
 * item templates: a card template needs the card around it, which the page cannot build.
 * Function templates (#307) come from the same box: a `function:` template is a step of its own.
 */
export function itemTemplates(text: string): ItemTemplates {
  if (!text.trim()) return { templates: {}, problems: [] };
  const { mapping, error } = readMapping(text, 'decluttering_templates');
  if (error) return { templates: {}, problems: [], error };
  const problems: string[] = [];
  const raw: Record<string, TemplateConfig> = Object.create(null);
  for (const [name, template] of Object.entries(mapping)) {
    if (!template || typeof template !== 'object' || Array.isArray(template)) {
      problems.push(`${name}: should be a mapping with an item: in it`);
    } else raw[name] = template as TemplateConfig;
  }
  const templates = itemTemplatesOf({ decluttering_templates: raw } as any);
  for (const name of Object.keys(raw)) {
    if (!(name in templates)) {
      problems.push(
        `${name}: has no item:, so with: and repeat: cannot fill it - card templates are built on Try a template`,
      );
    }
  }
  return { templates, problems };
}

export interface PageState {
  variables: string;
  placeholder: string;
  entities: string;
  onlyMine: boolean;
  templates: string;
}

export interface PageResult extends PlaygroundResult {
  entities: OwnEntities;
  templates: ItemTemplates;
}

/** Everything on the page at once: the house the boxes make, and the placeholder built in it. */
export function tryOnPage(state: PageState): PageResult {
  const entities = ownEntities(state.entities, state.onlyMine);
  const templates = itemTemplates(state.templates);
  let variables: any[];
  try {
    variables = readVariables(state.variables);
  } catch (err) {
    return { ...unreadable(err), entities, templates };
  }
  // Every state in the house can be read, as if the card listed each one in rebuild_on; the
  // ones written in the boxes also stand for themselves, as `[[light.hall|state]]`.
  const written = `${state.variables}\n${state.placeholder}\n${state.templates}`;
  const standing = Object.keys(entities.house.states).filter((id) => written.includes(id));
  const hass = withEveryStateReadable(entities.house, standing);
  const extras = { itemTemplates: templates.templates, context: { itemTemplates: templates.templates } };
  const build: PlaceholderBuild = (content, onMissing) =>
    deepReplace(variables, {}, content, undefined, hass, true, onMissing, 0, undefined, undefined, false, extras);
  return { ...tryPlaceholderWith(build, state.placeholder), entities, templates };
}

export interface HouseRow {
  entity: string;
  state: string;
  where: string;
  labels: string[];
  more: string[];
  own: boolean;
}

/** The house as the page's table shows it, so the table is never out of step with the data. */
export function houseRows(house: House, own: string[] = []): HouseRow[] {
  return Object.keys(house.states).map((id) => {
    const state = house.states[id];
    const entity = house.entities[id] ?? {};
    const device = entity.device_id ? house.devices[entity.device_id] : undefined;
    const area = house.areas[entity.area_id ?? device?.area_id ?? ''];
    const floor = area?.floor_id ? house.floors[area.floor_id] : undefined;
    const more: string[] = [];
    const { friendly_name: name, unit_of_measurement: unit, ...attributes } = state.attributes ?? {};
    if (name) more.push(`named ${name}`);
    for (const [key, value] of Object.entries(attributes)) {
      more.push(`${key} ${Array.isArray(value) ? value.join(', ') : String(value)}`);
    }
    if (unit) more.push(`in ${unit}`);
    if (entity.icon && !attributes.icon) more.push(`icon ${entity.icon}`);
    if (device) {
      more.push(
        `device ${device.name}${device.manufacturer ? ` by ${device.manufacturer}` : ''}${device.model ? ` (${device.model})` : ''}`,
      );
    }
    const where = area
      ? `${area.name}${floor ? `, ${floor.name}` : ', on no floor'}${device && !entity.area_id ? " (its device's)" : ''}`
      : '';
    return {
      entity: id,
      state: String(state.state ?? ''),
      where,
      labels: [...(entity.labels ?? []), ...(device?.labels ?? [])].map(
        (label: string) => house.labels[label]?.name ?? label,
      ),
      more,
      own: own.includes(id),
    };
  });
}
