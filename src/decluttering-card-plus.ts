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
import {
  collectTemplates,
  collectAllTemplates,
  collectUsages,
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
  variableName,
  variableValues,
  VariableDeclaration,
} from './variables';
import { columnsFor } from './layout';
import { isRegistrySource, registryKey, registryNames, resolveRegistryItems, sameRegistry } from './registry';
import { copyText, getLovelaceConfig, getLovelacePanel } from './utils';
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

// One shared instance: the editor re-renders on every state change Home Assistant sends,
// and a fresh schema object each time would mark every field dirty for no reason.
const REPEAT_SCHEMA = [
  {
    name: 'for_each',
    label: 'Repeat for each',
    helper: 'One copy of the template per item. Example: - entity: light.hall, name: Hall',
    selector: { object: {} },
  },
  {
    name: 'for_each_from',
    label: 'Repeat for each thing Home Assistant knows about',
    helper: 'One copy per entity or area, kept up to date. Example: domain: light, area: Kitchen',
    selector: { object: {} },
  },
  {
    name: 'columns',
    label: 'Columns',
    helper: 'How many copies sit side by side. One stacks them vertically',
    selector: { number: { min: 1, max: 6, mode: 'box' } },
  },
  {
    name: 'min_column_width',
    label: 'Minimum column width',
    helper: 'Pixels. Drops a column rather than going narrower, so the card suits a phone too',
    selector: { number: { min: 50, max: 1000, step: 10, mode: 'box' } },
  },
];

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

