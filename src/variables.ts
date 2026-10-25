import { TemplateConfig, VariablesConfig } from './types';
import { labelName } from './labels';
import { localize } from './localize';

/* eslint-disable @typescript-eslint/no-explicit-any */

// A template can describe each of its variables rather than just giving it a default, so
// that the card instance editor can offer the right control instead of a box of YAML.
export interface VariableDeclaration {
  name: string;
  label?: string;
  description?: string;
  /** A Home Assistant selector, in the same shape ha-form takes. */
  selector?: any;
  default?: any;
  /** `default:` spelled plural, read the same; `default:` wins when both are written. */
  defaults?: any;
  /** Whether the template is unusable without it. Warns; it never blocks a save. */
  required?: boolean;
  /** A regular expression the value must match. Warns; it never blocks a save. */
  pattern?: string;
  /** The values this variable can take. Warns; it never blocks a save. */
  allowed?: unknown[];
  /** Declarations sharing a group fold into one collapsible section of the editor. */
  group?: string;
  /** What kind of value it takes - see VARIABLE_TYPES - which picks its editor control. */
  type?: string;
  /** `type: entity`: the domains it may come from, one or a list. */
  domain?: string | string[];
  /** `type: entity`: the device class it must have, one or a list. */
  device_class?: string | string[];
  /** `type: number`: the range, the step between values, and the unit shown beside it. */
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  /** `type: text`: a box with room for more than one line. */
  multiline?: boolean;
}

/**
 * Whether a declaration takes a whole card as its value - `selector: {card: {}}` - which
 * the editor answers with a real card picker rather than a box of YAML. Substitution has
 * always injected a mapping whole; this is the editor catching up with it.
 */
export function isCardDeclaration(declaration: VariableDeclaration | undefined): boolean {
  const selector = declaration?.selector;
  return !!selector && typeof selector === 'object' && 'card' in selector;
}

/**
 * Declarations gathered by their `group:`, in order of first appearance, the ungrouped
 * ones first - they are the essentials, and the groups are the detail behind them.
 */
export function groupDeclarations(
  declarations: VariableDeclaration[],
): { group: string | undefined; declarations: VariableDeclaration[] }[] {
  const buckets: { group: string | undefined; declarations: VariableDeclaration[] }[] = [
    { group: undefined, declarations: [] },
  ];
  for (const declaration of declarations) {
    const group = typeof declaration.group === 'string' && declaration.group ? declaration.group : undefined;
    let bucket = buckets.find((each) => each.group === group);
    if (!bucket) {
      bucket = { group, declarations: [] };
      buckets.push(bucket);
    }
    bucket.declarations.push(declaration);
  }
  return buckets.filter((each) => each.declarations.length > 0);
}

/*
 * A declaration can say what kind of value it takes, which is shorter to write than the
 * Home Assistant selector it stands for and reads as what it means: `type: entity` with a
 * `domain:`, `type: number` with a range. Colours are Home Assistant's own named colours
 * (`ui_color`) - `red`, `amber`, `primary` - which is what a tile's `color:` takes.
 */
export const VARIABLE_TYPES = ['entity', 'number', 'boolean', 'icon', 'color', 'text', 'select'];

// What has already been said about a type nobody knows, so the editor does not repeat it on
// every keystroke - it re-renders on every state change Home Assistant sends.
const unknownTypesSaid = new Set<string>();

/** The things a declaration narrows an entity by, with only the ones it wrote. */
function entityFilter(declaration: VariableDeclaration): Record<string, unknown> | undefined {
  const filter: Record<string, unknown> = {};
  if (declaration.domain !== undefined) filter.domain = declaration.domain;
  if (declaration.device_class !== undefined) filter.device_class = declaration.device_class;
  return Object.keys(filter).length ? filter : undefined;
}

/*
 * A variable that can only take a handful of values is offered them, rather than a text
 * box that warns afterwards.
 */
function allowedSelector(declaration: VariableDeclaration): unknown {
  if (!Array.isArray(declaration.allowed) || !declaration.allowed.length) return undefined;
  const options = declaration.allowed.map((each) => ({ value: String(each), label: String(each) }));
  return { select: { mode: 'dropdown', options } };
}

/** The selector a declaration's `type:` stands for, or undefined when it has none to offer. */
function typeSelector(declaration: VariableDeclaration): unknown {
  const { type } = declaration;
  if (type === undefined) return undefined;
  switch (type) {
    case 'entity': {
      const filter = entityFilter(declaration);
      return { entity: filter ? { filter } : {} };
    }
    case 'number': {
      const number: Record<string, unknown> = {};
      // A slider needs both ends; without them a box takes any number.
      number.mode = typeof declaration.min === 'number' && typeof declaration.max === 'number' ? 'slider' : 'box';
      for (const key of ['min', 'max', 'step'] as const) {
        if (typeof declaration[key] === 'number') number[key] = declaration[key];
      }
      if (typeof declaration.unit === 'string') number.unit_of_measurement = declaration.unit;
      return { number };
    }
    case 'boolean':
      return { boolean: {} };
    case 'icon':
      return { icon: {} };
    case 'color':
      return { ui_color: {} };
    case 'text':
      return { text: declaration.multiline === true ? { multiline: true } : {} };
    case 'select':
      // Only a list of values makes a dropdown; without one it is the text box it would have been.
      return allowedSelector(declaration);
  }
  const said = `${declaration.name}\u0000${String(type)}`;
  if (!unknownTypesSaid.has(said)) {
    unknownTypesSaid.add(said);
    console.warn(
      localize('warn.unknown_type', { name: declaration.name, type: String(type), types: VARIABLE_TYPES.join(', ') }),
    );
  }
  return undefined;
}

/**
 * The control a declared variable gets in the card editor. An explicit selector still wins
 * - the template author may want something else entirely - then what `type:` stands for,
 * then a dropdown of the `allowed:` values, then a text box.
 */
export function declarationSelector(declaration: VariableDeclaration): unknown {
  return declaration.selector ?? typeSelector(declaration) ?? allowedSelector(declaration) ?? { text: {} };
}

// The words `bool` reads, either way. A typed boolean holding anything else is a mistake.
const BOOLEAN_WORDS = new Set(['true', 'false', 'yes', 'no', 'on', 'off', '1', '0']);

const ICON_SHAPE = /^[a-z0-9_-]+:[a-z0-9_-]+$/i;

/** A value or a list of them, as a list. */
function asList(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return (Array.isArray(value) ? value : [value]).map((each) => String(each));
}

/**
 * What a value was expected to be, in words, when it does not fit its declaration's type -
 * undefined when it fits, or when there is nothing to check. A device class can only be
 * read off an entity Home Assistant knows, so without one it is not judged.
 */
function typeMismatch(declaration: VariableDeclaration, value: unknown, hass?: any): string | undefined {
  switch (declaration.type) {
    case 'entity': {
      const text = String(value);
      const shape = ENTITY_ID_SHAPE.exec(text);
      const domains = asList(declaration.domain);
      if (!shape) {
        return domains.length
          ? localize('type.entity_in', { domains: domains.join(', ') }, hass)
          : localize('type.entity', undefined, hass);
      }
      if (domains.length && !domains.includes(shape[1])) {
        return localize('type.entity_in', { domains: domains.join(', ') }, hass);
      }
      const classes = asList(declaration.device_class);
      const found = hass?.states?.[text]?.attributes?.device_class;
      if (classes.length && hass?.states?.[text] && !classes.includes(String(found))) {
        return localize('type.entity_class', { device_class: classes.join(', ') }, hass);
      }
      return undefined;
    }
    case 'number': {
      const number = typeof value === 'number' ? value : String(value).trim() === '' ? NaN : Number(value);
      const { min, max } = declaration;
      const hasMin = typeof min === 'number';
      const hasMax = typeof max === 'number';
      const expected =
        hasMin && hasMax
          ? localize('type.number_range', { min, max }, hass)
          : hasMin
            ? localize('type.number_min', { min }, hass)
            : hasMax
              ? localize('type.number_max', { max }, hass)
              : localize('type.number', undefined, hass);
      if (!Number.isFinite(number)) return expected;
      if ((hasMin && number < (min as number)) || (hasMax && number > (max as number))) return expected;
      return undefined;
    }
    case 'boolean':
      if (typeof value === 'boolean') return undefined;
      return BOOLEAN_WORDS.has(String(value).trim().toLowerCase())
        ? undefined
        : localize('type.boolean', undefined, hass);
    case 'icon':
      return ICON_SHAPE.test(String(value)) ? undefined : localize('type.icon', undefined, hass);
  }
  return undefined;
}

const PLACEHOLDER_SOURCE = '\\[\\[([^[\\]]+)\\]\\]';

/*
 * A placeholder written `[[!name]]` is a literal `[[name]]` rather than a variable: the
 * bang is dropped once every substitution is done. It is the only way to write those
 * brackets and mean them, which a template holding markdown or Jinja sometimes needs.
 */
export const ESCAPE = '!';

/*
 * The escape is the opening brackets with the bang after them, closed or not. It used to
 * need its `]]` as well, which left a lone `[[` from one place free to meet a `?]]` from
 * another and read as a placeholder between them (review 2026-10-18).
 */
const ESCAPED_SOURCE = `\\[\\[${ESCAPE}`;

/** Whether anything in this text is an escaped placeholder waiting to be unwrapped. */
export function hasEscape(text: string): boolean {
  return new RegExp(ESCAPED_SOURCE).test(text);
}

/** Every `[[!name]]` written out as the `[[name]]` it stands for. */
export function unescapePlaceholders(text: string): string {
  return text.replace(new RegExp(ESCAPED_SOURCE, 'g'), '[[');
}

// The cards that consume a template, as opposed to the ones that define it. Here rather than
// with the template code because substitution has to know them: what is handed to one of
// these is going to be substituted again, by it.
export const CONSUMER_TYPES = ['custom:decluttering-card-plus', 'custom:decluttering-card'];

/*
 * Text that came from Home Assistant rather than from the template: a friendly name, an
 * attribute, a device's model, a label. It is somebody's words and is shown as written,
 * so anything in it shaped like a placeholder is escaped here, once, where it comes in.
 * Without this a device named `[[model|json|bool]]` by whatever registered it - MQTT
 * discovery will take any name - is read as template code on the next pass and rewrites
 * the card for everyone who views the dashboard. Every `[[` is escaped, not only the ones
 * with a `]]` after them: a device named `[[zz` beside a model named `?]]` would otherwise
 * form one placeholder once both are written in (review 2026-10-18). A text with no `[[` in
 * it is returned as it was, so the common case costs one regex test.
 */
