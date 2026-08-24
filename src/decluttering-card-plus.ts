import { LitElement, html, TemplateResult, css, CSSResult, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  HomeAssistant,
  createThing,
  fireEvent,
  LovelaceCard,
  LovelaceCardEditor,
  LovelaceConfig,
} from 'custom-card-helpers';
import {
  DeclutteringCardConfig,
  DeclutteringTemplateConfig,
  TemplateConfig,
  VariablesConfig,
  LovelaceThing,
  LovelaceThingConfig,
  LovelaceThingType,
} from './types';
import deepReplace from './deep-replace';
import { buildExport, validateImport } from './share';
import { suggestVariables } from './suggest';
import { LIBRARY, libraryEntry, libraryNeeds } from './library';
import {
  collectTemplates,
  collectAllTemplates,
  addCardToView,
  collectUsages,
  countLegacyTypes,
  didYouMean,
  moderniseTypes,
  TEMPLATE_TYPE,
  findTemplate,
  findTemplateAnywhere,
  findTemplateLocation,
  getTemplateSources,
  renameTemplate,
  TemplateUsages,
} from './templates';
import {
  diagnoseInstance,
  diagnoseTemplate,
  forEachItems,
  forEachNames,
  forEachVariables,
  getDeclarations,
  mergeVariables,
  normaliseVariables,
  POSITION_NAMES,
  hasRequiredVariables,
  usesResolver,
  variableName,
  variableValues,
  VariableDeclaration,
} from './variables';
import { chainOf, chainWith, describeCycle, describeTooDeep, findCycle, MAX_NESTING, withChain } from './cycles';
import { columnsFor } from './layout';
import { isRegistrySource, registryKey, registryNames, resolveRegistryItems, sameRegistry } from './registry';
import { copyText, getLovelaceConfig, getLovelacePanel } from './utils';
import { localize } from './localize';
import { VERSION } from './version';

// Tags this bundle owns.
const CARD_TAG = 'decluttering-card-plus';
const CARD_EDITOR_TAG = 'decluttering-card-plus-editor';
const TEMPLATE_TAG = 'decluttering-template-plus';
const TEMPLATE_EDITOR_TAG = 'decluttering-template-plus-editor';

// Tags of the original custom-cards/decluttering-card, claimed when it is not installed
// so that existing configurations keep working unchanged.
const LEGACY_CARD_TAG = 'decluttering-card';
const LEGACY_TEMPLATE_TAG = 'decluttering-template';

// What a template of each kind starts out as, when its type is chosen in the editor. One
// of these is kept and the rest removed, so switching the type swaps the body for a
// starter of the new kind - and leaves an existing body of the chosen kind alone.
const THING_STUBS: Record<string, unknown> = {
  card: { type: 'entity', entity: 'sun.sun' },
  badge: { type: 'entity', entity: 'sun.sun' },
  row: { entity: 'sun.sun' },
  element: { type: 'icon', icon: 'mdi:weather-sunny', style: { color: 'yellow' } },
};

// Declared variables get their own form field, and the prefix keeps a variable called
// "template" from colliding with the field that chooses the template.
const VARIABLE_FIELD_PREFIX = 'variable:';

// Past this many copies on one card a repeat is worth mentioning. Well above a house's
// worth of lights, so an ordinary dashboard never sees it.
const MANY_COPIES = 50;

// How many matches the editor lists before it stops. Enough to see the filter is right,
// few enough that a sweep of the whole house does not fill the dialog.
const MATCHES_SHOWN = 12;

// One shared instance, built on first use so it speaks the user's language: the editor
// re-renders on every state change Home Assistant sends, and a fresh schema object each
// time would mark every field dirty for no reason.
let REPEAT_SCHEMA: unknown[] | undefined;
function repeatSchema(): unknown[] {
  REPEAT_SCHEMA ??= [
    {
      name: 'for_each',
      label: localize('editor.for_each_label'),
      helper: localize('editor.for_each_helper'),
      selector: { object: {} },
    },
    {
      name: 'for_each_from',
      label: localize('editor.for_each_from_label'),
      helper: localize('editor.for_each_from_helper'),
      selector: { object: {} },
    },
    {
      name: 'gap',
      label: localize('editor.gap_label'),
      helper: localize('editor.gap_helper'),
      selector: { number: { min: 0, max: 64, mode: 'box' } },
    },
    {
      name: 'empty',
      label: localize('editor.empty_label'),
      helper: localize('editor.empty_helper'),
      selector: { object: {} },
    },
    {
      name: 'columns',
      label: localize('editor.columns_label'),
      helper: localize('editor.columns_helper'),
      selector: { number: { min: 1, max: 6, mode: 'box' } },
    },
    {
      name: 'min_column_width',
      label: localize('editor.min_column_width_label'),
      helper: localize('editor.min_column_width_helper'),
      selector: { number: { min: 50, max: 1000, step: 10, mode: 'box' } },
    },
  ];
  return REPEAT_SCHEMA;
}

// Offered for every template, described or not, since it is about where the card sits
// rather than about what the template contains.
let FIT_SCHEMA: unknown[] | undefined;
function fitSchema(): unknown[] {
  FIT_SCHEMA ??= [
    {
      name: 'fit',
      label: localize('editor.fit_label'),
      helper: localize('editor.fit_helper'),
      selector: {
        select: {
          mode: 'dropdown',
          options: [
            { value: 'box', label: localize('editor.fit_box') },
            { value: 'contents', label: localize('editor.fit_contents') },
          ],
        },
      },
    },
  ];
  return FIT_SCHEMA;
}

/**
 * Splits a translated sentence at the one part that has to be rendered as markup - a
 * link, a `<code>` - so the words either side stay in the translator's order.
 */
function splitAt(sentence: string, token: string): [string, string] {
  const at = sentence.indexOf(token);
  return at === -1 ? [sentence, ''] : [sentence.slice(0, at), sentence.slice(at + token.length)];
}

// A style rule that paints on this card's own host rather than on the card inside it.
const HOST_SELECTOR = /:host|\.decluttering-container/;

// Variables can be written as a list of entries or as one mapping; both are read the same
// way. Anything else - a string, a number - is neither, and worth saying so about.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isVariablesShape(value: any): boolean {
  return value === undefined || Array.isArray(value) || (!!value && typeof value === 'object');
}

