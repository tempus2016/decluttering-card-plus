import { CONSUMER_TYPES } from './templates';
import { localize } from './localize';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * A template that uses itself - directly, or through another template that uses it back -
 * has no natural end. Every level builds the next one while it is still detached from the
 * page, so nothing in the layout ever gets a chance to stop it, and the tab becomes
 * unresponsive rather than showing an error.
 *
 * A card therefore tells the cards it builds which templates are already open above them.
 * A name that is already in that list is a loop, and is refused with a message naming the
 * whole path rather than being drawn.
 */

/** The key a card uses to tell the cards inside it which templates are already open. */
export const CHAIN_KEY = 'decluttering_open_templates';

/**
 * How deep templates may nest before it is treated as a runaway rather than a design.
 * Well past anything anyone builds on purpose - the deepest thing in the wiki is three -
 * so it only ever catches a loop that somehow got past the name check.
 */
export const MAX_NESTING = 25;

/** The templates open above a card, as read off the config it was given. */
export function chainOf(config: any): string[] {
  const chain = config?.[CHAIN_KEY];
  return Array.isArray(chain) ? chain.filter((name) => typeof name === 'string') : [];
}

/** The chain to hand to the cards inside a card that is itself rendering `name`. */
export function chainWith(chain: string[] | undefined, name: string | undefined): string[] {
  const open = chain ?? [];
  return typeof name === 'string' && name ? [...open, name] : [...open];
}

/**
 * The loop that rendering `name` here would enter, from where it starts to where it comes
 * back round, or undefined when there is none.
 */
export function findCycle(chain: string[] | undefined, name: string | undefined): string[] | undefined {
  if (typeof name !== 'string' || !name) return undefined;
  const open = chain ?? [];
  const at = open.indexOf(name);
  return at === -1 ? undefined : [...open.slice(at), name];
}

/** What to tell somebody about a loop: the path round it, and what to do. */
export function describeCycle(cycle: string[]): string {
  const path = cycle.join(' → ');
  return cycle.length === 2
    ? localize('error.cycle_self', { first: cycle[0], path })
    : localize('error.cycle_loop', { path });
}

/** What to tell somebody about nesting that never loops but never stops either. */
export function describeTooDeep(chain: string[]): string {
  return localize('error.too_deep', { max: MAX_NESTING, start: chain.slice(0, 3).join(' → ') });
}

/** Whether anything in here is a card that would need telling. */
function holdsConsumer(node: any): boolean {
  if (Array.isArray(node)) return node.some(holdsConsumer);
  if (!node || typeof node !== 'object') return false;
  if (typeof node.type === 'string' && CONSUMER_TYPES.includes(node.type)) return true;
  return Object.values(node).some(holdsConsumer);
}

/**
 * The same configuration, with every card inside it told which templates are open above.
 *
 * A copy, never the original: with no variables to substitute there is nothing to rewrite,
 * so what a card is built from can be the template's own object - and writing onto that
 * would put this key in the template itself, and from there into whatever the editor saves
 * next. Only configurations that actually hold one of our cards are copied, which is few.
 */
export function withChain<T>(config: T, chain: string[]): T {
  if (!holdsConsumer(config)) return config;

  const copy = JSON.parse(JSON.stringify(config));
  const walk = (node: any): void => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (!node || typeof node !== 'object') return;
    if (typeof node.type === 'string' && CONSUMER_TYPES.includes(node.type)) {
      node[CHAIN_KEY] = chain;
      // Its own content is built from its template, not from here, so there is nothing
      // below it for this pass to reach.
      return;
    }
    Object.values(node).forEach(walk);
  };
  walk(copy);
  return copy;
}