export function asHaText<T>(value: T): T {
  if (typeof value === 'string') {
    return value.replace(/\[\[/g, `[[${ESCAPE}`) as unknown as T;
  }
  if (Array.isArray(value)) return value.map(asHaText) as unknown as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) out[key] = asHaText(entry);
    return out as T;
  }
  return value;
}

/*
 * A placeholder written `[[name?]]` is one the template can do without: when nothing gives
 * it a value, the option it stands for is dropped from the card rather than left showing
 * the brackets. It is what lets one template serve a room with four lights and a room with
 * one, without a dummy entity id standing in for the lights that are not there.
 */
export const OPTIONAL = '?';

/** Matches the optional marker at the end of a placeholder, after any transform chain. */
export const OPTIONAL_SUFFIX = `(\\${OPTIONAL})?`;

const OPTIONAL_TAIL = new RegExp(`\\${OPTIONAL}$`);

/** A placeholder with its optional marker taken off, if it had one. */
export function withoutOptional(inside: string): string {
  return inside.replace(OPTIONAL_TAIL, '');
}

/** Whether this placeholder said the card can do without it. */
export function isOptional(inside: string): boolean {
  return OPTIONAL_TAIL.test(inside);
}

/**
 * The placeholder grammar, owned here so that substitution, dependency scanning and the
 * suggestion pass cannot drift apart. Fresh and non-global, so it carries no lastIndex.
 */
export const PLACEHOLDER = new RegExp(PLACEHOLDER_SOURCE);

/*
 * A placeholder can ask for its value in a different shape - `[[room|slug]]` alongside
 * `[[room]]` - which is what lets one variable serve both a name and the entity id built
 * from it. The set is deliberately closed: an unrecognised word after the bar is not a
 * transform, so nothing is substituted and the mistake is visible rather than silent.
 */
export const TRANSFORMS: Record<string, (value: string) => string> = {
  slug: (value) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, ''),
  upper: (value) => value.toUpperCase(),
  lower: (value) => value.toLowerCase(),
  title: (value) => value.replace(/\S+/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase()),
  kebab: (value) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, ''),
  trim: (value) => value.trim(),
  // First letter only - `title` capitalises every word, which is wrong for a sentence.
  capitalize: (value) => (value ? value[0].toUpperCase() + value.slice(1) : value),
};

/*
 * The one step that takes a mapping or a list on purpose. Every other transform shapes
 * text and refuses anything else, which leaves no way to put a mapping into a markdown
 * card even when that is exactly what is wanted - `json` is that way.
 */
export const JSON_STEP = 'json';

/*
 * `bool` turns a value into a yes or a no - `enabled: '[[link|bool]]'` switches a button
 * on when the card was given a link and off when it was not (discussion #142). Two things
 * set it apart from the text transforms: it has an answer for a variable nothing sets,
 * which is "no", and when it ends the chain of a whole value it puts a real true or false
 * there rather than the words, because a card checking `enabled` reads the word "false"
 * as switched on.
 */
export const BOOL_STEP = 'bool';

// Words that mean no, as people and Home Assistant write them. Anything else with
// something in it means yes.
const FALSE_WORDS = new Set(['', 'false', 'no', 'off', '0']);

/** Whether a value counts as a yes, read the way the `bool` step reads it. */
export function truthy(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0 && !Number.isNaN(value);
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return !FALSE_WORDS.has(String(value).trim().toLowerCase());
}

/*
 * Two more yes-or-no steps (#210). `exists` asks whether Home Assistant knows the entity
 * the value names - `[[motion|exists]]` - so a template can leave out a sensor some rooms
 * do not have. `contains:text` asks whether the value has that text in it, or, for a list,
 * whether one of its items is exactly that: `[[entity|labels|split|contains:Outdoor]]`.
 * Like `bool`, both have an answer for a variable nothing sets, which is no.
 */
export const EXISTS_STEP = 'exists';
const CONTAINS_STEP = 'contains';

/** Whether a step answers yes or no. */
function isYesNoStep(step: string): boolean {
  return step === BOOL_STEP || step === EXISTS_STEP || stepName(step) === CONTAINS_STEP;
}

/** Whether a chain ends in a yes or a no, so a whole value should become a real true or false. */
export function yieldsBoolean(chain: string | undefined): boolean {
  return !!chain && isYesNoStep(chain.split('|').pop() as string);
}

/** Whether a step has an answer for a variable nothing sets. */
export function answersUnset(step: string): boolean {
  // `count` has an answer too: nothing is none of anything.
  return isFallback(step) || isYesNoStep(step) || step === COUNT_STEP;
}

/** Whether Home Assistant knows this entity, or undefined when there is no Home Assistant to ask. */
function entityExists(entityId: string, hass: any): boolean | undefined {
  if (!hass?.states) return undefined;
  const id = entityId.trim();
  return (
    Object.prototype.hasOwnProperty.call(hass.states, id) ||
    (!!hass.entities && Object.prototype.hasOwnProperty.call(hass.entities, id))
  );
}

/*
 * Arithmetic: `[[index|sub:1|mul:12|add:4]]%` places the nth picture-elements
 * icon without a helper entity or a Jinja template for each. The number comes after the
 * colon and is written as one; `round` rounds to a whole number, `round:2` to two places,
 * and `pad:3` writes a whole number zero-padded to three digits. A value that is not a
 * number is left exactly as it was - a visible clue rather than a silent zero - and the
 * console says why, once.
 */
const ARITHMETIC: Record<string, (value: number, by: number) => number | undefined> = {
  add: (value, by) => value + by,
  sub: (value, by) => value - by,
  mul: (value, by) => value * by,
  // Nothing divides by zero; the value is left as it was, the same as for a bad argument.
  div: (value, by) => (by === 0 ? undefined : value / by),
  mod: (value, by) => (by === 0 ? undefined : value % by),
};

const ROUND_STEP = 'round';
const PAD_STEP = 'pad';

// Arithmetic steps that can also be written bare, with no argument.
const NUMBER_BARE_STEPS = [ROUND_STEP];

// Steps that take an argument after a colon and are worked out here rather than in PARAM_TRANSFORMS.
const NUMBER_PARAM_STEPS = [...Object.keys(ARITHMETIC), ROUND_STEP, PAD_STEP];

/*
 * Lists. `join` writes a list as text, `split` makes one out of text, `first`,
 * `last` and `count` read one. A list variable is read as itself; text is read as a
 * comma-separated list - which is what `[[entity|labels]]` gives - so `|first` and `|count`
 * work on either. A step that shapes text, put after `split`, shapes each item:
 * `[[rooms|split|slug|join:,]]`.
 */
const JOIN_STEP = 'join';
const SPLIT_STEP = 'split';
const FIRST_STEP = 'first';
const LAST_STEP = 'last';
const COUNT_STEP = 'count';

const LIST_BARE_STEPS = [JOIN_STEP, SPLIT_STEP, FIRST_STEP, LAST_STEP, COUNT_STEP];

// The two that also take an argument: the separator.
const LIST_PARAM_STEPS = [JOIN_STEP, SPLIT_STEP];

const DEFAULT_JOIN = ', ';
const DEFAULT_SPLIT = ',';

/** Whether a step reads or makes a list, written bare or with its separator. */
function isListStep(step: string): boolean {
  const colon = step.indexOf(':');
  return colon === -1 ? LIST_BARE_STEPS.includes(step) : LIST_PARAM_STEPS.includes(step.slice(0, colon));
}

/** Text read as a list: split on the separator, each item trimmed, the empty ones left out. */
function splitText(text: string, separator: string): string[] {
  return text
    .split(separator || DEFAULT_SPLIT)
    .map((item) => item.trim())
    .filter((item) => item !== '');
}

/** One item of a list as text - a mapping as its JSON, a gap as nothing. */
function itemText(item: unknown): string {
  if (item === undefined || item === null) return '';
  return typeof item === 'object' ? JSON.stringify(item) : String(item);
}

/** Whether a chain starting with this step takes a mapping or a list whole, rather than as text. */
export function takesStructure(step: string, value: unknown): boolean {
  if (step === JSON_STEP || step === BOOL_STEP) return true;
  if (stepName(step) === CONTAINS_STEP) return Array.isArray(value);
  // A mapping has a size, and nothing else a list step reads.
  return Array.isArray(value) ? isListStep(step) : step === COUNT_STEP;
}

// The steps whose answer is a number, so a whole value they end goes in as a real one.
const NUMBER_RESULTS = new Set([...Object.keys(ARITHMETIC), ROUND_STEP, COUNT_STEP, 'find']);

// How a number is written, generously: what people type, and what a sensor reports.
const NUMBER_TEXT = /^\s*[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?\s*$/i;

// How a number is written in JSON, which is all that may go into the card's config bare.
const JSON_NUMBER = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][-+]?\d+)?$/;

/** The number a piece of text writes, or undefined when it writes something else. */
function asNumber(text: string): number | undefined {
  if (!NUMBER_TEXT.test(text)) return undefined;
  const value = Number(text);
  return Number.isFinite(value) ? value : undefined;
}

/*
 * A sum written out the way a person would: 0.1 + 0.2 is 0.3, not 0.30000000000000004 -
 * fifteen significant digits is past anything a dashboard positions or shows - and minus
 * zero is zero.
 */
function numberText(value: number): string {
  const tidy = Number(value.toPrecision(15));
  return String(Object.is(tidy, -0) ? 0 : tidy);
}

// Each complaint once per page: a dashboard of copies would otherwise say it once a copy.
const warnedAbout = new Set<string>();

function warnOnce(key: string, step: string, value: string, hass?: any): void {
  const id = `${key}|${step}|${value}`;
  if (warnedAbout.has(id)) return;
  warnedAbout.add(id);
  console.warn(localize(key, { step, value }, hass));
}

/** Rounded to so many places, written with exactly that many - `round:2` of 2.5 is 2.50. */
function rounded(value: number, places: number): string {
  if (!places) return numberText(Math.round(value));
  // Shifted by the exponent rather than multiplied, so 1.005 rounds to 1.01 as written.
  const shifted = Math.round(Number(`${value}e${places}`));
  const back = Number(`${shifted}e-${places}`);
  return (Number.isFinite(back) ? back : value).toFixed(places);
}

/**
 * One arithmetic step applied, or undefined when the step is not one. A value or argument
 * it cannot use leaves the value exactly as it was, and says so in the console.
 */
