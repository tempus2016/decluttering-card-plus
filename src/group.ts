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
 *
 * In a view's row of badges it is told `badges: true`, and builds each of its cards as a
 * badge instead (#184): they sit side by side and wrap the way the row's own badges do.
 */
class DeclutteringGroup extends LitElement {
  @property({ attribute: false }) public layout?: string;
  @property({ type: Boolean }) public preview = false;
  @state() private _cards: any[] = [];
  @state() private _error?: string;
  @state() private _badges = false;
  // Edit mode, as the hui-badge around a group of badges knows it.
  @state() private _wrapperPreview = false;
  private _hass?: any;

  set hass(hass: any) {
    this._hass = hass;
    for (const card of this._cards) card.hass = hass;
  }

  public setConfig(config: { cards?: unknown; badges?: boolean }): void {
    // Said rather than thrown: a throw here reaches the dashboard as "Configuration error", reason hidden.
    this._error = Array.isArray(config?.cards) ? undefined : localize('error.group_needs_cards', undefined, this._hass);
    const cards = Array.isArray(config?.cards) ? config.cards : [];
    const badges = config?.badges === true;
    this._badges = badges;
    /*
     * hui-card is what the section wraps each of its cards in: visibility, sizes and
     * rebuilds come with it. hui-badge does the same for the row of badges. A group
     * nested in this one is a badge here too, so it is told so.
     */
    const tag = badges ? 'hui-badge' : 'hui-card';
    const build = (): void => {
      const Wrapper = customElements.get(tag) as any;
      this._cards = cards.map((cardConfig: any) => {
        const card = new Wrapper();
        card.config = badges && cardConfig?.type === GROUP_CARD_TYPE ? { ...cardConfig, badges: true } : cardConfig;
        card.preview = this._previewing;
        if (!badges) card.layout = this.layout;
        if (this._hass) card.hass = this._hass;
        return card;
      });
    };
    if (customElements.get(tag)) build();
    else customElements.whenDefined(tag).then(build);
  }

  /*
   * A badge is never told the dashboard is being edited - hui-badge keeps that to itself -
   * so as a badge the group reads it off the hui-badge around it. Edit mode moves the badge
   * into a wrapper and back, so a connect is when it can have changed.
   */
  private get _previewing(): boolean {
    return this.preview || this._wrapperPreview;
  }

  private _syncWrapperPreview(): void {
    const wrapper = this.parentElement as any;
    if (wrapper?.localName === 'hui-badge') this._wrapperPreview = wrapper.preview === true;
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._syncWrapperPreview();
    requestAnimationFrame(() => {
      if (this.isConnected) this._syncWrapperPreview();
    });
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    this._syncWrapperPreview();
    for (const card of this._cards) {
      card.preview = this._previewing;
      if (!this._badges) card.layout = this.layout;
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
    // A hidden badge hides its own hui-badge, so the row closes up around it with nothing to do here.
    if (this._badges) return html`<div class="badges">${this._cards}</div>`;
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
      /* The row of badges a view puts above its sections, rule for rule. */
      .badges {
        display: flex;
        flex-wrap: var(--badges-wrap, wrap);
        align-items: flex-start;
        justify-content: var(--badges-aligmnent, center);
        gap: var(--ha-space-2, 8px);
      }
      .badges > * {
        min-width: fit-content;
      }
    `;
  }
}

if (!customElements.get(GROUP_TAG)) customElements.define(GROUP_TAG, DeclutteringGroup);
