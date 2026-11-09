import { DeclutteringCardConfig, TemplateConfig, VariablesConfig } from '../types';
import deepReplace, { BuildExtras } from '../deep-replace';
import { variableRows } from '../trace';
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

/*
 * #255 (idea 18): a field the card sets, where something else would give the variable a value
 * if the card did not, gets a Reset. Reset takes the card's own line out rather than writing
 * the default in, so the default applies again - and a later change to it still reaches the
 * card. The field then shows the default the way #373 shows any unset field.
 */

/** Where the value a Reset falls back to is written. */
export type DefaultSource = 'template' | 'section' | 'view' | 'dashboard' | 'library';

export interface ResetTarget {
  /** The default as written, placeholders and all. */
  value: unknown;
  source: DefaultSource;
}

/** The values written in the places a card sits, for telling a section from its view and a dashboard from the library. */
export interface DefaultPlaces {
  section?: VariablesConfig[] | VariablesConfig;
  dashboard?: VariablesConfig[] | VariablesConfig;
  library?: VariablesConfig[] | VariablesConfig;
}

const own = (values: VariablesConfig[] | VariablesConfig | undefined, name: string): boolean =>
  name in variableValues(values);

// Whether a key of the card's variables is the name, or one of its dotted parts (`name.x`).
const isPartOf = (key: string, name: string): boolean => key === name || key.startsWith(`${name}.`);

/**
 * The card's variables without the name - its dotted parts too - in the shape they were
 * written: a mapping stays a mapping, a list stays a list and loses only that line.
 * Undefined when nothing is left.
 */
export function withoutVariable(
  variables: VariablesConfig[] | VariablesConfig | undefined,
  name: string,
): VariablesConfig[] | VariablesConfig | undefined {
  const strip = (entry: unknown): unknown => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return entry;
    const kept: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(entry)) if (!isPartOf(key, name)) kept[key] = value;
    return Object.keys(kept).length ? kept : undefined;
  };
  if (Array.isArray(variables)) {
    const kept = variables.map(strip).filter((entry) => entry !== undefined) as VariablesConfig[];
    return kept.length ? kept : undefined;
  }
  return strip(variables) as VariablesConfig | undefined;
}

/** The card with the name reset: its line out, and the variables key gone when it was the last. */
export function resetVariable(config: DeclutteringCardConfig, name: string): DeclutteringCardConfig {
  const out = { ...config } as DeclutteringCardConfig;
  const variables = withoutVariable(config.variables, name);
  if (variables === undefined) delete out.variables;
  else out.variables = variables as VariablesConfig[];
  return out;
}

/**
 * What the name falls back to once the card stops setting it, and where that is written -
 * or undefined when the card does not set it, or nothing else would.
 */
export function resetTarget(
  name: string,
  variables: VariablesConfig[] | VariablesConfig | undefined,
  template: TemplateConfig | undefined,
  places: DefaultPlaces = {},
): ResetTarget | undefined {
  return own(variables, name) ? defaultTarget(name, variables, template, places) : undefined;
}

/**
 * What the name is built with when the card does not set it, and where that is written,
 * whether the card sets it or not - or undefined when nothing else gives it a value. The
 * field's helper names it before the first keystroke as well as after, so the line under
 * the field does not appear as the card starts setting it (#255).
 */
export function defaultTarget(
  name: string,
  variables: VariablesConfig[] | VariablesConfig | undefined,
  template: TemplateConfig | undefined,
  places: DefaultPlaces = {},
): ResetTarget | undefined {
  if (!template) return undefined;
  const row = variableRows(withoutVariable(variables, name), template).find((each) => each.variable === name);
  if (!row) return undefined;
  let source: DefaultSource;
  switch (row.from) {
    case 'section_let':
      source = 'section';
      break;
    case 'view_let':
      source = 'view';
      break;
    case 'dashboard_let':
      source = 'dashboard';
      break;
    case 'view':
      // A section's decluttering_defaults ride with the view's, nearest first.
      source = own(places.section, name) ? 'section' : 'view';
      break;
    case 'dashboard':
      // The library's values sit under the dashboard's own.
      source = !own(places.dashboard, name) && own(places.library, name) ? 'library' : 'dashboard';
      break;
    default:
      // `let:`, a declaration's `default:` and the `default:` list are all the template's.
      source = 'template';
  }
  return { value: row.value, source };
}

/** A default as one line of text, the way it would be typed: a mapping or list as flow YAML. */
export function defaultText(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return `[${value.map(defaultText).join(', ')}]`;
  if (typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .map(([key, each]) => `${key}: ${defaultText(each)}`)
      .join(', ')}}`;
  }
  return String(value);
}
