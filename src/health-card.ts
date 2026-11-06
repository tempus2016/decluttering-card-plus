import { LitElement, html, css, CSSResult, TemplateResult, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant, navigate } from 'custom-card-helpers';
import {
  collectAllTemplates,
  collectTemplates,
  fetchDashboardConfig,
  fetchDashboardPaths,
  itemTemplatesOf,
  mayBorrowTemplates,
} from './templates';
import { getLovelaceConfig } from './utils';
import { currentViewIndex, pageDashboard } from './shared';
import { loadEditors } from './editors-loader';
import { dialogButtons } from './dialog-compat';
import { localize } from './localize';
import { warnings } from './warnings';
import {
  HEALTH_CARD_TAG,
  HEALTH_CARD_TYPE,
  HealthCardConfig,
  HealthEntry,
  HealthReport,
  healthEntries,
  shownKinds,
  toLookAt,
} from './health-card-pure';

export { HEALTH_CARD_TAG, HEALTH_CARD_TYPE };

/*
 * A health card on the dashboard, and the same thing as a badge in a view's row (idea 50):
 * the health panel's findings, card by card, with an Open button that goes to the card. The
 * badge is the summary; the card is the list. Checks run when the card is configured, put
 * on the page, or the dashboard's configuration is replaced - never on a state change.
 */
export class DeclutteringHealthCard extends LitElement {
  @property({ type: Boolean }) public preview = false;
  @state() private _config?: HealthCardConfig;
  @state() private _reports: { dashboard: string; report: HealthReport }[] = [];
  @state() private _checkedAt?: number;
  @state() private _panel = false;
  @state() private _badge = false;
  // Edit mode as the hui-badge around this one knows it: hui-badge never forwards `preview`.
  @state() private _wrapperPreview = false;
  private _hass?: HomeAssistant;
  // The dashboard config the last check was run against, by identity.
  private _checkedFor?: unknown;
  private _running = false;

  public setConfig(config: HealthCardConfig): void {
    this._config = config;
    this._checkedFor = undefined;
    void this._check();
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    // Identity only: hass arrives on every state change, the dashboard config only on a save.
    if (this._checkedFor !== getLovelaceConfig()) void this._check();
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._badge = this.parentElement?.localName === 'hui-badge';
    this._syncWrapperPreview();
    // Entering edit mode moves the badge into a wrapper and sets the flag, in no fixed order.
    requestAnimationFrame(() => {
      if (this.isConnected) this._syncWrapperPreview();
    });
    if (this._checkedFor !== getLovelaceConfig()) void this._check();
  }

  /*
   * Reads edit mode off the hui-badge this element sits in, the way the card does: hui-badge
   * never sets `preview` on the badge inside it, so a clean badge hidden by
   * `hide_when_clean` would otherwise stay hidden in edit mode and could not be edited.
   */
  private _syncWrapperPreview(): void {
    const wrapper = this.parentElement;
    if (!wrapper || wrapper.localName !== 'hui-badge') return;
    const previewing = (wrapper as unknown as { preview?: boolean }).preview === true;
    if (previewing !== this._wrapperPreview) {
      this._wrapperPreview = previewing;
      this._syncHidden();
    }
  }

  private get _previewing(): boolean {
    return this.preview || this._wrapperPreview;
  }

  public getCardSize(): number {
    return this._config?.hide_when_clean && !this._total() ? 0 : 3;
  }

  public getGridOptions(): unknown {
    return { columns: 'full', rows: 'auto' };
  }

  private _total(): number {
    return this._reports.reduce((sum, each) => sum + toLookAt(each.report.counts), 0);
  }

  private async _check(): Promise<void> {
    const config = this._config;
    const hass = this._hass;
    const ll = getLovelaceConfig();
    if (!config || !hass || !ll || this._running) return;
    this._running = true;
    this._checkedFor = ll;
    try {
      const kinds = shownKinds(config.show);
      const here = pageDashboard();
      const reports: { dashboard: string; report: HealthReport }[] = [];
      const templatesHere = mayBorrowTemplates(ll) ? await collectAllTemplates(hass, ll) : collectTemplates(ll);
      reports.push({
        dashboard: here,
        report: healthEntries(ll, { ...templatesHere, ...itemTemplatesOf(ll) }, here, kinds),
      });
      if (config.dashboards === 'all') {
        const paths = (await fetchDashboardPaths(hass)).filter((path) => path !== here);
        for (const path of paths) {
          const other = await fetchDashboardConfig(hass, path);
          if (!other) continue;
          const templates = mayBorrowTemplates(other)
            ? await collectAllTemplates(hass, other)
            : collectTemplates(other);
          reports.push({
            dashboard: path,
            report: healthEntries(other, { ...templates, ...itemTemplatesOf(other) }, path, kinds),
          });
        }
      }
      this._reports = reports;
      this._checkedAt = Date.now();
      this._syncHidden();
    } finally {
      this._running = false;
    }
  }

