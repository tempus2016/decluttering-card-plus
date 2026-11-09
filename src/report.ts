import { localize } from './localize';
import { BuildTrace, describeSection, headline, ItemTrace, itemTitle, itemValueRows, TraceReport } from './trace';
import { toYaml } from './yaml';
import { OutlineNode, outlineTags, reportOutline } from './report-outline';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * `debug: report` (#207). The console entries `debug: console` writes read well in the
 * developer tools and badly anywhere else: the tables and the unfoldable objects do not
 * survive a copy and paste into an issue. This is the same account as one Markdown text,
 * with the versions somebody helping will ask for first, so it can be pasted whole.
 */

/** What the report says about where it was made, ahead of the builds themselves. */
export interface ReportContext {
  version: string;
  haVersion?: string;
  dashboard?: string;
  language?: string;
  browser?: string;
}

export interface ReportInput {
  context: ReportContext;
  /** The card's own build first, then each card inside it as it built. */
  reports: TraceReport[];
  /** The whole card with the cards inside it built, when it has any. */
  full?: unknown;
  /** What the card built, when it has no cards inside it to build as well. */
  built?: unknown;
  /** `redact: false`: everything is left as the card has it. */
  unredacted?: boolean;
  /** Where cards inside it sit that never built. */
  neverBuilt?: string[];
  /** What the card refused with, if it did. */
  error?: string;
}

/*
 * Anything that says where somebody's house is or lets somebody in. Checked against what a
 * dashboard config actually holds - camera URLs, image links, the odd token pasted into a
 * card - not a promise: the report says to read it before posting, and means it. Order
 * matters: a password in a URL has to go before the address after it reads as an email.
 */

// A name is parts joined by `_` or `-`, and counts as a secret when one of its parts is one
// of these: `password`, `api_token`, `client_secret`, `x-api-key`. Not `tokens` or `secretary`.
const SECRET_WORDS =
  'token|secret|password|passwd|pwd|pass|pin|passcode|code|auth|authorization|credentials?|api[_-]?key|apikey|webhook[_-]?id|private[_-]?key|signature|lat|latitude|lon|lng|longitude|gps';
const SECRET_KEY = `(?:[a-z0-9]+[_-])*(?:${SECRET_WORDS})(?:[_-][a-z0-9]+)*`;
export const SECRET_NAME = new RegExp(`^${SECRET_KEY}$`, 'i');
// More count in a query string: `?key=` and `?sig=` mean plenty of other things as config keys.
const URL_KEYS = `${SECRET_KEY}|sig|key`;
// Paths that carry a token as a segment: a Home Assistant or Discord webhook, a Telegram bot,
// a Slack incoming webhook. The segment after is the secret, whatever the host was.
const TOKEN_PATHS = /(\/api\/webhooks?\/(?:\d+\/)?|\/bot\d+:|\/services\/)[A-Za-z0-9_~./-]+/g;
// A scheme is short and starts a word; bounding it keeps one long word from being scanned once per letter.
const SCHEME = '(?<![\\w.+-])[a-z][a-z0-9+.-]{0,31}://';
// `//host` on its own, where it is not the tail of `://` or a doubled slash in a path.
const BARE_SLASHES = '(?<![:\\w/>])//';
// Hosts that are somebody's, with nothing in front of them: `host: nas.local`. A `.home` only
// counts with a port, because `zone.home` is an entity.
const HOME_DOMAINS = 'duckdns\\.org|tplinkdns\\.com|nabu\\.casa|local|lan';

/*
 * A secret written as a YAML block scalar is the indicator line and every line indented
 * further than its key; a `- ` in front of the key counts towards the indent.
 */
function blankBlock(_: string, indent: string, dash: string | undefined, key: string, rest: string): string {
  const width = indent.length + (dash ?? '').length;
  const lines = rest.split('\n').slice(1);
  let inside = 0;
  while (inside < lines.length && (!lines[inside].trim() || /^[ \t]*/.exec(lines[inside])![0].length > width)) inside++;
  while (inside > 0 && !lines[inside - 1].trim()) inside--;
  return `${indent}${dash ?? ''}${key} <redacted>${lines
    .slice(inside)
    .map((line) => `\n${line}`)
    .join('')}`;
}

const REDACTIONS: [RegExp, string | ((...groups: any[]) => string)][] = [
  [new RegExp(`(${SCHEME}|${BARE_SLASHES})[^\\s@"'\\\\<>|]{1,256}@`, 'gi'), '$1<redacted-credentials>@'],
  [new RegExp(`([?&;](?:${URL_KEYS})=)[^&\\s"'\\\\|]+`, 'gi'), '$1<redacted>'],
  [new RegExp(`("${SECRET_KEY}"\\s*:\\s*)(?:"(?:[^"\\\\]|\\\\.)*"|[^,}\\]\\s]+)`, 'gi'), '$1"<redacted>"'],
  [
    new RegExp(
      `^([ \\t]*)(-[ \\t]+)?((?:${SECRET_KEY}):)[ \\t]*[|>][-+0-9]*[ \\t]*$((?:\\n[ \\t]+.*|\\n[ \\t]*(?=\\n))*)`,
      'gim',
    ),
    blankBlock,
  ],
  [new RegExp(`^([ \\t]*(?:-[ \\t]+)?(?:${SECRET_KEY}):[ \\t]+)\\S.*$`, 'gim'), '$1<redacted>'],
  [/\b(Bearer\s+)[A-Za-z0-9._~+/=-]+/g, '$1<redacted>'],
  [/\b(Basic\s+)[A-Za-z0-9+/=_-]{8,}/g, '$1<redacted>'],
  // `password=x` or `token = x` inside a longer line, where the key is not the line's own.
  [new RegExp(`(?<![\\w"'-])((?:${SECRET_KEY})\\s*[=]\\s*)[^\\s,;&"'|]+`, 'gi'), '$1<redacted>'],
  [TOKEN_PATHS, '$1<redacted>'],
  [/(?<![\w:])(?:[0-9a-f]{2}[:-]){5}[0-9a-f]{2}(?![\w:])/gi, '<redacted-mac>'],
  [/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '<redacted-token>'],
  // Tokens that announce themselves: GitHub, OpenAI-style `sk-`, Slack.
  [
    /\b(?:gh[opsur]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{16,}|xox[abprs]-[A-Za-z0-9-]{10,})/g,
    '<redacted-token>',
  ],
  [/[A-Za-z0-9._%+-]{1,256}@[A-Za-z0-9.-]{1,256}\.[A-Za-z]{2,}/g, '<redacted-email>'],
  // Not after `Chrome/`: a four-part version reads exactly like an address.
  [
    /(?<![\w.])(?<![A-Za-z]\/)(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}(?![\w.])/g,
    '<redacted-ip>',
  ],
  [/(?<![\w:])(?:[0-9a-f]{1,4}:){7}[0-9a-f]{1,4}(?![\w:])/gi, '<redacted-ip>'],
  [/(?<![\w:])(?:[0-9a-f]{1,4}:){1,6}(?::[0-9a-f]{1,4}){1,6}(?![\w:])/gi, '<redacted-ip>'],
  // Any scheme but `media-source://`, whose host is always `media_source`.
  [
    new RegExp(
      `(${SCHEME}(?<!media-source://)(?:<redacted-credentials>@)?|${BARE_SLASHES}(?:<redacted-credentials>@)?)[^\\s/:"'\\\\<>|?#]+`,
      'gi',
    ),
    '$1<redacted-host>',
  ],
  [
    new RegExp(`(?<![\\w.-])(?:[a-z0-9-]+\\.)+(?:(?:${HOME_DOMAINS})(?![\\w.-])|home(?=:\\d))`, 'gi'),
    '<redacted-host>',
  ],
];

/*
 * One word longer than this is cut to its two ends before anything looks at it. Nothing
 * anybody wants to read is that long, and the rules above would otherwise take time
 * proportional to its square on it.
 */
const LONGEST_RUN = 4096;
const LONG_RUN = new RegExp(`\\S{${LONGEST_RUN + 1},}`, 'g');

/**
 * The text with addresses, hosts and anything that looks like a password or token replaced,
 * and each of `secrets` - values known to be one, wherever they turn up - along with them.
 */
export function redact(text: string, secrets: readonly string[] = []): string {
  const half = LONGEST_RUN / 2;
  // The known secrets first, so a long one is taken out whole rather than cut to its ends
  // with the middle gone and each end still readable (review 2026-10-25).
  let out = text;
  for (const secret of secrets) out = out.split(secret).join('<redacted>');
  out = out.replace(LONG_RUN, (run) => `${run.slice(0, half)} … ${run.slice(-half)}`);
  return REDACTIONS.reduce((done, [pattern, replacement]) => done.replace(pattern, replacement as string), out);
}

/*
 * A value shorter than this is not hunted down by value, only blanked where its name gives
 * it away: a password of `on` or `123` is not much of a secret, and taking every `on` out of
 * the report would leave nothing to read.
 */
const SHORTEST_SECRET = 4;

/*
 * The values of every variable named like a secret, however it got its value - the card, a
 * `let:`, a declared or listed default - and of every secret-named key inside a variable's
 * mapping. A transform's copy of one is in the placeholders. Longest first, so a secret that
 * contains another is taken out whole.
 */
/** Every value held under a secret-looking name, longest first, for redacting wherever it recurs. */
export function secretValues(reports: TraceReport[]): string[] {
  const found = new Set<string>();
  const add = (value: unknown, secret: boolean): void => {
    if (value !== null && typeof value === 'object') {
      for (const [key, inner] of Object.entries(value)) add(inner, secret || SECRET_NAME.test(key));
    } else if (secret && value !== undefined && value !== null) {
      const text = String(value);
      for (const piece of [text, ...text.split(/\r?\n/)]) {
        if (piece.trim().length >= SHORTEST_SECRET) found.add(piece.trim());
      }
    }
  };
  // An item template's fill has values and placeholders of its own, and fills of its own (#235).
  const addTrace = (trace: BuildTrace): void => {
    for (const [placeholder, became] of trace.placeholders) add(became, SECRET_NAME.test(placeholderName(placeholder)));
    for (const [name, value] of trace.values ?? []) add(value, SECRET_NAME.test(name));
    for (const item of trace.items ?? []) addTrace(item.trace);
  };
  for (const report of reports) {
    for (const section of report.sections) {
      for (const row of section.variables) {
        add(row.value, SECRET_NAME.test(row.variable));
        add(row.worked?.value, SECRET_NAME.test(row.variable));
        for (const [placeholder, became] of row.worked?.steps ?? []) {
          add(became, SECRET_NAME.test(placeholderName(placeholder)));
        }
      }
      addTrace(section.trace);
    }
  }
  return [...found].sort((a, b) => b.length - a.length);
}

// `[[password?|upper]]` is a placeholder for the variable `password`.
function placeholderName(placeholder: string): string {
  return placeholder
    .replace(/^\[\[|\]\]$/g, '')
    .split('|')[0]
    .trim()
    .replace(/\?$/, '');
}

function asText(value: unknown): string {
  return value !== null && typeof value === 'object' ? JSON.stringify(value) : String(value);
}

// What redact() puts in. escapeInline() puts these in a code span: as bare text GitHub would
// read <redacted-ip> as an unknown HTML tag and drop it, so nobody could see something was taken out.
const MARKERS = /(<redacted(?:-(?:credentials|ip|host|email|token|mac))?>)/;

/*
 * One line of Markdown that reads as the text it was given. A newline would end a heading,
 * a list item or a table row, a pipe would start the next cell, and brackets, emphasis and
 * HTML tags would format or hide what somebody wrote into a variable.
 */
function escapeInline(text: string): string {
  return text
    .replace(/\r?\n|\r/g, ' ')
    .split(MARKERS)
    .map((part, index) =>
      index % 2
        ? `\`${part}\``
        : part
            // `@` would notify whoever a variable happens to name; `www.` would link.
            .replace(/[\\`*_[\]<>|!#@]/g, '\\$&')
            .replace(/\b(www)\./gi, '$1\\.'),
    )
    .join('');
}

function table(rows: Record<string, unknown>[], line: (value: unknown) => string): string[] {
  const columns = Object.keys(rows[0]);
  return [
    `| ${columns.join(' | ')} |`,
    `| ${columns.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${columns.map((column) => line(row[column])).join(' | ')} |`),
  ];
}

// Fenced with more backticks than the text holds, so a config with a code block in it cannot end the fence.
function fenced(text: string, language = 'yaml'): string[] {
  const longest = Math.max(2, ...(text.match(/`+/g) ?? []).map((run: string) => run.length));
  const fence = '`'.repeat(longest + 1);
  return [`${fence}${language}`, text.replace(/\n$/, ''), fence];
}

/*
 * Everything the report writes out goes through one of these: `line` for a heading, a list
 * item or a table cell, `block` for a fenced config, `title` for the line a folded section
 * shows. All redact first and shape after, so the rules see the text as it was written
 * rather than with Markdown escapes in it.
 */
interface Writer {
  line: (value: unknown) => string;
  block: (value: unknown, language?: string) => string[];
  title: (value: unknown) => string;
  redacting: boolean;
}

function writer(secrets: readonly string[], redacting: boolean): Writer {
  const clean = (text: string): string => (redacting ? redact(text, secrets) : text);
  return {
    line: (value) => escapeInline(clean(asText(value))),
    block: (value, language) => fenced(clean(typeof value === 'string' ? value : toYaml(value)), language),
    // A summary is HTML, where Markdown escapes would show as backslashes.
    title: (value) =>
      clean(asText(value))
        .replace(/\r?\n|\r/g, ' ')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;'),
    redacting,
  };
}

/*
 * A section folded away under its title, so somebody reading can skip to the part they want.
 * GitHub only reads the Markdown inside as Markdown with a blank line after the summary.
 */
function folded(title: string, body: string[], open = false): string[] {
  const end = body[body.length - 1] === '' ? [] : [''];
  return [
    `<details${open ? ' open' : ''}>`,
    `<summary><b>${title}</b></summary>`,
    '',
    ...body,
    ...end,
    '</details>',
    '',
  ];
}

/** One item template a `with:` or `repeat:` filled in, as the report's tables show it (#235). */
export interface ItemTables {
  title: string;
  values: Record<string, unknown>[];
  placeholders: Record<string, unknown>[];
  items: ItemTables[];
}

/** One section of a build, as the report's tables show it. */
export interface SectionTables {
  label?: string;
  variables: Record<string, unknown>[];
  placeholders: Record<string, unknown>[];
  dropped: string[];
  items: ItemTables[];
  built: unknown;
}

/*
 * The rows of every table a build's report shows, with the secret-named values taken out
 * when redacting. The Markdown report and the tree view both draw from this, so a column one
 * of them has the other has too (#412).
 */
export function sectionTables(report: TraceReport, redacting: boolean, hass?: any): SectionTables[] {
  const hidden = (name: string, value: unknown): unknown =>
    redacting && SECRET_NAME.test(name) ? '<redacted>' : value;
  const placeholdersOf = (trace: BuildTrace): Map<string, unknown> =>
    new Map(
      [...trace.placeholders].map(([placeholder, became]) => [
        placeholder,
        hidden(placeholderName(placeholder), became),
      ]),
    );
  /*
   * Each item template a `with:` or `repeat:` filled in, and each fill inside another: its
   * values as they ended up - so an `exists` or an `if:` that gave the wrong answer shows what
   * it was asked about - and its own placeholders (#235).
   */
  const items = (list: ItemTrace[] | undefined): ItemTables[] =>
    (list ?? []).map((item) => {
      const values = new Map([...(item.trace.values ?? [])].map(([name, value]) => [name, hidden(name, value)]));
      const described = describeSection(
        { variables: [], trace: { ...item.trace, placeholders: placeholdersOf(item.trace) }, built: undefined },
        hass,
      );
      return {
        title: itemTitle(item, hass),
        values: itemValueRows({ ...item.trace, values }, hass),
        placeholders: described.placeholders,
        items: items(item.trace.items),
      };
    });
  return report.sections.map((section) => {
    // A variable called `password` is the likeliest place for one, and its value sits in a
    // table cell of its own - as does what each of its placeholders became.
    // What one worked out to says the secret again, and so does a step through one (#376).
    const variables = section.variables.map((row) => {
      if (!redacting) return row;
      if (SECRET_NAME.test(row.variable)) {
        return { ...row, value: '<redacted>', ...(row.worked ? { worked: { value: '<redacted>', steps: [] } } : {}) };
      }
      if (!row.worked) return row;
      const steps = row.worked.steps.map(([placeholder, became]): [string, string] => [
        placeholder,
        SECRET_NAME.test(placeholderName(placeholder)) ? '<redacted>' : became,
      ]);
      return { ...row, worked: { ...row.worked, steps } };
    });
    const placeholders = placeholdersOf(section.trace);
    const described = describeSection({ ...section, variables, trace: { ...section.trace, placeholders } }, hass);
    return {
      label: section.label,
      variables: described.variables,
      placeholders: described.placeholders,
      dropped: described.dropped,
      items: items(section.trace.items),
      built: section.built,
    };
  });
}

/*
 * Where the outline's links land (#428). Home Assistant's Markdown takes an `id` out and leaves
 * a `title`, so the card finds the anchor by its title; GitHub keeps both, and its links go by the id.
 */
export const anchorId = (id: string): string => `dcp-${id}`;
const anchor = (id: string): string[] => [`<a id="${anchorId(id)}" title="${anchorId(id)}"></a>`, ''];

/*
 * The outline as a nested list, each line a link to its part of the report. A repeat whose
 * copies have nothing under them lists the copies on its own line, so ten copies are one line.
 */
function outlineSection(nodes: OutlineNode[], { line }: Writer, hass?: any): string[] {
  const out: string[] = [];
  const link = (text: string, node: OutlineNode): string =>
    node.target ? `[${text}](#${anchorId(node.target)})` : text;
  const walk = (list: OutlineNode[], depth: number): void => {
    for (const node of list) {
      const name = line(node.copy ? `${node.name} ${node.copy}` : node.name);
      const tags = outlineTags(node, hass).map((tag) => line(tag));
      let text = `${'  '.repeat(depth)}- ${node.skipped && !node.target ? `~~${name}~~` : link(name, node)}`;
      if (tags.length) text += ` · ${tags.join(' · ')}`;
      if (node.skipped) text += ` · *${line(node.skipped)}*`;
      const flat = node.copies !== undefined && node.children.every((child) => child.copy && !child.children.length);
      if (flat) {
        // A copy with a name of its own says it; the rest say which copy they are.
        const copy = (child: OutlineNode): string =>
          link(line(child.name === node.name ? child.copy : `${child.name} ${child.copy}`), child) +
          (child.skipped ? ` (${line(child.skipped)})` : '');
        text += `: ${node.children.map(copy).join(', ')}`;
      }
      out.push(text);
      if (!flat) walk(node.children, depth + 1);
    }
  };
  walk(nodes, 0);
  return out;
}

function buildSection(
  report: TraceReport,
  index: number,
  { line, block, title, redacting }: Writer,
  hass?: any,
): string[] {
  const t = (key: string, params?: Record<string, unknown>): string => localize(key, params, hass);
  const lines: string[] = [];
  const items = (list: ItemTables[], level: number, base: string): void => {
    for (const [i, item] of list.entries()) {
      lines.push(...anchor(`${base}-i${i}`));
      lines.push(`${'#'.repeat(Math.min(level, 6))} ${line(item.title)}`, '');
      lines.push(`**${t('trace.item_values')}**`, '');
      lines.push(...(item.values.length ? table(item.values, line) : [t('trace.none')]), '');
      lines.push(`**${t('trace.placeholders')}**`, '');
      lines.push(...(item.placeholders.length ? table(item.placeholders, line) : [t('trace.none')]), '');
      items(item.items, level + 1, `${base}-i${i}`);
    }
  };
  if (report.template) {
    lines.push(`### ${line(t('report.template', { template: report.template.name }))}`, '');
    lines.push(...block(report.template.config), '');
  }
  for (const [s, section] of sectionTables(report, redacting, hass).entries()) {
    if (section.label) lines.push(...anchor(`r${index}-s${s}`), `### ${line(section.label)}`, '');
    lines.push(`**${t('trace.variables')}**`, '');
    lines.push(...(section.variables.length ? table(section.variables, line) : [t('trace.none')]), '');
    lines.push(`**${t('trace.placeholders')}**`, '');
    lines.push(...(section.placeholders.length ? table(section.placeholders, line) : [t('trace.none')]), '');
    if (section.dropped.length) {
      lines.push(`**${t('trace.taken_out')}**`, '', ...section.dropped.map((path) => `- ${line(path)}`), '');
    }
    items(section.items, 4, `r${index}-s${s}`);
    lines.push(`**${t('trace.result')}**`, '', ...block(section.built), '');
  }
  return [...anchor(`r${index}`), ...folded(title(headline(report, hass)), lines)];
}

/*
 * Every warning any build in the report gave, in the order they came, each with the build it
 * came from (#391). They used to sit inside each build's folded section, which is the last
 * place somebody looks; up front, before anything is unfolded, nobody can miss one. A report
 * with one build and one section has nowhere else they could have come from, so it does not
 * say. A fill's warnings go with the build it is part of.
 */
export function allWarnings(reports: TraceReport[]): { where: string; warning: string }[] {
  const found: { where: string; warning: string }[] = [];
  const seen = new Set<string>();
  const add = (where: string, trace: BuildTrace): void => {
    for (const warning of trace.warnings) {
      const key = `${where}\n${warning}`;
      if (seen.has(key)) continue;
      seen.add(key);
      found.push({ where, warning });
    }
    for (const item of trace.items ?? []) add(where, item.trace);
  };
  for (const report of reports) {
    for (const section of report.sections) {
      add(section.label ? `${report.label} › ${section.label}` : report.label, section.trace);
    }
  }
  return found;
}

/*
 * The checks that failed (#389), from this card and every card inside it, each with the build
 * it came from. An `info` check is said in the console and nowhere else (see checks.ts), so it
 * is not one of them.
 */
export function failedChecks(
  reports: TraceReport[],
): { level: string; message: string; name?: string; label: string }[] {
  const alerts: { level: string; message: string; name?: string; label: string }[] = [];
  for (const report of reports) {
    for (const alert of report.alerts ?? []) {
      if (alert.level !== 'info') alerts.push({ ...alert, label: report.label });
    }
  }
  return alerts;
}

/** Where a failed check came from, in words. */
export function checkWhere(alert: { name?: string; label: string }, hass?: any): string {
  return alert.name
    ? localize('report.check_named', { name: alert.name, label: alert.label }, hass)
    : localize('report.check_in', { label: alert.label }, hass);
}

/** Whether a report has one build with one section, so its warnings need not say where they came from. */
export function oneBuild(reports: TraceReport[]): boolean {
  return reports.length === 1 && reports[0].sections.length === 1;
}

/** The whole report as Markdown, redacted unless asked not to be. */
export function formatReport(input: ReportInput, hass?: any): string {
  const t = (key: string, params?: Record<string, unknown>): string => localize(key, params, hass);
  const { context } = input;
  const facts: [string, string | undefined][] = [
    ['Decluttering Card Plus', context.version],
    ['Home Assistant', context.haVersion],
    [t('report.dashboard'), context.dashboard],
    [t('report.language'), context.language],
    [t('report.browser'), context.browser],
  ];
  // The header is the card's own doing and holds nothing private; a browser's version would read as an address.
  const header = [
    `# ${t('report.title')}`,
    '',
    `> ${t(input.unredacted ? 'report.unredacted' : 'report.check')}`,
    '',
    `| | |`,
    `| --- | --- |`,
    ...facts.filter(([, value]) => value).map(([name, value]) => `| ${name} | ${escapeInline(asText(value))} |`),
    '',
  ];

  const write = writer(input.unredacted ? [] : secretValues(input.reports), !input.unredacted);
  const { line, block, title } = write;
  const label = input.reports[0]?.label ?? '';
  const body: string[] = [];
  // What built what, each line a link to its part (#428): only worth it when there is more than the one card.
  const outline = reportOutline(input.reports, hass);
  if (outline.length && outline[0].children.length) {
    body.push(...folded(title(t('report.outline')), outlineSection(outline, write, hass), true));
  }
  if (input.error) body.push(`## ${t('report.error')}`, '', ...block(input.error, ''), '');
  /*
   * The checks that failed (#389), from this card and every card inside it, ahead of the
   * builds: they are the template's own word on what is wrong, and the first thing to read.
   */
  const alerts = failedChecks(input.reports);
  if (alerts.length) {
    body.push(
      `## ${t('report.checks')}`,
      '',
      ...alerts.map((alert) => `- **${line(alert.level)}** ${line(alert.message)} (${line(checkWhere(alert, hass))})`),
      '',
    );
  }
  const warnings = allWarnings(input.reports);
  if (warnings.length) {
    const one = oneBuild(input.reports);
    body.push(
      `## ${t('report.warnings')}`,
      '',
      ...warnings.map(({ where, warning }) => `- ${one ? '' : `${line(where)}: `}${line(warning)}`),
      '',
    );
  }
  // What the card ended up as comes first: it is what somebody looks at to see what went wrong.
  if (input.full !== undefined) {
    body.push(...folded(title(t('trace.in_full', { label })), block(input.full), true));
  } else if (input.built !== undefined) {
    body.push(...folded(title(t('report.as_built', { label })), block(input.built), true));
  }
  if (input.neverBuilt?.length) {
    body.push(`**${t('trace.never_built')}**`, '', ...input.neverBuilt.map((path) => `- ${line(path)}`), '');
  }
  input.reports.forEach((report, index) => body.push(...buildSection(report, index, write, hass)));
  return `${header.join('\n')}\n${body.join('\n')}`;
}
