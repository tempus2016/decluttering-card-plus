/*
 * Which tab the next template editor opens on. The edit-mode chip's "Where used" (idea 47)
 * opens the same editor as "Edit template", through Home Assistant's own dialog for a template
 * card, so it cannot hand the editor a property; it leaves the tab here instead, and the editor
 * takes it - once - when it connects. A request nobody takes within a few seconds lapses, so a
 * later, unrelated editor still opens on Settings.
 */
let pending: { tab: string; at: number } | undefined;
const LAPSE_MS = 5000;

export function requestInitialTab(tab: string): void {
  pending = { tab, at: Date.now() };
}

export function takeInitialTab(now = Date.now()): string | undefined {
  const request = pending;
  pending = undefined;
  if (!request || now - request.at > LAPSE_MS) return undefined;
  return request.tab;
}