/** Writes a value the editor produced, leaving the key out entirely when it is empty. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOrDelete(config: any, key: string, value: any): void {
  const empty = value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
  if (empty) delete config[key];
  else config[key] = value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HELPERS = (window as any).loadCardHelpers ? (window as any).loadCardHelpers() : undefined;

console.info(
  `%c DECLUTTERING-CARD-PLUS \n%c   Version ${VERSION}   `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

async function loadCardEditorPicker(): Promise<void> {
  // Ensure hui-card-element-editor and hui-card-picker are loaded.
  // They happen to be used by the vertical-stack card editor but there must be a better way?
  let cls = customElements.get('hui-vertical-stack-card');
  if (!cls) {
    (await HELPERS).createCardElement({ type: 'vertical-stack', cards: [] });
    await customElements.whenDefined('hui-vertical-stack-card');
    cls = customElements.get('hui-vertical-stack-card');
  }
  if (cls) cls = cls.prototype.constructor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (cls && (cls as any).getConfigElement) await (cls as any).getConfigElement();
}

async function loadRowEditor(): Promise<void> {
  // Ensure hui-row-element-editor are loaded.
  // They happen to be used by the vertical-stack card editor but there must be a better way?
  let cls = customElements.get('hui-entities-card');
  if (!cls) {
    (await HELPERS).createCardElement({ type: 'entities', entities: [] });
    await customElements.whenDefined('hui-entities-card');
    cls = customElements.get('hui-entities-card');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (cls && (cls as any).getConfigElement) await (cls as any).getConfigElement();
}

// The four things a template can define, exactly one of which it must.
const THING_TYPE_KEYS = ['card', 'row', 'element', 'badge'];

function getThingType(templateConfig: TemplateConfig): LovelaceThingType | undefined {
  const thingTypes = Object.keys(templateConfig).filter((key) => THING_TYPE_KEYS.includes(key));
  return thingTypes.length === 1 ? (thingTypes[0] as LovelaceThingType) : undefined;
}

abstract class DeclutteringElement extends LitElement {
  @state() protected _hass?: HomeAssistant;
  @state() private _thing?: LovelaceThing;

  // Home Assistant sets both of these on a card element directly. They are declared so
  // that assigning them triggers an update, which is what passes them on to the wrapped
  // card - a preview has to render whether or not its visibility conditions are met, and
  // the layout tells the card whether it is in a section or a panel.
  @property({ type: Boolean }) public preview = false;
  @property({ attribute: false }) public layout?: string;

  protected _thingConfig?: LovelaceThingConfig;
  private _thingType?: LovelaceThingType;
  // One observer for the element's lifetime. A new one per wrapped card leaked a live
  // observer on every reconfigure, and left them all running after the card was gone.
  private _resizes?: ResizeObserver;
  // The template this element renders, and the ones already open above it. Together they
  // are what stops a template that uses itself from building levels forever.
  protected _templateName?: string;
  protected _gridOptions?: unknown;
  protected _strict = false;
  @state() protected _debug = false;
  protected _openTemplates: string[] = [];
  // The copies of a repeated template, kept so the layout can change without resolving
  // them again, and the column count currently on show so it only rebuilds when it moves.
  private _forEach?: { cards: unknown[]; max: number; minWidth?: number; styles: string };
  private _columnsShown?: number;
  // The size a repeat was last mentioned at, so a rebuild does not say it all over again.
  private _manyWarnedFor?: number;
  private _widths?: ResizeObserver;
  private _savedStyles?: Map<string, [string, string]>;
  @state() private _style?: string;

  @state() protected _error?: string;

  /** Whether this card was asked to give up its box in the layout. */
  @state() protected _fitContents = false;

  set hass(hass: HomeAssistant) {
    if (!hass) return;
    this._hass = hass;
    if (this._thing) this._thing.hass = hass;
    this.hassAvailable(hass);
  }

  // Overridden by the card, which may need the connection to fetch a template that lives
  // on another dashboard. setConfig runs before hass is ever set, so the work waits here.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected hassAvailable(_hass: HomeAssistant): void {}

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
      }
      .debug p {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .debug pre {
        margin: 0;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const thing = this._thing as any;
    if (!thing) return;
    if ('preview' in thing) thing.preview = this.preview;
    if ('layout' in thing) thing.layout = this.layout;
  }

  // A wrapped card can hide itself with an inline style, a stylesheet rule or the hidden
  // attribute. Only the first of those was checked before, so a card hiding itself by any
  // other means left this wrapper occupying space in the layout - upstream issue #58.
  private _childIsHidden(): boolean {
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
    const thingContent = templateConfig.card ?? templateConfig.element ?? templateConfig.row ?? templateConfig.badge;
    const unresolved: string[] = [];
    this._setResolved(
      thingType,
      deepReplace(variables, templateConfig, thingContent, templateName, this._hass, false, (names) =>
        unresolved.push(...names),
      ),
      this._resolveStyles(templateConfig, variables, cardStyle, templateName),
    );
    this._refuseIfStrict(unresolved);
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
  ): string {
    let styles = '';
    if (templateConfig.style) {
      styles += deepReplace(variables, templateConfig, templateConfig.style, templateName, this._hass);
    }
    if (cardStyle) {
      styles += deepReplace(variables, templateConfig, cardStyle, templateName, this._hass);
    }
    return styles;
  }

  private _setResolved(thingType: LovelaceThingType, thingConfig: LovelaceThingConfig, styles: string): void {
    // Anything inside this card is told which templates are open above it, so a card that
    // ends up using a template already being drawn can refuse instead of going round again.
    const stamped = withChain(thingConfig, chainWith(this._openTemplates, this._templateName));
    this._style = styles;
    this._thingConfig = stamped;
    this._thingType = thingType;
    DeclutteringElement._createThing(stamped, thingType, (thing: LovelaceThing) => {
      if (this._thingConfig === stamped) {
        this._setThing(thing, thingType === 'element' ? thingConfig.style : undefined);
      }
    });
  }

  /*
   * `for_each` renders the template once per item, which Home Assistant's own stack cards
   * already know how to lay out - so the copies are handed to a vertical-stack, or to a
   * grid when more than one column is asked for, rather than managed here. Everything
   * that applies to a single templated card then applies to each copy unchanged.
   */
  protected _setForEach(templateConfig: TemplateConfig, config: DeclutteringCardConfig, items: unknown[]): void {
    if (getThingType(templateConfig) !== 'card') {
      /*
       * Only a card can repeat. Home Assistant gives a row, a badge or a picture element a
       * single slot to fill, so there is nowhere for a second copy to go - the way to
       * repeat rows is a card template holding them, which repeats as a card like anything
       * else.
       */
      throw new Error(
        localize(
          'error.for_each_not_card',
          {
            template: config.template,
            kind: getThingType(templateConfig) ?? localize('error.a_different_kind', undefined, this._hass),
          },
          this._hass,
        ),
      );
    }
    /*
     * A template can say which of its variables it cannot do without, and an item that
     * leaves one of them empty describes a copy there is nothing to render - the third
     * light in a room that has two. Those items are dropped rather than rendered as a card
     * full of holes, which is what a dummy entity id was always standing in for.
     */
    const wanted = items.filter((item) => hasRequiredVariables(templateConfig, item, config.variables));

    /*
     * A repeat that matches nothing renders nothing, which is right - a dashboard should
     * not break because a room has no motion sensor yet - but silence is indistinguishable
     * from breakage. `empty:` is how a card says "there is nothing here" on purpose.
     */
    if (!wanted.length && config.empty) {
      this._forEach = undefined;
      this._widths?.disconnect();
      this._setResolved(
        'card',
        config.empty as LovelaceThingConfig,
        this._resolveStyles(templateConfig, config.variables, config.style, config.template),
      );
      return;
    }

    /*
     * A registry sweep that matches half the house builds half the house, which reads as a
     * broken dashboard rather than a big one. Said once, naming the count, because the card
     * cannot know whether it was meant - only that it is worth a look.
     */
    if (wanted.length > MANY_COPIES && this._manyWarnedFor !== wanted.length) {
      this._manyWarnedFor = wanted.length;
      console.warn(localize('warn.many_copies', { template: config.template, count: wanted.length }, this._hass));
    }

    const cards = wanted.map((item, index) =>
      deepReplace(
        forEachVariables(item, config.variables, index, wanted.length),
        templateConfig,
        templateConfig.card,
        config.template,
        this._hass,
      ),
    );

    // The styles belong to the whole card rather than to any one copy, and resolve against
    // the real template so its declared defaults still apply.
    this._forEach = {
      cards,
      max: Number(config.columns) || 1,
      minWidth: Number(config.min_column_width) || undefined,
      styles: this._resolveStyles(templateConfig, config.variables, config.style, config.template),
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

    const stack =
      columns > 1
        ? { type: 'grid', columns, square: false, cards: forEach.cards }
        : { type: 'vertical-stack', cards: forEach.cards };

    // Each copy is already fully resolved, so the assembled stack must not go through
    // substitution again.
    this._setResolved('card', stack, forEach.styles);
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

  public connectedCallback(): void {
    super.connectedCallback();
    // Home Assistant moves cards between views rather than rebuilding them, so a card
    // put back on the page has to start watching again.
    if (this._thing) this._watchForHiding(this._thing);
    if (this._forEach?.minWidth) this._watchWidth();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resizes?.disconnect();
    this._widths?.disconnect();
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
      return html` <ha-alert alert-type="error">${this._error}</ha-alert> `;
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
            <pre>${JSON.stringify(this._thingConfig, null, 2)}</pre>
          </div>
        </ha-card>
      `;
    }

    if (!this._hass || !this._thing) return html``;

    this.classList.toggle('decluttering-badge', this._thingType === 'badge');
    this.classList.toggle('decluttering-container', this._thingType !== 'badge');
    this.classList.toggle('decluttering-card', this._thingType === 'card');
    // Only a card is laid out as a box in the first place, so only a card has one to give
    // up. A badge is already out of the way, and an element is positioned inside the card.
    this.classList.toggle('decluttering-fit-contents', this._thingType === 'card' && this._fitContents);

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
      ${this._thing}
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

class DeclutteringCard extends DeclutteringElement {
  private _pendingConfig?: DeclutteringCardConfig;
  // A card repeating over the registry, kept so it can be worked out again when what is
  // registered changes - a lamp added to the kitchen should appear without an edit.
  private _fromRegistry?: { templateConfig: TemplateConfig; config: DeclutteringCardConfig };
  private _registry?: unknown[];

  // The same pair again, for a template that reads the registry through a resolver rather
  // than repeating over it.
  private _fromResolvers?: { templateConfig: TemplateConfig; config: DeclutteringCardConfig };
  private _resolverRegistry?: unknown[];

  static getConfigElement(): HTMLElement {
    return document.createElement(CARD_EDITOR_TAG);
  }

  static getStubConfig(): DeclutteringCardConfig {
    return {
      type: `custom:${CARD_TAG}`,
      template: 'follow_the_sun',
    };
  }

  public setConfig(config: DeclutteringCardConfig): void {
    if (!config.template) {
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
    /*
     * Anything but `contents` leaves the card with a box of its own, which is what it has
     * always had - so a value nobody recognises falls back to the way it worked before
     * rather than to a layout they did not ask for.
     */
    this._fitContents = config.fit === 'contents';
    const templateConfig = findTemplate(ll, config.template);
    if (templateConfig) {
      this._pendingConfig = undefined;
      this._applyTemplate(templateConfig, config);
      return;
    }
    if (!getTemplateSources(ll).length) {
      throw new Error(
        localize('error.template_missing', { template: config.template }, this._hass) +
          didYouMean(config.template, Object.keys(collectTemplates(ll))),
      );
    }
    // The template may live on a dashboard this one borrows from, which has to be fetched.
    // setConfig cannot wait, so it is picked up as soon as hass arrives.
    this._pendingConfig = config;
    if (this._hass) this.hassAvailable(this._hass);
  }

  // A card renders its template once, or once per item when it is given a list to repeat
  // over. An empty list is not an error - it is a list that happens to have nothing in it
  // today - so it simply renders nothing rather than failing the card.
  private _applyTemplate(templateConfig: TemplateConfig, config: DeclutteringCardConfig): void {
    this._fromRegistry = undefined;
    this._registry = undefined;
    this._applyGap(config.gap);
    this._strict = config.strict === true;
    this._debug = config.debug === true;
    // What the card asks for beats what the template says it wants.
    this._gridOptions = config.grid_options ?? (templateConfig as { grid_options?: unknown }).grid_options;

    /*
     * A resolver reads the registry, and the registry can arrive after the card has first
     * rendered - so remember what to build if it changes under us. Recorded before the
     * branching, not after: a template using `[[entity|friendly_name]]` needs building
     * again whether it is rendered once or repeated, and recording it only on the plain
     * path left every copy of a repeat showing the brackets for good.
     */
    this._fromResolvers = usesResolver(templateConfig) ? { templateConfig, config } : undefined;

    // A single mapping counts as a list of one, the same forgiveness `variables` gets. A
    // written-out list wins over a registry source: it is the more particular of the two,
    // and having both silently pick one would be worse than having it say which.
    const items = forEachItems(config.for_each);
    if (items) {
      this._setForEach(templateConfig, config, items);
      return;
    }
    if (isRegistrySource(config.for_each_from)) {
      // It works itself out again on a registry change already, which covers its resolvers.
      this._fromResolvers = undefined;
      this._fromRegistry = { templateConfig, config };
      // setConfig runs before hass is ever set, so the first resolution usually waits.
      if (this._hass) this._resolveFromRegistry(this._hass);
      return;
    }
    this._setTemplateConfig(templateConfig, config.variables, config.style, config.template);
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

    const key = registryKey(hass);
    if (sameRegistry(this._resolverRegistry, key)) return;
    this._resolverRegistry = key;

    // Built the same way it was built the first time, so a repeat comes back as a repeat.
    const items = forEachItems(pending.config.for_each);
    if (items) {
      this._setForEach(pending.templateConfig, pending.config, items);
      return;
    }
    this._setTemplateConfig(
      pending.templateConfig,
      pending.config.variables,
      pending.config.style,
      pending.config.template,
    );
  }

  /*
   * The copies a registry source asks for. hass arrives on every state change, so the work
   * is skipped unless the registry itself has moved - otherwise a dashboard of these would
   * rebuild itself several times a second.
   */
  private _resolveFromRegistry(hass: HomeAssistant): void {
    const source = this._fromRegistry;
    if (!source) return;

    const key = registryKey(hass);
    if (sameRegistry(this._registry, key)) return;
    this._registry = key;

    try {
      const items = resolveRegistryItems(hass, source.config.for_each_from);
      this._setForEach(source.templateConfig, source.config, items);
      this._error = undefined;
    } catch (err) {
      // Thrown from outside setConfig, where Home Assistant would catch it, so the card
      // has to report it itself rather than leaving the old copies on screen.
      this._error = (err as Error)?.message ?? String(err);
    }
  }

  protected hassAvailable(hass: HomeAssistant): void {
    const config = this._pendingConfig;
    if (!config) {
      this._resolveFromRegistry(hass);
      this._rebuildForResolvers(hass);
      return;
    }
    this._pendingConfig = undefined;

    const ll = getLovelaceConfig();
    findTemplateAnywhere(hass, ll, config.template)
      .then((templateConfig) => {
        if (templateConfig) {
          this._applyTemplate(templateConfig, config);
        } else {
          this._error = localize('error.template_missing_anywhere', { template: config.template }, hass);
          // Every name there is, borrowed ones included, is known by the time this runs.
          collectAllTemplates(hass, ll).then((all) => {
            this._error += didYouMean(config.template, Object.keys(all));
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

class DeclutteringCardEditor extends LitElement implements LovelaceCardEditor {
  static get styles(): CSSResult {
    return css`
      .description {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
      }
      .hint {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      ha-alert {
        display: block;
        margin-bottom: 8px;
      }
      ha-expansion-panel {
        margin-top: 16px;
      }
      .result {
        padding: 0 8px 8px;
      }
      .result .hint {
        margin: 8px 0;
      }
    `;
  }

  @state() private _lovelace?: LovelaceConfig;
  @state() private _config?: DeclutteringCardConfig;

  @property() public hass?: HomeAssistant;

  private _templates?: Record<string, TemplateConfig>;
  @state() private _loadingTemplates = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _schema: any;

  set lovelace(lovelace: LovelaceConfig) {
    this._lovelace = lovelace;
    this._templates = undefined;
    this._schema = undefined;
  }

  public setConfig(config: DeclutteringCardConfig): void {
    this._config = config;
  }

  /*
   * Working out which templates exist, and the form to offer for them, is preparation for
   * a render rather than part of one. It lives here because all of it sets state, and Lit
   * asks that state be settled before render rather than changed during it - doing this in
   * render schedules another update from inside the one in progress.
   */
  protected willUpdate(): void {
    if (!this.hass || !this._config) return;

    // The lovelace property is not set when editing row elements, so it is looked up here.
    if (!this._lovelace) this._lovelace = getLovelaceConfig() ?? undefined;
    if (!this._lovelace) return;

    if (!this._templates) {
      this._templates = collectTemplates(this._lovelace);
      this._loadBorrowedTemplates();
    }
    if (!this._schema) {
      this._schema = [
        {
          name: 'template',
          label: localize('editor.template_label', undefined, this.hass),
          selector: {
            select: {
              mode: 'dropdown',
              sort: true,
              custom_value: true,
              // A name on its own says nothing about what a template is for, and a
              // dashboard with twenty of them becomes a memory test. The description the
              // template already carries is put beside it.
              options: Object.entries(this._templates).map(([name, template]) => ({
                value: name,
                label: template?.description ? `${name} — ${template.description}` : name,
              })),
            },
          },
        },
        {
          name: 'variables',
          label: localize('editor.variables_label', undefined, this.hass),
          helper: localize('editor.variables_helper', undefined, this.hass),
          selector: { object: {} },
        },
      ];
    }
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._config || !this._templates || !this._schema) return html``;

    const template = this._templates[this._config.template];
    const declarations = getDeclarations(template);
    const readable = isVariablesShape(this._config.variables);
    // The same gate _setForEach applies, so the editor never offers a repeat the card
    // would refuse to render - except while a for_each is set, which must stay visible
    // whatever the template looks like, or it could never be removed from the form.
    const repeatable =
      (!!template && getThingType(template) === 'card') ||
      this._config.for_each !== undefined ||
      this._config.for_each_from !== undefined;

    const error: Record<string, string | string[]> = {};
    // Templates borrowed from another dashboard are still on their way, so do not accuse
    // the user of a bad name until they have arrived.
    if (!template && !this._loadingTemplates) {
      error.template = localize('editor.no_such_template', undefined, this.hass);
    }
    if (!readable) {
      error.variables = localize('error.variables_shape', undefined, this.hass);
    }

    return html`
      ${template?.description ? html`<p class="description">${template.description}</p>` : html``}
      ${this._renderSource(template)} ${this._renderDiagnostics(template, readable)} ${this._renderMatches()}
      <ha-form
        .hass=${this.hass}
        .data=${this._formData(declarations)}
        .schema=${this._formSchema(declarations, repeatable)}
        .error=${error}
        .computeLabel=${(s): string => s.label ?? s.name}
        .computeHelper=${(s): string => s.helper ?? ''}
        @value-changed=${this._valueChanged}
      ></ha-form>
      ${this._renderResult(template)}
    `;
  }

  /*
   * What the card is actually built from, once every variable has been put in. The
   * template and the values are in two different places on the dashboard and the card
   * renders a third thing, so working out why the result is not what you meant has always
   * meant reading both and doing the substitution in your head. This does it for you.
   */
  private _renderResult(template: TemplateConfig | undefined): TemplateResult {
    if (!template || !this._config) return html``;
    const thingType = getThingType(template);
    if (!thingType) return html``;

    const content = template.card ?? template.element ?? template.row ?? template.badge;
    // for_each renders the same template once per item, so one copy stands for all of
    // them - showing every copy would bury the thing you opened this to look at.
    const items = forEachItems(this._config.for_each);
    const variables = items?.length
      ? forEachVariables(items[0], this._config.variables, 0, items.length)
      : this._config.variables;

    let resolved: unknown;
    try {
      // Quietly: the editor re-renders on every keystroke, and the card itself already
      // says what it could not resolve when it renders for real.
      resolved = deepReplace(variables, template, content, this._config.template, this.hass, true);
    } catch (err) {
      return html`<ha-alert alert-type="warning">
        ${localize('editor.result_error', { error: String(err) }, this.hass)}
      </ha-alert>`;
    }

    const copies = items?.length ? localize('editor.result_copies', { total: items.length }, this.hass) : '';
    // Translated whole, then split so the [[name]] in the middle can be set in code.
    const [hintBefore, hintAfter] = splitAt(localize('editor.result_hint', { kind: thingType }, this.hass), '[[name]]');

    return html`
      <ha-expansion-panel outlined>
        <span slot="header">${localize('editor.result_header', undefined, this.hass)}${copies}</span>
        <div class="result">
          <p class="hint">${hintBefore}<code>[[name]]</code>${hintAfter}</p>
          <ha-yaml-editor .hass=${this.hass} .defaultValue=${resolved} read-only></ha-yaml-editor>
        </div>
      </ha-expansion-panel>
    `;
  }

  /*
   * Where the template being used is defined. A card is often the place you realise the
   * template itself needs changing, and the definition can be anywhere on the dashboard -
   * or on another one entirely, which is worth knowing before you go looking for it.
   */
  private _renderSource(template: TemplateConfig | undefined): TemplateResult {
    const name = this._config?.template;
    if (!name || !template || this._loadingTemplates) return html``;

    const location = findTemplateLocation(this._lovelace, name);
    if (!location) {
      return html`<p class="hint">${localize('editor.source_borrowed', undefined, this.hass)}</p>`;
    }
    if (location.declared || !location.view) {
      return html`<p class="hint">${localize('editor.source_declared', undefined, this.hass)}</p>`;
    }

    const { view } = location;
    const dashboard = document.location.pathname.split('/').slice(0, 2).join('/');
    // Translated whole, then split where the link goes, so the sentence keeps the
    // translator's word order around it.
    const [before, after] = splitAt(localize('editor.source_view', { view: '\u0001' }, this.hass), '\u0001');
    return html`<p class="hint">
      ${before}<a href=${`${dashboard}/${view.path || view.index}`} target="_blank" rel="noreferrer"
        >${view.title || view.path || localize('editor.untitled_view', undefined, this.hass)}</a
      >${after}
    </p>`;
  }

  /*
   * What a registry repeat matches, as it is being written. The filters are powerful and
   * completely invisible until the card is saved and looked at, so a typo in a domain or an
   * area name reads as "this card is broken" rather than "nothing matched that". Counting
   * here turns writing them into something you can see working.
   */
  private _renderMatches(): TemplateResult {
    const source = this._config?.for_each_from;
    if (!this.hass || !isRegistrySource(source)) return html``;

    let matched: Record<string, unknown>[] = [];
    try {
      matched = resolveRegistryItems(this.hass, source);
    } catch {
      return html``;
    }

    if (!matched.length) {
      return html`<ha-alert alert-type="warning">
        ${localize(
          'editor.matches_none',
          { but: this._config?.empty ? localize('editor.matches_none_but_empty', undefined, this.hass) : '' },
          this.hass,
        )}
      </ha-alert>`;
    }

    // The names, not the whole mappings: it is a sanity check on the filters, not a data
    // dump, and a sweep of the house should not fill the dialog.
    const shown = matched.slice(0, MATCHES_SHOWN);
    const label = (item: Record<string, unknown>): string =>
      String(item.entity ?? item.area_id ?? `${(item.total as number) ?? ''}`);

    return html`
      <ha-expansion-panel outlined>
        <span slot="header">
          ${
            matched.length === 1
              ? localize('editor.matches_header_one', undefined, this.hass)
              : localize('editor.matches_header_many', { count: matched.length }, this.hass)
          }
        </span>
        <div class="matches">
          <ul>
            ${shown.map((item) => html`<li>${label(item)}</li>`)}
          </ul>
          ${
            matched.length > shown.length
              ? html`<p class="hint">
                  ${localize('editor.matches_more', { count: matched.length - shown.length }, this.hass)}
                </p>`
              : html``
          }
          <p class="hint">${localize('editor.matches_hint', undefined, this.hass)}</p>
        </div>
      </ha-expansion-panel>
    `;
  }

  /*
   * A template that describes its variables gets a real control for each one, and a box
   * underneath for anything else the card sets. A template that does not is edited the
   * way it always has been, through that box alone.
   */
  private _formSchema(declarations: VariableDeclaration[], repeatable: boolean): unknown[] {
    const repeat = repeatable ? repeatSchema() : [];

    if (!declarations.length) return [...this._schema, ...repeat, ...fitSchema()];

    return [
      this._schema[0],
      ...declarations.map((declaration) => ({
        name: VARIABLE_FIELD_PREFIX + declaration.name,
        label: declaration.label ?? declaration.name,
        helper: declaration.description,
        selector: declaration.selector ?? { text: {} },
        required: declaration.required === true,
      })),
      {
        name: 'extras',
        label: localize('editor.extras_label', undefined, this.hass),
        helper: localize('editor.extras_helper', undefined, this.hass),
        selector: { object: {} },
      },
      ...repeat,
      ...fitSchema(),
    ];
  }

  private _formData(declarations: VariableDeclaration[]): Record<string, unknown> {
    if (!declarations.length) return this._config as Record<string, unknown>;

    const values = variableValues(this._config?.variables);
    const described = new Set(declarations.map((declaration) => declaration.name));
    const data: Record<string, unknown> = { template: this._config?.template };
    for (const declaration of declarations) {
      if (declaration.name in values) data[VARIABLE_FIELD_PREFIX + declaration.name] = values[declaration.name];
    }

    const extras = normaliseVariables(this._config?.variables).filter((entry) => {
      const name = variableName(entry);
      return name !== undefined && !described.has(name);
    });
    if (extras.length) data.extras = extras;
    if (this._config?.for_each !== undefined) data.for_each = this._config.for_each;
    if (this._config?.for_each_from !== undefined) data.for_each_from = this._config.for_each_from;
    if (this._config?.columns !== undefined) data.columns = this._config.columns;
    if (this._config?.min_column_width !== undefined) data.min_column_width = this._config.min_column_width;
    if (this._config?.empty !== undefined) data.empty = this._config.empty;
    if (this._config?.gap !== undefined) data.gap = this._config.gap;
    if (this._config?.fit !== undefined) data.fit = this._config.fit;
    return data;
  }

  /*
   * Warnings, never errors: a template can be edited after the cards that use it, so a
   * card that looks wrong now may be right again in a moment. Nothing here stops a save.
   */
  private _renderDiagnostics(template: TemplateConfig | undefined, readable: boolean): TemplateResult {
    if (!template || this._loadingTemplates || !readable) return html``;

    // The items' names count as supplied, so a variable only the items set is not
    // missing - but they are not the card's own, so they are never called unused.
    // Both kinds of repeat supply names to every copy, and neither is the card's own to
    // be called missing. A registry source supplies its set whether or not anything is
    // registered yet, so it is read from the source rather than from what it resolved to.
    const supplied = [
      ...forEachNames(this._config?.for_each),
      ...registryNames(this._config?.for_each_from),
      ...(isRegistrySource(this._config?.for_each_from) ? POSITION_NAMES : []),
    ];
    const repeated = supplied.map((name) => ({ [name]: null }));
    const { missing, unused, required } = diagnoseInstance(this._config?.variables, template, repeated);
    // A template can say which of its variables it cannot do without. Those are still not
    // errors that block a save - the template may be edited next - but they are the ones
    // worth reading first, so they are separated out and coloured accordingly.
    const optional = missing.filter((name) => !required.includes(name));
    /*
     * A card that has given up its box has nothing left for the style option to paint on:
     * the rules still exist, they just have no element with a size to apply to. Easily
     * done, and invisible when it happens, so it is worth saying out loud.
     */
    const paintsOnHost = HOST_SELECTOR.test(`${template.style ?? ''}\n${this._config?.style ?? ''}`);
    const fitHidesStyle = this._config?.fit === 'contents' && paintsOnHost;
    return html`
      ${
        fitHidesStyle
          ? html`<ha-alert alert-type="warning">${localize('editor.fit_hides_style', undefined, this.hass)}</ha-alert>`
          : html``
      }
      ${
        required.length
          ? html`<ha-alert alert-type="error">
              ${localize(
                required.length === 1 ? 'editor.required_one' : 'editor.required_many',
                { names: required.join(', ') },
                this.hass,
              )}
            </ha-alert>`
          : html``
      }
      ${
        optional.length
          ? html`<ha-alert alert-type="warning">
              ${localize(
                optional.length === 1 ? 'editor.optional_one' : 'editor.optional_many',
                { names: optional.join(', ') },
                this.hass,
              )}
            </ha-alert>`
          : html``
      }
      ${
        unused.length
          ? html`<ha-alert alert-type="info">
              ${localize(
                unused.length === 1 ? 'editor.unused_one' : 'editor.unused_many',
                { names: unused.join(', ') },
                this.hass,
              )}
            </ha-alert>`
          : html``
      }
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    const data = ev.detail.value;
    const declarations = getDeclarations(this._templates?.[data.template]);
    if (!declarations.length) {
      fireEvent(this, 'config-changed', { config: data });
      return;
    }

    const desired: VariablesConfig[] = [];
    for (const declaration of declarations) {
      const value = data[VARIABLE_FIELD_PREFIX + declaration.name];
      // A field left alone or cleared sets nothing, so the template's own default keeps
      // working. An empty string can still be set through the box below.
      if (value !== undefined && value !== '') desired.push({ [declaration.name]: value });
    }
    if (Array.isArray(data.extras)) desired.push(...data.extras);

    const config = { ...this._config, template: data.template } as DeclutteringCardConfig;
    // Whatever shape the config was written in, what is saved back is the list form.
    const variables = mergeVariables(normaliseVariables(this._config?.variables), desired);
    if (variables.length) config.variables = variables;
    else delete config.variables;
    setOrDelete(config, 'for_each', data.for_each);
    setOrDelete(config, 'for_each_from', data.for_each_from);
    setOrDelete(config, 'columns', data.columns);
    setOrDelete(config, 'min_column_width', data.min_column_width);
    setOrDelete(config, 'empty', data.empty);
    setOrDelete(config, 'gap', data.gap);

    fireEvent(this, 'config-changed', { config });
  }

  // The dropdown starts with this dashboard's templates and gains the borrowed ones once
  // the other dashboards have been read.
  private _loadBorrowedTemplates(): void {
    if (!getTemplateSources(this._lovelace).length) return;
    this._loadingTemplates = true;
    collectAllTemplates(this.hass, this._lovelace)
      .then((templates) => {
        this._templates = templates;
        this._schema = undefined;
      })
      .finally(() => {
        this._loadingTemplates = false;
        this.requestUpdate();
      });
  }
}

class DeclutteringTemplate extends DeclutteringElement {
  @property({ type: Boolean, reflect: true }) preview = false;

  @state() private _template?: string;

  static getConfigElement(): HTMLElement {
    return document.createElement(TEMPLATE_EDITOR_TAG);
  }

  static getStubConfig(): DeclutteringTemplateConfig {
    return {
      type: `custom:${TEMPLATE_TAG}`,
      template: 'follow_the_sun',
      card: {
        type: 'entity',
        entity: 'sun.sun',
      },
    };
  }

  static get styles(): CSSResult {
    return css`
      ${DeclutteringElement.styles}
      .badge {
        margin: 8px;
        color: var(--primary-color);
      }
      :host([preview]) {
        display: block !important;
        border: 1px solid var(--primary-color);
      }
    `;
  }

  public setConfig(config: DeclutteringTemplateConfig): void {
    // A template card draws its own definition, so it is the outermost open template for
    // whatever that definition contains. When it is nested inside another template it also
    // inherits the chain stamped above it, so the same self-reference check a consumer makes
    // applies here - otherwise a template that reaches itself through a nested template card
    // would build level after level without end.
    this._openTemplates = chainOf(config);
    this._templateName = config.template;

    if (!config.template) {
      throw new Error(localize('error.missing_template_property'));
    }

    // Said rather than thrown, for the same reason as in DeclutteringCard: a throw in
    // setConfig hides the reason the loop is fixable behind "Configuration error".
    const cycle = findCycle(this._openTemplates, config.template);
    const tooDeep = this._openTemplates.length >= MAX_NESTING;
    if (cycle || tooDeep) {
      this._error = cycle ? describeCycle(cycle) : describeTooDeep(this._openTemplates);
      return;
    }
    this._error = undefined;

    this._template = config.template;
    // The config passed here IS the template, so its style is picked up as the
    // template's own - passing it again as the instance style would emit it twice.
    this._setTemplateConfig(config, undefined, undefined, config.template);
  }

  protected render(): TemplateResult | void {
    this.setHidden(!this.preview);
    if (this.preview) {
      return html`
        <div class="badge">${this._template}</div>
        ${super.render()}
      `;
    }
    return html``;
  }

  private setHidden(hidden: boolean): void {
    if (this.hasAttribute('hidden') !== hidden) {
      this.toggleAttribute('hidden', hidden);
      this.dispatchEvent(
        new Event('card-visibility-changed', {
          bubbles: true,
          composed: true,
        }),
      );
    }
  }
}

class DeclutteringTemplateEditor extends LitElement implements LovelaceCardEditor {
  @state() private _config?: DeclutteringTemplateConfig;
  @state() private _selectedTab = 'settings';

  // The Share tab's import box: what has been pasted, whether it parsed, and what is
  // wrong with it. The name clash is held separately because it is a warning the user
  // is allowed to overrule, not a reason to refuse.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _importValue?: any;
  private _importParses = true;
  @state() private _importErrors: string[] = [];
  @state() private _importClash?: string;
  @state() private _copyState: '' | 'done' | 'failed' = '';

  // A pending suggestion, held between the press that works it out and the press that
  // applies it - rewriting somebody's card is not something to do on a single click.
  @state() private _suggestion?: { card: unknown; variables: VariableDeclaration[] };
  @state() private _suggestedNothing = false;

  // The Where-used counts, keyed by what they were computed from. The dialog re-renders
  // on every state change Home Assistant sends, and the answer only changes with the
  // template's name or the dashboard config - so the key, not an event, decides when to
  // recount. Not reactive state: whatever changes the key also changes state that renders.
  private _usages?: { name: string; ll: unknown; usages: TemplateUsages };

  @state() private _renameTo = '';
  @state() private _renameError?: string;
  @state() private _renaming = false;
  // The name the next press would rename to, set by the press before it. Renaming rewrites
  // cards outside this editor and saves at once, so it is asked twice like a suggestion is.
  @state() private _renamePending?: string;
  @state() private _duplicateTo = '';
  @state() private _duplicatePending?: string;
  @state() private _toolError?: string;
  @state() private _busy = false;
  @state() private _modernisePending = false;
  @state() private _installPending?: string;
  @state() private _librarySelected?: string;

  @property() public lovelace?: LovelaceConfig;
  @property() public hass?: HomeAssistant;

  private _loadedElements = false;

  // One shared instance, built on first use so it speaks the user's language - a fresh
  // schema object per render would mark every field dirty for no reason.
  private static _schema?: unknown[];
  private static schema(): unknown[] {
    DeclutteringTemplateEditor._schema ??= [
      {
        name: 'template',
        label: localize('template_editor.template_label'),
        selector: { text: {} },
      },
      {
        name: 'thingType',
        label: localize('template_editor.type_label'),
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'card', label: localize('template_editor.type_card') },
              { value: 'badge', label: localize('template_editor.type_badge') },
              { value: 'row', label: localize('template_editor.type_row') },
              { value: 'element', label: localize('template_editor.type_element') },
            ],
          },
        },
      },
      {
        name: 'description',
        label: localize('template_editor.description_label'),
        helper: localize('template_editor.description_helper'),
        selector: { text: { multiline: true } },
      },
      {
        name: 'variables',
        label: localize('template_editor.declarations_label'),
        helper: localize('template_editor.declarations_helper'),
        selector: { object: {} },
      },
      {
        name: 'default',
        label: localize('template_editor.defaults_label'),
        helper: localize('template_editor.defaults_helper'),
        selector: { object: {} },
      },
    ];
    return DeclutteringTemplateEditor._schema;
  }

  public setConfig(config: DeclutteringTemplateConfig): void {
    this._config = config;
    // Config can also arrive from outside - the dialog's YAML mode, an undo - and a
    // suggestion computed against the old card must not survive that any more than it
    // survives an edit made here.
    this._suggestion = undefined;
    this._suggestedNothing = false;
  }

  static get styles(): CSSResult {
    return css`
      ${DeclutteringElement.styles}
      ha-tab-group {
        display: block;
        margin-bottom: 16px;
      }
      .share h3 {
        margin: 0 0 4px;
      }
      .share h3 ~ h3 {
        margin-top: 24px;
      }
      .share .hint {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .share ha-alert {
        display: block;
        margin-bottom: 8px;
      }
      .share mwc-button {
        margin-top: 8px;
      }
      .suggest {
        margin-bottom: 16px;
      }
      .suggest ha-alert {
        display: block;
        margin-bottom: 8px;
      }
      .usages ha-alert {
        display: block;
        margin-bottom: 8px;
      }
      .usages ul {
        margin: 0;
        padding-left: 20px;
      }
      .usages li {
        margin-bottom: 4px;
      }
      .rename {
        margin-top: 24px;
      }
      .rename h3 {
        margin: 0 0 4px;
      }
      .rename .hint {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .rename ha-textfield {
        display: block;
        width: 100%;
      }
      .rename mwc-button {
        margin-top: 8px;
      }
      .order ul {
        margin: 0 0 8px;
        padding: 0;
        list-style: none;
      }
      .order li {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 0;
        border-bottom: 1px solid var(--divider-color);
      }
      .order .spacer {
        flex: 1;
      }
      .library {
        margin: 0 0 8px;
      }
      .library .hint {
        margin: 8px 0 0;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .library mwc-button {
        margin-top: 8px;
      }
    `;
  }

  async connectedCallback(): Promise<void> {
    super.connectedCallback();

    if (!this._loadedElements) {
      await loadCardEditorPicker();
      await loadRowEditor();
      this._loadedElements = true;
    }
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._config) return html``;

    const error: Record<string, string | string[]> = {};
    if (!isVariablesShape(this._config.default)) {
      error.default = localize('error.variables_shape', undefined, this.hass);
    }
    if (this._config.variables !== undefined && !Array.isArray(this._config.variables)) {
      error.variables = localize('template_editor.declarations_shape', undefined, this.hass);
    }

    const data = {
      template: this._config.template,
      thingType: getThingType(this._config) ?? 'card',
      description: this._config.description,
      variables: this._config.variables,
      default: this._config.default,
    };

    return html`
      <ha-tab-group .active=${this._selectedTab} @click=${this._activateTab}>
        <ha-tab-group-tab slot="nav" panel="settings">
          ${localize('template_editor.tab_settings', undefined, this.hass)}
        </ha-tab-group-tab>
        ${
          data.thingType === 'card'
            ? html`
                <ha-tab-group-tab slot="nav" panel="card">
                  ${localize('template_editor.tab_card', undefined, this.hass)}
                </ha-tab-group-tab>
                <ha-tab-group-tab slot="nav" panel="change_card">
                  ${localize('template_editor.tab_change_card', undefined, this.hass)}
                </ha-tab-group-tab>
              `
            : data.thingType === 'row'
              ? html`<ha-tab-group-tab slot="nav" panel="row">
                  ${localize('template_editor.tab_row', undefined, this.hass)}
                </ha-tab-group-tab>`
              : html``
        }
        <ha-tab-group-tab slot="nav" panel="usages">
          ${localize('template_editor.tab_usages', undefined, this.hass)}
        </ha-tab-group-tab>
        <ha-tab-group-tab slot="nav" panel="share">
          ${localize('template_editor.tab_share', undefined, this.hass)}
        </ha-tab-group-tab>
      </ha-tab-group>
      ${
        this._selectedTab === 'settings'
          ? html`
              ${this._renderInUse()} ${this._renderDiagnostics()} ${this._renderSuggest(data.thingType === 'card')}
              ${this._renderOrder()}
              <ha-form
                .hass=${this.hass}
                .data=${data}
                .schema=${DeclutteringTemplateEditor.schema()}
                .error=${error}
                .computeLabel=${(s): string => s.label ?? s.name}
                .computeHelper=${(s): string => s.helper ?? ''}
                @value-changed=${this._valueChanged}
              ></ha-form>
            `
          : this._selectedTab === 'card'
            ? html`
                <hui-card-element-editor
                  .hass=${this.hass}
                  .lovelace=${this.lovelace}
                  .value=${this._config.card}
                  @config-changed=${this._cardChanged}
                ></hui-card-element-editor>
              `
            : this._selectedTab === 'change_card'
              ? html`
                  <hui-card-picker
                    .hass=${this.hass}
                    .lovelace=${this.lovelace}
                    @config-changed=${this._cardPicked}
                  ></hui-card-picker>
                `
              : this._selectedTab === 'row'
                ? html`
                    <hui-row-element-editor
                      .hass=${this.hass}
                      .lovelace=${this.lovelace}
                      .value=${this._config.row}
                      @config-changed=${this._rowChanged}
                    ></hui-row-element-editor>
                  `
                : this._selectedTab === 'usages'
                  ? this._renderUsages()
                  : this._selectedTab === 'share'
                    ? this._renderShare()
                    : html``
      }
    `;
  }

  /*
   * What the template says about itself against what it actually uses. Both are worth
   * knowing while writing one, and neither is a reason to refuse the configuration.
   */
  private _renderDiagnostics(): TemplateResult {
    if (!this._config || (this._config.variables !== undefined && !Array.isArray(this._config.variables))) {
      return html``;
    }

    const { unused, duplicated, contradictory } = diagnoseTemplate(this._config);
    return html`
      ${
        unused.length
          ? html`<ha-alert alert-type="info">
              ${localize(
                unused.length === 1 ? 'template_editor.declared_unused_one' : 'template_editor.declared_unused_many',
                { names: unused.join(', ') },
                this.hass,
              )}
            </ha-alert>`
          : html``
      }
      ${
        duplicated.length
          ? html`<ha-alert alert-type="warning">
              ${localize(
                duplicated.length === 1 ? 'template_editor.duplicated_one' : 'template_editor.duplicated_many',
                { names: duplicated.join(', ') },
                this.hass,
              )}
            </ha-alert>`
          : html``
      }
      ${
        contradictory.length
          ? html`<ha-alert alert-type="warning">
              ${localize(
                contradictory.length === 1 ? 'template_editor.contradictory_one' : 'template_editor.contradictory_many',
                { names: contradictory.join(', ') },
                this.hass,
              )}
            </ha-alert>`
          : html``
      }
    `;
  }

  /*
   * A declaration's place in the list is its place in the form every card using the
   * template gets, so changing the order meant hand-editing the YAML underneath - the very
   * thing the visual editor is for.
   */
  private _renderOrder(): TemplateResult {
    const declarations = getDeclarations(this._config);
    if (declarations.length < 2) return html``;

    return html`
      <div class="order">
        <p class="hint">${localize('template_editor.order_hint', undefined, this.hass)}</p>
        <ul>
          ${declarations.map(
            (declaration, index) => html`
              <li>
                <span>${declaration.label ?? declaration.name}</span>
                <span class="spacer"></span>
                <ha-icon-button
                  .path=${'M7,15L12,10L17,15H7Z'}
                  .disabled=${index === 0}
                  .label=${localize('template_editor.move_up', { name: declaration.name }, this.hass)}
                  @click=${(): void => this._move(index, -1)}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${'M7,10L12,15L17,10H7Z'}
                  .disabled=${index === declarations.length - 1}
                  .label=${localize('template_editor.move_down', { name: declaration.name }, this.hass)}
                  @click=${(): void => this._move(index, 1)}
                ></ha-icon-button>
              </li>
            `,
          )}
        </ul>
      </div>
    `;
  }

  private _move(index: number, by: number): void {
    const declarations = [...getDeclarations(this._config)];
    const to = index + by;
    if (to < 0 || to >= declarations.length) return;
    [declarations[index], declarations[to]] = [declarations[to], declarations[index]];
    this._fireConfigChanged({ ...(this._config as DeclutteringTemplateConfig), variables: declarations });
  }

  /*
   * What a change to this template would break. The Where used tab says the same thing, but
   * only if you go and look - and the moment that matters is when the card is open in front
   * of you, about to be edited or deleted.
   */
  private _renderInUse(): TemplateResult {
    const name = this._config?.template;
    const ll = this.lovelace ?? getLovelaceConfig();
    if (!name || !ll) return html``;

    const { views, templates } = collectUsages(ll, name);
    const total = views.reduce((sum, view) => sum + view.count, 0) + templates.length;
    if (!total) return html``;

    return html`<ha-alert alert-type="info">
      ${localize(total === 1 ? 'template_editor.in_use_one' : 'template_editor.in_use_many', { total }, this.hass)}
    </ha-alert>`;
  }

  /*
   * Turning a card you already built into a template means deciding which parts of it
   * change between copies. The entities, names and icons in it almost always do, so they
   * are proposed for you - with each variable defaulting to the value it replaced, so the
   * template still renders exactly what the card did.
   */
  private _renderSuggest(isCard: boolean): TemplateResult {
    if (!isCard || !this._config?.card) return html``;

    return html`
      <div class="suggest">
        ${
          this._suggestedNothing
            ? html`<ha-alert alert-type="info">
                ${localize('template_editor.suggest_nothing', undefined, this.hass)}
              </ha-alert>`
            : html``
        }
        ${
          this._suggestion
            ? html`<ha-alert alert-type="warning">
                ${localize(
                  this._suggestion.variables.length === 1
                    ? 'template_editor.suggest_confirm_one'
                    : 'template_editor.suggest_confirm_many',
                  { names: this._suggestion.variables.map((variable) => variable.name).join(', ') },
                  this.hass,
                )}
              </ha-alert>`
            : html``
        }
        <mwc-button @click=${this._suggest}>
          ${localize(
            this._suggestion ? 'template_editor.suggest_anyway' : 'template_editor.suggest_button',
            undefined,
            this.hass,
          )}
        </mwc-button>
      </div>
    `;
  }

  private _suggest(): void {
    if (!this._config?.card) return;

    if (this._suggestion) {
      const config = { ...this._config, card: this._suggestion.card };
      // Existing declarations are kept: the suggestion was worked out around them.
      config.variables = [...getDeclarations(this._config), ...this._suggestion.variables];
      this._suggestion = undefined;
      this._fireConfigChanged(config as DeclutteringTemplateConfig);
      return;
    }

    this._suggestedNothing = false;
    const taken = getDeclarations(this._config).map((declaration) => declaration.name);
    const suggestion = suggestVariables(this._config.card, taken);
    if (!suggestion.variables.length) {
      this._suggestedNothing = true;
      return;
    }
    this._suggestion = suggestion;
  }

  /*
   * What a change to this template would affect. A template is worth changing only when
   * you know what it is holding up, and the answer is not visible from the template card
   * itself - the cards using it can be anywhere on the dashboard.
   */
  private _renderUsages(): TemplateResult {
    const name = this._config?.template;
    if (!name) return html``;

    // The fallback matters in the editor contexts that never set lovelace. When neither
    // source yields a config, say so - an unreadable dashboard must not present itself
    // as one where nothing uses the template.
    const ll = this.lovelace ?? getLovelaceConfig();
    if (!ll) {
      return html`<div class="usages">
        <ha-alert alert-type="warning">${localize('template_editor.usages_unreadable', undefined, this.hass)}</ha-alert>
      </div>`;
    }
    if (this._usages?.name !== name || this._usages.ll !== ll) {
      this._usages = { name, ll, usages: collectUsages(ll, name) };
    }
    const { views, templates } = this._usages.usages;
    const total = views.reduce((sum, view) => sum + view.count, 0);
    const dashboard = document.location.pathname.split('/').slice(0, 2).join('/');

    return html`
      <div class="usages">
        ${
          total === 0 && !templates.length
            ? html`<ha-alert alert-type="info">
                ${localize('template_editor.usages_none', { name }, this.hass)}
              </ha-alert>`
            : html`
                <p class="hint">
                  ${localize(
                    total === 1 ? 'template_editor.usages_one' : 'template_editor.usages_many',
                    { total, name },
                    this.hass,
                  )}
                </p>
                <ul>
                  ${views.map(
                    // A view with no path is addressed by its position, which is how Home
                    // Assistant itself links such views.
                    (view) => html`
                      <li>
                        <a href=${`${dashboard}/${view.path || view.index}`} target="_blank" rel="noreferrer">
                          ${view.title || view.path || localize('template_editor.untitled_view', undefined, this.hass)}
                        </a>
                        —
                        ${
                          view.count === 1
                            ? localize('template_editor.used_once', undefined, this.hass)
                            : localize('template_editor.used_times', { count: view.count }, this.hass)
                        }
                      </li>
                    `,
                  )}
                </ul>
              `
        }
        ${
          templates.length
            ? html`<ha-alert alert-type="info">
                ${localize(
                  templates.length === 1 ? 'template_editor.used_by_template' : 'template_editor.used_by_templates',
                  { names: templates.join(', ') },
                  this.hass,
                )}
              </ha-alert>`
            : html``
        }
        ${this._renderRename(name, total)} ${this._renderDuplicate(name)} ${this._renderModernise()}
        ${this._toolError ? html`<ha-alert alert-type="error">${this._toolError}</ha-alert>` : html``}
      </div>
    `;
  }

  /*
   * A template is a self-contained block of configuration, so handing one to another
   * person is mostly a matter of writing it out. What does not travel with it - the
   * custom cards it is built from, the other templates it calls - is named above the
   * box, because whoever receives it cannot tell from the YAML alone.
   */
  private _renderShare(): TemplateResult {
    const { payload, notes } = buildExport(this._config);

    return html`
      <div class="share">
        <h3>${localize('share.export_header', undefined, this.hass)}</h3>
        <p class="hint">${localize('share.export_hint', undefined, this.hass)}</p>
        ${notes.map((note) => html`<ha-alert alert-type="info">${note}</ha-alert>`)}
        <ha-yaml-editor id="export" .hass=${this.hass} .defaultValue=${payload} read-only></ha-yaml-editor>
        <mwc-button @click=${this._copyExport}>
          ${
            this._copyState === 'done'
              ? localize('share.copied', undefined, this.hass)
              : this._copyState === 'failed'
                ? localize('share.copy_failed', undefined, this.hass)
                : localize('share.copy', undefined, this.hass)
          }
        </mwc-button>

        <h3>${localize('share.import_header', undefined, this.hass)}</h3>
        <p class="hint">${localize('share.import_hint', undefined, this.hass)}</p>
        <ha-yaml-editor .hass=${this.hass} @value-changed=${this._importChanged}></ha-yaml-editor>
        ${this._importErrors.map((error) => html`<ha-alert alert-type="error">${error}</ha-alert>`)}
        ${
          this._importClash
            ? html`<ha-alert alert-type="warning">
                ${localize('share.import_clash', { name: this._importClash }, this.hass)}
              </ha-alert>`
            : html``
        }
        <mwc-button @click=${this._import}>
          ${localize(this._importClash ? 'share.import_anyway' : 'share.import', undefined, this.hass)}
        </mwc-button>

        <h3>${localize('share.library_header', undefined, this.hass)}</h3>
        <p class="hint">${localize('share.library_hint', undefined, this.hass)}</p>
        ${this._renderLibrary()}
      </div>
    `;
  }

  /*
   * The hard part of this card has never been the syntax - it is the blank page. These are
   * carried in the bundle rather than fetched, so a dashboard never has to reach the
   * internet to show one, and nobody has to think about what it is talking to.
   */
  private _renderLibrary(): TemplateResult {
    const existing = Object.keys(collectTemplates(getLovelacePanel()?.config ?? this.lovelace ?? getLovelaceConfig()));
    const entry = this._librarySelected ? libraryEntry(this._librarySelected) : undefined;
    const already = !!entry && existing.includes(entry.name);
    const armed = !!entry && this._installPending === entry.name;
    const needs = entry ? libraryNeeds(entry, existing) : [];

    return html`
      <div class="library">
        <ha-form
          .hass=${this.hass}
          .data=${{ entry: this._librarySelected ?? '' }}
          .schema=${[
            {
              name: 'entry',
              selector: {
                select: {
                  mode: 'dropdown',
                  options: LIBRARY.map((each) => ({ value: each.name, label: each.name })),
                },
              },
            },
          ]}
          .computeLabel=${(): string => localize('share.library_pick', undefined, this.hass)}
          @value-changed=${this._libraryPicked}
        ></ha-form>
        ${
          entry
            ? html`
                <p class="hint">${localize(`library.${entry.name}.summary`, undefined, this.hass)}</p>
                ${
                  needs.length
                    ? html`<p class="hint">
                        ${localize('share.library_needs', { names: needs.join(', ') }, this.hass)}
                      </p>`
                    : html``
                }
                <mwc-button .disabled=${this._busy || already} @click=${(): void => void this._install(entry.name)}>
                  ${localize(
                    already ? 'share.already_here' : armed ? 'share.install_anyway' : 'share.install',
                    undefined,
                    this.hass,
                  )}
                </mwc-button>
              `
            : html``
        }
      </div>
    `;
  }

  private _libraryPicked(ev: CustomEvent): void {
    // The template editor's own settings form also listens for value-changed; this one is
    // not part of the card's configuration, so it must not reach that handler. Switching
    // entries also disarms a half-confirmed install of the previous one.
    ev.stopPropagation();
    this._librarySelected = (ev.detail.value as { entry?: string }).entry || undefined;
    this._installPending = undefined;
  }

  private async _install(name: string): Promise<void> {
    const entry = libraryEntry(name);
    if (!entry) return;
    if (this._installPending !== name) {
      this._installPending = name;
      return;
    }

    const panel = getLovelacePanel();
    const existing = Object.keys(collectTemplates(panel?.config ?? this.lovelace ?? getLovelaceConfig()));
    // What it calls comes with it, or the card it adds would point at a name that is not
    // there. Anything already on the dashboard is left exactly as it is.
    const wanted = [...libraryNeeds(entry, existing), entry.name].filter((each) => !existing.includes(each));
    const here = findTemplateLocation(panel?.config ?? this.lovelace, this._config?.template ?? '');
    const view = here?.view?.index ?? 0;

    const saved = await this._saveDashboard((config) =>
      wanted.reduce((built, each) => {
        const one = libraryEntry(each);
        return one ? addCardToView(built, view, { type: TEMPLATE_TYPE, template: one.name, ...one.template }) : built;
      }, config),
    );
    if (saved) this._installPending = undefined;
  }

  /*
   * Renaming is the one edit a template card cannot make on its own: every card naming the
   * old template would break the moment the new name was saved. So it is done here, across
   * the whole dashboard at once, rather than by editing the name field above.
   */
  private _renderRename(name: string, total: number): TemplateResult {
    const to = this._renameTo.trim();
    const armed = !!to && this._renamePending === to;
    const rewrites = total
      ? total === 1
        ? localize('tools.rewrites_one', undefined, this.hass)
        : localize('tools.rewrites_many', { count: total }, this.hass)
      : '';
    return html`
      <div class="rename">
        <h3>${localize('tools.rename_header', undefined, this.hass)}</h3>
        <p class="hint">${localize('tools.rename_hint', undefined, this.hass)}</p>
        ${this._renameError ? html`<ha-alert alert-type="error">${this._renameError}</ha-alert>` : html``}
        ${
          armed
            ? html`<ha-alert alert-type="warning">
                ${localize('tools.rename_confirm', { from: name, to, rewrites }, this.hass)}
              </ha-alert>`
            : html``
        }
        <ha-textfield
          label=${localize('tools.new_name', undefined, this.hass)}
          .value=${this._renameTo}
          .disabled=${this._renaming}
          @input=${this._renameChanged}
        ></ha-textfield>
        <mwc-button .disabled=${this._renaming || !to || to === name} @click=${this._rename}>
          ${
            armed
              ? localize('tools.rename_anyway', undefined, this.hass)
              : total === 1
                ? localize('tools.rename_update_one', undefined, this.hass)
                : total
                  ? localize('tools.rename_update_many', { count: total }, this.hass)
                  : localize('tools.rename', undefined, this.hass)
          }
        </mwc-button>
      </div>
    `;
  }

  /**
   * Saves a rewritten dashboard, and says what went wrong if it cannot. Everything here
   * changes cards this editor does not own, so it goes through the dashboard itself rather
   * than through config-changed.
   */
  private async _saveDashboard(build: (config: unknown) => unknown): Promise<boolean> {
    const panel = getLovelacePanel();
    if (!panel) {
      this._toolError = localize('tools.cannot_save_here', undefined, this.hass);
      return false;
    }
    this._busy = true;
    this._toolError = undefined;
    try {
      await panel.saveConfig(build(panel.config));
      return true;
    } catch (err) {
      this._toolError = localize('tools.save_failed', { message: (err as Error)?.message ?? err }, this.hass);
      return false;
    } finally {
      this._busy = false;
    }
  }

  /*
   * Installing this card over the original needs no changes - it answers to both sets of
   * names. But a dashboard still saying `custom:decluttering-card` everywhere breaks the
   * day the original is installed alongside it, because Home Assistant loads resources in
   * the order they were added and the original would win.
   */
  private _renderModernise(): TemplateResult {
    const ll = getLovelacePanel()?.config ?? this.lovelace ?? getLovelaceConfig();
    const old = ll ? countLegacyTypes(ll) : 0;
    if (!old) return html``;

    return html`
      <div class="rename">
        <h3>${localize('tools.modernise_header', undefined, this.hass)}</h3>
        <p class="hint">
          ${localize(old === 1 ? 'tools.modernise_hint_one' : 'tools.modernise_hint_many', { count: old }, this.hass)}
        </p>
        ${
          this._modernisePending
            ? html`<ha-alert alert-type="warning">
                ${localize(
                  old === 1 ? 'tools.modernise_confirm_one' : 'tools.modernise_confirm_many',
                  { count: old },
                  this.hass,
                )}
              </ha-alert>`
            : html``
        }
        <mwc-button .disabled=${this._busy} @click=${this._modernise}>
          ${localize(
            this._modernisePending
              ? 'tools.modernise_anyway'
              : old === 1
                ? 'tools.modernise_one'
                : 'tools.modernise_many',
            undefined,
            this.hass,
          )}
        </mwc-button>
      </div>
    `;
  }

  private async _modernise(): Promise<void> {
    if (!this._modernisePending) {
      this._modernisePending = true;
      return;
    }
    const saved = await this._saveDashboard((config) => moderniseTypes(config));
    if (saved) this._modernisePending = false;
  }

  private _renameChanged(ev: Event): void {
    this._renameTo = (ev.target as HTMLInputElement).value ?? '';
    this._renameError = undefined;
    // Whatever was agreed to was agreed to for the old name, not this one.
    this._renamePending = undefined;
  }

  private async _rename(): Promise<void> {
    const from = this._config?.template;
    const to = this._renameTo.trim();
    if (!from || !to || to === from) return;

    // The dashboard object, not its configuration: renaming rewrites cards this editor
    // does not own, so it has to be saved as a whole rather than through config-changed.
    const panel = getLovelacePanel();
    if (!panel) {
      this._renameError = localize('tools.cannot_rename_here', undefined, this.hass);
      return;
    }
    if (collectTemplates(panel.config)[to] !== undefined) {
      this._renameError = localize('tools.name_taken', { name: to }, this.hass);
      return;
    }

    if (this._renamePending !== to) {
      this._renamePending = to;
      return;
    }

    this._renaming = true;
    this._renameError = undefined;
    try {
      await panel.saveConfig(renameTemplate(panel.config, from, to));
      // The dialog still holds this card under its old name, and saving it afterwards
      // would put that name straight back - so it is told about the change too.
      this._fireConfigChanged({ ...this._config, template: to } as DeclutteringTemplateConfig);
      this._renameTo = '';
      this._renamePending = undefined;
    } catch (err) {
      this._renameError = localize('tools.save_failed', { message: (err as Error)?.message ?? err }, this.hass);
    } finally {
      this._renaming = false;
    }
  }

  /*
   * Most new templates start life as a variant of one that exists. There was no way to make
   * one but to export it from the Share tab, paste it back, and rename it by hand.
   */
  private _renderDuplicate(name: string): TemplateResult {
    const to = this._duplicateTo.trim();
    const armed = !!to && this._duplicatePending === to;
    return html`
      <div class="rename">
        <h3>${localize('tools.duplicate_header', undefined, this.hass)}</h3>
        <p class="hint">${localize('tools.duplicate_hint', undefined, this.hass)}</p>
        ${
          armed
            ? html`<ha-alert alert-type="warning">
                ${localize('tools.duplicate_confirm', { to, name }, this.hass)}
              </ha-alert>`
            : html``
        }
        <ha-textfield
          label=${localize('tools.copy_name', undefined, this.hass)}
          .value=${this._duplicateTo}
          .disabled=${this._busy}
          @input=${this._duplicateChanged}
        ></ha-textfield>
        <mwc-button .disabled=${this._busy || !to || to === name} @click=${this._duplicate}>
          ${localize(armed ? 'tools.duplicate_anyway' : 'tools.duplicate', undefined, this.hass)}
        </mwc-button>
      </div>
    `;
  }

  private _duplicateChanged(ev: Event): void {
    this._duplicateTo = (ev.target as HTMLInputElement).value ?? '';
    this._toolError = undefined;
    this._duplicatePending = undefined;
  }

  private async _duplicate(): Promise<void> {
    const from = this._config?.template;
    const to = this._duplicateTo.trim();
    if (!from || !to || to === from) return;

    const panel = getLovelacePanel();
    if (panel && collectTemplates(panel.config)[to] !== undefined) {
      this._toolError = localize('tools.name_taken', { name: to }, this.hass);
      return;
    }
    if (this._duplicatePending !== to) {
      this._duplicatePending = to;
      return;
    }

    const copy = { ...(this._config as DeclutteringTemplateConfig), template: to };
    // Beside the one being copied, which is where somebody would look for it.
    const here = findTemplateLocation(panel?.config ?? this.lovelace, from);
    const saved = await this._saveDashboard((config) => addCardToView(config, here?.view?.index ?? 0, copy));
    if (saved) {
      this._duplicateTo = '';
      this._duplicatePending = undefined;
    }
  }

  private async _copyExport(): Promise<void> {
    const editor = this.renderRoot.querySelector('#export');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const yaml = (editor as any)?.yaml;
    if (!yaml) return;

    const { notes } = buildExport(this._config);
    // The notes ride along as comments, so they are still there when the text is pasted
    // somewhere that cannot show them. YAML ignores them on the way back in.
    const text = [...notes.map((note) => `# ${note}`), yaml].join('\n');

    this._copyState = (await copyText(text)) ? 'done' : 'failed';
    setTimeout(() => (this._copyState = ''), 3000);
  }

  private _importChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    this._importValue = ev.detail.value;
    this._importParses = ev.detail.isValid !== false;
    this._importErrors = [];
    this._importClash = undefined;
  }

  private _import(): void {
    if (!this._config) return;

    if (!this._importParses) {
      this._importErrors = [localize('share.import_not_yaml', undefined, this.hass)];
      return;
    }

    const result = validateImport(this._importValue);
    if (!result.ok) {
      this._importErrors = result.errors;
      this._importClash = undefined;
      return;
    }
    this._importErrors = [];

    const name = this._importValue.template;
    const existing = collectTemplates(this.lovelace ?? getLovelaceConfig());
    if (!this._importClash && name !== this._config.template && name in existing) {
      this._importClash = name;
      return;
    }

    // Keep the card's own type: the export may have come from the legacy tag, and which
    // tag this card uses is a property of where it lives, not of what was shared.
    this._fireConfigChanged({ ...this._importValue, type: this._config.type });
    this._importClash = undefined;
    this._selectedTab = 'settings';
  }

  /*
   * Read the panel off the clicked tab rather than listening for the tab group's own
   * show event, whose name has followed the underlying component through several
   * renames. A click on the tab strip is the same signal and does not move.
   */
  private _activateTab(ev: Event): void {
    const tab = ev.composedPath().find((node) => (node as HTMLElement).localName === 'ha-tab-group-tab') as
      HTMLElement | undefined;
    const panel = tab?.getAttribute('panel');
    if (panel) this._selectedTab = panel;
  }

  private _valueChanged(ev: CustomEvent): void {
    if (!this._config) return;
    const data = ev.detail.value;
    const config = { ...this._config, template: data.template, default: data.default };
    // Unlike the stubs below, these replace whatever is already there rather than only
    // filling in what is absent.
    setOrDelete(config, 'description', data.description);
    setOrDelete(config, 'variables', data.variables);
    for (const [thingType, stub] of Object.entries(THING_STUBS)) {
      DeclutteringTemplateEditor.stubMember(data.thingType === thingType, config, thingType, stub);
    }
    this._fireConfigChanged(config);
  }

  private _cardChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;

    this._suggestion = undefined;
    this._suggestedNothing = false;
    const config = { ...this._config, card: ev.detail.config };
    this._fireConfigChanged(config);
  }

  private _cardPicked(ev: CustomEvent): void {
    this._selectedTab = 'card';
    this._cardChanged(ev);
  }

  private _rowChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;

    const config = { ...this._config, row: ev.detail.config };
    this._fireConfigChanged(config);
  }

  private _fireConfigChanged(config: DeclutteringTemplateConfig): void {
    // Any change invalidates a suggestion computed against the old template - applying a
    // stale one would rewrite a card the user has since edited, or clash with a name they
    // have since declared.
    this._suggestion = undefined;
    this._suggestedNothing = false;
    fireEvent(this, 'config-changed', { config });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static stubMember(include: boolean, dict: any, name: string, stub: any): void {
    if (include) {
      if (!(name in dict)) dict[name] = stub;
    } else {
      delete dict[name];
    }
  }
}

