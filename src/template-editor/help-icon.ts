import { LitElement, html, TemplateResult, css, CSSResult, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { HelpEntry, helpFor, helpUrl } from '../help';
import { localize } from '../localize';

/*
 * The help icon beside a field (idea 61). Pressed, it shows the wiki's paragraph for the
 * setting in place, with the first YAML example and a link to the page; Escape or a second
 * press closes it. The words are fetched once per page from the docs site; offline, the
 * link alone is offered.
 */
export class DeclutteringHelpIcon extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  /** The setting's key in the help index: `for_each_from`, `variables`, ... */
  @property() public key = '';

  @state() private _open = false;
  @state() private _entry?: HelpEntry;
  @state() private _loaded = false;

  static get styles(): CSSResult {
    return css`
      :host {
        display: inline-block;
        position: relative;
      }
      button {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1.5px solid var(--secondary-text-color);
        color: var(--secondary-text-color);
        background: transparent;
        font: 500 13px var(--ha-font-family, inherit);
        cursor: pointer;
        padding: 0;
      }
      button[aria-expanded='true'] {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
      .pop {
        position: absolute;
        right: 0;
        top: 30px;
        z-index: 5;
        width: min(420px, 80vw);
        background: var(--card-background-color);
        color: var(--primary-text-color);
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        padding: 12px 14px;
        font-size: 0.9em;
        line-height: 1.5;
        text-align: left;
      }
      .pop h5 {
        margin: 0 0 6px;
        font-size: 1em;
        font-weight: 500;
      }
      .pop p {
        margin: 0 0 8px;
      }
      .pop pre {
        margin: 8px 0;
        padding: 8px 10px;
        background: var(--secondary-background-color);
        border-radius: 6px;
        font-family: var(--ha-font-family-code, monospace);
        font-size: 0.9em;
        white-space: pre-wrap;
        overflow: auto;
        max-height: 160px;
      }
      .foot {
        display: flex;
        gap: 12px;
        align-items: center;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .foot a {
        color: var(--primary-color);
        text-decoration: none;
      }
      .foot .esc {
        margin-left: auto;
      }
    `;
  }

  protected render(): TemplateResult {
    return html`
      <button
        aria-expanded=${this._open}
        aria-label=${localize('help.button', { key: this.key }, this.hass)}
        title=${localize('help.button', { key: this.key }, this.hass)}
        @click=${this._toggle}
        @keydown=${this._keydown}
      >
        ?
      </button>
      ${this._open ? this._renderPop() : nothing}
    `;
  }

  private _renderPop(): TemplateResult {
    const entry = this._entry;
    const url = entry?.url ?? helpUrl(this.key);
    return html`
      <div class="pop" role="dialog" @keydown=${this._keydown}>
        ${
          entry
            ? html`
                <h5>${entry.page}${entry.heading ? ` · ${entry.heading}` : ''}</h5>
                <p>${entry.text}</p>
                ${entry.yaml ? html`<pre>${entry.yaml}</pre>` : nothing}
              `
            : html`<p>
                ${localize(this._loaded ? 'help.not_in_index' : 'help.loading', { key: this.key }, this.hass)}
              </p>`
        }
        <div class="foot">
          <a href=${url} target="_blank" rel="noopener noreferrer"
            >${localize('help.open_page', undefined, this.hass)}</a
          >
          <span class="esc">${localize('help.esc', undefined, this.hass)}</span>
        </div>
      </div>
    `;
  }

  private async _toggle(): Promise<void> {
    this._open = !this._open;
    if (!this._open || this._loaded) return;
    this._entry = await helpFor(this.key);
    this._loaded = true;
  }

  private _keydown(ev: KeyboardEvent): void {
    if (ev.key === 'Escape' && this._open) {
      ev.stopPropagation();
      this._open = false;
    }
  }
}

export const HELP_ICON_TAG = 'decluttering-help';
if (!customElements.get(HELP_ICON_TAG)) customElements.define(HELP_ICON_TAG, DeclutteringHelpIcon);
