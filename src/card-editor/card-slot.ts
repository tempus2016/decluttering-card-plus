import { LitElement, html, css, TemplateResult, CSSResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant, fireEvent, LovelaceConfig } from 'custom-card-helpers';
import { localize } from '../localize';
import { summariseCard } from './summarise';

export { summariseCard } from './summarise';

/*
 * Ideas 14 and 17: a slot that takes a whole card, wherever the card's config does - the
 * `empty:` card of a repeat, the fallback card under On error. Empty, it says what happens
 * without one and offers Home Assistant's own card picker; filled, it names the card and
 * offers the ordinary card editor for it, nested, or takes it away again.
 *
 * It never fires anything but `value-changed` with the card, or undefined for none, so the
 * editor around it decides which key the card goes under.
 */

export const CARD_SLOT_TAG = 'decluttering-card-plus-card-slot';

export class DeclutteringCardSlot extends LitElement {
  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
        margin: 0 0 16px;
      }
      .slot {
        border: 1px dashed var(--divider-color);
        border-radius: 8px;
        padding: 10px 12px;
      }
      .slot.filled {
        border-style: solid;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      .row .text {
        flex: 1;
        min-width: 0;
      }
      .label {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin: 16px 0 6px;
      }
      .hint {
        color: var(--secondary-text-color);
        font-size: 0.9em;
        margin: 0;
      }
      .summary b {
        font-weight: 500;
      }
      .summary small {
        display: block;
        color: var(--secondary-text-color);
      }
      hui-card-picker,
      hui-card-element-editor {
        display: block;
        margin-top: 12px;
      }
    `;
  }

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public lovelace?: LovelaceConfig;
  /** The card in the slot, or undefined for none. */
  @property({ attribute: false }) public value?: Record<string, unknown>;
  /** What the slot is for, shown above it. */
  @property() public label = '';
  /** What happens with nothing in the slot, shown while it is empty. */
  @property() public emptyHint = '';

  @state() private _picking = false;
  @state() private _editing = false;

  protected render(): TemplateResult {
    const summary = summariseCard(this.value);
    return html`
      ${this.label ? html`<p class="label">${this.label}</p>` : html``}
      <div class="slot ${summary ? 'filled' : ''}">
        ${
          summary
            ? html`
                <div class="row">
                  <div class="text summary">
                    <b>${summary.type}</b>
                    ${summary.text ? html`<small>${summary.text}</small>` : html``}
                  </div>
                  <ha-button @click=${(): void => this._toggleEdit()}>
                    ${localize(this._editing ? 'editor.slot.done' : 'editor.slot.edit', undefined, this.hass)}
                  </ha-button>
                  <ha-button @click=${(): void => this._set(undefined)}>
                    ${localize('editor.slot.remove', undefined, this.hass)}
                  </ha-button>
                </div>
                ${
                  this._editing
                    ? html`<hui-card-element-editor
                        .hass=${this.hass}
                        .lovelace=${this.lovelace}
                        .value=${this.value}
                        @config-changed=${this._edited}
                      ></hui-card-element-editor>`
                    : html``
                }
              `
            : html`
                <div class="row">
                  <p class="text hint">${this.emptyHint}</p>
                  <ha-button @click=${(): void => this._togglePick()}>
                    ${localize(this._picking ? 'editor.slot.cancel' : 'editor.slot.choose', undefined, this.hass)}
                  </ha-button>
                </div>
                ${
                  this._picking
                    ? html`<hui-card-picker
                        .hass=${this.hass}
                        .lovelace=${this.lovelace}
                        @config-changed=${this._picked}
                      ></hui-card-picker>`
                    : html``
                }
              `
        }
      </div>
    `;
  }

  private _togglePick(): void {
    this._picking = !this._picking;
  }

  private _toggleEdit(): void {
    this._editing = !this._editing;
  }

  private _picked(ev: CustomEvent): void {
    ev.stopPropagation();
    this._picking = false;
    this._set(ev.detail?.config);
  }

  private _edited(ev: CustomEvent): void {
    ev.stopPropagation();
    this._set(ev.detail?.config);
  }

  private _set(card: Record<string, unknown> | undefined): void {
    this._editing = this._editing && !!card;
    fireEvent(this, 'value-changed', { value: card && typeof card === 'object' ? card : undefined });
  }
}

if (typeof customElements !== 'undefined' && !customElements.get(CARD_SLOT_TAG)) {
  customElements.define(CARD_SLOT_TAG, DeclutteringCardSlot);
}
