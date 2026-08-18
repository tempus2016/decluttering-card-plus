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
}

const PLACEHOLDER_SOURCE = '\\[\\[([^[\\]]+)\\]\\]';

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

/** The `default:` list, tolerating the single mapping people sometimes write instead. */
function defaultList(template: TemplateConfig | undefined): VariablesConfig[] {
  const defaults = template?.default;
  if (!defaults) return [];
  return Array.isArray(defaults) ? defaults : [defaults];
}

/**
 * Every value that will be substituted, in the order that decides which wins: what the
 * instance passes, then what a declaration defaults to, then the older `default:` list.
 */
export function resolveVariables(
  variables: VariablesConfig[] | undefined,
  template: TemplateConfig | undefined,
): VariablesConfig[] {
  const combined: VariablesConfig[] = [];
  if (Array.isArray(variables)) combined.push(...variables);
  for (const declaration of getDeclarations(template)) {
    // A declaration that only names a variable says nothing about its value, and must not
    // shadow a `default:` entry with undefined.
    if ('default' in declaration) combined.push({ [declaration.name]: declaration.default });
  }
  combined.push(...defaultList(template));
  return firstDefinitionWins(combined);
}

/** What each variable is set to, reading one name per entry as substitution does. */
export function variableValues(variableArray: VariablesConfig[] | undefined): Record<string, any> {
  const map: Record<string, any> = {};
  for (const entry of Array.isArray(variableArray) ? variableArray : []) {
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
    names.push(match[1]);
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

/** Every variable the template itself uses, before any instance passes anything in. */
export function usedVariables(template: TemplateConfig | undefined): string[] {
  return reachable(template, variableValues(resolveVariables(undefined, template)));
}

/** What is wrong with one use of a template: nothing here should stop the card saving. */
export function diagnoseInstance(
  variables: VariablesConfig[] | undefined,
  template: TemplateConfig | undefined,
): { missing: string[]; unused: string[] } {
  const values = variableValues(resolveVariables(variables, template));
  const used = reachable(template, values);
  const isUsed = new Set(used);

  const passed = Array.isArray(variables) ? variables : [];
  const unused: string[] = [];
  for (const entry of passed) {
    const name = firstKey(entry);
    if (name !== undefined && !isUsed.has(name) && !unused.includes(name)) unused.push(name);
  }

  return { missing: used.filter((name) => !(name in values)), unused };
}

/** What is wrong with the template itself, as its own editor sees it. */
export function diagnoseTemplate(template: TemplateConfig | undefined): { unused: string[]; duplicated: string[] } {
  const declarations = getDeclarations(template);
  const isUsed = new Set(usedVariables(template));
  const inDefaultList = new Set(defaultList(template).map(firstKey));

  const unused: string[] = [];
  const duplicated: string[] = [];
  for (const { name } of declarations) {
    if (!isUsed.has(name)) unused.push(name);
    if (inDefaultList.has(name)) duplicated.push(name);
  }
  return { unused, duplicated };
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
export function forEachVariables(item: unknown, cardVariables: VariablesConfig[] | undefined): VariablesConfig[] {
  const own: VariablesConfig[] = [];
  if (Array.isArray(item)) {
    own.push(...item.filter((entry) => variableName(entry) !== undefined));
  } else if (item && typeof item === 'object') {
    for (const [name, value] of Object.entries(item)) own.push({ [name]: value });
  }
  // The item's own values come first, so a copy can override what the card sets for all.
  return [...own, ...(Array.isArray(cardVariables) ? cardVariables : [])];
}

/** Every name any item of a `for_each` list sets, for warning about what is missing. */
export function forEachNames(items: unknown): string[] {
  if (!Array.isArray(items)) return [];
  const names: string[] = [];
  for (const item of items) {
    for (const entry of forEachVariables(item, undefined)) {
      const name = variableName(entry);
      if (name !== undefined && !names.includes(name)) names.push(name);
    }
  }
  return names;
}
