import { LitElement, html, css, CSSResult, PropertyValues, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { localize } from './localize';
import { CHIP_TAG, ChipAction, chipLabel, copiesLabel } from './edit-chip-pure';

export { CHIP_TAG };

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * The chip a decluttering card wears in edit mode (idea 47): the template behind it, how
 * many copies a repeat made, and a menu that opens the template, shows where it is used,
 * shows what the card built, or ejects the card from the template. Drawn only while the
 * dashboard is being edited, so outside edit mode it costs nothing.
 */
export class DeclutteringChip extends LitElement {
  @property() public name = '';
  @property() public source?: string;
  @property({ type: Number }) public copies?: number;
  @property({ type: Boolean }) public showing = false;
  @property({ type: Boolean }) public canEdit = false;
  @property({ attribute: false }) public hass?: any;
  @state() private _open = false;

  private _act(action: ChipAction): void {
    this._open = false;
    this.dispatchEvent(new CustomEvent<{ action: ChipAction }>('dcp-chip', { detail: { action } }));
  }

  /*
   * Every chip sits at the same z-index, so the next card's chip, later on the page, painted
   * over an open menu and hid its last line. An open chip is lifted above the others.
   */
  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('_open')) this.toggleAttribute('open', this._open);
  }

  protected render(): TemplateResult {
    const count = copiesLabel(this.copies);
    return html`
      <button
        class="chip"
        type="button"
        @click=${() => (this._open = !this._open)}
        aria-haspopup="menu"
        aria-expanded=${this._open}
      >
        <span class="icon">▤</span>
        <span class="name">${chipLabel(this.name, this.source)}</span>
        ${count ? html`<span class="count">${count}</span>` : ''}
      </button>
      ${
        this._open
          ? html`<div class="menu" role="menu">
              ${
                this.canEdit
                  ? html`<button role="menuitem" @click=${() => this._act('edit')}>
                        ${localize('chip.edit', undefined, this.hass)}<span class="hint">${this.name}</span>
                      </button>
                      <button role="menuitem" @click=${() => this._act('where_used')}>
                        ${localize('chip.where_used', undefined, this.hass)}
                      </button>`
                  : ''
              }
              <button role="menuitem" @click=${() => this._act('show')}>
                ${localize(this.showing ? 'chip.show_card' : 'chip.show_built', undefined, this.hass)}
              </button>
              <button role="menuitem" @click=${() => this._act('eject')}>
                ${localize('chip.eject', undefined, this.hass)}
              </button>
            </div>`
          : ''
      }
    `;
  }

  static get styles(): CSSResult {
    return css`
      :host {
        position: absolute;
        top: -10px;
        left: 10px;
        z-index: 3;
        font-family: var(--ha-font-family-body, var(--paper-font-body1_-_font-family, inherit));
      }
      :host([open]) {
        z-index: 4;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 2px 8px;
        border-radius: 10px;
        border: 1px solid var(--warning-color, #ffa600);
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
        font: 500 11px/1.4 inherit;
        cursor: pointer;
        white-space: nowrap;
        box-shadow: var(--ha-card-box-shadow, 0 1px 3px rgba(0, 0, 0, 0.2));
      }
      .chip .icon {
        color: var(--warning-color, #ffa600);
      }
      .chip .count {
        background: var(--warning-color, #ffa600);
        color: var(--text-primary-color, #fff);
        border-radius: 8px;
        padding: 0 5px;
        font-size: 10px;
      }
      .menu {
        position: absolute;
        top: 24px;
        left: 0;
        min-width: 220px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        padding: 4px 0;
        display: flex;
        flex-direction: column;
      }
      .menu button {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        width: 100%;
        border: 0;
        background: none;
        color: inherit;
        font: 13px/1.4 inherit;
        text-align: start;
        padding: 7px 14px;
        cursor: pointer;
      }
      .menu button:hover,
      .menu button:focus-visible {
        background: var(--secondary-background-color, rgba(127, 127, 127, 0.12));
        outline: none;
      }
      .menu .hint {
        color: var(--secondary-text-color);
        font-size: 11px;
      }
    `;
  }
}

if (!customElements.get(CHIP_TAG)) customElements.define(CHIP_TAG, DeclutteringChip);
