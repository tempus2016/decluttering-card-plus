/*
 * The template gallery dialog (idea 52): the starter library, the shared store and the
 * installed templates as tiles, each rendered against the sample house, with a search box
 * and category chips. It owns nothing but the browsing: what a tile means for this
 * dashboard - already here, needs a card you do not have, risks - comes in as `status` from
 * the template editor, and Install goes back out as an event the editor answers with its
 * existing library and shared-store installs.
 */
import { LitElement, html, css, TemplateResult, CSSResult, nothing } from 'lit';
import { dialogButtons } from './dialog-compat';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import {
  GalleryEntry,
  GallerySource,
  filterGallery,
  galleryCategories,
  galleryCounts,
  galleryTemplates,
  thumbnailConfig,
  thumbnailHass,
} from './gallery';
// Moves to ./shared with idea 51; template-editor/common re-exports it there.
import { textField } from './template-editor/common';
import { localize } from './localize';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface GalleryStatus {
  /** The dashboard already has a template of this name. */
  already: boolean;
  /** Install was pressed once and waits for the second press. */
  armed: boolean;
  busy: boolean;
  /** Library templates it calls that would be installed with it. */
  needs: string[];
  /** Templates a shared post carries that would be installed with it. */
  brings: string[];
  /** Custom cards it is built from that this browser does not have. */
  missingCards: string[];
  /** What a shared template would be allowed to do, as sentences. */
  risks: string[];
  destination: 'view' | 'root';
  communityLoaded: boolean;
  communityLoading: boolean;
}

