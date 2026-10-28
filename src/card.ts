import { PropertyValues } from 'lit';
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
  mayBorrowTemplates,
  misplacedOverrides,
  BY_DOMAIN_KEY,
  byDomainOf,
  pickTemplate,
  withPickedEntity,
  warnIfDeprecated,
} from './templates';
import { trashHass, watchForTrash } from './trash';
import { forEachItems, usesResolver, usesTranslate, withInheritedVariables } from './variables';
import { chainOf, describeCycle, describeTooDeep, findCycle, MAX_NESTING } from './cycles';
import { customTags, OnError, onErrorOf, undefinedElements } from './on-error';
import { isRegistrySource, registryKey, resolveRegistryItems, sameRegistry } from './registry';
import { loadLabels } from './labels';
import { loadCategories, wantsCategories, whenCategoriesChange } from './categories';
import { renderTemplateOnce, sourceTemplate, TemplateRender } from './template-source';
import { getLovelaceConfig } from './utils';
import { localize } from './localize';
import { REBUILD_DEBOUNCE_MS, rebuildOnEntities, rebuildOnRejects, stateSnapshot, statesMoved } from './rebuild';
import { handedDownNames, traceRoot, tracePlace, wantsTrace } from './trace';
import { DeclutteringElement } from './element';
import { CARD_EDITOR_TAG, CARD_TAG, TemplatePicker, getThingType, sourceContext, warnUnlisted } from './shared';
import { warn } from './warnings';

/*
 * Home Assistant's `title` translations - every integration's name - asked for once per
 * page and language, by the first card that uses `|translate`. Per language because they
 * are loaded for the language of the moment: switch it, and the names in the new one have
 * to be asked for again, or every `|translate` stays in the old one until a reload. A Home
 * Assistant without the call, or one where it fails, leaves `|translate` giving back what it
 * was given, as it always may.
 */
