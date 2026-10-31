import { LitElement, html, TemplateResult, css, CSSResult, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant, createThing, LovelaceCard } from 'custom-card-helpers';
import {
  DeclutteringCardConfig,
  TemplateConfig,
  VariablesConfig,
  LovelaceThing,
  LovelaceThingConfig,
  LovelaceThingType,
} from './types';
import deepReplace, { BuildExtras, cssSafe } from './deep-replace';
import {
  hasSectionDefaults,
  viewIndexFromPath,
  applyOverride,
  groupCard,
  GROUP_CARD_TYPE,
  BY_DOMAIN_KEY,
  withPickedEntity,
  itemTemplatesOf,
} from './templates';
import {
  forEachVariables,
  inheritableVariables,
  ownVariables,
  hasRequiredVariables,
  withStateScope,
} from './variables';
import { chainWith, withChain, withInherited, withoutStamps } from './cycles';
import { columnsFor, eagerCopies } from './layout';
import { copyText, getLovelace, getLovelaceConfig } from './utils';
import { localize, onLanguageLoaded } from './localize';
import { VERSION } from './version';
import { toYaml } from './yaml';
import { formatReport } from './report';
import {
  BUILD_LOG,
  BuildTrace,
  ExpansionResult,
  logTrace,
  nestedCardPaths,
  endExpansion,
  newExpansionId,
  newTrace,
  reportExpansion,
  startExpansion,
  TracePlace,
  TraceReport,
  TraceRoot,
  TraceSection,
  traceLabel,
  variableRows,
  withTrace,
} from './trace';
import {
  HELPERS,
  LAZY_COPY_TAG,
  THING_TYPE_KEYS,
  TemplatePicker,
  currentViewIndex,
  dialogPlace,
  editDialogOf,
  getThingType,
  parentOf,
  sourceContext,
  thingContent,
} from './shared';
import { warn } from './warnings';
import { isRegistrySource } from './registry';

/** Where a card sits in a sections view: the view, and the section's place in it. */
type SectionPlace = { view: number; section: number };

/*
 * Which section a card sits in, read off the hui-section it is rendered inside - through
 * any stacks, grids and shadow roots in between. Nothing hands a card this, and it can
 * only be read once the card is on the page. A card anywhere else - a masonry view, a
 * badge - is in no section. The edit dialog's preview draws the card inside a section of
 * its own that knows no place, so there it is the section the card being edited is in.
 */
function sectionOf(element: Element): SectionPlace | undefined {
  for (let node: Node | null = element; node; node = parentOf(node)) {
    if ((node as Element).localName === 'hui-section') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { index, viewIndex } = node as any;
      if (Number.isInteger(index) && Number.isInteger(viewIndex)) return { view: viewIndex, section: index };
    }
    if ((node as Element).localName === 'hui-dialog-edit-card') {
      const place = dialogPlace(node as Element);
      return place?.view !== undefined && place.section !== undefined
        ? { view: place.view, section: place.section }
        : undefined;
    }
  }
  return undefined;
}

// Past this many copies on one card a repeat is worth mentioning. Well above a house's
// worth of lights, so an ordinary dashboard never sees it.
const MANY_COPIES = 50;

// Whether a Markdown card has been asked for, so `debug: report` can show its report formatted.
let markdownRequested = false;

/*
 * A picture element is centred on its position and clipped by the card it sits in, so an
 * element's debug view - far bigger than the icon it stands in for - lost its top and
 * bottom, with no way to scroll to them (discussion #150). In debug it covers the card
 * from the top-left corner instead, and scrolls when the config is longer than that.
 */
const DEBUG_ELEMENT_STYLE: Record<string, string> = {
  top: '0',
  left: '0',
  transform: 'none',
  width: '100%',
  height: '100%',
  overflow: 'auto',
  'z-index': '1',
};

export abstract class DeclutteringElement extends LitElement {
  @state() protected _hass?: HomeAssistant;
  @state() private _thing?: LovelaceThing;

  // Home Assistant sets both of these on a card element directly. They are declared so
  // that assigning them triggers an update, which is what passes them on to the wrapped
  // card - a preview has to render whether or not its visibility conditions are met, and
  // the layout tells the card whether it is in a section or a panel.
  @property({ type: Boolean }) public preview = false;
  @property({ attribute: false }) public layout?: string;
  /*
   * Home Assistant hands `preview` to a card element, but not to a badge element:
   * hui-badge reads its own `preview` to decide whether to ignore `visibility`, and
   * never passes it on to the badge it built. So a badge made from a template was the
   * one thing on a dashboard that stayed hidden while the dashboard was being edited,
   * with no way to select it and no sign it was there at all - upstream issue #117.
   *
   * The wrapper does know, so it is read from there instead. Only the badge path needs
   * this; a card already gets told.
   */
  @state() private _wrapperPreview = false;

  protected _thingConfig?: LovelaceThingConfig;
  protected _thingType?: LovelaceThingType;
  // One observer for the element's lifetime. A new one per wrapped card leaked a live
  // observer on every reconfigure, and left them all running after the card was gone.
  private _resizes?: ResizeObserver;
  // The template this element renders, and the ones already open above it. Together they
  // are what stops a template that uses itself from building levels forever.
  protected _templateName?: string;
  protected _gridOptions?: unknown;
  protected _strict = false;
  // `debug: console`: the card renders as normal and logs how it was built (#160).
  protected _trace = false;
  // What this card's console entry calls it, and where a logging card around it put it.
  protected _traceLabel?: string;
  protected _tracePlace?: TracePlace;
  // The outermost logging card this one reports what it built to, when it is nested in one.
  protected _traceRoot?: TraceRoot;
  // Which of the card's variables were handed down to it, so the log can say so.
  protected _handedDown: string[] = [];
  @state() protected _debug: false | 'json' | 'yaml' = false;
  // `debug: report` (#207): the card renders as normal, with its build written out underneath to copy.
  protected _reportMode = false;
  // This card's own entry from its last build, and which build the report on show belongs to.
  protected _lastReport?: TraceReport;
  private _reportFor?: string;
  // The build this card is the outermost of, still open while cards inside it are missing.
  private _expansionId?: string;
  @state() protected _reportResult?: ExpansionResult;
  private _reportCache?: { result: ExpansionResult; error?: string; unredacted: boolean; text: string };
  @state() private _reportCopied = false;
  // `redact: false` (#217): the report keeps everything as the card has it.
  protected _reportUnredacted = false;
  // The report on the card as Markdown source rather than formatted.
  @state() private _reportRaw = false;
  protected _openTemplates: string[] = [];
  // The entities this card rebuilds on, which are also the only ones `|state` can read.
  protected _rebuildOn: string[] = [];
  // The copies of a repeated template, kept so the layout can change without resolving
  // them again, and the column count currently on show so it only rebuilds when it moves.
  private _forEach?: {
    cards: unknown[];
    max: number;
    minWidth?: number;
    styles: string;
    group: boolean;
    // Each copy already told which template it was built from, which differs copy to copy
    // when the card chooses by domain - so the whole must not be told one name over the top.
    chained: boolean;
  };
  private _columnsShown?: number;
  // The size a repeat was last mentioned at, so a rebuild does not say it all over again.
  private _manyWarnedFor?: number;
  // Whether the copies on show include some still waiting to come into view.
  protected _lazyShown = false;
  private _widths?: ResizeObserver;
  private _savedStyles?: Map<string, [string, string]>;
  @state() private _style?: string;

