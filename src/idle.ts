/*
 * Building a card in idle time (idea 10). Every decluttering card used to build in
 * setConfig, before any of them painted, so a view of fourteen showed nothing until the
 * fourteenth was done. A card that is off the screen when the page lays out can wait: it
 * builds in idle time once the visible ones have painted, and is there by the time the page
 * is scrolled. The total work is the same; it is moved behind the first paint.
 *
 * Nothing waits inside the edit dialog or a preview, where the build is the point, nor for
 * `debug:` and the report, nor for a group - the section lays a group out a card at a time
 * and would be told the wrong size - nor for a card that has built before: a rebuild on a
 * section move or a state change is immediate.
 */

import { DeclutteringCardConfig } from './types';

export interface DeferState {
  /** Inside Home Assistant's edit dialog. */
  inDialog: boolean;
  /** Home Assistant says the card is a preview. */
  preview: boolean;
  /** The card has built once already. */
  builtBefore: boolean;
  /** The template builds a group of cards, laid out by the section itself. */
  group: boolean;
  /** Whether the page can wait a frame and measure, which a test or a server render cannot. */
  canObserve: boolean;
}

/** Whether the first build of this card may wait for idle time. */
export function shouldDefer(config: DeclutteringCardConfig, state: DeferState): boolean {
  if (!state.canObserve) return false;
  if (state.inDialog || state.preview || state.builtBefore || state.group) return false;
  // Debugging, tracing and the report exist to show the build; make them wait for nothing.
  if (config.debug !== undefined && config.debug !== false) return false;
  return true;
}

// How long an off-screen card may wait at most before it builds whatever the browser is doing.
export const IDLE_TIMEOUT_MS = 2000;

type IdleWindow = typeof globalThis & {
  requestIdleCallback?: (fn: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Runs the function when the browser is idle, or after the timeout at the latest. Where
 * requestIdleCallback is missing - Safari until recently - a zero timer stands in, which
 * still lets the current paint finish first. Returns a way to cancel.
 */
export function whenIdle(fn: () => void, timeoutMs = IDLE_TIMEOUT_MS): () => void {
  const win = globalThis as IdleWindow;
  if (typeof win.requestIdleCallback === 'function') {
    const id = win.requestIdleCallback(fn, { timeout: timeoutMs });
    return () => win.cancelIdleCallback?.(id);
  }
  const timer = setTimeout(fn, 0);
  return () => clearTimeout(timer);
}

/**
 * Whether the element is on screen or within a screen's height of it: true, false, or
 * undefined while nothing can be measured yet. A card has no height of its own until it
 * builds, so when it measures nothing the box that holds it - the grid cell Home Assistant
 * laid out for it - says where it is. A box with no size at the top left corner is a card
 * that has not been placed yet - a masonry view sizes its cards before it puts them in
 * columns - and says nothing about where the card will end up.
 */
export function measureNearScreen(element: Element): boolean | undefined {
  let rect = element.getBoundingClientRect();
  if (rect.height === 0 && element.parentElement) rect = element.parentElement.getBoundingClientRect();
  if (rect.height === 0 && rect.top === 0) return undefined;
  const screen = typeof innerHeight === 'number' ? innerHeight : 0;
  return rect.bottom >= -screen && rect.top <= screen * 2;
}

/** As measureNearScreen, with anything that cannot be measured counting as near - the worst case is a card built straight away, never one left unbuilt. */
export function isNearScreen(element: Element): boolean {
  return measureNearScreen(element) ?? true;
}

// How many frames an unplaced card is measured again before it is built regardless.
export const PLACEMENT_FRAMES = 12;

/**
 * Tells once whether the element is near the screen, two frames after being asked - the
 * section applies the card's grid size a frame after the card lands, and asked at once every
 * cell is still collapsed at the top of the page and everything looks visible. A card that
 * still has no place after that is measured again frame by frame, for a bounded while, and
 * then built regardless. Returns a way to stop listening.
 */
export function whenVisible(element: Element, tell: (visible: boolean) => void): () => void {
  if (typeof requestAnimationFrame === 'undefined') {
    tell(true);
    return () => undefined;
  }
  let stopped = false;
  const settle = (frames: number, unplaced: number): void => {
    if (stopped) return;
    if (frames > 0) {
      requestAnimationFrame(() => settle(frames - 1, unplaced));
      return;
    }
    const near = measureNearScreen(element);
    if (near === undefined && unplaced > 0) {
      requestAnimationFrame(() => settle(0, unplaced - 1));
      return;
    }
    tell(near ?? true);
  };
  settle(2, PLACEMENT_FRAMES);
  return () => {
    stopped = true;
  };
}