const titleTranslations = new Map<string, Promise<void>>();

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
    picker?: TemplatePicker;
  };
  private _resolverRegistry?: unknown[];
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
  private _rebuildTimer?: ReturnType<typeof setTimeout>;
  private _rebuildWarnedFor?: unknown;

  // What `on_error:` is filled in from: the card's own variables, and its template once found.
  private _fallbackSource?: { variables?: VariablesConfig[]; template?: TemplateConfig; name?: string };
  // The error `on_error:` is standing in for, while it is, and the config built for it.
  private _fallbackFor?: string;
  private _fallbackConfig?: LovelaceThingConfig;
  private _buildingFallback = false;
  // Set when `on_error:` itself could not be shown, which leaves the error showing instead of looping.
  private _fallbackFailed = false;

  /*
   * Asks the hui-card or hui-badge around this card to leave it on the page while it is
   * hidden. They would otherwise take it off, and a card that is off the page stops
   * watching the card inside it, so it would never notice that card coming back.
   */
  public connectedWhileHidden = true;

  public connectedCallback(): void {
    super.connectedCallback();
    // Home Assistant takes cards off the page and puts them back while it lays a view out,
    // which stops the card hearing about categories (below); put back, it starts again.
    if (this._hass && this._fromRegistry) this._loadLabelsIfWanted(this._hass);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._categoriesStop?.();
    this._categoriesStop = undefined;
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
    if (changedProperties.has('preview') && this.preview && this._lazyShown) {
      try {
        this._rebuild();
      } catch (err) {
        this._error = (err as Error)?.message ?? String(err);
      }
    }
  }

  // The editors live in a chunk of their own, fetched the first time one is opened (idea 4).
  static async getConfigElement(): Promise<HTMLElement> {
    await import('./editors');
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
    this._fallbackFor = undefined;
    this._fallbackConfig = undefined;
    this._fallbackFailed = false;
    this._fallbackSource = { variables: withInheritedVariables(config).variables, name: config.template };
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
    const templateConfig = findTemplate(ll, config.template, place.view, place.section);
    /*
     * setConfig runs before hass is ever set, and a card that reads states has none to read
     * yet - built now, every `|state` would be left in brackets and complained about, only
     * to be built again a moment later. It waits for hass instead, the way a borrowed
     * template does.
     */
    if (templateConfig && this._rebuildOn.length && !this._hass) {
      this._pendingConfig = config;
      return;
    }
    if (templateConfig) {
      this._pendingConfig = undefined;
      this._applyTemplate(templateConfig, config);
      return;
    }
    if (!mayBorrowTemplates(ll)) {
      throw new Error(
        localize('error.template_missing', { template: config.template }, this._hass) +
          didYouMean(config.template, Object.keys(collectTemplates(ll))),
      );
    }
    // The template may live on a dashboard this one borrows from, or on the library
    // dashboard every one borrows from, which has to be fetched.
    // setConfig cannot wait, so it is picked up as soon as hass arrives.
    this._pendingConfig = config;
    if (this._hass) this.hassAvailable(this._hass);
  }

  protected _rebuild(): void {
    if (this._lastConfig) this.setConfig(this._lastConfig);
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
      const built = deepReplace(
        this._fallbackSource?.variables,
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
    if (this._onError()) void this._checkDefined(config);
  }

  /*
   * A card that builds a custom card nobody installed is the one failure Home Assistant
   * reports rather than this card - by drawing its own error where the card should be. With
   * `on_error:` set it is caught here instead, after the same short wait Home Assistant
   * gives a resource still loading. If the element does turn up later, the card builds again.
   */
  private async _checkDefined(config: LovelaceThingConfig): Promise<void> {
    const tags = customTags(config);
    if (!tags.length) return;
    const missing = await undefinedElements(tags);
    if (!missing.length || this._thingConfig !== config) return;
    const message = localize(
      'error.custom_element_missing',
      { types: missing.map((tag) => `custom:${tag}`).join(', ') },
      this._hass,
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
    if (named.every((name) => local[name] !== undefined) || !mayBorrowTemplates(ll)) {
      this._pendingConfig = undefined;
      this._applyByDomain(local, config);
      return;
    }
    this._pendingConfig = config;
    if (this._hass) this.hassAvailable(this._hass);
  }

  /*
   * Builds a card choosing by domain from the templates there are. A single card chooses
   * once and is then built exactly as though it had named that template. A repeat keeps the
   * way of choosing, so each copy - and each rebuild - picks its own; the template the card
   * falls back on stands for the whole card where one has to, in its styles, its size and
   * its `empty:`.
   */
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
    this._rebuildBuilt = this._rebuildOn.length ? stateSnapshot(this._hass, this._rebuildOn) : undefined;
    this._rebuildSeen = this._rebuildBuilt;
    this._applyGap(config.gap);
    this._strict = config.strict === true;
    this._debug = config.debug === 'yaml' ? 'yaml' : config.debug === true ? 'json' : false;
    this._trace = wantsTrace(config);
    this._reportMode = config.debug === 'report';
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
     * A resolver reads the registry, and the registry can arrive after the card has first
     * rendered - so remember what to build if it changes under us. Recorded before the
     * branching, not after: a template using `[[entity|friendly_name]]` needs building
     * again whether it is rendered once or repeated, and recording it only on the plain
     * path left every copy of a repeat showing the brackets for good.
     */
    const { itemTemplates } = this._buildExtras();
    const resolvers = picker ? picker.resolvers : usesResolver(templateConfig, itemTemplates);
    this._fromResolvers = resolvers
      ? { templateConfig, config, picker, translates: usesTranslate(templateConfig, itemTemplates) }
      : undefined;

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
    const key = pending.translates
      ? [...registryKey(hass), (hass as { localize?: unknown })?.localize]
      : registryKey(hass);
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
    const now = stateSnapshot(hass, this._rebuildOn);
    if (!statesMoved(this._rebuildSeen, now)) return;
    this._rebuildSeen = now;
    if (this._rebuildTimer) clearTimeout(this._rebuildTimer);
    this._rebuildTimer = setTimeout(() => {
      this._rebuildTimer = undefined;
      // Back where it was built: nothing to do.
      if (!statesMoved(this._rebuildBuilt, stateSnapshot(this._hass, this._rebuildOn))) return;
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

  protected hassAvailable(hass: HomeAssistant): void {
    watchForTrash(hass);
    trashHass(hass);
    const config = this._pendingConfig;
    if (!config) {
      this._watchRebuildOn(hass);
      this._resolveFromRegistry(hass);
      this._rebuildForResolvers(hass);
      this._loadLabelsIfWanted(hass);
      this._loadTranslationsIfWanted(hass);
      return;
    }
    this._pendingConfig = undefined;

    const ll = getLovelaceConfig();
    const place = this._place(ll);
    if (byDomainOf(config)) {
      collectAllTemplates(hass, ll, place.view, undefined, place.section)
        .then((all) => {
          // Thrown from outside setConfig, where nobody would catch it, so the card says it.
          try {
            this._applyByDomain(all, config);
            this._loadLabelsIfWanted(hass);
          } catch (err) {
            this._error = (err as Error)?.message ?? String(err);
          }
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
          this._applyTemplate(templateConfig, config);
          this._loadLabelsIfWanted(hass);
          this._loadTranslationsIfWanted(hass);
        } else {
          // Only a dashboard that names somewhere to borrow from is told it was looked for there.
          const key = getTemplateSources(ll).length ? 'error.template_missing_anywhere' : 'error.template_missing';
          const missing = localize(key, { template: config.template }, hass);
          this._error = missing;
          // Every name there is, borrowed ones included, is known by the time this runs.
          // Not added once `on_error:` has taken the error's place - it has been said.
          collectAllTemplates(hass, ll).then((all) => {
            if (this._error === missing) this._error = missing + didYouMean(config.template, Object.keys(all));
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
