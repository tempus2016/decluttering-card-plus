import { LitElement, html, TemplateResult, CSSResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant, fireEvent, LovelaceCardEditor, LovelaceConfig } from 'custom-card-helpers';
import { DeclutteringTemplateConfig, TemplateConfig, FormSchemaEntry } from './types';
import { suggestVariables } from './suggest';
import {
  collectSharedDeclarations,
  collectTemplates,
  collectUsages,
  listPlainCards,
  replaceCard,
  listSections,
  replaceSectionCards,
  groupCards,
  withGroupCards,
  moveItem,
  itemTemplatesOf,
} from './templates';
import { contentKey, listSettings, nameForSetting, namesInUse, promoteSetting, SettingPath } from './promote';
import {
  diagnoseTemplate,
  addDeclarations,
  getDeclarations,
  isDeclarationsShape,
  templateDefaults,
  VariableDeclaration,
} from './variables';
import { getLovelaceConfig, getLovelacePanel } from './utils';
import { localize, onLanguageLoaded } from './localize';
import { definedNames, lintTemplate } from './lint';
import { getThingType, isVariablesShape, loadCardEditorPicker, setOrDelete } from './shared';
import { THING_STUBS, DRAG_PATH, textField, loadRowEditor, saveDashboardWith } from './template-editor/common';
import { TEMPLATE_EDITOR_STYLES } from './template-editor/styles';
import './template-editor/share-tab';
import './template-editor/declarations';
import './template-editor/example-strip';
import './template-editor/placeholder-tool';
import './template-editor/help-icon';
import './template-editor/usages-tab';

export class DeclutteringTemplateEditor extends LitElement implements LovelaceCardEditor {
  @state() private _config?: DeclutteringTemplateConfig;

  @state() private _selectedTab = 'settings';

  // A pending suggestion, held between the press that works it out and the press that
  // applies it - rewriting somebody's card is not something to do on a single click.
  @state() private _suggestion?: { card: unknown; variables: VariableDeclaration[] };

  @state() private _suggestedNothing = false;

  @state() public _toolError?: string;

  @state() public _busy = false;

  @state() private _declutterOriginal?: Record<string, unknown>;

  // A section picked in the declutter list instead of a card: where it is, and the cards it held.
  @state() private _declutterSection?: { view: number; section: number; cards: unknown[] };

  @state() private _declutterPending = false;

  // Turning one setting into a variable: which setting, the name it will take, and what was wrong.
  @state() private _promotePath?: SettingPath;

  @state() private _promoteName = '';

  @state() private _promoteError?: string;

  // A list being dragged in, and the place in it the drag started from.
  private _dragging?: { list: string; from: number };

  @property() public lovelace?: LovelaceConfig;

  @property() public hass?: HomeAssistant;

  /*
   * The dashboard as it is saved now. The dialog's `lovelace` is the copy it was opened
   * with, and every tool here saves the dashboard while the dialog stays open - read from
   * that copy, Where used said nothing used a template just renamed, and the health panel
   * kept offering to make a template of cards already made into one. The page's copy is
   * the one a save through the page replaces; the dialog's is for where there is no page.
   */
  private get _savedLovelace(): LovelaceConfig | null | undefined {
    return getLovelacePanel()?.config ?? this.lovelace ?? getLovelaceConfig();
  }

  private _loadedElements = false;

  // Shared instances, built on first use so they speak the user's language - a fresh
  // schema object per render would mark every field dirty for no reason.
  private static _describeSchema?: unknown[];
  private static _defaultsSchema?: unknown[];

