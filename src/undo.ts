/*
 * Every tool that rewrites a dashboard - renaming a template or a variable, decluttering a
 * card, installing from the library, turning similar cards into a template - saves at once,
 * because the cards it changes are not the one open in the editor. That makes a mistake
 * expensive: the dashboard's own undo knows nothing about a save it did not make, and the
 * old configuration is gone.
 *
 * So every one of them goes through here. Before saving, the configuration of each
 * dashboard it is about to change is kept, along with what it wrote, and the last one can be
 * put back. Only the last: this is a way out of a mistake just made, not a history.
 *
 * Kept in memory and in sessionStorage, so an undo survives the reload a dashboard save
 * sometimes brings, but not the end of the tab.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface DashboardWrite {
  /** The dashboard's url path; the original dashboard is always `lovelace`. */
  urlPath: string;
  before: unknown;
  after: unknown;
}

export interface UndoEntry {
  /** Which tool did it, as the key its label is localised under. */
  operation: string;
  at: number;
  dashboards: DashboardWrite[];
  /** What the edit dialog held before, when the tool changed that as well. */
  dialog?: unknown;
}

/** What a rewrite saves through: the dashboard on the page, and the websocket for any other. */
export interface Saver {
  /** The url path of the dashboard on the page. */
  ownPath: string;
  panel?: { config: unknown; saveConfig: (config: unknown) => Promise<unknown> } | null;
  hass?: { callWS: (message: Record<string, unknown>) => Promise<any> } | null;
}

const STORAGE_KEY = 'decluttering-card-plus:undo';

// The original dashboard has no url_path of its own and is written several ways.
const DEFAULT_PATHS = ['lovelace', 'default', ''];

let held: UndoEntry | undefined;

/** One name for each dashboard, whichever way the original one was written. */
export function dashboardKey(path: string | null | undefined): string {
  return DEFAULT_PATHS.includes(path ?? '') ? 'lovelace' : (path as string);
}

/** The url_path the websocket API wants: null for the original dashboard. */
export function wsUrlPath(path: string | null | undefined): string | null {
  return DEFAULT_PATHS.includes(path ?? '') ? null : (path as string);
}

/*
 * The same configuration whatever order its keys came back in. Home Assistant hands a
 * dashboard back as it was saved, but nothing promises that, and an undo refusing to run
 * because two keys swapped places would be worse than useless.
 */
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value).sort()) out[key] = canonical((value as any)[key]);
    return out;
  }
  return value;
}

export function sameConfig(a: unknown, b: unknown): boolean {
  return JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
}

function storage(): Storage | undefined {
  try {
    return typeof sessionStorage === 'undefined' ? undefined : sessionStorage;
  } catch {
    return undefined;
  }
}

/** Keeps `entry` as the one thing that can be undone, replacing whatever was kept before. */
export function holdUndo(entry: UndoEntry): void {
  held = entry;
  const store = storage();
  if (!store) return;
  try {
    store.setItem(STORAGE_KEY, JSON.stringify(entry));
  } catch {
    // A dashboard too big for sessionStorage is still undoable until the page goes; an old
    // entry left there would be the wrong one, so it goes.
    try {
      store.removeItem(STORAGE_KEY);
    } catch {
      // Nothing more to be done about a storage that will not even remove.
    }
  }
}

/** What can be undone, if anything. */
export function heldUndo(): UndoEntry | undefined {
  if (held) return held;
  const raw = storage()?.getItem(STORAGE_KEY);
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.operation === 'string' && Array.isArray(parsed.dashboards)) {
      held = parsed as UndoEntry;
      return held;
    }
  } catch {
    // Unreadable is the same as nothing kept.
  }
  return undefined;
}

export function forgetUndo(): void {
  held = undefined;
  try {
    storage()?.removeItem(STORAGE_KEY);
  } catch {
    // As above.
  }
}