function numberStep(step: string, text: string, hass?: any): string | undefined {
  const colon = step.indexOf(':');
  const name = colon === -1 ? step : step.slice(0, colon);
  if (!NUMBER_PARAM_STEPS.includes(name) || (colon === -1 && !NUMBER_BARE_STEPS.includes(name))) return undefined;
  const arg = colon === -1 ? undefined : step.slice(colon + 1);

  if (name === PAD_STEP) {
    const width = Number(arg);
    if (!Number.isInteger(width) || width < 1 || width > 64) {
      warnOnce('warn.bad_number_argument', step, text, hass);
      return text;
    }
    const whole = text.trim();
    if (!/^[-+]?\d+$/.test(whole)) {
      warnOnce('warn.not_a_whole_number', step, text, hass);
      return text;
    }
    const sign = whole.startsWith('-') ? '-' : '';
    const digits = whole.replace(/^[-+]/, '');
    return sign + digits.padStart(width - sign.length, '0');
  }

  const value = asNumber(text);
  if (value === undefined) {
    warnOnce('warn.not_a_number', step, text, hass);
    return text;
  }

  if (name === ROUND_STEP) {
    const places = arg === undefined ? 0 : Number(arg);
    if (!Number.isInteger(places) || places < 0 || places > 15) {
      warnOnce('warn.bad_number_argument', step, text, hass);
      return text;
    }
    return rounded(value, places);
  }

  const by = arg === undefined ? undefined : asNumber(arg);
  const result = by === undefined ? undefined : ARITHMETIC[name](value, by);
  if (result === undefined || !Number.isFinite(result)) {
    warnOnce('warn.bad_number_argument', step, text, hass);
    return text;
  }
  return numberText(result);
}

/** Whether a step is one of the arithmetic ones, written bare or with its argument. */
function isNumberStep(step: string): boolean {
  const colon = step.indexOf(':');
  return colon === -1 ? NUMBER_BARE_STEPS.includes(step) : NUMBER_PARAM_STEPS.includes(step.slice(0, colon));
}

/** The name a step goes by, without its argument. */
export function stepName(step: string): string {
  const colon = step.indexOf(':');
  return colon === -1 ? step : step.slice(0, colon);
}

/*
 * Whether a chain ends in a number, so a whole value it shapes goes in as a real one - the
 * way `bool` puts a real true or false there - rather than as text a card reading a number
 * would trip over. The last step that does something to the value decides: a `default:`
 * after it only stands in when there was nothing, and the text it gives is checked anyway.
 */
export function yieldsNumber(chain: string | undefined): boolean {
  if (!chain) return false;
  const doing = chain.split('|').filter((step) => !isFallback(step) && !isCondition(step));
  const last = doing[doing.length - 1];
  return last !== undefined && NUMBER_RESULTS.has(stepName(last));
}

/*
 * Whether a chain ends in a list - `split`, and anything after it that shapes each item -
 * so a whole value it shapes goes in as a real list rather than its text.
 */
export function yieldsList(chain: string | undefined): boolean {
  if (!chain) return false;
  let list = false;
  for (const step of chain.split('|')) {
    if (isFallback(step) || isCondition(step)) continue;
    if (stepName(step) === SPLIT_STEP) list = true;
    else if (isListStep(step) || isYesNoStep(step) || step === JSON_STEP) list = false;
  }
  return list;
}

/** Whether a shaped value can go into the card's JSON as a bare number. */
export function isJsonNumber(text: string): boolean {
  return JSON_NUMBER.test(text);
}

const TRANSFORM_NAMES = [
  ...Object.keys(TRANSFORMS),
  JSON_STEP,
  BOOL_STEP,
  EXISTS_STEP,
  ...NUMBER_BARE_STEPS,
  ...LIST_BARE_STEPS,
].join('|');

/*
 * Some of what a template wants is not in the card's config at all - it is in Home
 * Assistant. Wanting a tile's name to default to the entity's own name is the single
 * most asked-for thing this card does not do, and it does not need a template engine:
 * it is the same "give me this value in a different shape" the transforms already are,
 * with the shape coming from the registry.
 *
 * The entity's state is the one exception, and a narrow one. Substitution builds the card's
 * config once, so resolving state for any entity would mean rebuilding the whole card on
 * every state change. `state` only answers for an entity the card lists in `rebuild_on:` -
 * the card watches exactly those and builds again when one of them changes - and for any
 * other entity it has nothing to give. Everything else here comes from the registry and
 * changes about as often as the dashboard does.
 */
export const RESOLVERS: Record<string, (entityId: string, hass: any) => string | undefined> = {
  state: (entityId, hass) => (stateAllowed(hass, entityId) ? hass?.states?.[entityId]?.state : undefined),
  friendly_name: (entityId, hass) => {
    const entity = hass?.entities?.[entityId];
    return hass?.states?.[entityId]?.attributes?.friendly_name ?? entity?.name ?? entity?.original_name;
  },
  area: (entityId, hass) => {
    const entity = hass?.entities?.[entityId];
    const areaId = entity?.area_id ?? hass?.devices?.[entity?.device_id]?.area_id;
    return areaId ? hass?.areas?.[areaId]?.name : undefined;
  },
  device: (entityId, hass) => {
    const entity = hass?.entities?.[entityId];
    const device = hass?.devices?.[entity?.device_id];
    return device?.name_by_user ?? device?.name;
  },
  floor: (entityId, hass) => {
    const entity = hass?.entities?.[entityId];
    const areaId = entity?.area_id ?? hass?.devices?.[entity?.device_id]?.area_id;
    const floorId = areaId ? hass?.areas?.[areaId]?.floor_id : undefined;
    return floorId ? hass?.floors?.[floorId]?.name : undefined;
  },
  // The ids underneath the names. A name is for showing; an id is for building another
  // entity id out of - `binary_sensor.[[entity|area_id]]_motion` - which is the other half
  // of what people template with.
  area_id: (entityId, hass) => {
    const entity = hass?.entities?.[entityId];
    return entity?.area_id ?? hass?.devices?.[entity?.device_id]?.area_id;
  },
  device_id: (entityId, hass) => hass?.entities?.[entityId]?.device_id,
  // The two halves of the entity id itself, no registry needed. A value not shaped like
  // an entity id has no halves to give, so the placeholder stays visible.
  domain: (entityId) => ENTITY_ID_SHAPE.exec(entityId)?.[1],
  object_id: (entityId) => ENTITY_ID_SHAPE.exec(entityId)?.[2],
  // The names of the labels the entity carries, joined for showing. A label the registry
  // does not name keeps its id - a visible stand-in beats a silent hole in the list.
  labels: (entityId, hass) => {
    const ids: string[] = hass?.entities?.[entityId]?.labels ?? [];
    if (!ids.length) return undefined;
    return ids.map((id) => labelName(hass, id)).join(', ');
  },
  /*
   * The icon the entity shows: the one set on it in the registry, else the one its state
   * carries. An entity with neither shows its domain's icon, which is not something to
   * write in - so it gives the empty string, and `|default:mdi:help` can stand in. One
   * Home Assistant does not know at all gives nothing, like every resolver here.
   */
  icon: (entityId, hass) => {
    const entity = hass?.entities?.[entityId];
    const state = hass?.states?.[entityId];
    if (!entity && !state) return undefined;
    return entity?.icon || state?.attributes?.icon || '';
  },
  // What the entity's device says about itself.
  manufacturer: (entityId, hass) => deviceOf(entityId, hass)?.manufacturer,
  model: (entityId, hass) => deviceOf(entityId, hass)?.model,
  // An area or floor with no icon chosen is still there, so it gives the empty string
  // rather than leaving the placeholder - the same as a repeat over areas does.
  area_icon: (entityId, hass) => {
    const area = areaOf(entityId, hass);
    return area ? (area.icon ?? '') : undefined;
  },
  floor_icon: (entityId, hass) => {
    const floorId = areaOf(entityId, hass)?.floor_id;
    const floor = floorId ? hass?.floors?.[floorId] : undefined;
    return floor ? (floor.icon ?? '') : undefined;
  },
  /*
   * Home Assistant's own words for something, in the language the dashboard is shown in -
   * how its interface names an integration. A value with no dot is a domain and reads as
   * that integration's title, `component.<domain>.title`, as HA's own domainToName does; a
   * value with a dot is a whole translation key, `ui.card.weather.attributes.humidity`.
   * Translations not loaded, or a key nobody translates, give the value back as written -
   * never nothing - and as the card is built once, it is the language at build time.
   */
  translate: (value, hass) => {
    const key = value.includes('.') ? value : `component.${value}.title`;
    try {
      const said = typeof hass?.localize === 'function' ? hass.localize(key) : undefined;
      return typeof said === 'string' && said && said !== key ? said : value;
    } catch {
      return value;
    }
  },
  // On the state, where Home Assistant reports it - the registry's own copy only if not.
  device_class: (entityId, hass) => {
    const entity = hass?.entities?.[entityId];
    return hass?.states?.[entityId]?.attributes?.device_class ?? entity?.device_class ?? entity?.original_device_class;
  },
};

/** The device an entity belongs to, if the registry says. */
function deviceOf(entityId: string, hass: any): any {
  return hass?.devices?.[hass?.entities?.[entityId]?.device_id];
}

/** The entity's area, or its device's when it has none of its own - how `|area` finds it. */
function areaOf(entityId: string, hass: any): any {
  const entity = hass?.entities?.[entityId];
  const areaId = entity?.area_id ?? hass?.devices?.[entity?.device_id]?.area_id;
  return areaId ? hass?.areas?.[areaId] : undefined;
}

const ENTITY_ID_SHAPE = /^([a-z0-9_]+)\.([a-z0-9_]+)$/i;

/** The resolver that reads an entity's state, which only works for what a card rebuilds on. */
export const STATE_STEP = 'state';

/*
 * Which entities a build may read the state of: the card's `rebuild_on:` list, carried on
 * the hass the build is handed rather than threaded through every call in between. A
 * symbol, so nothing in YAML or in Home Assistant can set it, and a hass that never had it
 * set allows nothing at all.
 */
const STATE_SCOPE = Symbol('decluttering rebuild_on');

/** hass for one card's build, allowed to read the state of these entities and no others. */
export function withStateScope(hass: any, entities: string[]): any {
  if (!hass || !entities.length) return hass;
  // Read-through rather than copied: hass is large and replaced on every state change.
  const scoped = Object.create(hass);
  scoped[STATE_SCOPE] = entities;
  return scoped;
}

/** The entities a build may read the state of, which also stand as placeholders for themselves. */
export function stateScope(hass: any): string[] {
  const scope = hass?.[STATE_SCOPE];
  return Array.isArray(scope) ? scope : [];
}

/** Whether this build may read the state of this entity. */
export function stateAllowed(hass: any, entityId: string): boolean {
  return stateScope(hass).includes(entityId);
}

