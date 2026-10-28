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
} from './templates';
import { checkExamples } from './examples';
import { localize, onLanguageLoaded } from './localize';
import { checkUnreadVariables } from './unread';
import { BUILD_LOG, slowestBuilds } from './trace';

/*
 * Dashboard health, as its own element so the template editor's Where used tab and the card
 * editor can both show it (discussion #215). Anything given as content - the template
 * editor's undo - is drawn at the top of the panel.
 */
export class DeclutteringHealthPanel extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public lovelace?: LovelaceConfig | null;

  // Stops listening for a language chunk landing (idea 4).
  private _stopLanguageListener?: () => void;

  public connectedCallback(): void {
    super.connectedCallback();
    this._stopLanguageListener ??= onLanguageLoaded(() => this.requestUpdate());
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopLanguageListener?.();
    this._stopLanguageListener = undefined;
  }

  // The templates this dashboard borrows: their names for the missing-template check, and
  // the templates themselves so a card using one can be checked for variables it never reads.
  @state() private _borrowed?: { ll: unknown; names?: string[]; templates?: Record<string, TemplateConfig> };
  // Every example on the dashboard built once per dashboard config, not on every render -
  // the panel re-renders on each state change Home Assistant sends.
  private _examplesChecked?: { ll: unknown; borrowed?: string[]; failed: ReturnType<typeof checkExamples> };

  static get styles(): CSSResult {
    return css`
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
        padding-left: 20px;
        font-size: 0.9em;
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
    const unread = checkUnreadVariables(ll, this._borrowed?.templates ?? collectTemplates(ll));
    const healthy =
      !report.missingTemplates.length &&
      !report.unsetVariables.length &&
      !report.unusedTemplates.length &&
      !loops.length &&
      !retired.length &&
      !failedExamples.length &&
      !unread.length;
    return html`
      <ha-expansion-panel outlined>
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
                      }${each.closest ? localize('error.did_you_mean', { closest: each.closest }, this.hass) : ''}
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
        ${this._renderTimings()}
      </ha-expansion-panel>
    `;
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
}
