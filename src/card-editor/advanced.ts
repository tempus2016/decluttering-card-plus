import { HomeAssistant } from 'custom-card-helpers';
import { DeclutteringCardConfig, FormSchemaEntry, TemplateConfig } from '../types';
import { localize } from '../localize';
import { isRebuildObject, rebuildOnEntities } from '../rebuild';
import { isRebuildPlaceholder } from '../rebuild-resolve';
import { ON_ERROR_HIDE, ON_ERROR_KEY } from '../on-error';
import { ERROR_MODES, ErrorMode, STRICT_TRUE, strictLayer, WARNING_MODES, WarningMode } from '../strict';

/*
 * Idea 14: the Advanced section of the card editor. Eight settings that were YAML-only -
 * grid_options, style, on_error, strict, rebuild_on, debug, name, inherit_variables - drawn
 * as form fields. Every field reads and writes the key the card reads today, and a default
 * writes nothing, so a card that never opens the section keeps exactly the YAML it had.
 */

export type OnErrorMode = 'show' | 'hide' | 'card';

/** `debug: true`, the original switch, has no word of its own in YAML; the form calls it `json`. */
export type DebugMode = 'off' | 'json' | 'yaml' | 'console' | 'report';

export interface AdvancedData {
  /** Written as text so the words `full` and `auto` fit beside the numbers. */
  grid_columns?: string;
  grid_rows?: string;
  style?: string;
  on_error_mode: OnErrorMode;
  /** `strict:` one level at a time (#390); `ignore` for both writes nothing. */
  strict_errors: ErrorMode;
  strict_warnings: WarningMode;
  rebuild_on?: string[];
  /** `rebuild_on_watch:` (#411): `default` writes nothing; `custom` is a list written in YAML, kept as it is. */
  rebuild_on_watch: WatchMode;
  debug: DebugMode;
  name?: string;
  inherit_variables?: boolean;
}

/** What the card compares a rebuild_on entity's change on (#411). */
export type WatchMode = 'default' | 'all' | 'read' | 'custom';

function watchMode(written: unknown): WatchMode {
  if (written === undefined || written === null) return 'default';
  if (written === 'all' || written === 'read') return written;
  return 'custom';
}

/** A `watch:` value as text: `read`, or the parts it names. */
export function watchText(value: unknown): string {
  return Array.isArray(value) ? value.map(String).join(', ') : String(value);
}

/** The config keys the section edits, which is what the summary counts. */
export const ADVANCED_KEYS = [
  'grid_options',
  'style',
  ON_ERROR_KEY,
  'strict',
  'rebuild_on',
  'rebuild_on_watch',
  'debug',
  'name',
  'inherit_variables',
];

// A grid dimension written as a number or as one of the words the sections view understands.
function gridText(value: unknown): string | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value === 'string' && value.trim()) return value.trim();
  return undefined;
}

function gridValue(text: unknown): number | string | undefined {
  if (typeof text === 'number') return text;
  if (typeof text !== 'string' || !text.trim()) return undefined;
  const trimmed = text.trim();
  const number = Number(trimmed);
  return Number.isFinite(number) && /^\d+$/.test(trimmed) ? number : trimmed;
}

function onErrorMode(written: unknown): OnErrorMode {
  if (written === ON_ERROR_HIDE) return 'hide';
  if (written && typeof written === 'object' && !Array.isArray(written)) return 'card';
  return 'show';
}

function debugMode(written: unknown): DebugMode {
  if (written === true) return 'json';
  if (written === 'yaml' || written === 'console' || written === 'report') return written;
  return 'off';
}

/** A rebuild_on value as a list, one entry or many. */
function rebuildList(value: unknown): unknown[] {
  return Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
}

/**
 * The placeholders in the card's own rebuild_on (#411), and the entries written as
 * `{entity, watch}`. The entity picker cannot draw either, so the section lists them beside
 * it, each with a way to take it out.
 */
export function rebuildPlaceholders(config: DeclutteringCardConfig): unknown[] {
  return rebuildList(config.rebuild_on).filter((each) => isRebuildPlaceholder(each) || isRebuildObject(each));
}