/*
 * A value can stand in for another when there is nothing to show. `default:` supplies the
 * text itself; `or:` names another variable to try. Both are how a template covers the
 * gaps without every card having to fill them in - and unlike `?`, which drops the key
 * entirely, they put something there.
 */
const DEFAULT_PREFIX = 'default:';
const OR_PREFIX = 'or:';

// Anything but a bar or a bracket, so `default:Living Room` reads as it is written.
const DEFAULT_STEP = `${DEFAULT_PREFIX}[^|\\]]*`;
const OR_STEP = `${OR_PREFIX}[A-Za-z0-9_-]+`;

/** Whether a step supplies a value rather than reshaping one. */
export function isFallback(step: string): boolean {
  return step.startsWith(DEFAULT_PREFIX) || step.startsWith(OR_PREFIX);
}

/** The variable an `or:` step names, for counting it as used. */
export function orTarget(step: string): string | undefined {
  return step.startsWith(OR_PREFIX) ? step.slice(OR_PREFIX.length) : undefined;
}

/*
 * `if:` keeps a value only while another variable says so (discussion #150). Written
 * `if:name` it asks whether that variable is a yes, read the way `bool` reads one;
 * written `if:name=text` it asks whether the variable is exactly that text. Either can be
 * turned round (#210): `if:!name` holds while the variable is a no or unset, and
 * `if:name!=text` while it is anything but that text - an unset one included. A condition
 * that does not hold makes the value a gap, read exactly as though nothing had set it -
 * so `[[element|if:entity?]]` drops out of its list when the card names no entity, and a
 * `default:` after it still gets its turn. It gates the value rather than reshaping it,
 * so unlike the text transforms it lets a mapping or a list through whole.
 */
const IF_PREFIX = 'if:';

const IF_STEP = `${IF_PREFIX}!?[A-Za-z0-9_.-]+(?:!?=[^|\\]]*)?`;

/** An `if:` step taken apart: the variable it reads, the text it compares with, and whether it is turned round. */
function parseCondition(step: string): { name: string; text?: string; negated: boolean } {
  let body = step.slice(IF_PREFIX.length);
  const not = body.startsWith('!');
  if (not) body = body.slice(1);
  const equals = body.indexOf('=');
  if (equals === -1) return { name: body, negated: not };
  const unequal = body[equals - 1] === '!';
  return { name: body.slice(0, unequal ? equals - 1 : equals), text: body.slice(equals + 1), negated: not !== unequal };
}

/** Whether a step is a condition rather than something done to the value. */
export function isCondition(step: string): boolean {
  return step.startsWith(IF_PREFIX);
}

/** The variable an `if:` step reads, for counting it as used. */
export function conditionTarget(step: string): string | undefined {
  return isCondition(step) ? parseCondition(step).name : undefined;
}

/** Whether one `if:` step holds, given a way to read a variable's value. */
export function conditionHolds(step: string, read: (name: string) => unknown): boolean {
  const { name, text, negated } = parseCondition(step);
  const value = read(name);
  if (text === undefined) return truthy(value) !== negated;
  // Compared as text, as a dropdown and YAML both hand it over - but a mapping or a list
  // has no text to compare, and an unset variable equals nothing.
  const same = value !== undefined && value !== null && typeof value !== 'object' && String(value) === text;
  return same !== negated;
}

/** Whether a chain carries any condition at all. */
export function hasCondition(chain: string | undefined): boolean {
  return !!chain && chain.split('|').some(isCondition);
}

/** Whether every condition in a chain holds. Where they sit in it makes no difference. */
export function gateOpen(chain: string, read: (name: string) => unknown): boolean {
  return chain
    .split('|')
    .filter(isCondition)
    .every((step) => conditionHolds(step, read));
}

/** The chain with its conditions taken out, leaving what is actually done to the value. */
export function withoutConditions(chain: string): string {
  return chain
    .split('|')
    .filter((step) => !isCondition(step))
    .join('|');
}

/** `attr:brightness` asks for one named attribute of the entity's current state. */
const ATTRIBUTE_PREFIX = 'attr:';

const ATTRIBUTE_STEP = `${ATTRIBUTE_PREFIX}[a-zA-Z0-9_]+`;

// Attributes that are credentials rather than something to show. A camera's access_token
// grants an unauthenticated snapshot through /api/camera_proxy, and entity_picture already
// carries that token in its url - so a template pasted from elsewhere must never be able to
// pull either into a config it then puts in an outbound url. Blocked here, at the one place
// an attribute is read, rather than trusting every sink downstream not to leak it.
const SENSITIVE_ATTRIBUTES = new Set(['access_token', 'entity_picture', 'entity_picture_local']);

// Other attributes carry a token in their url - a media player's proxied artwork does - so
// a value that looks like one is refused whatever the attribute is called.
export const CARRIES_TOKEN = /[?&]token=/i;

const RESOLVER_NAMES = `${Object.keys(RESOLVERS)
  .sort((a, b) => b.length - a.length)
  .join('|')}|${ATTRIBUTE_STEP}`;

/** Whether a step of a chain asks Home Assistant for something rather than shaping text. */
export function isResolver(step: string): boolean {
  // Own properties only: `__proto__` is in every object, and is not a resolver.
  return Object.prototype.hasOwnProperty.call(RESOLVERS, step) || step.startsWith(ATTRIBUTE_PREFIX);
}

/**
 * One resolver applied, or undefined when Home Assistant has nothing to give - an entity
 * that does not exist, an attribute it does not carry, or no area on it. Undefined means
 * the placeholder is left alone rather than being filled with a guess.
 */
function resolve(step: string, entityId: string, hass: any): string | undefined {
  if (step.startsWith(ATTRIBUTE_PREFIX)) {
    const name = step.slice(ATTRIBUTE_PREFIX.length);
    if (SENSITIVE_ATTRIBUTES.has(name)) return undefined;
    const attribute = hass?.states?.[entityId]?.attributes?.[name];
    if (attribute === undefined || attribute === null) return undefined;
    const text = String(attribute);
    return CARRIES_TOKEN.test(text) ? undefined : asHaText(text);
  }
  const found = RESOLVERS[step]?.(entityId, hass);
  return found === undefined || found === null ? undefined : asHaText(String(found));
}

/*
 * Transforms chain, so `[[room|slug|upper]]` is the slug of the room shouted. The chain is
 * one alternation of known names repeated, which keeps the set closed: a chain containing
 * one word that is not a transform matches nothing, so the placeholder stays visible
 * rather than being half-applied.
 */
/*
 * Transforms that take an argument, written after a colon like `attr:` does. The argument
 * runs to the end of the step, so it can hold spaces and colons of its own - `replace:_: `
 * reads as "underscores to spaces" - but never a bar or a closing bracket.
 */
export const PARAM_TRANSFORMS: Record<string, (value: string, arg: string) => string | undefined> = {
  replace: (value, arg) => {
    const colon = arg.indexOf(':');
    const from = colon === -1 ? arg : arg.slice(0, colon);
    const to = colon === -1 ? '' : arg.slice(colon + 1);
    return from ? value.split(from).join(to) : value;
  },
  // Decoration, not content: a gap stays a gap, so `[[name?|suffix: room]]` still drops
  // its key and `default:` still sees nothing to stand in for.
  prefix: (value, arg) => (value === '' ? value : arg + value),
  suffix: (value, arg) => (value === '' ? value : value + arg),
  // `max:12` keeps a long name from wrapping a tile. The ellipsis takes the last kept
  // character's place, so the value never comes out longer than asked for.
  max: (value, arg) => {
    const length = Number(arg);
    if (!Number.isFinite(length) || length <= 0 || value.length <= length) return value;
    return `${value.slice(0, length - 1)}…`;
  },
  // `map:low=green,high=red` looks the value up. A value no pair names leaves the
  // placeholder visible rather than passing through as something a colour option would
  // choke on; `*=grey` is the way to say "and anything else".
  map: (value, arg) => {
    let fallback: string | undefined;
    for (const pair of arg.split(',')) {
      const equals = pair.indexOf('=');
      if (equals === -1) continue;
      const from = pair.slice(0, equals);
      const to = pair.slice(equals + 1);
      if (from === value) return to;
      if (from === '*') fallback = to;
    }
    return fallback;
  },
  // Where the text starts in the value, counting from 0, and -1 when it is not in it (#210).
  find: (value, arg) => String(value.indexOf(arg)),
};

/*
 * Steps that build structure rather than shape text (#227). `with:` fills a mapping
 * variable or an item template in again with values of its own; `repeat:` does so once per
 * item of a list, or per thing a registry source finds. Both are settled in deep-replace.ts
 * before the chain machinery ever sees them; they are in the grammar here so the
 * placeholder is recognised, and in KNOWN_PARAM_STEPS so the lint does not call them unknown.
 */
export const WITH_STEP = 'with';
export const REPEAT_STEP = 'repeat';
export const STRUCTURE_PARAM_STEPS = [WITH_STEP, REPEAT_STEP];

/** Whether a step is one of the structural ones above, whatever its argument. */
export function isStructureStep(step: string): boolean {
  return STRUCTURE_PARAM_STEPS.includes(stepName(step));
}

const PARAM_PREFIXES = [...Object.keys(PARAM_TRANSFORMS), ...LIST_PARAM_STEPS, CONTAINS_STEP, ...STRUCTURE_PARAM_STEPS];

/*
 * An arithmetic argument stops short of an opening bracket as well, so `add:[[offset]]`
 * waits for `[[offset]]` to be substituted and then reads the number it became, rather than
 * swallowing half of it as an argument that is not one.
 */
const PARAM_STEP = `(?:(?:${PARAM_PREFIXES.join('|')}):[^|\\]]*|(?:${NUMBER_PARAM_STEPS.join('|')}):[^|\\][]*)`;

/** The parameterised transform a step asks for, or undefined when it is not one. */
function paramTransform(
  step: string,
): { fn: (value: string, arg: string) => string | undefined; arg: string } | undefined {
  const colon = step.indexOf(':');
  if (colon === -1) return undefined;
  const name = step.slice(0, colon);
  // Own properties only. The grammar already keeps the set closed, so nothing in a config
  // reaches here with `toString` or `valueOf` - but this is exported, and an inherited name
  // would answer the lookup with a function that is not a transform at all. Same reasoning
  // as the null-prototype map in variableValues.
  if (!Object.prototype.hasOwnProperty.call(PARAM_TRANSFORMS, name)) return undefined;
  return { fn: PARAM_TRANSFORMS[name], arg: step.slice(colon + 1) };
}

const CHAIN_STEP = `(?:${TRANSFORM_NAMES}|${RESOLVER_NAMES}|${OR_STEP}|${DEFAULT_STEP}|${IF_STEP}|${PARAM_STEP})`;