  @state() protected _error?: string;

  /** Whether this card was asked to give up its box in the layout. */
  @state() protected _fitContents = false;

  // The section this element was last found in, once it has been on the page.
  protected _section?: SectionPlace;
  // Set when the last build kept quiet about unset variables because the section, which
  // may well give them, was not known yet - see _placeUnsettled.
  protected _builtQuietly = false;
  // Set while a card builds before the library dashboard has been read (#343): its values
  // may fill what this build leaves unset, so the build keeps quiet about them, and says
  // whether it left anything, for the card to build again once the library is in.
  protected _libraryUnsettled = false;
  protected _missedBeforeLibrary = false;
  // What the builds of one config have said in the console, so building it again says only
  // what is new - see _saidFor.
  private _said?: { config: unknown; messages: Set<string> };
  // The wrapped card a sections view has been told the size of.
  private _sizeAnnounced?: LovelaceThing;

  set hass(hass: HomeAssistant) {
    if (!hass) return;
    this._hass = hass;
    if (this._thing) this._thing.hass = hass;
    this.hassAvailable(hass);
  }

  /** hass as a build reads it: allowed the state of what this card rebuilds on, and nothing else. */
  protected get _buildHass(): HomeAssistant | undefined {
    return withStateScope(this._hass, this._rebuildOn);
  }

  // Overridden by the card, which may need the connection to fetch a template that lives
  // on another dashboard. setConfig runs before hass is ever set, so the work waits here.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected hassAvailable(_hass: HomeAssistant): void {}

  /*
   * The view and section whose decluttering_defaults and decluttering_let apply. The section, when known, also
   * says which view - more surely than the URL does. Before the card is on the page there
   * is only the URL.
   */
  protected _place(ll: Parameters<typeof viewIndexFromPath>[0]): { view?: number; section?: number } {
    if (this._section) return { view: this._section.view, section: this._section.section };
    // A preview in the edit dialog: the view of the card being edited.
    const dialog = editDialogOf(this);
    const fromDialog = dialog ? dialogPlace(dialog) : undefined;
    if (fromDialog?.view !== undefined) return { view: fromDialog.view };
    return { view: currentViewIndex(ll) };
  }

  // Overridden to build again with the config last given. Only called when a section on
  // one side of the move has values of its own, as otherwise nothing would change.
  protected _rebuild(): void {}

  /*
   * A card with rebuild_on: builds again every time a state it watches changes, and each
   * build said the same thing in the console again - a |state of an entity it does not
   * list, say, once a second on a busy sensor. Each config's warnings are said once; the
   * same config built again only says what it has not said already, and a new one (an
   * edit) starts afresh.
   */
  protected _saidFor(config: unknown): Set<string> {
    const said = this._said;
    if (said && said.config === config) return said.messages;
    const messages = new Set<string>();
    this._said = { config, messages };
    return messages;
  }

  /*
   * Whether a build now would be a guess at the card's section. setConfig builds before the
   * card is on the page, so in a sections view where some section has a decluttering_let or
   * decluttering_defaults, the first build lacks them and said `[[slet]]` had no value - a
   * moment before the build on the page gave it one. That build keeps quiet instead, and the
   * card builds again once it is on the page, saying whatever is still true then.
   */
  protected get _placeUnsettled(): boolean {
    if (this._section || this.isConnected) return false;
    const ll = getLovelaceConfig();
    const view = currentViewIndex(ll);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sections: unknown[] = view === undefined ? [] : ((ll as any)?.views?.[view]?.sections ?? []);
    return (
      Array.isArray(sections) &&
      sections.some((_, section) => hasSectionDefaults(ll, { view: view as number, section }))
    );
  }

  /*
   * Set while a card's `on_error: hide` stands in for a card that could not be built: it
   * counts as hidden, so it gives up its place the way a card hiding itself does.
   */
  protected _hiddenByFallback = false;

  // Told every config this element has just been handed to build, for a card to look over.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _afterResolved(_config: LovelaceThingConfig): void {}

  // Forgets the copies of a repeat, so a change of width cannot lay them out over what replaced them.
  protected _stopRepeat(): void {
    this._forEach = undefined;
    this._widths?.disconnect();
  }

