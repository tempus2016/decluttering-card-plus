import { loadAll } from 'js-yaml';
import deepReplace from './deep-replace';
import { ownVariables, withStateScope } from './variables';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * "Try a placeholder" on the docs site (discussion #216). People asked what a step gives
 * back - text, a number, a yes or no, a list - and what comes out at each point of a long
 * chain, without having to build a card to find out. So this takes some variables and a
 * placeholder and runs them through the card's own substitution, deepReplace, once for
 * each step of the chain: `[[n]]`, then `[[n|add:1]]`, then `[[n|add:1|mul:2]]`. Nothing
 * here imitates the card, so nothing here can disagree with it.
 *
 * The steps that ask Home Assistant - area, state, friendly_name - need a Home Assistant,
 * and a web page has none, so they read a small made-up house instead: SAMPLE_HOUSE. The
 * sandbox dashboard in examples/ is the same idea run against your own.
 */

const MAX_ALIASES = 50;

export type Kind = 'text' | 'number' | 'boolean' | 'list' | 'mapping' | 'null' | 'unresolved' | 'removed';

export interface StepResult {
  /** The placeholder up to and including this step. */
  written: string;
  /** The step itself, or the variable's name for the first row. */
  step: string;
  value: unknown;
  kind: Kind;
}

export interface PlaygroundResult {
  error?: string;
  /** One row per step, when the expression is a single placeholder. */
  steps: StepResult[];
  /** What the whole expression gives as the entire value of an option. */
  whole: { value: unknown; kind: Kind };
  /** What it gives written inside a longer piece of text, where everything is text. */
  inText?: string;
  /** Variables the expression asked for that nothing set. */
  unset: string[];
}

const SAMPLE_ENTITIES = [
  'light.kitchen_ceiling',
  'sensor.garden_temperature',
  'binary_sensor.bedroom_window',
  'input_select.house_mode',
];

/*
 * The made-up house the Home Assistant steps read. Small enough to describe on the page in
 * a table, and with one of everything a step can ask for: an entity whose area comes from
 * its device, one with its own area, a floor, a label, a device with a maker and a model.
 */
export const SAMPLE_HOUSE = {
  states: {
    'light.kitchen_ceiling': {
      entity_id: 'light.kitchen_ceiling',
      state: 'on',
      attributes: { friendly_name: 'Kitchen ceiling', brightness: 180 },
    },
    'sensor.garden_temperature': {
      entity_id: 'sensor.garden_temperature',
      state: '14.6',
      attributes: { friendly_name: 'Garden temperature', unit_of_measurement: '°C', device_class: 'temperature' },
    },
    'binary_sensor.bedroom_window': {
      entity_id: 'binary_sensor.bedroom_window',
      state: 'off',
      attributes: { friendly_name: 'Bedroom window', device_class: 'window' },
    },
    'input_select.house_mode': {
      entity_id: 'input_select.house_mode',
      state: 'night',
      attributes: { friendly_name: 'House mode', options: ['day', 'night', 'away'] },
    },
  },
  entities: {
    'light.kitchen_ceiling': { entity_id: 'light.kitchen_ceiling', device_id: 'kitchen_hue', labels: ['evening'] },
    'sensor.garden_temperature': { entity_id: 'sensor.garden_temperature', device_id: 'garden_aqara', labels: [] },
    'binary_sensor.bedroom_window': {
      entity_id: 'binary_sensor.bedroom_window',
      area_id: 'bedroom',
      icon: 'mdi:window-closed-variant',
      labels: [],
    },
    'input_select.house_mode': { entity_id: 'input_select.house_mode', labels: [] },
  },
  devices: {
    kitchen_hue: {
      id: 'kitchen_hue',
      name: 'Hue ceiling',
      manufacturer: 'Signify',
      model: 'Hue White',
      area_id: 'kitchen',
    },
    garden_aqara: {
      id: 'garden_aqara',
      name: 'Garden sensor',
      manufacturer: 'Aqara',
      model: 'WSDCGQ11LM',
      area_id: 'back_garden',
    },
  },
  areas: {
    kitchen: { area_id: 'kitchen', name: 'Kitchen', floor_id: 'ground_floor', icon: 'mdi:fridge' },
    back_garden: { area_id: 'back_garden', name: 'Back Garden', floor_id: null, icon: null },
    bedroom: { area_id: 'bedroom', name: 'Bedroom', floor_id: 'first_floor', icon: 'mdi:bed' },
  },
  floors: {
    ground_floor: { floor_id: 'ground_floor', name: 'Ground floor', icon: 'mdi:home-floor-0' },
    first_floor: { floor_id: 'first_floor', name: 'First floor', icon: 'mdi:home-floor-1' },
  },
  labels: { evening: { label_id: 'evening', name: 'Evening lights' } },
  language: 'en',
  locale: { language: 'en' },
  localize: (): string => '',
};

// Every sample entity can have its state read, as if each card listed it in rebuild_on.
const HOUSE = withStateScope(SAMPLE_HOUSE, SAMPLE_ENTITIES);

export function kindOf(value: unknown): Kind {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'list';
  if (typeof value === 'object') return 'mapping';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'string' && /\[\[[^\]]/.test(value)) return 'unresolved';
  return 'text';
}

/*
 * A single placeholder taken apart at its own pipes - not the ones inside a nested
 * placeholder, `add:[[offset]]`, which belong to that. Undefined when the expression is
 * not exactly one placeholder: text around it, or two of them.
 */
export function splitPlaceholder(expression: string): { name: string; steps: string[]; optional: boolean } | undefined {
  const text = expression.trim();
  if (!text.startsWith('[[') || !text.endsWith(']]')) return undefined;
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (let at = 2; at < text.length - 2; at += 1) {
    const two = text.slice(at, at + 2);
    if (two === '[[') {
      depth += 1;
      current += two;
      at += 1;
    } else if (two === ']]') {
      if (depth === 0) return undefined; // this placeholder closed early: there is more than one
      depth -= 1;
      current += two;
      at += 1;
    } else if (text[at] === '|' && depth === 0) {
      parts.push(current);
      current = '';
    } else current += text[at];
  }
  if (depth !== 0) return undefined;
  parts.push(current);
  const last = parts.length - 1;
  const optional = parts[last].endsWith('?');
  if (optional) parts[last] = parts[last].slice(0, -1);
  return { name: parts[0], steps: parts.slice(1), optional };
}

function build(variables: any[], expression: string, unset: Set<string>): { value: unknown; removed: boolean } {
  const out = deepReplace(variables, {}, { value: expression }, undefined, HOUSE, true, (names) =>
    // Named as the placeholder was written; the variable is what comes before any step.
    names.forEach((name) => unset.add(name.split('|')[0].replace(/\?$/, ''))),
  );
  return { value: out?.value, removed: !out || !('value' in out) };
}

function result(built: { value: unknown; removed: boolean }): { value: unknown; kind: Kind } {
  return built.removed ? { value: undefined, kind: 'removed' } : { value: built.value, kind: kindOf(built.value) };
}

/** Read the variables, then build the expression, and each step of it when it is one placeholder. */
export function tryPlaceholder(variablesText: string, expression: string): PlaygroundResult {
  let variables: any[];
  try {
    const documents = loadAll(variablesText, { maxAliases: MAX_ALIASES }).filter((doc) => doc != null);
    variables = documents.length ? ownVariables(documents[0]) : [];
  } catch (err) {
    return { error: (err as Error).message, steps: [], whole: { value: undefined, kind: 'unresolved' }, unset: [] };
  }

  const unset = new Set<string>();
  const whole = result(build(variables, expression, unset));
  const inText = build(variables, `<${expression}>`, new Set());
  const steps: StepResult[] = [];
  const split = splitPlaceholder(expression);
  if (split && split.steps.length) {
    for (let count = 0; count <= split.steps.length; count += 1) {
      const chain = [split.name, ...split.steps.slice(0, count)].join('|');
      const written = `[[${chain}${count === split.steps.length && split.optional ? '?' : ''}]]`;
      steps.push({
        written,
        step: count === 0 ? split.name : split.steps[count - 1],
        ...result(build(variables, written, new Set())),
      });
    }
  }
  return {
    steps,
    whole,
    // The brackets show where it starts and ends; they are not part of what it gives.
    inText: typeof inText.value === 'string' ? inText.value.slice(1, -1) : undefined,
    unset: [...unset],
  };
}
