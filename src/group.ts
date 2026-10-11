import { LitElement, html, css, CSSResult, TemplateResult, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { GROUP_CARD_TYPE } from './templates';
import { gridSize } from './layout';
import { localize } from './localize';

/* eslint-disable @typescript-eslint/no-explicit-any */

const GROUP_TAG = GROUP_CARD_TYPE.replace(/^custom:/, '');

/*
 * The card a `group:` template builds (#176). It lays its cards out on the same grid as the
 * section it sits in - the section's own column count, row height and gaps reach it as
 * custom properties - and gives each one the cell the section would have given it, so a
 * group of tiles looks exactly as the tiles did written out one by one. It takes the whole
 * width of the section itself, since its cards are the ones with sizes to ask for.
 *
 * Anywhere else - a masonry view, a panel - a card's grid size means nothing, and written
 * out the cards would each take the whole column. So that is what they get here too: one
 * under another, the way a vertical stack would put them.
 */
class DeclutteringGroup extends LitElement {
  @property({ attribute: false }) public layout?: string;
  @property({ type: Boolean }) public preview = false;
  @state() private _cards: any[] = [];
  @state() private _error?: string;
  private _hass?: any;

  set hass(hass: any) {
    this._hass = hass;
    for (const card of this._cards) card.hass = hass;
  }

  public setConfig(config: { cards?: unknown }): void {
    // Said rather than thrown: a throw here reaches the dashboard as "Configuration error", reason hidden.
    this._error = Array.isArray(config?.cards) ? undefined : localize('error.group_needs_cards', undefined, this._hass);
    const cards = Array.isArray(config?.cards) ? config.cards : [];
    // hui-card is what the section wraps each of its cards in: visibility, sizes and rebuilds come with it.
    const build = (): void => {
      const Wrapper = customElements.get('hui-card') as any;
      this._cards = cards.map((cardConfig) => {
        const card = new Wrapper();
        card.config = cardConfig;
        card.preview = this.preview;
        card.layout = this.layout;
        if (this._hass) card.hass = this._hass;
        return card;
      });
    };
    if (customElements.get('hui-card')) build();
    else customElements.whenDefined('hui-card').then(build);
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    for (const card of this._cards) {
      card.preview = this.preview;
      card.layout = this.layout;
    }
  }

  // The group fills the section's width; how its cards share that is up to them.
  public getGridOptions(): unknown {
    return { columns: 'full' };
  }

  public async getCardSize(): Promise<number> {
    const sizes = await Promise.all(this._cards.map((card) => card.getCardSize?.() ?? 1));
    return sizes.reduce((total: number, size: number) => total + (Number(size) || 0), 0);
  }

  /*
   * A card says how big it wants to be once it has loaded, which is after the group first
   * drew it - so the cells are worked out again whenever one of them changes. The event goes
   * no further: the group's own size has not changed, and a masonry view answers it by
   * rebuilding every column.
   */
  private _cardUpdated(ev: Event): void {
    ev.stopPropagation();
    this.requestUpdate();
  }

  protected render(): TemplateResult {
    if (this._error) return html`<ha-alert alert-type="error">${this._error}</ha-alert>`;
    return html`
      <div class="container" @card-updated=${this._cardUpdated}>
        ${this._cards.map((card) => {
          // A section tells the cards in it that they are laid out on its grid.
          const { rows, columns } =
            this.layout === 'grid' ? gridSize(card.getGridOptions?.()) : { columns: 'full', rows: 'auto' };
          const classes = ['card', typeof rows === 'number' ? 'fit-rows' : '', columns === 'full' ? 'full-width' : '']
            .filter(Boolean)
            .join(' ');
          // Both are always set, so a cell never picks up the size of the cell the group sits in.
          const style = `--column-size: ${typeof columns === 'number' ? columns : 1}; --row-size: ${typeof rows === 'number' ? rows : 1};`;
          return html`<div class=${classes} style=${style}>${card}</div>`;
        })}
      </div>
    `;
  }

  // Home Assistant's section grid, rule for rule, with its spacing for when there is no section.
  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
      }
      .container {
        display: grid;
        grid-template-columns: repeat(var(--grid-column-count, 12), minmax(0, 1fr));
        grid-auto-rows: auto;
        row-gap: var(--row-gap, 8px);
        column-gap: var(--column-gap, 8px);
      }
      .card {
        position: relative;
        border-radius: var(--ha-card-border-radius, var(--ha-border-radius-lg));
        grid-row: span var(--row-size, 1);
        grid-column: span min(var(--column-size, 1), var(--grid-column-count, 12));
      }
      .card.fit-rows {
        height: calc((var(--row-size, 1) * (var(--row-height, 56px) + var(--row-gap, 8px))) - var(--row-gap, 8px));
      }
      .card.full-width {
        grid-column: 1 / -1;
      }
      .card:has(> [hidden]) {
        display: none;
      }
    `;
  }
}

if (!customElements.get(GROUP_TAG)) customElements.define(GROUP_TAG, DeclutteringGroup);