  static get styles(): CSSResult {
    return css`
      /*
       * A badge belongs to the flex row of badges, so this wrapper has to get out of the
       * way rather than box it. Styles injected with the style option still reach the
       * badge, but cannot paint on the wrapper itself.
       */
      :host(.decluttering-badge) {
        display: contents;
      }
      :host(.decluttering-container) {
        display: block;
      }
      .debug {
        padding: 12px 16px;
        text-align: start;
      }
      .debug p {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      /*
       * A card that handles taps - button-card, Mushroom - turns text selection off, and
       * the wrapped debug view would inherit that and could not be copied out (#156). The
       * same cards centre their text, which is what the start alignment above undoes.
       */
      .debug pre {
        margin: 0;
        -webkit-user-select: text;
        user-select: text;
        cursor: text;
        overflow: auto;
        font-family: var(--ha-font-family-code, monospace);
        font-size: 0.85em;
        white-space: pre-wrap;
        word-break: break-word;
      }
      /*
       * The host is an extra level between the layout and the wrapped card, so a card
       * sized against its container - fill_container on a tile, for example - would
       * otherwise measure itself against this wrapper's content height instead of the
       * space the layout gave it. Against an auto-height parent this resolves to auto,
       * so it changes nothing outside sized containers.
       *
       * Only a card is laid out that way. A picture-elements element is positioned
       * absolutely inside the card, where height: 100% stretches it over the whole
       * image instead of leaving it the size of its icon.
       */
      :host(.decluttering-card) {
        height: 100%;
      }
      /* The report sits under the card, outside the space the layout gave it. */
      :host(.decluttering-report) {
        height: auto;
      }
      .report {
        margin-top: 8px;
        padding: 12px 16px;
      }
      .report p {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .report .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 8px;
      }
      .report .formatted {
        display: block;
        margin-top: 8px;
        max-height: 600px;
        overflow: auto;
        -webkit-user-select: text;
        user-select: text;
      }
      .report pre {
        margin: 8px 0 0;
        max-height: 400px;
        -webkit-user-select: text;
        user-select: text;
        cursor: text;
        overflow: auto;
        font-family: var(--ha-font-family-code, monospace);
        font-size: 0.8em;
        white-space: pre-wrap;
        word-break: break-word;
      }
      /*
       * A card that sizes itself - a button-card given a width, say - is narrower than the
       * share of a row this wrapper is handed, and sits at the left of it, so a stack of
       * them ends up spread out instead of packed together. Asking it to fit its contents takes the
       * wrapper out of the layout so the card becomes the stack's own child and lays out
       * as it would without any of this.
       *
       * Not the default, and it cannot be: with no box there is nothing for the style
       * option to paint on, and the height above stops applying.
       */
      :host(.decluttering-fit-contents) {
        display: contents;
      }
      /*
       * Last, and it has to stay last. Every rule here is :host(.one-class), so they all
       * have the same specificity and the later one wins - which meant a hidden card kept
       * the display: block above and went on holding its place in the layout. It looked
       * right in a masonry view, where a zero-height block leaves no visible gap, and
       * wrong in a horizontal-stack, where it still took a full share of the row and
       * squeezed the cards either side of it.
       */
      :host(.child-card-hidden) {
        display: none;
      }
    `;
  }

  protected firstUpdated(): void {
    this.updateComplete.then(() => {
      this._displayHidden();
    });
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    // Cheap, and it catches a wrapper that was told about edit mode without the badge
    // being moved - whichever way round a future Home Assistant does it.
    this._syncWrapperPreview();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const thing = this._thing as any;
    if (!thing) return;
    if ('preview' in thing) {
      const previewing = this._previewing;
      if (thing.preview !== previewing) {
        thing.preview = previewing;
        /*
         * Whether the wrapped thing is hidden is otherwise noticed by watching it resize,
         * and a thing that is being un-hidden inside a host that is still display: none
         * never gets a size to report. Without this the host would stay hidden and the
         * badge it now holds would never be seen.
         */
        Promise.resolve(thing.updateComplete).then(() => this._displayHidden());
      }
    }
    if ('layout' in thing) thing.layout = this.layout;
  }

  /** True while the dashboard is being edited, however this element was told about it. */
  private get _previewing(): boolean {
    return this.preview || this._wrapperPreview;
  }

  /*
   * Reads edit mode off the hui-badge this element sits in. Nothing tells the element
   * when that changes, so it is read again every time Home Assistant moves the badge -
   * which is exactly what entering and leaving edit mode does, as the badge is put
   * inside a hui-badge-edit-mode wrapper and taken back out again. The frame after is
   * read too, because the move and the flag are not set in a guaranteed order.
   */
  private _syncWrapperPreview(): void {
    const wrapper = this.parentElement;
    if (!wrapper || wrapper.localName !== 'hui-badge') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._wrapperPreview = (wrapper as any).preview === true;
  }

  // A wrapped card can hide itself with an inline style, a stylesheet rule or the hidden
  // attribute. Only the first of those was checked before, so a card hiding itself by any
  // other means left this wrapper occupying space in the layout - upstream issue #58.
  private _childIsHidden(): boolean {
    if (this._hiddenByFallback) return true;
    const thing = this._thing;
    if (!thing) return false;
    if (thing.hasAttribute('hidden')) return true;
    // `display` is not inherited, so this stays correct even while the host is hidden.
    return getComputedStyle(thing).display === 'none';
  }

  protected _displayHidden(): void {
    if (this._childIsHidden()) {
      this.classList.add('child-card-hidden');
    } else if (this.classList.contains('child-card-hidden')) {
      this.classList.remove('child-card-hidden');
    }
  }

  protected _setTemplateConfig(
    templateConfig: TemplateConfig,
    variables: VariablesConfig[] | undefined,
    cardStyle?: string,
    templateName?: string,
    instance?: DeclutteringCardConfig,
  ): void {
    const thingType = getThingType(templateConfig);
    if (!thingType) {
      const defined = THING_TYPE_KEYS.filter((key) => (templateConfig as Record<string, unknown>)[key] !== undefined);
      throw new Error(
        defined.length
          ? localize('error.defines_both', { first: defined[0], second: defined[1] }, this._hass)
          : localize('error.defines_nothing', undefined, this._hass),
      );
    }
    this._templateName = templateName ?? this._templateName;
    const content = thingContent(templateConfig);
    const unresolved: string[] = [];
    // Only a card that uses a template has variables to hand down; a template's own preview does not.
    const inherited = instance ? (): unknown[] => this._handDown(variables, templateConfig, templateName) : undefined;
    // Only a card using a template logs; a template's own preview has nothing to say.
    const trace = this._trace && instance ? { ...newTrace(), expansion: this._traceRoot?.id } : undefined;
    if (trace)
      this._traceLabel = traceLabel(
        templateName ?? '',
        this._traceName(variables, templateConfig, templateName, instance),
      );
    const started = performance.now();
    const quiet = !!instance && this._placeUnsettled;
    this._builtQuietly = quiet;
    const hush = quiet || (!!instance && this._libraryUnsettled);
    const built = applyOverride(
      deepReplace(
        variables,
        templateConfig,
        content,
        templateName,
        this._buildHass,
        hush || this._saidFor(instance ?? templateConfig),
        (names) => unresolved.push(...names),
        0,
        trace,
        undefined,
        false,
        this._buildExtras(),
      ),
      instance,
      thingType,
    );
    const styles = this._resolveStyles(templateConfig, variables, cardStyle, templateName, trace);
    // Every card's build is noted for the health panel; a template's own preview is not a card.
    if (instance) this._noteBuild(templateName ?? '', instance, 1, started);
    if (trace) {
      this._logBuild(
        started,
        [{ variables: variableRows(variables, templateConfig, this._handedDown), trace, built: withoutStamps(built) }],
        templateConfig,
      );
    }
    this._setResolved(thingType, this._withGridOptions(thingType, built), styles, inherited);
    // Strict is held to the build on the page too, which knows the section.
    this._missedBeforeLibrary = !!instance && this._libraryUnsettled && unresolved.length > 0;
    if (!hush) this._refuseIfStrict(unresolved);
  }

