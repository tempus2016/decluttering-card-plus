import { HomeAssistant, LovelaceConfig } from 'custom-card-helpers';
import { CommunityRisks } from '../community';
import { getLovelaceConfig, getLovelacePanel } from '../utils';
import { localize } from '../localize';
import {
  cardHelpers,
  editDialogOf,
  pageDashboard,
  rewriteDashboards,
  operationLabel,
  isDefinedHere,
  textField,
} from '../shared';
import { itemTemplatesOf } from '../templates';
import { UndoEntry, dashboardKey } from '../undo';
import { THING_STUBS, redoingRewrites } from './pure';

// The one-line text input and the element check live in shared.ts (idea 55 moved them); re-exported for the tabs.
export { isDefinedHere, textField };
export type { TextFieldOptions } from '../shared';

// The starter body of each kind of template lives with the editor's other decisions (pure.ts); re-exported for the editor.
export { THING_STUBS };

// How many sets of similar cards the Where used tab offers, and how many cards of each it
// names - enough to recognise the set, few enough that a big dashboard does not fill the dialog.
export const SIMILAR_SHOWN = 10;

export const SIMILAR_MEMBERS_SHOWN = 8;

// How many places a value search lists in each group before it stops.
export const SEARCH_SHOWN = 50;

/** Whether a risk scan found anything worth a sentence. */
export const anyRisk = (risks: CommunityRisks): boolean =>
  risks.actions.length > 0 ||
  risks.urls.length > 0 ||
  risks.embeds ||
  risks.scripts ||
  risks.placeholders ||
  risks.overlay;

/** What `latest` would let a post do that `installed` already does not: the risks that are new with this version. */
export function newRisks(latest: CommunityRisks, installed: CommunityRisks): CommunityRisks {
  return {
    actions: latest.actions.filter((each) => !installed.actions.includes(each)),
    urls: latest.urls.filter((each) => !installed.urls.includes(each)),
    embeds: latest.embeds && !installed.embeds,
    scripts: latest.scripts && !installed.scripts,
    placeholders: latest.placeholders && !installed.placeholders,
    overlay: latest.overlay && !installed.overlay,
  };
}

// The second press of a two-press button has to be a second decision, not the other half
// of a double-click: a press this soon after the first is the same press.
export const SECOND_PRESS_MS = 500;

// mdi:drag, the handle a list that can be dragged into order shows on each item.
export const DRAG_PATH =
  'M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z';

export async function loadRowEditor(): Promise<void> {
  // Ensure hui-row-element-editor are loaded.
  // They happen to be used by the vertical-stack card editor but there must be a better way?
  let cls = customElements.get('hui-entities-card');
  if (!cls) {
    if (!cardHelpers()) return;
    (await cardHelpers()).createCardElement({ type: 'entities', entities: [] });
    await customElements.whenDefined('hui-entities-card');
    cls = customElements.get('hui-entities-card');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (cls && (cls as any).getConfigElement) await (cls as any).getConfigElement();
}

/** What every tool that rewrites the dashboard needs of the element it runs in. */
export interface ToolHost {
  hass?: HomeAssistant;
  _toolError?: string;
  _busy: boolean;
  _undoChanged?: string[];
}

/*
 * The dashboard as it is saved now. The dialog's `lovelace` is the copy it was opened
 * with, and every tool here saves the dashboard while the dialog stays open - read from
 * that copy, Where used said nothing used a template just renamed, and the health panel
 * kept offering to make a template of cards already made into one. The page's copy is
 * the one a save through the page replaces; the dialog's is for where there is no page.
 */
export function savedLovelace(dialogCopy: LovelaceConfig | null | undefined): LovelaceConfig | null | undefined {
  return getLovelacePanel()?.config ?? dialogCopy ?? getLovelaceConfig();
}

/*
 * Where a `position: fixed` box at 0,0 really sits. A dialog that is transformed becomes what
 * fixed positions are measured from, so a box placed at a viewport position lands off to the
 * side by the dialog's own offset; `probe` is such a box, and this is that offset to take off.
 */
export function fixedOffset(probe: Element | null | undefined): { dx: number; dy: number } {
  const origin = probe?.getBoundingClientRect();
  return { dx: origin?.left ?? 0, dy: origin?.top ?? 0 };
}

/*
 * Something that is a different object whenever what the dashboard borrows has been read
 * again - the library dashboard, another dashboard's templates - for the editor to keep its
 * answers by, beside the dashboard itself: a template resolved before the library arrived
 * is not the template once it has. The item templates are kept by exactly that, so the
 * object they come back as serves.
 */
export function borrowedEpoch(ll: LovelaceConfig | null | undefined): unknown {
  return ll ? itemTemplatesOf(ll) : undefined;
}

/** The address of the dashboard on the page, as a link to one of its views starts: `/lovelace`. */
export function dashboardHref(): string {
  return document.location.pathname.split('/').slice(0, 2).join('/');
}

type DashboardChange = { urlPath: string; build: (config: any) => unknown }; // eslint-disable-line @typescript-eslint/no-explicit-any

/*
 * The edit dialog for a card being added saves it into the dashboard as the dialog first had
 * it, which would take back whatever a tool here has just saved - the card editor's installs
 * guard against the same thing. The dialog's save is wrapped to make the rewrite again (see
 * redoingRewrites), and the copy older dialogs build from is brought up to date.
 */
export function keepOnDialogSave(host: HTMLElement, rewrite: (config: unknown) => unknown, before: unknown): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = (editDialogOf(host) as any)?._params as Record<string, any> | undefined;
  if (!params) return;
  // The dashboard as the dialog first had it, which is what a card being added is saved into;
  // where the dialog does not say, the dashboard as it was read just before the rewrite.
  const opened = params.lovelaceConfig ?? before;
  const panel = getLovelacePanel();
  if (panel?.config && params.lovelaceConfig) params.lovelaceConfig = panel.config;
  if (typeof params.saveCardConfig !== 'function') return;
  params.saveCardConfig = redoingRewrites(params.saveCardConfig, rewrite, () => getLovelacePanel(), opened);
}

