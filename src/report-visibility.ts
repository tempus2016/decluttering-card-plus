/*
 * #460: when a card's debug report is on show. A page with many reports on it gets crowded,
 * so the report can start folded to a one-line bar (`report_open: false`) and can be switched
 * off from one entity (`report_entity:`) for every card that names it. Neither rebuilds the
 * card: the build is traced either way, and only the showing changes.
 */

/** The states that read as "off". Anything else, a missing entity included, leaves the report on show. */
const OFF_STATES = new Set(['off']);

/**
 * Whether `report_entity:` switches the report off. Only a state that says off does: an entity
 * that is missing or unavailable leaves the report showing, so a typo cannot hide it unseen.
 */
export function reportSwitchedOff(
  hass: { states?: Record<string, { state?: string } | undefined> } | undefined,
  entity: string | undefined,
): boolean {
  if (!entity || !hass?.states) return false;
  const state = hass.states[entity]?.state;
  return typeof state === 'string' && OFF_STATES.has(state);
}

/** The `report_entity:` a card names, or nothing when it names something that is not an entity id. */
export function reportEntity(written: unknown): string | undefined {
  if (typeof written !== 'string') return undefined;
  const trimmed = written.trim();
  return /^[a-z_]+\.[a-z0-9_]+$/.test(trimmed) ? trimmed : undefined;
}