  /** Describe: the template's name, kind, description and category. */
  private static describeSchema(): unknown[] {
    DeclutteringTemplateEditor._describeSchema ??= [
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
        name: 'category',
        label: localize('template_editor.category_label'),
        helper: localize('template_editor.category_helper'),
        selector: { text: {} },
      },
    ];
    return DeclutteringTemplateEditor._describeSchema;
  }

  /** The defaults, for values nobody declared. */
  private static defaultsSchema(): unknown[] {
    DeclutteringTemplateEditor._defaultsSchema ??= [
      {
        name: 'default',
        label: localize('template_editor.defaults_label'),
        helper: localize('template_editor.defaults_helper'),
        selector: { object: {} },
      },
    ];
    return DeclutteringTemplateEditor._defaultsSchema;
  }

  public setConfig(config: DeclutteringTemplateConfig): void {
    this._config = config;
    // Config can also arrive from outside - the dialog's YAML mode, an undo - and a
    // suggestion computed against the old card must not survive that any more than it
    // survives an edit made here.
    this._suggestion = undefined;
    this._suggestedNothing = false;
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._config) return html``;

    const error: Record<string, string | string[]> = {};
    if (!isVariablesShape(this._config.default) || !isVariablesShape(this._config.defaults)) {
      error.default = localize('error.variables_shape', undefined, this.hass);
    }
    if (!isDeclarationsShape(this._config.variables)) {
      error.variables = localize('template_editor.declarations_shape', undefined, this.hass);
    }

    const data = {
      template: this._config.template,
      thingType: getThingType(this._config) ?? 'card',
      description: this._config.description,
      category: this._config.category,
    };
    // `defaults:` is read as `default:`, so the field shows the two folded together.
    const defaultsData = { default: templateDefaults(this._config) };
    const declared = getDeclarations(this._config).length;

    return html`
      <ha-tab-group .active=${this._selectedTab} @click=${this._activateTab}>
        <ha-tab-group-tab slot="nav" panel="settings">
          ${localize('template_editor.tab_settings', undefined, this.hass)}
        </ha-tab-group-tab>
        ${
          // The card editor edits `card:`, which a group has none of - its cards are edited as YAML.
          data.thingType === 'card' && this._config.group === undefined
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
      <decluttering-example-strip
        .hass=${this.hass}
        .lovelace=${this._savedLovelace}
        .config=${this._config}
        @config-changed=${this._childConfigChanged}
      ></decluttering-example-strip>
      ${
        this._selectedTab === 'settings'
          ? html`
              <ha-expansion-panel outlined expanded>
                <span slot="header">${localize('template_editor.panel_describe', undefined, this.hass)}</span>
                <div class="panel">
                  ${this._renderInUse()}
                  ${(DeclutteringTemplateEditor.describeSchema() as FormSchemaEntry[]).map(
                    (entry) => html`
                      <div class="field-row">
                        <ha-form
                          .hass=${this.hass}
                          .data=${data}
                          .schema=${[entry]}
                          .computeLabel=${(s: FormSchemaEntry): string => s.label ?? s.name}
                          .computeHelper=${(s: FormSchemaEntry): string => s.helper ?? ''}
                          @value-changed=${this._describeChanged}
                        ></ha-form>
                        <decluttering-help
                          .hass=${this.hass}
                          key=${entry.name === 'thingType' ? 'type' : entry.name}
                        ></decluttering-help>
                      </div>
                    `,
                  )}
                </div>
              </ha-expansion-panel>
              <ha-expansion-panel outlined expanded>
                <span slot="header"
                  >${localize('template_editor.panel_variables', undefined, this.hass)}
                  <small>${localize('declarations.count', { count: declared }, this.hass)}</small></span
                >
                <div class="panel">
                  ${this._renderDiagnostics()}
                  ${error.variables ? html`<ha-alert alert-type="error">${error.variables}</ha-alert>` : html``}
                  <div class="field-row help-only">
                    <decluttering-help .hass=${this.hass} key="variables"></decluttering-help>
                  </div>
                  <decluttering-declarations-editor
                    .hass=${this.hass}
                    .variables=${this._config.variables}
                    .shared=${collectSharedDeclarations(this._savedLovelace)}
                    @value-changed=${this._declarationsChanged}
                  ></decluttering-declarations-editor>
                  <div class="field-row">
                    <ha-form
                      .hass=${this.hass}
                      .data=${defaultsData}
                      .schema=${DeclutteringTemplateEditor.defaultsSchema()}
                      .error=${error}
                      .computeLabel=${(s: FormSchemaEntry): string => s.label ?? s.name}
                      .computeHelper=${(s: FormSchemaEntry): string => s.helper ?? ''}
                      @value-changed=${this._defaultsChanged}
                    ></ha-form>
                    <decluttering-help .hass=${this.hass} key="default"></decluttering-help>
                  </div>
                  ${this._renderLint()} ${this._renderSuggest(data.thingType === 'card')}
                </div>
              </ha-expansion-panel>
              <ha-expansion-panel outlined>
                <span slot="header">${localize('template_editor.panel_tools', undefined, this.hass)}</span>
                <div class="panel">
                  ${this._renderPromote()} ${this._renderGroupOrder()} ${this._renderDeclutter()}
                  <decluttering-placeholder-tool
                    .hass=${this.hass}
                    .lovelace=${this._savedLovelace}
                    .config=${this._config}
                  ></decluttering-placeholder-tool>
                </div>
              </ha-expansion-panel>
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
                  ? html`<decluttering-template-usages-tab
                      .hass=${this.hass}
                      .lovelace=${this.lovelace}
                      .config=${this._config}
                      @select-tab=${this._selectTab}
                    ></decluttering-template-usages-tab>`
                  : this._selectedTab === 'share'
                    ? html`<decluttering-template-share-tab
                        .hass=${this.hass}
                        .lovelace=${this.lovelace}
                        .config=${this._config}
                        @select-tab=${this._selectTab}
                      ></decluttering-template-share-tab>`
                    : html``
      }
    `;
  }

  /*
   * What the template says about itself against what it actually uses. Both are worth
   * knowing while writing one, and neither is a reason to refuse the configuration.
   */
  private _renderDiagnostics(): TemplateResult {
    if (!this._config || !isDeclarationsShape(this._config.variables)) {
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
   * The placeholders as typed, read for what will not work: brackets that do not pair, a
   * step nobody has heard of, an `or:` a `default:` never lets run, a condition on a
   * variable the template never mentions. Worked out again on every edit - it is a walk
   * over one template, and the moment to say so is while the mistake is being made.
   *
   * Names the template gets from elsewhere - a parent it extends, the dashboard's shared
   * declarations and defaults - are not this template's to declare, so they are read off
   * the template as the dashboard would resolve it.
   */
  private _renderLint(): TemplateResult {
    if (!this._config) return html``;
    const ll = this._savedLovelace;
    const resolved = collectTemplates(ll, undefined, this._config)[this._config.template];
    // Item templates are names a placeholder may start with, and the dashboard's to define.
    const findings = lintTemplate(this._config, [...definedNames(resolved), ...Object.keys(itemTemplatesOf(ll))]);
    if (!findings.length) return html``;
    return html`${findings.map(
      (finding) =>
        html`<ha-alert alert-type=${finding.level}>
          ${localize(finding.key, finding.params, this.hass)}${
            finding.params.closest ? localize('error.did_you_mean', { closest: finding.params.closest }, this.hass) : ''
          }${finding.path ? localize('lint.where', { path: finding.path }, this.hass) : ''}
        </ha-alert>`,
    )}`;
  }

  /*
   * A list that can be put in order by dragging, and by the arrows beside each item for a
   * keyboard, or a touch screen that will not drag. `list` keeps a drag from one list
   * landing in another.
   */
  private _renderSortable(
    list: string,
    items: { label: string; name: string }[],
    move: (from: number, to: number) => void,
  ): TemplateResult {
    const drop = (ev: DragEvent, to: number): void => {
      ev.preventDefault();
      const dragging = this._dragging;
      this._dragging = undefined;
      if (dragging?.list === list) move(dragging.from, to);
    };
    return html`
      <ul>
        ${items.map(
          (item, index) => html`
            <li
              draggable="true"
              @dragstart=${(ev: DragEvent): void => {
                this._dragging = { list, from: index };
                ev.dataTransfer?.setData('text/plain', item.name);
                if (ev.dataTransfer) ev.dataTransfer.effectAllowed = 'move';
              }}
              @dragover=${(ev: DragEvent): void => {
                if (this._dragging?.list === list) ev.preventDefault();
              }}
              @drop=${(ev: DragEvent): void => drop(ev, index)}
              @dragend=${(): void => {
                this._dragging = undefined;
              }}
            >
              <ha-svg-icon class="handle" .path=${DRAG_PATH}></ha-svg-icon>
              <span>${item.label}</span>
              <span class="spacer"></span>
              <ha-icon-button
                .path=${'M7,15L12,10L17,15H7Z'}
                .disabled=${index === 0}
                .label=${localize('template_editor.move_up', { name: item.name }, this.hass)}
                @click=${(): void => move(index, index - 1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${'M7,10L12,15L17,10H7Z'}
                .disabled=${index === items.length - 1}
                .label=${localize('template_editor.move_down', { name: item.name }, this.hass)}
                @click=${(): void => move(index, index + 1)}
              ></ha-icon-button>
            </li>
          `,
        )}
      </ul>
    `;
  }

  /*
   * A group's cards are laid out in the order they are written, and the only way to change
   * that used to be cutting and pasting YAML. Each is named by its type and whatever it shows.
   */
  private _renderGroupOrder(): TemplateResult {
    const group = this._config?.group;
    const cards = groupCards(group);
    if (group === undefined || cards.length < 2) return html``;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = cards.map((card: any, index) => {
      const shown = card?.name ?? card?.heading ?? card?.title ?? card?.entity;
      const type = String(card?.type ?? '?').replace(/^custom:/, '');
      return { label: typeof shown === 'string' ? `${type} (${shown})` : type, name: `${index + 1} ${type}` };
    });
    return html`
      <div class="order">
        <p class="hint">${localize('template_editor.group_order_hint', undefined, this.hass)}</p>
        ${this._renderSortable('group', items, (from, to) => {
          const moved = moveItem(cards, from, to);
          if (moved === cards || !this._config) return;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this._fireConfigChanged({ ...this._config, group: withGroupCards(group, moved) as any });
        })}
      </div>
    `;
  }

  /*
   * Suggest variables guesses at the settings that usually change from copy to copy. This is
   * for the rest: pick any one setting, and it becomes a placeholder declared with the value
   * it had as its default - so the template still builds exactly what it did.
   */
  private _renderPromote(): TemplateResult {
    const key = contentKey(this._config);
    if (!this._config || !key) return html``;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const settings = listSettings((this._config as any)[key]);
    if (!settings.length) return html``;
    const picked = this._promotePath ? JSON.stringify(this._promotePath) : '';
    const shorten = (value: unknown): string => {
      const text = String(value);
      return text.length > 40 ? `${text.slice(0, 39)}…` : text;
    };
    return html`
      <ha-expansion-panel outlined class="promote">
        <span slot="header">${localize('template_editor.promote_header', undefined, this.hass)}</span>
        <p class="hint">${localize('template_editor.promote_hint', undefined, this.hass)}</p>
        <ha-form
          .hass=${this.hass}
          .data=${{ setting: picked }}
          .schema=${[
            {
              name: 'setting',
              selector: {
                select: {
                  mode: 'dropdown',
                  options: settings.map((setting) => ({
                    value: JSON.stringify(setting.path),
                    label: `${setting.label} = ${shorten(setting.value)}`,
                  })),
                },
              },
            },
          ]}
          .computeLabel=${(): string => localize('template_editor.promote_pick', undefined, this.hass)}
          @value-changed=${this._promotePicked}
        ></ha-form>
        ${
          this._promotePath
            ? html`
                ${textField({
                  label: localize('template_editor.promote_name', undefined, this.hass),
                  value: this._promoteName,
                  onInput: (value) => {
                    this._promoteName = value;
                    this._promoteError = undefined;
                  },
                })}
                ${this._promoteError ? html`<ha-alert alert-type="error">${this._promoteError}</ha-alert>` : html``}
                <ha-button .disabled=${!this._promoteName.trim()} @click=${this._promote}>
                  ${localize('template_editor.promote_button', undefined, this.hass)}
                </ha-button>
              `
            : html``
        }
      </ha-expansion-panel>
    `;
  }

  private _promotePicked(ev: CustomEvent): void {
    ev.stopPropagation();
    const value = (ev.detail.value as { setting?: string }).setting;
    if (!value) return;
    this._promotePath = JSON.parse(value) as SettingPath;
    this._promoteName = nameForSetting(this._promotePath, namesInUse(this._config));
    this._promoteError = undefined;
  }

  private _promote(): void {
    if (!this._config || !this._promotePath) return;
    const name = this._promoteName.trim();
    const result = promoteSetting(this._config, this._promotePath, name);
    if (!result.ok) {
      this._promoteError = localize(`template_editor.promote_${result.error}`, { name }, this.hass);
      return;
    }
    this._promotePath = undefined;
    this._promoteName = '';
    this._fireConfigChanged(result.template as DeclutteringTemplateConfig);
  }

  /*
   * What a change to this template would break. The Where used tab says the same thing, but
   * only if you go and look - and the moment that matters is when the card is open in front
   * of you, about to be edited or deleted.
   */
  private _renderInUse(): TemplateResult {
    const name = this._config?.template;
    const ll = this._savedLovelace;
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
        <ha-button @click=${this._suggest}>
          ${localize(
            this._suggestion ? 'template_editor.suggest_anyway' : 'template_editor.suggest_button',
            undefined,
            this.hass,
          )}
        </ha-button>
      </div>
    `;
  }

  private _suggest(): void {
    if (!this._config?.card) return;

    if (this._suggestion) {
      const config = { ...this._config, card: this._suggestion.card };
      // Existing declarations are kept: the suggestion was worked out around them.
      config.variables = addDeclarations(this._config.variables, this._suggestion.variables);
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
   * The on-ramp: a dashboard full of copy-pasted cards becomes a template by picking one
   * of them. The picked card becomes this template's card, ready for "Suggest variables";
   * once the template is saved, the original can be swapped for a card that uses it.
   */
  private _renderDeclutter(): TemplateResult {
    const ll = this._savedLovelace;
    const cards = listPlainCards(ll);
    // A section is made into a group, which only a card template can be.
    const sections = getThingType(this._config ?? ({} as TemplateConfig)) === 'card' ? listSections(ll) : [];
    if ((!cards.length && !sections.length) || !this._config) return html``;
    const name = this._config.template;
    const saved = !!name && name in collectTemplates(ll);
    const picked = this._declutterOriginal ?? this._declutterSection;
    return html`
      <ha-expansion-panel outlined>
        <span slot="header">${localize('template_editor.declutter_header', undefined, this.hass)}</span>
        <p class="hint">${localize('template_editor.declutter_hint', undefined, this.hass)}</p>
        ${
          cards.length
            ? html`<ha-form
                .hass=${this.hass}
                .data=${{}}
                .schema=${[
                  {
                    name: 'pick',
                    selector: {
                      select: {
                        mode: 'dropdown',
                        options: cards.map((card, index) => ({ value: String(index), label: card.label })),
                      },
                    },
                  },
                ]}
                .computeLabel=${(): string => localize('template_editor.declutter_pick', undefined, this.hass)}
                @value-changed=${(ev: CustomEvent): void => this._declutterPicked(ev, cards)}
              ></ha-form>`
            : html``
        }
        ${
          sections.length
            ? html`<ha-form
                .hass=${this.hass}
                .data=${{}}
                .schema=${[
                  {
                    name: 'pick',
                    selector: {
                      select: {
                        mode: 'dropdown',
                        options: sections.map((section, index) => ({
                          value: String(index),
                          label: localize(
                            section.cards.length === 1
                              ? 'template_editor.declutter_section_one'
                              : 'template_editor.declutter_section_many',
                            { where: section.label, count: section.cards.length },
                            this.hass,
                          ),
                        })),
                      },
                    },
                  },
                ]}
                .computeLabel=${(): string => localize('template_editor.declutter_pick_section', undefined, this.hass)}
                @value-changed=${(ev: CustomEvent): void => this._declutterSectionPicked(ev, sections)}
              ></ha-form>`
            : html``
        }
        ${
          picked
            ? html`
                <ha-button .disabled=${this._busy || !saved} @click=${this._declutterReplace}>
                  ${localize(
                    this._declutterPending
                      ? 'template_editor.declutter_replace_confirm'
                      : this._declutterSection
                        ? 'template_editor.declutter_replace_section'
                        : 'template_editor.declutter_replace',
                    undefined,
                    this.hass,
                  )}
                </ha-button>
                ${!saved ? html`<p class="hint">${localize('template_editor.declutter_save_first', undefined, this.hass)}</p>` : html``}
              `
            : html``
        }
      </ha-expansion-panel>
    `;
  }

  private _declutterPicked(ev: CustomEvent, cards: { label: string; config: Record<string, unknown> }[]): void {
    ev.stopPropagation();
    const index = Number((ev.detail.value as { pick?: string }).pick);
    const picked = cards[index];
    if (!picked || !this._config) return;
    this._declutterOriginal = picked.config;
    this._declutterSection = undefined;
    this._declutterPending = false;
    this._suggestion = undefined;
    this._suggestedNothing = false;
    // A copy, so editing the template never reaches back into the original card.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config: any = { ...this._config, card: JSON.parse(JSON.stringify(picked.config)) };
    delete config.group;
    this._fireConfigChanged(config);
  }

  /*
   * A whole section becomes a group: every card in it, in order, each laid out in the section
   * as it was. The template takes copies, so the section is untouched until Replace is pressed.
   */
  private _declutterSectionPicked(
    ev: CustomEvent,
    sections: { view: number; section: number; cards: Record<string, unknown>[] }[],
  ): void {
    ev.stopPropagation();
    const index = Number((ev.detail.value as { pick?: string }).pick);
    const picked = sections[index];
    if (!picked || !this._config) return;
    this._declutterSection = { view: picked.view, section: picked.section, cards: picked.cards };
    this._declutterOriginal = undefined;
    this._declutterPending = false;
    this._suggestion = undefined;
    this._suggestedNothing = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config: any = { ...this._config, group: { cards: JSON.parse(JSON.stringify(picked.cards)) } };
    delete config.card;
    this._fireConfigChanged(config);
  }

  private async _declutterReplace(): Promise<void> {
    const name = this._config?.template;
    const original = this._declutterOriginal;
    const section = this._declutterSection;
    if (!name || (!original && !section)) return;
    if (!this._declutterPending) {
      this._declutterPending = true;
      return;
    }
    const replacement = { type: 'custom:decluttering-card-plus', template: name };
    let unchanged = false;
    const saved = await this._saveDashboard((config) => {
      if (original) return replaceCard(config, original, replacement);
      const built = replaceSectionCards(config, section!.view, section!.section, section!.cards, [replacement]);
      unchanged = built === config;
      return built;
    }, 'declutter');
    if (saved && unchanged)
      this._toolError = localize('template_editor.declutter_section_changed', undefined, this.hass);
    if (saved) {
      this._declutterPending = false;
      this._declutterOriginal = undefined;
      this._declutterSection = undefined;
    }
  }

  /*
   * Read the panel off the clicked tab rather than listening for the tab group's own
   * show event, whose name has followed the underlying component through several
   * renames. A click on the tab strip is the same signal and does not move.
   */
  // A tab asks for another to be shown: an import that landed switches to the Card tab.
  private _selectTab(ev: CustomEvent<string>): void {
    ev.stopPropagation();
    this._selectedTab = ev.detail;
  }

  private _activateTab(ev: Event): void {
    const tab = ev.composedPath().find((node) => (node as HTMLElement).localName === 'ha-tab-group-tab') as
      HTMLElement | undefined;
    const panel = tab?.getAttribute('panel');
    if (panel) this._selectedTab = panel;
  }

  /** The Describe panel: name, kind, description, category. */
  private _describeChanged(ev: CustomEvent): void {
    if (!this._config) return;
    // Each field is its own form (so a help icon can sit beside it), so the event carries
    // one field; the rest is read off the template as it stands.
    const data = {
      template: this._config.template,
      thingType: getThingType(this._config) ?? 'card',
      description: this._config.description,
      category: this._config.category,
      ...(ev.detail.value as Record<string, unknown>),
    };
    const config = { ...this._config, template: data.template };
    // Unlike the stubs below, these replace whatever is already there rather than only
    // filling in what is absent.
    setOrDelete(config, 'description', data.description);
    setOrDelete(config, 'category', data.category);
    // A group is a card template's body too, so it stays while the type stays a card - without
    // this, editing any setting gave the group a starter card beside it and broke the template.
    const keepsGroup = config.group !== undefined && data.thingType === 'card';
    if (!keepsGroup) delete config.group;
    for (const [thingType, stub] of Object.entries(THING_STUBS)) {
      DeclutteringTemplateEditor.stubMember(!keepsGroup && data.thingType === thingType, config, thingType, stub);
    }
    this._fireConfigChanged(config);
  }

  /** The declarations editor wrote a new `variables:`, in the shape it read. */
  private _declarationsChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;
    const config = { ...this._config };
    setOrDelete(config, 'variables', ev.detail.value);
    this._fireConfigChanged(config);
  }

  private _defaultsChanged(ev: CustomEvent): void {
    if (!this._config) return;
    const data = ev.detail.value;
    const config = { ...this._config, default: data.default };
    /*
     * The field shows `default:` and `defaults:` folded together. Left alone, both stay as
     * they were written; edited, what it now holds is the whole list, so it goes back under
     * the one name rather than being merged with the plural a second time.
     */
    if (this._config.defaults !== undefined) {
      if (JSON.stringify(data.default) === JSON.stringify(templateDefaults(this._config))) {
        config.default = this._config.default;
      } else {
        delete config.defaults;
      }
    }
    this._fireConfigChanged(config);
  }

  /** A child that rewrote the whole template - the example strip adding an example. */
  private _childConfigChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    this._fireConfigChanged(ev.detail.config);
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

  static get styles(): CSSResult {
    return TEMPLATE_EDITOR_STYLES;
  }

  private _saveDashboard(build: (config: unknown) => unknown, operation: string, dialog?: unknown): Promise<boolean> {
    return saveDashboardWith(this, build, operation, dialog);
  }

  // Stops listening for a language chunk landing (idea 4).
  private _stopLanguageListener?: () => void;

  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this._stopLanguageListener ??= onLanguageLoaded(() => this.requestUpdate());
    if (!this._loadedElements) {
      await loadCardEditorPicker();
      await loadRowEditor();
      this._loadedElements = true;
    }
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopLanguageListener?.();
    this._stopLanguageListener = undefined;
  }
}
