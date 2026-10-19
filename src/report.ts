import { localize } from './localize';
import { describeSection, headline, TraceReport } from './trace';
import { toYaml } from './yaml';

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
const SECRET_WORDS = 'token|secret|password|passwd|pwd|api[_-]?key|apikey|webhook[_-]?id|private[_-]?key|signature';
const SECRET_KEY = `(?:[a-z0-9]+[_-])*(?:${SECRET_WORDS})(?:[_-][a-z0-9]+)*`;
const SECRET_NAME = new RegExp(`^${SECRET_KEY}$`, 'i');
// More count in a query string: `?key=` and `?auth=` mean plenty of other things as config keys.
const URL_KEYS = `${SECRET_KEY}|auth|sig|key`;
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
  let out = text.replace(LONG_RUN, (run) => `${run.slice(0, half)} … ${run.slice(-half)}`);
  for (const secret of secrets) out = out.split(secret).join('<redacted>');
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
function secretValues(reports: TraceReport[]): string[] {
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
  for (const report of reports) {
    for (const section of report.sections) {
      for (const row of section.variables) add(row.value, SECRET_NAME.test(row.variable));
      for (const [placeholder, became] of section.trace.placeholders)
        add(became, SECRET_NAME.test(placeholderName(placeholder)));
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
const MARKERS = /(<redacted(?:-(?:credentials|ip|host|email|token))?>)/;

/*
 * One line of Markdown that reads as the text it was given. A newline would end a heading,
 * a list item or a table row, a pipe would start the next cell, and brackets, emphasis and
 * HTML tags would format or hide what somebody wrote into a variable.
 */
function escapeInline(text: string): string {
  return text
    .replace(/\r?\n|\r/g, ' ')
    .split(MARKERS)
    .map((part, index) => (index % 2 ? `\`${part}\`` : part.replace(/[\\`*_[\]<>|!#]/g, '\\$&')))
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

function buildSection(report: TraceReport, { line, block, title, redacting }: Writer, hass?: any): string[] {
  const t = (key: string, params?: Record<string, unknown>): string => localize(key, params, hass);
  const lines: string[] = [];
  if (report.template) {
    lines.push(`### ${line(t('report.template', { template: report.template.name }))}`, '');
    lines.push(...block(report.template.config), '');
  }
  for (const section of report.sections) {
    if (section.label) lines.push(`### ${line(section.label)}`, '');
    // A variable called `password` is the likeliest place for one, and its value sits in a
    // table cell of its own - as does what each of its placeholders became.
    const variables = section.variables.map((row) =>
      redacting && SECRET_NAME.test(row.variable) ? { ...row, value: '<redacted>' } : row,
    );
    const placeholders = new Map(
      [...section.trace.placeholders].map(([placeholder, became]) => [
        placeholder,
        redacting && SECRET_NAME.test(placeholderName(placeholder)) ? '<redacted>' : became,
      ]),
    );
    const described = describeSection({ ...section, variables, trace: { ...section.trace, placeholders } }, hass);
    lines.push(`**${t('trace.variables')}**`, '');
    lines.push(...(described.variables.length ? table(described.variables, line) : [t('trace.none')]), '');
    lines.push(`**${t('trace.placeholders')}**`, '');
    lines.push(...(described.placeholders.length ? table(described.placeholders, line) : [t('trace.none')]), '');
    if (described.dropped.length) {
      lines.push(`**${t('trace.taken_out')}**`, '', ...described.dropped.map((path) => `- ${line(path)}`), '');
    }
    if (section.trace.warnings.length) {
      lines.push(
        `**${t('report.warnings')}**`,
        '',
        ...section.trace.warnings.map((warning: string) => `- ${line(warning)}`),
        '',
      );
    }
    lines.push(`**${t('trace.result')}**`, '', ...block(section.built), '');
  }
  return folded(title(headline(report, hass)), lines);
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
  if (input.error) body.push(`## ${t('report.error')}`, '', ...block(input.error, ''), '');
  // What the card ended up as comes first: it is what somebody looks at to see what went wrong.
  if (input.full !== undefined) {
    body.push(...folded(title(t('trace.in_full', { label })), block(input.full), true));
  } else if (input.built !== undefined) {
    body.push(...folded(title(t('report.as_built', { label })), block(input.built), true));
  }
  if (input.neverBuilt?.length) {
    body.push(`**${t('trace.never_built')}**`, '', ...input.neverBuilt.map((path) => `- ${line(path)}`), '');
  }
  for (const report of input.reports) body.push(...buildSection(report, write, hass));
  return `${header.join('\n')}\n${body.join('\n')}`;
}