const TRANSFORM_CHAIN = `${CHAIN_STEP}(?:\\|${CHAIN_STEP})*`;

/** Matches the optional `|transform` chain on a placeholder, capturing the whole chain. */
export const TRANSFORM_SUFFIX = `(?:\\|(${TRANSFORM_CHAIN}))?`;

const TRANSFORM_TAIL = new RegExp(`(?:\\|${CHAIN_STEP})+$`);

/**
 * The value a placeholder asks for, in the shape it asks for it, with each transform of
 * the chain applied in the order it was written. Only a scalar reaches here with a text
 * transform first: substitution leaves a transformed mapping or list visible rather than
 * garbling its JSON through one - a list only comes through whole to a list step.
 */
export function applyTransform(
  transform: string | undefined,
  value: unknown,
  hass?: any,
  values?: Record<string, any>,
  read: (name: string) => unknown = (name) => values?.[name],
  // Applied to what Home Assistant gives, and only to that: the author's own values are
  // theirs to write. A style passes one that keeps a name from ending a CSS declaration.
  shield?: (text: string) => string,
): string | undefined {
  const steps = transform ? transform.split('|') : [];

  // `json` is the one step that wants the value as it was rather than as text, so it is
  // read off the front before anything turns a mapping into "[object Object]".
  const takesJson = steps[0] === JSON_STEP;
  let text: string | undefined = takesJson ? JSON.stringify(value) : value === undefined ? undefined : String(value);

  /*
   * Whether there is anything to show, which is not the same as whether there is a value.
   * A stand-in is for gaps, and unset, null and the empty string are all gaps - while a
   * zero and a false are values and keep their place. Tracked from the value rather than
   * from the text, so a null still shapes as "null" for a plain transform, which is what
   * it has always done.
   */
  let empty = value === undefined || value === null || value === '';

  /*
   * The list a `split` made, or the list the steps after it have been shaping item by item.
   * Undefined while the value is text, which is nearly always.
   */
  let list: unknown[] | undefined;

  // Whether a `split` has been passed: a stand-in supplied after one is read as the list
  // text would have been, so the chain still ends in a list it built itself.
  let splitBefore = false;

  // One step that shapes text, applied to one piece of it.
  const reshape = (name: string, input: string): string | undefined => {
    if (isResolver(name)) {
      // A resolver reads the value as an entity id, so it has to run before anything has
      // reshaped it - `[[entity|friendly_name|slug]]` resolves, then slugs.
      const found = resolve(name, input, hass);
      return found !== undefined && shield ? shield(found) : found;
    }
    const numeric = numberStep(name, input, hass);
    if (numeric !== undefined) return numeric;
    const parameterised = paramTransform(name);
    if (parameterised) return parameterised.fn(input, parameterised.arg);
    return TRANSFORMS[name](input);
  };

  /*
   * Set when an `or:` found this variable already filled and kept its own value. Until the next
   * stand-in, a lookup that finds nothing for that value leaves it as it was: in
   * `[[name|or:entity|friendly_name|default:Unnamed]]` the lookup is there for the entity the
   * `or:` would have brought in, and a name passed in its own right is not an entity. A
   * value that is an entity still resolves, so `[[entity|or:other|friendly_name]]` names
   * whichever entity it ends up with.
   */
  let keptOwn = false;
  for (const [index, name] of steps.slice(takesJson ? 1 : 0).entries()) {
    // First in the chain, a step reads the value itself rather than the text of it.
    const firstHand = index === 0 && !takesJson ? value : undefined;

    if (name === BOOL_STEP) {
      // First in the chain it reads the value itself, so an empty list is a no rather
      // than the text "[]"; further along it reads what the steps before it made.
      text = String(truthy(list ?? (index === 0 && !takesJson ? value : text)));
      list = undefined;
      empty = false;
      continue;
    }

    if (name === EXISTS_STEP) {
      // Nothing set names no entity, so it is a no - and with no Home Assistant to ask
      // there is no answer at all, which leaves the placeholder visible.
      const id = index === 0 && !takesJson ? value : text;
      const known = id === undefined || id === null || id === '' ? false : entityExists(String(id), hass);
      text = known === undefined ? undefined : String(known);
      list = undefined;
      empty = text === undefined;
      continue;
    }

    if (stepName(name) === CONTAINS_STEP) {
      const wanted = name.slice(CONTAINS_STEP.length + 1);
      const items = list ?? (Array.isArray(firstHand) ? firstHand : undefined);
      const found = items
        ? items.some((item) => itemText(item) === wanted)
        : text !== undefined && !empty && text.includes(wanted);
      text = String(found);
      list = undefined;
      empty = false;
      continue;
    }

    if (isCondition(name)) {
      if (!conditionHolds(name, read)) {
        text = undefined;
        list = undefined;
        empty = true;
      }
      continue;
    }

    if (isFallback(name)) {
      keptOwn = !empty && orTarget(name) !== undefined;
      if (empty) {
        const or = orTarget(name);
        const fallback = or === undefined ? name.slice(DEFAULT_PREFIX.length) : values?.[or];
        // A mapping cannot stand in as text; `[[a|or:b]]` supplies words, not structure.
        const usable = fallback !== undefined && fallback !== null && typeof fallback !== 'object';
        text = usable ? String(fallback) : undefined;
        list = undefined;
        empty = text === undefined || text === '';
        /*
         * After a `split`, the stand-in is split the same way, so `[[rows|split|default:a,b]]`
         * is the list a and b. It also keeps a whole value honest: a chain ending in a list
         * goes into the card bare, and a stand-in that merely looked like JSON - a friendly
         * name of `[{"type":"iframe",...}]` reaching `or:name` - would otherwise be spliced
         * in as the structure it spelt (review 2026-10-18).
         */
        if (splitBefore && text !== undefined) {
          list = splitText(text, DEFAULT_SPLIT);
          text = undefined;
          empty = list.length === 0;
        }
      }
      continue;
    }

    if (isListStep(name)) {
      const colon = name.indexOf(':');
      const step = colon === -1 ? name : name.slice(0, colon);
      const arg = colon === -1 ? undefined : name.slice(colon + 1);
      // What the step reads as a list: one already made, a list variable, or text split up -
      // where a null or an empty string is an empty list, not the word "null".
      const separator = step === SPLIT_STEP ? (arg ?? DEFAULT_SPLIT) : DEFAULT_SPLIT;
      // Noted whether or not there is anything to split yet: a stand-in further along is
      // what fills the gap, and it is read as a list because this step came first.
      if (step === SPLIT_STEP) splitBefore = true;
      const items =
        list ??
        (Array.isArray(firstHand)
          ? firstHand
          : text === undefined
            ? undefined
            : empty
              ? []
              : splitText(text, separator));

      if (step === COUNT_STEP) {
        // Nothing at all is none of anything, and a mapping counts its keys.
        const mapping = !list && !!firstHand && typeof firstHand === 'object' && !Array.isArray(firstHand);
        text = String(mapping ? Object.keys(firstHand as object).length : (items?.length ?? 0));
        list = undefined;
        empty = false;
        continue;
      }
      // Nothing to work on - left for a `default:` further along, as below.
      if (items === undefined) continue;
      if (step === SPLIT_STEP) {
        list = items;
        text = undefined;
        empty = items.length === 0;
        continue;
      }
      if (step === JOIN_STEP) text = items.map(itemText).join(arg ?? DEFAULT_JOIN);
      else if (!items.length) text = '';
      else text = itemText(step === FIRST_STEP ? items[0] : items[items.length - 1]);
      list = undefined;
      empty = text === '';
      continue;
    }

    // Nothing to work on. Left rather than abandoned, so a `default:` further along the
    // chain still gets its turn.
    if (text === undefined && list === undefined) continue;

    // The grammar only ever matches known names, but the fallback pass reads any chain. An
    // unknown step has no answer: handing the raw value back would let a chain ending in
    // `bool` paste that value into the card's JSON unquoted.
    const known =
      isResolver(name) ||
      isNumberStep(name) ||
      !!paramTransform(name) ||
      (Object.prototype.hasOwnProperty.call(TRANSFORMS, name) && !!TRANSFORMS[name]);
    if (!known) return undefined;

    if (list !== undefined) {
      // After a `split`, a step that shapes text shapes every item; one with no answer for
      // an item has none for the list, as it would have none for a single value.
      const shaped = list.map((item) => reshape(name, itemText(item)));
      if (shaped.some((item) => item === undefined)) {
        list = undefined;
        text = undefined;
        empty = true;
      } else {
        list = shaped;
        empty = shaped.length === 0;
      }
      continue;
    }

    const shaped = reshape(name, text as string);
    if (shaped === undefined && keptOwn && isResolver(name)) continue;
    text = shaped;
    empty = text === undefined || text === '';
  }
  // A list still standing at the end goes out as its JSON: a whole value takes it as a real
  // list, and inside a longer string it is written out the way a list variable would be.
  if (list !== undefined) return JSON.stringify(list);
  return text;
}

/**
 * The entity a chain asks the state of when the build may not read it, or undefined when
 * it may - or when the chain asks for no state at all. A `state` that is not allowed would
 * otherwise read as Home Assistant having nothing to give, when the fix is on the card.
 */
export function unlistedState(
  chain: string | undefined,
  value: unknown,
  hass?: any,
  values?: Record<string, any>,
  read?: (name: string) => unknown,
): string | undefined {
  const steps = chain ? chain.split('|') : [];
  const at = steps.indexOf(STATE_STEP);
  if (at === -1) return undefined;
  // Whatever the steps before it make of the value is the entity it is asked of.
  const entity = applyTransform(steps.slice(0, at).join('|') || undefined, value, hass, values, read);
  if (entity === undefined) return undefined;
  return stateAllowed(hass, entity) ? undefined : entity;
}

/*
 * A placeholder naming a variable nothing sets is normally left alone - there is no value
 * to put there. One carrying `default:`, `or:` or `bool` is the exception: it says what to
 * do in exactly that case, so it is worked out separately once ordinary substitution has run out
 * of things to replace.
 */
export function resolveFallback(
  inside: string,
  values: Record<string, any>,
  hass?: any,
  read?: (name: string) => unknown,
  shield?: (text: string) => string,
): string | undefined {
  if (inside.startsWith(ESCAPE)) return undefined;

  const [name, ...steps] = withoutOptional(inside).split('|');
  if (!steps.some(answersUnset)) return undefined;
  return applyTransform(steps.join('|'), values[name], hass, values, read, shield);
}

// The parts of a template that get substituted into, and so the only places a placeholder
// can do anything.
const CONTENT_KEYS = ['card', 'badge', 'row', 'element', 'group', 'style'];

