import { TemplateConfig } from './types';
import { ESCAPE, conditionTarget } from './variables';
import {
  CONSUMER_TYPES,
  LIBRARY_DASHBOARD,
  collectRawTemplates,
  getTemplateSources,
  isTemplateCardType,
} from './templates';
import { definedNames } from './lint';
import { readsIn } from './unread';

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

function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** One placeholder's inside with `from` renamed wherever it names a variable. */
function renameInside(inside: string, from: string, to: string): string {
  const optional = inside.endsWith('?');
  const steps = (optional ? inside.slice(0, -1) : inside).split('|');

  const head = steps[0];
  const headOptional = head.endsWith('?');
  const name = headOptional ? head.slice(0, -1) : head;
  // `[[room]]` and `[[room.light]]` both read `room`; the part after the dot is a key of its value.
  if (name === from || name.startsWith(`${from}.`)) {
    steps[0] = `${to}${name.slice(from.length)}${headOptional ? '?' : ''}`;
  }

  for (let index = 1; index < steps.length; index += 1) {
    const step = steps[index];
    if (step === `or:${from}`) steps[index] = `or:${to}`;
    else if (conditionTarget(step) === from) {
      // `if:from`, `if:!from`, `if:from=on` and `if:from!=on` all keep their shape.
      const not = step.startsWith('if:!') ? '!' : '';
      steps[index] = `if:${not}${to}${step.slice(3 + not.length + from.length)}`;
    }
  }
  return `${steps.join('|')}${optional ? '?' : ''}`;
}

/**
 * Text with every placeholder reading `from` reading `to` instead: `[[from]]`,
 * `[[from|slug]]`, `[[from?]]`, `[[from.key]]`, `[[x|or:from]]`, `[[x|if:from]]` and
 * `[[x|if:from=on]]`, with or without a `!`. An escaped `[[!from]]` is the brackets written out, and is left alone.
 */
export function renamePlaceholders(text: string, from: string, to: string): string {
  if (!text.includes('[[')) return text;
  const renamed = text.replace(/\[\[([^[\]]+)\]\]/g, (match, inside: string) =>
    inside.startsWith(ESCAPE) ? match : `[[${renameInside(inside, from, to)}]]`,
  );
  // A lookup's outer name, `[[from.[[level]]]]`, is not a placeholder of its own until the
  // inner one is in, so it is renamed where it stands.
  return renamed.replace(new RegExp(`\\[\\[${escapeForRegExp(from)}(?=\\.\\[\\[)`, 'g'), `[[${to}`);
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
  }
  if (out.default !== undefined) out.default = renameVariableKey(out.default, from, to);
  if ((out as any).defaults !== undefined) (out as any).defaults = renameVariableKey((out as any).defaults, from, to);
  if (out.let !== undefined) out.let = renameVariableKey(out.let, from, to);
  return out;
}

/**
 * A card using the template with the variable renamed wherever the card sets it: its
 * `variables:`, each item of its `for_each`, each of its `for_each_from` overrides - and
 * its `name:`, which is filled in from the card's own variables.
 */
export function renameVariableInCard<T extends Record<string, any>>(card: T, from: string, to: string): T {
  const out: Record<string, any> = { ...card };
  if (out.variables !== undefined) out.variables = renameVariableKey(out.variables, from, to);
  if (Array.isArray(out.for_each)) out.for_each = out.for_each.map((item: any) => renameVariableKey(item, from, to));
  else if (out.for_each !== undefined) out.for_each = renameVariableKey(out.for_each, from, to);
  const overrides = out.for_each_from?.overrides;
  if (overrides && typeof overrides === 'object' && !Array.isArray(overrides)) {
    const renamed: Record<string, any> = {};
    for (const [entity, values] of Object.entries(overrides)) renamed[entity] = renameVariableKey(values, from, to);
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
    if (CONSUMER_TYPES.includes(node.type) && affected.has(node.template)) {
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
