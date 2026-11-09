/*
 * The debug report as a tree (idea 51): the same facts `debug: report` writes out as
 * Markdown, shaped for folding and searching on the card itself. Built from the structured
 * trace rather than by reading the Markdown back, so the two can never disagree about a
 * value - only about its layout.
 *
 * Pure: nothing here touches the DOM. element.ts draws the nodes with <details>.
 */
import { ExpansionResult, TraceReport, TraceSection, headline } from './trace';
import {
  ItemTables,
  allWarnings,
  checkWhere,
  failedChecks,
  oneBuild,
  redact,
  secretValues,
  sectionTables,
} from './report';
import { toYaml } from './yaml';
import { localize } from './localize';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ReportNode {
  /** Stable within one report, for keyed rendering. */
  id: string;
  /** A card's own section, a group of rows, one row, a table, or a block of YAML. */
  kind: 'card' | 'group' | 'leaf' | 'table' | 'code';
  title: string;
  /** Beside the title, lighter: a time, a count, where a value came from. */
  meta?: string;
  /** A code node's text. */
  text?: string;
  /** A table node's column headings and its rows, one string per cell. */
  columns?: string[];
  rows?: string[][];
  /** A warning row. */
  warn?: boolean;
  /** Drawn open the first time. */
  open?: boolean;
  children?: ReportNode[];
}

export interface TreeInput extends Pick<ExpansionResult, 'reports' | 'neverBuilt'> {
  /** The whole card with the cards inside it built, when it has any. */
  full?: unknown;
  /** What it built, when it has none. */
  built?: unknown;
  error?: string;
  /** `redact: false`: nothing is taken out. */
  unredacted?: boolean;
}

const asText = (value: unknown): string =>
  value === undefined
    ? ''
    : typeof value === 'string'
      ? value
      : typeof value === 'object' && value !== null
        ? JSON.stringify(value)
        : String(value);

/** Every section a card built, as nodes under one card node. */
/*
 * Rows as a table node, the same columns the Markdown report has (#412). Empty rows give a
 * node with no rows; the group around it says the count.
 */
function tableNode(id: string, rows: Record<string, unknown>[], hide: (text: string) => string): ReportNode {
  const columns = rows.length ? Object.keys(rows[0]) : [];
  return {
    id,
    kind: 'table',
    title: '',
    columns,
    rows: rows.map((row) => columns.map((column) => hide(asText(row[column])))),
  };
}

/** A group holding one table, or nothing when there are no rows. */
function tableGroup(
  id: string,
  title: string,
  rows: Record<string, unknown>[],
  hide: (text: string) => string,
): ReportNode {
  return {
    id,
    kind: 'group',
    title,
    meta: String(rows.length),
    children: rows.length ? [tableNode(`${id}-table`, rows, hide)] : [],
  };
}

/** Each item template a fill built, a group each, with its values and placeholders as tables (#235). */
function itemNodes(base: string, items: ItemTables[], hide: (text: string) => string, hass?: any): ReportNode[] {
  const t = (key: string): string => localize(key, undefined, hass).replace(/[,:]\s*$/, '');
  return items.map((item, i) => {
    const id = `${base}-i${i}`;
    return {
      id,
      kind: 'group' as const,
      title: hide(item.title),
      children: [
        tableGroup(`${id}-values`, t('trace.item_values'), item.values, hide),
        tableGroup(`${id}-placeholders`, plainTitle(t('trace.placeholders')), item.placeholders, hide),
        ...itemNodes(id, item.items, hide, hass),
      ],
    };
  });
}

const plainTitle = (text: string): string => text.replace(/[,:]\s*$/, '').replace(/, and what each became$/, '');

