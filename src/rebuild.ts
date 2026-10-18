/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * `rebuild_on:` - reactivity a card asks for by name. Substitution builds a card's config
 * once, which is what keeps a dashboard of these cheap, and it is why a placeholder cannot
 * read an entity's state: the card would have to rebuild on every state change in the
 * house. A card that genuinely wants to change shape with something - a layout picked from
 * an input_select, say - lists that entity, and builds again only when that entity's state
 * moves. Not its attributes, not anything else.
 *
 *   type: custom:decluttering-card-plus
 *   template: room
 *   rebuild_on: input_select.layout
 *   variables:
 *     - layout: '[[input_select.layout|state]]'
 *
 * Only the entities listed can be read with `|state`, so the list is the whole of what the
 * card reacts to and can be read off the config at a glance.
 */

/** How long a card waits after a change for the next one, so a burst of them builds once. */
export const REBUILD_DEBOUNCE_MS = 250;

const ENTITY_ID = /^[a-z0-9_]+\.[a-z0-9_]+$/;

/** The entities a card rebuilds on: one written on its own or a list, anything not an entity id left out. */
export function rebuildOnEntities(value: unknown): string[] {
  const list = Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
  const entities: string[] = [];
  for (const each of list) {
    if (typeof each !== 'string') continue;
    const entity = each.trim();
    if (ENTITY_ID.test(entity) && !entities.includes(entity)) entities.push(entity);
  }
  return entities;
}

/** What `rebuild_on:` names that is not an entity id, for saying so rather than ignoring it. */
export function rebuildOnRejects(value: unknown): string[] {
  const list = Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
  return list
    .filter((each) => typeof each !== 'string' || !ENTITY_ID.test(each.trim()))
    .map((each) => (typeof each === 'string' ? each : JSON.stringify(each)));
}

/** The state of each entity, in order - undefined for one Home Assistant does not have. */
export function stateSnapshot(hass: any, entities: string[]): (string | undefined)[] {
  return entities.map((entity) => hass?.states?.[entity]?.state);
}

/** Whether any of the states has moved since the snapshot before. No snapshot yet counts as moved. */
export function statesMoved(before: (string | undefined)[] | undefined, after: (string | undefined)[]): boolean {
  if (!before || before.length !== after.length) return true;
  return after.some((state, index) => state !== before[index]);
}
