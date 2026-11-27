import { TemplateConfig } from './types';
import { ESCAPE, isCondition, isWellFormedCondition, quotedText } from './variables';
import {
  CONSUMER_TYPES,
  LIBRARY_DASHBOARD,
  byDomainOf,
  collectRawTemplates,
  getTemplateSources,
  isTemplateCardType,
} from './templates';
import { definedNames } from './lint';
import { headName, placeholderSteps, readsIn, stepTarget } from './unread';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * Renaming a variable is the edit a template cannot make on its own. The name is written in
 * the template's placeholders, its declaration, its defaults and its `let:`, and again in
 * every card that passes it - on this dashboard and on any other that borrows the template.
 * Changing it in one place and not the others leaves cards passing a value nothing reads,
 * which renders as the template's default and looks almost right.
 *
 * Everything here is pure: each function hands back a rewritten copy and mutates nothing.
 */

/** What a variable name may be: what `or:` accepts, so a renamed name works everywhere. */
export function validVariableName(name: string): boolean {
  return /^[A-Za-z0-9_-]+$/.test(name);
}

/** A name the placeholder reads, renamed when it is `from` or a dotted reach into it. */
function renamedName(name: string, from: string, to: string): string {
  // `[[room]]` and `[[room.light]]` both read `room`; the part after the dot is a key of its value.
  return name === from || name.startsWith(`${from}.`) ? `${to}${name.slice(from.length)}` : name;
}

/**
 * One step after the first with `from` renamed where the step reads it: `or:from`, `if:from`,
 * `if:!from`, `if:from=on`, `if:from!=on`, `unless:` (idea 36), `repeat:from` and `with:from`
 * all keep their shape. Found with the parser readsIn uses, so whatever counts as a read is renamed.
 */
function renameStep(step: string, from: string, to: string): string {
  const target = stepTarget(step);
  if (!target) return step;
  return `${step.slice(0, target.at)}${renamedName(target.name, from, to)}${step.slice(target.at + target.name.length)}`;
}

/** One placeholder's inside with `from` renamed wherever it names a variable. */
function renameInside(inside: string, from: string, to: string): string {
  const { steps, optional } = placeholderSteps(inside);
  const head = headName(steps[0]);
  // A quoted name is text, not a variable (#398).
  if (quotedText(head.name) === undefined) {
    steps[0] = `${renamedName(head.name, from, to)}${head.optional ? '?' : ''}`;
  }
  for (let index = 1; index < steps.length; index += 1) steps[index] = renameStep(steps[index], from, to);
  return `${steps.join('|')}${optional ? '?' : ''}`;
}

// A placeholder already dealt with, set aside so the one around it can be read: private-use
// characters no dashboard writes, with its place in the list between them.
const HELD_OPEN = '\uE000';
const HELD_CLOSE = '\uE001';
const HELD = new RegExp(`${HELD_OPEN}(\\d+)${HELD_CLOSE}`, 'g');

/**
 * Text with every placeholder reading `from` reading `to` instead: `[[from]]`,
 * `[[from|slug]]`, `[[from?]]`, `[[from.key]]`, `[[x|or:from]]`, `[[x|if:from]]`,
 * `[[x|if:from=on]]` with or without a `!`, `[[t|repeat:from]]` and `[[t|with:from]]`. An
 * escaped `[[!from]]` is the brackets written out, and is left alone.
 *
 * Read from the inside out, as readsIn reads them, so a placeholder holding another -
 * `[[from.[[level]]]]`, `[[from|or:[[other]]]]` - is renamed as well as the one inside it.
 */
export function renamePlaceholders(text: string, from: string, to: string): string {
  if (!text.includes('[[') || text.includes(HELD_OPEN)) return text;
  const held: string[] = [];
  let out = text;
  for (let pass = 0; pass < 5; pass += 1) {
    let found = false;
    out = out.replace(/\[\[([^[\]]+)\]\]/g, (match, inside: string) => {
      found = true;
      held.push(inside.startsWith(ESCAPE) ? match : `[[${renameInside(inside, from, to)}]]`);
      return `${HELD_OPEN}${held.length - 1}${HELD_CLOSE}`;
    });
    if (!found) break;
  }
  // Put back outermost first: each one may hold the places of the ones inside it.
  while (out.includes(HELD_OPEN)) out = out.replace(HELD, (_match, index: string) => held[Number(index)]);
  return out;
}

