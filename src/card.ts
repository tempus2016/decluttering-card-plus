import { inMasonry } from './skeleton';
import { html, PropertyValues, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceConfig } from 'custom-card-helpers';
import {
  DeclutteringCardConfig,
  TemplateConfig,
  VariablesConfig,
  LovelaceThingConfig,
  LovelaceThingType,
} from './types';
import deepReplace, { fillSource } from './deep-replace';
import {
  collectTemplates,
  collectAllTemplates,
  didYouMean,
  findTemplate,
  findTemplateAnywhere,
  getTemplateSources,
  borrowedKnown,
  loadBorrowed,
  mayBorrowTemplates,
  misplacedOverrides,
  parentsOf,
  BY_DOMAIN_KEY,
  byDomainOf,
  pickTemplate,
  withPickedEntity,
  warnIfDeprecated,
  MissingTemplateError,
} from './templates';
import { trashHass, watchForTrash } from './trash';
import {
  forEachItems,
  getDeclarations,
  usesInstalled,
  usesResolver,
  usesAttributes,
  usesTimeStep,
  usesTranslate,
  withInheritedVariables,
} from './variables';
import { installedKey, whenInstalledChanges } from './installed';
import { chainOf, describeCycle, describeTooDeep, findCycle, MAX_NESTING } from './cycles';
import { customTags, OnError, onErrorOf, undefinedElements } from './on-error';
import { isRegistrySource, registryKey, resolveRegistryItems, sameRegistry } from './registry';
import { loadLabels } from './labels';
import { loadCategories, wantsCategories, whenCategoriesChange } from './categories';
import { renderTemplateOnce, sourceTemplate, TemplateRender } from './template-source';
import { getLovelaceConfig } from './utils';
import { placeStrict, strictLevels } from './strict';
import { localize } from './localize';
import { REBUILD_DEBOUNCE_MS, rebuildOnEntities, rebuildOnRejects, stateSnapshot, statesMoved } from './rebuild';
import { handedDownNames, traceRoot, tracePlace, wantsTrace } from './trace';
import { DeclutteringElement } from './element';
import {
  CARD_EDITOR_TAG,
  CARD_TAG,
  TemplatePicker,
  editDialogOf,
  editDialogOnPage,
  getThingType,
  sourceContext,
  warnUnlisted,
} from './shared';
import { shouldDefer, whenIdle, whenVisible } from './idle';
import { warn } from './warnings';
import {
  onPreviewHold,
  PreviewHoldEvent,
  previewEditorOpen,
  previewEditorOpenings,
  previewPauseOn,
  renderPreviewNow,
  requiredUnset,
} from './preview-hold';
import { withAlerts } from './checks';
import { withSlotVariables } from './slots';
import {
  hasMobileVariables,
  isMobileViewport,
  isMobileWidth,
  mobileThreshold,
  MOBILE_VIEWPORT_QUERY,
  withMobileVariables,
} from './breakpoints';
import { loadEditors } from './editors-loader';
import { customMissingDetail, missingTemplateDetail } from './error-card';

/*
 * Home Assistant's `title` translations - every integration's name - asked for once per
 * page and language, by the first card that uses `|translate`. Per language because they
 * are loaded for the language of the moment: switch it, and the names in the new one have
 * to be asked for again, or every `|translate` stays in the old one until a reload. A Home
 * Assistant without the call, or one where it fails, leaves `|translate` giving back what it
 * was given, as it always may.
 */
const titleTranslations = new Map<string, Promise<void>>();

// How long a preview held in an open edit dialog waits for the card editor to arrive (#407).
const EDITOR_WAIT_MS = 5000;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadTitleTranslations(hass: any): Promise<void> {
  if (typeof hass?.loadBackendTranslation !== 'function') return Promise.resolve();
  const language = String(hass?.locale?.language ?? hass?.language ?? '');
  const asked = titleTranslations.get(language);
  if (asked) return asked;
  const loading = Promise.resolve(hass.loadBackendTranslation('title')).then(
    () => undefined,
    () => {
      // Not fatal, and worth another try on the next card.
      titleTranslations.delete(language);
    },
  );
  titleTranslations.set(language, loading);
  return loading;
}

export class DeclutteringCard extends DeclutteringElement {
  private _pendingConfig?: DeclutteringCardConfig;
  private _lastConfig?: DeclutteringCardConfig;
  // A card repeating over the registry, kept so it can be worked out again when what is
  // registered changes - a lamp added to the kitchen should appear without an edit.
  private _fromRegistry?: { templateConfig: TemplateConfig; config: DeclutteringCardConfig; picker?: TemplatePicker };
  private _registry?: unknown[];

  // The same pair again, for a template that reads the registry through a resolver rather
  // than repeating over it.
  private _fromResolvers?: {
    templateConfig: TemplateConfig;
    config: DeclutteringCardConfig;
    translates?: boolean;
    // Asks what is installed (#397), so it builds again when a card or an icon set turns up.
    installs?: boolean;
    picker?: TemplatePicker;
  };
  private _resolverRegistry?: unknown[];
  // Stops this card hearing that a custom card it asked about was defined - see installed.ts.
  private _installedStop?: () => void;
  // Stops this card hearing that the category registry was fetched again - see categories.ts.
  private _categoriesStop?: () => void;

  /*
   * What a `for_each_from: { template: }` rendered to, kept for as long as the card has
   * the same config - hass arrives several times a second and must never ask again. A new
   * config (an edit) starts afresh, so editing the template renders it again.
   */
  private _rendered: Record<string, TemplateRender> = {};
  private _renderedFor?: unknown;
  private _rendering = new Set<string>();
  private _misplacedWarnedFor?: DeclutteringCardConfig;
  // `rebuild_on:` - the states the card was last built with, the ones last seen, and the
  // rebuild waiting out a burst of changes.
  private _rebuildBuilt?: (string | undefined)[];
  private _rebuildSeen?: (string | undefined)[];
  // Whether the last build read `attr:`, so an attribute change alone rebuilds it (idea 39).
  private _rebuildAttributes = false;
  private _rebuildTimer?: ReturnType<typeof setTimeout>;
  private _rebuildWarnedFor?: unknown;
  private _timeWarnedFor?: DeclutteringCardConfig;
  // A first build waiting for idle time (idea 10): what to build, and the config it is for.
  private _deferred?: { templateConfig: TemplateConfig; config: DeclutteringCardConfig; token: unknown };
  private _deferStop?: () => void;
  private _builtOnce = false;

