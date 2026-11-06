import { LibraryEntry } from './library';
import { SharedUpdate } from './community';
import { TrashEntry } from './trash';
import { lineDiff } from './diff';
import { toYaml } from './yaml';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * Compare with (idea 30): the versions of a template worth holding the current one against -
 * the starter library's, a shared post's, the copy on another dashboard, the one the trash
 * kept - gathered into one list for the Share tab's dropdown, and the diff's size in a line.
 */

export type CompareKind = 'library' | 'shared' | 'elsewhere' | 'trash';

export interface CompareSource {
  /** `kind:detail`, unique in the list. */
  id: string;
  kind: CompareKind;
  label: string;
  template: Record<string, any>;
}

export interface CompareContext {
  library?: LibraryEntry[];
  installed?: SharedUpdate[];
  trash?: TrashEntry[];
  elsewhere?: { urlPath: string; template: Record<string, any> }[];
  now?: number;
  labels: {
    library: (name: string) => string;
    shared: (title: string, author: string) => string;
    elsewhere: (urlPath: string) => string;
    trash: (ago: string, reason: string) => string;
    ago: (ms: number) => string;
  };
}

/** The template's body: what a card would be built from, without its name and type. */
export function templateBody(template: unknown): Record<string, any> {
  if (!template || typeof template !== 'object') return {};
  const rest = { ...(template as Record<string, any>) };
  delete rest.template;
  delete rest.type;
  return rest;
}

/**
 * Every version there is to compare the current template with, most useful first: the
 * library entry it matches by name (then any other library template), the shared post it
 * was installed from, the same name on other dashboards, and the trash's copies newest first.
 */
export function compareSources(name: string, ctx: CompareContext): CompareSource[] {
  const out: CompareSource[] = [];
  for (const entry of ctx.library ?? []) {
    out.push({
      id: `library:${entry.name}`,
      kind: 'library',
      label: ctx.labels.library(entry.name),
      template: entry.template,
    });
  }
  // The library entry of the same name goes first.
  out.sort((a, b) => Number(b.id === `library:${name}`) - Number(a.id === `library:${name}`));
  for (const update of ctx.installed ?? []) {
    if (update.name !== name || !update.latest || !update.entry) continue;
    out.push({
      id: `shared:${update.entry.id}`,
      kind: 'shared',
      label: ctx.labels.shared(update.entry.title, update.entry.author),
      template: templateBody(update.latest),
    });
  }
  for (const copy of ctx.elsewhere ?? []) {
    out.push({
      id: `elsewhere:${copy.urlPath}`,
      kind: 'elsewhere',
      label: ctx.labels.elsewhere(copy.urlPath),
      template: templateBody(copy.template),
    });
  }
  const now = ctx.now ?? Date.now();
  for (const entry of [...(ctx.trash ?? [])].filter((each) => each.name === name).sort((a, b) => b.at - a.at)) {
    out.push({
      id: `trash:${entry.at}`,
      kind: 'trash',
      label: ctx.labels.trash(ctx.labels.ago(now - entry.at), entry.reason),
      template: templateBody(entry.template),
    });
  }
  return out;
}

/** How big the difference is: lines added and removed, and in how many separate places. */
export function diffStats(current: unknown, other: unknown): { added: number; removed: number; places: number } {
  const lines = lineDiff(toYaml(templateBody(other)), toYaml(templateBody(current)));
  let added = 0;
  let removed = 0;
  let places = 0;
  let inChange = false;
  for (const line of lines) {
    if (line.kind === 'add') added += 1;
    if (line.kind === 'remove') removed += 1;
    const changed = line.kind !== 'same';
    if (changed && !inChange) places += 1;
    inChange = changed;
  }
  return { added, removed, places };
}

/** Roughly how long ago, in the viewer's words: the number and the unit to translate. */
export function agoParts(ms: number): { count: number; unit: 'minute' | 'hour' | 'day' } {
  const minutes = Math.max(0, Math.round(ms / 60000));
  if (minutes < 60) return { count: minutes, unit: 'minute' };
  const hours = Math.round(minutes / 60);
  if (hours < 48) return { count: hours, unit: 'hour' };
  return { count: Math.round(hours / 24), unit: 'day' };
}
