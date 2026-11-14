/*
 * #407: holding the edit dialog's preview back.
 *
 * Home Assistant's edit dialog hands its preview a new config on every edit, and this card
 * builds the card inside it afresh each time. Most cards shrug that off. A card that asks
 * a server for something does not: a camera card with a bad camera name asked Frigate for
 * a stream that was not there on every keystroke, each request logged an exception, and
 * the pile of them took Home Assistant down. The editor's own Rendered view builds a
 * second copy on top.
 *
 * So the card editor can pause both. While paused, a preview keeps the config it was last
 * handed and builds nothing until it is asked to - "Render now" builds it once, as it
 * stands, and the next edit holds it again. Only the edit dialog is affected: the pause
 * means nothing while no card editor is open, so a dashboard behind the dialog, or one
 * opened afterwards, builds as it always has. The one exception is the dialog's first
 * preview, which Home Assistant builds before the editor beside it is on the page: a card
 * in an open dialog that no editor has yet come to counts as previewed (see the card).
 *
 * The state lives for the page, not the dialog, so someone working through a broken card
 * can close and reopen the dialog without the first preview firing the request again.
 */

export type PreviewHoldEvent = 'changed' | 'render';
type Listener = (event: PreviewHoldEvent) => void;

const listeners = new Set<Listener>();
let paused = false;
let editors = 0;
let openings = 0;
// How long the build took that switched the pause on by itself (#456), while that pause holds.
let slowMs: number | undefined;

/*
 * #456: a build this slow, with a card editor open, switches the pause on by itself. Every
 * edit builds the preview again, so a card that takes seconds to build leaves the editor
 * waiting on each keystroke, whether the template is heavy or something has gone wrong.
 * Long enough that an ordinary card never comes near it.
 */
export const SLOW_PREVIEW_MS = 1500;

function tell(event: PreviewHoldEvent): void {
  for (const listener of [...listeners]) listener(event);
}

/** Whether the pause is switched on, whether or not an editor is open to apply it to. */
export function previewPauseOn(): boolean {
  return paused;
}

/** Whether previews are held right now: switched on, and a card editor open. */
export function previewPaused(): boolean {
  return paused && editors > 0;
}

/** Whether a card editor is open, which is the only time a preview is held for anything. */
export function previewEditorOpen(): boolean {
  return editors > 0;
}

/** A card editor coming onto the page. The returned function says it has gone, once. */
export function previewEditorOpened(): () => void {
  editors += 1;
  openings += 1;
  if (paused && editors === 1) tell('changed');
  let gone = false;
  return (): void => {
    if (gone) return;
    gone = true;
    editors -= 1;
    if (paused && editors === 0) tell('changed');
  };
}

/*
 * How many card editors have come onto the page so far. A preview compares it with the
 * count when it was made, to tell an editor still to come from one that has been and gone.
 */
export function previewEditorOpenings(): number {
  return openings;
}

export function setPreviewPaused(value: boolean): void {
  if (paused === value) return;
  paused = value;
  slowMs = undefined;
  tell('changed');
}

/**
 * A preview build and how long it took. One slow enough, with a card editor open and the
 * pause not already on, switches the pause on and says why. Told after this turn rather than
 * at once, as builds happen while the editor and card are drawing themselves.
 */
export function notePreviewBuild(ms: number): void {
  if (paused || editors === 0 || !(ms >= SLOW_PREVIEW_MS)) return;
  paused = true;
  slowMs = Math.round(ms);
  queueMicrotask(() => tell('changed'));
}

/** How long the build took that paused the preview by itself, while that pause is on (#456). */
export function previewSlowPause(): number | undefined {
  return paused ? slowMs : undefined;
}

/** Builds every held preview once, with the config it has now. */
export function renderPreviewNow(): void {
  tell('render');
}

export function onPreviewHold(listener: Listener): () => void {
  listeners.add(listener);
  return (): void => {
    listeners.delete(listener);
  };
}

/** For tests: back to how a page starts. */
export function resetPreviewHold(): void {
  listeners.clear();
  paused = false;
  editors = 0;
  openings = 0;
  slowMs = undefined;
}

/**
 * The template's required variables this build left without a value. A preview waits for
 * them rather than handing the card inside a config it cannot use.
 */
export function requiredUnset(declarations: { name: string; required?: boolean }[], unresolved: string[]): string[] {
  const missing = new Set(unresolved);
  return declarations.filter((each) => each.required === true && missing.has(each.name)).map((each) => each.name);
}
