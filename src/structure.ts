import { TemplateConfig, VariablesConfig } from './types';
import {
  normaliseVariables,
  POSITION_NAMES,
  REPEAT_STEP,
  resolveVariables,
  variableValues,
  WITH_STEP,
} from './variables';
import { isRegistrySource, registryNames } from './registry';

/*
 * What the checks need to know about `with:` and `repeat:` (#227), which deep-replace.ts
 * works out at build time: the names a body is given when it is filled in. A body reads
 * `[[entity]]` and nothing in the template sets `entity` - the repeat does, one copy at a
 * time - so a health check or a lint that did not know would call it missing on every
 * template that repeats anything.
 */

// A `with:` or `repeat:` placeholder: the name it fills in, which step, and the argument.
const STRUCTURE_PLACEHOLDER = `\\[\\[([^|[\\]?]+)\\|(${WITH_STEP}|${REPEAT_STEP}):([^|\\]]*?)\\??\\]\\]`;

/** The names the items of a written-out list set: a mapping's keys, or `item` and `entity`. */
function itemNames(items: unknown[]): string[] {
  const names = new Set<string>();
  for (const item of items) {
    if (item && typeof item === 'object') {
      for (const entry of normaliseVariables(item)) names.add(Object.keys(entry)[0]);
    } else {
      names.add('item');
      if (typeof item === 'string' && /^[a-z_]+\.[a-z0-9_]+$/.test(item)) names.add('entity');
    }
  }
  return [...names];
}

/**
 * The names a template's `with:` and `repeat:` placeholders give the bodies they fill in.
 * A `with:` gives its pairs, or the keys of the mapping it names; a `repeat:` gives the
 * copy's place and whatever its source supplies - the registry's set for a source, the
 * items' own keys for a list. The mapping or source is looked up among the template's own
 * values, with `extra` - the card's variables, say - looked in first.
 */
export function structureNames(template: TemplateConfig | undefined, extra?: VariablesConfig[]): string[] {
  const json = JSON.stringify(template ?? {});
  if (typeof json !== 'string' || (!json.includes(`|${WITH_STEP}:`) && !json.includes(`|${REPEAT_STEP}:`))) return [];
  const values = variableValues([...normaliseVariables(extra), ...resolveVariables(undefined, template)]);
  const names = new Set<string>();
  const pattern = new RegExp(STRUCTURE_PLACEHOLDER, 'g');
  for (let match = pattern.exec(json); match !== null; match = pattern.exec(json)) {
    const [, , step, arg] = match;
    if (step === WITH_STEP) {
      if (arg.includes('=')) {
        for (const pair of arg.split(',')) {
          const equals = pair.indexOf('=');
          if (equals > 0) names.add(pair.slice(0, equals).trim());
        }
      } else {
        // normaliseVariables gives nothing for anything but a mapping, which is right here.
        for (const entry of normaliseVariables(values[arg])) names.add(Object.keys(entry)[0]);
      }
      continue;
    }
    for (const name of [...POSITION_NAMES, 'item', 'entity']) names.add(name);
    const source = values[arg];
    if (isRegistrySource(source)) for (const name of registryNames(source)) names.add(name);
    else if (Array.isArray(source)) for (const name of itemNames(source)) names.add(name);
  }
  return [...names];
}

/** Whether a template is an item template - an `item:` body and no card, badge or the like to show. */
export function isItemTemplate(template: TemplateConfig | undefined): boolean {
  return !!template && typeof template === 'object' && 'item' in template;
}

/**
 * Every name a placeholder anywhere in `node` starts with, however it goes on. An item
 * template is used through one of these - `[[camera_entry|with:...]]` - rather than through
 * a card's `template:`, so this is how a sweep tells a used item template from an unused one.
 */
export function placeholderHeads(node: unknown): Set<string> {
  const heads = new Set<string>();
  const json = JSON.stringify(node ?? null);
  if (typeof json !== 'string') return heads;
  const pattern = /\[\[!?([A-Za-z0-9_.-]+)(?=[|?\]])/g;
  for (let match = pattern.exec(json); match !== null; match = pattern.exec(json)) heads.add(match[1]);
  return heads;
}
