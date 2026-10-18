import { CONSUMER_TYPES, GROUP_CARD_TYPE, LEGACY_TEMPLATE_TYPE, TEMPLATE_TYPE } from './templates';

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

/**
 * The ones of these elements still not defined after waiting a moment for them, the way
 * Home Assistant waits before showing "Custom element doesn't exist": a card's resource can
 * finish loading after the dashboard has started drawing.
 */
export async function undefinedElements(
  tags: string[],
  wait = 2000,
  registry: Pick<CustomElementRegistry, 'get' | 'whenDefined'> = customElements,
): Promise<string[]> {
  const missing = tags.filter((tag) => !registry.get(tag));
  if (!missing.length) return [];
  let timer: ReturnType<typeof setTimeout> | undefined;
  await Promise.race([
    Promise.all(missing.map((tag) => registry.whenDefined(tag))),
    new Promise<void>((resolve) => {
      timer = setTimeout(resolve, wait);
    }),
  ]);
  if (timer !== undefined) clearTimeout(timer);
  return missing.filter((tag) => !registry.get(tag));
}
