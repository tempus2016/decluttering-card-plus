import { html, TemplateResult } from 'lit';
import { HomeAssistant, fireEvent, LovelaceConfig } from 'custom-card-helpers';
import { TemplateConfig, VariablesConfig } from './types';
import { viewIndexFromPath } from './templates';
import { entitiesLeftOut, LeftOut, SourceContext } from './registry';
import { TemplateRender, templateList } from './template-source';
import { getDashboardPath, getLovelacePanel } from './utils';
import { localize } from './localize';
import { applyRewrite, dashboardKey, heldUndo, holdUndo, runUndo, Saver, UndoEntry, UndoOutcome } from './undo';
import { warn } from './warnings';

/**
 * Defines `tag`, unless something else already claimed it - either the original
 * decluttering-card, or a second copy of this bundle. Returns true if this bundle
 * ended up owning the tag. Used by register.ts for the cards and by editors.ts for the
 * editors, which arrive in a chunk of their own the first time an editor opens (idea 4).
 */
export function defineElement(tag: string, cls: CustomElementConstructor): boolean {
  if (customElements.get(tag)) {
    warn({ kind: 'other', message: localize('warn.tag_taken', { tag }) });
    return false;
  }
  customElements.define(tag, cls);
  return true;
}

// The Dashboard health panel both editors show.
export const HEALTH_TAG = 'decluttering-card-plus-health';

// The template gallery dialog the Share tab opens (idea 52).
export const GALLERY_TAG = 'decluttering-card-plus-gallery';

/*
 * Which view this card is being rendered in, read off the URL: the card only renders
 * while its view is showing. Outside a dashboard URL - an editor preview, say - there is
 * no view to speak of, and view-level defaults simply do not apply.
 */
export function currentViewIndex(ll: Parameters<typeof viewIndexFromPath>[0]): number | undefined {
  if (typeof window === 'undefined') return undefined;
  const segments = window.location.pathname.split('/').filter(Boolean);
  if (segments.length < 1) return undefined;
  return viewIndexFromPath(ll, segments[1]);
}

/** What a repeat source needs from the page beyond hass: the dashboard's views, for `views:`. */
export function sourceContext(ll: LovelaceConfig | null | undefined): SourceContext {
  return { views: (ll as { views?: unknown[] } | null | undefined)?.views, dashboard: getDashboardPath() };
}

/*
 * Says in the console why a `for_each_from: { template: }` repeats nothing - it failed, or
 * it rendered something that is not a list. Named by the start of the Jinja itself, which
 * is the one thing that tells a card's and a view strategy's apart.
 */
export function warnUnlisted(template: string, render: TemplateRender, hass?: HomeAssistant): void {
  const listed = templateList(render);
  if ('list' in listed) return;
  const source = template.length > 60 ? `${template.slice(0, 57)}...` : template;
  const key = listed.problem === 'error' ? 'warn.repeat_template_failed' : 'warn.repeat_template_not_list';
  warn({ kind: 'other', message: localize(key, { source, detail: listed.detail }, hass) });
}

/** The words a left-out count is said in (#452): `{count}`, `{which}` and `{fix}`. */
export function leftOutParams(left: LeftOut, hass?: HomeAssistant): Record<string, string | number> {
  const which = (['hidden', 'config', 'diagnostic'] as const)
    .filter((kind) => left[kind] > 0)
    .map((kind) => localize(`left_out.${kind}`, { count: left[kind] }, hass))
    .join(', ');
  return { count: left.total, which, fix: left.fix.join(', ') };
}

/*
 * Says in the console why an entity sweep built nothing when it did match entities, only
 * ones Home Assistant hides or files as config or diagnostic (#452). Without it the card is
 * just empty, and a pattern that matched looks like one that is broken.
 */
export function warnLeftOut(source: unknown, template: string | undefined, hass?: HomeAssistant): boolean {
  const left = entitiesLeftOut(hass, source);
  if (!left) return false;
  warn({
    kind: 'other',
    message: localize('warn.repeat_left_out', { ...leftOutParams(left, hass), template: template ?? '' }, hass),
    template,
  });
  return true;
}

/** The element's parent, stepping out of a shadow root to its host. */
export function parentOf(node: Node): Node | null {
  return node.parentNode instanceof ShadowRoot ? node.parentNode.host : node.parentNode;
}

/*
 * What a dashboard element has been placed as, read off the elements around it, looking up
 * through shadow roots: a badge in a view's row or in the badge picker, a row of an entities
 * card or an element of a picture-elements card, or a card. For when the config cannot
 * say - a template that was never found has no type to go by.
 */
export type Placement = 'badge' | 'row' | 'card';
const BADGE_PLACES = ['hui-badge', 'hui-badge-picker', 'hui-heading-badge'];
const ROW_PLACES = ['hui-entities-card', 'hui-picture-elements-card'];
export function placedAs(element: Element): Placement {
  let node = parentOf(element);
  while (node) {
    const tag = (node as Element).localName ?? '';
    if (BADGE_PLACES.includes(tag)) return 'badge';
    if (ROW_PLACES.includes(tag) || /^hui-.*-(entity-)?row$/.test(tag)) return 'row';
    if (tag === 'hui-card' || tag === 'hui-card-picker' || tag === 'hui-section') return 'card';
    node = parentOf(node);
  }
  return 'card';
}

