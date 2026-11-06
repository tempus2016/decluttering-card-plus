import { TemplateConfig } from './types';
import { CONSUMER_TYPES } from './templates';
import { renameVariableInCard } from './rename-variable';
import { UnreadFinding } from './unread';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * A template says which version it is (idea 43):
 *
 *   room_light_tile:
 *     version: 3
 *     changes:
 *       3: "show_brightness is now brightness_mode"
 *       2: "icon defaults to the entity's own"
 *
 * Nothing is enforced - an old card still builds. The version is for the health panel,
 * which can then say of a card passing a variable the template no longer reads *since when*
 * and *why*, and offer the rename when the note names a replacement.
 */
export const VERSION_KEY = 'version';
export const CHANGES_KEY = 'changes';

export interface VersionNote {
  version: number;
  note: string;
  /** The name the note says the variable became, when it says one. */
  replacement?: string;
}

/** The template's version as a number, or undefined when it has none it can count. */
export function templateVersion(template: TemplateConfig | undefined): number | undefined {
  const written = (template as any)?.[VERSION_KEY];
  const version = typeof written === 'number' ? written : typeof written === 'string' ? Number(written) : NaN;
  return Number.isFinite(version) ? version : undefined;
}

/** The change notes, newest first, each as a version and its text. */
export function changeNotes(template: TemplateConfig | undefined): { version: number; note: string }[] {
  const changes = (template as any)?.[CHANGES_KEY];
  if (!changes || typeof changes !== 'object') return [];
  const notes: { version: number; note: string }[] = [];
  for (const [key, value] of Object.entries(changes)) {
    const version = Number(key);
    if (!Number.isFinite(version)) continue;
    const texts = Array.isArray(value) ? value : [value];
    for (const text of texts) if (typeof text === 'string' && text.trim()) notes.push({ version, note: text.trim() });
  }
  return notes.sort((a, b) => b.version - a.version);
}

const NAME = '[A-Za-z_][\\w.]*';

/** What a note says a variable became: "old is now new", "old renamed to new", "old → new", "old -> new". */
export function replacementIn(note: string, variable: string): string | undefined {
  const escaped = variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`\\b${escaped}\\b\\s+(?:is now|became|renamed to|replaced by|->|→)\\s+\`?(${NAME})\`?`, 'i'),
    new RegExp(`\`${escaped}\`\\s+(?:is now|became|renamed to|replaced by|->|→)\\s+\`?(${NAME})\`?`, 'i'),
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(note);
    if (match && match[1] !== variable) return match[1];
  }
  return undefined;
}

/** The newest change note that mentions the variable by name, with any replacement it gives. */
export function versionNote(template: TemplateConfig | undefined, variable: string): VersionNote | undefined {
  const word = new RegExp(`(^|[^\\w])${variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\w]|$)`);
  for (const each of changeNotes(template)) {
    if (!word.test(each.note)) continue;
    const replacement = replacementIn(each.note, variable);
    return replacement ? { ...each, replacement } : each;
  }
  return undefined;
}

export type DatedFinding = UnreadFinding & { since?: VersionNote };

/** The unread findings, each with the change note that explains it when its template has one. */
export function withVersionNotes(findings: UnreadFinding[], templates: Record<string, TemplateConfig>): DatedFinding[] {
  return findings.map((finding) => {
    const template = Object.prototype.hasOwnProperty.call(templates, finding.template)
      ? templates[finding.template]
      : undefined;
    const since = versionNote(template, finding.name);
    return since ? { ...finding, since } : finding;
  });
}

export interface OlderElsewhere {
  template: string;
  here: number;
  there: number;
  dashboard: string;
}

/**
 * Templates this dashboard defines that another dashboard also defines at an older version:
 * a library and a local copy drifting apart. `borrowed` maps a name to the lender's template
 * and `from` to the lender's url path.
 */
export function olderElsewhere(
  local: Record<string, TemplateConfig>,
  borrowed: Record<string, TemplateConfig>,
  from: Record<string, string>,
): OlderElsewhere[] {
  const out: OlderElsewhere[] = [];
  for (const [name, template] of Object.entries(local)) {
    const here = templateVersion(template);
    const there = templateVersion(borrowed[name]);
    if (here === undefined || there === undefined || there >= here) continue;
    out.push({ template: name, here, there, dashboard: from[name] ?? '' });
  }
  return out;
}

/**
 * The dashboard with one variable renamed on every card in one view that uses the template
 * and passes it - which is what the health panel's Rename button does. Nothing else moves.
 */
export function renameVariableOnCards(ll: any, viewIndex: number, template: string, from: string, to: string): any {
  const passes = (card: any): boolean => JSON.stringify(card).includes(`"${from}"`);
  const rewrite = (node: any): any => {
    if (Array.isArray(node)) return node.map(rewrite);
    if (!node || typeof node !== 'object') return node;
    if (CONSUMER_TYPES.includes(node.type) && node.template === template && passes(node)) {
      return renameVariableInCard(node, from, to);
    }
    const out: any = {};
    for (const [key, value] of Object.entries(node)) out[key] = rewrite(value);
    return out;
  };
  const views: any[] = Array.isArray(ll?.views) ? ll.views : [];
  return { ...ll, views: views.map((view, index) => (index === viewIndex ? rewrite(view) : view)) };
}
