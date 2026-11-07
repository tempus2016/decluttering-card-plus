/*
 * The lint module and the health checks, run against a dashboard read from a file rather
 * than from Home Assistant (idea 57). Everything here is pure: text or a parsed dashboard
 * in, findings out. bin/dcp-lint.js is the file reader and printer around it.
 *
 * There is no hass, so messages are English from the bundled locale, and nothing here can
 * know which entities, areas or labels exist. It checks what the files alone can tell:
 * placeholders, declarations, template names, unused templates, extends: loops and
 * deprecated templates still in use.
 */
import { CORE_SCHEMA, defineScalarTag, load, NOT_RESOLVED } from 'js-yaml';
import { LovelaceConfig } from 'custom-card-helpers';
import { lintTemplate } from './lint';
import {
  checkDashboard,
  collectSharedDeclarations,
  collectTemplates,
  deprecatedInUse,
  extendsLoops,
} from './templates';
import { checkUnreadVariables } from './unread';
import { localize } from './localize';

export type CliLevel = 'error' | 'warning' | 'info';

export interface CliFinding {
  file: string;
  level: CliLevel;
  /** 1-based line the finding points at, when the text was available; 0 when it was not. */
  line: number;
  /** Where in the dashboard, written the way a person would point at it. */
  path: string;
  message: string;
  template?: string;
}

// The CLI speaks English: there is no viewer whose language it could follow.
const EN = { language: 'en' };
const say = (key: string, params?: Record<string, unknown>): string => localize(key, params, EN);

/*
 * Home Assistant's own YAML tags. A dashboard file can carry `!include` and `!secret`, which
 * js-yaml rejects as unknown; here they stand in for themselves as text, so the rest of the
 * file is still checked. What an include would have brought in is not seen, and the summary
 * says so once when one was met.
 */
const HA_TAGS = [
  '!include',
  '!secret',
  '!include_dir_list',
  '!include_dir_named',
  '!include_dir_merge_list',
  '!include_dir_merge_named',
  '!env_var',
  '!input',
];
const HA_SCHEMA = CORE_SCHEMA.withTags(
  ...HA_TAGS.map((tag) =>
    defineScalarTag<string>(tag, {
      resolve: (source, isExplicit) => (isExplicit ? `${tag} ${source ?? ''}`.trim() : NOT_RESOLVED),
      identify: () => false,
    }),
  ),
);

export interface ParsedDashboard {
  config: LovelaceConfig | null;
  /** The tags met while parsing, `!include` and friends, each once. */
  tags: string[];
  error?: string;
}

const isTagText = (value: unknown): boolean =>
  typeof value === 'string' && HA_TAGS.some((tag) => value === tag || value.startsWith(`${tag} `));

/*
 * What an `!include` stood for is not in the file, so the text standing in for it is taken
 * out again: a `views: !include views.yaml` must not be walked as if it were a list. Mappings
 * lose the key, lists lose the entry.
 */
function withoutTags(node: unknown): unknown {
  if (Array.isArray(node)) return node.filter((item) => !isTagText(item)).map(withoutTags);
  if (node && typeof node === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      if (!isTagText(value)) out[key] = withoutTags(value);
    }
    return out;
  }
  return node;
}

export function parseDashboard(text: string): ParsedDashboard {
  try {
    const config = load(text, { schema: HA_SCHEMA }) as LovelaceConfig | null;
    const tags = HA_TAGS.filter((tag) => new RegExp(`(^|\\s)${tag}(\\s|$)`, 'm').test(text));
    if (config === null || typeof config !== 'object' || Array.isArray(config)) {
      return { config: null, tags, error: 'not a mapping' };
    }
    return { config: (tags.length ? withoutTags(config) : config) as LovelaceConfig, tags };
  } catch (err) {
    return { config: null, tags: [], error: (err as Error).message.split('\n')[0] };
  }
}

/*
 * The line a template is defined on: `  name:` under `decluttering_templates:`, or the
 * `template: name` of a template card. Best effort - a finding without a line still says
 * its path. Only the first definition is pointed at.
 */
export function lineOf(text: string | undefined, template: string): number {
  if (!text) return 0;
  const lines = text.split('\n');
  const escaped = template.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const asKey = new RegExp(`^\\s*['"]?${escaped}['"]?\\s*:`);
  const asCard = new RegExp(`^\\s*template:\\s*['"]?${escaped}['"]?\\s*$`);
  let inTemplates = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^decluttering_templates\s*:/.test(line)) inTemplates = true;
    else if (/^\S/.test(line)) inTemplates = false;
    if (inTemplates && asKey.test(line)) return i + 1;
    if (asCard.test(line)) return i + 1;
  }
  return 0;
}

/**
 * Every finding for one dashboard. `text` is only used to point at lines. With `partial`,
 * something was brought in from another file and not seen, so nothing is said about what
 * is used or unused: a template may be used in the part that was not read.
 */