function cardNode(
  report: TraceReport,
  index: number,
  hide: (text: string) => string,
  redacting: boolean,
  hass?: any,
): ReportNode {
  const t = (key: string, params?: Record<string, unknown>): string => localize(key, params, hass);
  const children: ReportNode[] = [];
  if (report.template) {
    children.push({
      id: `r${index}-template`,
      kind: 'code',
      title: hide(t('report.template', { template: report.template.name })),
      text: hide(toYaml(report.template.config)),
    });
  }
  const allTables = sectionTables(report, redacting, hass);
  report.sections.forEach((section: TraceSection, sectionIndex) => {
    const base = `r${index}-s${sectionIndex}`;
    const own: ReportNode[] = [];
    const tables = allTables[sectionIndex];
    own.push(
      tableGroup(
        `${base}-variables`,
        t('trace.variables')
          .replace(/[,:]\s*$/, '')
          .replace(/, and where each came from$/, ''),
        tables.variables,
        hide,
      ),
    );
    own.push(tableGroup(`${base}-placeholders`, plainTitle(t('trace.placeholders')), tables.placeholders, hide));
    if (section.trace.dropped.length) {
      own.push({
        id: `${base}-dropped`,
        kind: 'group',
        title: t('trace.taken_out').replace(/:\s*$/, ''),
        meta: String(section.trace.dropped.length),
        children: section.trace.dropped.map((path, i) => ({
          id: `${base}-d${i}`,
          kind: 'leaf' as const,
          title: hide(path),
        })),
      });
    }
    own.push(...itemNodes(base, tables.items, hide, hass));
    if (section.trace.warnings.length) {
      own.push({
        id: `${base}-warnings`,
        kind: 'group',
        title: t('report.warnings').replace(/:\s*$/, ''),
        meta: String(section.trace.warnings.length),
        open: true,
        children: section.trace.warnings.map((warning, i) => ({
          id: `${base}-w${i}`,
          kind: 'leaf' as const,
          title: hide(warning),
          warn: true,
        })),
      });
    }
    own.push({
      id: `${base}-built`,
      kind: 'code',
      title: t('trace.result').replace(/:\s*$/, ''),
      text: hide(toYaml(section.built)),
    });
    if (section.label) {
      children.push({
        id: base,
        kind: 'group',
        title: hide(section.label),
        children: own,
        open: report.sections.length === 1,
      });
    } else {
      children.push(...own);
    }
  });
  const warnings = report.sections.reduce((sum, section) => sum + section.trace.warnings.length, 0);
  return {
    id: `r${index}`,
    kind: 'card',
    title: hide(headline(report, hass)),
    meta: warnings ? `${report.ms.toFixed(0)} ms · ${warnings} ⚠` : `${report.ms.toFixed(0)} ms`,
    open: index === 0,
    children,
  };
}

/** What the tree, and the outline above it, take out of any text they show: the report's own redaction. */
export function treeRedactor(reports: TraceReport[]): (text: string) => string {
  const secrets = secretValues(reports);
  return (text) => redact(text, secrets);
}

/** The whole report as nodes: the error, failed checks, warnings, the end result, what never built, then each card's build. */
export function reportTree(input: TreeInput, hass?: any): ReportNode[] {
  const t = (key: string, params?: Record<string, unknown>): string => localize(key, params, hass);
  const hide = treeRedactor(input.reports);
  const keep = (text: string): string => (input.unredacted ? text : hide(text));
  const nodes: ReportNode[] = [];
  if (input.error) nodes.push({ id: 'error', kind: 'leaf', title: keep(input.error), warn: true });
  /*
   * The checks that failed (#389), then every warning (#391), ahead of the builds and open,
   * in the order the Markdown report has them: inside a folded build nobody would see one.
   */
  const alerts = failedChecks(input.reports);
  if (alerts.length) {
    nodes.push({
      id: 'checks',
      kind: 'group',
      title: t('report.checks'),
      meta: String(alerts.length),
      open: true,
      children: alerts.map((alert, i) => ({
        id: `checks-${i}`,
        kind: 'leaf' as const,
        title: keep(`${alert.level}: ${alert.message}`),
        meta: keep(checkWhere(alert, hass)),
        warn: true,
      })),
    });
  }
  const warnings = allWarnings(input.reports);
  if (warnings.length) {
    const one = oneBuild(input.reports);
    nodes.push({
      id: 'warnings',
      kind: 'group',
      title: t('report.warnings').replace(/:\s*$/, ''),
      meta: String(warnings.length),
      open: true,
      children: warnings.map(({ where, warning }, i) => ({
        id: `warnings-${i}`,
        kind: 'leaf' as const,
        title: keep(warning),
        ...(one ? {} : { meta: keep(where) }),
        warn: true,
      })),
    });
  }
  const label = input.reports[0]?.label ?? '';
  if (input.full !== undefined) {
    nodes.push({
      id: 'full',
      kind: 'code',
      title: t('trace.in_full', { label }),
      text: keep(toYaml(input.full)),
      open: true,
    });
  } else if (input.built !== undefined) {
    nodes.push({
      id: 'built',
      kind: 'code',
      title: t('report.as_built', { label }),
      text: keep(toYaml(input.built)),
      open: true,
    });
  }
  if (input.neverBuilt.length) {
    nodes.push({
      id: 'never',
      kind: 'group',
      title: t('trace.never_built').replace(/:\s*$/, ''),
      meta: String(input.neverBuilt.length),
      children: input.neverBuilt.map((path, i) => ({ id: `never-${i}`, kind: 'leaf' as const, title: keep(path) })),
    });
  }
  input.reports.forEach((report, index) => nodes.push(cardNode(report, index, keep, !input.unredacted, hass)));
  return nodes;
}

// How many times `needle` (lower case) occurs in `text`, counted the way highlightParts cuts it.
const occurrences = (text: string | undefined, needle: string): number => {
  if (!text) return 0;
  const lower = text.toLowerCase();
  let count = 0;
  for (let at = lower.indexOf(needle); at !== -1; at = lower.indexOf(needle, at + needle.length)) count += 1;
  return count;
};