/** The card with one placeholder taken out of its rebuild_on, and the key gone with the last entry. */
export function withoutRebuildEntry(config: DeclutteringCardConfig, entry: unknown): DeclutteringCardConfig {
  const out = { ...config } as Record<string, unknown>;
  const kept = rebuildList(config.rebuild_on).filter((each) => each !== entry);
  if (kept.length) out.rebuild_on = kept;
  else delete out.rebuild_on;
  return out as DeclutteringCardConfig;
}

/** What the section's form shows for a card. */
export function advancedData(config: DeclutteringCardConfig): AdvancedData {
  // Only what the card itself writes: what a template or a dashboard says is not this card's to change.
  const strict = strictLayer(config.strict);
  const data: AdvancedData = {
    on_error_mode: onErrorMode(config[ON_ERROR_KEY]),
    strict_errors: strict.errors ?? 'ignore',
    strict_warnings: strict.warnings ?? 'ignore',
    rebuild_on_watch: watchMode(config.rebuild_on_watch),
    debug: debugMode(config.debug),
  };
  const grid = config.grid_options as Record<string, unknown> | undefined;
  const columns = gridText(grid?.columns);
  const rows = gridText(grid?.rows);
  if (columns !== undefined) data.grid_columns = columns;
  if (rows !== undefined) data.grid_rows = rows;
  if (typeof config.style === 'string' && config.style) data.style = config.style;
  // Only the plain ids: an entry that says what it watches is listed beside the picker (#411).
  const rebuild = rebuildOnEntities(rebuildList(config.rebuild_on).filter((each) => typeof each === 'string'));
  if (rebuild.length) data.rebuild_on = rebuild;
  if (typeof config.name === 'string' && config.name) data.name = config.name;
  if (config.inherit_variables === true) data.inherit_variables = true;
  return data;
}

/**
 * The card with the form's values written in. A default removes its key; a value the form
 * cannot draw - a `grid_options` key other than columns and rows - is kept as it was.
 */
export function applyAdvanced(config: DeclutteringCardConfig, data: AdvancedData): DeclutteringCardConfig {
  const out = { ...config } as Record<string, unknown>;

  const grid = { ...((config.grid_options as Record<string, unknown> | undefined) ?? {}) };
  const columns = gridValue(data.grid_columns);
  const rows = gridValue(data.grid_rows);
  if (columns === undefined) delete grid.columns;
  else grid.columns = columns;
  if (rows === undefined) delete grid.rows;
  else grid.rows = rows;
  if (Object.keys(grid).length) out.grid_options = grid;
  else delete out.grid_options;

  const style = typeof data.style === 'string' ? data.style : '';
  if (style.trim()) out.style = style;
  else delete out.style;

  switch (data.on_error_mode) {
    case 'hide':
      out[ON_ERROR_KEY] = ON_ERROR_HIDE;
      break;
    case 'card':
      // The card itself is chosen in the slot under the dropdown; until then there is
      // nothing to write, and a card already there stays.
      if (onErrorMode(config[ON_ERROR_KEY]) !== 'card') delete out[ON_ERROR_KEY];
      break;
    default:
      delete out[ON_ERROR_KEY];
  }

  // What `strict: true` has always meant is still written that way; anything else level by level.
  const errors = data.strict_errors ?? 'ignore';
  const warnings = data.strict_warnings ?? 'ignore';
  // An `ignore` the card wrote out is kept: it is how one card turns off what its dashboard asks for.
  const written = config.strict && typeof config.strict === 'object' ? strictLayer(config.strict) : {};
  const strict = {
    ...(errors !== 'ignore' || written.errors ? { errors } : {}),
    ...(warnings !== 'ignore' || written.warnings ? { warnings } : {}),
  };
  if (errors === STRICT_TRUE.errors && warnings === STRICT_TRUE.warnings && !written.warnings) out.strict = true;
  else if (Object.keys(strict).length) out.strict = strict;
  else delete out.strict;

  // A placeholder or a `{entity, watch}` entry (#411) cannot be drawn in the entity picker,
  // so it is kept as written rather than lost the first time anything on this tab changes.
  const kept = rebuildPlaceholders(config);
  const rebuild = [...rebuildOnEntities(data.rebuild_on), ...kept];
  if (rebuild.length) out.rebuild_on = rebuild;
  else delete out.rebuild_on;

  switch (data.rebuild_on_watch) {
    case 'all':
    case 'read':
      out.rebuild_on_watch = data.rebuild_on_watch;
      break;
    case 'custom':
      // A list of parts is the YAML's to change; the form only keeps it.
      if (watchMode(config.rebuild_on_watch) !== 'custom') delete out.rebuild_on_watch;
      break;
    default:
      delete out.rebuild_on_watch;
  }

  switch (data.debug) {
    case 'json':
      out.debug = true;
      break;
    case 'yaml':
    case 'console':
    case 'report':
      out.debug = data.debug;
      break;
    default:
      delete out.debug;
  }

  const name = typeof data.name === 'string' ? data.name.trim() : '';
  if (name) out.name = name;
  else delete out.name;

  if (data.inherit_variables === true) out.inherit_variables = true;
  else delete out.inherit_variables;

  return out as DeclutteringCardConfig;
}

