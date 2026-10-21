import { addTemplateToRoot, collectRawTemplates, replaceTemplate } from './templates';
import { dashboardKey, sameConfig, wsUrlPath } from './undo';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * Undo covers the last rewrite one of this card's own tools made, and nothing else. A
 * template deleted from the dashboard's menu, overwritten in the raw configuration editor or
 * edited into something worse and saved is simply gone. So every save of a dashboard is
 * compared with the one before, and a template that left or changed keeps its old version
 * here: the last TRASH_SIZE of them, newest first, in the Home Assistant user data of the
 * admin whose browser saw the save - so it follows them from device to device, and a
 * restart does not empty it.
 *
 * Only a browser with a dashboard open sees a save. That is where templates are edited,
 * and a YAML-mode dashboard - edited in a file, never saved through Home Assistant - has its
 * own history in whatever keeps that file.
 */

export const TRASH_SIZE = 20;
export const TRASH_KEY = 'decluttering-card-plus-trash';

export interface TrashEntry {
  name: string;
  /** The dashboard it was on, `lovelace` for the original one. */
  dashboard: string;
  template: unknown;
  /** Gone from the dashboard, or still there but different. */
  reason: 'removed' | 'replaced';
  at: number;
}

/** What one save did to a dashboard's templates: the ones it took away or changed, as they were. */
export function templateChanges(
  before: unknown,
  after: unknown,
): { name: string; template: unknown; reason: TrashEntry['reason'] }[] {
  const old = collectRawTemplates(before as any);
  const now = collectRawTemplates(after as any);
  const changes: { name: string; template: unknown; reason: TrashEntry['reason'] }[] = [];
  for (const name of Object.keys(old)) {
    if (!(name in now)) changes.push({ name, template: old[name], reason: 'removed' });
    else if (!sameConfig(old[name], now[name])) changes.push({ name, template: old[name], reason: 'replaced' });
  }
  return changes;
}

function isEntry(value: any): value is TrashEntry {
  return (
    !!value &&
    typeof value.name === 'string' &&
    typeof value.dashboard === 'string' &&
    typeof value.at === 'number' &&
    (value.reason === 'removed' || value.reason === 'replaced')
  );
}

/** Only well-formed entries: user data is anybody's to write, and a bad one should not break the list. */
export function readTrash(value: unknown): TrashEntry[] {
  return Array.isArray(value) ? value.filter(isEntry) : [];
}

/*
 * The trash with `added` in front, newest first, cut to TRASH_SIZE. A version already in
 * there is not kept twice - two open tabs both see the same save, and both write.
 */
export function addToTrash(trash: TrashEntry[], added: TrashEntry[]): TrashEntry[] {
  const out: TrashEntry[] = [];
  for (const entry of [...added, ...trash]) {
    const twin = out.some(
      (kept) =>
        kept.name === entry.name && kept.dashboard === entry.dashboard && sameConfig(kept.template, entry.template),
    );
    if (!twin) out.push(entry);
  }
  return out.slice(0, TRASH_SIZE);
}

/** The trash without one entry, matched on everything that identifies it. */
export function withoutEntry(trash: TrashEntry[], entry: TrashEntry): TrashEntry[] {
  return trash.filter(
    (each) => !(each.name === entry.name && each.dashboard === entry.dashboard && each.at === entry.at),
  );
}

/*
 * The dashboard with a trashed template back on it. Where the name is still in use the
 * template there is replaced, wherever it sits; otherwise it goes under
 * `decluttering_templates`, which every card on the dashboard can see - the view it was
 * written in may well be gone too. A template card's own `type:` and `template:` are where
 * it lived, not what it is, so they stay behind.
 */
export function restoreTemplate(ll: any, entry: TrashEntry): any {
  const template: Record<string, any> = { ...(entry.template as Record<string, any>) };
  delete template.type;
  delete template.template;
  return entry.name in collectRawTemplates(ll)
    ? replaceTemplate(ll, entry.name, template)
    : addTemplateToRoot(ll, entry.name, template as any);
}

/* ------------------------------------------------------------------ the watcher */