  /** `hide_when_clean`: the badge or card goes when there is nothing to look at, and says so to the row. */
  private _syncHidden(): void {
    const hidden =
      !!this._config?.hide_when_clean && this._checkedAt !== undefined && this._total() === 0 && !this._previewing;
    if (this.hasAttribute('hidden') === hidden) return;
    this.toggleAttribute('hidden', hidden);
    this.dispatchEvent(
      new Event(this._badge ? 'badge-visibility-changed' : 'card-visibility-changed', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _admin(): boolean {
    return !!(this._hass as unknown as { user?: { is_admin?: boolean } })?.user?.is_admin;
  }

  /*
   * Open goes to the card's editor. Home Assistant honours `ll-edit-card` only for a card in
   * the view the event comes from, and only from a card - from a badge it throws - so the
   * dialog is asked for directly only from a card in the entry's own view; anything else
   * goes to that view, or that dashboard, in edit mode.
   */
  private _open(entry: HealthEntry): void {
    const here = entry.dashboard === pageDashboard();
    const sameView = here && entry.view.index === currentViewIndex(getLovelaceConfig());
    if (sameView && !this._badge) {
      this.dispatchEvent(
        new CustomEvent('ll-edit-card', { detail: { path: entry.path }, bubbles: true, composed: true }),
      );
      return;
    }
    navigate(this, `/${entry.dashboard}/${entry.view.index}?edit=1`);
  }

  // The full panel lives in the editors chunk (idea 4), so it is fetched before the dialog opens.
  private _togglePanel(): void {
    if (this._panel) {
      this._panel = false;
      return;
    }
    void loadEditors().then(() => {
      this._panel = true;
    });
  }

  private _describe(entry: HealthEntry): string {
    const hass = this._hass;
    const where = `${entry.dashboard} · ${entry.view.title || localize('template_editor.untitled_view', undefined, hass)}`;
    switch (entry.kind) {
      case 'missing':
        return localize('health_card.missing', { label: entry.label, template: entry.template, where }, hass);
      case 'unset':
        return localize(
          'health_card.unset',
          { label: entry.label, names: (entry.names ?? []).join(', '), template: entry.template, where },
          hass,
        );
      default:
        return localize(
          'health_card.deprecated',
          { label: entry.label, template: entry.template, where, message: entry.message ? `: ${entry.message}` : '' },
          hass,
        );
    }
  }

  protected render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;
    const hass = this._hass;
    const total = this._total();
    if (this._badge) {
      const clean = total === 0;
      return html`<div class="badge ${clean ? 'clean' : 'busy'}" @click=${() => this._togglePanel()}>
          <span class="icon">${clean ? '✓' : '!'}</span>
          <span class="text">
            <span class="main"
              >${
                clean
                  ? localize('health_card.badge_clean', undefined, hass)
                  : localize('health_card.badge_count', { count: total }, hass)
              }</span
            >
            <span class="sub">${localize('health_card.badge_label', undefined, hass)}</span>
          </span>
        </div>
        ${this._renderPanel()}`;
    }
    const counts = this._reports.reduce(
      (sum, each) => ({
        missing: sum.missing + each.report.counts.missing,
        unset: sum.unset + each.report.counts.unset,
        deprecated: sum.deprecated + each.report.counts.deprecated,
        fine: sum.fine + each.report.counts.fine,
        cards: sum.cards + each.report.counts.cards,
      }),
      { missing: 0, unset: 0, deprecated: 0, fine: 0, cards: 0 },
    );
    const limit = Number(config.limit) > 0 ? Number(config.limit) : 5;
    const entries = ([] as HealthEntry[]).concat(...this._reports.map((each) => each.report.entries)).slice(0, limit);
    const said = warnings().length;
    return html`
      <ha-card>
        <div class="header">
          <span class="title">${config.title ?? localize('health_card.title', undefined, hass)}</span>
          <span class="when"
            >${
              this._checkedAt
                ? localize('health_card.checked', undefined, hass)
                : localize('health_card.checking', undefined, hass)
            }</span
          >
        </div>
        <div class="counts">
          <div class="count ${counts.missing ? 'bad' : ''}">
            <b>${counts.missing}</b><span>${localize('health_card.count_missing', undefined, hass)}</span>
          </div>
          <div class="count ${counts.unset ? 'warn' : ''}">
            <b>${counts.unset}</b><span>${localize('health_card.count_unset', undefined, hass)}</span>
          </div>
          <div class="count ${counts.deprecated ? 'warn' : ''}">
            <b>${counts.deprecated}</b><span>${localize('health_card.count_deprecated', undefined, hass)}</span>
          </div>
          <div class="count">
            <b>${counts.fine}</b><span>${localize('health_card.count_fine', undefined, hass)}</span>
          </div>
        </div>
        ${
          entries.length
            ? html`<ul class="list">
                ${entries.map(
                  (entry) =>
                    html`<li class=${entry.kind}>
                      <span class="mark">${entry.kind === 'missing' ? '!' : '▲'}</span>
                      <span class="text">${this._describe(entry)}</span>
                      ${
                        this._admin()
                          ? html`<ha-button class="open" @click=${() => this._open(entry)}
                              >${localize('health_card.open', undefined, hass)}</ha-button
                            >`
                          : ''
                      }
                    </li>`,
                )}
              </ul>`
            : this._checkedAt
              ? html`<p class="clean">${localize('health_card.clean', undefined, hass)}</p>`
              : ''
        }
        <div class="footer">
          <span class="said">${said ? localize('health_card.said', { count: said }, hass) : ''}</span>
          <ha-button class="panel" @click=${() => this._togglePanel()}>
            ${localize('health_card.open_panel', undefined, hass)}
          </ha-button>
        </div>
      </ha-card>
      ${this._renderPanel()}
    `;
  }

  /** The full health panel, the one the editors show, in a dialog of this card's own. */
  private _renderPanel(): TemplateResult | '' {
    if (!this._panel) return '';
    const heading = localize('tools.health_header', undefined, this._hass);
    return html`<ha-dialog
      open
      scrimClickAction
      escapeKeyAction
      .heading=${heading}
      .headerTitle=${heading}
      @closed=${() => (this._panel = false)}
    >
      <decluttering-card-plus-health
        .hass=${this._hass}
        .lovelace=${getLovelaceConfig()}
        expanded
      ></decluttering-card-plus-health>
      ${dialogButtons(
        html`<ha-button slot="primaryAction" @click=${() => (this._panel = false)}
          >${localize('chip.cancel', undefined, this._hass)}</ha-button
        >`,
      )}
    </ha-dialog>`;
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
      }
      :host([hidden]) {
        display: none;
      }
      ha-card {
        padding: 12px 16px;
      }
      .header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 10px;
      }
      .title {
        font-size: 1.05em;
        font-weight: 500;
      }
      .when {
        color: var(--secondary-text-color);
        font-size: 0.85em;
      }
      .counts {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 8px;
        margin-bottom: 10px;
      }
      .count {
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        padding: 8px 10px;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .count b {
        font-size: 1.3em;
        font-weight: 500;
      }
      .count span {
        color: var(--secondary-text-color);
        font-size: 0.8em;
      }
      .count.bad b {
        color: var(--error-color);
      }
      .count.warn b {
        color: var(--warning-color);
      }
      .list {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .list li {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 0;
        border-top: 1px solid var(--divider-color);
        font-size: 0.95em;
      }
      .list .mark {
        width: 20px;
        text-align: center;
        font-weight: 600;
      }
      .list li.missing .mark {
        color: var(--error-color);
      }
      .list li.unset .mark,
      .list li.deprecated .mark {
        color: var(--warning-color);
      }
      .list .text {
        flex: 1;
      }
      .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
      }
      .said,
      .clean {
        color: var(--secondary-text-color);
        font-size: 0.85em;
        margin: 0;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 36px;
        padding: 0 12px 0 6px;
        border-radius: 18px;
        background: var(--ha-card-background, var(--card-background-color, #fff));
        box-shadow: var(--ha-card-box-shadow, 0 1px 3px rgba(0, 0, 0, 0.2));
        cursor: pointer;
        font-size: 12px;
      }
      .badge .icon {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: inline-grid;
        place-items: center;
        font-weight: 700;
        background: rgba(127, 127, 127, 0.15);
      }
      .badge.busy .icon {
        background: var(--warning-color);
        color: var(--text-primary-color, #fff);
      }
      .badge.clean .icon {
        background: var(--success-color, #43a047);
        color: var(--text-primary-color, #fff);
      }
      .badge .text {
        display: flex;
        flex-direction: column;
        line-height: 1.1;
      }
      .badge .sub {
        color: var(--secondary-text-color);
        font-size: 10.5px;
      }
    `;
  }
}
