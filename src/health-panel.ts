import { LitElement, html, TemplateResult, css, CSSResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceConfig } from 'custom-card-helpers';
import { TemplateConfig } from './types';
import {
  collectTemplates,
  collectAllTemplates,
  mayBorrowTemplates,
  checkDashboard,
  extendsLoops,
  deprecatedInUse,
  borrowedTemplateSources,
} from './templates';
import { checkExamples } from './examples';
import { localize, onLanguageLoaded } from './localize';
import { checkUnreadVariables } from './unread';
import { olderElsewhere, renameVariableOnCards, withVersionNotes } from './version-check';
import { pageDashboard, rewriteDashboards } from './shared';
import { BUILD_LOG, slowestBuilds } from './trace';
import { STATS_SNAPSHOT_KEY, StatsSnapshot, buildStats, snapshotOf, sortRows, statsAsMarkdown } from './stats';
import { warnings } from './warnings';
import { copyText } from './utils';

/*
 * Dashboard health, as its own element so the template editor's Where used tab and the card
 * editor can both show it (discussion #215). Anything given as content - the template
 * editor's undo - is drawn at the top of the panel.
 */
export class DeclutteringHealthPanel extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public lovelace?: LovelaceConfig | null;
  /** Open from the start: the health card's "Open the full panel" dialog has nothing else to show. */
  @property({ type: Boolean }) public expanded = false;

  // Stops listening for a language chunk landing (idea 4).
  private _stopLanguageListener?: () => void;

  public connectedCallback(): void {
    super.connectedCallback();
    this._stopLanguageListener ??= onLanguageLoaded(() => this.requestUpdate());
    window.addEventListener('pagehide', this._writeSnapshot);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopLanguageListener?.();
    this._stopLanguageListener = undefined;
    window.removeEventListener('pagehide', this._writeSnapshot);
  }

  // The templates this dashboard borrows: their names for the missing-template check, and
  // the templates themselves so a card using one can be checked for variables it never reads.
  @state() private _borrowed?: { ll: unknown; names?: string[]; templates?: Record<string, TemplateConfig> };
  // Every example on the dashboard built once per dashboard config, not on every render -
  // the panel re-renders on each state change Home Assistant sends.
  private _examplesChecked?: { ll: unknown; borrowed?: string[]; failed: ReturnType<typeof checkExamples> };
  // What the lenders wrote, for the version comparison (idea 43); fetched once per dashboard config.
  @state() private _lenders?: { ll: unknown; templates: Record<string, TemplateConfig>; from: Record<string, string> };

  static get styles(): CSSResult {
    return css`
      /* Code stays left to right inside a right-to-left sentence. */
      code {
        direction: ltr;
        unicode-bidi: isolate;
      }
      :host {
        display: block;
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
      .timings-header {
        margin: 16px 0 4px;
      }
      .timings {
        margin: 0 0 8px;
        padding-inline-start: 20px;
        font-size: 0.9em;
      }
      .timings-header small {
        color: var(--secondary-text-color);
        font-weight: 400;
        margin-inline-start: 6px;
      }
      .kpis {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 8px;
        margin: 0 0 12px;
      }
      .kpis div {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 8px 10px;
      }
      .kpis b {
        display: block;
        font-size: 1.4em;
        font-weight: 400;
      }
      .kpis small {
        color: var(--secondary-text-color);
      }
      table.stats {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9em;
      }
      table.stats th {
        text-align: start;
        font-weight: 500;
        color: var(--secondary-text-color);
        padding: 6px 8px;
        border-bottom: 1px solid var(--divider-color);
      }
      table.stats th.sortable {
        cursor: pointer;
      }
      table.stats th[aria-sort='descending'] {
        color: var(--primary-text-color);
      }
      table.stats td {
        padding: 6px 8px;
        border-bottom: 1px solid var(--divider-color);
        vertical-align: top;
      }
      table.stats td.num {
        text-align: end;
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
      }
      .bar {
        display: inline-block;
        height: 8px;
        border-radius: 2px;
        background: var(--primary-color);
        vertical-align: middle;
        margin-inline-end: 6px;
      }
      .bar.slow {
        background: var(--warning-color, #ffa600);
      }
      td.trend {
        font-family: var(--ha-font-family-code, monospace);
        font-size: 0.9em;
        white-space: nowrap;
      }
      td.trend.up {
        color: var(--error-color, #db4437);
      }
      td.trend.down {
        color: var(--success-color, #43a047);
      }
      td.trend small {
        font-family: var(--ha-font-family, inherit);
        color: var(--secondary-text-color);
        margin-inline-start: 4px;
      }
    `;
  }

  /*
   * Everything the console would have muttered about this dashboard, in one place: cards
   * pointing at templates that are not there, cards leaving variables unset, templates
   * nothing uses. The sweep is cheap and honest, so it simply runs.
   */
  protected render(): TemplateResult {
    const ll = this.lovelace;
    // A dashboard that borrows templates has names defined elsewhere, and the sweep must
    // know them or every card using one is reported as pointing at nothing. Fetched once
    // per dashboard config; until it lands, "does not exist" is held back rather than said.
    const borrowing = mayBorrowTemplates(ll);
    if (borrowing && this._borrowed?.ll !== ll) {
      this._borrowed = { ll };
      const local = new Set(Object.keys(collectTemplates(ll)));
      void collectAllTemplates(this.hass, ll).then((all) => {
        if (this._borrowed?.ll === ll) {
          this._borrowed = { ll, names: Object.keys(all).filter((name) => !local.has(name)), templates: all };
        }
      });
    }
    if (borrowing && this._lenders?.ll !== ll) {
      this._lenders = { ll, templates: {}, from: {} };
      void borrowedTemplateSources(this.hass, ll).then((lent) => {
        if (this._lenders?.ll === ll) this._lenders = { ll, ...lent };
      });
    }
    const older = this._lenders
      ? olderElsewhere(collectTemplates(ll), this._lenders.templates, this._lenders.from)
      : [];
    const pending = borrowing && !this._borrowed?.names;
    const full = checkDashboard(ll, borrowing ? (this._borrowed?.names ?? []) : []);
    const report = pending ? { ...full, missingTemplates: [] } : full;
    const loops = extendsLoops(ll);
    const retired = deprecatedInUse(ll);
    // Held back, like a missing template, until the borrowed names are known.
    const lent = this._borrowed?.names;
    const checked = this._examplesChecked;
    if (!pending && (checked?.ll !== ll || checked?.borrowed !== lent)) {
      this._examplesChecked = {
        ll,
        borrowed: lent,
        failed: checkExamples(collectTemplates(ll), lent ?? [], this.hass),
      };
    }
    const failedExamples = pending ? [] : (this._examplesChecked?.failed ?? []);
    const known = this._borrowed?.templates ?? collectTemplates(ll);
    // Each finding carries the change note that explains it, when its template keeps one (idea 43).
    const unread = withVersionNotes(checkUnreadVariables(ll, known), known);
    const healthy =
      !report.missingTemplates.length &&
      !report.unsetVariables.length &&
      !report.unusedTemplates.length &&
      !loops.length &&
      !retired.length &&
      !failedExamples.length &&
      !unread.length &&
      !older.length;
    return html`
      <ha-expansion-panel outlined .expanded=${this.expanded}>
        <span slot="header">${localize('tools.health_header', undefined, this.hass)}</span>
        <slot></slot>
        ${
          healthy
            ? html`<p class="hint">${localize('tools.health_ok', undefined, this.hass)}</p>`
            : html`
                ${failedExamples.map(
                  (each) =>
                    html`<ha-alert alert-type="error">
                      ${localize(
                        'tools.health_example',
                        { template: each.template, number: each.example, problems: each.problems.join(' ') },
                        this.hass,
                      )}
                    </ha-alert>`,
                )}
                ${loops.map(
                  (loop) =>
                    html`<ha-alert alert-type="error">
                      ${localize('tools.health_extends_loop', { path: loop.join(' → ') }, this.hass)}
                    </ha-alert>`,
                )}
                ${report.missingTemplates.map(
                  (each) =>
                    html`<ha-alert alert-type="error">
                      ${localize('tools.health_missing', { template: each.template, count: each.count }, this.hass)}${
                        each.closest ? localize('error.did_you_mean', { closest: each.closest }, this.hass) : ''
                      }
                    </ha-alert>`,
                )}
                ${report.unsetVariables.map(
                  (each) =>
                    html`<ha-alert alert-type="warning">
                      ${localize(
                        'tools.health_unset',
                        { template: each.template, names: each.names.join(', '), count: each.count },
                        this.hass,
                      )}
                    </ha-alert>`,
                )}
                ${retired.map((each) => {
                  const uses = [
                    ...each.views.map((view) =>
                      localize(
                        'tools.health_view_uses',
                        {
                          view: view.title || localize('template_editor.untitled_view', undefined, this.hass),
                          count: view.count,
                        },
                        this.hass,
                      ),
                    ),
                    ...each.templates.map((name) => localize('tools.health_template_uses', { name }, this.hass)),
                  ].join(', ');
                  return html`<ha-alert alert-type="warning">
                    ${
                      each.message
                        ? localize(
                            'tools.health_deprecated_because',
                            { template: each.template, message: each.message, uses },
                            this.hass,
                          )
                        : localize('tools.health_deprecated', { template: each.template, uses }, this.hass)
                    }
                  </ha-alert>`;
                })}
                ${unread.map(
                  (each) =>
                    html`<ha-alert alert-type="warning">
                      ${localize(
                        'tools.health_unread',
                        {
                          template: each.template,
                          name: each.name,
                          count: each.count,
                          view:
                            each.view.title ||
                            each.view.path ||
                            localize('template_editor.untitled_view', undefined, this.hass),
                        },
                        this.hass,
                      )}${
                        each.where === 'variables'
                          ? ''
                          : localize(`tools.health_unread_${each.where}`, undefined, this.hass)
                      }${each.closest ? localize('error.did_you_mean', { closest: each.closest }, this.hass) : ''}${
                        each.since
                          ? localize(
                              'tools.health_dropped_since',
                              { version: each.since.version, note: each.since.note },
                              this.hass,
                            )
                          : ''
                      }
                      ${
                        each.since?.replacement
                          ? html`<ha-button
                              slot="action"
                              @click=${() =>
                                this._renameOnCards(
                                  each.view.index,
                                  each.template,
                                  each.name,
                                  each.since?.replacement ?? '',
                                )}
                            >
                              ${localize('tools.health_rename_to', { name: each.since.replacement }, this.hass)}
                            </ha-button>`
                          : ''
                      }
                    </ha-alert>`,
                )}
                ${older.map(
                  (each) =>
                    html`<ha-alert alert-type="info">
                      ${localize(
                        'tools.health_older_elsewhere',
                        { template: each.template, dashboard: each.dashboard, here: each.here, there: each.there },
                        this.hass,
                      )}
                    </ha-alert>`,
                )}
                ${
                  report.unusedTemplates.length
                    ? html`<ha-alert alert-type="info">
                        ${localize('tools.health_unused', { names: report.unusedTemplates.join(', ') }, this.hass)}
                      </ha-alert>`
                    : html``
                }
              `
        }
        ${this._renderTimings()} ${this._renderStats()} ${this._renderSaid()}
      </ha-expansion-panel>
    `;
  }

  /** The health panel's one-click rename (idea 43): every card of that template on that view, undoable from the toast. */
  private _renameOnCards(view: number, template: string, from: string, to: string): void {
    if (!to) return;
    void rewriteDashboards(this, this.hass, 'rename_variable', [
      { urlPath: pageDashboard(), build: (ll) => renameVariableOnCards(ll, view, template, from, to) },
    ]);
  }

  /*
   * Which templates the page has spent its time building, since it loaded. A slow
   * dashboard is otherwise a guess at which of forty cards is the heavy one; every card
   * notes its build as it goes, so this only has to read the list back. Nothing here is
   * kept past the page.
   */
  private _renderTimings(): TemplateResult {
    const entries = BUILD_LOG.entries();
    const ms = (value: number): string => value.toFixed(1);
    const header = html`<h4 class="timings-header">${localize('tools.timings_header', undefined, this.hass)}</h4>`;
    if (!entries.length) {
      return html`${header}
        <p class="hint">${localize('tools.timings_none', undefined, this.hass)}</p>`;
    }
    const { byTotal, byMax, repeats } = slowestBuilds(entries);
    return html`
      ${header}
      <p class="hint">${localize('tools.timings_hint', { count: entries.length }, this.hass)}</p>
      <p class="hint">${localize('tools.timings_by_total', undefined, this.hass)}</p>
      <ul class="timings">
        ${byTotal.map(
          (each) =>
            html`<li>
              ${localize(
                each.builds === 1 ? 'tools.timings_total_row_one' : 'tools.timings_total_row',
                { template: each.template, total: ms(each.total), builds: each.builds, max: ms(each.max) },
                this.hass,
              )}
            </li>`,
        )}
      </ul>
      <p class="hint">${localize('tools.timings_by_max', undefined, this.hass)}</p>
      <ul class="timings">
        ${byMax.map(
          (each) =>
            html`<li>
              ${localize('tools.timings_max_row', { template: each.template, max: ms(each.max) }, this.hass)}
            </li>`,
        )}
      </ul>
      ${
        repeats.length
          ? html`
              <p class="hint">${localize('tools.timings_repeats', undefined, this.hass)}</p>
              <ul class="timings">
                ${repeats.map(
                  (each) =>
                    html`<li>
                      ${localize(
                        each.name ? 'tools.timings_repeat_named_row' : 'tools.timings_repeat_row',
                        { template: each.template, name: each.name ?? '', copies: each.copies },
                        this.hass,
                      )}
                    </li>`,
                )}
              </ul>
            `
          : html``
      }
    `;
  }

  /* ---------------------------------------------------------------- statistics (idea 60) */

  @state() private _sortBy: 'template' | 'builds' | 'total' | 'slowest' | 'delta' = 'total';
  @state() private _copiedStats = false;
  private _snapshot?: StatsSnapshot;
  private _snapshotRead = false;
  private _loadedAt = performance.now();

  private _writeSnapshot = (): void => {
    try {
      sessionStorage.setItem(STATS_SNAPSHOT_KEY, JSON.stringify(snapshotOf(buildStats(BUILD_LOG.entries()))));
    } catch {
      // Session storage can be full or off; the trend column then has nothing to compare with.
    }
  };

  /*
   * What this page has built since it loaded, by template: counts, time, the slowest single
   * build, and against the numbers kept from before the last reload. Nothing leaves the
   * browser; these are the Slowest builds timings, grouped and kept between reloads.
   */
  private _renderStats(): TemplateResult {
    if (!this._snapshotRead) {
      this._snapshotRead = true;
      try {
        const raw = sessionStorage.getItem(STATS_SNAPSHOT_KEY);
        this._snapshot = raw ? (JSON.parse(raw) as StatsSnapshot) : undefined;
      } catch {
        this._snapshot = undefined;
      }
    }
    const stats = buildStats(BUILD_LOG.entries(), this._snapshot);
    const minutes = Math.round((performance.now() - this._loadedAt) / 60000);
    const rows = sortRows(stats.rows, this._sortBy);
    const biggest = rows.reduce((max, row) => Math.max(max, row.total), 0) || 1;
    const headings = ['template', 'views', 'builds', 'total', 'slowest', 'delta'] as const;
    const headingText = (key: string): string => localize(`stats.col_${key}`, undefined, this.hass);
    return html`
      <h4 class="timings-header">
        ${localize('stats.header', undefined, this.hass)}
        <small>${localize('stats.since', { minutes }, this.hass)}</small>
      </h4>
      <div class="kpis">
        <div><b>${stats.cardsBuilt}</b><small>${localize('stats.cards_built', undefined, this.hass)}</small></div>
        <div>
          <b>${stats.templatesInUse}</b><small>${localize('stats.templates_in_use', undefined, this.hass)}</small>
        </div>
        <div><b>${stats.totalMs} ms</b><small>${localize('stats.total_time', undefined, this.hass)}</small></div>
        <div><b>${stats.rebuiltOnState}</b><small>${localize('stats.rebuilt', undefined, this.hass)}</small></div>
      </div>
      ${
        rows.length
          ? html`
              <table class="stats">
                <thead>
                  <tr>
                    ${headings.map(
                      (key) =>
                        html`<th
                          class=${key === 'views' ? '' : 'sortable'}
                          aria-sort=${this._sortBy === key ? 'descending' : 'none'}
                          @click=${(): void => {
                            if (key !== 'views') this._sortBy = key;
                          }}
                        >
                          ${headingText(key)}
                        </th>`,
                    )}
                  </tr>
                </thead>
                <tbody>
                  ${rows.map(
                    (row) => html`
                      <tr>
                        <td><code>${row.template}</code></td>
                        <td>${row.views.join(', ')}</td>
                        <td class="num">${row.builds}</td>
                        <td class="num">
                          <span
                            class="bar ${row.total === biggest && rows.length > 1 ? 'slow' : ''}"
                            style="width: ${Math.max(4, Math.round((row.total / biggest) * 80))}px"
                          ></span
                          >${row.total} ms
                        </td>
                        <td class="num">${row.slowest} ms</td>
                        <td
                          class="trend ${row.delta === undefined ? '' : row.delta > 0 ? 'up' : row.delta < 0 ? 'down' : ''}"
                        >
                          ${
                            row.delta === undefined
                              ? ''
                              : `${row.delta > 0 ? '+' : row.delta < 0 ? '−' : '±'}${Math.abs(row.delta)} ms`
                          }
                          ${row.reason ? html`<small>${localize(`stats.reason_${row.reason}`, undefined, this.hass)}</small>` : ''}
                        </td>
                      </tr>
                    `,
                  )}
                </tbody>
              </table>
              <p class="hint">${localize('stats.hint', undefined, this.hass)}</p>
              <ha-button appearance="plain" @click=${this._copyStats}>
                ${localize(this._copiedStats ? 'share.copied' : 'stats.copy', undefined, this.hass)}
              </ha-button>
              <ha-button appearance="plain" @click=${this._resetStats}
                >${localize('stats.reset', undefined, this.hass)}</ha-button
              >
            `
          : html`<p class="hint">${localize('tools.timings_none', undefined, this.hass)}</p>`
      }
    `;
  }

  private async _copyStats(): Promise<void> {
    const stats = buildStats(BUILD_LOG.entries(), this._snapshot);
    const headings = ['template', 'views', 'builds', 'total', 'slowest', 'delta'].map((key) =>
      localize(`stats.col_${key}`, undefined, this.hass),
    );
    this._copiedStats = await copyText(statsAsMarkdown(stats, headings));
    setTimeout(() => {
      this._copiedStats = false;
    }, 2000);
  }

  private _resetStats(): void {
    BUILD_LOG.clear();
    this._loadedAt = performance.now();
    this.requestUpdate();
  }

  /*
   * What the cards said while building, this page load: the warnings only a build can raise,
   * which a walk over the dashboard never finds, with the moment each happened (idea 9's
   * table, read from the one warnings log).
   */
  private _renderSaid(): TemplateResult {
    const said = warnings();
    if (!said.length) return html``;
    const first = this._loadedAt;
    const shown = said.slice(-50).reverse();
    return html`
      <h4 class="timings-header">${localize('stats.said_header', undefined, this.hass)}</h4>
      <table class="stats said">
        <thead>
          <tr>
            <th>${localize('stats.said_when', undefined, this.hass)}</th>
            <th>${localize('stats.said_card', undefined, this.hass)}</th>
            <th>${localize('stats.said_what', undefined, this.hass)}</th>
          </tr>
        </thead>
        <tbody>
          ${shown.map(
            (warning) => html`
              <tr>
                <td class="num">${Math.max(0, (warning.at - first) / 1000).toFixed(2)} s</td>
                <td>${warning.card ?? warning.template ?? ''}</td>
                <td>${warning.message}</td>
              </tr>
            `,
          )}
        </tbody>
      </table>
      ${said.length > shown.length ? html`<p class="hint">${localize('stats.said_more', { count: said.length - shown.length }, this.hass)}</p>` : ''}
    `;
  }
}