// Substitution reads one name and one value per entry, so everything here has to agree
// with that or the warnings would describe a card nobody is rendering.
export function variableName(entry: VariablesConfig | undefined): string | undefined {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return undefined;
  return Object.keys(entry)[0];
}

const firstKey = variableName;

/**
 * Variables as a flat list of one name each, whatever shape they were written in.
 *
 * Substitution reads one name and one value per entry, so a mapping - which is how people
 * naturally write these, and how the README's own example wrote them - used to lose every
 * key after the first without saying anything. Flattening here fixes that everywhere at
 * once, since resolution, substitution and the warnings all read the result.
 */
// How far into a nested value the dotted names go. Three is past anything a card writes by
// hand, and stops a big mapping turning into a hundred names to substitute.
const MAX_FLATTEN_DEPTH = 3;

/*
 * A variable whose value is a mapping can be reached a piece at a time as well as whole:
 * `[[room]]` is the mapping, `[[room.light]]` is what is in it. That is what lets one
 * `for_each` item carry a room's light, its sensor and its icon together rather than
 * flattening all three into prefixed names by hand.
 */
function addDotted(name: string, value: unknown, entries: VariablesConfig[], depth: number): void {
  if (depth >= MAX_FLATTEN_DEPTH) return;
  // A list is reached whole or not at all: its entries have no names to speak of.
  if (!value || typeof value !== 'object' || Array.isArray(value)) return;
  for (const [key, inner] of Object.entries(value)) {
    const dotted = `${name}.${key}`;
    entries.push({ [dotted]: inner });
    addDotted(dotted, inner, entries, depth + 1);
  }
}

/**
 * The variables a card actually wrote. normaliseVariables adds a dotted name for every key
 * inside a mapping, so `[[room.light]]` can reach into `room` - right for substitution,
 * wrong for an editor, which then listed `room.light` beside `room`, warned it was never
 * used, and wrote it back into the config as if the card had set it. A card variable holds
 * a whole card, so it hit this every time.
 *
 * Dotted copies of a mapping set alongside them are left out too: earlier versions of the
 * editor saved exactly those, and they are derived, not the card's own.
 */
export function ownVariables(variables: unknown): VariablesConfig[] {
  const entries: VariablesConfig[] = [];
  const add = (entry: unknown): void => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return;
    for (const [name, value] of Object.entries(entry)) entries.push({ [name]: value });
  };
  if (Array.isArray(variables)) variables.forEach(add);
  else add(variables);

  const isMapping = (value: unknown): boolean => !!value && typeof value === 'object' && !Array.isArray(value);
  const mappings = new Set(
    entries.filter((entry) => isMapping(Object.values(entry)[0])).map((entry) => Object.keys(entry)[0]),
  );
  return entries.filter((entry) => {
    const name = Object.keys(entry)[0];
    const dot = name.indexOf('.');
    return dot < 0 || !mappings.has(name.slice(0, dot));
  });
}

export function normaliseVariables(variables: unknown): VariablesConfig[] {
  const entries: VariablesConfig[] = [];
  const add = (entry: unknown): void => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return;
    for (const [name, value] of Object.entries(entry)) {
      entries.push({ [name]: value });
      addDotted(name, value, entries, 0);
    }
  };

  if (Array.isArray(variables)) variables.forEach(add);
  else add(variables);
  return entries;
}

/**
 * Passed variables take precedence over the template's defaults, so only the first
 * definition of each name is kept. Order alone is not enough once substitution loops:
 * a default would otherwise win whenever the placeholder is introduced by an earlier
 * substitution rather than being present in the template from the start.
 */