  // What `on_error:` is filled in from: the card's own variables, and its template once found.
  private _fallbackSource?: { variables?: VariablesConfig[]; template?: TemplateConfig; name?: string };
  // The error `on_error:` is standing in for, while it is, and the config built for it.
  private _fallbackFor?: string;
  private _fallbackConfig?: LovelaceThingConfig;
  private _buildingFallback = false;
  // Set when `on_error:` itself could not be shown, which leaves the error showing instead of looping.
  private _fallbackFailed = false;
  // `variables_mobile:` (idea 42): whether the card last counted as narrow, and what tells it
  // when that changes - the screen's media query, or an observer of the card's own width when
  // `mobile_below:` asks for that. Only ever made for a card that has mobile values.
  private _mobile = false;
  private _breakpoints?: ResizeObserver;
  private _stopMedia?: () => void;

  /*
   * Asks the hui-card or hui-badge around this card to leave it on the page while it is
   * hidden. They would otherwise take it off, and a card that is off the page stops
   * watching the card inside it, so it would never notice that card coming back.
   */
  public connectedWhileHidden = true;

  /*
   * #407: an edit dialog's preview held back - paused from the card editor, or waiting for a
   * required variable - and the config it last built when asked to build anyway, so another
   * build of that same config (hass arriving, say) does not hold it again. An edit hands a
   * new config, which is held again.
   */
  @state() private _held?: { reason: 'paused' } | { reason: 'required'; names: string[] };
  private _builtAnyway?: DeclutteringCardConfig;
  private _holdStop?: () => void;
  /*
   * The dialog builds its preview before the card editor beside it is on the page, so a card
   * in an open dialog is taken for its preview until an editor comes - but only until one
   * comes and goes (the code editor, a stack showing another card), or a few seconds pass
   * with none. The count of editors opened is noted when the card is made and taken off the
   * page, so a dialog reopened starts afresh.
   */
  private _editorsBefore = previewEditorOpenings();
  private _editorWait?: ReturnType<typeof setTimeout>;
  private _editorWaitOver = false;

  public connectedCallback(): void {
    super.connectedCallback();
    this._holdStop ??= onPreviewHold((event) => this._heardHold(event));
    // Held before it was on the page, which is the only place it could tell it was a preview.
    if (this._held && !this._inPreview()) this._buildAnyway(false);
    else if (this._held) this._waitForEditor();
    // Home Assistant takes cards off the page and puts them back while it lays a view out,
    // which stops the card hearing about categories (below); put back, it starts again.
    if (this._hass && this._fromRegistry) this._loadLabelsIfWanted(this._hass);
    this._listenForInstalled();
    if (this._breakpoints) this._breakpoints.observe(this);
    if (this._lastConfig && hasMobileVariables(this._lastConfig) && mobileThreshold(this._lastConfig) === undefined) {
      this._watchViewport();
    }
    // On the page at last: now it can be said whether the card is on screen.
    if (this._deferred) this._watchForBuild();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._holdStop?.();
    this._holdStop = undefined;
    clearTimeout(this._editorWait);
    this._editorWait = undefined;
    this._editorWaitOver = false;
    this._editorsBefore = previewEditorOpenings();
    this._categoriesStop?.();
    this._categoriesStop = undefined;
    // Off the page, nothing is on screen; put back, connectedCallback watches again.
    this._deferStop?.();
    this._deferStop = undefined;
    this._breakpoints?.disconnect();
    this._stopMedia?.();
    this._stopMedia = undefined;
    this._installedStop?.();
    this._installedStop = undefined;
  }

  /*
   * A custom card's script can load after a card asking `[[popup|card_exists]]` has built,
   * and a hass update need not follow it - so the card hears about it and builds again.
   */
  private _listenForInstalled(): void {
    if (!this._fromResolvers?.installs || this._installedStop || !this.isConnected) return;
    this._installedStop = whenInstalledChanges(() => {
      if (this._hass) this._rebuildForResolvers(this._hass);
    });
  }

  constructor() {
    super();
    // The hui-card inside says when its visibility conditions change. Heard here, on the
    // way out, so this card is hidden or shown before the wrapper around it checks.
    const heard = (ev: Event) => {
      if (ev.composedPath()[0] !== this) this._displayHidden();
    };
    this.addEventListener('card-visibility-changed', heard);
    this.addEventListener('badge-visibility-changed', heard);
  }

  /*
   * Collapsing this element is not enough in a sections view. The section gives every card
   * a grid cell and only frees it when the card has the hidden attribute, and hides a
   * whole section only once every card in it does - so a template card that hid itself
   * left an empty cell behind, and a section of nothing else stayed on the page and pushed
   * the others off centre (#152). The wrapper around this card only looks again when it
   * is told, so it is told.
   */
  protected _displayHidden(): void {
    super._displayHidden();
    if (this._thingType !== 'card' && this._thingType !== 'badge') return;
    const hidden = this.classList.contains('child-card-hidden');
    if (this.hasAttribute('hidden') === hidden) return;
    this.toggleAttribute('hidden', hidden);
    const event = this._thingType === 'badge' ? 'badge-visibility-changed' : 'card-visibility-changed';
    this.dispatchEvent(new Event(event, { bubbles: true, composed: true }));
  }

