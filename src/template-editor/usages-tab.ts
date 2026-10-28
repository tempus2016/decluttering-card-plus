import { LitElement, html, TemplateResult, CSSResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { HomeAssistant, fireEvent, LovelaceConfig } from 'custom-card-helpers';
import { DeclutteringTemplateConfig, TemplateConfig } from '../types';
import deepReplace from '../deep-replace';
import {
  collectTemplates,
  addCardToView,
  collectUsages,
  countLegacyTypes,
  moderniseTypes,
  findTemplateLocation,
  renameTemplate,
  TemplateUsages,
  firstUsage,
  fetchDashboardPaths,
  usagesOnOtherDashboards,
  listPlainCards,
} from '../templates';
import { getLovelaceConfig, getLovelacePanel } from '../utils';
import { localize } from '../localize';
import { renderDiff, renderDiffWithFull } from '../diff-view';
import { CardValueMatch, TemplateValueMatch, searchValues } from '../search';
import {
  MAX_DIFFERING,
  SimilarGroup,
  findSimilarCards,
  makeTemplateFromSimilar,
  similarReplacement,
  suggestTemplateName,
  templateFromSimilar,
} from '../similar';
import { dashboardKey, heldUndo, readDashboard } from '../undo';
import {
  borrowsTemplate,
  affectedTemplates,
  nameTakenIn,
  renameVariableInDashboard,
  renameVariableInTemplate,
  validVariableName,
  variableNames,
} from '../rename-variable';
import { operationLabel, pageDashboard, rewriteDashboards, saverFor, thingContent, undoFrom } from '../shared';
import { SIMILAR_SHOWN, SIMILAR_MEMBERS_SHOWN, SEARCH_SHOWN, textField, saveDashboardWith } from './common';
import { TEMPLATE_EDITOR_STYLES } from './styles';

export class DeclutteringTemplateUsagesTab extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public lovelace?: LovelaceConfig;
  @property({ attribute: false }) public config?: DeclutteringTemplateConfig;

  // The methods below were written as part of the editor itself, reading `this._config`.
  private get _config(): DeclutteringTemplateConfig | undefined {
    return this.config;
  }

  private get _savedLovelace(): LovelaceConfig | null | undefined {
    return getLovelacePanel()?.config ?? this.lovelace ?? getLovelaceConfig();
  }

  static get styles(): CSSResult {
    return TEMPLATE_EDITOR_STYLES;
  }

  private _fireConfigChanged(config: DeclutteringTemplateConfig): void {
    fireEvent(this, 'config-changed', { config });
  }

  private _saveDashboard(build: (config: unknown) => unknown, operation: string, dialog?: unknown): Promise<boolean> {
    return saveDashboardWith(this, build, operation, dialog);
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) return html``;
    return this._renderUsages();
  }

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

  @state() public _toolError?: string;

  @state() public _busy = false;

  @state() private _modernisePending = false;

  @state() private _remoteUsages?: { name: string; list: { urlPath: string; total: number }[] };

  // The dashboards saved since the rewrite that could be undone, once undoing has found them.
  @state() public _undoChanged?: string[];

  // Sets of cards that are copies of each other but for a few values, worked out once per
  // dashboard config; the name typed for each set's template; and the set whose Make button
  // has been pressed once, with the name it was pressed for.
  private _similar?: {
    ll: unknown;
    cards: { label: string; config: Record<string, unknown> }[];
    groups: SimilarGroup[];
  };

  @state() private _similarNames: Record<string, string> = {};

  @state() private _similarPending?: string;

  // Searching every dashboard for a value: what was typed, and what the last search found.
  @state() private _searchQuery = '';

  @state() private _searching = false;

  @state() private _searchResult?: { query: string; cards: CardValueMatch[]; templates: TemplateValueMatch[] };

  // Renaming a variable: which, to what, and - once the first press has counted them - what
  // the second press would rewrite, here and on the dashboards borrowing this template.
  @state() private _varFrom?: string;

  @state() private _varTo = '';

  @state() private _varError?: string;

  @state() private _varPending?: {
    from: string;
    to: string;
    cards: number;
    templates: number;
    elsewhere: { urlPath: string; cards: number }[];
  };

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
    const ll = this._savedLovelace;
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
        ${this._renderElsewhere(name)} ${this._renderImpact(ll, name)}
        <decluttering-card-plus-health .hass=${this.hass} .lovelace=${ll}
          >${this._renderUndo()}</decluttering-card-plus-health
        >
        ${this._renderSimilar(ll)} ${this._renderSearch()} ${this._renderRename(name, total)}
        ${this._renderRenameVariable(name)} ${this._renderDuplicate(name)} ${this._renderModernise()}
        ${this._toolError ? html`<ha-alert alert-type="error">${this._toolError}</ha-alert>` : html``}
      </div>
    `;
  }

  /*
   * The way back from the last rewrite, for as long as there is one - the toast that offered
   * it is gone in seconds. Undoing over a dashboard somebody has saved since would lose that
   * too, so the first press finds out and says so, and only a second press goes ahead.
   */
  private _renderUndo(): TemplateResult {
    const held = heldUndo();
    if (!held) return html``;
    const operation = operationLabel(held.operation, this.hass);
    const time = new Date(held.at).toLocaleTimeString(this.hass?.locale?.language);
    return html`
      <div class="undo">
        <p class="hint">${localize('undo.held', { operation, time }, this.hass)}</p>
        ${
          this._undoChanged
            ? html`<ha-alert alert-type="warning">
                ${localize('undo.changed_here', { operation, dashboards: this._undoChanged.join(', ') }, this.hass)}
              </ha-alert>`
            : html``
        }
        <ha-button .disabled=${this._busy} @click=${this._undo}>
          ${localize(this._undoChanged ? 'undo.anyway_button' : 'undo.button', { operation }, this.hass)}
        </ha-button>
      </div>
    `;
  }

  private async _undo(): Promise<void> {
    const held = heldUndo();
    if (!held) return;
    this._busy = true;
    try {
      const outcome = await undoFrom(this, this.hass, held, !!this._undoChanged, false);
      this._undoChanged = outcome?.result === 'changed' ? outcome.dashboards : undefined;
    } finally {
      this._busy = false;
    }
  }

  /*
   * The copy-pasted cards a template would replace, found rather than hunted for: sets of
   * cards with the same type and the same structure that differ only in a few values. Each
   * set can become a template in one go - the first press shows the template and what the
   * first card becomes, the second saves. The sets are worked out once per dashboard config.
   */
  private _renderSimilar(ll: LovelaceConfig | null | undefined): TemplateResult {
    if (this._similar?.ll !== ll) {
      const found = listPlainCards(ll);
      this._similar = { ll, cards: found, groups: findSimilarCards(found.map((card) => card.config)) };
    }
    const { cards, groups } = this._similar as NonNullable<typeof this._similar>;
    if (!groups.length) return html``;
    const taken = Object.keys(collectTemplates(ll));
    return html`
      <ha-expansion-panel outlined>
        <span slot="header">
          ${localize(groups.length === 1 ? 'tools.similar_header_one' : 'tools.similar_header', { count: groups.length }, this.hass)}
        </span>
        <p class="hint">${localize('tools.similar_hint', { max: MAX_DIFFERING }, this.hass)}</p>
        ${groups.slice(0, SIMILAR_SHOWN).map((group) => this._renderSimilarGroup(group, cards, taken))}
      </ha-expansion-panel>
    `;
  }

  private _renderSimilarGroup(
    group: SimilarGroup,
    cards: { label: string; config: Record<string, unknown> }[],
    taken: string[],
  ): TemplateResult {
    const members = group.indices.map((index) => cards[index]);
    const made = templateFromSimilar(members.map((member) => member.config));
    const name = (
      this._similarNames[group.key] ??
      suggestTemplateName(
        group.type,
        taken,
        members.map((member) => member.config),
      )
    ).trim();
    const armed = this._similarPending === `${group.key}\u0000${name}`;
    const clash = taken.includes(name);
    return html`
      <div class="similar">
        <h3>${localize('tools.similar_group', { count: members.length, type: group.type }, this.hass)}</h3>
        <p class="hint">${localize('tools.similar_differ', { names: made.names.join(', ') }, this.hass)}</p>
        <ul>
          ${members.slice(0, SIMILAR_MEMBERS_SHOWN).map((member) => html`<li>${member.label}</li>`)}
        </ul>
        ${
          members.length > SIMILAR_MEMBERS_SHOWN
            ? html`<p class="hint">
                ${localize('editor.matches_more', { count: members.length - SIMILAR_MEMBERS_SHOWN }, this.hass)}
              </p>`
            : html``
        }
        ${clash ? html`<ha-alert alert-type="error">${localize('tools.name_taken', { name }, this.hass)}</ha-alert>` : html``}
        ${
          armed
            ? html`
                <ha-alert alert-type="warning">
                  ${localize('tools.similar_confirm', { name, count: members.length }, this.hass)}
                </ha-alert>
                <p class="hint">${localize('tools.similar_template', { name }, this.hass)}</p>
                ${keyed(
                  `${group.key}\u0000${name}`,
                  html`<ha-yaml-editor
                    .hass=${this.hass}
                    .defaultValue=${{ [name]: made.template }}
                    read-only
                  ></ha-yaml-editor>`,
                )}
                <p class="hint">${localize('tools.similar_first_card', undefined, this.hass)}</p>
                ${renderDiff(members[0].config, similarReplacement(name, made.variables[0], made.layout[0]), this.hass)}
              `
            : html``
        }
        ${textField({
          label: localize('tools.similar_name', undefined, this.hass),
          value: name,
          disabled: this._busy,
          onInput: (value) => {
            this._similarNames = { ...this._similarNames, [group.key]: value };
            this._similarPending = undefined;
          },
        })}
        <ha-button
          .disabled=${this._busy || !name || clash}
          @click=${(): void => void this._makeTemplate(group, members, name)}
        >
          ${localize(armed ? 'tools.similar_make_anyway' : 'tools.similar_make', undefined, this.hass)}
        </ha-button>
      </div>
    `;
  }

  private async _makeTemplate(
    group: SimilarGroup,
    members: { label: string; config: Record<string, unknown> }[],
    name: string,
  ): Promise<void> {
    const key = `${group.key}\u0000${name}`;
    if (this._similarPending !== key) {
      this._similarPending = key;
      return;
    }
    const saved = await this._saveDashboard(
      (config) =>
        makeTemplateFromSimilar(
          config,
          members.map((member) => member.config),
          name,
        ),
      'make_template',
    );
    if (saved) {
      this._similarPending = undefined;
      const names = { ...this._similarNames };
      delete names[group.key];
      this._similarNames = names;
    }
  }

  /*
   * The same name counted on every other dashboard - looked at, never written. Renaming
   * and deleting here still touch only this dashboard, and this is what says whether
   * that matters today.
   */
  private _renderElsewhere(name: string): TemplateResult {
    if (this._remoteUsages?.name !== name) {
      this._remoteUsages = { name, list: [] };
      const ownPath = document.location.pathname.split('/').filter(Boolean)[0];
      void usagesOnOtherDashboards(this.hass, name, ownPath).then((list) => {
        if (this._remoteUsages?.name === name) this._remoteUsages = { name, list };
      });
    }
    const list = this._remoteUsages.list;
    if (!list.length) return html``;
    const summary = list.map((each) => `${each.urlPath} (${each.total})`).join(', ');
    return html`<ha-alert alert-type="info">
      ${localize('template_editor.usages_elsewhere', { list: summary }, this.hass)}
    </ha-alert>`;
  }

  /*
   * One real card, built against the template as it stands in this editor - unsaved edits
   * and all - so "this changes 12 cards" comes with a look at what one of them becomes
   * before anything is saved.
   */
  private _renderImpact(ll: LovelaceConfig | null | undefined, name: string): TemplateResult {
    const usage = firstUsage(ll, name);
    if (!usage || !this._config) return html``;
    /*
     * Built twice - once from the template as the dashboard has it saved, once with the
     * edits in this editor put in its place - and the two compared, so the preview says
     * what changes rather than leaving the reader to find it. Both go through the same
     * collection, so a parent template and the shared values are folded in on each side.
     */
    const build = (template: TemplateConfig | undefined): unknown => {
      if (!template) return undefined;
      return deepReplace(usage.variables, template, thingContent(template), name, this.hass, true);
    };
    let before: unknown;
    let after: unknown;
    try {
      before = build(collectTemplates(ll)[name]);
      after = build(collectTemplates(ll, undefined, this._config)[name]);
    } catch {
      return html``;
    }
    return html`
      <ha-expansion-panel outlined>
        <span slot="header">${localize('template_editor.impact_header', undefined, this.hass)}</span>
        <p class="hint">${localize('template_editor.impact_diff_hint', undefined, this.hass)}</p>
        ${renderDiffWithFull(before, after, this.hass)}
      </ha-expansion-panel>
    `;
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
        ${textField({
          label: localize('tools.new_name', undefined, this.hass),
          value: this._renameTo,
          disabled: this._renaming,
          onInput: (value) => this._renameChanged(value),
        })}
        <ha-button .disabled=${this._renaming || !to || to === name} @click=${this._rename}>
          ${
            armed
              ? localize('tools.rename_anyway', undefined, this.hass)
              : total === 1
                ? localize('tools.rename_update_one', undefined, this.hass)
                : total
                  ? localize('tools.rename_update_many', { count: total }, this.hass)
                  : localize('tools.rename', undefined, this.hass)
          }
        </ha-button>
      </div>
    `;
  }

  /*
   * Installing this card over the original needs no changes - it answers to both sets of
   * names. But a dashboard still saying `custom:decluttering-card` everywhere breaks the
   * day the original is installed alongside it, because Home Assistant loads resources in
   * the order they were added and the original would win.
   */
  private _renderModernise(): TemplateResult {
    const ll = this._savedLovelace;
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
        <ha-button .disabled=${this._busy} @click=${this._modernise}>
          ${localize(
            this._modernisePending
              ? 'tools.modernise_anyway'
              : old === 1
                ? 'tools.modernise_one'
                : 'tools.modernise_many',
            undefined,
            this.hass,
          )}
        </ha-button>
      </div>
    `;
  }

  private async _modernise(): Promise<void> {
    if (!this._modernisePending) {
      this._modernisePending = true;
      return;
    }
    const saved = await this._saveDashboard((config) => moderniseTypes(config), 'modernise');
    if (saved) this._modernisePending = false;
  }

  private _renameChanged(value: string): void {
    this._renameTo = value;
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
      await rewriteDashboards(
        this,
        this.hass,
        'rename_template',
        [{ urlPath: pageDashboard(), build: (config) => renameTemplate(config, from, to) }],
        this._config,
      );
      this._undoChanged = undefined;
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
   * Where a value is used - `light.kitchen` after the bulb is replaced - when the cards that
   * show it are templated: the entity is a variable on some card on some dashboard, or
   * written straight into a template, and Home Assistant's own search looks at neither.
   * Every dashboard is read fresh when the button is pressed, and only then.
   */
  private _renderSearch(): TemplateResult {
    const query = this._searchQuery.trim();
    const result = this._searchResult;
    const where = (match: CardValueMatch): string =>
      match.where === 'variables' ? '' : localize(`tools.search_in_${match.where}`, undefined, this.hass);
    const view = (match: CardValueMatch): string =>
      match.view.title || match.view.path || localize('template_editor.untitled_view', undefined, this.hass);
    return html`
      <div class="rename">
        <h3>${localize('tools.search_header', undefined, this.hass)}</h3>
        <p class="hint">${localize('tools.search_hint', undefined, this.hass)}</p>
        ${textField({
          label: localize('tools.search_label', undefined, this.hass),
          value: this._searchQuery,
          onInput: (value) => {
            this._searchQuery = value;
          },
          onKeydown: (ev) => {
            if (ev.key === 'Enter') void this._search();
          },
        })}
        <ha-button .disabled=${this._searching || !query} @click=${(): void => void this._search()}>
          ${localize(this._searching ? 'tools.searching' : 'tools.search', undefined, this.hass)}
        </ha-button>
        ${
          result && !result.cards.length && !result.templates.length
            ? html`<p class="hint">${localize('tools.search_none', { query: result.query }, this.hass)}</p>`
            : html``
        }
        ${
          result?.cards.length
            ? html`
                <p class="hint">${localize('tools.search_cards', { count: result.cards.length }, this.hass)}</p>
                <ul>
                  ${result.cards.slice(0, SEARCH_SHOWN).map(
                    (match) => html`
                      <li>
                        <a
                          href=${`/${match.urlPath}/${match.view.path || match.view.index}`}
                          target="_blank"
                          rel="noreferrer"
                          >${match.urlPath} › ${view(match)}</a
                        >
                        — ${match.template}: <code>${match.variable}</code> = ${match.value}${where(match)}
                      </li>
                    `,
                  )}
                </ul>
                ${
                  result.cards.length > SEARCH_SHOWN
                    ? html`<p class="hint">
                        ${localize('editor.matches_more', { count: result.cards.length - SEARCH_SHOWN }, this.hass)}
                      </p>`
                    : html``
                }
              `
            : html``
        }
        ${
          result?.templates.length
            ? html`
                <p class="hint">${localize('tools.search_templates', { count: result.templates.length }, this.hass)}</p>
                <ul>
                  ${result.templates
                    .slice(0, SEARCH_SHOWN)
                    .map(
                      (match) =>
                        html`<li>
                          ${match.urlPath} › ${match.template}: <code>${match.path}</code> = ${match.value}
                        </li>`,
                    )}
                </ul>
                ${
                  result.templates.length > SEARCH_SHOWN
                    ? html`<p class="hint">
                        ${localize('editor.matches_more', { count: result.templates.length - SEARCH_SHOWN }, this.hass)}
                      </p>`
                    : html``
                }
              `
            : html``
        }
      </div>
    `;
  }

  private async _search(): Promise<void> {
    const query = this._searchQuery.trim();
    if (!query || this._searching) return;
    this._searching = true;
    try {
      const own = pageDashboard();
      const saver = saverFor(this.hass);
      const dashboards: { urlPath: string; config: unknown }[] = [{ urlPath: own, config: this._savedLovelace }];
      for (const path of this.hass ? await fetchDashboardPaths(this.hass) : []) {
        if (dashboardKey(path) === own) continue;
        try {
          dashboards.push({ urlPath: path, config: await readDashboard(saver, path) });
        } catch {
          // A dashboard that cannot be read has nothing to say here.
        }
      }
      this._searchResult = { query, ...searchValues(dashboards, query) };
    } finally {
      this._searching = false;
    }
  }

  /*
   * A variable's name is written in the template and in every card that passes it, so
   * changing it in the template alone leaves the cards passing a value nothing reads - which
   * renders as the template's default and looks almost right. This changes it everywhere at
   * once: the template, templates built on it, cards using either, on this dashboard and on
   * any other that borrows this template. The first press counts, the second saves.
   */
  private _renderRenameVariable(name: string): TemplateResult {
    const names = variableNames(this._config);
    if (!names.length || !this._config) return html``;
    const from = this._varFrom && names.includes(this._varFrom) ? this._varFrom : undefined;
    const to = this._varTo.trim();
    const pending = this._varPending;
    const armed = !!pending && pending.from === from && pending.to === to;
    const elsewhere =
      armed && pending.elsewhere.length
        ? localize(
            'tools.rename_variable_elsewhere',
            { list: pending.elsewhere.map((each) => `${each.urlPath} (${each.cards})`).join(', ') },
            this.hass,
          )
        : '';
    return html`
      <div class="rename">
        <h3>${localize('tools.rename_variable_header', undefined, this.hass)}</h3>
        <p class="hint">${localize('tools.rename_variable_hint', undefined, this.hass)}</p>
        ${this._varError ? html`<ha-alert alert-type="error">${this._varError}</ha-alert>` : html``}
        ${
          armed && from
            ? html`
                <ha-alert alert-type="warning">
                  ${localize(
                    'tools.rename_variable_confirm',
                    { from, to, templates: pending.templates, cards: pending.cards, elsewhere },
                    this.hass,
                  )}
                </ha-alert>
                ${renderDiff(this._config, renameVariableInTemplate(this._config, from, to), this.hass)}
              `
            : html``
        }
        <ha-form
          .hass=${this.hass}
          .data=${{ variable: from ?? '' }}
          .schema=${[
            {
              name: 'variable',
              selector: { select: { mode: 'dropdown', options: names.map((each) => ({ value: each, label: each })) } },
            },
          ]}
          .computeLabel=${(): string => localize('tools.rename_variable_pick', undefined, this.hass)}
          @value-changed=${this._varPicked}
        ></ha-form>
        ${textField({
          label: localize('tools.new_name', undefined, this.hass),
          value: this._varTo,
          disabled: this._busy,
          onInput: (value) => this._varToChanged(value),
        })}
        <ha-button
          .disabled=${this._busy || !from || !to || to === from}
          @click=${(): void => void this._renameVariable(name)}
        >
          ${localize(armed ? 'tools.rename_anyway' : 'tools.rename_variable', undefined, this.hass)}
        </ha-button>
      </div>
    `;
  }

  private _varPicked(ev: CustomEvent): void {
    // Not part of the card's configuration, so it must not reach the settings handler.
    ev.stopPropagation();
    this._varFrom = (ev.detail.value as { variable?: string }).variable || undefined;
    this._varError = undefined;
    this._varPending = undefined;
  }

  private _varToChanged(value: string): void {
    this._varTo = value;
    this._varError = undefined;
    // Whatever was counted was counted for the old name, not this one.
    this._varPending = undefined;
  }

  private async _renameVariable(name: string): Promise<void> {
    const from = this._varFrom;
    const to = this._varTo.trim();
    if (!from || !to || to === from || !this._config) return;
    if (!validVariableName(to)) {
      this._varError = localize('tools.rename_variable_invalid', { name: to }, this.hass);
      return;
    }
    const panel = getLovelacePanel();
    if (!panel) {
      this._varError = localize('tools.cannot_save_here', undefined, this.hass);
      return;
    }
    if (nameTakenIn(panel.config, name, to, this._config)) {
      this._varError = localize('tools.rename_variable_taken', { name: to }, this.hass);
      return;
    }

    const own = pageDashboard();
    const pending = this._varPending;
    if (!pending || pending.from !== from || pending.to !== to) {
      // The first press counts what the second would rewrite. Other dashboards are read
      // fresh: a borrowed template's cards can be anywhere, and a cached copy may be stale.
      this._busy = true;
      try {
        const saver = saverFor(this.hass);
        const current = await readDashboard(saver, own).catch(() => panel.config);
        const here = renameVariableInDashboard(current, name, from, to);
        // The templates built on this one are borrowed along with it, and so are their cards.
        const lent = affectedTemplates(current, name);
        const elsewhere: { urlPath: string; cards: number }[] = [];
        for (const path of this.hass ? await fetchDashboardPaths(this.hass) : []) {
          if (dashboardKey(path) === own) continue;
          let config: unknown;
          try {
            config = await readDashboard(saver, path);
          } catch {
            // A dashboard that cannot be read - a YAML one, one being deleted - is not rewritten either.
            continue;
          }
          if (!borrowsTemplate(config, name, own)) continue;
          const there = renameVariableInDashboard(config, name, from, to, lent);
          if (there.cards || there.templates) elsewhere.push({ urlPath: path, cards: there.cards });
        }
        this._varPending = { from, to, cards: here.cards, templates: here.templates, elsewhere };
      } finally {
        this._busy = false;
      }
      return;
    }

    this._busy = true;
    this._varError = undefined;
    try {
      // Worked out again from this dashboard as it is read for saving, which comes first.
      let lent: Set<string> | undefined;
      await rewriteDashboards(
        this,
        this.hass,
        'rename_variable',
        [
          {
            urlPath: own,
            build: (config: unknown): unknown => {
              lent = affectedTemplates(config, name);
              return renameVariableInDashboard(config, name, from, to).config;
            },
          },
          // Checked again as each is saved: it is read fresh, and may have stopped borrowing.
          ...pending.elsewhere.map((each) => ({
            urlPath: each.urlPath,
            build: (config: unknown): unknown =>
              borrowsTemplate(config, name, own)
                ? renameVariableInDashboard(config, name, from, to, lent).config
                : config,
          })),
        ],
        this._config,
      );
      this._undoChanged = undefined;
      // The dialog holds this template too, and saving it afterwards would put the old name back.
      this._fireConfigChanged(renameVariableInTemplate(this._config, from, to));
      this._varFrom = to;
      this._varTo = '';
      this._varPending = undefined;
    } catch (err) {
      this._varError = localize('tools.save_failed', { message: (err as Error)?.message ?? err }, this.hass);
    } finally {
      this._busy = false;
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
        ${textField({
          label: localize('tools.copy_name', undefined, this.hass),
          value: this._duplicateTo,
          disabled: this._busy,
          onInput: (value) => this._duplicateChanged(value),
        })}
        <ha-button .disabled=${this._busy || !to || to === name} @click=${this._duplicate}>
          ${localize(armed ? 'tools.duplicate_anyway' : 'tools.duplicate', undefined, this.hass)}
        </ha-button>
      </div>
    `;
  }

  private _duplicateChanged(value: string): void {
    this._duplicateTo = value;
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
    const saved = await this._saveDashboard(
      (config) => addCardToView(config, here?.view?.index ?? 0, copy),
      'duplicate',
    );
    if (saved) {
      this._duplicateTo = '';
      this._duplicatePending = undefined;
    }
  }
}

/** The tag the template editor renders this tab as. */
export const USAGES_TAB_TAG = 'decluttering-template-usages-tab';
if (!customElements.get('decluttering-template-usages-tab'))
  customElements.define('decluttering-template-usages-tab', DeclutteringTemplateUsagesTab);
