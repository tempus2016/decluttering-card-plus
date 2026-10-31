import { LitElement, html, TemplateResult, css, CSSResult } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant, fireEvent, LovelaceCardEditor, LovelaceConfig } from 'custom-card-helpers';
import { DeclutteringCardConfig, TemplateConfig, VariablesConfig, FormSchemaEntry } from './types';
import deepReplace, { fillSource } from './deep-replace';
import { structureNames } from './structure';
import {
  collectTemplates,
  collectAllTemplates,
  findTemplateLocation,
  mayBorrowTemplates,
  templatePickerOptions,
  replaceCard,
  applyOverride,
  misplacedOverrides,
  byDomainOf,
  pickTemplate,
  withPickedEntity,
  deprecationOf,
  itemTemplatesOf,
  borrowedFrom,
} from './templates';
import {
  diagnoseInstance,
  itemTemplatesReached,
  validateDeclared,
  declarationSelector,
  groupDeclarations,
  isCardDeclaration,
  forEachItems,
  forEachNames,
  forEachVariables,
  getDeclarations,
  mergeVariables,
  ownVariables,
  POSITION_NAMES,
  variableName,
  variableValues,
  VariableDeclaration,
  withStateScope,
  normaliseVariables,
} from './variables';
import { exampleSets } from './examples';
import { copyLabel, isRegistrySource, registryNames, resolveRegistryItems } from './registry';
import { categoryRegistry, loadCategories, wantsCategories } from './categories';
import { renderTemplateOnce, sourceTemplate, TemplateRender, templateList } from './template-source';
import { findRepeatingCard, sectionPerCopy } from './strategy';
import { copyText, getLovelaceConfig, getLovelacePanel } from './utils';
import { toYaml } from './yaml';
import { localize, onLanguageLoaded } from './localize';
import { rebuildOnEntities } from './rebuild';
import {
  advancedCount,
  advancedData,
  advancedSchema,
  AdvancedData,
  applyAdvanced,
  onErrorCard,
  withOnErrorCard,
  OnErrorMode,
} from './card-editor/advanced';
import { EditorHidden, editorHidden, withoutFields } from './card-editor/hide';
import { CARD_SLOT_TAG } from './card-editor/card-slot';
import { buildTime, previewLines, PreviewLine, previewModes, PreviewMode } from './card-editor/result-preview';
import {
  cardAtPath,
  dashboardHref,
  ReturnTicket,
  stashReturn,
  takeReturn,
  templateCardPath,
} from './card-editor/template-link';
import { holdUndo } from './undo';
import {
  currentViewIndex,
  dialogPlace,
  editDialogOf,
  getThingType,
  isVariablesShape,
  loadCardEditorPicker,
  pageDashboard,
  rewriteDashboards,
  setOrDelete,
  sourceContext,
  thingContent,
} from './shared';

// Declared variables get their own form field, and the prefix keeps a variable called
// "template" from colliding with the field that chooses the template.
const VARIABLE_FIELD_PREFIX = 'variable:';