export function lintDashboard(
  config: LovelaceConfig | null | undefined,
  file: string,
  text?: string,
  partial = false,
): CliFinding[] {
  const findings: CliFinding[] = [];
  const at = (template: string | undefined): number => (template ? lineOf(text, template) : 0);
  const templates = collectTemplates(config);
  const shared = collectSharedDeclarations(config).map((declaration) => declaration.name);

  for (const name of Object.keys(templates).sort()) {
    for (const finding of lintTemplate(templates[name], shared)) {
      findings.push({
        file,
        level: finding.level,
        line: at(name),
        path: finding.path ? `${name}.${finding.path}` : name,
        message: say(finding.key, finding.params),
        template: name,
      });
    }
  }

  const health = partial ? { missingTemplates: [], unsetVariables: [], unusedTemplates: [] } : checkDashboard(config);
  for (const missing of health.missingTemplates) {
    findings.push({
      file,
      level: 'error',
      line: at(missing.template),
      path: `template: ${missing.template}`,
      message:
        say('error.template_missing', { template: missing.template }) +
        (missing.closest ? say('error.did_you_mean', { closest: missing.closest }) : ''),
      template: missing.template,
    });
  }
  for (const unset of health.unsetVariables) {
    findings.push({
      file,
      level: 'warning',
      line: at(unset.template),
      path: `template: ${unset.template}`,
      message: say('tools.health_unset', {
        template: unset.template,
        names: unset.names.join(', '),
        count: unset.count,
      }),
      template: unset.template,
    });
  }
  for (const unused of health.unusedTemplates) {
    findings.push({
      file,
      level: 'warning',
      line: at(unused),
      path: unused,
      message: say('tools.health_unused', { names: unused }),
      template: unused,
    });
  }

  for (const unread of partial ? [] : checkUnreadVariables(config, templates)) {
    const extra =
      unread.where === 'for_each'
        ? say('tools.health_unread_for_each')
        : unread.where === 'overrides'
          ? say('tools.health_unread_overrides')
          : '';
    findings.push({
      file,
      level: 'warning',
      line: at(unread.template),
      path: `template: ${unread.template}`,
      message:
        say('tools.health_unread', {
          template: unread.template,
          view: unread.view.title,
          name: unread.name,
          count: unread.count,
        }) + extra,
      template: unread.template,
    });
  }

  for (const loop of extendsLoops(config)) {
    findings.push({
      file,
      level: 'error',
      line: at(loop[0]),
      path: loop[0],
      message: say('tools.health_extends_loop', { path: loop.join(' → ') }),
      template: loop[0],
    });
  }

  for (const retired of partial ? [] : deprecatedInUse(config)) {
    const uses = [
      ...retired.views.map((view) => say('tools.health_view_uses', { view: view.title, count: view.count })),
      ...retired.templates.map((name) => say('tools.health_template_uses', { name })),
    ].join(', ');
    findings.push({
      file,
      level: 'info',
      line: at(retired.template),
      path: retired.template,
      message: retired.message
        ? say('tools.health_deprecated_because', { template: retired.template, message: retired.message, uses })
        : say('tools.health_deprecated', { template: retired.template, uses }),
      template: retired.template,
    });
  }

  const order: Record<CliLevel, number> = { error: 0, warning: 1, info: 2 };
  return findings.sort((a, b) => a.line - b.line || order[a.level] - order[b.level] || a.path.localeCompare(b.path));
}

/** Parse and lint one file's text. A file that will not parse is one error. */
export function lintText(text: string, file: string): { findings: CliFinding[]; tags: string[] } {
  const parsed = parseDashboard(text);
  if (parsed.error !== undefined) {
    return {
      findings: [
        { file, level: 'error', line: 0, path: '', message: `could not read the file as a dashboard: ${parsed.error}` },
      ],
      tags: parsed.tags,
    };
  }
  return { findings: lintDashboard(parsed.config, file, text, parsed.tags.length > 0), tags: parsed.tags };
}

export interface Summary {
  errors: number;
  warnings: number;
  infos: number;
  files: number;
}

export function summarise(findings: CliFinding[], files: number): Summary {
  return {
    errors: findings.filter((finding) => finding.level === 'error').length,
    warnings: findings.filter((finding) => finding.level === 'warning').length,
    infos: findings.filter((finding) => finding.level === 'info').length,
    files,
  };
}

const plural = (count: number, word: string): string => `${count} ${word}${count === 1 ? '' : 's'}`;

export function summaryLine(summary: Summary, ms?: number): string {
  const parts = [plural(summary.errors, 'error'), plural(summary.warnings, 'warning'), `${summary.infos} info`];
  return `${parts.join(', ')} in ${plural(summary.files, 'file')}${ms !== undefined ? ` · ${(ms / 1000).toFixed(1)} s` : ''}`;
}

export type CliFormat = 'text' | 'github' | 'json';

/** The findings as the terminal shows them, grouped by file, or as GitHub workflow annotations. */
export function formatFindings(findings: CliFinding[], format: CliFormat = 'text'): string {
  if (format === 'json') return JSON.stringify(findings, null, 2);
  if (format === 'github') {
    return findings
      .map((finding) => {
        const kind = finding.level === 'info' ? 'notice' : finding.level;
        const where = finding.line ? `,line=${finding.line}` : '';
        const message = `${finding.message}${finding.path ? ` (${finding.path})` : ''}`.replace(/\n/g, '%0A');
        return `::${kind} file=${finding.file}${where}::${message}`;
      })
      .join('\n');
  }
  const lines: string[] = [];
  let current: string | undefined;
  for (const finding of findings) {
    if (finding.file !== current) {
      current = finding.file;
      lines.push(current);
    }
    const where = finding.line ? `${finding.line}` : '-';
    lines.push(
      `  ${finding.level.padEnd(7)} ${where.padStart(4)}  ${finding.message}${finding.path ? `  [${finding.path}]` : ''}`,
    );
  }
  return lines.join('\n');
}

/** 1 when anything is an error, else 0. Usage and unreadable files are the caller's 2. */
export function exitCodeFor(findings: CliFinding[]): 0 | 1 {
  return findings.some((finding) => finding.level === 'error') ? 1 : 0;
}
