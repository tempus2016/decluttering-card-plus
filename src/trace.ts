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

/** Where a nested card sits in the card that told it to log, and what that card and the ones above it are called. */
export const TRACE_PLACE_KEY = 'decluttering_trace_in';

export interface TracePlace {
  /** The cards around this one, outermost first, as their console entries name them. */
  parents: string[];
  /** Where this card sits inside the config of the card around it - `elements[3]`. */
  at: string;
}

/*
 * What a card is called in the console. Ten cards built from one template all log under
 * that template's name, so a card or its template can give it a `name:` of its own - with
 * placeholders, so a template can name each card after the camera it shows.
 */
export function traceLabel(template: string, name?: unknown): string {
  return typeof name === 'string' && name.trim() ? `"${name}" [${template}]` : `"${template}"`;
}

/** The outermost logging card a nested card reports what it built to, and where in it the nested card sits. */
export const TRACE_ROOT_KEY = 'decluttering_trace_root';

export type TracePath = (string | number)[];

export interface TraceRoot {
  id: string;
  path: TracePath;
}

/** Where a card was told it sits, if a card around it is logging. */
export function tracePlace(config: any): TracePlace | undefined {
  const place = config?.[TRACE_PLACE_KEY];
  return place && Array.isArray(place.parents) && typeof place.at === 'string' ? place : undefined;
}

/** Which outermost card a card reports to, if one is logging around it. */
export function traceRoot(config: any): TraceRoot | undefined {
  const root = config?.[TRACE_ROOT_KEY];
  return root && typeof root.id === 'string' && Array.isArray(root.path) ? root : undefined;
}

/*
 * Whether a card should log its build: it asked to, or a card around it did and it said
 * nothing itself. Any debug setting asks: `debug: true` and `debug: yaml` show what was
 * built on the card, and the log says how - and is still there if the view itself is not.
 */
export function wantsTrace(config: any): boolean {
  if (config?.debug === 'console' || config?.debug === true || config?.debug === 'yaml') return true;
  return config?.debug === undefined && config?.[TRACE_KEY] === true;
}

/*
 * Every card of ours inside this config told to log too, so that the nested templates the
 * question is usually about answer it without each one being edited. Like the chain of open
 * templates, a nested card's own content is built from its template, so the walk stops at it.
 */
export function withTrace<T>(config: T, parents: string[] = [], root?: TraceRoot): T {
  const holds = (node: any): boolean => {
    if (Array.isArray(node)) return node.some(holds);
    if (!node || typeof node !== 'object') return false;
    if (typeof node.type === 'string' && CONSUMER_TYPES.includes(node.type)) return true;
    return Object.values(node).some(holds);
  };
  if (!holds(config)) return config;

  const copy = JSON.parse(JSON.stringify(config));
  eachNestedCard(copy, (node, path) => {
    node[TRACE_KEY] = true;
    // Ten copies of one element template log alike; where each sits tells them apart.
    if (parents.length) node[TRACE_PLACE_KEY] = { parents, at: formatPath(path) };
    if (root) node[TRACE_ROOT_KEY] = { id: root.id, path: [...root.path, ...path] };
  });
  return copy;
}

// Every card of ours in a config, and where it sits. A nested card's own content is its template's, so the walk stops there.
function eachNestedCard(config: unknown, visit: (node: any, path: TracePath) => void): void {
  const walk = (node: any, path: TracePath): void => {
    if (Array.isArray(node)) {
      node.forEach((item, index) => walk(item, [...path, index]));
      return;
    }
    if (!node || typeof node !== 'object') return;
    if (typeof node.type === 'string' && CONSUMER_TYPES.includes(node.type)) {
      visit(node, path);
      return;
    }
    for (const [key, value] of Object.entries(node)) walk(value, [...path, key]);
  };
  walk(config, []);
}

/** Where each card of ours sits in a config. */
export function nestedCardPaths(config: unknown): TracePath[] {
  const paths: TracePath[] = [];
  eachNestedCard(config, (_node, path) => paths.push(path));
  return paths;
}