export function firstDefinitionWins(variableArray: VariablesConfig[]): VariablesConfig[] {
  const seen = new Set<string>();
  return variableArray.filter((variable) => {
    const key = firstKey(variable);
    if (key === undefined || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/*
 * Declarations can be written as a mapping keyed by name as well as a list (discussion #223):
 * `colour: red` declares colour with red as its default, `colour: {selector: ...}` is the
 * whole declaration, and `colour:` with nothing declares the name alone. An object is always
 * read as the declaration, so a mapping default has to be written under `default:`. Returned
 * as the list everything else reads; a list is handed back as it is, anything else is empty.
 */
export function declarationList(variables: unknown): any[] {
  if (Array.isArray(variables)) return variables;
  if (!variables || typeof variables !== 'object') return [];
  return Object.entries(variables).map(([name, value]) =>
    value && typeof value === 'object' && !Array.isArray(value)
      ? { ...value, name }
      : value === null || value === undefined
        ? { name }
        : { name, default: value },
  );
}

/**
 * A template's `variables:` with more declarations added after its own, in the shape it was
 * written in: a mapping (#223) gains a key per name, anything else becomes a list.
 */
export function addDeclarations(variables: unknown, added: VariableDeclaration[]): any {
  if (variables && typeof variables === 'object' && !Array.isArray(variables)) {
    const out: Record<string, unknown> = { ...variables };
    for (const { name, ...rest } of added) out[name] = rest;
    return out;
  }
  return [...(Array.isArray(variables) ? variables : []), ...added];
}

/** Whether a template's `variables:` is something declarations can be read from: a list, a mapping, or nothing. */
export function isDeclarationsShape(variables: unknown): boolean {
  return variables === undefined || variables === null || typeof variables === 'object';
}

/** A template with mapping declarations turned into the list form; any other template as it was. */
export function withDeclarationList<T extends TemplateConfig>(template: T): T {
  const declared = (template as any)?.variables;
  if (!declared || typeof declared !== 'object' || Array.isArray(declared)) return template;
  return { ...template, variables: declarationList(declared) };
}

/** The variables a template declares, dropping any entry substitution could not use. */
export function getDeclarations(template: TemplateConfig | undefined): VariableDeclaration[] {
  const declared = declarationList(template?.variables);
  if (!declared.length) return [];

  const seen = new Set<string>();
  const declarations: VariableDeclaration[] = [];
  for (const entry of declared) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
    const name = entry.name;
    if (typeof name !== 'string' || !name.trim() || seen.has(name)) continue;
    seen.add(name);
    declarations.push(withSingularDefault(entry));
  }
  return declarations;
}

/*
 * `defaults:` is what people keep writing - the dashboard's own key is the plural
 * `decluttering_defaults` - and until it was read as well it was silently ignored
 * (discussion #175). Both spellings mean the same thing everywhere, with no warning for
 * either; written both ways, `default:` wins a name the two share.
 */
export const DEFAULTS_ALIAS = 'defaults';

/*
 * A declaration's default is one value, so there is nothing to merge: `default:` wins when
 * both are written, and `defaults:` alone is read as it. A declaration that only wrote the
 * singular is handed back as it was, so nothing that compares declarations sees a change.
 */
function withSingularDefault(entry: VariableDeclaration): VariableDeclaration {
  if (!Object.prototype.hasOwnProperty.call(entry, DEFAULTS_ALIAS)) return entry;
  const { [DEFAULTS_ALIAS]: alias, ...rest } = entry as VariableDeclaration & { defaults?: unknown };
  return 'default' in rest ? rest : { ...rest, default: alias };
}

/** A variables list as written, one entry per name, without the dotted names a mapping adds. */
function writtenEntries(variables: unknown): VariablesConfig[] {
  const entries: VariablesConfig[] = [];
  const add = (entry: unknown): void => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return;
    for (const [name, value] of Object.entries(entry)) entries.push({ [name]: value });
  };
  if (Array.isArray(variables)) variables.forEach(add);
  else add(variables);
  return entries;
}

/**
 * A template's `default:` list with its `defaults:` list folded in underneath, so a name
 * written in both takes the singular's value - whole, a mapping included, so `[[room]]` and
 * `[[room.light]]` never come from different lists. A template with no `defaults:` gets its
 * own `default:` back exactly as written. Everything that reads a template's defaults reads
 * them through here.
 */
export function templateDefaults(template: TemplateConfig | undefined): any {
  const alias = (template as any)?.[DEFAULTS_ALIAS];
  if (alias === undefined || alias === null) return template?.default;
  const own = writtenEntries(template?.default);
  const named = new Set(own.map((entry) => Object.keys(entry)[0]));
  return [...own, ...writtenEntries(alias).filter((entry) => !named.has(Object.keys(entry)[0]))];
}

/**
 * Where a template copy carries the values its view sets, which sit above the template's
 * own defaults. A symbol rather than a key, so nothing written in YAML can reach it and an
 * exported template never carries it.
 */
export const VIEW_VALUES = Symbol('decluttering view values');

/*
 * `decluttering_let:` on the dashboard, a view or a section (discussion #162): values worked
 * out per card exactly as a template's `let:` is - from that card's own variables, placeholders
 * and all - and, like it, beyond a card's reach. They ride on the template copy under a symbol,
 * as the view's values do, one layer per place they were written, nearest first, so the trace
 * can say which.
 */
export const OUTER_LET = Symbol('decluttering outer let');

/** Where a `decluttering_let:` value was written, as the trace names it. */
export type LetSource = 'section_let' | 'view_let' | 'dashboard_let';

export interface LetLayer {
  from: LetSource;
  values: VariablesConfig[];
}

/** The `decluttering_let:` layers a template copy carries, nearest first. */
export function outerLet(template: TemplateConfig | undefined): LetLayer[] {
  const layers = (template as any)?.[OUTER_LET];
  return Array.isArray(layers) ? layers : [];
}

/** The `default:` values - and `defaults:`, the same thing spelled plural - in whichever shape they were written. */
function defaultList(template: TemplateConfig | undefined): VariablesConfig[] {
  return normaliseVariables(templateDefaults(template));
}

/**
 * Every value that will be substituted, in the order that decides which wins: what the
 * instance passes, then what its view sets, then what a declaration defaults to, then the
 * older `default:` list.
 */
export function resolveVariables(
  variables: VariablesConfig[] | VariablesConfig | undefined,
  template: TemplateConfig | undefined,
): VariablesConfig[] {
  const combined: VariablesConfig[] = [];
  // `let:` values are the template's own internals, so they come first and win even over
  // what an instance passes - a card overriding a derived value would break the template
  // from the outside, invisibly.
  combined.push(...normaliseVariables(template?.let));
  // Then the section's, the view's and the dashboard's, in that order: the template's own
  // `let:` knows the template best, and the nearer a value was written the more it means.
  for (const layer of outerLet(template)) combined.push(...normaliseVariables(layer.values));
  combined.push(...normaliseVariables(variables));
  // The view is closer to the card than the template is: a room page that says
  // `room: kitchen` means every card on it, whatever the template would have picked.
  combined.push(...normaliseVariables((template as any)?.[VIEW_VALUES]));
  for (const declaration of getDeclarations(template)) {
    // A declaration that only names a variable says nothing about its value, and must not
    // shadow a `default:` entry with undefined.
    if ('default' in declaration) combined.push({ [declaration.name]: declaration.default });
  }
  combined.push(...defaultList(template));
  return firstDefinitionWins(combined);
}

/**
 * Where a template copy keeps its own `default:` list once the dashboard's shared values
 * have been added under it, so what a card hands down can leave the shared ones out.
 */
export const OWN_DEFAULTS = Symbol('decluttering own defaults');

/** The flag a nested card sets to be handed every variable of the card that builds it. */
export const INHERIT_FLAG = 'inherit_variables';

/** The key the variables handed down ride on, the same way the chain of open templates does. */
export const INHERITED_KEY = 'decluttering_inherited_variables';

/*
 * What a card hands down to a nested card that asks for its variables (#161): what it was
 * given, what its view sets, and what its own template defaults to. Not `let:` - those are
 * the template's own internals, and a `decluttering_let:` is worked out again by the nested
 * card wherever it sits - and not the dashboard's shared values, which the nested
 * card already reads for itself and which would otherwise beat its own template's defaults.
 * Dotted copies of mappings are left out too; the nested card works those out again.
 */
export function inheritableVariables(
  variables: VariablesConfig[] | VariablesConfig | undefined,
  template: TemplateConfig | undefined,
): VariablesConfig[] {
  const combined: VariablesConfig[] = [];
  combined.push(...ownVariables(variables));
  combined.push(...ownVariables((template as any)?.[VIEW_VALUES]));
  for (const declaration of getDeclarations(template)) {
    if ('default' in declaration) combined.push({ [declaration.name]: declaration.default });
  }
  // Checked with `in`: a template with no `default:` of its own keeps an undefined here, and
  // falling back on that would hand down the shared values after all.
  const own = template && OWN_DEFAULTS in template ? (template as any)[OWN_DEFAULTS] : templateDefaults(template);
  combined.push(...ownVariables(own));
  return firstDefinitionWins(combined);
}

/*
 * A card with `inherit_variables: true` and something handed down to it, as if it had
 * written those variables itself - after its own, so anything it does write still wins.
 * Everything downstream then reads them the way it reads any instance variable.
 */
export function withInheritedVariables<T extends { variables?: unknown }>(config: T): T {
  const inherited = (config as any)?.[INHERITED_KEY];
  if ((config as any)?.[INHERIT_FLAG] !== true || !Array.isArray(inherited) || !inherited.length) return config;
  return { ...config, variables: [...ownVariables(config.variables), ...ownVariables(inherited)] };
}

/** What each variable is set to, reading one name per entry as substitution does. */
export function variableValues(variableArray: VariablesConfig[] | VariablesConfig | undefined): Record<string, any> {
  // No prototype, so `key in map` answers about this dashboard's variables rather than about
  // Object.prototype - a variable legitimately named `toString`, `constructor` or `valueOf`
  // is kept like any other, and a `__proto__` key sets a plain entry instead of reparenting.
  const map: Record<string, any> = Object.create(null);
  for (const entry of normaliseVariables(variableArray)) {
    const key = firstKey(entry);
    if (key !== undefined && !(key in map)) map[key] = entry[key];
  }
  return map;
}

function placeholdersIn(value: unknown): string[] {
  if (value === undefined) return [];
  const names: string[] = [];
  const json = JSON.stringify(value);
  if (typeof json !== 'string') return names;
  // A fresh regex each time: a shared global one carries lastIndex between calls.
  const pattern = new RegExp(PLACEHOLDER_SOURCE, 'g');
  let match = pattern.exec(json);
  while (match !== null) {
    // `[[room|slug]]` is a use of `room`, not of a variable called `room|slug`, and
    // `[[!room]]` is not a use of anything - it is the brackets, written out.
    if (!match[1].startsWith(ESCAPE)) {
      const inside = withoutOptional(match[1]);
      names.push(inside.replace(TRANSFORM_TAIL, ''));
      // `[[a|or:b]]` uses b as surely as it uses a, so b is not a value set for nothing -
      // and `[[a|if:b]]` reads b to decide whether a is shown at all.
      for (const step of inside.split('|').slice(1)) {
        const other = orTarget(step) ?? conditionTarget(step);
        if (other) names.push(other);
      }
    }
    match = pattern.exec(json);
  }
  return names;
}

function contentOf(template: TemplateConfig | undefined): unknown[] {
  return CONTENT_KEYS.map((key) => (template as any)?.[key]).filter((part) => part !== undefined);
}

/**
 * The variables that actually reach the rendered card: the ones written into its content,
 * and then the ones those pull in through their own values. A placeholder sitting in the
 * value of a variable nothing refers to is never substituted, so it does not count.
 */
function reachable(template: TemplateConfig | undefined, values: Record<string, any>): string[] {
  const queue = placeholdersIn(contentOf(template));
  const seen = new Set<string>();
  const used: string[] = [];
  while (queue.length) {
    const name = queue.shift() as string;
    if (seen.has(name)) continue;
    seen.add(name);
    used.push(name);
    if (name in values) queue.push(...placeholdersIn(values[name]));
  }
  return used;
}

/*
 * The names whose every placeholder has an answer for nothing set: an optional one, which
 * just goes, or one with a step that stands in - `default:`, `bool`, `count`, or an `or:`
 * whose other name has a value. The running card builds those without a word, so the
 * editor and the health panel must not call them missing either.
 */
function answeredNames(template: TemplateConfig | undefined, values: Record<string, any>, used: string[]): Set<string> {
  const answered = new Map<string, boolean>();
  const scan = (value: unknown): void => {
    const json = JSON.stringify(value);
    if (typeof json !== 'string') return;
    const pattern = new RegExp(PLACEHOLDER_SOURCE, 'g');
    for (let match = pattern.exec(json); match !== null; match = pattern.exec(json)) {
      if (match[1].startsWith(ESCAPE)) continue;
      const inside = withoutOptional(match[1]);
      const name = inside.replace(TRANSFORM_TAIL, '');
      const answers =
        isOptional(match[1]) ||
        inside
          .split('|')
          .slice(1)
          .some((step) => {
            const other = orTarget(step);
            return other !== undefined ? other in values : answersUnset(step);
          });
      answered.set(name, (answered.get(name) ?? true) && answers);
    }
  };
  scan(contentOf(template));
  for (const name of used) if (name in values) scan(values[name]);
  return new Set([...answered].filter(([, answers]) => answers).map(([name]) => name));
}

/*
 * Whether any placeholder in the template has a step that answers to this - in its content,
 * and in the values that feed it: `let:`, `default:`, declarations, and the `decluttering_let`
 * of the view, section and dashboard, since a resolver in any of those ends up in the card.
 */
function usesStep(template: TemplateConfig | undefined, wanted: (step: string) => boolean): boolean {
  const json = JSON.stringify([template, outerLet(template).map((layer) => layer.values)]);
  if (typeof json !== 'string') return false;
  const pattern = new RegExp(PLACEHOLDER_SOURCE, 'g');
  let match = pattern.exec(json);
  while (match !== null) {
    if (!match[1].startsWith(ESCAPE) && withoutOptional(match[1]).split('|').slice(1).some(wanted)) return true;
    match = pattern.exec(json);
  }
  /*
   * The grammar only matches a placeholder with no brackets inside, so a step on the outer
   * one of `[[light|area|default:[[room]]]]` is not seen above. Any |step in the text will
   * do here: a false yes only costs a build when the registry arrives.
   */
  const unescaped = json.replace(new RegExp(`\\[\\[\\${ESCAPE}[^[\\]]*\\]\\]`, 'g'), '');
  const steps = /\|([a-z_]+)(?=[|\]:])/g;
  for (let step = steps.exec(unescaped); step !== null; step = steps.exec(unescaped)) if (wanted(step[1])) return true;
  return false;
}

/**
 * Whether anything in the template asks Home Assistant for a value. Worth knowing because
 * those answers come from the registry, which can arrive after the card has first
 * rendered - a template that uses one has to be built again when it does.
 */
export function usesResolver(template: TemplateConfig | undefined): boolean {
  // `exists` asks Home Assistant too, so it is built again once there is a Home Assistant to ask.
  // A `repeat:` over a registry source reads it too, and has to follow it the same way.
  return usesStep(template, (step) => isResolver(step) || step === EXISTS_STEP || stepName(step) === REPEAT_STEP);
}

/**
 * Whether the template asks for a translation, whose answer changes when Home Assistant
 * loads more of them or the language changes - not when the registry does.
 */
export function usesTranslate(template: TemplateConfig | undefined): boolean {
  return usesStep(template, (step) => step === 'translate');
}

/**
 * Whether one item of a repeat has something to say for every variable the template
 * declares it cannot do without. A template that requires nothing accepts every item, so
 * this only ever narrows a repeat that asked to be narrowed.
 */
export function hasRequiredVariables(
  template: TemplateConfig | undefined,
  item: unknown,
  shared: VariablesConfig[] | undefined,
): boolean {
  const required = getDeclarations(template).filter((declaration) => declaration.required === true);
  if (!required.length) return true;

  // No prototype: a variable called `constructor` is not set just because every object has one.
  const values = Object.assign(Object.create(null), variableValues(shared), variableValues(item as VariablesConfig));
  return required.every((declaration) => {
    const value = values[declaration.name];
    // The same reading of empty substitution uses: a zero and a false are values.
    return value !== undefined && value !== null && value !== '';
  });
}

/** Every variable the template itself uses, before any instance passes anything in. */
/**
 * The values that break their own declaration: a `pattern:` they do not match, or an
 * `allowed:` list they are not in. Unset is not invalid - that is what `missing` is for -
 * and a pattern that is not a regular expression validates nothing rather than breaking
 * the card. Warnings only, like everything else here: nothing blocks a save.
 */
export function validateDeclared(
  variables: VariablesConfig[] | VariablesConfig | undefined,
  template: TemplateConfig | undefined,
  hass?: any,
): { name: string; expected: string }[] {
  const values = variableValues(resolveVariables(variables, template));
  const bad: { name: string; expected: string }[] = [];
  for (const declaration of getDeclarations(template)) {
    const value = values[declaration.name];
    if (value === undefined || value === null || value === '') continue;
    /*
     * A declared type is checked first, and a value that fails it is reported once rather
     * than again against allowed: or pattern:. A value still holding a placeholder is
     * worked out later - `[[room]]_light` is an entity id only once room is in - so it is
     * not judged here.
     */
    const placeholder = typeof value === 'string' && PLACEHOLDER.test(value);
    const mismatch = placeholder ? undefined : typeMismatch(declaration, value, hass);
    if (mismatch !== undefined) {
      bad.push({ name: declaration.name, expected: mismatch });
      continue;
    }
    if (Array.isArray(declaration.allowed)) {
      // Compared as text: a dropdown hands back strings, and `allowed: [1, 2]` still means 1 and 2.
      if (!declaration.allowed.some((each) => String(each) === String(value))) {
        bad.push({ name: declaration.name, expected: declaration.allowed.map((each) => String(each)).join(', ') });
      }
      continue;
    }
    if (typeof declaration.pattern === 'string' && declaration.pattern) {
      // Checked in the editor, on the main thread, against a value and a pattern that may
      // both have come from somebody else's template - so one that could run away is not
      // run at all, and nor is one against text longer than any pattern here is for.
      const text = String(value);
      if (text.length > MAX_CHECKED_LENGTH || !patternIsSafe(declaration.pattern)) continue;
      let expression: RegExp;
      try {
        expression = new RegExp(declaration.pattern);
      } catch {
        continue;
      }
      if (!expression.test(text)) bad.push({ name: declaration.name, expected: declaration.pattern });
    }
  }
  return bad;
}

// Longer than any entity id, colour or name a pattern is written to check.
const MAX_CHECKED_LENGTH = 1000;
const MAX_PATTERN_LENGTH = 200;

/*
 * Whether a pattern can be run against text somebody else chose. A quantifier applied to a
 * group that itself holds a quantifier or an alternation - `(a+)+`, `(x|xy)*` - is the shape
 * that backtracks for seconds on thirty characters; a plain `^light\.` or `^[a-z-]+$` is
 * not. Read character by character so that an escaped bracket or one inside a class does
 * not count.
 */
export function patternIsSafe(pattern: string): boolean {
  if (pattern.length > MAX_PATTERN_LENGTH) return false;
  // One flag per open group: whether a quantifier or a bar has been seen inside it.
  const groups: boolean[] = [];
  let inClass = false;
  for (let i = 0; i < pattern.length; i += 1) {
    const char = pattern[i];
    if (char === '\\') {
      i += 1;
      continue;
    }
    if (inClass) {
      if (char === ']') inClass = false;
      continue;
    }
    if (char === '[') {
      inClass = true;
      continue;
    }
    if (char === '(') {
      groups.push(false);
      continue;
    }
    const quantifier = char === '+' || char === '*' || char === '{' || char === '?';
    if (char === ')') {
      const busy = groups.pop() ?? false;
      const next = pattern[i + 1];
      const quantified = next === '+' || next === '*' || next === '{';
      if (busy && quantified) return false;
      // A quantified group counts as busy for the group around it.
      if (quantified && groups.length) groups[groups.length - 1] = true;
      continue;
    }
    if ((quantifier || char === '|') && groups.length) groups[groups.length - 1] = true;
  }
  return true;
}

export function usedVariables(template: TemplateConfig | undefined): string[] {
  return reachable(template, variableValues(resolveVariables(undefined, template)));
}

/** What is wrong with one use of a template: nothing here should stop the card saving. */
export function diagnoseInstance(
  variables: VariablesConfig[] | VariablesConfig | undefined,
  template: TemplateConfig | undefined,
  // Values supplied from elsewhere - a for_each item, say - which satisfy a variable the
  // template uses, but are not the card's own to be called unused.
  supplements?: VariablesConfig[],
): { missing: string[]; unused: string[]; required: string[] } {
  // Supplements go after full resolution, so they only fill names nothing else defines.
  // Folded in earlier, a supplement would shadow a declared default and hide the
  // variables that default's own value goes on to use.
  const values = variableValues([...resolveVariables(variables, template), ...normaliseVariables(supplements)]);
  const used = reachable(template, values);
  const isUsed = new Set(used);

  // What the card wrote, not the dotted names derived from its mappings - and a mapping
  // reached only through one of its keys (`[[room.light]]`) is still used.
  const passed = ownVariables(variables);
  const reached = (name: string): boolean => isUsed.has(name) || used.some((each) => each.startsWith(name + '.'));
  const unused: string[] = [];
  for (const entry of passed) {
    const name = firstKey(entry);
    if (name !== undefined && !reached(name) && !unused.includes(name)) unused.push(name);
  }

  const answered = answeredNames(template, values, used);
  const missing = used.filter((name) => !(name in values) && !answered.has(name));
  // Which of the missing ones the template says it cannot do without, so an editor can
  // say so more loudly than it says the rest.
  const insisted = new Set(
    getDeclarations(template)
      .filter((declaration) => declaration.required === true)
      .map((declaration) => declaration.name),
  );
  return { missing, unused, required: missing.filter((name) => insisted.has(name)) };
}

/** What is wrong with the template itself, as its own editor sees it. */
export function diagnoseTemplate(template: TemplateConfig | undefined): {
  unused: string[];
  duplicated: string[];
  contradictory: string[];
} {
  const declarations = getDeclarations(template);
  const isUsed = new Set(usedVariables(template));
  const inDefaultList = new Set(defaultList(template).map(firstKey));

  const unused: string[] = [];
  const duplicated: string[] = [];
  const contradictory: string[] = [];
  for (const declaration of declarations) {
    const { name } = declaration;
    if (!isUsed.has(name)) unused.push(name);
    if (inDefaultList.has(name)) duplicated.push(name);
    // A variable with a value of its own can never be left unset, so insisting on one
    // says something the template cannot mean.
    if (declaration.required === true && ('default' in declaration || inDefaultList.has(name))) {
      contradictory.push(name);
    }
  }
  return { unused, duplicated, contradictory };
}

/**
 * The variables an editor wants written back, ordered so that editing a card produces the
 * smallest possible change to the configuration: names already there keep their place,
 * names that have just been set are appended, and names no longer wanted disappear.
 */
export function mergeVariables(existing: VariablesConfig[] | undefined, desired: VariablesConfig[]): VariablesConfig[] {
  const wanted = new Map<string, VariablesConfig>();
  for (const entry of desired) {
    const name = firstKey(entry);
    if (name !== undefined && !wanted.has(name)) wanted.set(name, entry);
  }

  const merged: VariablesConfig[] = [];
  for (const entry of Array.isArray(existing) ? existing : []) {
    const name = firstKey(entry);
    if (name === undefined || !wanted.has(name)) continue;
    merged.push(wanted.get(name) as VariablesConfig);
    wanted.delete(name);
  }
  merged.push(...wanted.values());
  return merged;
}

/**
 * One entry of a card's `for_each` list, as the values to substitute for that copy. An
 * item is usually written as a mapping, which reads far better than a list of one-key
 * entries when every copy sets the same three or four things.
 */
export function forEachVariables(
  item: unknown,
  cardVariables: VariablesConfig[] | VariablesConfig | undefined,
  index?: number,
  count?: number,
): VariablesConfig[] {
  // Where the copy sits in the list, counted from one because these are read by people
  // writing "Zone [[index]] of [[count]]" rather than by programmers. They go last, so
  // an item or a card that sets either of those names by hand still wins.
  // Where the copy sits in the list, counted from one because these are read by people
  // writing "Zone [[index]] of [[count]]" rather than by programmers - with index0 beside
  // it for the times a list is being indexed into, and first/last for the ends, which is
  // what a rounded corner or a divider hangs off. They go last, so an item or a card that
  // sets any of those names by hand still wins.
  const position: VariablesConfig[] =
    index === undefined
      ? []
      : [
          { index: index + 1 },
          { index0: index },
          { count: count ?? 0 },
          { first: index === 0 },
          { last: index === (count ?? 0) - 1 },
        ];

  // The item's own values come first, so a copy can override what the card sets for all.
  // Both go through the same normalisation substitution reads, so a mapping or a
  // multi-key entry means the same thing here as it does everywhere else.
  return [...normaliseVariables(item), ...normaliseVariables(cardVariables), ...position];
}

/**
 * The `for_each` value as a list of items, in whichever shape it was written: a list, or
 * a single mapping standing for a list of one. Anything else is not a list to repeat
 * over, and undefined says so.
 */
export function forEachItems(forEach: unknown): unknown[] | undefined {
  if (Array.isArray(forEach)) return forEach;
  // An empty mapping is what an object field emits when it is opened and cleared, which
  // is somebody saying "no list" - not a list of one copy with nothing in it.
  if (forEach && typeof forEach === 'object' && Object.keys(forEach).length) return [forEach];
  return undefined;
}

/** The names every copy of a `for_each` gets given, whatever its items say. */
export const POSITION_NAMES = ['index', 'index0', 'count', 'first', 'last'];

/** Every name any item of a `for_each` list sets, for warning about what is missing. */
export function forEachNames(items: unknown): string[] {
  const list = forEachItems(items) ?? [];
  // Nothing is repeated over, so nothing is supplied - not even a position.
  const names = new Set<string>(list.length ? POSITION_NAMES : []);
  for (const item of list) {
    // normaliseVariables only ever emits single-key entries.
    for (const entry of normaliseVariables(item)) names.add(Object.keys(entry)[0]);
  }
  return [...names];
}

/*
 * Every step a placeholder chain can hold, by name, for the template editor's lint - which
 * has to tell `[[room|slgu]]` from a step it has simply never heard of. Built from the
 * registries above, so a transform or a resolver added to TRANSFORMS, RESOLVERS or
 * PARAM_TRANSFORMS is known here without being listed a second time. A step handled
 * anywhere else - special-cased the way `json` and `bool` are - has to be added by hand,
 * here, or the lint will call it unknown.
 */
export const KNOWN_STEPS: string[] = [
  ...new Set([
    ...Object.keys(TRANSFORMS),
    JSON_STEP,
    BOOL_STEP,
    EXISTS_STEP,
    STATE_STEP,
    ...NUMBER_BARE_STEPS,
    ...LIST_BARE_STEPS,
    ...Object.keys(RESOLVERS),
  ]),
];

/** The steps written as a name, a colon and an argument - `default:Unnamed`, `if:other=on`. */
export const KNOWN_PARAM_STEPS: string[] = [
  ...Object.keys(PARAM_TRANSFORMS),
  ...NUMBER_PARAM_STEPS,
  ...LIST_PARAM_STEPS,
  CONTAINS_STEP,
  ...STRUCTURE_PARAM_STEPS,
  ATTRIBUTE_PREFIX.slice(0, -1),
  OR_PREFIX.slice(0, -1),
  DEFAULT_PREFIX.slice(0, -1),
  IF_PREFIX.slice(0, -1),
];