// The text the card draws for a node, so a hit is only counted where it is also marked: a
// table shows its cells and no title, every other kind its title and meta, a code block its text too.
const shownText = (node: ReportNode): (string | undefined)[] =>
  node.kind === 'table'
    ? [...(node.columns ?? []), ...([] as string[]).concat(...(node.rows ?? []))]
    : [node.title, node.meta, ...(node.kind === 'code' ? [node.text] : [])];

/** How many highlights `query` makes in one node as the card draws it. */
export function nodeHits(node: ReportNode, query: string): number {
  const needle = query.trim().toLowerCase();
  if (!needle) return 0;
  return shownText(node).reduce((sum, text) => sum + occurrences(text, needle), 0);
}

/**
 * The tree narrowed to what mentions `query`, ancestors kept and opened so every hit is in
 * view, and how many highlights that makes - every occurrence, so a table with three hits
 * counts three. An empty query gives the tree back as it was, with no count.
 */
export function searchTree(nodes: ReportNode[], query: string): { nodes: ReportNode[]; matches?: number } {
  const needle = query.trim().toLowerCase();
  if (!needle) return { nodes };
  let count = 0;
  const walk = (list: ReportNode[]): ReportNode[] => {
    const out: ReportNode[] = [];
    for (const node of list) {
      const children = node.children ? walk(node.children) : undefined;
      const hits = nodeHits(node, needle);
      count += hits;
      if (hits || (children && children.length)) out.push({ ...node, children, open: true });
    }
    return out;
  };
  const found = walk(nodes);
  return { nodes: found, matches: count };
}

/** `text` cut where `query` occurs, case-insensitively, so the pieces can be drawn with the hits marked. */
export function highlightParts(text: string, query: string): { text: string; hit: boolean }[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [{ text, hit: false }];
  const parts: { text: string; hit: boolean }[] = [];
  const lower = text.toLowerCase();
  let at = 0;
  for (let found = lower.indexOf(needle); found !== -1; found = lower.indexOf(needle, at)) {
    if (found > at) parts.push({ text: text.slice(at, found), hit: false });
    parts.push({ text: text.slice(found, found + needle.length), hit: true });
    at = found + needle.length;
  }
  if (at < text.length) parts.push({ text: text.slice(at), hit: false });
  return parts;
}

/* ---------------------------------------------------------------- GitHub issue */

export const ISSUE_REPO = 'tempus2016/decluttering-card-plus';

// Browsers and GitHub both accept addresses well past this; staying under it leaves room for
// the form's own additions and keeps the address pasteable.
export const ISSUE_URL_LIMIT = 7500;

/** The fields of .github/ISSUE_TEMPLATE/bug_report.yml, by id, that a report can fill in. */
export interface IssueFields {
  title?: string;
  card_version?: string;
  ha_version?: string;
  browser?: string;
  what_happened?: string;
  template_yaml?: string;
  card_yaml?: string;
  console?: string;
}

/** A new-issue address with the bug report form prefilled from `fields`. */
export function issueUrl(fields: IssueFields, repo = ISSUE_REPO): string {
  const params = new URLSearchParams({ template: 'bug_report.yml' });
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== '') params.set(key, value);
  }
  return `https://github.com/${repo}/issues/new?${params.toString()}`;
}

/**
 * The fields a report fills in, cut to what fits in an address: the report's own text goes
 * under "What happened?" when it fits, and when it does not the caller copies it to the
 * clipboard and the field says so. `fits` says which happened.
 */
export function issueFromReport(
  input: {
    version: string;
    haVersion?: string;
    browser?: string;
    templateName?: string;
    templateYaml?: string;
    cardYaml?: string;
    warnings: string[];
    report: string;
  },
  hass?: any,
): { url: string; fits: boolean } {
  const t = (key: string, params?: Record<string, unknown>): string => localize(key, params, hass);
  const base: IssueFields = {
    title: `[Bug]: ${input.templateName ?? 'decluttering-card-plus'}`,
    card_version: input.version,
    ha_version: input.haVersion,
    browser: input.browser,
    template_yaml: input.templateYaml,
    card_yaml: input.cardYaml,
    console: input.warnings.join('\n') || undefined,
  };
  const whole = issueUrl({ ...base, what_happened: `${t('report.issue_what')}\n\n${input.report}` });
  if (whole.length <= ISSUE_URL_LIMIT) return { url: whole, fits: true };
  // Too long: the report travels on the clipboard, and the fields that fit go in the address.
  const trimmed: IssueFields = { ...base, what_happened: t('report.issue_pasted') };
  let url = issueUrl(trimmed);
  for (const key of ['console', 'card_yaml', 'template_yaml'] as const) {
    if (url.length <= ISSUE_URL_LIMIT) break;
    delete trimmed[key];
    url = issueUrl(trimmed);
  }
  return { url, fits: false };
}
