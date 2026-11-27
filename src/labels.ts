/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * Label names. Home Assistant puts the entity, device, area and floor registries on
 * `hass`, but not the label registry (still true of 2026.7), so a label is only ever seen
 * by its id - a repeat over labels, `group_by: label` and `[[entity|labels]]` all said
 * `living_room_lights` where the interface says "Living room lights". The registry is
 * one WebSocket call away, so it is fetched once per page and kept here.
 *
 * `hass.labels` still wins if a later Home Assistant starts carrying it. Until the fetch
 * lands - or if it fails - everything falls back to the id, exactly as before.
 */

export interface LabelEntry {
  label_id: string;
  name?: string;
}

let cache: Record<string, LabelEntry> | undefined;
let loading: Promise<void> | undefined;
let watching = false;
// Moves whenever the registry is said to have changed, so an answer asked for before the
// change can be told from one asked for after it.
let generation = 0;
// Not before this, after a fetch that failed.
let retryAt = 0;
// How long a refused or failed fetch is left alone. Cards ask on every hass update, and a
// Home Assistant that said no a moment ago will say no again.
const RETRY_MS = 30_000;

/** The label registry: Home Assistant's own if it has one, else what was fetched, else nothing yet. */
export function labelRegistry(hass: any): Record<string, LabelEntry> | undefined {
  return hass?.labels ?? cache;
}

/** A label's display name, or its id when the name is not known. */
export function labelName(hass: any, id: string): string {
  return labelRegistry(hass)?.[id]?.name || id;
}

/**
 * Fetch the label registry once. Resolves when it has landed (or failed - the ids stand
 * in), and a rename or a new label drops it, so the next call fetches it again. A fetch
 * that failed is not tried again for half a minute.
 */
export function loadLabels(hass: any, now = Date.now()): Promise<void> {
  if (hass?.labels || cache) return Promise.resolve();
  if (loading) return loading;
  if (typeof hass?.callWS !== 'function' || now < retryAt) return Promise.resolve();

  if (!watching && typeof hass?.connection?.subscribeEvents === 'function') {
    watching = true;
    // Subscribing answers with a promise, and a login that may not listen is refused through
    // it: the labels are still fetched, they just are not dropped on a rename.
    Promise.resolve(
      hass.connection.subscribeEvents(() => {
        cache = undefined;
        loading = undefined;
        retryAt = 0;
        generation += 1;
      }, 'label_registry_updated'),
    ).catch(() => undefined);
  }

  const asked = generation;
  const request: Promise<void> = hass
    .callWS({ type: 'config/label_registry/list' })
    .then((list: LabelEntry[]) => {
      // The registry changed while this was on its way, so what came back may be from before
      // the change: kept, it would have been the answer until the next change. Asked again.
      if (asked !== generation) return loading ?? loadLabels(hass);
      const next: Record<string, LabelEntry> = {};
      for (const label of list ?? []) if (label?.label_id) next[label.label_id] = label;
      cache = next;
      return undefined;
    })
    .catch(() => {
      // Not fatal: the ids are what everyone saw before this existed. Tried again, after a rest.
      if (asked !== generation) return;
      loading = undefined;
      retryAt = Date.now() + RETRY_MS;
    });
  loading = request;
  return request;
}

/** For tests: forget everything fetched. */
export function resetLabels(): void {
  cache = undefined;
  loading = undefined;
  watching = false;
  retryAt = 0;
}