/**
 * A dashboard's configuration as saved now, over the websocket - the one on the page too.
 * The page's copy is only what the page last loaded or saved itself: a save from another
 * tab, or straight over the websocket, never reaches it, so comparing against it let an
 * undo write over that save without asking. It is still the answer when there is no
 * websocket, or Home Assistant has nothing saved for the page's dashboard to give.
 */
export async function readDashboard(saver: Saver, urlPath: string): Promise<unknown> {
  const own = dashboardKey(urlPath) === dashboardKey(saver.ownPath) && !!saver.panel;
  if (!saver.hass) {
    if (own) return saver.panel?.config;
    throw new Error(`cannot read the dashboard "${urlPath}"`);
  }
  // `force` skips Home Assistant's own cache, so what is compared and rewritten is current.
  const read = saver.hass.callWS({ type: 'lovelace/config', url_path: wsUrlPath(urlPath), force: true });
  return own ? read.catch(() => saver.panel?.config) : read;
}

/** Saves a dashboard: the one on the page through the page, so it redraws; any other over the websocket. */
export async function writeDashboard(saver: Saver, urlPath: string, config: unknown): Promise<void> {
  if (dashboardKey(urlPath) === dashboardKey(saver.ownPath) && saver.panel) {
    await saver.panel.saveConfig(config);
    return;
  }
  if (!saver.hass) throw new Error(`cannot save the dashboard "${urlPath}"`);
  await saver.hass.callWS({ type: 'lovelace/config/save', url_path: wsUrlPath(urlPath), config });
}

/**
 * Rewrites one or more dashboards and keeps what each was before, so the whole operation
 * can be undone as one. A dashboard the rewrite leaves as it was is not saved at all.
 *
 * Should a save fail part-way, the dashboards already saved are still kept for undoing -
 * that is exactly when somebody needs the way back - and the error is passed on.
 */
export async function applyRewrite(
  saver: Saver,
  operation: string,
  changes: { urlPath: string; build: (config: any) => unknown }[],
): Promise<UndoEntry | undefined> {
  const written: DashboardWrite[] = [];
  const keep = (): UndoEntry | undefined => {
    if (!written.length) return undefined;
    const entry = { operation, at: Date.now(), dashboards: written };
    holdUndo(entry);
    return entry;
  };
  try {
    for (const change of changes) {
      const before = await readDashboard(saver, change.urlPath);
      const after = change.build(before);
      if (after === before || sameConfig(after, before)) continue;
      await writeDashboard(saver, change.urlPath, after);
      written.push({ urlPath: dashboardKey(change.urlPath), before, after });
    }
  } catch (err) {
    keep();
    throw err;
  }
  return keep();
}

export type UndoOutcome =
  /** Everything is back as it was. */
  | { result: 'done' }
  /** Nothing to do: each dashboard is already as it was before. */
  | { result: 'nothing' }
  /** Somebody has saved these dashboards since, and undoing would lose that too. */
  | { result: 'changed'; dashboards: string[] };

/**
 * Puts back what the last rewrite changed. A dashboard saved since by anyone - in another
 * tab, from the edit dialog, by hand - would lose that change as well, so unless `force`
 * says the person has been told and agreed, those are named and nothing is written.
 */
export async function runUndo(saver: Saver, entry: UndoEntry, force = false): Promise<UndoOutcome> {
  const now = await Promise.all(entry.dashboards.map((each) => readDashboard(saver, each.urlPath)));
  const restore = entry.dashboards.filter((each, index) => !sameConfig(now[index], each.before));
  if (!restore.length) {
    forgetUndo();
    return { result: 'nothing' };
  }
  const changed = entry.dashboards
    .filter((each, index) => !sameConfig(now[index], each.after))
    .map((each) => each.urlPath);
  if (changed.length && !force) return { result: 'changed', dashboards: changed };
  for (const each of restore) await writeDashboard(saver, each.urlPath, each.before);
  forgetUndo();
  return { result: 'done' };
}