/*
 * Every rewrite the editor's tools make goes through here: saved so it can be undone (see
 * rewriteDashboards), and - for the dashboard on the page - kept when the dialog saves.
 * Gives back what was written, or nothing when the rewrite left every dashboard as it was.
 */
export async function rewriteAndKeep(
  host: HTMLElement,
  hass: HomeAssistant | undefined,
  operation: string,
  changes: DashboardChange[],
  dialog?: unknown,
): Promise<UndoEntry | undefined> {
  const entry = await rewriteDashboards(host, hass, operation, changes, dialog);
  const own = pageDashboard();
  const written = entry?.dashboards.find((each) => dashboardKey(each.urlPath) === own);
  if (written) {
    for (const change of changes) {
      if (dashboardKey(change.urlPath) === own) keepOnDialogSave(host, change.build, written.before);
    }
  }
  return entry;
}

/** How a tool's save went: written, nothing to write (the dashboard was already so), or not saved. */
export type SaveOutcome = 'saved' | 'unchanged' | false;

/*
 * Saves the dashboard through the one place every rewrite goes, so it can be undone, and
 * says on the host what went wrong when it could not. Shared by the three tabs of the editor.
 * A rewrite that changed nothing saves nothing and is not announced as a save: `unchanged`
 * comes back, for a tool that has to say its target was no longer there.
 */
export async function saveDashboardWith(
  host: ToolHost & HTMLElement,
  build: (config: unknown) => unknown,
  operation: string,
  dialog?: unknown,
): Promise<SaveOutcome> {
  const panel = getLovelacePanel();
  if (!panel) {
    host._toolError = localize('tools.cannot_save_here', undefined, host.hass);
    return false;
  }
  host._busy = true;
  host._toolError = undefined;
  try {
    // Through the one place every rewrite goes, so it can be undone.
    const entry = await rewriteAndKeep(host, host.hass, operation, [{ urlPath: pageDashboard(), build }], dialog);
    if (!entry) return 'unchanged';
    host._undoChanged = undefined;
    announce(host, localize('undo.toast', { operation: operationLabel(operation, host.hass) }, host.hass));
    return 'saved';
  } catch (err) {
    host._toolError = localize('tools.save_failed', { message: (err as Error)?.message ?? err }, host.hass);
    return false;
  } finally {
    host._busy = false;
  }
}

/** What the tab strip shows beside Where used and Share (idea 31). */
export interface TabCounts {
  usages: number;
  /** Cards leaving a required variable of this template unset. */
  unset: number;
  trash: number;
}

export function tabCounts(
  usages: number,
  unset: { template: string; count: number }[],
  trash: { name: string }[] | undefined,
  name: string,
): TabCounts {
  return {
    usages,
    unset: unset.filter((each) => each.template === name).reduce((sum, each) => sum + each.count, 0),
    trash: (trash ?? []).filter((each) => each.name === name).length,
  };
}

/**
 * Says something to a screen reader (idea 55). The tabs are elements of their own, so the
 * words travel up as an event and the editor's one live region speaks them.
 */
export function announce(host: HTMLElement, text: string): void {
  host.dispatchEvent(new CustomEvent('decluttering-announce', { detail: { text }, bubbles: true, composed: true }));
}