/** Every string - keys included, since substitution reaches those too - with its placeholders renamed. */
function renameEverywhere(value: any, from: string, to: string): any {
  if (typeof value === 'string') return renamePlaceholders(value, from, to);
  if (Array.isArray(value)) return value.map((item) => renameEverywhere(item, from, to));
  if (value && typeof value === 'object') {
    const out: Record<string, any> = {};
    for (const [key, item] of Object.entries(value))
      out[renamePlaceholders(key, from, to)] = renameEverywhere(item, from, to);
    return out;
  }
  return value;
}

/**
 * A list of variables - one name per entry, or one mapping - with the entry for `from`
 * called `to`, in its place. An entry already called `to` is dropped: nothing read it
 * before (the new name is checked to be free in the template), and it would otherwise
 * stand beside the renamed one and win.
 */
export function renameVariableKey(variables: any, from: string, to: string): any {
  const isEntry = (entry: any): boolean => !!entry && typeof entry === 'object' && !Array.isArray(entry);
  const has = (entry: any, key: string): boolean => isEntry(entry) && Object.prototype.hasOwnProperty.call(entry, key);
  const rekey = (entry: any): any => {
    if (!isEntry(entry)) return entry;
    const out: Record<string, any> = {};
    for (const [key, value] of Object.entries(entry)) {
      if (key === to) continue;
      out[key === from ? to : key] = value;
    }
    return out;
  };
  if (Array.isArray(variables)) {
    if (!variables.some((entry) => has(entry, from))) return variables;
    // An entry left with nothing in it held only the old `to`, and goes with it.
    return variables.map(rekey).filter((entry) => !isEntry(entry) || Object.keys(entry).length > 0);
  }
  return has(variables, from) ? rekey(variables) : variables;
}

/**
 * A template with one of its variables renamed: every placeholder reading it, its
 * declaration, its `default:` entry and its `let:` entry. A nested card's own `variables:`
 * keys are left as they are - they belong to the template that card uses - but the
 * placeholders in their values are this template's, and are renamed.
 */
export function renameVariableInTemplate<T extends TemplateConfig>(template: T, from: string, to: string): T {
  const out = renameEverywhere(template, from, to);
  if (Array.isArray(out.variables)) {
    out.variables = out.variables.map((entry: any) =>
      entry && typeof entry === 'object' && entry.name === from ? { ...entry, name: to } : entry,
    );
  } else if (out.variables && typeof out.variables === 'object') {
    // Declarations written as a mapping (#223) are keyed by name.
    out.variables = renameVariableKey(out.variables, from, to);
  }
  // A field's show_if and hide_if (#347) name the variable bare, and so do a group's (#473).
  if (Array.isArray(out.variables))
    out.variables = out.variables.map((entry: any) => renameVisibility(entry, from, to));
  else if (isMapping(out.variables))
    out.variables = mapValues(out.variables, (entry) => renameVisibility(entry, from, to));
  if (isMapping(out.groups)) out.groups = mapValues(out.groups, (entry) => renameVisibility(entry, from, to));
  // A check's condition (#389) is one of show_if's when it is not text to fill in.
  if (Array.isArray(out.checks)) {
    out.checks = out.checks.map((check: any) =>
      isMapping(check) && typeof check.condition === 'string'
        ? { ...check, condition: renameCondition(check.condition, from, to) }
        : check,
    );
  }
  // Each example is a set of variables written the way a card writes them, named or not.
  if (out.examples !== undefined) {
    const example = (each: any): any =>
      isNamedExample(each)
        ? { ...each, values: renameVariableKey(each.values, from, to) }
        : renameVariableKey(each, from, to);
    out.examples = Array.isArray(out.examples) ? out.examples.map(example) : example(out.examples);
  }
  if (out.default !== undefined) out.default = renameVariableKey(out.default, from, to);
  if ((out as any).defaults !== undefined) (out as any).defaults = renameVariableKey((out as any).defaults, from, to);
  if (out.let !== undefined) out.let = renameVariableKey(out.let, from, to);
  return out;
}

