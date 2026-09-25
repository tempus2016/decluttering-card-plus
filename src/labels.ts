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
 * in), and a rename or a new label drops it, so the next call fetches it again.
 */
export function loadLabels(hass: any): Promise<void> {
  if (hass?.labels || cache) return Promise.resolve();
  if (loading) return loading;
  if (typeof hass?.callWS !== 'function') return Promise.resolve();

  if (!watching && typeof hass?.connection?.subscribeEvents === 'function') {
    watching = true;
    hass.connection.subscribeEvents(() => {
      cache = undefined;
      loading = undefined;
    }, 'label_registry_updated');
  }

  loading = hass
    .callWS({ type: 'config/label_registry/list' })
    .then((list: LabelEntry[]) => {
      const next: Record<string, LabelEntry> = {};
      for (const label of list ?? []) if (label?.label_id) next[label.label_id] = label;
      cache = next;
    })
    .catch(() => {
      // Not fatal: the ids are what everyone saw before this existed. Try again next time.
      loading = undefined;
    });
  return loading as Promise<void>;
}

/** For tests: forget everything fetched. */
export function resetLabels(): void {
  cache = undefined;
  loading = undefined;
  watching = false;
}