  // The health panel's note of this build: which template, the card's own name, how many copies, how long.
  private _noteBuild(template: string, config: DeclutteringCardConfig, copies: number, started: number): void {
    BUILD_LOG.add({
      template,
      ...(typeof config.name === 'string' && config.name ? { name: config.name } : {}),
      copies,
      ms: performance.now() - started,
    });
  }

  private _logBuild(started: number, sections: TraceSection[], templateConfig: TemplateConfig): void {
    const report: TraceReport = {
      label: this._traceLabel ?? traceLabel(this._templateName ?? ''),
      chain: this._traceParents(),
      at: this._tracePlace?.at,
      ms: performance.now() - started,
      sections,
      template: { name: this._templateName ?? '', config: withoutStamps(templateConfig) },
    };
    logTrace(report, this._hass);
    // Kept for the outermost card's report, which this card's entry goes into once it has built.
    this._lastReport = report;
  }

  /*
   * The report on show for `debug: report`, once the cards inside have built. A card inside
   * another logging card reports to that one, so its own report only covers its own build.
   */
  private _showReport(id: string | undefined, result: ExpansionResult): void {
    if (id === this._reportFor) this._reportResult = result;
  }

  // Written out when it is shown rather than when the build finishes: `strict:` refuses after that.
  private get _reportText(): string | undefined {
    const result = this._reportResult;
    if (!result) return undefined;
    const cached = this._reportCache;
    const unredacted = this._reportUnredacted;
    if (cached && cached.result === result && cached.error === this._error && cached.unredacted === unredacted)
      return cached.text;
    const hass = this._hass as unknown as {
      config?: { version?: string };
      locale?: { language?: string };
      language?: string;
    };
    const lovelace = getLovelace() as unknown as { mode?: string } | null;
    const text = formatReport(
      {
        context: {
          version: VERSION,
          haVersion: hass?.config?.version,
          dashboard: lovelace?.mode,
          language: hass?.locale?.language ?? hass?.language,
          browser: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        },
        reports: result.reports,
        full: result.full === undefined ? undefined : withoutStamps(result.full),
        // With no cards inside to wait for, what it built is what it shows.
        built:
          result.full === undefined && !this._error && this._thingConfig ? withoutStamps(this._thingConfig) : undefined,
        neverBuilt: result.neverBuilt,
        error: this._error,
        unredacted,
      },
      this._hass,
    );
    this._reportCache = { result, error: this._error, unredacted, text };
    return text;
  }

  private async _copyReport(): Promise<void> {
    if (!this._reportText) return;
    this._reportCopied = await copyText(this._reportText);
    if (this._reportCopied) setTimeout(() => (this._reportCopied = false), 2000);
  }