/** What a repeat source matches, as the matches line names it: entities, areas, views ... */
function matchedWhat(source: unknown, count: number, hass: unknown): string {
  const keys = ['areas', 'devices', 'floors', 'labels', 'views', 'entities'];
  const written = (source && typeof source === 'object' ? source : {}) as Record<string, unknown>;
  const kind = keys.find((key) => written[key] !== undefined) ?? 'items';
  return localize(`editor.matches_${kind}_${count === 1 ? 'one' : 'many'}`, undefined, hass as undefined);
}

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
    {
      name: 'lazy',
      label: localize('editor.lazy_label'),
      helper: localize('editor.lazy_helper'),
      selector: { boolean: {} },
    },
    {
      name: 'lazy_eager',
      label: localize('editor.lazy_eager_label'),
      helper: localize('editor.lazy_eager_helper'),
      selector: { number: { min: 0, max: 100, mode: 'box' } },
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

function splitAt(sentence: string, token: string): [string, string] {
  const at = sentence.indexOf(token);
  return at === -1 ? [sentence, ''] : [sentence.slice(0, at), sentence.slice(at + token.length)];
}

// The words a typed boolean's switch shows as on; every other word shows it off.
const TRUE_WORDS = new Set(['true', 'yes', 'on', '1']);

// A style rule that paints on this card's own host rather than on the card inside it.
const HOST_SELECTOR = /:host|\.decluttering-container/;

export class DeclutteringCardEditor extends LitElement implements LovelaceCardEditor {
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
      .hint a {
        color: var(--primary-color);
      }
      ha-alert {
        display: block;
        margin-bottom: 8px;
      }
      ha-expansion-panel,
      decluttering-card-plus-health {
        margin-top: 16px;
      }
      .risks {
        margin: 4px 0 0;
        padding-left: 18px;
      }
      .result {
        padding: 0 8px 8px;
      }
      .result .hint {
        margin: 8px 0;
      }
      .section-per-copy {
        margin-top: 16px;
      }
      .examples {
        margin-bottom: 8px;
      }
      .advanced .count {
        color: var(--secondary-text-color);
        font-size: 0.85em;
        margin-left: 8px;
      }
      .advanced-body {
        padding: 8px 8px 0;
      }
      .preview {
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        padding: 12px 16px;
        margin: 0 0 16px;
        background: var(--card-background-color);
      }
      .preview-head {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0 0 10px;
      }
      .preview-title {
        flex: 1;
        font-weight: 500;
      }
      .segmented {
        display: inline-flex;
        border: 1px solid var(--divider-color);
        border-radius: 18px;
        overflow: hidden;
      }
      .segmented button {
        border: 0;
        background: transparent;
        color: var(--secondary-text-color);
        font: inherit;
        padding: 6px 14px;
        cursor: pointer;
      }
      .segmented button.on {
        background: rgba(var(--rgb-primary-color), 0.12);
        color: var(--primary-color);
        font-weight: 500;
      }
      .rendered {
        margin: 0 0 8px;
      }
      pre.yaml {
        margin: 0 0 8px;
        padding: 8px 10px;
        border-radius: 8px;
        background: var(--secondary-background-color);
        font-family: var(--ha-font-family-code, monospace);
        font-size: 12.5px;
        line-height: 1.5;
        overflow: auto;
        max-height: 320px;
        -webkit-user-select: text;
        user-select: text;
      }
      pre.yaml .l {
        display: block;
        white-space: pre;
      }
      pre.yaml .l.changed {
        background: rgba(var(--rgb-accent-color, 255, 152, 0), 0.18);
      }
      .preview-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .edit-template {
        margin-left: 6px;
      }
      ha-alert .actions {
        margin-top: 8px;
        display: flex;
        gap: 8px;
      }
    `;
  }

  @state() private _lovelace?: LovelaceConfig;
  @state() private _config?: DeclutteringCardConfig;

  @property() public hass?: HomeAssistant;

  private _templates?: Record<string, TemplateConfig>;
  // Typed booleans drawn as a switch other than the value written - see _formData.
  private _shownAs = new Map<string, { shown: boolean; written: unknown }>();
  @state() private _loadingTemplates = false;
  @state() private _ejectPending = false;
  @state() private _sectionsPending = false;
  @state() private _sectionsError?: string;
  // Idea 14: "a card of my choosing" chosen but no card picked yet - nothing to write, so
  // the choice lives here until the slot is filled (round 1, B2).
  @state() private _onErrorMode?: OnErrorMode;
  // Idea 19: how the result is shown, and the lines the last edit changed.
  @state() private _previewMode: PreviewMode = 'yaml';
  @state() private _copied = false;
  private _lastYaml?: string;
  private _markedLines: PreviewLine[] = [];
  @state() private _cannotOpen = false;
  // Idea 20: unsaved changes left when this card was closed to edit its template.
  @state() private _resume?: ReturnTicket;
  // What each `for_each_from: { template: }` written in this editor rendered to, so the
  // match preview can show it. Rendered once per distinct template text, like the card.
  @state() private _renderedTemplates: Record<string, TemplateRender> = {};
  private _renderingTemplates = new Set<string>();
  // The card as the dialog opened it, which is what an eject replaces on the dashboard.
  private _openedWith?: DeclutteringCardConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _schema: any;

  set lovelace(lovelace: LovelaceConfig) {
    this._lovelace = lovelace;
    this._templates = undefined;
    this._schema = undefined;
  }

  /*
   * The view and section of the card being edited, whose decluttering_defaults and
   * decluttering_let reach it - without them the Result showed `[[vlet]]` and the editor
   * said a name the view's let gives had no value. Read off the edit dialog; outside one,
   * the view on screen.
   */
  private _editingPlace(): { view?: number; section?: number } {
    const dialog = editDialogOf(this);
    const place = dialog ? dialogPlace(dialog) : undefined;
    return place ?? { view: currentViewIndex(this._lovelace) };
  }

  // Stops listening for a language chunk landing (idea 4).
  private _stopLanguageListener?: () => void;

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopLanguageListener?.();
    this._stopLanguageListener = undefined;
  }

  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this._stopLanguageListener ??= onLanguageLoaded(() => this.requestUpdate());
    // A card-valued variable renders Home Assistant's own card editor and picker, which
    // are lazy-loaded - free after the first editor anywhere has loaded them.
    await loadCardEditorPicker();
  }

  public setConfig(config: DeclutteringCardConfig): void {
    // The first config is the card as the dashboard has it saved; every later one is an edit.
    if (!this._openedWith) {
      this._openedWith = config;
      // Idea 20: this card was left to edit its template; its unsaved changes come back.
      this._resume = takeReturn(config);
    }
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
      const place = this._editingPlace();
      this._templates = collectTemplates(this._lovelace, place.view, undefined, place.section);
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
              custom_value: true,
              // A name on its own says nothing about what a template is for, and a
              // dashboard with twenty of them becomes a memory test. The description the
              // template already carries is put beside it. Sorted already, with the
              // deprecated ones marked and last, which the select's own sort would undo.
              options: templatePickerOptions(this._templates, this.hass),
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
    const byDomain = byDomainOf(this._config);
    const repeatable =
      (!!template && getThingType(template) === 'card') ||
      !!byDomain ||
      this._config.for_each !== undefined ||
      this._config.for_each_from !== undefined;

    const data = this._formData(declarations);
    // What the template says its editor can do without (#344), kept while the card uses it.
    const hidden = editorHidden(template, this._config, (data as { extras?: unknown[] }).extras);

    const error: Record<string, string | string[]> = {};
    // Templates borrowed from another dashboard are still on their way, so do not accuse
    // the user of a bad name until they have arrived.
    // A card choosing by domain may have no template: of its own at all.
    if (!template && !this._loadingTemplates && !(byDomain && !this._config.template)) {
      error.template = localize('editor.no_such_template', undefined, this.hass);
    }
    if (!readable) {
      error.variables = localize('error.variables_shape', undefined, this.hass);
    }

    const retired = deprecationOf(template);
    return html`
      ${template?.description ? html`<p class="description">${template.description}</p>` : html``}
      ${
        /*
         * The form has no way to edit a mapping of domains to templates, but it does not
         * need one to leave it alone: every save carries the rest of the config through,
         * and the mapping is changed in the code editor.
         */
        byDomain
          ? html`<ha-alert alert-type="info">
              ${localize(
                'editor.by_domain_hint',
                {
                  templates: Object.entries(byDomain)
                    .map(([domain, name]) => `${domain}: ${name}`)
                    .join(', '),
                },
                this.hass,
              )}
            </ha-alert>`
          : html``
      }
      ${
        retired === undefined
          ? html``
          : html`<ha-alert alert-type="warning">
              ${
                retired
                  ? localize('editor.template_deprecated_because', { message: retired }, this.hass)
                  : localize('editor.template_deprecated', undefined, this.hass)
              }
            </ha-alert>`
      }
      ${this._renderResume()} ${this._renderResult(template)} ${this._renderSource(template)}
      ${this._renderStartFromExample(template)} ${this._renderDiagnostics(template, readable)}
      ${this._renderMatches(template)}
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${this._formSchema(declarations, repeatable && !hidden.repeat, hidden)}
        .error=${error}
        .computeLabel=${(s: FormSchemaEntry): string => s.label ?? s.name}
        .computeHelper=${(s: FormSchemaEntry): string => s.helper ?? ''}
        @value-changed=${this._valueChanged}
      ></ha-form>
      ${this._renderCardVariables(declarations)} ${this._renderEmptySlot(repeatable)} ${this._renderAdvanced(hidden)}
      ${this._renderSectionPerCopy()}
      <decluttering-card-plus-health .hass=${this.hass} .lovelace=${this._lovelace}></decluttering-card-plus-health>
    `;
  }

  /*
   * Idea 14: the settings that were YAML-only, in one expandable at the bottom. Collapsed by
   * default, so a card that uses none of them looks exactly as it did; the summary says how
   * many are set so a card with a style or a fallback shows it without opening.
   */
  private _renderAdvanced(hidden: EditorHidden): TemplateResult {
    if (!this._config || hidden.advanced) return html``;
    const count = advancedCount(this._config);
    const written = advancedData(this._config);
    // The chosen mode wins over what is written while the fallback card is still unpicked.
    const data =
      this._onErrorMode && written.on_error_mode !== 'card'
        ? { ...written, on_error_mode: this._onErrorMode }
        : written;
    if (written.on_error_mode === 'card' && this._onErrorMode) this._onErrorMode = undefined;
    const fallback = onErrorCard(this._config);
    const CardSlot = unsafeStatic(CARD_SLOT_TAG);
    return html`
      <ha-expansion-panel outlined class="advanced">
        <span slot="header">
          ${localize('editor.advanced.header', undefined, this.hass)}
          <span class="count">
            ${
              count === 0
                ? ''
                : count === 1
                  ? localize('editor.advanced.count_one', undefined, this.hass)
                  : localize('editor.advanced.count_many', { count }, this.hass)
            }
          </span>
        </span>
        <div class="advanced-body">
          <ha-form
            .hass=${this.hass}
            .data=${data}
            .schema=${withoutFields(advancedSchema(this.hass), hidden.advancedFields)}
            .computeLabel=${(s: FormSchemaEntry): string => s.label ?? s.name}
            .computeHelper=${(s: FormSchemaEntry): string => s.helper ?? ''}
            @value-changed=${this._advancedChanged}
          ></ha-form>
          ${
            data.on_error_mode === 'card'
              ? staticHtml`<${CardSlot}
                  .hass=${this.hass}
                  .lovelace=${this._lovelace}
                  .value=${fallback}
                  .label=${localize('editor.advanced.fallback_label', undefined, this.hass)}
                  .emptyHint=${localize('editor.advanced.fallback_hint', undefined, this.hass)}
                  @value-changed=${this._fallbackChanged}
                ></${CardSlot}>`
              : html``
          }
        </div>
      </ha-expansion-panel>
    `;
  }

  private _advancedChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;
    const value = ev.detail.value as AdvancedData;
    // "A card of my choosing" writes nothing until a card is picked; remember it was chosen.
    this._onErrorMode = value.on_error_mode === 'card' && !onErrorCard(this._config) ? 'card' : undefined;
    fireEvent(this, 'config-changed', { config: applyAdvanced(this._config, value) });
  }

  private _fallbackChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;
    if (ev.detail.value) this._onErrorMode = undefined;
    fireEvent(this, 'config-changed', { config: withOnErrorCard(this._config, ev.detail.value) });
  }

  /*
   * Idea 17: the card shown when a repeat matches nothing was a box of YAML. It is a slot
   * now, with Home Assistant's own card picker behind it, and writes `empty:` as before.
   */
  private _renderEmptySlot(repeatable: boolean): TemplateResult {
    if (!this._config || !repeatable) return html``;
    // Only a card that repeats has a "nothing matched" to show instead (round 1 note).
    const repeats =
      this._config.for_each !== undefined ||
      this._config.for_each_from !== undefined ||
      this._config.empty !== undefined;
    if (!repeats) return html``;
    const CardSlot = unsafeStatic(CARD_SLOT_TAG);
    const empty = this._config.empty;
    return staticHtml`<${CardSlot}
      .hass=${this.hass}
      .lovelace=${this._lovelace}
      .value=${empty && typeof empty === 'object' ? empty : undefined}
      .label=${localize('editor.empty_label', undefined, this.hass)}
      .emptyHint=${localize('editor.empty_slot_hint', undefined, this.hass)}
      @value-changed=${this._emptyChanged}
    ></${CardSlot}>`;
  }

  private _emptyChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;
    const config = { ...this._config } as DeclutteringCardConfig;
    setOrDelete(config, 'empty', ev.detail.value);
    fireEvent(this, 'config-changed', { config });
  }

  /*
   * A template with examples can fill a new card in from one of them, which is quicker
   * than reading the declarations and typing each value - and shows straight away what a
   * working set looks like. Only for a card that sets nothing yet: an example is a place
   * to start, not something to lay over values somebody has already chosen.
   */
  private _renderStartFromExample(template: TemplateConfig | undefined): TemplateResult {
    const sets = exampleSets(template);
    if (!sets.length || !this._config || ownVariables(this._config.variables).length) return html``;
    return html`
      <div class="examples">
        <p class="hint">${localize('editor.start_from_example_hint', undefined, this.hass)}</p>
        ${sets.map(
          (set, index) => html`
            <ha-button @click=${(): void => this._startFromExample(set)}>
              ${localize('editor.start_from_example', { number: index + 1 }, this.hass)}
            </ha-button>
          `,
        )}
      </div>
    `;
  }

  private _startFromExample(variables: VariablesConfig[]): void {
    if (!variables.length) return;
    fireEvent(this, 'config-changed', { config: { ...this._config, variables } as DeclutteringCardConfig });
  }

  /*
   * A variable declared `selector: {card: {}}` takes a whole card as its value, so its
   * control is Home Assistant's own card editor rather than a box of YAML. Substitution
   * has always injected a mapping whole; this is the editor catching up with it.
   */
  private _renderCardVariables(declarations: VariableDeclaration[]): TemplateResult {
    const slots = declarations.filter((declaration) => isCardDeclaration(declaration));
    if (!slots.length) return html``;
    const values = variableValues(this._config?.variables);
    return html`${slots.map((declaration) => {
      const value = values[declaration.name];
      const filled = !!value && typeof value === 'object';
      return html`
        <div class="card-variable">
          <h3>${declaration.label ?? declaration.name}</h3>
          ${declaration.description ? html`<p class="hint">${declaration.description}</p>` : html``}
          ${
            filled
              ? html`
                  <hui-card-element-editor
                    .hass=${this.hass}
                    .lovelace=${this._lovelace}
                    .value=${value}
                    @config-changed=${(ev: CustomEvent): void => this._cardVariableChanged(declaration.name, ev)}
                  ></hui-card-element-editor>
                  <ha-button @click=${(): void => this._cardVariableChanged(declaration.name)}>
                    ${localize('editor.card_variable_clear', undefined, this.hass)}
                  </ha-button>
                `
              : html`
                  <hui-card-picker
                    .hass=${this.hass}
                    .lovelace=${this._lovelace}
                    @config-changed=${(ev: CustomEvent): void => this._cardVariableChanged(declaration.name, ev)}
                  ></hui-card-picker>
                `
          }
        </div>
      `;
    })}`;
  }

  /*
   * The copies a registry repeat would build, for the preview (round 1, B5): the first one
   * stands for all of them, as for a hand-written list. Nothing until a Jinja source has
   * rendered, and nothing when the source cannot be read - the matches line says why.
   */
  private _registryItemsForPreview(): unknown[] | undefined {
    const source = this._config?.for_each_from;
    if (!this.hass || !isRegistrySource(source)) return undefined;
    const template = sourceTemplate(source);
    if (template !== undefined && !Object.prototype.hasOwnProperty.call(this._renderedTemplates, template)) {
      return undefined;
    }
    try {
      const matched = resolveRegistryItems(this.hass, source, {
        ...sourceContext(this._lovelace),
        rendered: this._renderedTemplates,
      });
      return matched.length ? matched : undefined;
    } catch {
      return undefined;
    }
  }

  private _cardVariableChanged(name: string, ev?: CustomEvent): void {
    ev?.stopPropagation();
    const value = ev?.detail?.config;
    const variables = ownVariables(this._config?.variables).filter((entry) => variableName(entry) !== name);
    if (value && typeof value === 'object') variables.push({ [name]: value });
    const config = { ...this._config } as DeclutteringCardConfig;
    if (variables.length) config.variables = variables;
    else delete config.variables;
    fireEvent(this, 'config-changed', { config });
  }

  /*
   * What the card is actually built from, once every variable has been put in. The
   * template and the values are in two different places on the dashboard and the card
   * renders a third thing, so working out why the result is not what you meant has always
   * meant reading both and doing the substitution in your head. This does it for you.
   */
  private _renderResult(named: TemplateConfig | undefined): TemplateResult {
    if (!this._config) return html``;
    // for_each renders the same template once per item, so one copy stands for all of
    // them - showing every copy would bury the thing you opened this to look at.
    const items = forEachItems(this._config.for_each) ?? this._registryItemsForPreview();
    let variables = items?.length
      ? forEachVariables(items[0], this._config.variables, 0, items.length)
      : this._config.variables;
    // Choosing by domain, that copy is built from the template its own entity picks.
    let template = named;
    let templateName = this._config.template;
    if (byDomainOf(this._config)) {
      try {
        const templates = this._templates ?? {};
        let entity: string | undefined;
        ({
          template,
          name: templateName,
          entity,
        } = pickTemplate(this._config, variables, (name) => templates[name], this.hass, Object.keys(templates)));
        variables = withPickedEntity(variables, entity) as VariablesConfig[] | undefined;
      } catch {
        return html``;
      }
    }
    if (!template) return html``;
    const thingType = getThingType(template);
    if (!thingType) return html``;

    const content = thingContent(template);

    let resolved: unknown;
    const started = performance.now();
    try {
      // Quietly: the editor re-renders on every keystroke, and the card itself already
      // says what it could not resolve when it renders for real.
      // A state the card rebuilds on is read as it stands now, as the card itself would.
      const scoped = withStateScope(this.hass, rebuildOnEntities(this._config.rebuild_on));
      // With the dashboard's item templates, as the card has them, so a `with:` or `repeat:`
      // of one is filled in here too rather than shown as written.
      const ll = this._lovelace ?? getLovelaceConfig();
      resolved = applyOverride(
        deepReplace(
          variables,
          template,
          content,
          templateName,
          scoped,
          true,
          undefined,
          0,
          undefined,
          undefined,
          false,
          {
            itemTemplates: itemTemplatesOf(ll),
            context: sourceContext(ll),
          },
        ),
        this._config,
        thingType,
      );
    } catch (err) {
      return html`<ha-alert alert-type="warning">
        ${localize('editor.result_error', { error: String(err) }, this.hass)}
      </ha-alert>`;
    }
    const finished = performance.now();

    const copies = items?.length ? localize('editor.result_copies', { total: items.length }, this.hass) : '';
    // Translated whole, then split so the [[name]] in the middle can be set in code.
    const [hintBefore, hintAfter] = splitAt(localize('editor.result_hint', { kind: thingType }, this.hass), '[[name]]');

    /*
     * Idea 19: live, at the top, as the card or as YAML with the line the last edit changed
     * lit. The marks are kept until the next change, so a state update does not wipe them.
     */
    const yaml = toYaml(resolved);
    if (yaml !== this._lastYaml) {
      this._markedLines = previewLines(this._lastYaml, yaml);
      this._lastYaml = yaml;
    }
    const modes = previewModes(thingType);
    const mode: PreviewMode = modes.includes(this._previewMode) ? this._previewMode : 'yaml';
    const canEject =
      !items?.length && !isRegistrySource(this._config.for_each_from) && resolved && typeof resolved === 'object';

    return html`
      <div class="preview">
        <div class="preview-head">
          <span class="preview-title">${localize('editor.preview.header', undefined, this.hass)}${copies}</span>
          ${
            modes.length > 1
              ? html`<div class="segmented" role="group">
                  ${modes.map(
                    (each) =>
                      html`<button
                        type="button"
                        class=${each === mode ? 'on' : ''}
                        aria-pressed=${each === mode ? 'true' : 'false'}
                        @click=${(): void => {
                          this._previewMode = each;
                        }}
                      >
                        ${localize(`editor.preview.${each}`, undefined, this.hass)}
                      </button>`,
                  )}
                </div>`
              : html``
          }
        </div>
        ${
          mode === 'rendered'
            ? html`<div class="rendered">
                <hui-card .hass=${this.hass} .config=${resolved} .preview=${true}></hui-card>
              </div>`
            : html`<pre class="yaml">
${this._markedLines.map((line) => html`<span class="l ${line.changed ? 'changed' : ''}">${line.text}</span>`)}</pre>`
        }
        <p class="hint">
          ${localize('editor.preview.built_in', { time: buildTime(started, finished), template: templateName ?? '' }, this.hass)}
          ${mode === 'yaml' ? localize('editor.preview.changed_hint', undefined, this.hass) : ''}
        </p>
        <p class="hint">${hintBefore}<code>[[name]]</code>${hintAfter}</p>
        <div class="preview-actions">
          ${
            mode === 'yaml'
              ? html`<ha-button @click=${(): void => this._copyYaml(yaml)}>
                  ${localize(this._copied ? 'editor.preview.copied' : 'editor.preview.copy', undefined, this.hass)}
                </ha-button>`
              : html``
          }
          ${
            /*
             * Leaving should be as clean as arriving: the card becomes exactly what it
             * builds, and the template is out of its life. Only for a single copy - a
             * repeat ejecting to a pile of cards is the template earning its keep.
             */
            canEject
              ? html`
                  <ha-button @click=${(): void => this._eject(resolved)}>
                    ${localize(this._ejectPending ? 'editor.eject_confirm' : 'editor.eject', undefined, this.hass)}
                  </ha-button>
                `
              : html``
          }
        </div>
      </div>
    `;
  }
  private _copyYaml(yaml: string): void {
    void copyText(yaml).then((ok) => {
      this._copied = ok;
      if (ok) setTimeout(() => (this._copied = false), 1500);
    });
  }

  /* ------------------------------------------------------------ idea 20: the way to the template and back */

  private _renderResume(): TemplateResult {
    const ticket = this._resume;
    if (!ticket) return html``;
    return html`<ha-alert alert-type="info">
      ${localize('editor.link.resume', { template: ticket.template }, this.hass)}
      <div class="actions">
        <ha-button
          @click=${(): void => {
            this._resume = undefined;
            fireEvent(this, 'config-changed', { config: ticket.config as DeclutteringCardConfig });
          }}
        >
          ${localize('editor.link.resume_button', undefined, this.hass)}
        </ha-button>
        <ha-button
          @click=${(): void => {
            this._resume = undefined;
          }}
        >
          ${localize('editor.link.discard_button', undefined, this.hass)}
        </ha-button>
      </div>
    </ha-alert>`;
  }

  /*
   * Closes this dialog and opens the template card's. Home Assistant edits one card at a
   * time, so the card's unsaved changes are kept and offered again when it is opened next.
   */
  private _openTemplate(name: string): void {
    const panel = getLovelacePanel();
    const path = templateCardPath(panel?.config ?? this._lovelace, name);
    if (!panel || !path) {
      this._cannotOpen = true;
      return;
    }
    if (this._config) {
      stashReturn({
        config: this._config as Record<string, unknown>,
        openedWith: this._openedWith as Record<string, unknown> | undefined,
        template: name,
      });
    }
    const original = cardAtPath(panel.config, path);
    const root = document.querySelector('home-assistant') ?? document.body;
    const open = (): void => {
      fireEvent(root as HTMLElement, 'show-dialog', {
        dialogTag: 'hui-dialog-edit-card',
        dialogImport: () => Promise.resolve(),
        dialogParams: {
          lovelaceConfig: panel.config,
          // Home Assistant 2025 and later edit a card by its config and a saver for it.
          cardConfig: original,
          saveCardConfig: (config: Record<string, unknown>) =>
            panel.saveConfig(original ? replaceCard(panel.config, original, config) : panel.config),
          // Earlier ones by its path on the dashboard.
          saveConfig: (config: unknown) => panel.saveConfig(config),
          path,
        },
      });
    };
    /*
     * One edit dialog at a time: it has to be closed before it is shown again, and with
     * unsaved changes closing first asks whether to leave - so the template opens once the
     * dialog says it has closed, and not at all if the answer was to stay (round 1, B6).
     */
    const dialog = editDialogOf(this) as
      | (Element & {
          closeDialog?: () => boolean | void;
          _discardDirtyStateChanges?: () => void;
          _dirty?: boolean;
        })
      | undefined;
    if (!dialog) {
      open();
      return;
    }
    /*
     * The unsaved change is already kept for "Bring them back", so the dialog has nothing to
     * ask about: without this Home Assistant 2026.7's dialog stops on "Stay or leave?" and
     * the template never opens (round 2, idea 20). Older dialogs kept the flag as _dirty.
     */
    if (this._config) {
      dialog._discardDirtyStateChanges?.();
      if ('_dirty' in dialog) dialog._dirty = false;
    }
    let opened = false;
    const once = (): void => {
      if (opened) return;
      opened = true;
      setTimeout(open, 0);
    };
    dialog.addEventListener('dialog-closed', once, { once: true });
    const closedNow = dialog.closeDialog?.();
    // A dialog that closed without saying so - an older one - is not waited on for ever.
    if (closedNow !== false) setTimeout(once, 400);
  }

  /*
   * A repeat inside one card stays inside that card's section, however wide the screen.
   * Offered only for a card sitting straight in a section of an ordinary sections view, as
   * saved - an unsaved edit has no place on the dashboard to convert yet.
   */
  private _renderSectionPerCopy(): TemplateResult {
    const ll = getLovelacePanel()?.config;
    if (!this._config || !ll || !findRepeatingCard(ll, this._config)) return html``;
    return html`
      <div class="section-per-copy">
        <p class="hint">${localize('editor.section_per_copy_hint', undefined, this.hass)}</p>
        ${this._sectionsError ? html`<ha-alert alert-type="error">${this._sectionsError}</ha-alert>` : html``}
        <ha-button @click=${this._sectionPerCopy}>
          ${localize(
            this._sectionsPending ? 'editor.section_per_copy_confirm' : 'editor.section_per_copy',
            undefined,
            this.hass,
          )}
        </ha-button>
      </div>
    `;
  }

  /*
   * Rewrites the dashboard rather than this card, so it saves through the dashboard - and
   * then closes the dialog, whose card no longer exists where the dialog would save it.
   */
  private async _sectionPerCopy(): Promise<void> {
    if (!this._sectionsPending) {
      this._sectionsPending = true;
      return;
    }
    this._sectionsPending = false;
    const panel = getLovelacePanel();
    const card = this._config;
    if (!panel || !card) return;
    try {
      await rewriteDashboards(this, this.hass, 'section_per_copy', [
        { urlPath: pageDashboard(), build: (config) => sectionPerCopy(config, card) },
      ]);
    } catch (err) {
      this._sectionsError = localize('tools.save_failed', { message: (err as Error)?.message ?? err }, this.hass);
      return;
    }
    let node: Node | null = this.parentNode instanceof ShadowRoot ? this.parentNode.host : this.parentNode;
    while (node && (node as Element).localName !== 'hui-dialog-edit-card') {
      node = node.parentNode instanceof ShadowRoot ? node.parentNode.host : node.parentNode;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node as any)?.closeDialog?.();
  }

  private _eject(resolved: unknown): void {
    if (!this._ejectPending) {
      this._ejectPending = true;
      return;
    }
    this._ejectPending = false;
    this._holdEjectUndo(resolved);
    fireEvent(this, 'config-changed', { config: resolved as Record<string, unknown> });
  }

  /*
   * Ejecting changes the card in the dialog, and the dialog is what saves it - so unlike the
   * other tools, nothing is written here. What is kept for undoing is the dashboard as it is
   * now, and as it will be once the dialog saves this card ejected: the card the dialog
   * opened with, swapped for what it builds. If the dialog saves anything else as well, or
   * is closed without saving, the dashboard will not match that, and undoing asks first.
   * A card not yet on the dashboard has nothing to put back.
   */
  private _holdEjectUndo(resolved: unknown): void {
    const panel = getLovelacePanel();
    if (!panel || !this._openedWith) return;
    const after = replaceCard(panel.config, this._openedWith, resolved as Record<string, unknown>);
    if (after === panel.config) return;
    holdUndo({
      operation: 'eject',
      at: Date.now(),
      dashboards: [{ urlPath: pageDashboard(), before: panel.config, after }],
    });
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
      // Borrowed: the dashboard it comes from is where it is edited (idea 20).
      const from = borrowedFrom(name);
      return html`<p class="hint">
        ${localize('editor.source_borrowed', undefined, this.hass)}
        ${
          from
            ? html`<a href=${dashboardHref(from)} target="_blank" rel="noreferrer"
                >${localize('editor.link.open_dashboard', undefined, this.hass)}</a
              >`
            : html``
        }
      </p>`;
    }
    if (location.declared || !location.view) {
      return html`<p class="hint">
        ${localize('editor.source_declared', undefined, this.hass)}
        ${localize('editor.link.raw_editor', undefined, this.hass)}
      </p>`;
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
      <a
        href="#"
        class="edit-template"
        @click=${(ev: Event): void => {
          ev.preventDefault();
          this._openTemplate(name);
        }}
        >${localize('editor.link.edit_template', undefined, this.hass)}</a
      >
      ${this._cannotOpen ? html`<br />${localize('editor.link.cannot_open', undefined, this.hass)}` : html``}
    </p>`;
  }

  // The card's for_each_from with its placeholders filled in, as the card fills it in (#309).
  private _filledSource(templateConfig: TemplateConfig | undefined): unknown {
    return fillSource(this._config?.for_each_from, this._config?.variables, templateConfig, this.hass);
  }

  /*
   * A template source's copies can be mappings of anything, so the names they supply are
   * only known once it has rendered - read from what it rendered, when it has, so those
   * names are not reported as missing.
   */
  private _renderedTemplateNames(templateConfig: TemplateConfig): string[] {
    const source = this._filledSource(templateConfig);
    const template = sourceTemplate(source);
    if (!this.hass || template === undefined) return [];
    if (!Object.prototype.hasOwnProperty.call(this._renderedTemplates, template)) return [];
    const names = new Set<string>();
    const items = resolveRegistryItems(this.hass, source, { rendered: this._renderedTemplates });
    for (const item of items) for (const name of Object.keys(item)) names.add(name);
    return [...names];
  }

  /** Renders a template source's Jinja once for the preview, then draws again. */
  private _renderEditorTemplate(template: string): void {
    if (!this.hass || this._renderingTemplates.has(template)) return;
    this._renderingTemplates.add(template);
    void renderTemplateOnce(this.hass, template).then((render) => {
      this._renderingTemplates.delete(template);
      this._renderedTemplates = { ...this._renderedTemplates, [template]: render };
    });
  }

  /*
   * What a registry repeat matches, as it is being written. The filters are powerful and
   * completely invisible until the card is saved and looked at, so a typo in a domain or an
   * area name reads as "this card is broken" rather than "nothing matched that". Counting
   * here turns writing them into something you can see working.
   */
  private _renderMatches(templateConfig: TemplateConfig | undefined): TemplateResult {
    if (!this.hass || !isRegistrySource(this._config?.for_each_from)) return html``;
    const source = this._filledSource(templateConfig);

    // A category is only known once fetched, and the card fetches it for itself - the
    // editor has to as well, or every category filter would preview as matching nothing.
    if (wantsCategories(source) && !categoryRegistry()) {
      void loadCategories(this.hass).then(() => this.requestUpdate());
    }

    const template = sourceTemplate(source);
    if (template !== undefined) {
      // Own keys only: the text is the user's, and `constructor` is a template too.
      const render = Object.prototype.hasOwnProperty.call(this._renderedTemplates, template)
        ? this._renderedTemplates[template]
        : undefined;
      if (!render) {
        this._renderEditorTemplate(template);
        return html`<p class="hint">${localize('editor.matches_template_pending', undefined, this.hass)}</p>`;
      }
      const listed = templateList(render);
      if (!('list' in listed)) {
        // The editor's own wording: the console's names the card and quotes the Jinja, both of
        // which are already in front of whoever is editing it.
        const key = listed.problem === 'error' ? 'editor.matches_template_failed' : 'editor.matches_template_not_list';
        return html`<ha-alert alert-type="warning"> ${localize(key, { detail: listed.detail }, this.hass)} </ha-alert>`;
      }
    }

    let matched: Record<string, unknown>[] = [];
    try {
      matched = resolveRegistryItems(this.hass, source, {
        ...sourceContext(this._lovelace),
        rendered: this._renderedTemplates,
      });
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

    return html`
      <ha-expansion-panel outlined>
        <span slot="header">
          ${
            matched.length === 1
              ? localize('editor.matches_header_one', { what: matchedWhat(source, 1, this.hass) }, this.hass)
              : localize(
                  'editor.matches_header_many',
                  { count: matched.length, what: matchedWhat(source, matched.length, this.hass) },
                  this.hass,
                )
          }
        </span>
        <div class="matches">
          <ul>
            ${shown.map((item, index) => html`<li>${copyLabel(item, index)}</li>`)}
          </ul>
          ${
            matched.length > shown.length
              ? html`<p class="hint">
                  ${localize('editor.matches_more', { count: matched.length - shown.length }, this.hass)}
                </p>`
              : html``
          }
          <p class="hint">
            ${localize(template === undefined ? 'editor.matches_hint' : 'editor.matches_template_hint', undefined, this.hass)}
          </p>
        </div>
      </ha-expansion-panel>
    `;
  }

  /*
   * A template that describes its variables gets a real control for each one, and a box
   * underneath for anything else the card sets. A template that does not is edited the
   * way it always has been, through that box alone.
   */
  private _formSchema(declarations: VariableDeclaration[], repeatable: boolean, hidden: EditorHidden): unknown[] {
    const repeat = repeatable ? repeatSchema() : [];
    const fit = hidden.fit ? [] : fitSchema();

    // With nothing described, the variables field is the only way to set any, so it stays.
    if (!declarations.length) return [...this._schema, ...repeat, ...fit];

    const field = (declaration: VariableDeclaration): Record<string, unknown> => ({
      name: VARIABLE_FIELD_PREFIX + declaration.name,
      label: declaration.label ?? declaration.name,
      helper: declaration.description,
      // A declared selector, then what its `type:` stands for, then its allowed values.
      selector: declarationSelector(declaration),
      required: declaration.required === true,
    });

    // Declarations sharing a `group:` fold into a collapsible section, so a template with
    // fifteen variables leads with its essentials. `name: ''` keeps the data flat - the
    // section is presentation, not a level in the config.
    const grouped: unknown[] = [];
    for (const bucket of groupDeclarations(declarations.filter((declaration) => !isCardDeclaration(declaration)))) {
      if (bucket.group === undefined) grouped.push(...bucket.declarations.map(field));
      else grouped.push({ name: '', type: 'expandable', title: bucket.group, schema: bucket.declarations.map(field) });
    }

    return [
      this._schema[0],
      ...grouped,
      ...(hidden.extras
        ? []
        : [
            {
              name: 'extras',
              label: localize('editor.extras_label', undefined, this.hass),
              helper: localize('editor.extras_helper', undefined, this.hass),
              selector: { object: {} },
            },
          ]),
      ...repeat,
      ...fit,
    ];
  }

  private _formData(declarations: VariableDeclaration[]): Record<string, unknown> {
    if (!declarations.length) return this._config as Record<string, unknown>;

    const values = variableValues(this._config?.variables);
    const described = new Set(declarations.map((declaration) => declaration.name));
    const data: Record<string, unknown> = { template: this._config?.template };
    this._shownAs = new Map();
    for (const declaration of declarations) {
      if (!(declaration.name in values)) continue;
      const value = values[declaration.name];
      /*
       * A toggle shows anything that is not empty as on, so a typed boolean holding a word
       * `bool` does not read - `maybe` - looked set and valid. It is shown as the switch it
       * would be (a word bool reads as itself, anything else off), and the written value is
       * kept unless the switch is actually moved.
       */
      if (typeof value !== 'boolean' && 'boolean' in (declarationSelector(declaration) as object)) {
        const shown = TRUE_WORDS.has(String(value).trim().toLowerCase());
        this._shownAs.set(declaration.name, { shown, written: value });
        data[VARIABLE_FIELD_PREFIX + declaration.name] = shown;
      } else data[VARIABLE_FIELD_PREFIX + declaration.name] = value;
    }

    const extras = ownVariables(this._config?.variables).filter((entry) => {
      const name = variableName(entry);
      return name !== undefined && !described.has(name);
    });
    if (extras.length) data.extras = extras;
    if (this._config?.for_each !== undefined) data.for_each = this._config.for_each;
    if (this._config?.for_each_from !== undefined) data.for_each_from = this._config.for_each_from;
    if (this._config?.columns !== undefined) data.columns = this._config.columns;
    if (this._config?.min_column_width !== undefined) data.min_column_width = this._config.min_column_width;
    if (this._config?.gap !== undefined) data.gap = this._config.gap;
    if (this._config?.fit !== undefined) data.fit = this._config.fit;
    if (this._config?.lazy !== undefined) data.lazy = this._config.lazy;
    if (this._config?.lazy_eager !== undefined) data.lazy_eager = this._config.lazy_eager;
    return data;
  }

  /*
   * Warnings, never errors: a template can be edited after the cards that use it, so a
   * card that looks wrong now may be right again in a moment. Nothing here stops a save.
   */
  private _renderDiagnostics(template: TemplateConfig | undefined, readable: boolean): TemplateResult {
    // Choosing by domain, the variables are shared by copies of different templates, so
    // what one of them leaves unset or unused says nothing about the others.
    if (!template || this._loadingTemplates || !readable || byDomainOf(this._config)) return html``;

    // The items' names count as supplied, so a variable only the items set is not
    // missing - but they are not the card's own, so they are never called unused.
    // Both kinds of repeat supply names to every copy, and neither is the card's own to
    // be called missing. A registry source supplies its set whether or not anything is
    // registered yet, so it is read from the source rather than from what it resolved to.
    const supplied = [
      ...forEachNames(this._config?.for_each),
      ...registryNames(this._config?.for_each_from),
      ...(isRegistrySource(this._config?.for_each_from) ? POSITION_NAMES : []),
      ...this._renderedTemplateNames(template),
      // An entity the card rebuilds on stands for itself in a placeholder.
      ...rebuildOnEntities(this._config?.rebuild_on),
      // What the template's own `with:` and `repeat:` give the bodies they fill in, and the
      // item templates those name, which are the dashboard's rather than the card's.
      ...structureNames(template, normaliseVariables(this._config?.variables)),
      ...Object.keys(itemTemplatesOf(this._lovelace ?? getLovelaceConfig())),
    ];
    const repeated = supplied.map((name) => ({ [name]: null }));
    // The card's own for_each_from and on_error are filled in from its variables as well.
    const { missing, unused, required } = diagnoseInstance(
      this._config?.variables,
      template,
      repeated,
      [this._config?.for_each_from, this._config?.on_error],
      itemTemplatesReached(template, itemTemplatesOf(this._lovelace ?? getLovelaceConfig())),
    );
    const invalid = validateDeclared(this._config?.variables, template, this.hass);
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
    /*
     * A repeat in several columns keeps them all on a phone, squeezing each copy, unless
     * it is told how narrow a copy may get. Easy to miss: it looks right on the desktop
     * where it was set up.
     */
    const columns = Number(this._config?.columns);
    const repeats = this._config?.for_each !== undefined || this._config?.for_each_from !== undefined;
    const fixedColumns = repeats && columns > 1 && !(Number(this._config?.min_column_width) > 0);
    const kind = getThingType(template);
    const misplaced = misplacedOverrides(this._config, kind);
    return html`
      ${misplaced.map(
        (key) =>
          html`<ha-alert alert-type="warning">
            ${localize('editor.override_misplaced', { key, kind: kind as string, template: this._config?.template ?? '' }, this.hass)}
          </ha-alert>`,
      )}
      ${
        fixedColumns
          ? html`<ha-alert alert-type="info">
              ${localize('editor.columns_without_min_width', { columns }, this.hass)}
            </ha-alert>`
          : html``
      }
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
      ${invalid.map(
        (each) =>
          html`<ha-alert alert-type="warning">
            ${localize('editor.invalid_value', { name: each.name, expected: each.expected }, this.hass)}
          </ha-alert>`,
      )}
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
      let value = data[VARIABLE_FIELD_PREFIX + declaration.name];
      // A switch shown for a written word it was not moved from keeps the word.
      const shownAs = this._shownAs.get(declaration.name);
      if (shownAs && value === shownAs.shown) value = shownAs.written;
      // A field left alone or cleared sets nothing, so the template's own default keeps
      // working. An empty string can still be set through the box below.
      if (value !== undefined && value !== '') desired.push({ [declaration.name]: value });
    }
    if (Array.isArray(data.extras)) desired.push(...data.extras);

    const config = { ...this._config, template: data.template } as DeclutteringCardConfig;
    // Whatever shape the config was written in, what is saved back is the list form.
    const variables = mergeVariables(ownVariables(this._config?.variables), desired);
    if (variables.length) config.variables = variables;
    else delete config.variables;
    setOrDelete(config, 'for_each', data.for_each);
    setOrDelete(config, 'for_each_from', data.for_each_from);
    setOrDelete(config, 'columns', data.columns);
    setOrDelete(config, 'min_column_width', data.min_column_width);
    setOrDelete(config, 'gap', data.gap);
    // Off is the default, so switching it off takes the key out rather than writing false.
    setOrDelete(config, 'lazy', data.lazy === true ? true : undefined);
    setOrDelete(config, 'lazy_eager', data.lazy_eager);

    fireEvent(this, 'config-changed', { config });
  }

  // The dropdown starts with this dashboard's templates and gains the borrowed ones once
  // the other dashboards have been read.
  private _loadBorrowedTemplates(): void {
    if (!mayBorrowTemplates(this._lovelace)) return;
    this._loadingTemplates = true;
    const place = this._editingPlace();
    collectAllTemplates(this.hass, this._lovelace, place.view, undefined, place.section)
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
