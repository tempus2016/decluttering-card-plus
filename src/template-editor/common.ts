import { html, TemplateResult } from 'lit';
import { HomeAssistant } from 'custom-card-helpers';
import { CommunityRisks } from '../community';
import { getLovelacePanel } from '../utils';
import { localize } from '../localize';
import { HELPERS, pageDashboard, rewriteDashboards } from '../shared';

// What a template of each kind starts out as, when its type is chosen in the editor. One
// of these is kept and the rest removed, so switching the type swaps the body for a
// starter of the new kind - and leaves an existing body of the chosen kind alone.
export const THING_STUBS: Record<string, unknown> = {
  card: { type: 'entity', entity: 'sun.sun' },
  badge: { type: 'entity', entity: 'sun.sun' },
  row: { entity: 'sun.sun' },
  element: { type: 'icon', icon: 'mdi:weather-sunny', style: { color: 'yellow' } },
};

// How many sets of similar cards the Where used tab offers, and how many cards of each it
// names - enough to recognise the set, few enough that a big dashboard does not fill the dialog.
export const SIMILAR_SHOWN = 10;

export const SIMILAR_MEMBERS_SHOWN = 8;

// How many places a value search lists in each group before it stops.
export const SEARCH_SHOWN = 50;

/**
 * Splits a translated sentence at the one part that has to be rendered as markup - a
 * link, a `<code>` - so the words either side stay in the translator's order.
 */
// Whether this browser has a custom card's element, which is what decides if it will render.
export const isDefinedHere = (tag: string): boolean => !!customElements.get(tag);

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

export interface TextFieldOptions {
  label: string;
  value: string;
  disabled?: boolean;
  onInput: (value: string) => void;
  onKeydown?: (ev: KeyboardEvent) => void;
}

/*
 * A one-line text input. Home Assistant 2026.7 stopped registering ha-textfield and draws
 * its inputs with ha-input instead; an unregistered element is an empty inline box, so
 * every name field in the editors simply vanished, with nothing in the console. The
 * card still supports Home Assistants that only have ha-textfield, so this asks which one
 * the page has each time it draws. Both take `value`, `label` and `disabled`, and both send
 * `input` with the element as the target, so the rest is the same either way.
 */
export function textField(options: TextFieldOptions): TemplateResult {
  const changed = (ev: Event): void => options.onInput((ev.target as HTMLInputElement).value ?? '');
  const keydown = (ev: KeyboardEvent): void => options.onKeydown?.(ev);
  return isDefinedHere('ha-input')
    ? html`<ha-input
        label=${options.label}
        .value=${options.value}
        .disabled=${options.disabled === true}
        @input=${changed}
        @keydown=${keydown}
      ></ha-input>`
    : html`<ha-textfield
        label=${options.label}
        .value=${options.value}
        .disabled=${options.disabled === true}
        @input=${changed}
        @keydown=${keydown}
      ></ha-textfield>`;
}

export async function loadRowEditor(): Promise<void> {
  // Ensure hui-row-element-editor are loaded.
  // They happen to be used by the vertical-stack card editor but there must be a better way?
  let cls = customElements.get('hui-entities-card');
  if (!cls) {
    if (!HELPERS) return;
    (await HELPERS).createCardElement({ type: 'entities', entities: [] });
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
 * Saves the dashboard through the one place every rewrite goes, so it can be undone, and
 * says on the host what went wrong when it could not. Shared by the three tabs of the editor.
 */
export async function saveDashboardWith(
  host: ToolHost & HTMLElement,
  build: (config: unknown) => unknown,
  operation: string,
  dialog?: unknown,
): Promise<boolean> {
  const panel = getLovelacePanel();
  if (!panel) {
    host._toolError = localize('tools.cannot_save_here', undefined, host.hass);
    return false;
  }
  host._busy = true;
  host._toolError = undefined;
  try {
    // Through the one place every rewrite goes, so it can be undone.
    await rewriteDashboards(host, host.hass, operation, [{ urlPath: pageDashboard(), build }], dialog);
    host._undoChanged = undefined;
    return true;
  } catch (err) {
    host._toolError = localize('tools.save_failed', { message: (err as Error)?.message ?? err }, host.hass);
    return false;
  } finally {
    host._busy = false;
  }
}
