import { LitElement, html, TemplateResult, CSSResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { HomeAssistant, fireEvent, LovelaceConfig } from 'custom-card-helpers';
import { DeclutteringTemplateConfig, TemplateConfig } from '../types';
import { buildExport, validateImport, freeName, missingCustomCards, withoutSources } from '../share';
import { LIBRARY, libraryEntry, libraryNeeds, librarySource } from '../library';
import {
  COMMUNITY_POST_URL,
  COMMUNITY_REPO,
  CommunityEntry,
  CommunityError,
  CommunityList,
  CommunityRisks,
  communityNeeds,
  communityRisks,
  communitySource,
  fetchCommunity,
  postBody,
  SharedUpdate,
  sharedUpdates,
  stampedTemplate,
  withinBudget,
} from '../community';
import {
  collectTemplates,
  collectAllTemplates,
  addCardToView,
  TEMPLATE_TYPE,
  findTemplateLocation,
  addTemplateToRoot,
  installedFromShared,
  replaceTemplate,
} from '../templates';
import { TrashEntry, loadTrash, restoreTemplate, saveTrash, withoutEntry } from '../trash';
import { copyText, getLovelaceConfig, getLovelacePanel } from '../utils';
import { localize } from '../localize';
import { getDeclarations } from '../variables';
import { VERSION } from '../version';
import { renderDiffWithFull } from '../diff-view';
import {
  SharingForm,
  Unmet,
  applySharingForm,
  authorLine,
  ownDefault,
  setupVariables,
  shareInfo,
  sharingFormData,
  surroundingsOf,
  unmetRequirements,
  withSetup,
} from '../sharing';
import { readDashboard } from '../undo';
import { rewriteDashboards, saverFor } from '../shared';
import { isDefinedHere, anyRisk, newRisks, SECOND_PRESS_MS, saveDashboardWith } from './common';
import { TEMPLATE_EDITOR_STYLES } from './styles';

// The sharing-details fields that need a line of explanation under them.
const DETAIL_HELPERS = ['readme', 'related', 'setup', 'requires_entities', 'requires_homeassistant', 'requires_card'];

export class DeclutteringTemplateShareTab extends LitElement {
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
    return this._renderShare();
  }

  // The Share tab's import box: what has been pasted, whether it parsed, and what is
  // wrong with it. The name clash is held separately because it is a warning the user
  // is allowed to overrule, not a reason to refuse.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _importValue?: any;

  private _importParses = true;

  @state() private _importErrors: string[] = [];

  @state() private _importClash?: string;

  // What a pasted template would be allowed to do, when that is anything: shown by the first
  // press of Import, which then waits for a second. A paste nobody has checked is installed
  // the same way a shared post is, only without the stamp.
  @state() private _importRisks?: CommunityRisks;

  private _importArmedAt = 0;

  @state() private _copyState: '' | 'done' | 'failed' = '';

  @state() public _toolError?: string;

  @state() public _busy = false;

  @state() private _installPending?: string;

  @state() private _librarySelected?: string;

  @state() private _libraryDestination: 'view' | 'root' = 'view';

  // Templates shared on GitHub: nothing until the button is pressed, then the list, and
  // what went wrong if fetching it did.
  @state() private _community?: CommunityList;

  @state() private _communityLoading = false;

  @state() private _communityError?: string;

  @state() private _communitySelected?: number;

  // Every template this dashboard can see, borrowed ones included, so a post cannot install
  // a template under a name that silently takes over one borrowed from another dashboard.
  // Nothing until the other dashboards have been read: until then the install button waits,
  // and if they could not be read it says so and stays off rather than guess.
  @state() private _communityKnown?: string[];

  @state() private _communityKnownFailed = false;

  // When Install was first pressed: the second press has to be a second decision, not the
  // other half of a double-click.
  private _installArmedAt = 0;

  @state() private _postCopyState: '' | 'done' | 'failed' = '';

  // What was typed for the variables a template asks for on install (`setup:`), by name.
  // Cleared whenever a different post is picked or something new is pasted.
  @state() private _setupValues: Record<string, string> = {};

  // Installed shared templates checked against the list: nothing until the button is pressed.
  @state() private _updates?: SharedUpdate[];

  @state() private _updatesLoading = false;

  @state() private _updatesError?: string;

  @state() private _updatePending?: string;

  private _updateArmedAt = 0;

  // Templates a save took away or changed, from the user data; nothing until it has been read.
  @state() private _trash?: TrashEntry[];

  @state() private _trashShown?: number;

  @state() private _trashPending?: number;

  private _trashArmedAt = 0;

  private _unwatchTrash?: () => void;

  private async _loadTrash(): Promise<void> {
    if (!this.hass) return;
    this._trash = await loadTrash(this.hass);
  }

  /*
   * A template is a self-contained block of configuration, so handing one to another
   * person is mostly a matter of writing it out. What does not travel with it - the
   * custom cards it is built from, the other templates it calls - is named above the
   * box, because whoever receives it cannot tell from the YAML alone.
   */
  private _renderShare(): TemplateResult {
    const { payload, notes } = buildExport(this._config, collectTemplates(this._savedLovelace));

    return html`
      <div class="share">
        ${this._renderDetails()}
        <h3>${localize('share.export_header', undefined, this.hass)}</h3>
        <p class="hint">${localize('share.export_hint', undefined, this.hass)}</p>
        ${notes.map((note) => html`<ha-alert alert-type="info">${note}</ha-alert>`)}
        <ha-yaml-editor id="export" .hass=${this.hass} .defaultValue=${payload} read-only></ha-yaml-editor>
        <ha-button @click=${this._copyExport}>
          ${
            this._copyState === 'done'
              ? localize('share.copied', undefined, this.hass)
              : this._copyState === 'failed'
                ? localize('share.copy_failed', undefined, this.hass)
                : localize('share.copy', undefined, this.hass)
          }
        </ha-button>
        <ha-button @click=${this._downloadExport}> ${localize('share.download', undefined, this.hass)} </ha-button>
        <ha-button @click=${this._copyPost}>
          ${
            this._postCopyState === 'done'
              ? localize('share.copied', undefined, this.hass)
              : this._postCopyState === 'failed'
                ? localize('share.copy_failed', undefined, this.hass)
                : localize('share.post_copy', undefined, this.hass)
          }
        </ha-button>
        <p class="hint">
          ${localize('share.post_hint', undefined, this.hass)}
          <a href=${COMMUNITY_POST_URL} target="_blank" rel="noopener noreferrer"
            >${localize('share.post_open', undefined, this.hass)}</a
          >
        </p>

        <h3>${localize('share.import_header', undefined, this.hass)}</h3>
        <p class="hint">${localize('share.import_hint', undefined, this.hass)}</p>
        <ha-yaml-editor id="import" .hass=${this.hass} @value-changed=${this._importChanged}></ha-yaml-editor>
        <input
          id="import-file"
          type="file"
          accept=".yaml,.yml,.json,text/yaml,application/json"
          hidden
          @change=${this._importFile}
        />
        <ha-button @click=${(): void => (this.renderRoot.querySelector('#import-file') as HTMLInputElement)?.click()}>
          ${localize('share.import_file', undefined, this.hass)}
        </ha-button>
        ${this._importErrors.map((error) => html`<ha-alert alert-type="error">${error}</ha-alert>`)}
        ${this._renderImportDetails()}
        ${
          this._importClash
            ? html`<ha-alert alert-type="warning">
                ${localize('share.import_clash', { name: this._importClash }, this.hass)}
              </ha-alert>`
            : html``
        }
        ${this._importRisks ? this._renderRisks(this._importRisks, 'share.import_risks') : html``}
        <ha-button @click=${this._import}>
          ${localize(this._importClash || this._importRisks ? 'share.import_anyway' : 'share.import', undefined, this.hass)}
        </ha-button>
        ${
          this._importClash
            ? html`<ha-button @click=${this._importAsCopy}>
                ${localize('share.import_copy', undefined, this.hass)}
              </ha-button>`
            : html``
        }
        ${this._renderTrash()}

        <h3>${localize('share.library_header', undefined, this.hass)}</h3>
        <p class="hint">${localize('share.library_hint', undefined, this.hass)}</p>
        ${this._renderLibrary()}

        <h3>${localize('share.community_header', undefined, this.hass)}</h3>
        <p class="hint">${localize('share.community_hint', undefined, this.hass)}</p>
        ${this._renderCommunity()} ${this._renderInstalled()}
        ${this._toolError ? html`<ha-alert alert-type="error">${this._toolError}</ha-alert>` : html``}
      </div>
    `;
  }

  /*
   * The sharing details (#345) as a form, so they can be written without YAML. Folded away
   * until wanted: most templates are never shared. Lists offer what is here - this
   * dashboard's templates, this template's variables, the integrations Home Assistant has
   * loaded, the custom cards this browser knows - and take anything typed as well.
   */
  private _renderDetails(): TemplateResult {
    const config = this._config as DeclutteringTemplateConfig;
    const data = sharingFormData(config);
    const options = (values: string[]): { value: string; label: string }[] =>
      [...new Set(values)].sort().map((value) => ({ value, label: value }));
    const list = (values: string[]): Record<string, unknown> => ({
      select: { multiple: true, custom_value: true, options: options(values) },
    });
    const templates = Object.keys(collectTemplates(this._savedLovelace)).filter((name) => name !== config.template);
    const variables = [...getDeclarations(config).map((each) => each.name), ...(data.setup ?? [])];
    const integrations = (Array.isArray(this.hass?.config?.components) ? this.hass.config.components : []).filter(
      (each: string) => !each.includes('.'),
    );
    const cards = ((window as unknown as { customCards?: { type?: unknown }[] }).customCards ?? [])
      .map((each) => each.type)
      .filter((each): each is string => typeof each === 'string');
    const field = (name: keyof SharingForm, selector: Record<string, unknown>): Record<string, unknown> => ({
      name,
      selector,
    });
    const schema = [
      field('author_name', { text: {} }),
      field('author_github', { text: {} }),
      field('author_email', { text: {} }),
      field('author_url', { text: { type: 'url' } }),
      field('license', { text: {} }),
      field('help', { text: { type: 'url' } }),
      field('homepage', { text: { type: 'url' } }),
      field('readme', { text: { multiline: true } }),
      field('related', list(templates)),
      field('setup', list(variables)),
      field('requires_integrations', list(integrations)),
      field('requires_entities', list([])),
      field('requires_custom_cards', list(cards)),
      field('requires_homeassistant', { text: {} }),
      field('requires_card', { text: {} }),
    ];
    return html`
      <ha-expansion-panel outlined class="details">
        <span slot="header">${localize('share.details_header', undefined, this.hass)}</span>
        <p class="hint">${localize('share.details_hint', undefined, this.hass)}</p>
        <ha-form
          .hass=${this.hass}
          .data=${data}
          .schema=${schema}
          .computeLabel=${(each: { name: string }): string => localize(`share.details_${each.name}`, undefined, this.hass)}
          .computeHelper=${(each: { name: string }): string =>
            DETAIL_HELPERS.includes(each.name)
              ? localize(`share.details_${each.name}_helper`, undefined, this.hass)
              : ''}
          @value-changed=${this._detailsChanged}
        ></ha-form>
      </ha-expansion-panel>
    `;
  }

  private _detailsChanged(ev: CustomEvent): void {
    // The tab writes the template itself; the editor's own settings handler must not see this.
    ev.stopPropagation();
    if (!this._config) return;
    const updated = applySharingForm(this._config, ev.detail.value as SharingForm);
    this._fireConfigChanged(updated as DeclutteringTemplateConfig);
  }

  /*
   * The library, but for templates other people have posted. Fetching is the user's call -
   * the button is the only thing that reaches GitHub - and what a post holds is shown in
   * full before anything is installed, because nobody has checked it.
   */
  private _renderCommunity(): TemplateResult {
    const list = this._community;
    const when = (ms: number): string => new Date(ms).toLocaleString(this.hass?.locale?.language);
    const status = html`
      ${this._communityError ? html`<ha-alert alert-type="warning">${this._communityError}</ha-alert>` : html``}
      ${
        this._communityError && list
          ? html`<p class="hint">
              ${localize('share.community_showing_cached', { time: when(list.fetched) }, this.hass)}
            </p>`
          : html``
      }
    `;

    if (!list) {
      return html`
        <div class="library">
          ${status}
          <ha-button .disabled=${this._communityLoading} @click=${(): void => void this._loadCommunity(false)}>
            ${localize(this._communityLoading ? 'share.community_loading' : 'share.community_load', undefined, this.hass)}
          </ha-button>
        </div>
      `;
    }

    const existing = this._communityExisting();
    const entry = list.entries.find((each) => each.id === this._communitySelected);
    // The post as it was when Install was first pressed: an edit in between is a different
    // template, and the preview is drawn again for it (review 2026-10-25).
    const key = entry ? `community:${entry.id}:${entry.updated}` : '';
    const armed = !!entry && this._installPending === key;
    const installAs = entry && existing.includes(entry.name) ? freeName(entry.name, existing) : undefined;
    const needs = entry ? communityNeeds(entry, existing) : undefined;
    const brings = entry ? Object.keys(entry.includes).filter((each) => !existing.includes(each)) : [];
    const risks = entry ? communityRisks(entry) : undefined;
    // Installing needs every name this dashboard can see, and the other dashboards' names
    // arrive after the list. Until they have, nothing is installed; if they never will,
    // nothing is installed either, and the alert says why.
    const namesReady = this._communityKnown !== undefined;

    return html`
      <div class="library">
        ${status}
        ${
          list.entries.length
            ? html`<ha-form
                .hass=${this.hass}
                .data=${{ entry: entry ? String(entry.id) : '' }}
                .schema=${[
                  {
                    name: 'entry',
                    selector: {
                      select: {
                        mode: 'dropdown',
                        options: list.entries.map((each) => ({
                          value: String(each.id),
                          label: localize('share.community_by', { title: each.title, author: each.author }, this.hass),
                        })),
                      },
                    },
                  },
                ]}
                .computeLabel=${(): string => localize('share.community_pick', undefined, this.hass)}
                @value-changed=${this._communityPicked}
              ></ha-form>`
            : html`<p class="hint">${localize('share.community_none', undefined, this.hass)}</p>`
        }
        ${
          entry && needs
            ? html`
                <p class="hint">
                  ${typeof entry.template.description === 'string' ? entry.template.description : ''}
                  <a href=${entry.url} target="_blank" rel="noopener noreferrer"
                    >${localize('share.community_open', undefined, this.hass)}</a
                  >
                </p>
                ${this._renderAbout(entry.template)}
                ${
                  brings.length
                    ? html`<p class="hint">
                        ${localize('share.library_needs', { names: brings.join(', ') }, this.hass)}
                      </p>`
                    : html``
                }
                ${this._renderUnmet([entry.template, ...Object.values(entry.includes)])}
                ${
                  /*
                   * Only the custom cards this browser does not have: the ones it has need
                   * nothing doing, and a second alert listing every custom card the post uses
                   * said the same thing as this one about the missing ones.
                   */
                  this._renderMissingCards([entry.template, ...Object.values(entry.includes)])
                }
                ${
                  needs.templates.length
                    ? html`<ha-alert alert-type="warning">
                        ${localize('share.community_needs_templates', { names: needs.templates.join(', ') }, this.hass)}
                      </ha-alert>`
                    : html``
                }
                ${risks && anyRisk(risks) ? this._renderRisks(risks, 'share.community_risks') : html``}
                ${this._renderSetup([entry.template, ...Object.values(entry.includes)])}
                <ha-expansion-panel outlined expanded>
                  <span slot="header">${localize('share.library_preview', undefined, this.hass)}</span>
                  ${keyed(
                    `${entry.id}:${entry.updated}`,
                    html`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${{
                        template: entry.name,
                        ...entry.template,
                        ...(Object.keys(entry.includes).length ? { includes: entry.includes } : {}),
                      }}
                      read-only
                    ></ha-yaml-editor>`,
                  )}
                </ha-expansion-panel>
                <ha-form
                  .hass=${this.hass}
                  .data=${{ where: this._libraryDestination }}
                  .schema=${[
                    {
                      name: 'where',
                      selector: {
                        select: {
                          mode: 'dropdown',
                          options: [
                            { value: 'view', label: localize('share.library_where_view', undefined, this.hass) },
                            { value: 'root', label: localize('share.library_where_root', undefined, this.hass) },
                          ],
                        },
                      },
                    },
                  ]}
                  .computeLabel=${(): string => localize('share.library_where', undefined, this.hass)}
                  @value-changed=${this._libraryDestinationPicked}
                ></ha-form>
                ${
                  this._communityKnownFailed
                    ? html`<ha-alert alert-type="error">
                        ${localize('share.community_names_failed', undefined, this.hass)}
                      </ha-alert>`
                    : html``
                }
                <ha-button .disabled=${this._busy || !namesReady} @click=${(): void => void this._installShared(entry)}>
                  ${
                    !namesReady && !this._communityKnownFailed
                      ? localize('share.community_names_loading', undefined, this.hass)
                      : armed
                        ? localize('share.install_anyway', undefined, this.hass)
                        : installAs
                          ? localize('share.community_install_as', { name: installAs }, this.hass)
                          : localize('share.install', undefined, this.hass)
                  }
                </ha-button>
              `
            : html``
        }
        <ha-button .disabled=${this._communityLoading} @click=${(): void => void this._loadCommunity(true)}>
          ${localize(this._communityLoading ? 'share.community_loading' : 'share.community_refresh', undefined, this.hass)}
        </ha-button>
      </div>
    `;
  }

  /*
   * What a template says about itself for sharing (#345): who wrote it, its licence, where to
   * read more, and its readme. For a post the author is whatever the YAML says, so it is shown
   * as a credit under the post's own line, which names the account that really posted it.
   */
  private _renderAbout(template: unknown): TemplateResult {
    const info = shareInfo(template);
    const credit = authorLine(info.author);
    const authorLink =
      info.author?.url ?? (info.author?.github ? `https://github.com/${info.author.github}` : undefined);
    const links = [
      info.help ? { url: info.help, label: localize('share.about_help', undefined, this.hass) } : undefined,
      info.homepage ? { url: info.homepage, label: localize('share.about_homepage', undefined, this.hass) } : undefined,
    ].filter((each): each is { url: string; label: string } => !!each);
    if (!credit && !info.license && !links.length && !info.readme) return html``;
    return html`
      ${
        credit || info.license || links.length
          ? html`<p class="hint about">
              ${
                credit
                  ? html`<span
                      >${localize('share.about_author', undefined, this.hass)}
                      ${
                        authorLink
                          ? html`<a href=${authorLink} target="_blank" rel="noopener noreferrer">${credit}</a>`
                          : credit
                      }</span
                    >`
                  : html``
              }
              ${info.license ? html`<span>${localize('share.about_license', { license: info.license }, this.hass)}</span>` : html``}
              ${links.map((link) => html`<a href=${link.url} target="_blank" rel="noopener noreferrer">${link.label}</a>`)}
            </p>`
          : html``
      }
      ${
        info.readme
          ? html`<ha-expansion-panel outlined>
              <span slot="header">${localize('share.about_readme', undefined, this.hass)}</span>
              <ha-markdown class="readme" .content=${info.readme}></ha-markdown>
            </ha-expansion-panel>`
          : html``
      }
    `;
  }

  /*
   * What the templates say they need (`requires:`) that this Home Assistant does not have:
   * integrations, entities, custom cards, versions. Said before installing and never in the
   * way of it, as with the custom cards the scan finds - a card the scan already names as
   * missing is not named twice.
   */
  private _renderUnmet(templates: unknown[]): TemplateResult {
    const present = templates.filter((each) => each !== undefined);
    const scanned = new Set(missingCustomCards(present, isDefinedHere));
    const unmet = unmetRequirements(present, surroundingsOf(this.hass, VERSION, isDefinedHere)).filter(
      (each) => !(each.kind === 'custom_card' && !each.message && each.any.every((tag) => scanned.has(tag))),
    );
    if (!unmet.length) return html``;
    return html`<ha-alert alert-type="warning" .title=${localize('share.requires_header', undefined, this.hass)}>
      <ul class="risks">
        ${unmet.map((each) => html`<li>${this._unmetLine(each)}</li>`)}
      </ul>
      ${localize('share.requires_hint', undefined, this.hass)}
    </ha-alert>`;
  }

  private _unmetLine(unmet: Unmet): string {
    const or = localize('share.requires_or', undefined, this.hass);
    const line = localize(
      `share.requires_${unmet.kind}`,
      { names: unmet.any.join(or), want: unmet.any[0], have: unmet.have ?? '?' },
      this.hass,
    );
    return unmet.message ? `${line}: ${unmet.message}` : line;
  }

  /*
   * The variables the templates ask for on install (`setup:`) - a Frigate address, say - as
   * text boxes filled with what the template has now. What is typed goes into the template's
   * defaults as it is installed, so every card using it starts with the right value.
   */
  private _renderSetup(templates: unknown[]): TemplateResult {
    const present = templates.filter((each) => each !== undefined);
    const asked = setupVariables(present);
    if (!asked.length) return html``;
    const current = (name: string): string => {
      if (name in this._setupValues) return this._setupValues[name];
      for (const template of present) {
        const found = ownDefault(template, name);
        if (found !== undefined) return found;
      }
      return '';
    };
    return html`
      <h4>${localize('share.setup_header', undefined, this.hass)}</h4>
      <p class="hint">${localize('share.setup_hint', undefined, this.hass)}</p>
      <ha-form
        .hass=${this.hass}
        .data=${asked.reduce((data: Record<string, string>, name) => ({ ...data, [name]: current(name) }), {})}
        .schema=${asked.map((name) => ({ name, selector: { text: {} } }))}
        .computeLabel=${(schema: { name: string }): string => schema.name}
        @value-changed=${this._setupChanged}
      ></ha-form>
    `;
  }

  private _setupChanged(ev: CustomEvent): void {
    // Not part of the card's configuration, so it must not reach the settings handler.
    ev.stopPropagation();
    const values: Record<string, string> = {};
    for (const [name, value] of Object.entries((ev.detail.value ?? {}) as Record<string, unknown>)) {
      values[name] = value === undefined || value === null ? '' : String(value);
    }
    this._setupValues = values;
  }

  /*
   * What the installed copy has for each variable its template asks for on install, so an
   * update keeps the values typed then instead of putting the post's back.
   */
  private _keptSetup(installed: unknown): Record<string, string> {
    const kept: Record<string, string> = {};
    for (const name of shareInfo(installed).setup) {
      const value = ownDefault(installed, name);
      if (value !== undefined) kept[name] = value;
    }
    return kept;
  }

  /*
   * What a template nobody here has checked would be allowed to do, under a heading that
   * says what is about to happen to it - install, import or update - so the same list reads
   * right wherever it appears.
   */
  private _renderRisks(risks: CommunityRisks, title: string): TemplateResult {
    return html`<ha-alert alert-type="warning" .title=${localize(title, undefined, this.hass)}>
      <ul class="risks">
        ${
          risks.actions.length
            ? html`<li>${localize('share.community_risk_actions', { list: risks.actions.join(', ') }, this.hass)}</li>`
            : html``
        }
        ${
          risks.urls.length
            ? html`<li>${localize('share.community_risk_urls', { list: risks.urls.join(', ') }, this.hass)}</li>`
            : html``
        }
        ${risks.embeds ? html`<li>${localize('share.community_risk_embeds', undefined, this.hass)}</li>` : html``}
        ${risks.scripts ? html`<li>${localize('share.community_risk_scripts', undefined, this.hass)}</li>` : html``}
        ${
          risks.placeholders
            ? html`<li>${localize('share.community_risk_placeholders', undefined, this.hass)}</li>`
            : html``
        }
        ${risks.overlay ? html`<li>${localize('share.community_risk_overlay', undefined, this.hass)}</li>` : html``}
      </ul>
    </ha-alert>`;
  }

  private async _loadCommunity(refresh: boolean): Promise<void> {
    this._communityLoading = true;
    this._communityError = undefined;
    // A list read again is a list that may have changed: nothing stays armed across it.
    this._installPending = undefined;
    // The names are read again with the list, so a dashboard lent a template since is seen.
    this._communityKnown = undefined;
    this._communityKnownFailed = false;
    try {
      this._community = await fetchCommunity({ refresh });
    } catch (err) {
      const error = err as CommunityError;
      if (error.cached) this._community = error.cached;
      this._communityError = error.retryAt
        ? localize(
            'share.community_rate_limited',
            { time: new Date(error.retryAt).toLocaleTimeString(this.hass?.locale?.language) },
            this.hass,
          )
        : localize('share.community_failed', { message: error.message }, this.hass);
    } finally {
      this._communityLoading = false;
    }
    // A cached list shown after a failed fetch can be installed from too, so it needs the names as much.
    if (this._community) void this._loadCommunityKnown();
  }

  /** This dashboard's templates and the ones it borrows, by name - the borrowed ones once they have been read. */
  private _communityExisting(): string[] {
    const local = Object.keys(collectTemplates(this._savedLovelace));
    return [...new Set([...local, ...(this._communityKnown ?? [])])];
  }

  private async _loadCommunityKnown(): Promise<void> {
    try {
      const all = await collectAllTemplates(this.hass, this._savedLovelace);
      this._communityKnown = Object.keys(all);
    } catch {
      // A dashboard that cannot be read leaves the clash check with half an answer, and an
      // install on half an answer can take over a template it never saw. So no install.
      this._communityKnownFailed = true;
    }
  }

  private _communityPicked(ev: CustomEvent): void {
    // Not part of the card's configuration, so it must not reach the settings handler.
    ev.stopPropagation();
    const picked = Number((ev.detail.value as { entry?: string }).entry);
    this._communitySelected = Number.isFinite(picked) && picked > 0 ? picked : undefined;
    this._installPending = undefined;
    this._setupValues = {};
  }

  /*
   * Installs a shared template the way the library installs one, asked twice. A name this
   * dashboard already uses is not overwritten: the template goes in under the first free
   * spelling instead. Templates it carries go in beside it unless they are already here.
   */
  private async _installShared(entry: CommunityEntry): Promise<void> {
    // The button is off until the names are in, but a press is checked here as well.
    if (this._communityKnown === undefined) return;
    const key = `community:${entry.id}:${entry.updated}`;
    if (this._installPending !== key) {
      this._installPending = key;
      this._installArmedAt = Date.now();
      return;
    }
    if (Date.now() - this._installArmedAt < SECOND_PRESS_MS) return;

    const panel = getLovelacePanel();
    const existing = this._communityExisting();
    const name = existing.includes(entry.name) ? freeName(entry.name, existing) : entry.name;
    /*
     * Each one is stamped with the post it came from and when that post was last edited,
     * so the Share tab can offer a newer version later. The name it has in the post is kept
     * too: it is not always the name it goes in under, and a post can carry several.
     */
    const wanted: [string, Record<string, unknown>][] = [
      ...Object.entries(entry.includes)
        .filter(([each]) => !existing.includes(each))
        .map(([each, template]): [string, Record<string, unknown>] => [
          each,
          stampedTemplate(withSetup(template, this._setupValues), communitySource(entry, each)),
        ]),
      [name, stampedTemplate(withSetup(entry.template, this._setupValues), communitySource(entry, entry.name))],
    ];
    const here = findTemplateLocation(panel?.config ?? this.lovelace, this._config?.template ?? '');
    const view = here?.view?.index ?? 0;

    const saved = await this._saveDashboard(
      (config) =>
        wanted.reduce(
          (built, [each, template]) =>
            this._libraryDestination === 'root'
              ? addTemplateToRoot(built, each, template as TemplateConfig)
              : // Name and type lead, as on any template card, and nothing in the post overrides them.
                addCardToView(
                  built,
                  view,
                  Object.assign({ type: TEMPLATE_TYPE, template: each }, template, {
                    type: TEMPLATE_TYPE,
                    template: each,
                  }),
                ),
          config,
        ),
      'community_install',
    );
    if (saved) {
      this._installPending = undefined;
      this._setupValues = {};
    }
  }

  /*
   * The custom cards a template needs that this browser does not have. Said before the
   * install rather than after, and never in the way of it: installing the template may be
   * the first step of setting the card up.
   */
  private _renderMissingCards(templates: unknown[]): TemplateResult {
    const missing = missingCustomCards(
      templates.filter((each) => each !== undefined),
      isDefinedHere,
    );
    if (!missing.length) return html``;
    return html`<ha-alert alert-type="warning">
      ${localize(
        missing.length === 1 ? 'share.missing_card_one' : 'share.missing_card_many',
        { cards: missing.join(', ') },
        this.hass,
      )}
    </ha-alert>`;
  }

  /*
   * Templates installed from the shared list, and whether their posts have changed since.
   * Only the button asks GitHub, as with loading the list: a dashboard never reaches the
   * internet just because somebody opened this tab.
   */
  private _renderInstalled(): TemplateResult {
    const installed = installedFromShared(this._savedLovelace);
    if (!installed.length) return html``;
    const found = new Map((this._updates ?? []).map((each) => [each.name, each]));
    return html`
      <h3>${localize('share.installed_header', undefined, this.hass)}</h3>
      <p class="hint">${localize('share.installed_hint', undefined, this.hass)}</p>
      ${this._updatesError ? html`<ha-alert alert-type="warning">${this._updatesError}</ha-alert>` : html``}
      <ul class="installed">
        ${installed.map(({ name, source, template }) => {
          const update = found.get(name);
          return html`<li>
            ${name} —
            <a
              href=${update?.entry?.url ?? `https://github.com/${COMMUNITY_REPO}/discussions/${source.discussion}`}
              target="_blank"
              rel="noopener noreferrer"
              >${localize('share.installed_from', { discussion: source.discussion }, this.hass)}</a
            >
            ${
              update
                ? html`<span class="status"
                    >${localize(`share.installed_status_${update.status}`, undefined, this.hass)}</span
                  >`
                : html``
            }
            ${update?.status === 'update' && update.latest ? this._renderUpdate(name, template, update) : html``}
          </li>`;
        })}
      </ul>
      <ha-button .disabled=${this._updatesLoading} @click=${(): void => void this._checkUpdates()}>
        ${localize(this._updatesLoading ? 'share.community_loading' : 'share.installed_check', undefined, this.hass)}
      </ha-button>
    `;
  }

  /*
   * What updating would change, before it does. The two versions are shown one above the
   * other for now; a line-by-line comparison would read better, and is the thing to swap
   * in here once there is one.
   *
   * The post's new version is as unchecked as the post was, and an edit is exactly where a
   * tile labelled "Lights" grows a lock service. So it gets the same risk scan an install
   * does - narrowed to what is new against the installed copy, since that is what the person
   * has not already said yes to, and the whole list when nothing is new but something is there.
   */
  private _renderUpdate(name: string, installed: TemplateConfig, update: SharedUpdate): TemplateResult {
    // The values typed for its setup variables at install stay; the rest is the post's.
    const latest = withSetup(update.latest as Record<string, unknown>, this._keptSetup(installed));
    // Where it came from is bookkeeping, and differs by definition - it is not what changed.
    const bare = (template: Record<string, unknown>): Record<string, unknown> => {
      const copy = { ...template };
      delete copy.source;
      delete copy.type;
      delete copy.template;
      return copy;
    };
    const was = bare(installed as Record<string, unknown>);
    const now = bare(latest);
    const risks = communityRisks({ template: now, includes: {} });
    const added = newRisks(risks, communityRisks({ template: was, includes: {} }));
    const armed = this._updatePending === name;
    return html`
      <p class="hint">${localize('share.installed_compare', undefined, this.hass)}</p>
      ${renderDiffWithFull(was, now, this.hass)} ${this._renderMissingCards([latest])} ${this._renderUnmet([latest])}
      ${
        anyRisk(added)
          ? this._renderRisks(added, 'share.installed_risks_new')
          : anyRisk(risks)
            ? this._renderRisks(risks, 'share.installed_risks')
            : html``
      }
      ${
        armed
          ? html`<ha-alert alert-type="warning">
              ${localize('share.installed_update_confirm', { name }, this.hass)}
            </ha-alert>`
          : html``
      }
      <ha-button .disabled=${this._busy} @click=${(): void => void this._updateShared(name, latest)}>
        ${localize(armed ? 'share.installed_update_anyway' : 'share.installed_update', undefined, this.hass)}
      </ha-button>
    `;
  }

  private async _checkUpdates(): Promise<void> {
    this._updatesLoading = true;
    this._updatesError = undefined;
    this._updatePending = undefined;
    const installed = installedFromShared(this._savedLovelace);
    try {
      // Fresh, not from the cache: the question is whether anything changed since.
      this._updates = sharedUpdates(installed, await fetchCommunity({ refresh: true }));
    } catch (err) {
      const error = err as CommunityError;
      this._updatesError = error.retryAt
        ? localize(
            'share.community_rate_limited',
            { time: new Date(error.retryAt).toLocaleTimeString(this.hass?.locale?.language) },
            this.hass,
          )
        : localize('share.community_failed', { message: error.message }, this.hass);
    } finally {
      this._updatesLoading = false;
    }
  }

  /*
   * Replaces the installed template with the post's, wherever it is defined, asked twice.
   * The cards using it still name it and are not touched; what is lost is any change made
   * to this copy of the template since it was installed, which the confirmation says.
   */
  private async _updateShared(name: string, latest: Record<string, unknown>): Promise<void> {
    if (this._updatePending !== name) {
      this._updatePending = name;
      this._updateArmedAt = Date.now();
      return;
    }
    if (Date.now() - this._updateArmedAt < SECOND_PRESS_MS) return;
    const saved = await this._saveDashboard((config) => replaceTemplate(config, name, latest), 'shared_update');
    if (!saved) return;
    this._updatePending = undefined;
    this._updates = this._updates?.map((each) => (each.name === name ? { ...each, status: 'current' } : each));
    // The dialog may be open on this very template, and saving it would put the old one back.
    if (this._config?.template === name) {
      this._fireConfigChanged({ ...latest, type: this._config.type, template: name } as DeclutteringTemplateConfig);
    }
  }

  /*
   * The hard part of this card has never been the syntax - it is the blank page. These are
   * carried in the bundle rather than fetched, so a dashboard never has to reach the
   * internet to show one, and nobody has to think about what it is talking to.
   */
  private _renderLibrary(): TemplateResult {
    const existing = Object.keys(collectTemplates(this._savedLovelace));
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
                ${this._renderMissingCards(
                  [entry, ...needs.map((each) => libraryEntry(each))].map((each) => each?.template),
                )}
                <ha-expansion-panel outlined>
                  <span slot="header">${localize('share.library_preview', undefined, this.hass)}</span>
                  ${keyed(
                    entry.name,
                    // ha-yaml-editor reads defaultValue once, so a new entry needs a new box.
                    html`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${entry.template}
                      read-only
                    ></ha-yaml-editor>`,
                  )}
                </ha-expansion-panel>
                <ha-form
                  .hass=${this.hass}
                  .data=${{ where: this._libraryDestination }}
                  .schema=${[
                    {
                      name: 'where',
                      selector: {
                        select: {
                          mode: 'dropdown',
                          options: [
                            { value: 'view', label: localize('share.library_where_view', undefined, this.hass) },
                            { value: 'root', label: localize('share.library_where_root', undefined, this.hass) },
                          ],
                        },
                      },
                    },
                  ]}
                  .computeLabel=${(): string => localize('share.library_where', undefined, this.hass)}
                  @value-changed=${this._libraryDestinationPicked}
                ></ha-form>
                <ha-button .disabled=${this._busy || already} @click=${(): void => void this._install(entry.name)}>
                  ${localize(
                    already ? 'share.already_here' : armed ? 'share.install_anyway' : 'share.install',
                    undefined,
                    this.hass,
                  )}
                </ha-button>
              `
            : html``
        }
      </div>
    `;
  }

  private _libraryDestinationPicked(ev: CustomEvent): void {
    ev.stopPropagation();
    const where = (ev.detail.value as { where?: string }).where;
    this._libraryDestination = where === 'root' ? 'root' : 'view';
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
    const existing = Object.keys(collectTemplates(panel?.config ?? this._savedLovelace));
    // What it calls comes with it, or the card it adds would point at a name that is not
    // there. Anything already on the dashboard is left exactly as it is.
    const wanted = [...libraryNeeds(entry, existing), entry.name].filter((each) => !existing.includes(each));
    const here = findTemplateLocation(panel?.config ?? this.lovelace, this._config?.template ?? '');
    const view = here?.view?.index ?? 0;

    const saved = await this._saveDashboard(
      (config) =>
        wanted.reduce((built, each) => {
          const one = libraryEntry(each);
          if (!one) return built;
          // Where it lands is the user's choice: a template card on this view, which is
          // visible and editable in place, or the dashboard's decluttering_templates block,
          // which keeps the view clean.
          // Stamped with the entry and this card's version, so it is known where it came from.
          const stamped = { ...one.template, source: librarySource(one.name, VERSION) };
          return this._libraryDestination === 'root'
            ? addTemplateToRoot(built, one.name, stamped as TemplateConfig)
            : addCardToView(built, view, { type: TEMPLATE_TYPE, template: one.name, ...stamped });
        }, config),
      'library_install',
    );
    if (saved) this._installPending = undefined;
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

  /*
   * The same export, written as a GitHub discussion post: what it is, what it needs, and
   * the YAML in a code block - which is exactly what the shared-templates list reads back.
   */
  private async _copyPost(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const yaml = (this.renderRoot.querySelector('#export') as any)?.yaml;
    if (!yaml) return;
    const { notes } = buildExport(this._config, collectTemplates(this._savedLovelace));
    this._postCopyState = (await copyText(postBody(yaml, notes, this._config?.description))) ? 'done' : 'failed';
    setTimeout(() => (this._postCopyState = ''), 3000);
  }

  /* The export as a file, for keeping or sending - the same text Copy gives. */
  private _downloadExport(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const yaml = (this.renderRoot.querySelector('#export') as any)?.yaml;
    if (!yaml) return;
    const { notes } = buildExport(this._config);
    const text = [...notes.map((note) => `# ${note}`), yaml].join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([text], { type: 'text/yaml' }));
    link.download = `${(this._config?.template ?? 'template').replace(/[^\w-]+/g, '_')}.yaml`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  /*
   * A file read into the import box, as if it had been pasted. The box's own editor parses
   * it, so a file and a paste are read by the same YAML parser Home Assistant uses.
   */
  private async _importFile(ev: Event): Promise<void> {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    const text = await file.text();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const code = (this.renderRoot.querySelector('#import') as any)?.shadowRoot?.querySelector('ha-code-editor');
    if (!code) {
      this._importErrors = [localize('share.import_not_yaml', undefined, this.hass)];
      return;
    }
    code.value = text;
    code.dispatchEvent(new CustomEvent('value-changed', { detail: { value: text } }));
  }

  /*
   * Templates a save took away or changed, newest first: one press restores, and a second is
   * asked for only when the name is in use again on that dashboard, since then something
   * else gets replaced - and goes in here in turn.
   */
  private _renderTrash(): TemplateResult {
    if (this._trash === undefined) {
      void this._loadTrash();
      return html``;
    }
    const when = (ms: number): string => new Date(ms).toLocaleString(this.hass?.locale?.language);
    return html`
      <h3>${localize('share.trash_header', undefined, this.hass)}</h3>
      <p class="hint">${localize('share.trash_hint', undefined, this.hass)}</p>
      ${
        this._trash.length
          ? html`<ul class="installed trash">
              ${this._trash.map(
                (entry, index) => html`
                  <li>
                    <strong>${entry.name}</strong>
                    <div class="status">
                      ${localize(
                        entry.reason === 'removed' ? 'share.trash_removed' : 'share.trash_replaced',
                        { when: when(entry.at), dashboard: entry.dashboard },
                        this.hass,
                      )}
                    </div>
                    ${
                      this._trashPending === index
                        ? html`<ha-alert alert-type="warning">
                            ${localize('share.trash_clash', { name: entry.name }, this.hass)}
                          </ha-alert>`
                        : html``
                    }
                    <ha-button .disabled=${this._busy} @click=${(): Promise<void> => this._restore(entry, index)}>
                      ${localize(this._trashPending === index ? 'share.trash_restore_anyway' : 'share.trash_restore', undefined, this.hass)}
                    </ha-button>
                    <ha-button
                      @click=${(): void => {
                        this._trashShown = this._trashShown === index ? undefined : index;
                      }}
                    >
                      ${localize(this._trashShown === index ? 'share.trash_hide' : 'share.trash_show', undefined, this.hass)}
                    </ha-button>
                    <ha-button .disabled=${this._busy} @click=${(): Promise<void> => this._forget(entry)}>
                      ${localize('share.trash_forget', undefined, this.hass)}
                    </ha-button>
                    ${
                      this._trashShown === index
                        ? html`<ha-yaml-editor
                            .hass=${this.hass}
                            .defaultValue=${entry.template}
                            read-only
                          ></ha-yaml-editor>`
                        : html``
                    }
                  </li>
                `,
              )}
            </ul>`
          : html`<p class="hint">${localize('share.trash_empty', undefined, this.hass)}</p>`
      }
    `;
  }

  private async _restore(entry: TrashEntry, index: number): Promise<void> {
    if (!this.hass) return;
    const saver = saverFor(this.hass);
    let current: unknown;
    try {
      current = await readDashboard(saver, entry.dashboard);
    } catch (err) {
      this._toolError = localize('tools.save_failed', { message: (err as Error)?.message ?? err }, this.hass);
      return;
    }
    const clash = entry.name in collectTemplates(current as LovelaceConfig);
    if (clash && this._trashPending !== index) {
      this._trashPending = index;
      this._trashArmedAt = Date.now();
      return;
    }
    if (clash && Date.now() - this._trashArmedAt < SECOND_PRESS_MS) return;
    this._busy = true;
    this._toolError = undefined;
    try {
      await rewriteDashboards(this, this.hass, 'restore', [
        { urlPath: entry.dashboard, build: (config) => restoreTemplate(config, entry) },
      ]);
      this._trashPending = undefined;
      this._trashShown = undefined;
      await this._forget(entry);
    } catch (err) {
      this._toolError = localize('tools.save_failed', { message: (err as Error)?.message ?? err }, this.hass);
    } finally {
      this._busy = false;
    }
  }

  private async _forget(entry: TrashEntry): Promise<void> {
    if (!this.hass) return;
    // Read fresh: the save a restore just made may have put the replaced version in.
    const trash = withoutEntry(await loadTrash(this.hass), entry);
    await saveTrash(this.hass, trash);
    this._trash = trash;
    this._trashPending = undefined;
  }

  /*
   * A paste that reads as a template gets what a shared post gets before it goes in: who
   * wrote it, what it needs that is not here, and the values it asks for.
   */
  private _renderImportDetails(): TemplateResult {
    const value = this._importValue;
    if (!this._importParses || !value || typeof value !== 'object' || Array.isArray(value)) return html``;
    if (!withinBudget(value)) return html``;
    const includes =
      value.includes && typeof value.includes === 'object' && !Array.isArray(value.includes)
        ? Object.values(value.includes)
        : [];
    const templates = [value, ...includes];
    return html`${this._renderAbout(value)} ${this._renderUnmet(templates)} ${this._renderSetup(templates)}`;
  }

  private _importChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    this._importValue = ev.detail.value;
    this._importParses = ev.detail.isValid !== false;
    this._importErrors = [];
    this._importClash = undefined;
    this._importRisks = undefined;
    this._setupValues = {};
  }

  /*
   * Imports what was pasted, asked twice when there is anything to ask about: a name this
   * dashboard already has, or anything the template would be allowed to do - the same scan
   * a shared post gets, since a paste is a post that arrived by another route. Both are said
   * on the first press, together, and the second press goes ahead. A plain paste of a plain
   * template is still one press.
   */
  private _import(): void {
    if (!this._config) return;

    if (!this._importParses) {
      this._importErrors = [localize('share.import_not_yaml', undefined, this.hass)];
      return;
    }
    // A paste gets the same ceiling as a post: the editor hands aliases over as shared
    // objects, and a scan of them is the copy that unfolds every one (review 2026-10-25).
    if (!withinBudget(this._importValue)) {
      this._importErrors = [localize('share.import_too_big', undefined, this.hass)];
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
    const existing = collectTemplates(this._savedLovelace);
    const clash = name !== this._config.template && name in existing ? name : undefined;
    // The includes sit inside the pasted value, so the walk over it takes them in too.
    const risks = communityRisks({ template: this._importValue, includes: {} });
    if ((clash && !this._importClash) || (anyRisk(risks) && !this._importRisks)) {
      this._importClash = clash;
      this._importRisks = anyRisk(risks) ? risks : undefined;
      this._importArmedAt = Date.now();
      return;
    }
    if (Date.now() - this._importArmedAt < SECOND_PRESS_MS) return;

    this._applyImport(name);
  }

  /*
   * The other way out of a name clash: keep both, under the first free spelling of the
   * name. What arrives is the same template - only its name changes.
   */
  private _importAsCopy(): void {
    if (!this._config || !this._importParses) return;
    // Only offered after the first press, which has already said what there is to say.
    if (Date.now() - this._importArmedAt < SECOND_PRESS_MS) return;
    const existing = Object.keys(collectTemplates(this._savedLovelace));
    this._applyImport(freeName(this._importValue.template, existing));
  }

  private _applyImport(name: string): void {
    /*
     * A paste is not an install from the shared list, whatever it says about itself: a
     * `source:` stamp in it would point Check for updates at a post of the paster's choosing,
     * so it comes off the template and off everything it carries before any of it is kept.
     */
    const pasted = withoutSources(this._importValue);
    // The values typed for what it asks on install go into its defaults, and those of what it carries.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value: any = withSetup(pasted, this._setupValues);
    if (value.includes && typeof value.includes === 'object' && !Array.isArray(value.includes)) {
      value.includes = Object.entries(value.includes).reduce(
        (all: Record<string, unknown>, [each, template]) => ({
          ...all,
          [each]:
            template && typeof template === 'object' && !Array.isArray(template)
              ? withSetup(template as Record<string, unknown>, this._setupValues)
              : template,
        }),
        {},
      );
    }
    /*
     * A bundle carries the templates this one uses under `includes:`. The ones this
     * dashboard does not have yet land in decluttering_templates, so the imported
     * template works on arrival; the ones it already has are left exactly as they are.
     */
    const includes = value.includes;
    if (includes && typeof includes === 'object' && !Array.isArray(includes)) {
      const existing = Object.keys(collectTemplates(this._savedLovelace));
      const wanted = Object.entries(includes).filter(([each]) => !existing.includes(each));
      if (wanted.length) {
        void this._saveDashboard(
          (config) =>
            wanted.reduce(
              (built, [each, template]) => addTemplateToRoot(built, each, template as TemplateConfig),
              config,
            ),
          'import',
          // The import also replaces what the dialog holds, so an undo puts that back too.
          this._config,
        );
      }
    }

    // Keep the card's own type: the export may have come from the legacy tag, and which
    // tag this card uses is a property of where it lives, not of what was shared.
    const applied = { ...value, template: name, type: this._config?.type };
    delete applied.includes;
    this._fireConfigChanged(applied);
    this._importClash = undefined;
    this._importRisks = undefined;
    this._setupValues = {};
    this.dispatchEvent(new CustomEvent('select-tab', { detail: 'settings', bubbles: true, composed: true }));
  }
}

/** The tag the template editor renders this tab as. */
export const SHARE_TAB_TAG = 'decluttering-template-share-tab';
if (!customElements.get('decluttering-template-share-tab'))
  customElements.define('decluttering-template-share-tab', DeclutteringTemplateShareTab);
