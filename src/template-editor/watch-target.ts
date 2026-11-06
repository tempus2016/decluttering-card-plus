/*
 * Watching Home Assistant's card editor for the fields it draws (ideas 24, 25, 27).
 *
 * The editor element is handed over before it is upgraded - hui-card-element-editor is
 * lazily defined - so at that moment it has no shadow root, and an observer put on the
 * element itself watches the light DOM for ever while everything happens in the shadow.
 * Its fields also sit behind further shadow roots (the card's own editor, ha-form) that a
 * subtree observer on the outer root never sees into, and they render a frame or two after
 * the mutation that announces them. So: wait for the element to be defined and to have
 * rendered, observe its shadow root once it has one, and after every mutation look again a
 * few times over the next second, so what rendered late is still found.
 */

const LOOK_AGAIN_MS = [0, 100, 300, 1000, 2500];

/**
 * Calls `look` whenever the editor's content may have changed, now and shortly after; returns
 * what to call to stop. `look` is also called on a schedule right after `target` upgrades.
 */
export function watchTarget(target: Element, look: () => void): () => void {
  let stopped = false;
  let observer: MutationObserver | undefined;
  const timers = new Set<ReturnType<typeof setTimeout>>();

  const lookAgain = (): void => {
    for (const timer of timers) clearTimeout(timer);
    timers.clear();
    for (const delay of LOOK_AGAIN_MS) {
      const timer = setTimeout(() => {
        timers.delete(timer);
        if (!stopped) look();
      }, delay);
      timers.add(timer);
    }
  };

  const observe = (): void => {
    if (stopped) return;
    const root = target.shadowRoot;
    observer?.disconnect();
    observer = new MutationObserver(lookAgain);
    observer.observe(root ?? target, { childList: true, subtree: true, attributes: true });
    lookAgain();
    // Not upgraded yet: come back once it is, and move the observer into the shadow root.
    if (!root) {
      const name = target.localName;
      const upgraded =
        name.includes('-') && typeof customElements !== 'undefined'
          ? customElements.whenDefined(name)
          : Promise.resolve();
      void upgraded
        .then(() => (target as Element & { updateComplete?: Promise<unknown> }).updateComplete)
        .then(() => {
          if (!stopped && target.shadowRoot) observe();
        })
        .catch(() => undefined);
    }
  };

  observe();
  return (): void => {
    stopped = true;
    observer?.disconnect();
    observer = undefined;
    for (const timer of timers) clearTimeout(timer);
    timers.clear();
  };
}
