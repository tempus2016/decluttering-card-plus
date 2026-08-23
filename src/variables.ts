import { TemplateConfig, VariablesConfig } from './types';

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
  /** Whether the template is unusable without it. Warns; it never blocks a save. */
  required?: boolean;
}

const PLACEHOLDER_SOURCE = '\\[\\[([^[\\]]+)\\]\\]';

/*
 * A placeholder written `[[!name]]` is a literal `[[name]]` rather than a variable: the
 * bang is dropped once every substitution is done. It is the only way to write those
 * brackets and mean them, which a template holding markdown or Jinja sometimes needs.
 */
export const ESCAPE = '!';

const ESCAPED_SOURCE = `\\[\\[${ESCAPE}([^[\\]]+)\\]\\]`;

/** Whether anything in this text is an escaped placeholder waiting to be unwrapped. */
export function hasEscape(text: string): boolean {
  return new RegExp(ESCAPED_SOURCE).test(text);
}

/** Every `[[!name]]` written out as the `[[name]]` it stands for. */
export function unescapePlaceholders(text: string): string {
  return text.replace(new RegExp(ESCAPED_SOURCE, 'g'), '[[$1]]');
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

const TRANSFORM_NAMES = [...Object.keys(TRANSFORMS), JSON_STEP].join('|');

/*
 * Some of what a template wants is not in the card's config at all - it is in Home
 * Assistant. Wanting a tile's name to default to the entity's own name is the single
 * most asked-for thing this card does not do, and it does not need a template engine:
 * it is the same "give me this value in a different shape" the transforms already are,
 * with the shape coming from the registry.
 *
 * Deliberately absent: the entity's state. Substitution builds the card's config once,
 * so resolving state here would rebuild the whole card on every state change. What is
 * here comes from the registry and changes about as often as the dashboard does.
 */
export const RESOLVERS: Record<string, (entityId: string, hass: any) => string | undefined> = {
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
};

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

/** `attr:brightness` asks for one named attribute of the entity's current state. */
const ATTRIBUTE_PREFIX = 'attr:';

const ATTRIBUTE_STEP = `${ATTRIBUTE_PREFIX}[a-zA-Z0-9_]+`;

// Attributes that are credentials rather than something to show. A camera's access_token
// grants an unauthenticated snapshot through /api/camera_proxy, and entity_picture already
// carries that token in its url - so a template pasted from elsewhere must never be able to
// pull either into a config it then puts in an outbound url. Blocked here, at the one place
// an attribute is read, rather than trusting every sink downstream not to leak it.
const SENSITIVE_ATTRIBUTES = new Set(['access_token', 'entity_picture']);

const RESOLVER_NAMES = `${Object.keys(RESOLVERS)
  .sort((a, b) => b.length - a.length)
  .join('|')}|${ATTRIBUTE_STEP}`;

/** Whether a step of a chain asks Home Assistant for something rather than shaping text. */
export function isResolver(step: string): boolean {
  return step in RESOLVERS || step.startsWith(ATTRIBUTE_PREFIX);
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
    return attribute === undefined || attribute === null ? undefined : String(attribute);
  }
  const found = RESOLVERS[step]?.(entityId, hass);
  return found === undefined || found === null ? undefined : String(found);
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
};

const PARAM_PREFIXES = Object.keys(PARAM_TRANSFORMS);

const PARAM_STEP = `(?:${PARAM_PREFIXES.join('|')}):[^|\\]]*`;

/** The parameterised transform a step asks for, or undefined when it is not one. */
function paramTransform(step: string): { fn: (value: string, arg: string) => string | undefined; arg: string } | undefined {
  const colon = step.indexOf(':');
  if (colon === -1) return undefined;
  const fn = PARAM_TRANSFORMS[step.slice(0, colon)];
  return fn ? { fn, arg: step.slice(colon + 1) } : undefined;
}

const CHAIN_STEP = `(?:${TRANSFORM_NAMES}|${RESOLVER_NAMES}|${OR_STEP}|${DEFAULT_STEP}|${PARAM_STEP})`;

const TRANSFORM_CHAIN = `${CHAIN_STEP}(?:\\|${CHAIN_STEP})*`;

/** Matches the optional `|transform` chain on a placeholder, capturing the whole chain. */
export const TRANSFORM_SUFFIX = `(?:\\|(${TRANSFORM_CHAIN}))?`;

const TRANSFORM_TAIL = new RegExp(`(?:\\|${CHAIN_STEP})+$`);

/**
 * The value a placeholder asks for, in the shape it asks for it, with each transform of
 * the chain applied in the order it was written. Only a scalar reaches here with a
 * transform: substitution leaves a transformed mapping or list visible rather than
 * garbling its JSON through a text transform.
 */
