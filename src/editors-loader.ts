/*
 * The editors, the health panel and the gallery ship in a chunk of their own that the add
 * and edit dialogs load through getConfigElement (idea 4). Anything else that shows one of
 * them - the chip's dialog for a root template, the health card's full panel - asks for the
 * chunk here first, once.
 *
 * A module of its own rather than a line in shared.ts: the test build compiles shared.ts
 * without the strict options, and tsc follows a dynamic import, so the editors would be
 * compiled there too and fail on the narrowing they rely on.
 */
let editorsLoading: Promise<void> | undefined;

export function loadEditors(): Promise<void> {
  editorsLoading ??= import('./editors').then(() => undefined);
  return editorsLoading;
}
