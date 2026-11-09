import { TemplateConfig } from './types';
import deepReplace from './deep-replace';
import { isRegistrySource, resolveRegistryItems } from './registry';
import { forEachVariables, restoreHaText, VariableDeclaration } from './variables';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * #404: a dropdown whose choices come from Home Assistant. `options_from:` takes the same
 * source `for_each_from:` does, and each thing it finds becomes one option, filled in the
 * way a repeat copy is: `option_value:` is what the variable is set to, `option_label:` what
 * the dropdown shows. Worked out when the card editor draws its form, not as entities come
 * and go - the form is redrawn when the editor is opened again.
 */

export interface SelectOption {
  value: string;
  label: string;
}

/** Whether a declaration asks for its options to be found rather than written out. */
export function hasOptionsFrom(declaration: VariableDeclaration | undefined): boolean {
  return isRegistrySource(declaration?.options_from);
}

/*
 * `keep` keeps Home Assistant's text marked, for an option's value: the value is written into
 * the card's config, where the build reads it again, and a friendly name of `[[secret]]` must
 * still be text there. The build takes the marks off when it is done, as it does a resolver's.
 * A label is only shown, so it is written out.
 */
function filled(content: unknown, variables: any[], hass: any, keep = false): string | undefined {
  const out = deepReplace(
    variables,
    {} as TemplateConfig,
    content,
    undefined,
    hass,
    true,
    undefined,
    0,
    undefined,
    undefined,
    keep,
  );
  if (out === undefined || out === null) return undefined;
  const text = typeof out === 'string' ? out : JSON.stringify(out);
  return text.trim() === '' ? undefined : text;
}

/*
 * The options, in the order the source gives them. Without `option_value:` an option is the
 * thing itself (its entity id, area id and so on). One that fills to nothing is dropped, and
 * so is a second option with a value already offered: two entities trimmed to the same name
 * are one choice, not two the same.
 */
export function optionsFrom(declaration: VariableDeclaration, hass: any): SelectOption[] {
  if (!hass || !hasOptionsFrom(declaration)) return [];
  const items = resolveRegistryItems(hass, declaration.options_from);
  const valueOf = declaration.option_value ?? '[[value]]';
  const options: SelectOption[] = [];
  const seen = new Set<string>();
  items.forEach((item, index) => {
    // The thing itself, under the one name every source answers to. A device also carries its
    // area's id, so the area comes last of the ids.
    const own = item.entity ?? item.device_id ?? item.label_id ?? item.floor_id ?? item.area_id ?? item.path;
    const variables = forEachVariables({ value: own, ...item }, undefined, index, items.length);
    const value = filled(valueOf, variables, hass, true);
    if (value === undefined || seen.has(value)) return;
    seen.add(value);
    const label = filled(declaration.option_label ?? valueOf, variables, hass) ?? restoreHaText(value);
    options.push({ value, label });
  });
  return options;
}

/*
 * The selector for a declaration with `options_from:`. A `select:` written beside it keeps
 * its own settings (multiple, custom_value, mode) and has its options replaced; anything
 * else gets a plain dropdown.
 */
export function optionsFromSelector(declaration: VariableDeclaration, hass: any): unknown {
  const options = optionsFrom(declaration, hass);
  const written = declaration.selector?.select;
  const base = written && typeof written === 'object' ? written : { mode: 'dropdown' };
  return { select: { ...base, options } };
}