const isMapping = (value: unknown): value is Record<string, any> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

function mapValues(mapping: Record<string, any>, change: (value: any) => any): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(mapping)) out[key] = change(value);
  return out;
}

/** A condition written bare - `name`, `!name`, `name=text`, with or without `if:` in front - reading `to` for `from`. */
function renameCondition(condition: string, from: string, to: string): string {
  const trimmed = condition.trim();
  const prefixed = isCondition(trimmed);
  const step = prefixed ? trimmed : `if:${trimmed}`;
  // Text with placeholders in it, or anything else an `if:` cannot read, was dealt with as text.
  if (!isWellFormedCondition(step)) return condition;
  const renamed = renameStep(step, from, to);
  if (renamed === step) return condition;
  return prefixed ? renamed : renamed.slice('if:'.length);
}

/** A declaration or a group with the conditions under its show_if and hide_if renamed. */
function renameVisibility(entry: any, from: string, to: string): any {
  if (!isMapping(entry)) return entry;
  let out = entry;
  for (const key of ['show_if', 'hide_if']) {
    const written = entry[key];
    const renamed = Array.isArray(written)
      ? written.map((each) => (typeof each === 'string' ? renameCondition(each, from, to) : each))
      : typeof written === 'string'
        ? renameCondition(written, from, to)
        : written;
    if (renamed !== written) out = { ...out, [key]: renamed };
  }
  return out;
}

// An example carrying a name (idea 44): a mapping of exactly `name` and `values`, as examples.ts reads it.
function isNamedExample(example: unknown): boolean {
  if (!isMapping(example)) return false;
  const keys = Object.keys(example);
  return (
    keys.length === 2 &&
    typeof example.name === 'string' &&
    example.values !== null &&
    typeof example.values === 'object'
  );
}

/**
 * A card using the template with the variable renamed wherever the card sets it: its
 * `variables:`, each item of its `for_each`, each of its `for_each_from` overrides - and
 * its `name:`, which is filled in from the card's own variables.
 */
export function renameVariableInCard<T extends Record<string, any>>(card: T, from: string, to: string): T {
  const out: Record<string, any> = { ...card };
  // What the card sets can read its other variables - `label: '[[room]] light'` - so the
  // values are renamed as well as the names.
  const values = (variables: any): any => renameEverywhere(renameVariableKey(variables, from, to), from, to);
  if (out.variables !== undefined) out.variables = values(out.variables);
  if (Array.isArray(out.for_each)) out.for_each = out.for_each.map(values);
  else if (out.for_each !== undefined) out.for_each = values(out.for_each);
  // A slot (idea 35) is a variable under another key.
  if (isMapping(out.slots)) out.slots = values(out.slots);
  // Everything else the card fills in from its own variables.
  for (const key of ['on_error', 'for_each_from', 'rebuild_on', 'empty']) {
    if (out[key] !== undefined) out[key] = renameEverywhere(out[key], from, to);
  }
  const overrides = out.for_each_from?.overrides;
  if (overrides && typeof overrides === 'object' && !Array.isArray(overrides)) {
    const renamed: Record<string, any> = {};
    for (const [entity, each] of Object.entries(overrides)) renamed[entity] = renameVariableKey(each, from, to);
    out.for_each_from = { ...out.for_each_from, overrides: renamed };
  }
  if (typeof out.name === 'string') out.name = renamePlaceholders(out.name, from, to);
  return out as T;
}

/** The names of the templates `extends:` names, whether it names one or a list. */
function parentsOf(template: any): string[] {
  const parents = template?.extends;
  return (Array.isArray(parents) ? parents : [parents]).filter((each) => typeof each === 'string');
}

/**
 * The template and every template on the dashboard built on it, however indirectly. A
 * child reads its parent's variables under the same names, so a rename reaches it too -
 * and the cards using the child.
 *
 * On a dashboard borrowing the template, its children are mostly on the lender too, and
 * the cards here use them by name: `lent` is what this answered on the lender, and every
 * name in it this dashboard does not define for itself is borrowed along with it.
 */
