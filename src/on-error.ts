import { CONSUMER_TYPES, GROUP_CARD_TYPE, LEGACY_TEMPLATE_TYPE, TEMPLATE_TYPE } from './templates';
import { isElementName } from './installed';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * `on_error:` is what a card shows instead of the red error card when it cannot be built:
 * its template missing, a loop, a strict refusal, a template defining two things, or a
 * custom card it builds that was never installed. It is a config of the same kind the
 * template builds - a badge config for a badge - or `hide`, which shows nothing and gives
 * the place back the way a hidden card does. The error itself still goes to the console.
 *
 * Written on the card or on its template; the card's wins, since it is the more particular.
 */
export const ON_ERROR_KEY = 'on_error';
export const ON_ERROR_HIDE = 'hide';

export type OnError = { hide: true } | { config: Record<string, unknown> };

/** What a card shows when it cannot be built, or undefined when it shows the error as ever. */
export function onErrorOf(card: unknown, template: unknown): OnError | undefined {
  for (const source of [card, template]) {
    const written = (source as any)?.[ON_ERROR_KEY];
    if (written === ON_ERROR_HIDE) return { hide: true };
    if (written && typeof written === 'object' && !Array.isArray(written)) return { config: written };
  }
  return undefined;
}

// Stacks whose cards are the cards a template - or a repeat - built, one level down.
const STACK_TYPES = ['vertical-stack', 'horizontal-stack', 'grid', GROUP_CARD_TYPE];

// This bundle's own elements, which are defined by the time anything here runs.
const OWN_TYPES = [...CONSUMER_TYPES, TEMPLATE_TYPE, LEGACY_TEMPLATE_TYPE, GROUP_CARD_TYPE];

/** The element a `custom:` type names, or undefined for one of Home Assistant's own. */
function tagOf(type: unknown): string | undefined {
  if (typeof type !== 'string' || !type.startsWith('custom:') || OWN_TYPES.includes(type)) return undefined;
  return type.slice('custom:'.length) || undefined;
}

/**
 * The custom elements a built config needs: its own type, and the types of the cards in it
 * when it is a stack - which is what a repeat builds, and what most templates holding
 * several cards are. Deeper than that, a card Home Assistant cannot create shows its own
 * error inside the card around it, which the rest of the card survives.
 */
export function customTags(config: unknown): string[] {
  const tags: string[] = [];
  const add = (type: unknown): void => {
    const tag = tagOf(type);
    if (tag && !tags.includes(tag)) tags.push(tag);
  };
  const node = config as any;
  add(node?.type);
  if (STACK_TYPES.includes(node?.type) && Array.isArray(node?.cards)) for (const card of node.cards) add(card?.type);
  return tags;
}

// The longest an unfinished page can hold off the verdict (#456): busy for longer than this, it is given.
const IDLE_WAIT_MS = 15000;

/** Resolves once the page has a moment free, or after the longest wait, whichever comes first. */
function pageIdle(): Promise<void> {
  const win = globalThis as { requestIdleCallback?: (fn: () => void, opts: { timeout: number }) => number };
  if (typeof win.requestIdleCallback !== 'function') return Promise.resolve();
  return new Promise((resolve) => win.requestIdleCallback?.(() => resolve(), { timeout: IDLE_WAIT_MS }));
}

/**
 * The ones of these elements still not defined after waiting a moment for them, the way
 * Home Assistant waits before showing "Custom element doesn't exist": a card's resource can
 * finish loading after the dashboard has started drawing. The moment is counted as two
 * seconds and then the page being free (#456): on a dashboard busy building, a card's script
 * can sit downloaded but not yet run for longer than two seconds, and calling it missing then
 * drew an error that was gone a few seconds later.
 *
 * A type that could never name an element - `custom:mushroomcard`, `custom:Button-Card` - is
 * missing without waiting: the registry rejects a wait for one, which used to leave the
 * mistyped type as the one failure the card never said.
 */
export async function undefinedElements(
  tags: string[],
  wait = 2000,
  registry: Pick<CustomElementRegistry, 'get' | 'whenDefined'> = customElements,
  idle: () => Promise<void> = pageIdle,
): Promise<string[]> {
  const missing = tags.filter((tag) => !registry.get(tag));
  const awaited = missing.filter(isElementName);
  if (!awaited.length) return missing;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const defined = Promise.all(awaited.map((tag) => registry.whenDefined(tag)));
  await Promise.race([
    defined,
    new Promise<void>((resolve) => {
      timer = setTimeout(resolve, wait);
    }).then(idle),
  ]).catch(() => undefined);
  if (timer !== undefined) clearTimeout(timer);
  return missing.filter((tag) => !registry.get(tag));
}

/*
 * Hearing that elements a card found missing have turned up. One wait per element for the
 * whole page, shared by every card listening for it: a wait of each card's own, made again
 * on every build, held on to the card and what it built for as long as the element stayed
 * away - for good, when it was never installed. A card stops listening when it leaves the
 * page or builds something else, and nothing of it is kept.
 */
type ElementRegistry = Pick<CustomElementRegistry, 'get' | 'whenDefined'>;

interface Waiter {
  remaining: Set<string>;
  listener: () => void;
}

const WAITERS = new WeakMap<object, Map<string, Set<Waiter>>>();

function waitersOf(registry: ElementRegistry): Map<string, Set<Waiter>> {
  let byTag = WAITERS.get(registry);
  if (!byTag) WAITERS.set(registry, (byTag = new Map()));
  return byTag;
}

/**
 * Calls `listener` once, when every one of `tags` is defined. Returns a way to stop
 * listening. A tag that can never be an element's is never defined, so the listener is
 * never called for a list holding one.
 */
export function whenElementsDefined(
  tags: string[],
  listener: () => void,
  registry: ElementRegistry = customElements,
): () => void {
  if (!tags.length || !tags.every(isElementName)) return () => undefined;
  const byTag = waitersOf(registry);
  const waiter: Waiter = { remaining: new Set(tags), listener };
  for (const tag of waiter.remaining) {
    let waiting = byTag.get(tag);
    if (!waiting) {
      const set = new Set<Waiter>();
      waiting = set;
      byTag.set(tag, set);
      Promise.resolve(registry.whenDefined(tag))
        .then(() => {
          byTag.delete(tag);
          for (const each of set) {
            each.remaining.delete(tag);
            if (!each.remaining.size) each.listener();
          }
        })
        .catch(() => undefined);
    }
    waiting.add(waiter);
  }
  return () => {
    for (const tag of tags) byTag.get(tag)?.delete(waiter);
  };
}

/** How many listeners are waiting on one element, for the tests. */
export function listenersWaiting(tag: string, registry: ElementRegistry = customElements): number {
  return waitersOf(registry).get(tag)?.size ?? 0;
}
