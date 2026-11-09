/* eslint-disable @typescript-eslint/no-explicit-any */

import { registryKey, sameRegistry } from '../registry-index';

/*
 * #430: the card editor builds the template several times a render - the Result, each
 * shown default, each Reset's text, the show_if/hide_if fields and the checks - and it
 * renders on every keystroke and on every state change in the house. With a big template
 * that was a tenth of a second for a lamp switching on somewhere else.
 *
 * Each of those builds reads the card's config, its template, the dashboard (for its item
 * templates and defaults), the registries and language, and the states of the entities the
 * card rebuilds on - nothing else, since a build may read no other state. So each is kept
 * until one of those changes. Home Assistant replaces a state object, a registry or the
 * config as a whole when it changes, and the editor is handed a new config on every edit,
 * so comparing them by identity is enough.
 */

/** What a build in the editor reads, in a form compared entry by entry. */
export function buildKey(hass: any, scope: string[], ...reads: unknown[]): unknown[] {
  return [
    ...reads,
    hass?.config,
    hass?.user,
    hass?.locale,
    hass?.language,
    hass?.localize,
    ...registryKey(hass),
    scope.join('\n'),
    // Only the entities in scope: any other state is one the build is not allowed to read.
    ...scope.map((id) => hass?.states?.[id]),
  ];
}

/** Builds kept by name, each until what it read changes. */
export class BuildCache {
  private kept = new Map<string, { key: unknown[]; value: unknown }>();

  /** How many times something was built rather than kept - what the tests count. */
  builds = 0;

  get<T>(slot: string, key: unknown[], make: () => T): T {
    const kept = this.kept.get(slot);
    if (kept && sameRegistry(kept.key, key)) return kept.value as T;
    const value = make();
    this.builds += 1;
    this.kept.set(slot, { key, value });
    return value;
  }

  /** Whether this slot holds a build made with this key. */
  holds(slot: string, key: unknown[]): boolean {
    const kept = this.kept.get(slot);
    return !!kept && sameRegistry(kept.key, key);
  }

  /** The value last built for this slot, whatever it read. */
  last<T>(slot: string): T | undefined {
    return this.kept.get(slot)?.value as T | undefined;
  }

  clear(): void {
    this.kept.clear();
  }
}