function getThingType(templateConfig: TemplateConfig): LovelaceThingType | undefined {
  const thingTypes = Object.keys(templateConfig).filter((key) => ['card', 'row', 'element', 'badge'].includes(key));
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

  private _thingConfig?: LovelaceThingConfig;
  private _thingType?: LovelaceThingType;
  // One observer for the element's lifetime. A new one per wrapped card leaked a live
  // observer on every reconfigure, and left them all running after the card was gone.
  private _resizes?: ResizeObserver;
  // The copies of a repeated template, kept so the layout can change without resolving
  // them again, and the column count currently on show so it only rebuilds when it moves.
  private _forEach?: { cards: unknown[]; max: number; minWidth?: number; styles: string };
  private _columnsShown?: number;
  private _widths?: ResizeObserver;
  private _savedStyles?: Map<string, [string, string]>;
  @state() private _style?: string;

  @state() protected _error?: string;

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
      :host(.child-card-hidden) {
        display: none;
      }
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
  ): void {
    const thingType = getThingType(templateConfig);
    if (!thingType) {
      throw new Error('You must define one card, badge, element, or row in the template');
    }
    const thingContent = templateConfig.card ?? templateConfig.element ?? templateConfig.row ?? templateConfig.badge;
    this._setResolved(
      thingType,
      deepReplace(variables, templateConfig, thingContent),
      this._resolveStyles(templateConfig, variables, cardStyle),
    );
  }

  // Styles always resolve against the real template config, so a declared default or a
  // `default:` entry reaches a style the same way it reaches the content.
  private _resolveStyles(
    templateConfig: TemplateConfig,
    variables: VariablesConfig[] | undefined,
    cardStyle?: string,
  ): string {
    let styles = '';
    if (templateConfig.style) {
      styles += deepReplace(variables, templateConfig, templateConfig.style);
    }
    if (cardStyle) {
      styles += deepReplace(variables, templateConfig, cardStyle);
    }
    return styles;
  }

  private _setResolved(thingType: LovelaceThingType, thingConfig: LovelaceThingConfig, styles: string): void {
    this._style = styles;
    this._thingConfig = thingConfig;
    this._thingType = thingType;
    DeclutteringElement._createThing(thingConfig, thingType, (thing: LovelaceThing) => {
      if (this._thingConfig === thingConfig) {
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
      throw new Error('for_each needs a template that defines a card');
    }
    const cards = items.map((item, index) =>
      deepReplace(forEachVariables(item, config.variables, index, items.length), templateConfig, templateConfig.card),
    );

    // The styles belong to the whole card rather than to any one copy, and resolve against
    // the real template so its declared defaults still apply.
    this._forEach = {
      cards,
      max: Number(config.columns) || 1,
      minWidth: Number(config.min_column_width) || undefined,
      styles: this._resolveStyles(templateConfig, config.variables, config.style),
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
    if (!this._hass || !this._thing) return html``;

    this.classList.toggle('decluttering-badge', this._thingType === 'badge');
    this.classList.toggle('decluttering-container', this._thingType !== 'badge');
    this.classList.toggle('decluttering-card', this._thingType === 'card');

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
        throw new Error(`Unsupported thing type '${thingType}'`);
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
      throw new Error('Missing template object in your config');
    }
    const ll = getLovelaceConfig();
    if (!ll) {
      throw new Error('Could not retrieve the lovelace configuration.');
    }
    this._error = undefined;
    const templateConfig = findTemplate(ll, config.template);
    if (templateConfig) {
      this._pendingConfig = undefined;
      this._applyTemplate(templateConfig, config);
      return;
    }
    if (!getTemplateSources(ll).length) {
      throw new Error(
        `The template "${config.template}" doesn't exist in decluttering_templates or in a custom:decluttering-template card`,
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

    // A single mapping counts as a list of one, the same forgiveness `variables` gets. A
    // written-out list wins over a registry source: it is the more particular of the two,
    // and having both silently pick one would be worse than having it say which.
    const items = forEachItems(config.for_each);
    if (items) {
      this._setForEach(templateConfig, config, items);
      return;
    }
    if (isRegistrySource(config.for_each_from)) {
      this._fromRegistry = { templateConfig, config };
      // setConfig runs before hass is ever set, so the first resolution usually waits.
      if (this._hass) this._resolveFromRegistry(this._hass);
      return;
    }
    this._setTemplateConfig(templateConfig, config.variables, config.style);
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
      return;
    }
    this._pendingConfig = undefined;

    const ll = getLovelaceConfig();
    findTemplateAnywhere(hass, ll, config.template)
      .then((templateConfig) => {
        if (templateConfig) {
          this._applyTemplate(templateConfig, config);
        } else {
          this._error =
            `The template "${config.template}" doesn't exist in decluttering_templates, ` +
            'in a custom:decluttering-template card, or on any dashboard listed in ' +
            'decluttering_templates_from';
        }
      })
      .catch((err) => {
        this._error = `Could not resolve the template "${config.template}": ${err?.message ?? err}`;
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
          label: 'Template to use',
          selector: {
            select: {
              mode: 'dropdown',
              sort: true,
              custom_value: true,
              options: Object.keys(this._templates),
            },
          },
        },
        {
          name: 'variables',
          label: 'Variables',
          helper: 'Example: - variable_name: value',
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
      error.template = 'No template exists with this name';
    }
    if (!readable) {
      error.variables = 'Variables must be a list of key and value pairs, or a mapping of them';
    }

    return html`
      ${template?.description ? html`<p class="description">${template.description}</p>` : html``}
      ${this._renderSource(template)} ${this._renderDiagnostics(template, readable)}
      <ha-form
        .hass=${this.hass}
        .data=${this._formData(declarations)}
        .schema=${this._formSchema(declarations, repeatable)}
        .error=${error}
        .computeLabel=${(s): string => s.label ?? s.name}
        .computeHelper=${(s): string => s.helper ?? ''}
        @value-changed=${this._valueChanged}
      ></ha-form>
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
      return html`<p class="hint">This template is borrowed from another dashboard, so it is edited there.</p>`;
    }
    if (location.declared || !location.view) {
      return html`<p class="hint">Defined in this dashboard's decluttering_templates.</p>`;
    }

    const { view } = location;
    const dashboard = document.location.pathname.split('/').slice(0, 2).join('/');
    return html`<p class="hint">
      Defined in
      <a href=${`${dashboard}/${view.path || view.index}`} target="_blank" rel="noreferrer"
        >${view.title || view.path || 'an untitled view'}</a
      >.
    </p>`;
  }

  /*
   * A template that describes its variables gets a real control for each one, and a box
   * underneath for anything else the card sets. A template that does not is edited the
   * way it always has been, through that box alone.
   */
  private _formSchema(declarations: VariableDeclaration[], repeatable: boolean): unknown[] {
    const repeat = repeatable ? REPEAT_SCHEMA : [];

    if (!declarations.length) return [...this._schema, ...repeat];

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
        label: 'Other variables',
        helper: 'Anything this template does not describe. Example: - variable_name: value',
        selector: { object: {} },
      },
      ...repeat,
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
    return html`
      ${
        required.length
          ? html`<ha-alert alert-type="error">
              ${required.length === 1 ? 'This template needs a variable' : 'This template needs variables'} you have not
              set: ${required.join(', ')}.
            </ha-alert>`
          : html``
      }
      ${
        optional.length
          ? html`<ha-alert alert-type="warning">
              ${optional.length === 1 ? 'This template uses a variable' : 'This template uses variables'} with no value
              and no default: ${optional.join(', ')}.
            </ha-alert>`
          : html``
      }
      ${
        unused.length
          ? html`<ha-alert alert-type="info">
              ${unused.length === 1 ? 'This variable is' : 'These variables are'} set here but never used by the
              template: ${unused.join(', ')}.
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
    if (!config.template) {
      throw new Error('Missing template property');
    }
    this._template = config.template;
    // The config passed here IS the template, so its style is picked up as the
    // template's own - passing it again as the instance style would emit it twice.
    this._setTemplateConfig(config, undefined, undefined);
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

  @property() public lovelace?: LovelaceConfig;
  @property() public hass?: HomeAssistant;

  private _loadedElements = false;

  private static schema = [
    {
      name: 'template',
      label: 'Template to define',
      selector: { text: {} },
    },
    {
      name: 'thingType',
      label: 'Type of thing to template',
      selector: {
        select: {
          mode: 'dropdown',
          options: [
            { value: 'card', label: 'Card' },
            { value: 'badge', label: 'Badge' },
            { value: 'row', label: 'Row' },
            { value: 'element', label: 'Element' },
          ],
        },
      },
    },
    {
      name: 'description',
      label: 'Description',
      helper: 'What this template is for, shown to whoever uses it',
      selector: { text: { multiline: true } },
    },
    {
      name: 'variables',
      label: 'Variable declarations',
      helper:
        'Describe a variable and its editor shows the right control. Example: - name: entity, selector: {entity: {}}',
      selector: { object: {} },
    },
    {
      name: 'default',
      label: 'Variables',
      helper: 'Example: - variable_name: default_value',
      selector: { object: {} },
    },
  ];

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
      error.default = 'Variables must be a list of key and value pairs, or a mapping of them';
    }
    if (this._config.variables !== undefined && !Array.isArray(this._config.variables)) {
      error.variables = 'The declarations must be a list, each entry naming one variable';
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
        <ha-tab-group-tab slot="nav" panel="settings">Settings</ha-tab-group-tab>
        ${
          data.thingType === 'card'
            ? html`
                <ha-tab-group-tab slot="nav" panel="card">Card</ha-tab-group-tab>
                <ha-tab-group-tab slot="nav" panel="change_card">Change card type</ha-tab-group-tab>
              `
            : data.thingType === 'row'
              ? html`<ha-tab-group-tab slot="nav" panel="row">Row</ha-tab-group-tab>`
              : html``
        }
        <ha-tab-group-tab slot="nav" panel="usages">Where used</ha-tab-group-tab>
        <ha-tab-group-tab slot="nav" panel="share">Share</ha-tab-group-tab>
      </ha-tab-group>
      ${
        this._selectedTab === 'settings'
          ? html`
              ${this._renderDiagnostics()} ${this._renderSuggest(data.thingType === 'card')}
              <ha-form
                .hass=${this.hass}
                .data=${data}
                .schema=${DeclutteringTemplateEditor.schema}
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
              ${unused.length === 1 ? 'This variable is declared' : 'These variables are declared'} but never used in
              the template: ${unused.join(', ')}.
            </ha-alert>`
          : html``
      }
      ${
        duplicated.length
          ? html`<ha-alert alert-type="warning">
              ${duplicated.length === 1 ? 'This variable has' : 'These variables have'} a default in both places; the
              declaration is the one that counts: ${duplicated.join(', ')}.
            </ha-alert>`
          : html``
      }
      ${
        contradictory.length
          ? html`<ha-alert alert-type="warning">
              ${contradictory.length === 1 ? 'This variable is' : 'These variables are'} marked required but have a
              default, so they can never be unset: ${contradictory.join(', ')}.
            </ha-alert>`
          : html``
      }
    `;
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
                Nothing here looks like it varies between copies. Entities, names, titles and icons are what get
                offered, and this card either has none or they are variables already.
              </ha-alert>`
            : html``
        }
        ${
          this._suggestion
            ? html`<ha-alert alert-type="warning">
                This will rewrite the card to use
                ${this._suggestion.variables.map((variable) => variable.name).join(', ')}, and declare
                ${this._suggestion.variables.length === 1 ? 'it' : 'them'} with the value
                ${this._suggestion.variables.length === 1 ? 'it has' : 'they have'} now. Press again to go ahead.
              </ha-alert>`
            : html``
        }
        <mwc-button @click=${this._suggest}>
          ${this._suggestion ? 'Suggest variables anyway' : 'Suggest variables from the card'}
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
        <ha-alert alert-type="warning">
          The dashboard configuration could not be read, so uses cannot be counted here.
        </ha-alert>
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
                Nothing on this dashboard uses "${name}" yet. Cards on other dashboards are not counted here, even ones
                that borrow this dashboard's templates.
              </ha-alert>`
            : html`
                <p class="hint">
                  ${total === 1 ? 'One card uses' : `${total} cards use`} "${name}" on this dashboard. Cards on other
                  dashboards are not counted.
                </p>
                <ul>
                  ${views.map(
                    // A view with no path is addressed by its position, which is how Home
                    // Assistant itself links such views.
                    (view) => html`
                      <li>
                        <a href=${`${dashboard}/${view.path || view.index}`} target="_blank" rel="noreferrer">
                          ${view.title || view.path || 'Untitled view'}
                        </a>
                        — ${view.count === 1 ? 'once' : `${view.count} times`}
                      </li>
                    `,
                  )}
                </ul>
              `
        }
        ${
          templates.length
            ? html`<ha-alert alert-type="info">
                This template is used by ${templates.length === 1 ? 'another template' : 'other templates'}:
                ${templates.join(', ')}. Changing it changes ${templates.length === 1 ? 'that one' : 'those'} too.
              </ha-alert>`
            : html``
        }
        ${this._renderRename(name, total)}
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
        <h3>Export</h3>
        <p class="hint">Copy this and send it to someone else, or paste it into another dashboard.</p>
        ${notes.map((note) => html`<ha-alert alert-type="info">${note}</ha-alert>`)}
        <ha-yaml-editor id="export" .hass=${this.hass} .defaultValue=${payload} read-only></ha-yaml-editor>
        <mwc-button @click=${this._copyExport}>
          ${
            this._copyState === 'done'
              ? 'Copied'
              : this._copyState === 'failed'
                ? 'Could not copy - select the text above instead'
                : 'Copy to clipboard'
          }
        </mwc-button>

        <h3>Import</h3>
        <p class="hint">Paste a template someone shared with you. It will replace the one you are editing.</p>
        <ha-yaml-editor .hass=${this.hass} @value-changed=${this._importChanged}></ha-yaml-editor>
        ${this._importErrors.map((error) => html`<ha-alert alert-type="error">${error}</ha-alert>`)}
        ${
          this._importClash
            ? html`<ha-alert alert-type="warning">
                This dashboard already has a template called "${this._importClash}". Importing will give you two
                templates with the same name, and only one of them will be used. Press Import again to go ahead.
              </ha-alert>`
            : html``
        }
        <mwc-button @click=${this._import}>${this._importClash ? 'Import anyway' : 'Import'}</mwc-button>
      </div>
    `;
  }

  /*
   * Renaming is the one edit a template card cannot make on its own: every card naming the
   * old template would break the moment the new name was saved. So it is done here, across
   * the whole dashboard at once, rather than by editing the name field above.
   */
  private _renderRename(name: string, total: number): TemplateResult {
    const to = this._renameTo.trim();
    const changes = total === 1 ? 'one card' : `${total} cards`;
    const armed = !!to && this._renamePending === to;
    return html`
      <div class="rename">
        <h3>Rename</h3>
        <p class="hint">
          Changes the name here and in every card on this dashboard that uses it. Cards on other dashboards are not
          touched, even ones that borrow this dashboard's templates.
        </p>
        ${this._renameError ? html`<ha-alert alert-type="error">${this._renameError}</ha-alert>` : html``}
        ${
          armed
            ? html`<ha-alert alert-type="warning">
                This renames "${name}" to "${to}"${total ? html` and rewrites ${changes}` : html``}, and saves the
                dashboard straight away. Press again to go ahead.
              </ha-alert>`
            : html``
        }
        <ha-textfield
          label="New name"
          .value=${this._renameTo}
          .disabled=${this._renaming}
          @input=${this._renameChanged}
        ></ha-textfield>
        <mwc-button .disabled=${this._renaming || !to || to === name} @click=${this._rename}>
          ${armed ? 'Rename anyway' : total ? `Rename and update ${changes}` : 'Rename'}
        </mwc-button>
      </div>
    `;
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
      this._renameError = 'This dashboard cannot be saved from here, so it cannot be renamed here either.';
      return;
    }
    if (collectTemplates(panel.config)[to] !== undefined) {
      this._renameError = `A template called "${to}" already exists on this dashboard.`;
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
      this._renameError = `Could not save the dashboard: ${(err as Error)?.message ?? err}`;
    } finally {
      this._renaming = false;
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
      this._importErrors = ['This is not valid YAML, so it cannot be read.'];
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
    console.warn(`decluttering-card-plus: <${tag}> is already registered by something else, skipping it.`);
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
    description: 'Reuse multiple times the same card configuration with variables to declutter your config.',
  });
  customBadges.push({
    type: CARD_TAG,
    documentationURL: DOCUMENTATION_URL,
    name: 'Decluttering Card Plus',
    preview: false,
    description: 'Instantiate a template whose content is a badge.',
  });
}

if (defineElement(TEMPLATE_TAG, DeclutteringTemplate)) {
  customCards.push({
    type: TEMPLATE_TAG,
    documentationURL: DOCUMENTATION_URL,
    name: 'Decluttering Template Plus',
    preview: false,
    description: 'Define a reusable template for decluttering cards to instantiate.',
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
    description: 'Compatibility alias for existing custom:decluttering-card configurations.',
  });
}

if (defineElement(LEGACY_TEMPLATE_TAG, LegacyDeclutteringTemplate)) {
  customCards.push({
    type: LEGACY_TEMPLATE_TAG,
    documentationURL: DOCUMENTATION_URL,
    name: 'Decluttering Template (compatibility)',
    preview: false,
    description: 'Compatibility alias for existing custom:decluttering-template configurations.',
  });
}