/** A path as the console shows it: `cards[0].elements[3]`. */
export function formatPath(path: TracePath): string {
  const text = path.map((step) => (typeof step === 'number' ? `[${step}]` : `.${step}`)).join('');
  return text.replace(/^\./, '') || '.';
}

/*
 * The whole of what a logging card ends up showing, nested cards built and all (#160). Its
 * own entry can only show a nested card as the decluttering card it is, because each one
 * builds after it, once Home Assistant creates it. So every nested card reports what it
 * built to the outermost one, which logs the whole thing once nothing is left to wait for -
 * or, when a nested card is never built (hidden, or not shown yet), once the reports stop.
 */
interface Expansion {
  label: string;
  config: any;
  waiting: Map<string, TracePath>;
  timer?: ReturnType<typeof setTimeout>;
  hass?: any;
}

const expansions = new Map<string, Expansion>();
const SETTLE_MS = 3000;
let expansionCount = 0;

/** A new id for an outermost card's build, so reports meant for an earlier build are not mixed in. */
export function newExpansionId(): string {
  expansionCount += 1;
  return `dcp-${Date.now()}-${expansionCount}`;
}

const pathKey = (path: TracePath): string => JSON.stringify(path);

function setAt(config: any, path: TracePath, value: unknown): any {
  if (!path.length) return value;
  let node = config;
  for (const step of path.slice(0, -1)) {
    if (!node || typeof node !== 'object') return config;
    node = node[step];
  }
  if (node && typeof node === 'object') node[path[path.length - 1]] = value;
  return config;
}

function settle(id: string): void {
  const expansion = expansions.get(id);
  if (!expansion) return;
  if (expansion.timer) clearTimeout(expansion.timer);
  if (!expansion.waiting.size) {
    finish(id);
    return;
  }
  expansion.timer = setTimeout(() => finish(id), SETTLE_MS);
}

function finish(id: string): void {
  const expansion = expansions.get(id);
  if (!expansion) return;
  expansions.delete(id);
  if (expansion.timer) clearTimeout(expansion.timer);
  const { hass } = expansion;
  console.groupCollapsed(localize('trace.in_full', { label: expansion.label }, hass));
  console.log(localize('trace.result', undefined, hass), expansion.config);
  if (expansion.waiting.size) {
    console.log(localize('trace.never_built', undefined, hass), [...expansion.waiting.values()].map(formatPath));
  }
  console.groupEnd();
}

/** The outermost logging card has built: wait for the cards inside it, if it has any. */
export function startExpansion(id: string, label: string, config: unknown, nested: TracePath[], hass?: any): void {
  if (!nested.length) return;
  expansions.set(id, {
    label,
    config: JSON.parse(JSON.stringify(config ?? null)),
    waiting: new Map(nested.map((path) => [pathKey(path), path])),
    hass,
  });
  settle(id);
}

/** A nested card has built: put what it built in its place, and wait for the cards inside it too. */
export function reportExpansion(root: TraceRoot, config: unknown, nested: TracePath[]): void {
  const expansion = expansions.get(root.id);
  const key = pathKey(root.path);
  if (!expansion || !expansion.waiting.has(key)) return;
  expansion.waiting.delete(key);
  expansion.config = setAt(expansion.config, root.path, JSON.parse(JSON.stringify(config ?? null)));
  for (const path of nested) {
    const full = [...root.path, ...path];
    expansion.waiting.set(pathKey(full), full);
  }
  settle(root.id);
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
  /** What the card is called: its template, and its name when it has one. */
  label: string;
  /** The cards open above this one, outermost first. */
  chain: string[];
  /** Where it sits in the card around it, when that card is logging too. */
  at?: string;
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
  const built = localize('trace.built', { label: report.label, ms: report.ms.toFixed(1) }, hass);
  if (!report.chain.length) return built;
  const chain = report.chain.join(' › ');
  return report.at
    ? `${built} ${localize('trace.inside_at', { chain, path: report.at }, hass)}`
    : `${built} ${localize('trace.inside', { chain }, hass)}`;
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