type Hass = {
  callWS: (message: Record<string, unknown>) => Promise<any>;
  connection?: { subscribeEvents?: (callback: (event: any) => void, type: string) => unknown };
  user?: { is_admin?: boolean };
};

const snapshots = new Map<string, unknown>();
// Dashboards kept in a file. Never saved through Home Assistant, so never watched.
const yamlDashboards = new Set<string>();
let started = false;
let hassRef: Hass | undefined;
const listeners = new Set<() => void>();

/** Called whenever the trash changes, so an open editor can show the new entry. */
export function onTrashChanged(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/*
 * Never with `force`. For a YAML-mode dashboard that loads the file again, and Home Assistant
 * announces it with lovelace_updated - which is what this answers by reading, so the two fed
 * each other and the dashboard redrew itself without end. A plain read is the saved config.
 */
async function readDashboardConfig(hass: Hass, path: string): Promise<unknown> {
  try {
    return await hass.callWS({ type: 'lovelace/config', url_path: wsUrlPath(path) });
  } catch {
    // A dashboard with nothing saved, or in YAML mode, has no templates to lose here.
    return undefined;
  }
}

export async function loadTrash(hass: unknown): Promise<TrashEntry[]> {
  try {
    const result = await (hass as Hass).callWS({ type: 'frontend/get_user_data', key: TRASH_KEY });
    return readTrash(result?.value);
  } catch {
    return [];
  }
}

export async function saveTrash(hass: unknown, trash: TrashEntry[]): Promise<void> {
  await (hass as Hass).callWS({ type: 'frontend/set_user_data', key: TRASH_KEY, value: trash });
  for (const listener of listeners) listener();
}

async function snapshot(hass: Hass, path: string): Promise<void> {
  const config = await readDashboardConfig(hass, path);
  if (config !== undefined) snapshots.set(path, config);
}

async function saved(hass: Hass, path: string): Promise<void> {
  const before = snapshots.get(path);
  const after = await readDashboardConfig(hass, path);
  if (after === undefined) return;
  snapshots.set(path, after);
  if (before === undefined) return;
  const changes = templateChanges(before, after);
  if (!changes.length) return;
  const at = Date.now();
  const added = changes.map((change) => ({ ...change, dashboard: path, at }));
  // Read again just before writing, so another tab's entries from the same moment survive.
  await saveTrash(hass, addToTrash(await loadTrash(hass), added));
}

/*
 * Starts watching, once per page, for an admin only - only an admin can save a dashboard,
 * and only an admin's user data should hold copies of every template. Every dashboard is read
 * once now, so the first save of any of them has something to be compared with.
 */
export function watchForTrash(given: unknown): void {
  const hass = given as Hass | undefined;
  if (started || !hass?.user?.is_admin || typeof hass.connection?.subscribeEvents !== 'function') return;
  started = true;
  hassRef = hass;
  hass.connection.subscribeEvents((event: any) => {
    const path = dashboardKey(event?.data?.url_path);
    if (!hassRef || yamlDashboards.has(path)) return;
    void saved(hassRef, path);
  }, 'lovelace_updated');
  void (async () => {
    let dashboards: any[] = [];
    try {
      dashboards = await hass.callWS({ type: 'lovelace/dashboards/list' });
    } catch {
      // Still worth reading the one on the page.
    }
    for (const dashboard of dashboards) {
      if (dashboard?.mode === 'yaml') yamlDashboards.add(dashboardKey(dashboard.url_path));
    }
    const here = dashboardKey(document.location.pathname.split('/').filter(Boolean)[0]);
    if (!yamlDashboards.has(here)) await snapshot(hass, here);
    for (const dashboard of dashboards) {
      const path = dashboardKey(dashboard?.url_path);
      if (yamlDashboards.has(path) || snapshots.has(path)) continue;
      await snapshot(hass, path);
    }
    if (!snapshots.has('lovelace')) await snapshot(hass, 'lovelace');
  })();
}

/** Keeps the latest hass, so a reconnect does not leave the watcher calling a dead one. */
export function trashHass(hass: unknown): void {
  if (started && hass) hassRef = hass as Hass;
}