/** The fallback card a card shows instead of an error, when it has one. */
export function onErrorCard(config: DeclutteringCardConfig): Record<string, unknown> | undefined {
  const written = config[ON_ERROR_KEY];
  return written && typeof written === 'object' && !Array.isArray(written)
    ? (written as Record<string, unknown>)
    : undefined;
}

/** The card with a fallback card chosen, or with it taken away again. */
export function withOnErrorCard(
  config: DeclutteringCardConfig,
  card: Record<string, unknown> | undefined,
): DeclutteringCardConfig {
  const out = { ...config } as Record<string, unknown>;
  if (card && typeof card === 'object') out[ON_ERROR_KEY] = card;
  else delete out[ON_ERROR_KEY];
  return out as DeclutteringCardConfig;
}

/**
 * How many of the section's settings the card has set, for the summary line. rebuild_on
 * counts once whether the card lists entities, placeholders or both, or only its template
 * does (#411) - it is what the card rebuilds on all the same.
 */
export function advancedCount(config: DeclutteringCardConfig, template?: TemplateConfig): number {
  const data = advancedData(config);
  let count = 0;
  if (data.grid_columns !== undefined || data.grid_rows !== undefined) count += 1;
  if (data.style !== undefined) count += 1;
  if (data.on_error_mode !== 'show') count += 1;
  if (data.strict_errors !== 'ignore' || data.strict_warnings !== 'ignore') count += 1;
  const fromTemplate = rebuildList((template as { rebuild_on?: unknown } | undefined)?.rebuild_on);
  if (data.rebuild_on || rebuildPlaceholders(config).length || fromTemplate.length) count += 1;
  if (data.rebuild_on_watch !== 'default') count += 1;
  if (data.debug !== 'off') count += 1;
  if (data.name !== undefined) count += 1;
  if (data.inherit_variables) count += 1;
  return count;
}

const GRID_COLUMNS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'full'];
const GRID_ROWS = ['1', '2', '3', '4', '5', '6', '7', '8', 'auto'];

