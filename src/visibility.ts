import { TemplateConfig, VariablesConfig } from './types';
import { resolveVariables, variableValues } from './variables';
import { globMatches } from './registry';
import { localize } from './localize';
import deepReplace from './deep-replace';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * A template decides for itself whether a copy is worth building (idea 45):
 *
 *   room_climate:
 *     visibility:
 *       - variable: climate
 *         exists: true
 *       - variable: area
 *         not_in: [Garage, Shed]
 *
 * The conditions read the copy's variables as they end up - defaults and `let:` included -
 * never an entity's state, so they are settled once at build time and cost nothing after.
 * Every condition has to hold. A copy that fails is never built: a repeat drops it, a single
 * card hides itself. Different from a card's own `visibility:`, which builds the card and
 * then hides it. `required: true` on a declaration stays as the short form of `exists: true`.
 */
export const VISIBILITY_KEY = 'visibility';

export interface VisibilityCondition {
  variable: string;
  exists?: boolean;
  equals?: unknown;
  not_equals?: unknown;
  in?: unknown[];
  not_in?: unknown[];
  matches?: string;
}

export type Visibility = { visible: true } | { visible: false; reason: string };

const CONDITION_KEYS = ['exists', 'equals', 'not_equals', 'in', 'not_in', 'matches'];

/** The template's conditions, as written, with anything that is not a condition left out. */
export function visibilityConditions(template: TemplateConfig | undefined): VisibilityCondition[] {
  const written = (template as any)?.[VISIBILITY_KEY];
  const list = Array.isArray(written) ? written : written && typeof written === 'object' ? [written] : [];
  return list.filter(
    (each: any) =>
      each &&
      typeof each === 'object' &&
      typeof each.variable === 'string' &&
      each.variable &&
      CONDITION_KEYS.some((key) => key in each),
  );
}

/** Whether the template has anything to say about visibility at all. */
export function hasVisibility(template: TemplateConfig | undefined): boolean {
  return visibilityConditions(template).length > 0;
}

const isSet = (value: unknown): boolean => value !== undefined && value !== null && value !== '';

const text = (value: unknown): string =>
  value === undefined || value === null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);

const same = (a: unknown, b: unknown): boolean => text(a) === text(b);

const listOf = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : typeof value === 'string' ? value.split(',').map((each) => each.trim()) : [value];

/** The condition as the reason reads it back: `not_in: Garage, Shed`. */
function describe(condition: VisibilityCondition): string {
  for (const key of CONDITION_KEYS) {
    if (!(key in condition)) continue;
    const value = (condition as any)[key];
    return `${key}: ${Array.isArray(value) ? value.map(text).join(', ') : text(value)}`;
  }
  return '';
}

/**
 * Whether a copy with these variables is built, and when not, why - in words for the
 * dashed slot edit mode draws in its place.
 */
export function templateVisibility(
  template: TemplateConfig | undefined,
  variables: VariablesConfig[] | VariablesConfig | undefined,
  hass?: any,
): Visibility {
  const conditions = visibilityConditions(template);
  if (!conditions.length) return { visible: true };
  const resolved = resolveVariables(variables, template);
  const values = variableValues(resolved);
  // A value built from other placeholders - a `let:` - is read as it will end up, not as written.
  const settle = (value: unknown): unknown =>
    typeof value === 'string' && value.includes('[[') ? deepReplace(resolved, {}, value, undefined, hass, true) : value;
  for (const condition of conditions) {
    const value = settle(values[condition.variable]);
    const set = isSet(value);
    const closed = (): Visibility => ({
      visible: false,
      reason: set
        ? localize(
            'visibility.closed_value',
            { variable: condition.variable, value: text(value), condition: describe(condition) },
            hass,
          )
        : localize('visibility.closed_unset', { variable: condition.variable }, hass),
    });
    if ('exists' in condition && set !== (condition.exists !== false)) return closed();
    // The rest compare a value; an unset one fails them all, except not_equals and not_in,
    // which nothing can be equal to.
    if ('equals' in condition && (!set || !same(value, condition.equals))) return closed();
    if ('not_equals' in condition && set && same(value, condition.not_equals)) return closed();
    if ('in' in condition && (!set || !listOf(condition.in).some((each) => same(value, each)))) return closed();
    if ('not_in' in condition && set && listOf(condition.not_in).some((each) => same(value, each))) return closed();
    if ('matches' in condition && (!set || !globMatches(text(value), String(condition.matches)))) return closed();
  }
  return { visible: true };
}

// What a skipped copy is called in edit mode: the names people give things, in the order
// they are most likely to be the thing's name.
const LABEL_KEYS = ['name', 'area', 'friendly_name', 'floor', 'label', 'device', 'entity', 'item'];

/** A short name for one item of a repeat, for the slot that stands where its copy would. */
export function itemLabel(item: unknown, index: number): string {
  if (item && typeof item === 'object' && !Array.isArray(item)) {
    const record = item as Record<string, unknown>;
    for (const key of LABEL_KEYS) {
      if (typeof record[key] === 'string' && record[key]) return record[key] as string;
    }
    const scalar = Object.values(record).find(
      (value) => (typeof value === 'string' && value !== '') || typeof value === 'number',
    );
    if (scalar !== undefined) return String(scalar);
  } else if ((typeof item === 'string' && item !== '') || typeof item === 'number') {
    return String(item);
  }
  return `#${index + 1}`;
}

/** The card that stands where a skipped copy would be, in edit mode. */
export const SKIPPED_TAG = 'decluttering-card-plus-skipped';

export function skippedConfig(label: string, reason: string): Record<string, unknown> {
  return { type: `custom:${SKIPPED_TAG}`, label, reason };
}
