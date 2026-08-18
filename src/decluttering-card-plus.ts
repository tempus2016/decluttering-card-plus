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
import {
  collectTemplates,
  collectAllTemplates,
  findTemplate,
  findTemplateAnywhere,
  getTemplateSources,
} from './templates';
import {
  diagnoseInstance,
  diagnoseTemplate,
  forEachNames,
  forEachVariables,
  getDeclarations,
  mergeVariables,
  variableName,
  variableValues,
  VariableDeclaration,
} from './variables';
import { copyText, getLovelaceConfig } from './utils';
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

// Declared variables get their own form field, and the prefix keeps a variable called
// "template" from colliding with the field that chooses the template.
const VARIABLE_FIELD_PREFIX = 'variable:';

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
  private _ro?: ResizeObserver;
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
    const thingConfig = deepReplace(variables, templateConfig, thingContent);

    let styles = '';
    if (templateConfig.style) {
      styles += deepReplace(variables, templateConfig, templateConfig.style);
    }
    if (cardStyle) {
      styles += deepReplace(variables, templateConfig, cardStyle);
    }
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
  protected _setForEach(templateConfig: TemplateConfig, config: DeclutteringCardConfig): void {
    if (getThingType(templateConfig) !== 'card') {
      throw new Error('for_each needs a template that defines a card');
    }
    const items = config.for_each as unknown[];
    const cards = items.map((item) =>
      deepReplace(forEachVariables(item, config.variables), templateConfig, templateConfig.card),
    );

    const columns = Number(config.columns) || 1;
    const stack = columns > 1 ? { type: 'grid', columns, square: false, cards } : { type: 'vertical-stack', cards };

    // The style belongs to the whole card rather than to any one copy, so it resolves
    // against the variables the card sets for all of them.
    this._setTemplateConfig({ card: stack, style: templateConfig.style }, config.variables, config.style);
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
    this._ro = new ResizeObserver(() => {
      this._displayHidden();
    });
    this._ro.observe(thing);
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
    if (Array.isArray(config.for_each)) this._setForEach(templateConfig, config);
    else this._setTemplateConfig(templateConfig, config.variables, config.style);
  }

  protected hassAvailable(hass: HomeAssistant): void {
    const config = this._pendingConfig;
    if (!config) return;
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

  protected render(): TemplateResult | void {
    if (!this.hass || !this._config) return html``;

    if (!this._lovelace) {
      // The lovelace property is not set when editing row elements so we retrieve it here
      this._lovelace = getLovelaceConfig() ?? undefined;
      if (!this._lovelace) return;
    }

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

    const template = this._templates[this._config.template];
    const declarations = getDeclarations(template);
    const listed = Array.isArray(this._config.variables);
    const repeatable = !!template?.card;

    const error: Record<string, string | string[]> = {};
    // Templates borrowed from another dashboard are still on their way, so do not accuse
    // the user of a bad name until they have arrived.
    if (!template && !this._loadingTemplates) {
      error.template = 'No template exists with this name';
    }
    if (this._config.variables !== undefined && !listed) {
      error.variables = 'The list of variables must be an array of key and value pairs';
    }

    return html`
      ${template?.description ? html`<p class="description">${template.description}</p>` : html``}
      ${this._renderDiagnostics(template, listed)}
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
   * A template that describes its variables gets a real control for each one, and a box
   * underneath for anything else the card sets. A template that does not is edited the
   * way it always has been, through that box alone.
   */
  private _formSchema(declarations: VariableDeclaration[], repeatable: boolean): unknown[] {
    const repeat = repeatable
      ? [
          {
            name: 'for_each',
            label: 'Repeat for each',
            helper: 'One copy of the template per item. Example: - entity: light.hall, name: Hall',
            selector: { object: {} },
          },
          {
            name: 'columns',
            label: 'Columns',
            helper: 'How many copies sit side by side. One stacks them vertically',
            selector: { number: { min: 1, max: 6, mode: 'box' } },
          },
        ]
      : [];

    if (!declarations.length) return [...this._schema, ...repeat];

    return [
      this._schema[0],
      ...declarations.map((declaration) => ({
        name: VARIABLE_FIELD_PREFIX + declaration.name,
        label: declaration.label ?? declaration.name,
        helper: declaration.description,
        selector: declaration.selector ?? { text: {} },
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

    // A `variables:` written as a mapping rather than a list is a mistake the form
    // reports; it must not throw on the way to reporting it.
    const listed = Array.isArray(this._config?.variables) ? (this._config?.variables as VariablesConfig[]) : [];
    const extras = listed.filter((entry) => {
      const name = variableName(entry);
      return name !== undefined && !described.has(name);
    });
    if (extras.length) data.extras = extras;
    if (this._config?.for_each !== undefined) data.for_each = this._config.for_each;
    if (this._config?.columns !== undefined) data.columns = this._config.columns;
    return data;
  }

  /*
   * Warnings, never errors: a template can be edited after the cards that use it, so a
   * card that looks wrong now may be right again in a moment. Nothing here stops a save.
   */
  private _renderDiagnostics(template: TemplateConfig | undefined, listed: boolean): TemplateResult {
    if (!template || this._loadingTemplates || (this._config?.variables !== undefined && !listed)) return html``;

    const repeated = forEachNames(this._config?.for_each).map((name) => ({ [name]: null }));
    const supplied = [...(Array.isArray(this._config?.variables) ? this._config.variables : []), ...repeated];
    const { missing } = diagnoseInstance(supplied, template);
    // Only what the card itself sets can be called unused; an item's values are checked
    // together with the card's, so a name only some items set is not a mistake.
    const { unused } = diagnoseInstance(this._config?.variables, template);
    return html`
      ${
        missing.length
          ? html`<ha-alert alert-type="warning">
              ${missing.length === 1 ? 'This template uses a variable' : 'This template uses variables'} with no value
              and no default: ${missing.join(', ')}.
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
    const variables = mergeVariables(this._config?.variables, desired);
    if (variables.length) config.variables = variables;
    else delete config.variables;
    setOrDelete(config, 'for_each', data.for_each);
    setOrDelete(config, 'columns', data.columns);

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
    this._setTemplateConfig(config, undefined, config.style);
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
    if (this._config.default !== undefined && !Array.isArray(this._config.default)) {
      error.default = 'The list of variables must be an array of key and value pairs';
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
        <ha-tab-group-tab slot="nav" panel="share">Share</ha-tab-group-tab>
      </ha-tab-group>
      ${
        this._selectedTab === 'settings'
          ? html`
              ${this._renderDiagnostics()}
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
                : this._selectedTab === 'share'
                  ? this._renderShare()
                  : html``
      }
    `;
  }

  /*
   * A template is a self-contained block of configuration, so handing one to another
   * person is mostly a matter of writing it out. What does not travel with it - the
   * custom cards it is built from, the other templates it calls - is named above the
   * box, because whoever receives it cannot tell from the YAML alone.
   */
  /*
   * What the template says about itself against what it actually uses. Both are worth
   * knowing while writing one, and neither is a reason to refuse the configuration.
   */
  private _renderDiagnostics(): TemplateResult {
    if (!this._config || (this._config.variables !== undefined && !Array.isArray(this._config.variables))) {
      return html``;
    }

    const { unused, duplicated } = diagnoseTemplate(this._config);
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
    `;
  }

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
    const existing = collectTemplates(this.lovelace);
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
    // Unlike the stubs below these replace whatever is already there, so they are set
    // outright rather than filled in only when absent.
    setOrDelete(config, 'description', data.description);
    setOrDelete(config, 'variables', data.variables);
    DeclutteringTemplateEditor.stubMember(data.thingType === 'card', config, 'card', {
      type: 'entity',
      entity: 'sun.sun',
    });
    DeclutteringTemplateEditor.stubMember(data.thingType === 'badge', config, 'badge', {
      type: 'entity',
      entity: 'sun.sun',
    });
    DeclutteringTemplateEditor.stubMember(data.thingType === 'row', config, 'row', {
      entity: 'sun.sun',
    });
    DeclutteringTemplateEditor.stubMember(data.thingType === 'element', config, 'element', {
      type: 'icon',
      icon: 'mdi:weather-sunny',
      style: {
        color: 'yellow',
      },
    });
    this._fireConfigChanged(config);
  }

  private _cardChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;

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
