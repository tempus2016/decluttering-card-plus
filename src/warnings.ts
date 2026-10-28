/*
 * How many times this module has been evaluated on the page: once, unless the bundle is
 * loaded under two URLs (the entry with a query string and a chunk importing it without),
 * which is what idea 4's chunking must never do again. The browser suite reads it.
 */
declare global {
  interface Window {
    __dcpModuleLoads?: number;
  }
}
if (typeof window !== 'undefined') window.__dcpModuleLoads = (window.__dcpModuleLoads ?? 0) + 1;

/*
 * One log of everything the card warns about, fed by every place that used to call
 * console.warn on its own (idea 9). The console still gets the same words in the same
 * order - nothing about when something is said changes here; each call site keeps its own
 * "once per config" or "once per template" rule - but the health panel and the debug
 * report can now read the same list instead of walking the dashboard again, and a listener
 * can be told as each one lands.
 *
 * Kept for the current page load and capped, so a card rebuilding on a busy sensor all day
 * cannot grow it without end.
 */

export type WarningKind =
  | 'unset'
  | 'refused'
  | 'unread'
  | 'missing_template'
  | 'deprecated'
  | 'many_copies'
  | 'state_unlisted'
  | 'override_misplaced'
  | 'rebuild_on'
  | 'on_error'
  | 'other';

export interface Warning {
  kind: WarningKind;
  /** The words, exactly as the console was given them. */
  message: string;
  /** The template the warning is about, when there is one. */
  template?: string;
  /** The card's `name:`, when the card has one. */
  card?: string;
  /** The variable the warning is about, when there is one. */
  variable?: string;
  /** The placeholder step the warning is about, when there is one. */
  step?: string;
  /** The debug expansion this was said while building, when it was said during one. */
  expansion?: string;
  /** When it was said, in milliseconds since the page loaded. */
  at: number;
}

export type WarningFilter = Partial<Pick<Warning, 'kind' | 'template' | 'card' | 'expansion'>>;

/** How many are kept; the oldest go first once it is full. */
export const WARNINGS_KEPT = 500;

const log: Warning[] = [];
const listeners = new Set<(warning: Warning) => void>();

function now(): number {
  return typeof performance !== 'undefined' && typeof performance.now === 'function' ? performance.now() : Date.now();
}

/** Says `message` in the console and keeps it, with what it is about, for whoever asks. */
export function warn(warning: Omit<Warning, 'at'>): void {
  const entry: Warning = { ...warning, at: now() };
  log.push(entry);
  if (log.length > WARNINGS_KEPT) log.splice(0, log.length - WARNINGS_KEPT);
  console.warn(entry.message);
  for (const listener of listeners) {
    try {
      listener(entry);
    } catch {
      // A listener that throws must not stop the others, or the warning.
    }
  }
}

/** What has been said this page load, oldest first, narrowed by whatever the filter names. */
export function warnings(filter?: WarningFilter): Warning[] {
  if (!filter) return [...log];
  return log.filter((entry) =>
    (Object.keys(filter) as (keyof WarningFilter)[]).every(
      (key) => filter[key] === undefined || entry[key] === filter[key],
    ),
  );
}

/** Told each warning as it is said. Returns what stops the telling. */
export function onWarning(listener: (warning: Warning) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Forgets everything said so far. For tests. */
export function resetWarnings(): void {
  log.length = 0;
}
