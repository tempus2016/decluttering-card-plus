/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * #463: a card the template built that refused its config. Home Assistant puts its own error
 * card in that card's place - `hui-error-card`, or `hui-error-badge` for a badge - and the
 * error card only says what was wrong while the dashboard is being edited. Outside edit mode
 * it reads "Configuration error" and nothing more, and this card never knew anything had
 * gone wrong: the build that produced the config had worked.
 *
 * So once the card it built is on the page, the card looks through it for those error cards
 * and reads what each one was told. The error card keeps it in its config: `message` since
 * Home Assistant 2025, `error` before that and still on badges.
 */

/** The tags Home Assistant shows in place of a card or a badge that refused its config. */
export const ERROR_TAGS = ['hui-error-card', 'hui-error-badge'];

/** What one card that refused its config said, and what type of card it was meant to be. */
export interface CardError {
  /** The `type:` of the card that refused, when it can be told. */
  type?: string;
  message: string;
}

/** The key that shows a refused card's message outside edit mode too. */
export const SHOW_CARD_ERRORS_KEY = 'show_card_errors';

/** Whether the card or its template asks for refused cards to say why outside edit mode; the card's word wins. */
export function showCardErrors(card: unknown, template: unknown): boolean {
  for (const source of [card, template]) {
    const written = (source as any)?.[SHOW_CARD_ERRORS_KEY];
    if (typeof written === 'boolean') return written;
  }
  return false;
}

// How many elements one look goes through at most: a card holding a whole dashboard's worth
// of cards is still read in well under a millisecond, and nothing can make it run away.
const MOST_ELEMENTS = 5000;

/*
 * Waiting for a custom card that has not loaded yet, Home Assistant puts an error card in
 * its place, hidden, and swaps it for the card once it arrives. That one is not an error yet.
 */
function stillWaiting(element: any): boolean {
  return element?.style?.display?.toLowerCase?.() === 'none';
}

/** What an error card was told, or undefined for an element that is not one or says nothing. */
export function errorOf(element: any): CardError | undefined {
  if (!element || !ERROR_TAGS.includes(String(element.localName ?? '').toLowerCase())) return undefined;
  const config = element._config ?? element.config;
  const said = config?.message ?? config?.error;
  if (typeof said !== 'string' || !said.trim()) return undefined;
  // The hui-card or hui-badge around it holds the config that was refused.
  const type = element.parentElement?.config?.type ?? config?.origConfig?.type;
  return { ...(typeof type === 'string' && type ? { type } : {}), message: said.trim() };
}

/**
 * Every error card in `root` and under it - through shadow roots, and into the card a
 * hui-card holds while it is hidden and so not on the page - with what each says.
 */
export function findCardErrors(root: unknown): { element: any; error: CardError }[] {
  const found: { element: any; error: CardError }[] = [];
  if (!root) return found;
  const seen = new Set<unknown>();
  // Depth first, so the errors come in the order the cards are on the page.
  const stack: any[] = [root];
  while (stack.length && seen.size < MOST_ELEMENTS) {
    const element = stack.pop();
    if (!element || typeof element !== 'object' || seen.has(element)) continue;
    seen.add(element);
    const error = errorOf(element);
    if (error) {
      if (!stillWaiting(element)) found.push({ element, error });
      continue;
    }
    const next: unknown[] = [];
    const held = element._element;
    if (held && typeof held === 'object') next.push(held);
    next.push(...Array.from((element.children ?? []) as ArrayLike<unknown>));
    const shadow = element.shadowRoot;
    if (shadow) next.push(...Array.from((shadow.children ?? []) as ArrayLike<unknown>));
    for (let i = next.length - 1; i >= 0; i--) stack.push(next[i]);
  }
  return found;
}

/** Two lists of errors that say the same, in the same order. */
export function sameErrors(a: CardError[], b: CardError[]): boolean {
  return a.length === b.length && a.every((each, i) => each.type === b[i].type && each.message === b[i].message);
}

/** One error as a line: the card's type, then what it said. */
export function errorLine(error: CardError): string {
  return error.type ? `${error.type}: ${error.message}` : error.message;
}