  private _downloadReport(): void {
    if (!this._reportText) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([this._reportText], { type: 'text/markdown' }));
    link.download = `decluttering-${(this._templateName ?? 'card').replace(/[^\w-]+/g, '_')}-debug.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  /*
   * Formatted by Home Assistant's own Markdown element, the one the Markdown card uses. It is
   * only defined once something has needed it, so a dashboard without a Markdown card asks
   * the card helpers for one to load it, and shows the source until it has.
   */
  private _renderFormatted(text: string): TemplateResult {
    if (customElements.get('ha-markdown')) return html`<ha-markdown class="formatted" .content=${text}></ha-markdown>`;
    if (!markdownRequested) {
      markdownRequested = true;
      HELPERS?.then((helpers: { createCardElement: (config: unknown) => unknown }) =>
        helpers.createCardElement({ type: 'markdown', content: '' }),
      ).catch(() => {});
    }
    customElements.whenDefined('ha-markdown').then(() => this.requestUpdate());
    return html`<pre>${text}</pre>`;
  }

  private _renderReport(): TemplateResult | string {
    if (!this._reportMode) return '';
    const text = this._reportText;
    const ready = text !== undefined;
    return html`
      <ha-card class="report">
        <p>
          ${localize(ready ? 'report.ready' : 'report.waiting', undefined, this._hass)}
          ${localize(this._reportUnredacted ? 'report.unredacted' : 'report.check', undefined, this._hass)}
        </p>
        <div class="actions">
          <ha-button .disabled=${!ready} @click=${this._copyReport}>
            ${localize(this._reportCopied ? 'report.copied' : 'report.copy', undefined, this._hass)}
          </ha-button>
          <ha-button .disabled=${!ready} @click=${this._downloadReport}>
            ${localize('report.download', undefined, this._hass)}
          </ha-button>
        </div>
        ${
          ready
            ? html`<details>
                <summary>${localize('report.show', undefined, this._hass)}</summary>
                <ha-button class="view" @click=${() => (this._reportRaw = !this._reportRaw)}>
                  ${localize(this._reportRaw ? 'report.show_formatted' : 'report.show_markdown', undefined, this._hass)}
                </ha-button>
                ${this._reportRaw ? html`<pre>${text}</pre>` : this._renderFormatted(text)}
              </details>`
            : ''
        }
      </ha-card>
    `;
  }

  /** The cards around this one as the console names them, or the templates open above it when none of them is logging. */
  private _traceParents(): string[] {
    return this._tracePlace?.parents ?? this._openTemplates.map((template) => traceLabel(template));
  }

  // A card's own `name:` beats its template's, and either is filled in with this card's values.
  private _traceName(
    variables: VariablesConfig[] | undefined,
    templateConfig: TemplateConfig,
    templateName: string | undefined,
    instance: DeclutteringCardConfig | undefined,
  ): string | undefined {
    const name = instance?.name ?? templateConfig.name;
    if (typeof name !== 'string') return undefined;
    const filled = deepReplace(variables, templateConfig, name, templateName, this._buildHass, true);
    return typeof filled === 'string' ? filled : undefined;
  }

  /*
   * Nothing here normally stops a card rendering: a template can be edited after the cards
   * that use it, so a card that looks wrong now may be right in a moment. Somebody building
   * a template for other people wants the opposite, and `strict: true` is how they say so.
   */
  protected _refuseIfStrict(unresolved: string[]): void {
    if (!this._strict || !unresolved.length) return;
    const which = unresolved.map((name) => `[[${name}]]`).join(', ');
    this._error = localize(unresolved.length === 1 ? 'error.strict_one' : 'error.strict_many', { which }, this._hass);
  }

  // Styles always resolve against the real template config, so a declared default or a
  // `default:` entry reaches a style the same way it reaches the content.
  private _resolveStyles(
    templateConfig: TemplateConfig,
    variables: VariablesConfig[] | undefined,
    cardStyle?: string,
    templateName?: string,
    trace?: BuildTrace,
  ): string {
    // A name Home Assistant supplies is written into a declaration's value and kept there:
    // cssSafe takes out what would let it end the declaration and start its own.
    let styles = '';
    if (templateConfig.style) {
      styles += deepReplace(
        variables,
        templateConfig,
        templateConfig.style,
        templateName,
        this._buildHass,
        false,
        undefined,
        0,
        trace,
        cssSafe,
      );
    }
    if (cardStyle) {
      styles += deepReplace(
        variables,
        templateConfig,
        cardStyle,
        templateName,
        this._buildHass,
        false,
        undefined,
        0,
        trace,
        cssSafe,
      );
    }
    return styles;
  }

  /*
   * What this card hands down to a nested card that asks for its variables, with any
   * placeholders in them filled in here - in the nested card they would be read against
   * the wrong values. An optional placeholder that nothing fills drops its entry.
   */
  /*
   * SPIKE #227: what a build needs for `with:`, `repeat:` and `__repeat__` - the dashboard's
   * item templates and the context a registry source reads.
   */
  protected _buildExtras(): BuildExtras {
    const ll = getLovelaceConfig();
    // No rendered Jinja sources here: a `repeat:` over `template:` is out of the spike's scope.
    return { itemTemplates: itemTemplatesOf(ll), context: sourceContext(ll) };
  }

  private _handDown(
    variables: VariablesConfig[] | undefined,
    templateConfig: TemplateConfig,
    templateName?: string,
  ): unknown[] {
    // Escapes stay in: these values are the nested card's variables, and it substitutes them.
    const list = deepReplace(
      variables,
      templateConfig,
      inheritableVariables(variables, templateConfig),
      templateName,
      this._buildHass,
      true,
      undefined,
      0,
      undefined,
      undefined,
      true,
    );
    return (Array.isArray(list) ? list : []).filter(
      (entry: unknown) => !!entry && typeof entry === 'object' && Object.keys(entry as object).length > 0,
    );
  }

  protected _setResolved(
    thingType: LovelaceThingType,
    thingConfig: LovelaceThingConfig,
    styles: string,
    inherited?: () => unknown[],
    alreadyChained = false,
  ): void {
    // A group in a view's row of badges lays its cards out as badges, and is one itself (#184).
    if (thingType === 'card' && thingConfig.type === GROUP_CARD_TYPE && this._inBadgeRow) {
      thingType = 'badge';
      thingConfig = { ...thingConfig, badges: true };
    }
    // Anything inside this card is told which templates are open above it, so a card that
    // ends up using a template already being drawn can refuse instead of going round again.
    const chained = alreadyChained
      ? thingConfig
      : withChain(thingConfig, chainWith(this._openTemplates, this._templateName));
    const label = this._traceLabel ?? traceLabel(this._templateName ?? '');
    const named = [...this._traceParents(), label];
    /*
     * The cards inside are told which card to report to and where they sit in it, so the
     * outermost one can log the whole thing once they have all built. Not while the debug
     * view is showing: that view is all that is drawn, so nothing inside it is ever built.
     */
    const expanding = this._trace && !this._debug;
    const root: TraceRoot | undefined = expanding ? (this._traceRoot ?? { id: newExpansionId(), path: [] }) : undefined;
    const stamped = withInherited(this._trace ? withTrace(chained, named, root) : chained, inherited);
    const nested = expanding ? nestedCardPaths(chained) : [];
    const report = this._lastReport;
    if (this._expansionId) endExpansion(this._expansionId);
    this._expansionId = !this._traceRoot && root ? root.id : undefined;
    if (this._traceRoot) {
      reportExpansion(this._traceRoot, withoutStamps(chained), nested, report);
      if (this._reportMode) {
        this._reportFor = undefined;
        this._showReport(undefined, { reports: report ? [report] : [], neverBuilt: [] });
      }
    } else if (root) {
      const id = this._reportMode ? root.id : undefined;
      this._reportFor = id;
      if (id) this._reportResult = undefined;
      startExpansion(
        root.id,
        label,
        withoutStamps(chained),
        nested,
        this._hass,
        report,
        id ? (result): void => this._showReport(id, result) : undefined,
      );
    }
    this._style = styles;
    this._thingConfig = stamped;
    this._thingType = thingType;
    DeclutteringElement._createThing(stamped, thingType, (thing: LovelaceThing) => {
      if (this._thingConfig === stamped) {
        this._setThing(
          thing,
          thingType === 'element' ? (this._debug ? DEBUG_ELEMENT_STYLE : thingConfig.style) : undefined,
        );
      }
    });
    this._afterResolved(stamped);
  }

  /*
   * `for_each` renders the template once per item, which Home Assistant's own stack cards
   * already know how to lay out - so the copies are handed to a vertical-stack, or to a
   * grid when more than one column is asked for, rather than managed here. Everything
   * that applies to a single templated card then applies to each copy unchanged.
   */
  protected _setForEach(
    templateConfig: TemplateConfig,
    config: DeclutteringCardConfig,
    items: unknown[],
    picker?: TemplatePicker,
  ): void {
    /*
     * Each copy's template: the card's own, or - choosing by domain - the one its entity
     * picks, worked out from the copy's own values before anything else is done with it.
     */
    const chosen = items.map((item) => ({
      item,
      ...(picker
        ? picker.pick(forEachVariables(item, config.variables))
        : { name: config.template, template: templateConfig }),
    }));
    // Without choosing, the one template is checked whether or not there are copies, as it
    // always has been: a repeat of a row template is a mistake even while the list is empty.
    for (const copy of picker ? chosen : [{ name: config.template, template: templateConfig }]) {
      if (getThingType(copy.template) === 'card') continue;
      /*
       * Only a card can repeat. Home Assistant gives a row, a badge or a picture element a
       * single slot to fill, so there is nowhere for a second copy to go - the way to
       * repeat rows is a card template holding them, which repeats as a card like anything
       * else. Choosing by domain, every copy has to be a card for the same reason.
       */
      const kind = getThingType(copy.template) ?? localize('error.a_different_kind', undefined, this._hass);
      throw new Error(
        picker
          ? localize('error.by_domain_not_card', { template: copy.name, kind }, this._hass)
          : localize('error.for_each_not_card', { template: config.template, kind }, this._hass),
      );
    }
    /*
     * A template can say which of its variables it cannot do without, and an item that
     * leaves one of them empty describes a copy there is nothing to render - the third
     * light in a room that has two. Those items are dropped rather than rendered as a card
     * full of holes, which is what a dummy entity id was always standing in for.
     */
    const wanted = chosen.filter((copy) => hasRequiredVariables(copy.template, copy.item, config.variables));

    /*
     * A repeat that matches nothing renders nothing, which is right - a dashboard should
     * not break because a room has no motion sensor yet - but silence is indistinguishable
     * from breakage. `empty:` is how a card says "there is nothing here" on purpose.
     */
    if (!wanted.length && config.empty) {
      this._forEach = undefined;
      this._lazyShown = false;
      this._widths?.disconnect();
      this._setResolved(
        'card',
        this._withGridOptions('card', config.empty as LovelaceThingConfig),
        this._resolveStyles(templateConfig, config.variables, config.style, config.template),
        () => this._handDown(config.variables, templateConfig, config.template),
      );
      return;
    }

    /*
     * A registry sweep that matches half the house builds half the house, which reads as a
     * broken dashboard rather than a big one. Said once, naming the count, because the card
     * cannot know whether it was meant - only that it is worth a look.
     */
    const repeatName = config.template ?? BY_DOMAIN_KEY;
    if (wanted.length > MANY_COPIES && this._manyWarnedFor !== wanted.length) {
      this._manyWarnedFor = wanted.length;
      // A repeat that is not lazy yet is pointed at the setting that helps (the _lazy
      // string); one that is already lazy only builds what is near the screen, so building
      // is not the trouble - it is told about the scrolling instead.
      const key = config.lazy === true ? 'warn.many_copies_scroll' : 'warn.many_copies_lazy';
      warn({
        kind: 'many_copies',
        message: localize(key, { template: repeatName, count: wanted.length }, this._hass),
        template: repeatName,
        card: typeof config.name === 'string' ? config.name : undefined,
      });
    }

    // The card's own `card:` block is laid over every copy alike.
    // Each copy hands down its own item's values, so it is stamped here rather than as a whole.
    const started = performance.now();
    const sections: TraceSection[] = [];
    // Only the card's own name can stand for every copy; a template's names each copy apart.
    if (this._trace) {
      const own =
        config.name === undefined
          ? undefined
          : this._traceName(config.variables, templateConfig, config.template, config);
      this._traceLabel = traceLabel(repeatName, own);
    }
    // As for a single card: kept quiet until the section is known.
    const quiet = this._placeUnsettled;
    this._builtQuietly = quiet;
    const hush = quiet || this._libraryUnsettled;
    let missed = false;
    const cards = wanted.map(({ item, name, template, entity }, index) => {
      // Underneath everything the copy sets: the entity its template was picked by, when
      // that came from the fallback template rather than the copy - see pickTemplate.
      const variables = withPickedEntity(
        forEachVariables(item, config.variables, index, wanted.length),
        entity,
      ) as VariablesConfig[];
      const trace = this._trace ? { ...newTrace(), expansion: this._traceRoot?.id } : undefined;
      // What the item and its position set, as opposed to what the card set for every copy.
      // The item beats the card, and the card beats the position, as forEachVariables orders them.
      const names = (list: unknown): string[] => ownVariables(list).map((entry) => Object.keys(entry)[0]);
      const repeated = trace
        ? [
            ...names(item),
            ...['index', 'index0', 'count', 'first', 'last'].filter((each) => !names(config.variables).includes(each)),
          ]
        : [];
      // A copy from the registry: its item's values are Home Assistant's words, which a style
      // inside the card shields as it does a resolver's (review 2026-10-25).
      const haNames = isRegistrySource(config.for_each_from)
        ? new Set(ownVariables(item).map((entry) => Object.keys(entry)[0]))
        : undefined;
      const built = applyOverride(
        deepReplace(
          variables,
          template,
          thingContent(template),
          name,
          this._buildHass,
          hush || this._saidFor(config),
          this._libraryUnsettled
            ? (names: string[]) => {
                if (names.length) missed = true;
              }
            : undefined,
          0,
          trace,
          undefined,
          false,
          { ...this._buildExtras(), haNames },
        ),
        config,
        'card',
      );
      if (trace) {
        const copyName = this._traceName(variables, template, name, config);
        const copy = localize('trace.copy', { number: index + 1, count: wanted.length }, this._hass);
        sections.push({
          label: copyName ? `${copy}: "${copyName}"` : copy,
          variables: variableRows(variables, template, this._handedDown, repeated),
          trace,
          built: withoutStamps(built),
        });
      }
      // Choosing by domain, a copy is told its own template is open above what it holds -
      // the card as a whole has no one name to tell it.
      const chained = picker ? withChain(built, chainWith(this._openTemplates, name)) : built;
      return withInherited(chained, () => this._handDown(variables, template, name));
    });
    this._missedBeforeLibrary = missed;
    this._noteBuild(config.template, config, cards.length, started);
    if (this._trace) this._logBuild(started, sections, templateConfig);

    /*
     * `lazy: true`: past the first few, each copy goes into the stack as a placeholder that
     * holds its place and creates the real card as it nears the screen. Substitution is
     * string work and has already happened; creating Home Assistant's card elements - and
     * whatever nested templates build inside them - is the cost this puts off. A preview
     * and debug see everything, and a group is laid out by the section a card at a time,
     * so a group never waits.
     */
    const buildAll = this.preview || !!this._debug || this._trace || templateConfig.group !== undefined;
    const eager = eagerCopies(cards.length, config.lazy, config.lazy_eager, buildAll);
    this._lazyShown = eager < cards.length;
    const laidOut = this._lazyShown
      ? cards.map((card, index) => (index < eager ? card : { type: `custom:${LAZY_COPY_TAG}`, card }))
      : cards;

    // The styles belong to the whole card rather than to any one copy, and resolve against
    // the real template so its declared defaults still apply. Choosing by domain, each
    // template chosen brings its own, and the card's own style comes once at the end.
    const styles = picker
      ? [...new Map(wanted.map((copy) => [copy.name, copy.template])).entries()]
          .map(([name, template]) => this._resolveStyles(template, config.variables, undefined, name))
          .join('') +
        this._resolveStyles({ ...templateConfig, style: undefined }, config.variables, config.style, config.template)
      : this._resolveStyles(templateConfig, config.variables, config.style, config.template);
    this._forEach = {
      cards: laidOut,
      max: Number(config.columns) || 1,
      minWidth: Number(config.min_column_width) || undefined,
      styles,
      group: picker
        ? wanted.length > 0 && wanted.every((copy) => copy.template.group !== undefined)
        : templateConfig.group !== undefined,
      chained: !!picker,
    };
    this._columnsShown = undefined;
    this._layoutForEach();
    if (this._forEach.minWidth) this._watchWidth();
    else this._widths?.disconnect();
  }

  /*
   * Lays the copies out at the number of columns the card is currently wide enough for.
   * Rebuilding is not free, so it happens only when that number actually moves - which,
   * with a minimum width, is when the card crosses a threshold rather than on every pixel.
   */
  private _layoutForEach(): void {
    const forEach = this._forEach;
    if (!forEach) return;

    const columns = columnsFor(this.clientWidth, forEach.max, forEach.minWidth);
    if (columns === this._columnsShown) return;
    this._columnsShown = columns;

    /*
     * A vertical-stack would undo what a group is for, laying every card in each copy out
     * one under another - so copies of a group go in a group of their own, which hands the
     * section's grid on to each of them.
     */
    const stack =
      columns > 1
        ? { type: 'grid', columns, square: false, cards: forEach.cards }
        : forEach.group
          ? groupCard(forEach.cards)
          : { type: 'vertical-stack', cards: forEach.cards };

    // Each copy is already fully resolved, so the assembled stack must not go through
    // substitution again.
    this._setResolved('card', stack, forEach.styles, undefined, forEach.chained);
  }

  // The card's own width, which is what decides the column count - not the child's, which
  // is the width the last layout gave it.
  private _watchWidth(): void {
    if (!this._widths) this._widths = new ResizeObserver(() => this._layoutForEach());
    this._widths.disconnect();
    this._widths.observe(this);
  }

  /*
   * The space between repeated copies. Home Assistant's grid and stack cards both read it
   * from a custom property - `--grid-card-gap` and `--stack-card-gap` - and custom
   * properties cross into a shadow root where a rule of our own could never reach.
   */
  protected _applyGap(gap: number | undefined): void {
    const value = Number(gap);
    if (Number.isFinite(value) && value >= 0) {
      this.style.setProperty('--grid-card-gap', `${value}px`);
      this.style.setProperty('--stack-card-gap', `${value}px`);
    } else {
      this.style.removeProperty('--grid-card-gap');
      this.style.removeProperty('--stack-card-gap');
    }
  }

  private _setThing(thing: LovelaceThing, style?: Record<string, string>): void {
    this._savedStyles?.forEach((v, k) => this.style.setProperty(k, v[0], v[1]));
    this._savedStyles = undefined;

    if (style) {
      this._savedStyles = new Map();
      Object.keys(style).forEach((prop) => {
        this._savedStyles?.set(prop, [this.style.getPropertyValue(prop), this.style.getPropertyPriority(prop)]);
        this.style.setProperty(prop, style[prop]);
      });
    }

    this._thing = thing;
    this._forwardGridApi(thing);
    if (this._hass) thing.hass = this._hass;
    this._watchForHiding(thing);
    this._announceSize();
  }

  /*
   * The wrapped card is created asynchronously, so a sections view may already have asked
   * this card for its size and been given nothing - and it only asks again when told.
   * Without this, a card that lost the race was laid out full width until the next edit.
   * Told a frame later, and tried again on connect: said while the card is still detached,
   * or before the section has finished setting up, nobody hears it.
   *
   * Once per wrapped card, and only inside a section. A masonry view answers the same event
   * by rebuilding its columns, which reconnects every card in them - told on each connect,
   * the cards and the view would go on prompting each other for ever.
   */
  private _announceSize(): void {
    const thing = this._thing;
    if (this._thingType !== 'card' || !thing || this._sizeAnnounced === thing) return;
    requestAnimationFrame(() => {
      if (!this.isConnected || this._thing !== thing || this._sizeAnnounced === thing || !sectionOf(this)) return;
      this._sizeAnnounced = thing;
      this.dispatchEvent(new Event('card-updated', { bubbles: true, composed: true }));
    });
  }

  // The wrapped card is watched so that this wrapper can collapse when the card hides
  // itself. Whatever was being watched before is dropped first: a card that has been
  // replaced is no longer anything to react to.
  private _watchForHiding(thing: LovelaceThing): void {
    if (!this._resizes) {
      this._resizes = new ResizeObserver(() => {
        this._displayHidden();
      });
    }
    this._resizes.disconnect();
    this._resizes.observe(thing);
  }

  // Stops listening for a language chunk landing (idea 4).
  private _stopLanguageListener?: () => void;

  public connectedCallback(): void {
    super.connectedCallback();
    this._stopLanguageListener ??= onLanguageLoaded(() => this.requestUpdate());
    // Home Assistant moves cards between views rather than rebuilding them, so a card
    // put back on the page has to start watching again.
    if (this._thing) this._watchForHiding(this._thing);
    if (this._forEach?.minWidth) this._watchWidth();
    this._announceSize();
    this._syncSection();
    this._syncBadgeRow();
    this._syncWrapperPreview();
    requestAnimationFrame(() => {
      if (this.isConnected) this._syncWrapperPreview();
    });
  }

  /** Whether this element is a badge in a view's row of badges, which only being on the page can tell. */
  protected get _inBadgeRow(): boolean {
    return this.parentElement?.localName === 'hui-badge';
  }

  /*
   * setConfig runs before the card is on the page, so a group template is first built as a
   * card. One that turns out to be in the row of badges builds again here as badges, before
   * it is first painted.
   */
  private _syncBadgeRow(): void {
    if (this._thingType !== 'card' || this._thingConfig?.type !== GROUP_CARD_TYPE || !this._inBadgeRow) return;
    try {
      this._rebuild();
    } catch (err) {
      this._error = (err as Error)?.message ?? String(err);
    }
  }

  /*
   * setConfig runs before the card is on the page, so it builds without the section's
   * values; a card that turns out to sit in a section with decluttering_defaults or a
   * decluttering_let builds again here, which is before it is first painted. Read on every
   * connect, as dragging a card to another section in edit mode moves it rather than
   * rebuilding it.
   */
  private _syncSection(): void {
    const found = sectionOf(this);
    const before = this._section;
    const quiet = this._builtQuietly;
    if (found?.view === before?.view && found?.section === before?.section && !quiet) return;
    this._section = found;
    const ll = getLovelaceConfig();
    if (!quiet && !hasSectionDefaults(ll, before) && !hasSectionDefaults(ll, found)) return;
    try {
      this._rebuild();
    } catch (err) {
      // Outside setConfig nobody catches a throw, so the card says it itself.
      this._error = (err as Error)?.message ?? String(err);
    }
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopLanguageListener?.();
    this._stopLanguageListener = undefined;
    this._resizes?.disconnect();
    this._widths?.disconnect();
  }

  /*
   * Some cards size what they draw from their own grid_options rather than from the space
   * they are given - a statistics-graph only stretches its chart to fill the cell when its
   * config has a number of rows, and otherwise draws it at its usual height and runs off the
   * bottom (forum, post 22). The section reads this card's grid_options, never the wrapped
   * card's, so the wrapped card is handed them too, the same as it would have if it sat in
   * the section itself. Its own grid_options still win. Not for repeats: there each copy is
   * one of several in the space, and the rows describe all of them together.
   */
  protected _withGridOptions(thingType: LovelaceThingType, thingConfig: LovelaceThingConfig): LovelaceThingConfig {
    if (thingType !== 'card' || this._gridOptions === undefined) return thingConfig;
    if (!thingConfig || typeof thingConfig !== 'object' || 'grid_options' in thingConfig) return thingConfig;
    return { ...thingConfig, grid_options: this._gridOptions };
  }

  /*
   * The sections layout asks the card how much of the grid it wants, while it renders.
   * Without this the wrapper answers for itself and every templated card is laid out with
   * the defaults instead of the size the wrapped card asked for.
   *
   * Home Assistant ignores `getLayoutOptions` entirely on an element that also has
   * `getGridOptions`, so these are assigned per instance rather than declared on the class:
   * a card implementing only the older API would otherwise be silently ignored.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _forwardGridApi(thing?: any): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const self = this as any;
    delete self.getGridOptions;
    delete self.getLayoutOptions;
    if (this._thingType !== 'card' || !thing) return;

    /*
     * A template that knows what size it wants says so once, rather than every card using
     * it repeating the same grid_options. What the card itself sets still wins, since that
     * is the more particular of the two, and both win over whatever the wrapped card would
     * have asked for on its own.
     */
    if (this._gridOptions !== undefined) {
      self.getGridOptions = (): unknown => this._gridOptions;
      if (typeof thing.getLayoutOptions === 'function') {
        self.getLayoutOptions = (): unknown => thing.getLayoutOptions();
      }
      return;
    }
    if (typeof thing.getGridOptions === 'function') {
      self.getGridOptions = (): unknown => thing.getGridOptions();
    }
    if (typeof thing.getLayoutOptions === 'function') {
      self.getLayoutOptions = (): unknown => thing.getLayoutOptions();
    }
  }

  protected render(): TemplateResult | void {
    if (this._error) {
      return html` <ha-alert alert-type="error">${this._error}</ha-alert> ${this._renderReport()} `;
    }

    /*
     * What the card actually built, on the dashboard rather than only in the editor. The
     * editor's Result view answers the same question, but not when the card only misbehaves
     * on a phone, or in a view whose editor is awkward to reach.
     */
    if (this._debug && this._thingConfig) {
      return html`
        <ha-card>
          <div class="debug">
            <p>
              ${
                this._templateName
                  ? localize('card.debug_builds_from', { template: this._templateName }, this._hass)
                  : localize('card.debug_builds', undefined, this._hass)
              }
            </p>
            <pre>
${this._debug === 'yaml' ? toYaml(withoutStamps(this._thingConfig)) : JSON.stringify(withoutStamps(this._thingConfig), null, 2)}</pre>
          </div>
        </ha-card>
      `;
    }

    if (this._hiddenByFallback || !this._hass || !this._thing) return html``;

    this.classList.toggle('decluttering-badge', this._thingType === 'badge');
    this.classList.toggle('decluttering-container', this._thingType !== 'badge');
    this.classList.toggle('decluttering-card', this._thingType === 'card');
    // Only a card is laid out as a box in the first place, so only a card has one to give
    // up. A badge is already out of the way, and an element is positioned inside the card.
    this.classList.toggle('decluttering-fit-contents', this._thingType === 'card' && this._fitContents);
    this.classList.toggle('decluttering-report', this._reportMode);

    return html`
      ${
        this._style
          ? html`
              <style>
                ${this._style}
              </style>
            `
          : ''
      }
      ${this._thing} ${this._renderReport()}
    `;
  }

  private static async _createThing(
    thingConfig: LovelaceThingConfig,
    thingType: LovelaceThingType,
    handler: (thing: LovelaceThing) => void,
  ): Promise<void> {
    let thing: LovelaceThing;

    /*
     * Cards go through Home Assistant's own hui-card wrapper, which is what its stack
     * cards use. Creating the element directly, as this card used to, skips everything
     * hui-card does around it: `visibility` conditions were silently ignored inside a
     * template (upstream #85, j9brown #2), grid options were not reported, and rebuilds
     * were handled by hand.
     *
     * hui-card renders into the light DOM, so a style injected into this element's shadow
     * root still reaches the card inside it. It is internal Home Assistant API though, so
     * if it is ever absent the original path still runs.
     */
    let wrapper: CustomElementConstructor | undefined;
    if (thingType === 'card' && thingConfig.type !== 'divider') wrapper = customElements.get('hui-card');
    else if (thingType === 'badge') wrapper = customElements.get('hui-badge');
    if (wrapper) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wrapped = new wrapper() as any;
      wrapped.config = thingConfig;
      handler(wrapped as LovelaceThing);
      return;
    }

    if (HELPERS) {
      if (thingType === 'card') {
        if (thingConfig.type === 'divider') thing = (await HELPERS).createRowElement(thingConfig);
        else thing = (await HELPERS).createCardElement(thingConfig);
      } else if (thingType === 'row') {
        thing = (await HELPERS).createRowElement(thingConfig);
      } else if (thingType === 'element') {
        thing = (await HELPERS).createHuiElement(thingConfig);
      } else if (thingType === 'badge') {
        thing = (await HELPERS).createBadgeElement(thingConfig);
      } else {
        throw new Error(localize('error.unsupported_thing_type', { kind: thingType }));
      }
    } else {
      thing = createThing(thingConfig, thingType === 'row');
    }
    thing.addEventListener(
      'll-rebuild',
      (ev) => {
        ev.stopPropagation();
        DeclutteringElement._createThing(thingConfig, thingType, (newThing: LovelaceThing) => {
          thing.replaceWith(newThing);
          handler(newThing);
        });
      },
      { once: true },
    );
    handler(thing);
  }

  // for LovelaceCard
  public getCardSize(): Promise<number> | number {
    return this._thing && this._thingType === 'card' ? (this._thing as LovelaceCard).getCardSize() : 1;
  }
}
