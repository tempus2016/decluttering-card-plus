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

/** The entity id a rebuild_on entry names: the text itself, or the `entity:` of `{entity, watch}` (#411). */
export function rebuildEntryEntity(entry: unknown): unknown {
  if (entry && typeof entry === 'object' && !Array.isArray(entry)) return (entry as { entity?: unknown }).entity;
  return entry;
}

/** Whether a rebuild_on entry is written as `{entity, watch}` rather than as the entity id alone (#411). */
export function isRebuildObject(entry: unknown): entry is { entity?: unknown; watch?: unknown } {
  return !!entry && typeof entry === 'object' && !Array.isArray(entry);
}

/** The entities a card rebuilds on: one written on its own or a list, anything not an entity id left out. */
export function rebuildOnEntities(value: unknown): string[] {
  const list = Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
  const entities: string[] = [];
  for (const written of list) {
    const each = rebuildEntryEntity(written);
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
    .filter((written) => {
      const each = rebuildEntryEntity(written);
      return typeof each !== 'string' || !ENTITY_ID.test(each.trim());
    })
    .map((each) => (typeof each === 'string' ? each : JSON.stringify(each)));
}

/*
 * #411, opt-in: which parts of an entity's state count as a change. Left out, an entity
 * counts as it always has - its state, and last_updated as well when the template reads any
 * `attr:` - so a camera whose access_token refreshes every few minutes rebuilds every few
 * minutes. A card or an entry that names what it watches compares only those parts:
 *
 *   rebuild_on:
 *     - entity: camera.front
 *       watch: [state, camera_name]       # the state and that one attribute
 *   rebuild_on_watch: read                # or: what the template reads, on every entry
 *
 * `read` is the state and every attribute the template names in an `attr:` step, plus
 * last_updated when it reads `|last_updated`. A template that names an attribute only
 * through a placeholder - `|attr:[[which]]` - cannot be read that way, so it is watched as
 * if nothing had been said.
 */

/** What an entry or a card says to watch: nothing said (everything, as before), or what it names. */
export type WatchSpec = { read: boolean; parts: string[] } | undefined;

/** The parts of a state there are names for; anything else is the name of an attribute. */
const STATE_PARTS = ['state', 'last_changed', 'last_updated'];

/** One part to watch as written, `attr:x` and a bare `x` both meaning the attribute. */
function watchPart(text: string): string | undefined {
  const part = text.trim();
  if (!part) return undefined;
  if (STATE_PARTS.includes(part)) return part;
  const name = part.startsWith('attr:') ? part.slice(5).trim() : part;
  return /^[a-zA-Z0-9_]+$/.test(name) ? `attr:${name}` : undefined;
}

/** A `watch:` or `rebuild_on_watch:` value as written: `all` (or nothing) is the default, `read` or a list narrows it. */
export function parseWatch(value: unknown): WatchSpec {
  if (value === undefined || value === null || value === 'all') return undefined;
  const list = Array.isArray(value) ? value : [value];
  let read = false;
  const parts: string[] = [];
  for (const each of list) {
    if (typeof each !== 'string') continue;
    if (each.trim() === 'all') return undefined;
    if (each.trim() === 'read') {
      read = true;
      continue;
    }
    const part = watchPart(each);
    if (part && !parts.includes(part)) parts.push(part);
  }
  return read || parts.length ? { read, parts } : undefined;
}

/** Two specs for the same entity together: the wider wins, and nothing said is widest of all. */
export function mergeWatch(a: WatchSpec, b: WatchSpec): WatchSpec {
  if (!a || !b) return undefined;
  return { read: a.read || b.read, parts: [...a.parts, ...b.parts.filter((part) => !a.parts.includes(part))] };
}

/** What a template reads of a state, for `read`: attribute names, and whether it reads last_updated. */
export interface StateReads {
  attributes: string[];
  lastUpdated: boolean;
  /** An attribute named by a placeholder, which cannot be known before the build. */
  unknown: boolean;
}

/** The parts a spec comes to with the template's reads, or undefined for the default comparison. */
export function watchedParts(spec: WatchSpec, reads: StateReads | undefined): string[] | undefined {
  if (!spec) return undefined;
  if (spec.read && (!reads || reads.unknown)) return undefined;
  const parts = [...spec.parts];
  const add = (part: string): void => {
    if (!parts.includes(part)) parts.push(part);
  };
  if (spec.read && reads) {
    add('state');
    for (const name of reads.attributes) add(`attr:${name}`);
    if (reads.lastUpdated) add('last_updated');
  }
  return parts;
}

/** One watched part of a state, as text to compare. */
function partOf(state: any, part: string): string {
  const value = part.startsWith('attr:') ? state.attributes?.[part.slice(5)] : state[part];
  if (value === undefined) return '';
  return typeof value === 'string' ? value : JSON.stringify(value);
}

/**
 * The state of each entity, in order - undefined for one Home Assistant does not have. An
 * entity with parts to watch (#411) is compared on those parts only.
 */
export function stateSnapshot(
  hass: any,
  entities: string[],
  attributes = false,
  watched?: (string[] | undefined)[],
): (string | undefined)[] {
  return entities.map((entity, index) => {
    const state = hass?.states?.[entity];
    if (!state) return undefined;
    const parts = watched?.[index];
    if (parts) return parts.map((part) => partOf(state, part)).join('\u0000');
    // A card that reads `attr:` builds again when an attribute moves too (idea 39), which
    // last_updated marks - but only that card, so a chatty media player costs no one else.
    return attributes ? `${state.state}\u0000${state.last_updated ?? ''}` : state.state;
  });
}

/** Whether any of the states has moved since the snapshot before. No snapshot yet counts as moved. */
export function statesMoved(before: (string | undefined)[] | undefined, after: (string | undefined)[]): boolean {
  if (!before || before.length !== after.length) return true;
  return after.some((state, index) => state !== before[index]);
}