/*
 * Where the card being edited sits, read off the edit dialog. Home Assistant 2026.7 hands
 * the dialog the dashboard, the card's config and - in a sections view - the section's
 * config, but no indices, so the section is found by being the same object in that
 * dashboard; the card, in a masonry view, the same way. Undefined when it cannot be told.
 */
export function dialogPlace(dialog: Element): { view?: number; section?: number } | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = (dialog as any)?._params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const views: any[] = params?.lovelaceConfig?.views ?? [];
  // Older Home Assistants handed the place itself: [view, card] or [view, section, card].
  const path = params?.path;
  if (Array.isArray(path) && Number.isInteger(path[0])) {
    return path.length > 2 && Number.isInteger(path[1]) ? { view: path[0], section: path[1] } : { view: path[0] };
  }
  for (let view = 0; view < views.length; view += 1) {
    if (params?.sectionConfig) {
      const section = (views[view]?.sections ?? []).indexOf(params.sectionConfig);
      if (section !== -1) return { view, section };
    } else if (params?.cardConfig && (views[view]?.cards ?? []).includes(params.cardConfig)) {
      return { view };
    }
  }
  return undefined;
}

/** The edit dialog an element is drawn in, if it is in one. */
export function editDialogOf(element: Element): Element | undefined {
  for (let node: Node | null = element; node; node = parentOf(node)) {
    if ((node as Element).localName === 'hui-dialog-edit-card') return node as Element;
  }
  return undefined;
}

/*
 * Whether an edit dialog is open on the page (#407). Home Assistant builds the dialog's
 * preview before the card is placed in it, so a card being configured cannot yet tell it is
 * in one - only that one is open. Dialogs live in the home-assistant element's shadow root;
 * the dialog stays there once closed, with no `_params`. A dialog that has no such field at
 * all (a future Home Assistant, a test) counts as open.
 */
export function editDialogOnPage(): boolean {
  const root = document.querySelector('home-assistant')?.shadowRoot;
  const dialog = root?.querySelector('hui-dialog-edit-card') ?? document.querySelector('hui-dialog-edit-card');
  if (!dialog) return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !('_params' in dialog) || !!(dialog as any)._params;
}

/*
 * Whether this editor is the options of a section strategy (#400) rather than of a card.
 * Home Assistant mounts the card's editor there too, in its section dialog's strategy tab,
 * and whatever the editor fires as config-changed becomes the section's `strategy:` - so
 * anything that swaps the card for a different type of thing cannot work there.
 */
export function inSectionStrategyEditor(element: Element): boolean {
  for (let node: Node | null = element; node; node = parentOf(node)) {
    const name = (node as Element).localName;
    if (name === 'hui-section-strategy-element-editor') return true;
    if (name === 'hui-dialog-edit-card') return false;
  }
  return false;
}

// Tags this bundle owns.
export const CARD_TAG = 'decluttering-card-plus';

export const CARD_EDITOR_TAG = 'decluttering-card-plus-editor';

export const TEMPLATE_TAG = 'decluttering-template-plus';

export const TEMPLATE_EDITOR_TAG = 'decluttering-template-plus-editor';

// A copy of a `lazy: true` repeat that is waiting to come into view. Only ever written by
// the card itself, into the stack it lays its copies out in.
export const LAZY_COPY_TAG = 'decluttering-card-plus-lazy';

// Variables can be written as a list of entries or as one mapping; both are read the same
// way. Anything else - a string, a number - is neither, and worth saying so about.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isVariablesShape(value: any): boolean {
  return value === undefined || Array.isArray(value) || (!!value && typeof value === 'object');
}

/** Writes a value the editor produced, leaving the key out entirely when it is empty. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setOrDelete(config: any, key: string, value: any): void {
  const empty = value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
  if (empty) delete config[key];
  else config[key] = value;
}

/*
 * Which of its examples each template's preview is drawn with, picked in the template
 * editor. The editor and the preview are two separate elements Home Assistant makes from
 * the same config, and the choice is not part of the config - saving it would change the
 * dashboard for a look at a preview - so it is kept here, and the preview told by event.
 */
export const previewExamples = new Map<string, number>();

export const PREVIEW_EXAMPLE_EVENT = 'decluttering-card-plus-preview-example';

/** The dashboard on the page, by url path - the original dashboard is `lovelace`. */
export function pageDashboard(): string {
  return dashboardKey(document.location.pathname.split('/').filter(Boolean)[0]);
}

/** What a rewrite saves through, read fresh each time: the page can change under an open dialog. */
export function saverFor(hass: HomeAssistant | undefined): Saver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { ownPath: pageDashboard(), panel: getLovelacePanel(), hass: hass as any };
}

/*
 * A toast, the way Home Assistant shows its own. Fired at the root rather than at the editor
 * that asked: the toast's own button can outlive the dialog it came from, and an event fired
 * from an element no longer on the page reaches nobody.
 */
