import { closestTemplate } from '../closest';
import { ADVANCED_KEYS } from './advanced';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * #344: `editor_hide:` - a template saying which parts of the card editor mean nothing for
 * it. A camera template built from one name has no use for "repeat this for each entity",
 * and a shared template can keep its users out of settings it was never written for.
 *
 * It only tidies the visual editor. YAML still takes every option, and a part the card
 * already uses is never hidden - otherwise a setting could be written and never removed.
 */

/** The repeat settings, which come and go together. */
export const REPEAT_KEYS = [
  'for_each',
  'for_each_from',
  'columns',
  'min_column_width',
  'gap',
  'lazy',
  'lazy_eager',
  'empty',
];

/** Every name `editor_hide:` understands: whole parts, then the Advanced fields one by one. */
export const HIDEABLE = ['repeat', 'extras', 'fit', 'advanced', ...ADVANCED_KEYS];

// The Advanced form's own field names, for the config keys that are edited under another name.
const ADVANCED_FIELDS: Record<string, string[]> = {
  grid_options: ['grid_columns', 'grid_rows'],
  on_error: ['on_error_mode'],
};

/** What a template's `editor_hide:` names - one name or a list - lower-cased, unknown names kept for lint. */
export function hiddenNames(template: unknown): string[] {
  const written = (template as any)?.editor_hide;
  const list = Array.isArray(written) ? written : written === undefined ? [] : [written];
  return list
    .filter((name): name is string => typeof name === 'string' && name.trim() !== '')
    .map((name) => name.trim().toLowerCase());
}

/** The names in `editor_hide:` this card does not know, each with the closest one it does. */
export function unknownHidden(template: unknown): { name: string; closest?: string }[] {
  return hiddenNames(template)
    .filter((name) => !HIDEABLE.includes(name))
    .map((name) => {
      const closest = closestTemplate(name, HIDEABLE);
      return closest ? { name, closest } : { name };
    });
}

const isSet = (config: any, key: string): boolean => config?.[key] !== undefined;

/**
 * Which parts of the editor to leave out for this card. A part is shown again as soon as the
 * card has something written in it, so whatever is there can still be seen and taken out.
 */
export interface EditorHidden {
  repeat: boolean;
  extras: boolean;
  fit: boolean;
  advanced: boolean;
  /** Advanced form fields to drop, by their field name. */
  advancedFields: string[];
}

export function editorHidden(template: unknown, config: unknown, extras?: unknown[]): EditorHidden {
  const names = new Set(hiddenNames(template));
  const advancedUsed = ADVANCED_KEYS.some((key) => isSet(config, key));
  return {
    repeat: names.has('repeat') && !REPEAT_KEYS.some((key) => isSet(config, key)),
    extras: names.has('extras') && !extras?.length,
    fit: names.has('fit') && !isSet(config, 'fit'),
    advanced: names.has('advanced') && !advancedUsed,
    advancedFields: ([] as string[]).concat(
      ...ADVANCED_KEYS.filter((key) => names.has(key) && !isSet(config, key)).map(
        (key) => ADVANCED_FIELDS[key] ?? [key],
      ),
    ),
  };
}

/** A form schema without the fields named. */
export function withoutFields(schema: unknown[], names: string[]): unknown[] {
  if (!names.length) return schema;
  return schema.filter((entry: any) => !names.includes(entry?.name));
}