/** The form fields of the section, in the order the mockup shows them. Built per call so it speaks the viewer's language. */
export function advancedSchema(
  hass?: HomeAssistant,
  config?: DeclutteringCardConfig,
  template?: TemplateConfig,
): FormSchemaEntry[] {
  const text = (key: string): string => localize(key, undefined, hass);
  // What a card that says nothing gets: the template's word, when it has one (#411).
  const inherited = (template as { rebuild_on_watch?: unknown } | undefined)?.rebuild_on_watch;
  const watchOptions = [
    {
      value: 'default',
      label:
        inherited === undefined || inherited === null
          ? text('editor.advanced.rebuild_on_watch_default')
          : localize('editor.advanced.rebuild_on_watch_template', { value: watchText(inherited) }, hass),
    },
    { value: 'read', label: text('editor.advanced.rebuild_on_watch_read') },
    { value: 'all', label: text('editor.advanced.rebuild_on_watch_all') },
    ...(watchMode(config?.rebuild_on_watch) === 'custom'
      ? [
          {
            value: 'custom',
            label: localize(
              'editor.advanced.rebuild_on_watch_custom',
              { value: watchText(config?.rebuild_on_watch) },
              hass,
            ),
          },
        ]
      : []),
  ];
  const options = (values: string[], prefix: string): { value: string; label: string }[] =>
    values.map((value) => ({ value, label: /^\d+$/.test(value) ? value : text(`${prefix}${value}`) }));
  return [
    {
      name: 'grid_columns',
      label: text('editor.advanced.grid_columns_label'),
      helper: text('editor.advanced.grid_helper'),
      selector: {
        select: { mode: 'dropdown', custom_value: true, options: options(GRID_COLUMNS, 'editor.advanced.grid_') },
      },
    },
    {
      name: 'grid_rows',
      label: text('editor.advanced.grid_rows_label'),
      selector: {
        select: { mode: 'dropdown', custom_value: true, options: options(GRID_ROWS, 'editor.advanced.grid_') },
      },
    },
    {
      name: 'style',
      label: text('editor.advanced.style_label'),
      helper: text('editor.advanced.style_helper'),
      selector: { text: { multiline: true } },
    },
    {
      name: 'on_error_mode',
      label: text('editor.advanced.on_error_label'),
      helper: text('editor.advanced.on_error_helper'),
      selector: {
        select: {
          mode: 'dropdown',
          options: [
            { value: 'show', label: text('editor.advanced.on_error_show') },
            { value: 'hide', label: text('editor.advanced.on_error_hide') },
            { value: 'card', label: text('editor.advanced.on_error_card') },
          ],
        },
      },
    },
    {
      name: 'strict_errors',
      label: text('editor.advanced.strict_errors_label'),
      helper: text('editor.advanced.strict_errors_helper'),
      selector: {
        select: {
          mode: 'dropdown',
          options: ERROR_MODES.map((value) => ({ value, label: text(`editor.advanced.strict_errors_${value}`) })),
        },
      },
    },
    {
      name: 'strict_warnings',
      label: text('editor.advanced.strict_warnings_label'),
      helper: text('editor.advanced.strict_warnings_helper'),
      selector: {
        select: {
          mode: 'dropdown',
          options: WARNING_MODES.map((value) => ({ value, label: text(`editor.advanced.strict_warnings_${value}`) })),
        },
      },
    },
    {
      name: 'rebuild_on',
      label: text('editor.advanced.rebuild_on_label'),
      helper: text('editor.advanced.rebuild_on_helper'),
      selector: { entity: { multiple: true } },
    },
    {
      name: 'rebuild_on_watch',
      label: text('editor.advanced.rebuild_on_watch_label'),
      helper: text('editor.advanced.rebuild_on_watch_helper'),
      selector: { select: { mode: 'dropdown', options: watchOptions } },
    },
    {
      name: 'debug',
      label: text('editor.advanced.debug_label'),
      helper: text('editor.advanced.debug_helper'),
      selector: {
        select: {
          mode: 'dropdown',
          options: [
            { value: 'off', label: text('editor.advanced.debug_off') },
            { value: 'json', label: text('editor.advanced.debug_json') },
            { value: 'yaml', label: text('editor.advanced.debug_yaml') },
            { value: 'console', label: text('editor.advanced.debug_console') },
            { value: 'report', label: text('editor.advanced.debug_report') },
          ],
        },
      },
    },
    {
      name: 'name',
      label: text('editor.advanced.name_label'),
      helper: text('editor.advanced.name_helper'),
      selector: { text: {} },
    },
    {
      name: 'inherit_variables',
      label: text('editor.advanced.inherit_label'),
      helper: text('editor.advanced.inherit_helper'),
      selector: { boolean: {} },
    },
  ];
}