export class DeclutteringGalleryDialog extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public entries: GalleryEntry[] = [];
  @property({ type: Boolean }) public open = false;
  @property({ attribute: false }) public selectedKey?: string;
  @property({ attribute: false }) public status?: GalleryStatus;

  @state() private _source: GallerySource = 'library';
  @state() private _category?: string;
  @state() private _query = '';
  @state() private _showYaml = false;

  // One rendered card per tile, kept so scrolling and searching do not rebuild them.
  private _thumbnails = new Map<string, HTMLElement | null>();

  static get styles(): CSSResult {
    return css`
      ha-dialog {
        --mdc-dialog-min-width: min(1040px, 96vw);
        --mdc-dialog-max-width: min(1040px, 96vw);
      }
      .tabs {
        display: flex;
        gap: 4px;
        border-bottom: 1px solid var(--divider-color);
        margin: 0 0 12px;
      }
      .tabs button {
        background: none;
        border: 0;
        border-bottom: 2px solid transparent;
        padding: 10px 14px;
        font: inherit;
        color: var(--secondary-text-color);
        cursor: pointer;
      }
      .tabs button[aria-selected='true'] {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
        font-weight: 500;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 10px 0 14px;
      }
      .chips button {
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        border-radius: 8px;
        padding: 6px 10px;
        font: inherit;
        font-size: 13px;
        cursor: pointer;
        color: var(--primary-text-color);
      }
      .chips button[aria-pressed='true'] {
        background: rgba(var(--rgb-primary-color), 0.12);
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 14px;
        max-height: 52vh;
        overflow: auto;
        padding: 2px;
      }
      .tile {
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        overflow: hidden;
        background: var(--card-background-color);
        cursor: pointer;
        text-align: left;
        padding: 0;
        font: inherit;
        color: inherit;
        display: flex;
        flex-direction: column;
      }
      .tile[aria-pressed='true'] {
        outline: 2px solid var(--primary-color);
      }
      .tile .preview {
        background: var(--secondary-background-color);
        padding: 10px;
        min-height: 96px;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        overflow: hidden;
      }
      .tile .preview {
        display: block;
      }
      .tile .preview .thumb {
        display: block;
        width: 100%;
        min-width: 0;
      }
      .tile .preview .thumb > * {
        display: block;
        width: 100%;
      }
      .tile .preview .kind {
        display: block;
        text-align: center;
        padding: 32px 0;
      }
      .tile .preview .kind {
        color: var(--secondary-text-color);
        font-size: 13px;
      }
      .tile .name {
        padding: 10px 12px 4px;
        font-weight: 500;
        word-break: break-word;
      }
      .tile .name small {
        display: block;
        color: var(--secondary-text-color);
        font-weight: 400;
        font-size: 12px;
      }
      .tile .about {
        padding: 0 12px 12px;
        color: var(--secondary-text-color);
        font-size: 12.5px;
        line-height: 1.35;
      }
      .empty {
        color: var(--secondary-text-color);
        padding: 24px 0;
        text-align: center;
      }
      .foot {
        display: flex;
        align-items: center;
        gap: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--divider-color);
        margin-top: 12px;
        flex-wrap: wrap;
      }
      .foot .summary {
        flex: 1;
        color: var(--secondary-text-color);
        font-size: 13px;
        min-width: 200px;
      }
      .foot .summary b {
        color: var(--primary-text-color);
        font-weight: 500;
      }
      ha-alert {
        display: block;
        margin: 8px 0;
      }
      ha-yaml-editor {
        display: block;
        margin: 8px 0 0;
      }
      @media (prefers-reduced-motion: reduce) {
        * {
          transition: none !important;
          animation: none !important;
        }
      }
    `;
  }

  protected updated(): void {
    // Tiles that left the list are forgotten, so a long session does not hold every card ever drawn.
    const keys = new Set(this.entries.map((entry) => entry.key));
    for (const key of [...this._thumbnails.keys()]) if (!keys.has(key)) this._thumbnails.delete(key);
  }

  private _t(key: string, params?: Record<string, unknown>): string {
    return localize(key, params, this.hass);
  }

  private _fire(name: string, detail?: unknown): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  private _close(): void {
    this._fire('gallery-closed');
  }

  /*
   * A tile's card, rendered by Home Assistant's own hui-card against the sample house, so
   * it looks exactly as it would on a dashboard. Built once per entry; a template that
   * will not build, or is not a card, shows what it is instead.
   */
  private _thumbnail(entry: GalleryEntry): TemplateResult {
    if (!this._thumbnails.has(entry.key)) {
      let element: HTMLElement | null = null;
      const config = thumbnailConfig(entry, galleryTemplates(this.entries));
      const wrapper = customElements.get('hui-card');
      if (config && wrapper && this.hass) {
        try {
          const card = new wrapper() as any;
          card.preview = true;
          card.config = config;
          card.hass = thumbnailHass(this.hass);
          element = card as HTMLElement;
        } catch {
          element = null;
        }
      }
      this._thumbnails.set(entry.key, element);
    }
    const element = this._thumbnails.get(entry.key);
    if (element) {
      // The sample house never changes, but the page's hass does: themes and locale follow it.
      if (this.hass) (element as any).hass = thumbnailHass(this.hass);
      // hui-card lays out as its contents, so a block around it is what gives the card the tile's width.
      return html`<div class="thumb">${element}</div>`;
    }
    const key =
      entry.kind === 'badge'
        ? 'gallery.kind_badge'
        : entry.kind === 'row'
          ? 'gallery.kind_row'
          : entry.kind === 'element'
            ? 'gallery.kind_element'
            : 'gallery.kind_unknown';
    return html`<span class="kind">${this._t(key)}</span>`;
  }

  private _renderTile(entry: GalleryEntry): TemplateResult {
    const selected = entry.key === this.selectedKey;
    const variables =
      entry.variables === 1
        ? this._t('gallery.variables_one')
        : this._t('gallery.variables_many', { count: entry.variables });
    return html`
      <button
        class="tile"
        aria-pressed=${selected ? 'true' : 'false'}
        @click=${(): void => this._fire('gallery-select', { key: entry.key })}
      >
        <div class="preview">${this._thumbnail(entry)}</div>
        <div class="name">
          ${entry.title}
          ${entry.author ? html`<small>${this._t('gallery.by', { author: entry.author })}</small>` : nothing}
        </div>
        <div class="about">
          ${entry.description} ${entry.variables ? variables + '.' : ''}
          ${entry.repeats ? this._t('gallery.repeats') : ''}
        </div>
      </button>
    `;
  }

  private _renderFoot(entry: GalleryEntry | undefined): TemplateResult {
    const status = this.status;
    if (!entry || !status) return html``;
    const extras: string[] = [];
    const brought = [...status.needs, ...status.brings];
    if (brought.length) extras.push(this._t('gallery.brings', { names: brought.join(', ') }));
    extras.push(this._t(status.destination === 'root' ? 'gallery.into_root' : 'gallery.into_view'));
    const installable = entry.source !== 'installed' && !status.already;
    return html`
      ${
        status.missingCards.length
          ? html`<ha-alert alert-type="info">
              ${this._t(status.missingCards.length === 1 ? 'share.missing_card_one' : 'share.missing_card_many', {
                cards: status.missingCards.join(', '),
              })}
            </ha-alert>`
          : nothing
      }
      ${
        status.armed && status.risks.length
          ? html`<ha-alert alert-type="warning">
              ${this._t('share.community_risks')}
              <ul>
                ${status.risks.map((risk) => html`<li>${risk}</li>`)}
              </ul>
            </ha-alert>`
          : nothing
      }
      ${
        this._showYaml
          ? html`<ha-yaml-editor .hass=${this.hass} .defaultValue=${entry.template} read-only></ha-yaml-editor>`
          : nothing
      }
      <div class="foot">
        <span class="summary">
          <b>${entry.name}</b>
          ${status.already ? ` · ${this._t('gallery.installed_already')}` : extras.length ? ` · ${extras.join(' · ')}` : ''}
        </span>
        <ha-button
          @click=${(): void => {
            this._showYaml = !this._showYaml;
          }}
        >
          ${this._t(this._showYaml ? 'gallery.preview_hide' : 'gallery.preview_full')}
        </ha-button>
        ${
          installable
            ? html`<ha-button
                .disabled=${status.busy}
                @click=${(): void => this._fire('gallery-install', { key: entry.key })}
              >
                ${this._t(status.armed ? 'share.install_anyway' : 'share.install')}
              </ha-button>`
            : nothing
        }
      </div>
    `;
  }

  protected render(): TemplateResult {
    if (!this.open) return html``;
    const counts = galleryCounts(this.entries);
    const inSource = filterGallery(this.entries, { source: this._source });
    const categories = galleryCategories(inSource);
    const category = this._category && categories.includes(this._category) ? this._category : undefined;
    const shown = filterGallery(inSource, { category, query: this._query });
    const selected = this.entries.find((entry) => entry.key === this.selectedKey);
    const tabs: [GallerySource, string][] = [
      ['library', 'gallery.tab_library'],
      ['community', 'gallery.tab_community'],
      ['installed', 'gallery.tab_installed'],
    ];
    return html`
      <ha-dialog
        open
        .heading=${this._t('gallery.title')}
        .headerTitle=${this._t('gallery.title')}
        @closed=${this._close}
        scrimClickAction=""
        escapeKeyAction="close"
      >
        <div>
          <div class="tabs" role="tablist">
            ${tabs.map(
              ([source, key]) =>
                html`<button
                  role="tab"
                  aria-selected=${this._source === source ? 'true' : 'false'}
                  @click=${(): void => {
                    this._source = source;
                    this._category = undefined;
                  }}
                >
                  ${this._t(key)} · ${counts[source]}
                </button>`,
            )}
          </div>
          ${textField({
            label: this._t('gallery.search'),
            value: this._query,
            onInput: (value: string): void => {
              this._query = value;
            },
          })}
          ${
            categories.length > 1
              ? html`<div class="chips">
                  <button
                    aria-pressed=${category ? 'false' : 'true'}
                    @click=${(): void => void (this._category = undefined)}
                  >
                    ${this._t('gallery.all')}
                  </button>
                  ${categories.map(
                    (each) =>
                      html`<button
                        aria-pressed=${category === each ? 'true' : 'false'}
                        @click=${(): void => void (this._category = each)}
                      >
                        ${each}
                      </button>`,
                  )}
                </div>`
              : nothing
          }
          ${
            this._source === 'community' && !this.status?.communityLoaded
              ? html`<p class="empty">
                  ${this._t('gallery.load_shared')}
                  <br />
                  <ha-button
                    .disabled=${this.status?.communityLoading === true}
                    @click=${(): void => this._fire('gallery-load-community')}
                  >
                    ${this._t(this.status?.communityLoading ? 'share.community_loading' : 'share.community_load')}
                  </ha-button>
                </p>`
              : shown.length
                ? html`<div class="grid">${shown.map((entry) => this._renderTile(entry))}</div>`
                : html`<p class="empty">${this._t('gallery.none')}</p>`
          }
          ${this._renderFoot(selected)}
        </div>
        ${dialogButtons(
          html`<ha-button slot="primaryAction" @click=${this._close}>${this._t('gallery.close')}</ha-button>`,
        )}
      </ha-dialog>
    `;
  }
}
