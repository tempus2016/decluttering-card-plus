import { BuildTiming } from './trace';

/*
 * Build statistics for the health panel (idea 60): what this page has built since it
 * loaded, by template, with how long it took and how that compares with the last reload.
 * The numbers are the build timings the card already keeps for the Slowest builds list,
 * grouped differently; nothing new is measured and nothing leaves the browser.
 */

export interface StatsRow {
  template: string;
  /** The views the template was built in, as the timings named them. */
  views: string[];
  builds: number;
  total: number;
  slowest: number;
  /** Change in total against the snapshot, when there is one to compare with. */
  delta?: number;
  /** What the card can tell about the change: 'lazy' when more builds are lazy copies, else nothing. */
  reason?: 'lazy' | 'rebuilt';
}

export interface Stats {
  cardsBuilt: number;
  templatesInUse: number;
  totalMs: number;
  /** Builds past the first of a card that follows state - the ones `rebuild_on:` caused. */
  rebuiltOnState: number;
  rows: StatsRow[];
}

/** The totals per template kept from before a reload, to show the trend against. */
export type StatsSnapshot = Record<string, { total: number; builds: number }>;

export const STATS_SNAPSHOT_KEY = 'decluttering-card-plus-stats';

// The card itself when the build says which it was; otherwise the best guess the timing allows.
function cardKey(entry: BuildTiming): string {
  if (entry.card !== undefined) return `card:${entry.card}`;
  return JSON.stringify([entry.template, entry.name ?? null, entry.view ?? null]);
}

/** Everything the panel shows, from the timings, most time first. */
export function buildStats(entries: BuildTiming[], snapshot?: StatsSnapshot): Stats {
  const rows = new Map<string, StatsRow>();
  const seenCard = new Set<string>();
  let rebuiltOnState = 0;
  for (const entry of entries) {
    const row = rows.get(entry.template) ?? { template: entry.template, views: [], builds: 0, total: 0, slowest: 0 };
    row.builds += 1;
    row.total += entry.ms;
    row.slowest = Math.max(row.slowest, entry.ms);
    if (entry.view && !row.views.includes(entry.view)) row.views.push(entry.view);
    rows.set(entry.template, row);
    const key = cardKey(entry);
    if (seenCard.has(key) && entry.follows) rebuiltOnState += 1;
    seenCard.add(key);
  }
  const list = [...rows.values()];
  for (const row of list) {
    const before = snapshot?.[row.template];
    if (before) {
      row.delta = Math.round(row.total - before.total);
      if (row.builds < before.builds && row.delta < 0) row.reason = 'lazy';
      else if (row.builds > before.builds && row.delta > 0) row.reason = 'rebuilt';
    }
  }
  list.sort((a, b) => b.total - a.total || a.template.localeCompare(b.template));
  return {
    cardsBuilt: seenCard.size,
    templatesInUse: list.length,
    totalMs: Math.round(list.reduce((sum, row) => sum + row.total, 0)),
    rebuiltOnState,
    rows: list.map((row) => ({ ...row, total: Math.round(row.total), slowest: Math.round(row.slowest) })),
  };
}

/** What to keep for next time: per template, the total and the number of builds. */
export function snapshotOf(stats: Stats): StatsSnapshot {
  const out: StatsSnapshot = {};
  for (const row of stats.rows) out[row.template] = { total: row.total, builds: row.builds };
  return out;
}

/** The rows sorted by a column, biggest first for numbers, A to Z for text. */
export function sortRows(rows: StatsRow[], by: 'template' | 'builds' | 'total' | 'slowest' | 'delta'): StatsRow[] {
  const out = [...rows];
  if (by === 'template') return out.sort((a, b) => a.template.localeCompare(b.template));
  return out.sort(
    (a, b) =>
      ((b[by] ?? -Infinity) as number) - ((a[by] ?? -Infinity) as number) || a.template.localeCompare(b.template),
  );
}

/** The table as Markdown, for an issue or the forum. */
export function statsAsMarkdown(stats: Stats, headings: string[]): string {
  const lines = [
    `| ${headings.join(' | ')} |`,
    `| ${headings.map(() => '---').join(' | ')} |`,
    ...stats.rows.map((row) =>
      [
        row.template,
        row.views.join(', '),
        String(row.builds),
        `${row.total} ms`,
        `${row.slowest} ms`,
        row.delta === undefined ? '' : `${row.delta > 0 ? '+' : ''}${row.delta} ms`,
      ].join(' | '),
    ),
  ];
  return lines.map((line, index) => (index < 2 ? line : `| ${line} |`)).join('\n');
}