export function applyTransform(
  transform: string | undefined,
  value: unknown,
  hass?: any,
  values?: Record<string, any>,
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

  for (const name of steps.slice(takesJson ? 1 : 0)) {
    if (isFallback(name)) {
      if (empty) {
        const or = orTarget(name);
        const fallback = or === undefined ? name.slice(DEFAULT_PREFIX.length) : values?.[or];
        // A mapping cannot stand in as text; `[[a|or:b]]` supplies words, not structure.
        const usable = fallback !== undefined && fallback !== null && typeof fallback !== 'object';
        text = usable ? String(fallback) : undefined;
        empty = text === undefined || text === '';
      }
      continue;
    }

    // Nothing to work on. Left rather than abandoned, so a `default:` further along the
    // chain still gets its turn.
    if (text === undefined) continue;

    if (isResolver(name)) {
      // A resolver reads the value as an entity id, so it has to run before anything has
      // reshaped it - `[[entity|friendly_name|slug]]` resolves, then slugs.
      text = resolve(name, text, hass);
      empty = text === undefined || text === '';
      continue;
    }

    const parameterised = paramTransform(name);
    if (parameterised) {
      text = parameterised.fn(text, parameterised.arg);
      empty = text === undefined || text === '';
      continue;
    }

    const fn = TRANSFORMS[name];
    // The grammar only ever matches known names, so this is belt and braces.
    if (!fn) return value === undefined ? undefined : String(value);
    text = fn(text);
    empty = text === '';
  }
  return text;
}

/*
 * A placeholder naming a variable nothing sets is normally left alone - there is no value
 * to put there. One carrying `default:` or `or:` is the exception: it says what to do in
 * exactly that case, so it is worked out separately once ordinary substitution has run out
 * of things to replace.
 */
export function resolveFallback(inside: string, values: Record<string, any>, hass?: any): string | undefined {
  if (inside.startsWith(ESCAPE)) return undefined;

  const [name, ...steps] = withoutOptional(inside).split('|');
  if (!steps.some(isFallback)) return undefined;
  return applyTransform(steps.join('|'), values[name], hass, values);
}

// The parts of a template that get substituted into, and so the only places a placeholder
// can do anything.
const CONTENT_KEYS = ['card', 'badge', 'row', 'element', 'style'];

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

/** The variables a template declares, dropping any entry substitution could not use. */
export function getDeclarations(template: TemplateConfig | undefined): VariableDeclaration[] {
  const declared = template?.variables;
  if (!Array.isArray(declared)) return [];

  const seen = new Set<string>();
  const declarations: VariableDeclaration[] = [];
  for (const entry of declared) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
    const name = entry.name;
    if (typeof name !== 'string' || !name.trim() || seen.has(name)) continue;
    seen.add(name);
    declarations.push(entry);
  }
  return declarations;
}

/** The `default:` values, in whichever shape they were written. */
function defaultList(template: TemplateConfig | undefined): VariablesConfig[] {
  return normaliseVariables(template?.default);
}

/**
 * Every value that will be substituted, in the order that decides which wins: what the
 * instance passes, then what a declaration defaults to, then the older `default:` list.
 */
export function resolveVariables(
  variables: VariablesConfig[] | VariablesConfig | undefined,
  template: TemplateConfig | undefined,
): VariablesConfig[] {
  const combined: VariablesConfig[] = [];
  combined.push(...normaliseVariables(variables));
  for (const declaration of getDeclarations(template)) {
    // A declaration that only names a variable says nothing about its value, and must not
    // shadow a `default:` entry with undefined.
    if ('default' in declaration) combined.push({ [declaration.name]: declaration.default });
  }
  combined.push(...defaultList(template));
  return firstDefinitionWins(combined);
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
      // `[[a|or:b]]` uses b as surely as it uses a, so b is not a value set for nothing.
      for (const step of inside.split('|').slice(1)) {
        const or = orTarget(step);
        if (or) names.push(or);
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

/**
 * Whether anything in the template asks Home Assistant for a value. Worth knowing because
 * those answers come from the registry, which can arrive after the card has first
 * rendered - a template that uses one has to be built again when it does.
 */
export function usesResolver(template: TemplateConfig | undefined): boolean {
  const json = JSON.stringify(contentOf(template));
  if (typeof json !== 'string') return false;
  const pattern = new RegExp(PLACEHOLDER_SOURCE, 'g');
  let match = pattern.exec(json);
  while (match !== null) {
    if (!match[1].startsWith(ESCAPE) && withoutOptional(match[1]).split('|').slice(1).some(isResolver)) return true;
    match = pattern.exec(json);
  }
  return false;
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

  const values = { ...variableValues(shared), ...variableValues(item as VariablesConfig) };
  return required.every((declaration) => {
    const value = values[declaration.name];
    // The same reading of empty substitution uses: a zero and a false are values.
    return value !== undefined && value !== null && value !== '';
  });
}

/** Every variable the template itself uses, before any instance passes anything in. */
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

  const passed = normaliseVariables(variables);
  const unused: string[] = [];
  for (const entry of passed) {
    const name = firstKey(entry);
    if (name !== undefined && !isUsed.has(name) && !unused.includes(name)) unused.push(name);
  }

  const missing = used.filter((name) => !(name in values));
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