export function affectedTemplates(ll: any, template: string, lent?: Set<string>): Set<string> {
  const raw = collectRawTemplates(ll);
  const affected = new Set([template]);
  for (const name of lent ?? []) {
    if (!Object.prototype.hasOwnProperty.call(raw, name)) affected.add(name);
  }
  let grew = true;
  while (grew) {
    grew = false;
    for (const [name, definition] of Object.entries(raw)) {
      if (!affected.has(name) && parentsOf(definition).some((parent) => affected.has(parent))) {
        affected.add(name);
        grew = true;
      }
    }
  }
  return affected;
}

/** Every name a template has any use for, which is what can be renamed and what a new name must not be. */
export function variableNames(template: TemplateConfig | undefined): string[] {
  if (!template) return [];
  const names = new Set(definedNames(template));
  for (const read of readsIn(template)) if (!read.includes('.') && read !== '_') names.add(read);
  return [...names].sort();
}

/**
 * A dashboard with the variable renamed in the template, every template built on it, and
 * every card using any of them - including a card nested inside another template, which
 * passes its variables by name like any other. How many of each it rewrote comes back
 * with it, for saying so before anything is saved. `lent` is for a dashboard borrowing the
 * template - see affectedTemplates.
 */
export function renameVariableInDashboard(
  ll: any,
  template: string,
  from: string,
  to: string,
  lent?: Set<string>,
): { config: any; cards: number; templates: number } {
  const affected = affectedTemplates(ll, template, lent);
  let cards = 0;
  let templates = 0;
  const changed = (a: unknown, b: unknown): boolean => JSON.stringify(a) !== JSON.stringify(b);

  const walk = (node: any): any => {
    if (Array.isArray(node)) return node.map(walk);
    if (!node || typeof node !== 'object') return node;
    let out: any = {};
    for (const [key, value] of Object.entries(node)) out[key] = walk(value);
    // A card choosing by domain uses each template its mapping can choose.
    const chosen = [node.template, ...Object.values(byDomainOf(node) ?? {})];
    if (CONSUMER_TYPES.includes(node.type) && chosen.some((each) => affected.has(each))) {
      const renamed = renameVariableInCard(out, from, to);
      if (changed(renamed, out)) cards += 1;
      out = renamed;
    }
    if (isTemplateCardType(node.type) && affected.has(node.template)) {
      const renamed = renameVariableInTemplate(out, from, to);
      if (changed(renamed, out)) templates += 1;
      out = renamed;
    }
    return out;
  };

  const config: any = { ...ll };
  if (Array.isArray(ll?.views)) config.views = walk(ll.views);
  const declared = ll?.decluttering_templates;
  if (declared && typeof declared === 'object') {
    const rebuilt: Record<string, any> = {};
    for (const [name, definition] of Object.entries(declared)) {
      let out = walk(definition);
      if (affected.has(name)) {
        const renamed = renameVariableInTemplate(out, from, to);
        if (changed(renamed, out)) templates += 1;
        out = renamed;
      }
      rebuilt[name] = out;
    }
    config.decluttering_templates = rebuilt;
  }
  return { config, cards, templates };
}

/**
 * Whether the cards on another dashboard that name `template` mean the one on `lender`:
 * the dashboard does not define a template of that name itself, and borrows from the
 * lender - by name, with `'*'`, or because the lender is the library every dashboard reads.
 * A dashboard with its own template of that name is using its own, and is left alone.
 */
export function borrowsTemplate(ll: any, template: string, lender: string): boolean {
  if (Object.prototype.hasOwnProperty.call(collectRawTemplates(ll), template)) return false;
  if (lender === LIBRARY_DASHBOARD) return true;
  const sources = getTemplateSources(ll);
  return sources.includes(lender) || sources.includes('*');
}

/** Whether a new name is free in every template the rename reaches. */
export function nameTakenIn(ll: any, template: string, to: string, own?: TemplateConfig): boolean {
  const raw = collectRawTemplates(ll);
  for (const name of affectedTemplates(ll, template)) {
    const definition = name === template && own ? own : raw[name];
    if (variableNames(definition).includes(to)) return true;
  }
  return false;
}