  /*
   * Home Assistant can say a card is a preview after it has been configured, and a lazy
   * repeat built before then left copies waiting in an editor preview, which never scrolls
   * them into view. Told, it builds again with every copy.
   */
  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    // Entering or leaving edit mode draws or takes away the slots a template's `visibility:`
    // left (idea 45), which only a build knows how to do.
    const lazyToShow = this.preview && this._lazyShown;
    const skippedToDraw = this._skippedCopies > 0;
    if (changedProperties.has('preview') && (lazyToShow || skippedToDraw)) {
      try {
        this._rebuild();
      } catch (err) {
        this._error = (err as Error)?.message ?? String(err);
      }
    }
    // A preview waits for nothing: told it is one, a deferred card builds at once.
    if (changedProperties.has('preview') && this.preview && this._deferred) this._buildDeferred();
  }

  // The editors live in a chunk of their own, fetched the first time one is opened (idea 4).
  static async getConfigElement(): Promise<HTMLElement> {
    await loadEditors();
    return document.createElement(CARD_EDITOR_TAG);
  }

  static getStubConfig(): DeclutteringCardConfig {
    return {
      type: `custom:${CARD_TAG}`,
      template: 'follow_the_sun',
    };
  }

  /*
   * Building can fail in setConfig - a template that is not there, one defining two things,
   * a repeat of a badge - and Home Assistant answers a throw there by swapping the card for
   * its own error card. A card with `on_error:` says it instead, so it can show that.
   */
  public setConfig(config: DeclutteringCardConfig): void {
    this._lastConfig = config;
    // A build still waiting goes on waiting: if this config is deferred too it takes the
    // wait over (_buildOrDefer), and if not, the waiting build finds itself out of date.
    this._held = undefined;
    if (previewPauseOn() && config !== this._builtAnyway && this._inPreview(config)) {
      this._hold({ reason: 'paused' });
      return;
    }
    this._fallbackFor = undefined;
    this._fallbackConfig = undefined;
    this._fallbackFailed = false;
    this._fallbackSource = { variables: withInheritedVariables(config).variables, name: config.template };
    this._alerts = [];
    if (this._hiddenByFallback) {
      this._hiddenByFallback = false;
      this._displayHidden();
    }
    try {
      this._configure(config);
    } catch (err) {
      if (!this._onError()) throw err;
      this._error = (err as Error)?.message ?? String(err);
    }
  }

  private _configure(config: DeclutteringCardConfig): void {
    if (!config.template && !byDomainOf(config)) {
      throw new Error(localize('error.missing_template'));
    }

    /*
     * What is already being drawn above this card. A template that uses itself, directly
     * or through another template, would otherwise build the next level forever - each one
     * while it is still detached from the page, so nothing in the layout ever gets the
     * chance to stop it and the tab simply stops responding.
     */
    this._openTemplates = chainOf(config);
    this._templateName = config.template;
    // Whatever the card around it handed down, read from here on as if written on this card.
    this._handedDown = handedDownNames(config);
    config = withInheritedVariables(config);
    // `slots:` are variables the card fills a template's slots with (idea 35).
    config = withSlotVariables(config);
    // `variables_mobile:` lays its values over the card's while the card is narrow (idea 42).
    this._watchBreakpoint(config);
    config = withMobileVariables(config, this._mobile);

    // Said here rather than thrown: Home Assistant collapses a card that throws in
    // setConfig to "Configuration error" with the reason hidden, and the reason - which
    // templates loop, and in what order - is the whole of what makes this fixable.
    const cycle = findCycle(this._openTemplates, config.template);
    const tooDeep = this._openTemplates.length >= MAX_NESTING;
    if (cycle || tooDeep) {
      this._error = cycle ? describeCycle(cycle) : describeTooDeep(this._openTemplates);
      return;
    }

    const ll = getLovelaceConfig();
    if (!ll) {
      throw new Error(localize('error.no_lovelace'));
    }
    this._error = undefined;
    this._errorDetail = undefined;
    this._ownConfig = this._lastConfig;
    this._rebuildOn = rebuildOnEntities(config.rebuild_on);
    this._warnRebuildOn(config);
    /*
     * Anything but `contents` leaves the card with a box of its own, which is what it has
     * always had - so a value nobody recognises falls back to the way it worked before
     * rather than to a layout they did not ask for.
     */
    this._fitContents = config.fit === 'contents';
    const place = this._place(ll);
    if (byDomainOf(config)) {
      this._chooseByDomain(ll, config, place);
      return;
    }
    const found = findTemplate(ll, config.template, place.view, place.section);
    /*
     * An `extends` still standing means a parent is not on this dashboard, and it may be on
     * one this dashboard borrows from - the library dashboard, most often (#343). Built now,
     * the card would be the child alone, so it waits for the fetch the way a template that
     * is not here at all does. With nowhere to borrow from it is built as written, as ever.
     */
    const templateConfig = found && parentsOf(found).length && mayBorrowTemplates(ll) ? null : found;
    /*
     * setConfig runs before hass is ever set, and a card that reads states has none to read
     * yet - built now, every `|state` would be left in brackets and complained about, only
     * to be built again a moment later. It waits for hass instead, the way a borrowed
     * template does.
     */
    if (templateConfig && this._rebuildOn.length && !this._hass) {
      this._pendingConfig = config;
      this._holdPlace(config, templateConfig);
      return;
    }
    if (templateConfig) {
      this._pendingConfig = undefined;
      this._noteLibrary(ll);
      this._buildOrDefer(templateConfig, config);
      return;
    }
    if (!mayBorrowTemplates(ll)) {
      // Said rather than thrown (idea 49): thrown, Home Assistant draws its own red card in
      // this one's place, and the line, the nearest name and the fix could not be offered.
      const available = Object.keys(collectTemplates(ll));
      this._errorDetail = missingTemplateDetail(
        ll,
        config.template,
        available,
        localize('errorcard.not_found', undefined, this._hass),
      );
      this._error =
        localize('error.template_missing', { template: config.template }, this._hass) +
        didYouMean(config.template, available);
      return;
    }
    // The template may live on a dashboard this one borrows from, or on the library
    // dashboard every one borrows from, which has to be fetched.
    // setConfig cannot wait, so it is picked up as soon as hass arrives.
    this._pendingConfig = config;
    this._holdPlace(config);
    if (this._hass) this.hassAvailable(this._hass);
  }

  /*
   * Holds the card's place while its template is on its way (idea 48), at the size the card
   * - or, when it is already to hand, its template - asked for.
   */
  private _holdPlace(config: DeclutteringCardConfig, templateConfig?: TemplateConfig): void {
    this._waiting = true;
    this._waitingGrid = config.grid_options ?? (templateConfig as { grid_options?: unknown } | undefined)?.grid_options;
    this._thingType ??= 'card';
    this.requestUpdate();
  }

  protected _rebuild(): void {
    if (!this._lastConfig) return;
    /*
     * Outside Home Assistant's own setConfig nobody catches a throw: a rebuild after the
     * library came in, say, that throws for a badge for_each would leave the card a skeleton
     * for good. It says the error itself instead.
     */
    try {
      this.setConfig(this._lastConfig);
    } catch (err) {
      this._error = (err as Error)?.message ?? String(err);
    }
  }

  /* ------------------------------------------------------------ preview hold (#407) */

  /*
   * Whether this card is one an edit dialog is previewing: the card being edited rather than
   * one built inside another, and in the dialog - or not on the page yet, which is how the
   * dialog first builds its preview. One held before it is placed is let go once it turns
   * out to be somewhere else.
   */
  private _mayHold(config: DeclutteringCardConfig | undefined = this._lastConfig): boolean {
    if (!config || chainOf(config).length) return false;
    return this.isConnected ? !!editDialogOf(this) : true;
  }

  /*
   * Whether this card is the edit dialog's preview right now: one that may be held, with a
   * card editor open - or in an open dialog no editor has reached yet, which is how Home
   * Assistant builds the first preview. Before it is placed, an open dialog on the page is
   * all there is to go on; placed elsewhere, connectedCallback lets it go.
   */
  private _inPreview(config: DeclutteringCardConfig | undefined = this._lastConfig): boolean {
    if (!this._mayHold(config)) return false;
    if (previewEditorOpen()) return true;
    if (this._editorWaitOver || previewEditorOpenings() !== this._editorsBefore) return false;
    return this.isConnected || editDialogOnPage();
  }

  // Lets a card held for an editor that never comes build, as it would with none open.
  private _waitForEditor(): void {
    if (this._editorWait || !this.isConnected || previewEditorOpen()) return;
    this._editorWait = setTimeout(() => {
      this._editorWait = undefined;
      if (previewEditorOpen()) return;
      this._editorWaitOver = true;
      if (this._held) this._buildAnyway(false);
    }, EDITOR_WAIT_MS);
  }

  private _hold(held: NonNullable<DeclutteringCard['_held']>): void {
    this._dropThing();
    this._error = undefined;
    this._errorDetail = undefined;
    this._held = held;
    this._waitForEditor();
  }

  private _buildAnyway(once: boolean): void {
    this._held = undefined;
    if (once) this._builtAnyway = this._lastConfig;
    try {
      this._rebuild();
    } catch (err) {
      this._error = (err as Error)?.message ?? String(err);
    }
  }

  private _heardHold(event: PreviewHoldEvent): void {
    if (event === 'render') {
      if (this._held) this._buildAnyway(true);
      return;
    }
    if (previewPauseOn() && this._inPreview()) {
      if (!this._held) {
        this._builtAnyway = undefined;
        this._hold({ reason: 'paused' });
      }
    } else if (this._held?.reason === 'paused') {
      this._buildAnyway(false);
    }
  }

  protected _holdForRequired(unresolved: string[], templateConfig: TemplateConfig): boolean {
    if (this._lastConfig === this._builtAnyway || !this._inPreview()) return false;
    const names = requiredUnset(getDeclarations(templateConfig), unresolved);
    if (!names.length) return false;
    this._hold({ reason: 'required', names });
    return true;
  }

  protected render(): TemplateResult | void {
    if (!this._held) return super.render();
    const message =
      this._held.reason === 'paused'
        ? localize('card.preview_paused', undefined, this._hass)
        : localize(
            this._held.names.length === 1 ? 'card.preview_required_one' : 'card.preview_required_many',
            { which: this._held.names.map((name) => `[[${name}]]`).join(', ') },
            this._hass,
          );
    return html`<ha-alert alert-type="info">
      ${message}
      <ha-button slot="action" @click=${(): void => renderPreviewNow()}>
        ${localize('card.preview_render_now', undefined, this._hass)}
      </ha-button>
    </ha-alert>`;
  }

  /*
   * Watches for the card turning narrow while it has mobile values, and builds again the
   * once that changes - not on every pixel. The screen decides unless `mobile_below:` asks
   * for the card's own width, in which case nothing measured yet counts as wide, as the
   * column count does: the first build is the desktop one and a narrow card builds again
   * as soon as it is measured.
   */
  private _watchBreakpoint(config: DeclutteringCardConfig): void {
    if (!hasMobileVariables(config)) {
      this._breakpoints?.disconnect();
      this._breakpoints = undefined;
      this._stopMedia?.();
      this._stopMedia = undefined;
      this._mobile = false;
      return;
    }
    const threshold = mobileThreshold(config);
    if (threshold === undefined) {
      this._breakpoints?.disconnect();
      this._breakpoints = undefined;
      this._mobile = isMobileViewport();
      this._watchViewport();
      return;
    }
    this._stopMedia?.();
    this._stopMedia = undefined;
    if (typeof ResizeObserver === 'undefined') {
      this._mobile = false;
      return;
    }
    this._breakpoints ??= new ResizeObserver(() => {
      const written = mobileThreshold(this._lastConfig);
      if (written === undefined) return;
      this._crossed(isMobileWidth(this.clientWidth, written));
    });
    this._breakpoints.disconnect();
    this._breakpoints.observe(this);
    this._mobile = isMobileWidth(this.clientWidth, threshold);
  }

  // The screen's own narrow query, heard once per card for as long as it is on the page.
  private _watchViewport(): void {
    if (this._stopMedia || typeof matchMedia !== 'function') return;
    const query = matchMedia(MOBILE_VIEWPORT_QUERY);
    const heard = (): void => this._crossed(query.matches);
    query.addEventListener('change', heard);
    this._stopMedia = () => query.removeEventListener('change', heard);
  }

  private _crossed(mobile: boolean): void {
    if (mobile === this._mobile) return;
    this._mobile = mobile;
    try {
      this._rebuild();
    } catch (err) {
      this._error = (err as Error)?.message ?? String(err);
    }
  }

  /* ------------------------------------------------------------ idle first build (idea 10) */

  /*
   * Builds now, or - a card not yet on the page, not a preview, not debugging, never built
   * before - keeps what to build and waits to be told whether it is on screen. The size the
   * template asks for is answered meanwhile, so the section lays the card out at the right
   * height before there is a card inside.
   */
  private _buildOrDefer(templateConfig: TemplateConfig, config: DeclutteringCardConfig): void {
    const state = {
      inDialog: !!editDialogOf(this),
      preview: this.preview,
      builtBefore: this._builtOnce,
      group: templateConfig.group !== undefined,
      canObserve: typeof requestAnimationFrame !== 'undefined',
    };
    if (!shouldDefer(config, state)) {
      this._deferStop?.();
      this._deferStop = undefined;
      this._deferred = undefined;
      this._applyTemplate(templateConfig, config);
      return;
    }
    this._gridOptions = config.grid_options ?? (templateConfig as { grid_options?: unknown }).grid_options;
    if (this._gridOptions !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).getGridOptions = (): unknown => this._gridOptions;
    }
    // Already waiting - a library catch-up builds again before the first build came - so the
    // wait goes on and builds this config instead. Watching again would measure the card while
    // a masonry view is laying its columns out afresh, where every card looks on screen.
    const waitingAlready = this._deferred !== undefined && this._deferStop !== undefined;
    this._deferred = { templateConfig, config, token: this._lastConfig };
    if (waitingAlready) return;
    // The skeleton holds its place meanwhile: with no box at all, a masonry view piles every
    // waiting card at the top, where each one counts as on screen (idea 10 with idea 48).
    this._holdPlace(config, templateConfig);
    if (this.isConnected) this._watchForBuild();
  }

  // Once on the page: on screen builds now, off screen builds in idle time, two seconds at most.
  private _watchForBuild(): void {
    this._deferStop?.();
    if (!this._deferred) return;
    // A masonry view lays its columns out from each card's real size, so a card that waits
    // makes the ones on screen wait too: there every card builds at once (idea 10).
    if (editDialogOf(this) || this.preview || inMasonry(this)) {
      this._buildDeferred();
      return;
    }
    const stopWatching = whenVisible(this, (visible) => {
      if (visible) {
        this._buildDeferred();
        return;
      }
      this._deferStop = whenIdle(() => {
        // A mark, so the timeline in the browser's performance tools - and a test - can see
        // which builds waited for idle time.
        performance.mark?.('decluttering-card-plus:idle-build');
        this._buildDeferred();
      });
    });
    this._deferStop = stopWatching;
  }

  private _buildDeferred(): void {
    const waiting = this._deferred;
    this._deferStop?.();
    this._deferStop = undefined;
    this._deferred = undefined;
    // A newer config has been given since: its own build is what counts.
    if (!waiting || waiting.token !== this._lastConfig) return;
    try {
      this._applyTemplate(waiting.templateConfig, waiting.config);
    } catch (err) {
      // Outside setConfig nobody catches a throw, so the card says it itself.
      this._error = (err as Error)?.message ?? String(err);
    }
  }

  /* ------------------------------------------------------------ on_error */

  // The card's `on_error:`, or its template's - looked up here when the build failed first.
  private _onError(): OnError | undefined {
    let template = this._fallbackSource?.template;
    const name = this._fallbackSource?.name;
    if (!template && name) {
      try {
        template = findTemplate(getLovelaceConfig(), name) ?? undefined;
      } catch {
        template = undefined;
      }
    }
    return onErrorOf(this._lastConfig, template);
  }

  /*
   * Whatever set the error - setConfig, a strict refusal, a template still missing once
   * the other dashboards were read, a registry repeat - it all ends here, so `on_error:`
   * only has to be looked for in one place.
   */
  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (changed.has('_error') && this._error && !this._fallbackFailed) this._showFallback(this._error);
  }

  /*
   * What a card shows instead of an error. Of the kind its template builds, or - with no
   * template to say - a badge in a row of badges and a card anywhere else. Filled in with
   * the card's variables, and the template's defaults when there is a template.
   */
  private _showFallback(message: string): void {
    const onError = this._onError();
    if (!onError) return;
    this._fallbackFor = message;
    warn({
      kind: 'on_error',
      message: localize('warn.on_error', { message }, this._hass),
      template: this._templateName,
      card: typeof this._lastConfig?.name === 'string' ? this._lastConfig.name : undefined,
    });
    this._error = undefined;
    this._errorDetail = undefined;
    this._stopRepeat();
    const template = this._fallbackSource?.template;
    const kind: LovelaceThingType = this._inBadgeRow
      ? 'badge'
      : ((template ? getThingType(template) : undefined) ?? this._thingType ?? 'card');
    if ('hide' in onError) {
      this._thingType = kind;
      this._hiddenByFallback = true;
      this._displayHidden();
      return;
    }
    try {
      // Built as the card itself is: against the states it rebuilds on, with the dashboard's
      // item templates to hand (review 2026-10-25).
      // The checks that stopped the build are there to say why (#389) - none, for any other failure.
      const variables = withAlerts(this._fallbackSource?.variables, this._alerts);
      const built = deepReplace(
        variables,
        template ?? ({} as TemplateConfig),
        onError.config,
        this._fallbackSource?.name,
        this._buildHass,
        true,
        undefined,
        0,
        undefined,
        undefined,
        false,
        this._buildExtras(),
      );
      this._buildingFallback = true;
      this._setResolved(kind, this._withGridOptions(kind, built), '');
    } catch {
      // An on_error that cannot be built itself shows the error it stood in for.
      this._fallbackFailed = true;
      this._error = message;
    } finally {
      this._buildingFallback = false;
    }
  }

  protected _afterResolved(config: LovelaceThingConfig): void {
    if (this._buildingFallback) this._fallbackConfig = config;
    else {
      // A card that builds after all is no longer standing in for anything.
      this._fallbackFor = undefined;
      this._fallbackConfig = undefined;
      this._fallbackFailed = false;
      if (this._hiddenByFallback) {
        this._hiddenByFallback = false;
        this._displayHidden();
      }
    }
    void this._checkDefined(config);
  }

  /*
   * A card that builds a custom card nobody installed is the one failure Home Assistant
   * reports rather than this card - by drawing its own error where the card should be. It is
   * caught here instead, after the same short wait Home Assistant gives a resource still
   * loading, so the error card can name the type and the template (idea 49) and `on_error:`
   * can stand in. If the element does turn up later, the card builds again.
   */
  private async _checkDefined(config: LovelaceThingConfig): Promise<void> {
    const tags = customTags(config);
    if (!tags.length) return;
    const missing = await undefinedElements(tags);
    if (!missing.length || this._thingConfig !== config) return;
    const types = missing.map((tag) => `custom:${tag}`);
    const message = localize('error.custom_element_missing', { types: types.join(', ') }, this._hass);
    this._errorDetail = customMissingDetail(
      this._templateName,
      types,
      localize('errorcard.not_registered', undefined, this._hass),
    );
    if (config === this._fallbackConfig) {
      this._fallbackFailed = true;
      this._error = this._fallbackFor ?? message;
    } else {
      this._error = message;
    }
    const waitingOn = this._lastConfig;
    void Promise.all(missing.map((tag) => customElements.whenDefined(tag))).then(() => {
      if (this._lastConfig === waitingOn) this._rebuild();
    });
  }

  /*
   * A card choosing its template by domain needs every template it names to hand before it
   * can build anything, since which one a copy gets depends on that copy. When this
   * dashboard has them all - or cannot borrow any - it builds now; otherwise it waits for
   * hass, the same way a card whose one template lives on another dashboard does.
   */
  private _chooseByDomain(
    ll: LovelaceConfig,
    config: DeclutteringCardConfig,
    place: { view?: number; section?: number },
  ): void {
    const local = collectTemplates(ll, place.view, undefined, place.section);
    const named = [config.template, ...Object.values(byDomainOf(config) ?? {})].filter(Boolean) as string[];
    // A template here whose parent is not (#343) needs the borrowed ones as much as a missing one.
    const ready = (name: string): boolean => local[name] !== undefined && !parentsOf(local[name]).length;
    if (named.every(ready) || !mayBorrowTemplates(ll)) {
      this._pendingConfig = undefined;
      this._noteLibrary(ll);
      this._applyByDomainOrSay(local, config);
      return;
    }
    this._pendingConfig = config;
    this._holdPlace(config);
    if (this._hass) this.hassAvailable(this._hass);
  }

  /*
   * Builds a card choosing by domain from the templates there are. A single card chooses
   * once and is then built exactly as though it had named that template. A repeat keeps the
   * way of choosing, so each copy - and each rebuild - picks its own; the template the card
   * falls back on stands for the whole card where one has to, in its styles, its size and
   * its `empty:`.
   */
  /*
   * Picking by domain can fail - no template for the entity's domain and no default, or a
   * named template that is not there. Said rather than thrown, as a plain missing template is
   * (idea 49): thrown out of setConfig, Home Assistant draws its own red card in this one's
   * place and `on_error:` never gets its turn.
   */
  private _applyByDomainOrSay(templates: Record<string, TemplateConfig>, config: DeclutteringCardConfig): void {
    try {
      this._applyByDomain(templates, config);
    } catch (err) {
      if (err instanceof MissingTemplateError) {
        this._templateName = err.template;
        this._errorDetail = missingTemplateDetail(
          getLovelaceConfig(),
          err.template,
          err.available,
          localize('errorcard.not_found', undefined, this._hass),
        );
      }
      this._error = (err as Error)?.message ?? String(err);
    }
  }

  private _applyByDomain(templates: Record<string, TemplateConfig>, config: DeclutteringCardConfig): void {
    const available = Object.keys(templates);
    const lookup = (name: string | undefined): TemplateConfig | undefined =>
      name !== undefined && Object.prototype.hasOwnProperty.call(templates, name) ? templates[name] : undefined;
    const byDomain = byDomainOf(config) ?? {};
    const named = [config.template, ...Object.values(byDomain)].filter(Boolean) as string[];
    const picker: TemplatePicker = {
      pick: (variables) => {
        const picked = pickTemplate(config, variables, lookup, this._hass, available);
        // The chain of open templates has to see the one actually chosen, or a template
        // reaching itself through a by-domain card would build levels for ever.
        const cycle = findCycle(this._openTemplates, picked.name);
        if (cycle) throw new Error(describeCycle(cycle));
        warnIfDeprecated(picked.name, picked.template, this._hass);
        return picked;
      },
      resolvers: named.some((name) => usesResolver(lookup(name), this._buildExtras().itemTemplates)),
    };

    const repeats = forEachItems(config.for_each) !== undefined || isRegistrySource(config.for_each_from);
    if (!repeats) {
      const { name, template, entity } = picker.pick(config.variables);
      this._templateName = name;
      this._applyTemplate(template, {
        ...config,
        template: name,
        variables: withPickedEntity(config.variables, entity) as VariablesConfig[] | undefined,
      });
      return;
    }
    const fallback = Object.prototype.hasOwnProperty.call(byDomain, 'default') ? byDomain.default : config.template;
    const base = lookup(fallback) ?? lookup(named.find((name) => lookup(name))) ?? ({} as TemplateConfig);
    this._applyTemplate(base, config, picker);
  }

  // A card renders its template once, or once per item when it is given a list to repeat
  // over. An empty list is not an error - it is a list that happens to have nothing in it
  // today - so it simply renders nothing rather than failing the card.
  private _applyTemplate(
    templateConfig: TemplateConfig,
    config: DeclutteringCardConfig,
    picker?: TemplatePicker,
  ): void {
    this._builtOnce = true;
    this._fallbackSource = { variables: config.variables, template: templateConfig, name: config.template };
    this._fromRegistry = undefined;
    this._registry = undefined;
    // Compared on the config as it was given: what reaches here is rebuilt from it on
    // every setConfig, and a rebuild with the same config (a section move) is not an edit.
    const given = this._lastConfig ?? config;
    if (this._renderedFor !== given) {
      this._renderedFor = given;
      this._rendered = {};
      this._rendering.clear();
    }
    // The states this build reads, so only a change from these sets off the next one.
    this._rebuildAttributes = usesAttributes(templateConfig, this._buildExtras().itemTemplates);
    this._rebuildBuilt = this._rebuildOn.length
      ? stateSnapshot(this._hass, this._rebuildOn, this._rebuildAttributes)
      : undefined;
    this._rebuildSeen = this._rebuildBuilt;
    this._applyGap(config.gap);
    // The card's own beats its template's, and either beats the section's, the view's and the dashboard's (#390).
    const ll = getLovelaceConfig();
    const place = this._place(ll);
    this._strictLevels = strictLevels([
      config.strict,
      (templateConfig as { strict?: unknown }).strict,
      ...placeStrict(ll, place.view, place.section),
    ]);
    this._debug = config.debug === 'yaml' ? 'yaml' : config.debug === true ? 'json' : false;
    this._trace = wantsTrace(config);
    this._reportMode = config.debug === 'report';
    this._reportForced = undefined;
    this._reportUnredacted = config.redact === false;
    this._lastReport = undefined;
    if (!this._reportMode) this._reportResult = undefined;
    this._tracePlace = tracePlace(config);
    this._traceRoot = traceRoot(config);
    this._traceLabel = undefined;
    // What the card asks for beats what the template says it wants.
    this._gridOptions = config.grid_options ?? (templateConfig as { grid_options?: unknown }).grid_options;
    this._warnMisplacedOverrides(templateConfig, config);
    // Still built exactly as before: a deprecated template is a note to whoever keeps the
    // dashboard, said once in the console and listed in the health panel. Choosing by
    // domain, it is said of the templates the copies actually get.
    if (!picker) warnIfDeprecated(config.template, templateConfig, this._hass);
    /*
     * A time said in words - `relative`, `age` - is right when the card builds and wrong a
     * minute later unless the card builds again, so a card using one and following nothing
     * is told so, once per config (idea 38).
     */
    if (!this._rebuildOn.length && this._timeWarnedFor !== this._lastConfig && usesTimeStep(templateConfig)) {
      this._timeWarnedFor = this._lastConfig;
      warn({
        kind: 'rebuild_on',
        message: localize('warn.stale_time_step', { template: config.template ?? BY_DOMAIN_KEY }, this._hass),
        template: config.template,
        card: typeof config.name === 'string' ? config.name : undefined,
      });
    }

    /*
     * A resolver reads the registry, and the registry can arrive after the card has first
     * rendered - so remember what to build if it changes under us. Recorded before the
     * branching, not after: a template using `[[entity|friendly_name]]` needs building
     * again whether it is rendered once or repeated, and recording it only on the plain
     * path left every copy of a repeat showing the brackets for good.
     */
    const { itemTemplates } = this._buildExtras();
    const resolvers = picker ? picker.resolvers : usesResolver(templateConfig, itemTemplates);
    const translates = !!usesTranslate(templateConfig, itemTemplates);
    const installs = !!usesInstalled(templateConfig, itemTemplates);
    // A template that reads the viewer's language or locale - `|translate`, `|format_number`
    // - is recorded too, even with nothing to resolve, so it builds again when the language
    // changes rather than keeping its first wording for good (idea 40).
    this._fromResolvers =
      resolvers || translates ? { templateConfig, config, picker, translates, installs } : undefined;
    this._listenForInstalled();
    // What was just built is up to date with the hass in hand; only a later change rebuilds.
    this._resolverRegistry = this._hass ? this._resolverKey(this._hass, translates, installs) : undefined;

    // A single mapping counts as a list of one, the same forgiveness `variables` gets. A
    // written-out list wins over a registry source: it is the more particular of the two,
    // and having both silently pick one would be worse than having it say which.
    const items = forEachItems(config.for_each);
    if (items) {
      this._setForEach(templateConfig, config, items, picker);
      return;
    }
    if (isRegistrySource(config.for_each_from)) {
      // It works itself out again on a registry change already, which covers its resolvers.
      this._fromResolvers = undefined;
      this._fromRegistry = { templateConfig, config, picker };
      // setConfig runs before hass is ever set, so the first resolution usually waits.
      if (this._hass) this._resolveFromRegistry(this._hass);
      return;
    }
    this._setTemplateConfig(templateConfig, config.variables, config.style, config.template, config);
  }

  /*
   * A `card:` block on a card whose template builds a badge is never read, which looks
   * exactly like the override not working. Said once per config rather than refused: the
   * template may be switched to the matching kind in a moment.
   */
  private _warnMisplacedOverrides(templateConfig: TemplateConfig, config: DeclutteringCardConfig): void {
    if (this._misplacedWarnedFor === config) return;
    this._misplacedWarnedFor = config;
    const kind = getThingType(templateConfig);
    for (const key of misplacedOverrides(config, kind)) {
      warn({
        kind: 'override_misplaced',
        message: localize(
          'warn.override_misplaced',
          { key, kind: kind as string, template: config.template },
          this._hass,
        ),
        template: config.template,
        card: typeof config.name === 'string' ? config.name : undefined,
      });
    }
  }

  /*
   * What a build depends on besides the states it lists: the registry, and - for a template
   * that translates or formats for the viewer - hass.localize, which Home Assistant replaces
   * when the language changes or more translations load, and only then. Only a template
   * that translates pays for that part of the key.
   */
  private _resolverKey(hass: HomeAssistant, translates: boolean, installs = false): unknown[] {
    return [
      ...registryKey(hass),
      ...(translates ? [(hass as { localize?: unknown })?.localize] : []),
      // What is installed moves without the registry: components load, cards and icon sets register.
      ...(installs ? installedKey(hass) : []),
    ];
  }

  /*
   * A template whose placeholders ask Home Assistant for something is built again when the
   * registry changes, so a name that was not known yet at first render turns up rather
   * than leaving the placeholder on the card for good. Guarded the same way the registry
   * source is: hass is replaced on every state change, the registry is not.
   */
  private _rebuildForResolvers(hass: HomeAssistant): void {
    const pending = this._fromResolvers;
    if (!pending) return;

    // `|translate` reads hass.localize, which is replaced when more translations load or
    // the language changes - and only then, so it joins the key without costing a rebuild
    // per state change. Only for a template that translates, so nobody else pays for it.
    const key = this._resolverKey(hass, !!pending.translates, !!pending.installs);
    if (sameRegistry(this._resolverRegistry, key)) return;
    this._resolverRegistry = key;

    // Built the same way it was built the first time, so a repeat comes back as a repeat.
    // Outside setConfig nobody catches a throw - and a card with on_error: lives on after
    // one - so the card says it itself.
    try {
      const items = forEachItems(pending.config.for_each);
      if (items) {
        this._setForEach(pending.templateConfig, pending.config, items, pending.picker);
        return;
      }
      this._setTemplateConfig(
        pending.templateConfig,
        pending.config.variables,
        pending.config.style,
        pending.config.template,
        pending.config,
      );
    } catch (err) {
      this._error = (err as Error)?.message ?? String(err);
    }
  }

  /*
   * The copies a registry source asks for. hass arrives on every state change, so the work
   * is skipped unless the registry itself has moved - otherwise a dashboard of these would
   * rebuild itself several times a second.
   */
  private _resolveFromRegistry(hass: HomeAssistant): void {
    const source = this._fromRegistry;
    if (!source) return;

    // A repeat over views reads the dashboard's configuration, which is replaced as a
    // whole when the dashboard is edited - so its views are part of the key too.
    // The rendered templates are swapped for a new object when one lands, so that
    // counts as a change too.
    const context = { ...sourceContext(getLovelaceConfig()), rendered: this._rendered };
    const key = [...registryKey(hass), context.views, context.rendered];
    if (sameRegistry(this._registry, key)) return;

    // Its placeholders filled in from the card's variables first, so a filter can be built
    // from them (#309).
    const from = fillSource(source.config.for_each_from, source.config.variables, source.templateConfig, hass);

    // A template source builds nothing until its template has rendered - building with no
    // copies first would flash the `empty:` card at everyone on every page load.
    const template = sourceTemplate(from);
    if (template !== undefined && !Object.prototype.hasOwnProperty.call(this._rendered, template)) {
      this._renderSourceTemplate(hass, template);
      return;
    }
    this._registry = key;

    try {
      const items = resolveRegistryItems(hass, from, context);
      this._setForEach(source.templateConfig, source.config, items, source.picker);
      this._error = undefined;
      this._errorDetail = undefined;
    } catch (err) {
      // Thrown from outside setConfig, where Home Assistant would catch it, so the card
      // has to report it itself rather than leaving the old copies on screen.
      this._error = (err as Error)?.message ?? String(err);
    }
  }

  /*
   * Renders a source's template once (see template-source.ts for why only once), keeps the
   * answer, and builds. A render that failed, or that is not a list, is said in the
   * console and builds no copies - the `empty:` card, if there is one.
   */
  private _renderSourceTemplate(hass: HomeAssistant, template: string): void {
    if (this._rendering.has(template)) return;
    this._rendering.add(template);
    const owner = this._renderedFor;
    void renderTemplateOnce(hass, template).then((render) => {
      // Answered for a config the card no longer has: the new one renders for itself.
      if (this._renderedFor !== owner) return;
      this._rendering.delete(template);
      this._rendered = { ...this._rendered, [template]: render };
      warnUnlisted(template, render, this._hass ?? hass);
      this._resolveFromRegistry(this._hass ?? hass);
    });
  }

  /*
   * Home Assistant does not carry the label registry on hass, so a card that shows labels
   * fetches it (once per page, in labels.ts) and rebuilds when it lands - the registry key
   * includes it, so the ids on screen turn into names without waiting for a state change.
   * Only cards that mention labels at all ask, so nobody else pays for the call.
   */
  private _loadLabelsIfWanted(hass: HomeAssistant): void {
    const using = [this._fromRegistry, this._fromResolvers].filter(Boolean);
    const labels = using.some((source) => /label/i.test(JSON.stringify(source)));
    // Categories the same way, for a repeat narrowing by one - see categories.ts.
    const categories = !!this._fromRegistry && wantsCategories(this._fromRegistry.config.for_each_from);
    if (!labels && !categories) return;
    // Renaming or filing into a category changes nothing on hass, so nothing else would
    // rebuild the card when the registry is fetched again. The registry key moves with it.
    if (categories && !this._categoriesStop) {
      this._categoriesStop = whenCategoriesChange(() => {
        if (this._hass) this._resolveFromRegistry(this._hass);
      });
    }
    void Promise.all([labels ? loadLabels(hass) : undefined, categories ? loadCategories(hass) : undefined]).then(
      () => {
        // `hass` is a setter here with no getter, so the latest one is `_hass` - reading
        // `this.hass` gives undefined and the rebuild never happens.
        const latest = this._hass ?? hass;
        this._resolveFromRegistry(latest);
        this._rebuildForResolvers(latest);
      },
    );
  }

  /*
   * Integration names are in Home Assistant's `title` translations, which a dashboard does
   * not necessarily have loaded. A card using `|translate` asks for them once per page;
   * when they land hass.localize is replaced, which rebuilds the card - see above.
   */
  private _loadTranslationsIfWanted(hass: HomeAssistant): void {
    if (!this._fromResolvers?.translates) return;
    void loadTitleTranslations(hass).then(() => this._rebuildForResolvers(this._hass ?? hass));
  }

  /*
   * hass arrives on every state change anywhere in the house, so this compares only the
   * listed entities' states, and only against the last ones seen - a card is not put back
   * on its timer by changes it does not care about, or it would never get to build on a
   * busy system. A burst of changes builds once, a moment after the last of them.
   */
  private _watchRebuildOn(hass: HomeAssistant): void {
    if (!this._rebuildOn.length || !this._lastConfig) return;
    const now = stateSnapshot(hass, this._rebuildOn, this._rebuildAttributes);
    if (!statesMoved(this._rebuildSeen, now)) return;
    this._rebuildSeen = now;
    if (this._rebuildTimer) clearTimeout(this._rebuildTimer);
    this._rebuildTimer = setTimeout(() => {
      this._rebuildTimer = undefined;
      // Back where it was built: nothing to do.
      if (!statesMoved(this._rebuildBuilt, stateSnapshot(this._hass, this._rebuildOn, this._rebuildAttributes))) return;
      try {
        this._rebuild();
      } catch (err) {
        // Outside setConfig nobody catches a throw, so the card says it itself.
        this._error = (err as Error)?.message ?? String(err);
      }
    }, REBUILD_DEBOUNCE_MS);
  }

  /*
   * Something in `rebuild_on:` that is not an entity id is never watched, which looks
   * exactly like the card not reacting. Said once per config rather than refused.
   */
  private _warnRebuildOn(config: DeclutteringCardConfig): void {
    // Keyed on the config as given: the one read here can be a fresh copy on every build.
    if (this._rebuildWarnedFor === this._lastConfig) return;
    this._rebuildWarnedFor = this._lastConfig;
    const rejects = rebuildOnRejects(config.rebuild_on);
    if (rejects.length) {
      warn({
        kind: 'rebuild_on',
        message: localize(
          'warn.rebuild_on_not_entity',
          { which: rejects.join(', '), template: config.template },
          this._hass,
        ),
        template: config.template,
        card: typeof config.name === 'string' ? config.name : undefined,
      });
    }
  }

  /*
   * A card whose template is on its own dashboard builds at once, without waiting for the
   * library dashboard, whose decluttering_defaults and decluttering_variables reach it too
   * (#343). Waiting would hold up every card on every dashboard for a library most installs
   * do not have, so it builds now - quiet about anything it leaves unset - and builds once
   * more when the library turns out to give something, or the build left a name unset that
   * it has to speak up about. After the first read the library is known and nothing waits.
   */
  // Every dashboard this one borrows from counts, not just the library: an item template
  // can live on any of them (#375), and a card built before they are read has missed it.
  private _noteLibrary(ll: LovelaceConfig): void {
    this._libraryUnsettled = !borrowedKnown(ll) && mayBorrowTemplates(ll);
    this._missedBeforeLibrary = false;
  }

  private _catchUpWithLibrary(hass: HomeAssistant): void {
    if (!this._libraryUnsettled) return;
    this._libraryUnsettled = false;
    loadBorrowed(hass, getLovelaceConfig())
      .then((gives) => {
        if (gives || this._missedBeforeLibrary) this._rebuild();
      })
      .catch(() => undefined);
  }

  protected hassAvailable(hass: HomeAssistant): void {
    watchForTrash(hass);
    trashHass(hass);
    const config = this._pendingConfig;
    if (!config) {
      this._catchUpWithLibrary(hass);
      this._watchRebuildOn(hass);
      this._resolveFromRegistry(hass);
      this._rebuildForResolvers(hass);
      this._loadLabelsIfWanted(hass);
      this._loadTranslationsIfWanted(hass);
      return;
    }
    this._pendingConfig = undefined;
    // Built from a read that took the library in, so there is nothing to catch up with.
    this._libraryUnsettled = false;

    const ll = getLovelaceConfig();
    const place = this._place(ll);
    if (byDomainOf(config)) {
      collectAllTemplates(hass, ll, place.view, undefined, place.section)
        .then((all) => {
          // Thrown from outside setConfig, where nobody would catch it, so the card says it.
          this._applyByDomainOrSay(all, config);
          if (!this._error) this._loadLabelsIfWanted(hass);
        })
        .catch((err) => {
          this._error = localize(
            'error.template_resolve_failed',
            { template: config.template ?? BY_DOMAIN_KEY, message: err?.message ?? err },
            hass,
          );
        });
      return;
    }
    findTemplateAnywhere(hass, ll, config.template, place.view, place.section)
      .then((templateConfig) => {
        if (templateConfig) {
          this._buildOrDefer(templateConfig, config);
          this._loadLabelsIfWanted(hass);
          this._loadTranslationsIfWanted(hass);
        } else {
          // Only a dashboard that names somewhere to borrow from is told it was looked for there.
          const key = getTemplateSources(ll).length ? 'error.template_missing_anywhere' : 'error.template_missing';
          const missing = localize(key, { template: config.template }, hass);
          const notFound = localize('errorcard.not_found', undefined, hass);
          this._errorDetail = missingTemplateDetail(ll, config.template, [], notFound);
          this._error = missing;
          // Every name there is, borrowed ones included, is known by the time this runs.
          // Not added once `on_error:` has taken the error's place - it has been said.
          collectAllTemplates(hass, ll).then((all) => {
            if (this._error !== missing) return;
            this._errorDetail = missingTemplateDetail(ll, config.template, Object.keys(all), notFound);
            this._error = missing + didYouMean(config.template, Object.keys(all));
          });
        }
      })
      .catch((err) => {
        this._error = localize(
          'error.template_resolve_failed',
          { template: config.template, message: err?.message ?? err },
          hass,
        );
      });
  }
}
