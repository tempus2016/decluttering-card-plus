import { LovelaceConfig } from 'custom-card-helpers';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * `strict:` (#390) says what a card does about what went wrong while it was built, one level
 * at a time. An error is a placeholder left standing - a variable nothing gave a value -
 * which is what `strict: true` has always refused. A warning is anything else the build
 * said in the console: a step that gave up, a read that went too deep, and the like.
 *
 *   errors:   ignore (renders as ever) | report (renders, with the debug report under it)
 *           | fail (refuses, and `on_error:` decides what shows instead)
 *   warnings: ignore | notice (a small notice on the card that can be closed) | report
 *
 * `strict: true` is `errors: fail` and leaves warnings alone, which is exactly what it did
 * before there were levels; `strict: false` is both ignored. Written on the card, on its
 * template, or as `decluttering_strict:` on a section, a view or the whole dashboard - the
 * places decluttering_defaults goes - each level is taken from the nearest place that sets
 * it, so a dashboard can ask for notices and one card can still fail on errors.
 */

export const STRICT_KEY = 'decluttering_strict';

export const ERROR_MODES = ['ignore', 'report', 'fail'] as const;
export const WARNING_MODES = ['ignore', 'notice', 'report'] as const;

export type ErrorMode = (typeof ERROR_MODES)[number];
export type WarningMode = (typeof WARNING_MODES)[number];

export interface StrictLevels {
  errors: ErrorMode;
  warnings: WarningMode;
}

/** The level-by-level form of `strict:`. `error` and `warn` are taken too, the words #390 asked with. */
export interface StrictConfig {
  errors?: ErrorMode;
  warnings?: WarningMode;
}

export const STRICT_OFF: StrictLevels = { errors: 'ignore', warnings: 'ignore' };

// What `strict: true` means for each level: what it has always meant, and nothing new.
export const STRICT_TRUE: StrictLevels = { errors: 'fail', warnings: 'ignore' };

const LEVEL_KEYS: Record<keyof StrictLevels, string[]> = {
  errors: ['errors', 'error'],
  warnings: ['warnings', 'warn'],
};

function modeOf(written: unknown, modes: readonly string[]): string | undefined {
  return typeof written === 'string' && modes.includes(written.trim().toLowerCase())
    ? written.trim().toLowerCase()
    : undefined;
}

/** The levels one place sets, and only those: a level it leaves out, or writes wrong, is the next place's to say. */
export function strictLayer(written: unknown): Partial<StrictLevels> {
  if (written === true) return { ...STRICT_TRUE };
  if (written === false) return { ...STRICT_OFF };
  if (!written || typeof written !== 'object' || Array.isArray(written)) return {};
  const layer: Partial<StrictLevels> = {};
  const errors = LEVEL_KEYS.errors.map((key) => modeOf((written as any)[key], ERROR_MODES)).find(Boolean);
  const warnings = LEVEL_KEYS.warnings.map((key) => modeOf((written as any)[key], WARNING_MODES)).find(Boolean);
  if (errors) layer.errors = errors as ErrorMode;
  if (warnings) layer.warnings = warnings as WarningMode;
  return layer;
}

/** Each level from the nearest of the places given, nearest first; ignored where none says. */
export function strictLevels(layers: unknown[]): StrictLevels {
  const levels: Partial<StrictLevels> = {};
  for (const written of layers) {
    const layer = strictLayer(written);
    levels.errors ??= layer.errors;
    levels.warnings ??= layer.warnings;
  }
  return { errors: levels.errors ?? 'ignore', warnings: levels.warnings ?? 'ignore' };
}

/**
 * The `decluttering_strict:` of a card's section, its view (or the strategy writing the view)
 * and the dashboard, nearest first - where decluttering_defaults is read from.
 */
export function placeStrict(ll: LovelaceConfig | null | undefined, view?: number, section?: number): unknown[] {
  const viewConfig = view === undefined ? undefined : (ll as any)?.views?.[view];
  return [
    section === undefined ? undefined : viewConfig?.sections?.[section]?.[STRICT_KEY],
    viewConfig?.[STRICT_KEY] ?? viewConfig?.strategy?.[STRICT_KEY],
    (ll as any)?.[STRICT_KEY],
  ];
}

/** What is wrong with a `strict:` as written, for lint: a key it does not know, or a mode a level does not have. */
export function strictProblems(written: unknown): { key: string; value: string; allowed: string }[] {
  if (written === undefined || written === null || typeof written === 'boolean') return [];
  if (typeof written !== 'object' || Array.isArray(written)) {
    return [{ key: 'strict', value: String(written), allowed: 'true, false, errors:, warnings:' }];
  }
  const problems: { key: string; value: string; allowed: string }[] = [];
  for (const [key, value] of Object.entries(written)) {
    const level = (Object.keys(LEVEL_KEYS) as (keyof StrictLevels)[]).find((each) => LEVEL_KEYS[each].includes(key));
    if (!level) {
      problems.push({ key, value: String(value), allowed: 'errors, warnings' });
      continue;
    }
    const modes = level === 'errors' ? ERROR_MODES : WARNING_MODES;
    if (!modeOf(value, modes)) problems.push({ key, value: String(value), allowed: modes.join(', ') });
  }
  return problems;
}
