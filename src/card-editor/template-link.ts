import { LovelaceConfig } from 'custom-card-helpers';
import { isTemplateCardType } from '../templates';

/*
 * Idea 20: a card is often where you realise the template itself needs changing. The line
 * that says where the template lives gains a link that opens the template card's editor.
 * Home Assistant's edit dialog edits one card at a time, so the link closes this dialog
 * and opens that one; the card's unsaved changes are kept here and offered again on the
 * way back.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Where the template card sits, as the edit dialog addresses a card: `[view, card]` in a
 * masonry view, `[view, section, card]` in a sections view. Only a card straight in a view
 * or a section can be opened; one tidied away inside a stack has no address of its own.
 */
export function templateCardPath(ll: LovelaceConfig | null | undefined, template: string): number[] | undefined {
  const views = (ll as any)?.views;
  if (!Array.isArray(views)) return undefined;
  const defines = (card: any): boolean => !!card && isTemplateCardType(card.type) && card.template === template;
  for (let v = 0; v < views.length; v += 1) {
    const view = views[v] ?? {};
    const cards = Array.isArray(view.cards) ? view.cards : [];
    for (let c = 0; c < cards.length; c += 1) if (defines(cards[c])) return [v, c];
    const sections = Array.isArray(view.sections) ? view.sections : [];
    for (let s = 0; s < sections.length; s += 1) {
      const inSection = Array.isArray(sections[s]?.cards) ? sections[s].cards : [];
      for (let c = 0; c < inSection.length; c += 1) if (defines(inSection[c])) return [v, s, c];
    }
  }
  return undefined;
}

/** The card at a path templateCardPath gave: [view, card] or [view, section, card]. */
export function cardAtPath(ll: LovelaceConfig | null | undefined, path: number[]): Record<string, unknown> | undefined {
  const view = (ll as any)?.views?.[path[0]];
  if (!view) return undefined;
  const card = path.length === 3 ? view.sections?.[path[1]]?.cards?.[path[2]] : view.cards?.[path[1]];
  return card && typeof card === 'object' ? (card as Record<string, unknown>) : undefined;
}

export interface ReturnTicket {
  /** The card the dialog was editing, with its unsaved changes. */
  config: Record<string, unknown>;
  /** The card as the dashboard has it, to tell which dialog this belongs to. */
  openedWith?: Record<string, unknown>;
  /** The template that was opened in between. */
  template: string;
  at: number;
}

export const RETURN_KEY = 'decluttering-card-plus-return';

// A ticket older than this is stale: the dialog it was for is long gone.
const TICKET_LIFE = 30 * 60 * 1000;

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function storage(given?: StorageLike): StorageLike | undefined {
  if (given) return given;
  try {
    return typeof sessionStorage === 'undefined' ? undefined : sessionStorage;
  } catch {
    return undefined;
  }
}

/** Keeps the card's unsaved changes for the way back. */
export function stashReturn(ticket: Omit<ReturnTicket, 'at'>, store?: StorageLike, now = Date.now()): void {
  const target = storage(store);
  if (!target) return;
  try {
    target.setItem(RETURN_KEY, JSON.stringify({ ...ticket, at: now }));
  } catch {
    // Storage full or disabled: the link still works, the changes are simply not kept.
  }
}

/**
 * The ticket for a card being opened, if one was left for it: the same card as the
 * dashboard has it, and not too old. Taking it removes it, so it is offered once.
 */
export function takeReturn(openedWith: unknown, store?: StorageLike, now = Date.now()): ReturnTicket | undefined {
  const target = storage(store);
  if (!target) return undefined;
  let ticket: ReturnTicket | undefined;
  try {
    const raw = target.getItem(RETURN_KEY);
    ticket = raw ? (JSON.parse(raw) as ReturnTicket) : undefined;
  } catch {
    ticket = undefined;
  }
  if (!ticket) return undefined;
  if (now - ticket.at > TICKET_LIFE) {
    target.removeItem(RETURN_KEY);
    return undefined;
  }
  if (JSON.stringify(ticket.openedWith ?? null) !== JSON.stringify(openedWith ?? null)) return undefined;
  target.removeItem(RETURN_KEY);
  return ticket;
}

/** The address of a dashboard, from its url path; the default dashboard is `lovelace`. */
export function dashboardHref(urlPath: string): string {
  return `/${urlPath.replace(/^\/+/, '')}`;
}
