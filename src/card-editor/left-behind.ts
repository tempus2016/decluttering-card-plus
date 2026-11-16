import { TemplateConfig, VariablesConfig } from '../types';
import { BuildExtras } from '../deep-replace';
import { PLACEHOLDER, variableValues } from '../variables';
import { defaultTarget, DefaultPlaces, filledDefault, withoutVariable } from './defaults';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * #469: a field the card sets by hand keeps its value when a field its default is worked out
 * from changes. That is the point of setting it - but in a list the template worked out,
 * changing one item keeps the whole list, so changing the zone afterwards silently stops
 * reaching any of it. The editor says so under the field that changed, with a Reset.
 *
 * Nobody declares which field drives which. A default depends on the changed field when
 * working it out with the values from before the change gives something different from
 * working it out with the values after it. That follows chains (camera to zone to
 * detections), `let:` and item templates for free, because it is the same build the card
 * does. Nothing is stored: the note lives as long as the open editor.
 */

type Variables = VariablesConfig[] | VariablesConfig | undefined;

const same = (a: unknown, b: unknown): boolean => a === b || JSON.stringify(a) === JSON.stringify(b);

/** The names whose value the card sets differently after the change than before it. */
export function changedNames(before: Variables, after: Variables): string[] {
  const was = variableValues(before);
  const now = variableValues(after);
  const names = new Set([...Object.keys(was), ...Object.keys(now)]);
  return [...names].filter((name) => !same(was[name], now[name]));
}

/** The name's default as written, when it is worked out from something, or undefined. */
function computedDefault(name: string, variables: Variables, template: TemplateConfig, places: DefaultPlaces): unknown {
  const target = defaultTarget(name, variables, template, places);
  if (!target) return undefined;
  const json = JSON.stringify(target.value);
  return typeof json === 'string' && PLACEHOLDER.test(json) ? target.value : undefined;
}

/** The default worked out with these values, as the card would build it if it did not set the name. */
function workedOut(
  name: string,
  written: unknown,
  variables: Variables,
  template: TemplateConfig,
  hass?: any,
  extras?: BuildExtras,
): unknown {
  return filledDefault(written, withoutVariable(variables, name), template, hass, extras);
}

/**
 * Of the names asked about, the ones the card set by hand both before and after the change
 * whose worked-out default moved with it and no longer matches what the card holds.
 */
export function leftBehind(
  names: string[],
  before: Variables,
  after: Variables,
  template: TemplateConfig | undefined,
  hass?: any,
  extras?: BuildExtras,
  places: DefaultPlaces = {},
): string[] {
  if (!template) return [];
  const changed = new Set(changedNames(before, after));
  if (!changed.size) return [];
  const was = variableValues(before);
  const now = variableValues(after);
  const found: string[] = [];
  for (const name of names) {
    // A field changed in this edit was dealt with by whoever changed it.
    if (changed.has(name) || !(name in was) || !(name in now)) continue;
    const written = computedDefault(name, after, template, places);
    if (written === undefined) continue;
    const fresh = workedOut(name, written, after, template, hass, extras);
    if (fresh === undefined || same(fresh, now[name])) continue;
    const old = workedOut(name, written, before, template, hass, extras);
    if (same(old, fresh)) continue;
    found.push(name);
  }
  return found;
}

/** Of the names, the ones the card still sets to something other than their worked-out default. */
export function stillBehind(
  names: string[],
  variables: Variables,
  template: TemplateConfig | undefined,
  hass?: any,
  extras?: BuildExtras,
  places: DefaultPlaces = {},
): string[] {
  if (!template) return [];
  const now = variableValues(variables);
  return names.filter((name) => {
    if (!(name in now)) return false;
    const written = computedDefault(name, variables, template, places);
    if (written === undefined) return false;
    const fresh = workedOut(name, written, variables, template, hass, extras);
    return fresh !== undefined && !same(fresh, now[name]);
  });
}

/**
 * The notes after an edit, by the field that changed: the edit's own note replaces any the
 * changed fields had, a field the edit changed drops out of every note, and a note left with
 * nothing goes.
 */
export function nextNotes(
  notes: Map<string, string[]>,
  changed: string[],
  found: string[],
  declared: Set<string>,
): Map<string, string[]> {
  const next = new Map<string, string[]>();
  for (const [field, names] of notes) {
    if (changed.includes(field)) continue;
    const kept = names.filter((name) => !changed.includes(name));
    if (kept.length) next.set(field, kept);
  }
  const owner = changed.find((name) => declared.has(name));
  if (owner && found.length) next.set(owner, found);
  return next;
}
