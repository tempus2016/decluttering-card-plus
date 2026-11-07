import { LitElement, html, css, CSSResult, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { localize } from './localize';
import { SKIPPED_TAG } from './visibility';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * The dashed slot edit mode draws where a template's `visibility:` kept a copy from being
 * built (idea 45), naming the copy and the condition that closed it - so a missing room is
 * a visible decision rather than a silent gap. Only ever put in a stack by the card itself,
 * and only while the dashboard is being edited.
 */
class DeclutteringSkipped extends LitElement {
  @state() private _label = '';
  @state() private _reason = '';
  private _hass?: any;

  public setConfig(config: { label?: unknown; reason?: unknown }): void {
    this._label = typeof config?.label === 'string' ? config.label : '';
    this._reason = typeof config?.reason === 'string' ? config.reason : '';
  }

  set hass(hass: any) {
    this._hass = hass;
    this.requestUpdate();
  }

  public getCardSize(): number {
    return 1;
  }

  protected render(): TemplateResult {
    return html`
      <div class="slot">
        <span class="label">${localize('visibility.not_built', { label: this._label }, this._hass)}</span>
        <span class="reason">${this._reason}</span>
      </div>
    `;
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
        height: 100%;
      }
      .slot {
        box-sizing: border-box;
        height: 100%;
        min-height: 56px;
        border: 2px dashed var(--divider-color, #bdbdbd);
        border-radius: var(--ha-card-border-radius, 12px);
        padding: 12px 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 4px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .label {
        font-weight: 500;
      }
      .reason {
        font-size: 0.9em;
      }
    `;
  }
}

if (!customElements.get(SKIPPED_TAG)) customElements.define(SKIPPED_TAG, DeclutteringSkipped);