/**
 * Defines `tag`, unless something else already claimed it — either the original
 * decluttering-card, or a second copy of this bundle. Returns true if this bundle
 * ended up owning the tag.
 */
function defineElement(tag: string, cls: CustomElementConstructor): boolean {
  if (customElements.get(tag)) {
    console.warn(localize('warn.tag_taken', { tag }));
    return false;
  }
  customElements.define(tag, cls);
  return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customCards: any[] = ((window as any).customCards = (window as any).customCards || []);
// Home Assistant keeps a separate registry for badges, which is what its badge picker reads.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customBadges: any[] = ((window as any).customBadges = (window as any).customBadges || []);

// Shown as the documentation link on the entry in Home Assistant's card and badge pickers.
const DOCUMENTATION_URL = 'https://github.com/tempus2016/decluttering-card-plus';

defineElement(CARD_EDITOR_TAG, DeclutteringCardEditor);
defineElement(TEMPLATE_EDITOR_TAG, DeclutteringTemplateEditor);

if (defineElement(CARD_TAG, DeclutteringCard)) {
  customCards.push({
    type: CARD_TAG,
    documentationURL: DOCUMENTATION_URL,
    name: 'Decluttering Card Plus',
    preview: false,
    description: localize('picker.card_description'),
  });
  customBadges.push({
    type: CARD_TAG,
    documentationURL: DOCUMENTATION_URL,
    name: 'Decluttering Card Plus',
    preview: false,
    description: localize('picker.badge_description'),
  });
}

if (defineElement(TEMPLATE_TAG, DeclutteringTemplate)) {
  customCards.push({
    type: TEMPLATE_TAG,
    documentationURL: DOCUMENTATION_URL,
    name: 'Decluttering Template Plus',
    preview: false,
    description: localize('picker.template_description'),
  });
}

/*
 * Drop-in replacement for the original card: claim `decluttering-card` and
 * `decluttering-template` as well, so existing configurations keep working without
 * being edited. If the original card is also installed it registers those tags first
 * (or we do, depending on resource order) and whoever loses simply skips them.
 *
 * A single constructor cannot be registered under two tags, hence the subclasses.
 */
class LegacyDeclutteringCard extends DeclutteringCard {
  static getStubConfig(): DeclutteringCardConfig {
    return { ...DeclutteringCard.getStubConfig(), type: `custom:${LEGACY_CARD_TAG}` };
  }
}

class LegacyDeclutteringTemplate extends DeclutteringTemplate {
  static getStubConfig(): DeclutteringTemplateConfig {
    return { ...DeclutteringTemplate.getStubConfig(), type: `custom:${LEGACY_TEMPLATE_TAG}` };
  }
}

if (defineElement(LEGACY_CARD_TAG, LegacyDeclutteringCard)) {
  customCards.push({
    type: LEGACY_CARD_TAG,
    documentationURL: DOCUMENTATION_URL,
    name: 'Decluttering Card (compatibility)',
    preview: false,
    description: localize('picker.legacy_card_description'),
  });
}

if (defineElement(LEGACY_TEMPLATE_TAG, LegacyDeclutteringTemplate)) {
  customCards.push({
    type: LEGACY_TEMPLATE_TAG,
    documentationURL: DOCUMENTATION_URL,
    name: 'Decluttering Template (compatibility)',
    preview: false,
    description: localize('picker.legacy_template_description'),
  });
}
