import { TemplateConfig, VariablesConfig } from './types';
import { localize } from './localize';
import {
  getDeclarations,
  INHERIT_FLAG,
  INHERITED_KEY,
  OWN_DEFAULTS,
  outerLet,
  ownVariables,
  templateDefaults,
  VIEW_VALUES,
} from './variables';
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
  /** What substitution warned about in the console while building it. */
  warnings: string[];
  /** Each item template a `with:` or `repeat:` filled in, and what went on inside it (#235). */
  items?: ItemTrace[];
  /** For an item template's fill: its own values and the defaults it declares, as each ended up. */
  values?: Map<string, unknown>;
}

/*
 * One fill of an item template. Its placeholders are its own, read against its own values,
 * so they are kept apart from the card's: the card's table only says what the whole fill
 * became, which hid why a step inside it gave the answer it did (#235).
 */
export interface ItemTrace {
  /** What filled it in, as written in the card - `[[camera_entry|with:camera=front]]`. */
  placeholder: string;
  /** Which copy, for a `repeat:`. */
  copy?: { number: number; count: number };
  trace: BuildTrace;
}

export function newTrace(): BuildTrace {
  return { placeholders: new Map(), dropped: [], warnings: [] };
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
  if (config?.debug === 'console' || config?.debug === true || config?.debug === 'yaml' || config?.debug === 'report')
    return true;
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
 * A card that builds after that (one inside a camera card that is slow to start, #218) is
 * still put in its place, and the whole thing is logged and reported again with it.
 */
interface Expansion {
  label: string;
  config: any;
  waiting: Map<string, TracePath>;
  timer?: ReturnType<typeof setTimeout>;
  hass?: any;
  // Every build's own entry, the outermost card's first, for `debug: report` (#207).
  reports: TraceReport[];
  done?: (result: ExpansionResult) => void;
}

/** What an outermost card is told once the cards inside it have built, or stopped building. */
export interface ExpansionResult {
  reports: TraceReport[];
  /** The whole card with the cards inside it built; absent when it has none. */
  full?: unknown;
  neverBuilt: string[];
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
  // Kept while cards are still missing, so one that builds late still gets its place.
  if (!expansion.waiting.size) expansions.delete(id);
  if (expansion.timer) clearTimeout(expansion.timer);
  const { hass } = expansion;
  console.groupCollapsed(localize('trace.in_full', { label: expansion.label }, hass));
  console.log(localize('trace.result', undefined, hass), expansion.config);
  const neverBuilt = [...expansion.waiting.values()].map(formatPath);
  if (neverBuilt.length) console.log(localize('trace.never_built', undefined, hass), neverBuilt);
  console.groupEnd();
  expansion.done?.({ reports: expansion.reports, full: expansion.config, neverBuilt });
}

/** The outermost card has built again, or gone: what it was still waiting for no longer matters. */
export function endExpansion(id: string): void {
  const expansion = expansions.get(id);
  if (expansion?.timer) clearTimeout(expansion.timer);
  expansions.delete(id);
}

/** The outermost logging card has built: wait for the cards inside it, if it has any. */
export function startExpansion(
  id: string,
  label: string,
  config: unknown,
  nested: TracePath[],
  hass?: any,
  report?: TraceReport,
  done?: (result: ExpansionResult) => void,
): void {
  const reports = report ? [report] : [];
  if (!nested.length) {
    done?.({ reports, neverBuilt: [] });
    return;
  }
  expansions.set(id, {
    label,
    config: JSON.parse(JSON.stringify(config ?? null)),
    waiting: new Map(nested.map((path) => [pathKey(path), path])),
    hass,
    reports,
    done,
  });
  settle(id);
}

/** A nested card has built: put what it built in its place, and wait for the cards inside it too. */
export function reportExpansion(root: TraceRoot, config: unknown, nested: TracePath[], report?: TraceReport): void {
  const expansion = expansions.get(root.id);
  const key = pathKey(root.path);
  if (!expansion || !expansion.waiting.has(key)) return;
  expansion.waiting.delete(key);
  if (report) expansion.reports.push(report);
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
  for (const layer of outerLet(template)) add(ownVariables(layer.values), () => layer.from);
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
  add(ownVariables(templateDefaults(t)), (name) => (own && !own.has(name) ? 'dashboard' : 'default'));
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
  /** The template it was built from, as written, for `debug: report`. */
  template?: { name: string; config: unknown };
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

/** What an item template's fill is called in the console and the report. */
export function itemTitle(item: ItemTrace, hass?: any): string {
  const title = localize('trace.item', { placeholder: item.placeholder }, hass);
  return item.copy ? `${title} - ${localize('trace.copy', item.copy, hass)}` : title;
}

/** An item template's values as table rows, worked out apart from the logging so it can be tested. */
export function itemValueRows(trace: BuildTrace, hass?: any): Record<string, unknown>[] {
  const col = (key: string): string => localize(`trace.col_${key}`, undefined, hass);
  return [...(trace.values ?? [])].map(([variable, value]) => ({
    [col('variable')]: variable,
    [col('value')]: cell(value),
  }));
}

// Each fill inside a build, and the fills inside those, as collapsed groups of their own.
function logItems(items: ItemTrace[] | undefined, hass?: any): void {
  for (const item of items ?? []) {
    console.groupCollapsed(itemTitle(item, hass));
    const values = itemValueRows(item.trace, hass);
    console.log(localize('trace.item_values', undefined, hass));
    if (values.length) console.table(values);
    else console.log(localize('trace.none', undefined, hass));
    const placeholders = describeSection({ variables: [], trace: item.trace, built: undefined }, hass).placeholders;
    console.log(localize('trace.placeholders', undefined, hass));
    if (placeholders.length) console.table(placeholders);
    else console.log(localize('trace.none', undefined, hass));
    logItems(item.trace.items, hass);
    console.groupEnd();
  }
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
    logItems(section.trace.items, hass);
    console.log(localize('trace.result', undefined, hass), section.built);
    if (section.label) console.groupEnd();
  }
  console.groupEnd();
}

/*
 * Build timings for the health panel. `debug: console` says how long one card took when
 * somebody asks; this keeps a note of every card built on the page, always, so the slow
 * ones can be found without knowing where to look first. One performance.now() either side
 * of the build and a slot in a fixed-size list - cheap enough to leave on - and nothing is
 * kept past the page: it describes this session, not the dashboard.
 */
export interface BuildTiming {
  /** The template the card was built from. */
  template: string;
  /** The card's own `name:`, as written, when it has one. */
  name?: string;
  /** How many copies the build made: one, or the size of a repeat. */
  copies: number;
  ms: number;
}

/** How many builds are remembered before the oldest make way. */
export const TIMINGS_KEPT = 500;

/** A list that keeps the most recent `size` entries and drops the oldest, without ever growing. */
export class BuildLog {
  private _entries: BuildTiming[] = [];
  private _next = 0;

  constructor(private readonly size = TIMINGS_KEPT) {}

  add(entry: BuildTiming): void {
    if (this._entries.length < this.size) this._entries.push(entry);
    else this._entries[this._next] = entry;
    this._next = (this._next + 1) % this.size;
  }

  entries(): BuildTiming[] {
    return [...this._entries];
  }

  clear(): void {
    this._entries = [];
    this._next = 0;
  }
}

/** Every build on this page, for the health panel. */
export const BUILD_LOG = new BuildLog();

export interface TemplateTiming {
  template: string;
  total: number;
  max: number;
  builds: number;
}

export interface RepeatSize {
  template: string;
  name?: string;
  copies: number;
}

/**
 * What the health panel shows: the templates that took longest altogether and in a single
 * build - one heavy template used once and a light one used a hundred times are both worth
 * seeing, and they are different lists - and the biggest repeats, by copies.
 */
export function slowestBuilds(
  entries: BuildTiming[],
  top = 10,
): { byTotal: TemplateTiming[]; byMax: TemplateTiming[]; repeats: RepeatSize[] } {
  const byTemplate = new Map<string, TemplateTiming>();
  const repeats = new Map<string, RepeatSize>();
  for (const entry of entries) {
    const timing = byTemplate.get(entry.template) ?? { template: entry.template, total: 0, max: 0, builds: 0 };
    timing.total += entry.ms;
    timing.max = Math.max(timing.max, entry.ms);
    timing.builds += 1;
    byTemplate.set(entry.template, timing);
    // A repeat that built again is the same repeat; it is listed once, at its largest.
    if (entry.copies > 1) {
      const key = JSON.stringify([entry.template, entry.name ?? null]);
      const known = repeats.get(key);
      if (!known || known.copies < entry.copies) {
        repeats.set(key, {
          template: entry.template,
          ...(entry.name ? { name: entry.name } : {}),
          copies: entry.copies,
        });
      }
    }
  }
  const all = [...byTemplate.values()];
  return {
    byTotal: [...all].sort((a, b) => b.total - a.total).slice(0, top),
    byMax: [...all].sort((a, b) => b.max - a.max).slice(0, top),
    repeats: [...repeats.values()].sort((a, b) => b.copies - a.copies).slice(0, top),
  };
}
