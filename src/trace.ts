import { TemplateConfig, VariablesConfig } from './types';
import { localize } from './localize';
import { getDeclarations, INHERIT_FLAG, INHERITED_KEY, OWN_DEFAULTS, ownVariables, VIEW_VALUES } from './variables';
import { CONSUMER_TYPES } from './templates';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * `debug: console` (discussion #160). The card renders as normal and the console gets an
 * account of how it was built: which variables it had and where each came from, what every
 * placeholder turned into, which options an empty variable took out, and the config that
 * came out the other end. The debug view only ever shows that last part, and on a card made
 * of templates inside templates the question is usually about the middle.
 */

/** What substitution noticed while building one thing, filled in by deepReplace. */
export interface BuildTrace {
  /** Each placeholder, as written, and what it became - the first time it was met. */
  placeholders: Map<string, unknown>;
  /** Where an empty option took something out of the built config, and why. */
  dropped: string[];
}

export function newTrace(): BuildTrace {
  return { placeholders: new Map(), dropped: [] };
}

/** The key a card uses to tell the cards inside it to log as well. */
export const TRACE_KEY = 'decluttering_trace';

/** Whether a card should log its build: it asked to, or a card around it did and it said nothing itself. */
export function wantsTrace(config: any): boolean {
  if (config?.debug === 'console') return true;
  return config?.debug === undefined && config?.[TRACE_KEY] === true;
}

/*
 * Every card of ours inside this config told to log too, so that the nested templates the
 * question is usually about answer it without each one being edited. Like the chain of open
 * templates, a nested card's own content is built from its template, so the walk stops at it.
 */
export function withTrace<T>(config: T): T {
  const holds = (node: any): boolean => {
    if (Array.isArray(node)) return node.some(holds);
    if (!node || typeof node !== 'object') return false;
    if (typeof node.type === 'string' && CONSUMER_TYPES.includes(node.type)) return true;
    return Object.values(node).some(holds);
  };
  if (!holds(config)) return config;

  const copy = JSON.parse(JSON.stringify(config));
  const walk = (node: any): void => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (!node || typeof node !== 'object') return;
    if (typeof node.type === 'string' && CONSUMER_TYPES.includes(node.type)) {
      node[TRACE_KEY] = true;
      return;
    }
    Object.values(node).forEach(walk);
  };
  walk(copy);
  return copy;
}

/** The variables a card was handed by the card around it rather than given itself, read before they are merged in. */
export function handedDownNames(config: any): string[] {
  const inherited = config?.[INHERITED_KEY];
  if (config?.[INHERIT_FLAG] !== true || !Array.isArray(inherited)) return [];
  const own = new Set(ownVariables(config.variables).map((entry) => Object.keys(entry)[0]));
  return ownVariables(inherited)
    .map((entry) => Object.keys(entry)[0])
    .filter((name) => !own.has(name));
}

export interface VariableRow {
  variable: string;
  value: unknown;
  from: string;
}

/*
 * Every variable the build could read, with the value it was given and where that came from,
 * in the order that decides which wins - the same order resolveVariables uses, so a name
 * listed here shows the definition that was actually used.
 */
export function variableRows(
  variables: VariablesConfig[] | VariablesConfig | undefined,
  template: TemplateConfig | undefined,
  handedDown: string[] = [],
  repeated: string[] = [],
): VariableRow[] {
  const rows: VariableRow[] = [];
  const seen = new Set<string>();
  const add = (entries: VariablesConfig[], from: (name: string) => string): void => {
    for (const entry of entries) {
      const name = Object.keys(entry)[0];
      if (name === undefined || seen.has(name)) continue;
      seen.add(name);
      rows.push({ variable: name, value: entry[name], from: from(name) });
    }
  };
  const t = template as any;
  add(ownVariables(t?.let), () => 'let');
  add(ownVariables(variables), (name) =>
    handedDown.includes(name) ? 'handed_down' : repeated.includes(name) ? 'repeat' : 'card',
  );
  add(ownVariables(t?.[VIEW_VALUES]), () => 'view');
  add(
    getDeclarations(template)
      .filter((declaration) => 'default' in declaration)
      .map((declaration) => ({ [declaration.name]: declaration.default })),
    () => 'declared',
  );
  // A template copy carries the dashboard's shared values under its own `default:` list, and
  // remembers which were its own - anything else came from the dashboard.
  const own =
    t && OWN_DEFAULTS in t ? new Set(ownVariables(t[OWN_DEFAULTS]).map((entry) => Object.keys(entry)[0])) : undefined;
  add(ownVariables(t?.default), (name) => (own && !own.has(name) ? 'dashboard' : 'default'));
  return rows;
}

/** One build to report: a single card has one, a repeat has one per copy. */
export interface TraceSection {
  label?: string;
  variables: VariableRow[];
  trace: BuildTrace;
  built: unknown;
}

export interface TraceReport {
  template: string;
  /** The templates open above this card, outermost first. */
  chain: string[];
  ms: number;
  sections: TraceSection[];
}

// A table cell holds text: a mapping or a list goes in as its JSON, which is how it was written.
function cell(value: unknown): unknown {
  return value !== null && typeof value === 'object' ? JSON.stringify(value) : value;
}

/** What the console is given, worked out apart from the logging so it can be tested. */
export function describeSection(
  section: TraceSection,
  hass?: any,
): {
  variables: Record<string, unknown>[];
  placeholders: Record<string, unknown>[];
  dropped: string[];
} {
  const col = (key: string): string => localize(`trace.col_${key}`, undefined, hass);
  return {
    variables: section.variables.map((row) => ({
      [col('variable')]: row.variable,
      [col('value')]: cell(row.value),
      [col('from')]: localize(`trace.from_${row.from}`, undefined, hass),
    })),
    placeholders: [...section.trace.placeholders].map(([placeholder, became]) => ({
      [col('placeholder')]: placeholder,
      [col('became')]: cell(became),
    })),
    dropped: section.trace.dropped,
  };
}

export function headline(report: TraceReport, hass?: any): string {
  const built = localize('trace.built', { template: report.template, ms: report.ms.toFixed(1) }, hass);
  return report.chain.length
    ? `${built} ${localize('trace.inside', { chain: report.chain.join(' › ') }, hass)}`
    : built;
}

/*
 * Collapsed, so a dashboard full of logging cards is a list of one line each until somebody
 * opens the one they care about, and the built config is logged as an object rather than as
 * text so the console lets them unfold it.
 */
export function logTrace(report: TraceReport, hass?: any): void {
  console.groupCollapsed(headline(report, hass));
  for (const section of report.sections) {
    if (section.label) console.groupCollapsed(section.label);
    const described = describeSection(section, hass);
    console.log(localize('trace.variables', undefined, hass));
    if (described.variables.length) console.table(described.variables);
    else console.log(localize('trace.none', undefined, hass));
    console.log(localize('trace.placeholders', undefined, hass));
    if (described.placeholders.length) console.table(described.placeholders);
    else console.log(localize('trace.none', undefined, hass));
    if (described.dropped.length) console.log(localize('trace.taken_out', undefined, hass), described.dropped);
    console.log(localize('trace.result', undefined, hass), section.built);
    if (section.label) console.groupEnd();
  }
  console.groupEnd();
}