function toast(from: HTMLElement, detail: Record<string, unknown>): void {
  const target = document.querySelector('home-assistant') ?? from;
  target.dispatchEvent(new CustomEvent('hass-notification', { detail, bubbles: true, composed: true }));
}

/** What an operation is called, in a sentence about undoing it. */
export function operationLabel(operation: string, hass?: HomeAssistant): string {
  return localize(`undo.op.${operation}`, undefined, hass);
}

/*
 * Every tool that rewrites a dashboard saves through here, so every one of them can be
 * undone the same way: the configuration of each dashboard it changes is kept before it is
 * saved (see undo.ts), and a toast offers the way back straight away. `dialog` is what the
 * edit dialog held before, for a tool that changed that too - an undo made while the dialog
 * is still open puts it back as well, or saving the dialog would undo the undo.
 */
export async function rewriteDashboards(
  from: HTMLElement,
  hass: HomeAssistant | undefined,
  operation: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changes: { urlPath: string; build: (config: any) => unknown }[],
  dialog?: unknown,
): Promise<UndoEntry | undefined> {
  const entry = await applyRewrite(saverFor(hass), operation, changes);
  if (!entry) return entry;
  if (dialog !== undefined) {
    entry.dialog = dialog;
    holdUndo(entry);
  }
  toast(from, {
    message: localize('undo.toast', { operation: operationLabel(operation, hass) }, hass),
    action: { text: localize('undo.action', undefined, hass), action: () => void undoFrom(from, hass, entry, false) },
    duration: 10000,
  });
  return entry;
}

/**
 * Undoes `entry`, from a toast or a button, and says how it went. Somebody having saved the
 * dashboard since is not overwritten without asking: the toast asks, and its button says so.
 */
export async function undoFrom(
  from: HTMLElement,
  hass: HomeAssistant | undefined,
  entry: UndoEntry,
  force: boolean,
  // A button with room for a warning of its own asks there rather than in a toast.
  askInToast = true,
): Promise<UndoOutcome | undefined> {
  const operation = operationLabel(entry.operation, hass);
  // A newer rewrite has taken its place; undoing this one now would undo the wrong thing.
  if (heldUndo()?.at !== entry.at) {
    toast(from, { message: localize('undo.gone', { operation }, hass) });
    return undefined;
  }
  let outcome: UndoOutcome;
  try {
    outcome = await runUndo(saverFor(hass), entry, force);
  } catch (err) {
    toast(from, { message: localize('undo.failed', { message: (err as Error)?.message ?? err }, hass) });
    return undefined;
  }
  if (outcome.result === 'changed') {
    if (!askInToast) return outcome;
    toast(from, {
      message: localize('undo.changed', { operation, dashboards: outcome.dashboards.join(', ') }, hass),
      action: { text: localize('undo.anyway', undefined, hass), action: () => void undoFrom(from, hass, entry, true) },
      duration: 15000,
    });
    return outcome;
  }
  if (outcome.result === 'done' && entry.dialog !== undefined && from.isConnected) {
    fireEvent(from, 'config-changed', { config: entry.dialog as Record<string, unknown> });
  }
  toast(from, {
    message: localize(outcome.result === 'done' ? 'undo.done' : 'undo.nothing', { operation }, hass),
  });
  return outcome;
}

// Guarded, so the pure helpers in this module can be required by the node tests.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pageWindow: any = typeof window !== 'undefined' ? window : undefined;
export const HELPERS = pageWindow?.loadCardHelpers ? pageWindow.loadCardHelpers() : undefined;

export async function loadCardEditorPicker(): Promise<void> {
  // Ensure hui-card-element-editor and hui-card-picker are loaded.
  // They happen to be used by the vertical-stack card editor but there must be a better way?
  let cls = customElements.get('hui-vertical-stack-card');
  if (!cls) {
    if (!HELPERS) return;
    (await HELPERS).createCardElement({ type: 'vertical-stack', cards: [] });
    await customElements.whenDefined('hui-vertical-stack-card');
    cls = customElements.get('hui-vertical-stack-card');
  }
  if (cls) cls = cls.prototype.constructor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (cls && (cls as any).getConfigElement) await (cls as any).getConfigElement();
}

// The things a template can define, what it builds and of which kind: in build.ts, which the
// docs site's Try a template page shares with the card (#427).
export { THING_TYPE_KEYS, getThingType, thingContent } from './build';

/*
 * How a card using `template_by_domain:` chooses each copy's template, from that copy's
 * variables. Kept with the card so that a rebuild - the registry moving, a resolver's answer
 * arriving - chooses again the same way.
 */
export interface TemplatePicker {
  pick(variables: VariablesConfig[] | undefined): { name: string; template: TemplateConfig; entity?: string };
  /** Whether any template it can choose reads the registry through a resolver. */
  resolvers: boolean;
}

/** Whether this page has defined a custom element - which Home Assistant's own elements come and go with releases. */
export const isDefinedHere = (tag: string): boolean => !!customElements.get(tag);

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
