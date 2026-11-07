import { TemplateConfig, VariablesConfig } from '../types';
import deepReplace, { BuildExtras } from '../deep-replace';
import { normaliseVariables, PLACEHOLDER, resolveVariables, variableValues } from '../variables';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * #373: a field the card leaves unset shows the default it will be built with, instead of
 * looking empty. The default is the one that actually applies - a dashboard, view or section
 * `decluttering_defaults`, `let:`, then the template's own - and it is only shown: nothing is
 * written into the card until the field is changed.
 *
 * A default made from other variables (`default: '[[room]] lights'`) is filled in from what
 * the card holds right now, so it follows the other fields as they change. One that cannot be
 * filled in yet is left blank rather than showing brackets a picker could not read.
 *
 * #404: the dashboard's item templates come in too, as the card has them, so a default made
 * with `[[name|with]]` or `[[name|repeat:...]]` is filled in rather than left blank.
 */

/** The value each unset variable will take, by name, for the names asked about. */
export function shownDefaults(
  names: string[],
  variables: VariablesConfig[] | VariablesConfig | undefined,
  template: TemplateConfig | undefined,
  hass?: any,
  extras?: BuildExtras,
): Map<string, unknown> {
  const shown = new Map<string, unknown>();
  if (!template || !names.length) return shown;
  const values = variableValues(resolveVariables(variables, template));
  for (const name of names) {
    if (!(name in values)) continue;
    const value = filledDefault(values[name], variables, template, hass, extras);
    if (value !== undefined && value !== null && value !== '') shown.set(name, value);
  }
  return shown;
}

/** A default with its placeholders filled in, or undefined when one of them has nothing to fill it. */
export function filledDefault(
  value: unknown,
  variables: VariablesConfig[] | VariablesConfig | undefined,
  template: TemplateConfig,
  hass?: any,
  extras?: BuildExtras,
): unknown {
  if (value === undefined) return undefined;
  const json = JSON.stringify(value);
  if (typeof json !== 'string' || !PLACEHOLDER.test(json)) return value;
  let unresolved = false;
  let filled: any;
  try {
    // Wrapped, so a default that is a single placeholder comes back as the value it stands
    // for - a number stays a number - the way it would on the card.
    filled = deepReplace(
      normaliseVariables(variables),
      template,
      { value },
      undefined,
      hass,
      true,
      () => {
        unresolved = true;
      },
      0,
      undefined,
      undefined,
      false,
      extras,
    );
  } catch {
    return undefined;
  }
  if (unresolved) return undefined;
  const result = filled?.value;
  // A placeholder the build refused to fill is left standing; a picker cannot show that.
  const text = JSON.stringify(result);
  if (typeof text === 'string' && PLACEHOLDER.test(text)) return undefined;
  return result;
}

/** Whether what came back from the form is still the default it was shown, untouched. */
export function isShownValue(value: unknown, shown: unknown): boolean {
  if (value === shown) return true;
  if (typeof value !== 'object' || value === null || typeof shown !== 'object' || shown === null) return false;
  return JSON.stringify(value) === JSON.stringify(shown);
}
