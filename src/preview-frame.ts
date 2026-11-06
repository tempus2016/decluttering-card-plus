import { LitElement, html, TemplateResult, css, CSSResult, PropertyValues, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant, applyThemesOnElement } from 'custom-card-helpers';
import { LovelaceThingType } from './types';
import { columnsFor } from './layout';
import { localize } from './localize';
import { toYaml } from './yaml';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * The preview frame (ideas 53 and 54): what a card builds, rendered or as YAML, under the
 * dashboard's light or dark theme or both side by side, at the width of a desktop, a tablet
 * or a phone. The card inside is Home Assistant's own hui-card, so it is the real thing,
 * and the theme is the dashboard's own in its dark mode - what the phone shows at night.
 */

export type PreviewTheme = 'light' | 'dark' | 'both';
export type PreviewWidth = 'desktop' | 'tablet' | 'phone';
export type PreviewMode = 'rendered' | 'yaml';

/** The widths the switch stands for: the preview column, a tablet, and a phone's masonry column. */
export const PREVIEW_WIDTHS: Record<PreviewWidth, number | undefined> = { desktop: undefined, tablet: 768, phone: 388 };

export interface RepeatHint {
  copies: number;
  max: number;
  minWidth?: number;
}

/* Home Assistant's dark mode as its frontend writes it (src/resources/styles-data.ts, darkStyles). */
const DARK_STYLES: Record<string, string> = {
  'primary-background-color': '#111111',
  'card-background-color': '#1c1c1c',
  'secondary-background-color': '#202020',
  'clear-background-color': '#111111',
  'primary-text-color': '#e1e1e1',
  'secondary-text-color': '#9b9b9b',
  'disabled-text-color': '#6f6f6f',
  'app-header-text-color': '#e1e1e1',
  'app-header-background-color': '#101e24',
  'switch-unchecked-button-color': '#999999',
  'switch-unchecked-track-color': '#9b9b9b',
  'divider-color': 'rgba(225, 225, 225, .12)',
  'outline-color': 'rgba(225, 225, 225, .12)',
  'outline-hover-color': 'rgba(225, 225, 225, .24)',
  'mdc-ripple-color': '#AAAAAA',
  'mdc-linear-progress-buffer-color': 'rgba(255, 255, 255, 0.1)',
  'input-idle-line-color': 'rgba(255, 255, 255, 0.42)',
  'input-hover-line-color': 'rgba(255, 255, 255, 0.87)',
  'input-disabled-line-color': 'rgba(255, 255, 255, 0.06)',
  'input-outlined-idle-border-color': 'rgba(255, 255, 255, 0.38)',
  'input-outlined-hover-border-color': 'rgba(255, 255, 255, 0.87)',
  'input-outlined-disabled-border-color': 'rgba(255, 255, 255, 0.06)',
  'input-fill-color': 'rgba(255, 255, 255, 0.05)',
  'input-disabled-fill-color': 'rgba(255, 255, 255, 0.02)',
  'input-ink-color': 'rgba(255, 255, 255, 0.87)',
  'input-label-ink-color': 'rgba(255, 255, 255, 0.6)',
  'input-disabled-ink-color': 'rgba(255, 255, 255, 0.37)',
  'input-dropdown-icon-color': 'rgba(255, 255, 255, 0.54)',
  'codemirror-keyword': '#C792EA',
  'codemirror-operator': '#89DDFF',
  'codemirror-variable': '#f07178',
  'codemirror-variable-2': '#EEFFFF',
  'codemirror-variable-3': '#DECB6B',
  'codemirror-builtin': '#FFCB6B',
  'codemirror-atom': '#F78C6C',
  'codemirror-number': '#FF5370',
  'codemirror-def': '#82AAFF',
  'codemirror-string': '#C3E88D',
  'codemirror-string-2': '#f07178',
  'codemirror-comment': '#545454',
  'codemirror-tag': '#FF5370',
  'codemirror-meta': '#FFCB6B',
  'codemirror-attribute': '#C792EA',
  'codemirror-property': '#C792EA',
  'codemirror-qualifier': '#DECB6B',
  'codemirror-type': '#DECB6B',
  'energy-grid-return-color': '#a280db',
  'map-filter': 'invert(.9) hue-rotate(170deg) brightness(1.5) contrast(1.2) saturate(.3)',
  'disabled-color': '#464646',
};

/*
 * Home Assistant's light defaults for the same names, so Light means light even on a dashboard
 * that is dark: removing the dark values would only hand the preview the page's own (dark) ones.
 */
const LIGHT_STYLES: Record<string, string> = {
  'primary-background-color': '#fafafa',
  'card-background-color': '#ffffff',
  'ha-card-background': '#ffffff',
  'secondary-background-color': '#e5e5e5',
  'clear-background-color': '#ffffff',
  'primary-text-color': '#212121',
  'secondary-text-color': '#727272',
  'disabled-text-color': '#bdbdbd',
  'app-header-text-color': '#ffffff',
  'app-header-background-color': '#03a9f4',
  'switch-unchecked-button-color': '#fafafa',
  'switch-unchecked-track-color': '#000000',
  'divider-color': 'rgba(0, 0, 0, .12)',
  'outline-color': 'rgba(0, 0, 0, .12)',
  'outline-hover-color': 'rgba(0, 0, 0, .24)',
  'mdc-ripple-color': '#000000',
  'input-idle-line-color': 'rgba(0, 0, 0, 0.42)',
  'input-hover-line-color': 'rgba(0, 0, 0, 0.87)',
  'input-fill-color': 'rgba(0, 0, 0, 0.04)',
  'input-ink-color': 'rgba(0, 0, 0, 0.87)',
  'input-label-ink-color': 'rgba(0, 0, 0, 0.6)',
  'input-dropdown-icon-color': 'rgba(0, 0, 0, 0.54)',
  'disabled-color': '#bdbdbd',
};

export class DeclutteringPreviewFrame extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  /** What the card built: a card config, or for a badge/row/element their config. */
  @property({ attribute: false }) public config?: unknown;
  @property({ attribute: false }) public kind: LovelaceThingType = 'card';
  /** For a repeat: how many copies and the column settings, so the caption can say the column count. */
  @property({ attribute: false }) public repeat?: RepeatHint;
  /** The line highlighted in the YAML view: the one the last edit changed. */
  @property({ attribute: false }) public changedLine?: number;
  /*
   * Rendered only, with no YAML switch of its own: the card editor's result preview has its
   * own YAML / Rendered switch (idea 19), and the frame is its Rendered side (ideas 53, 54).
   */
  @property({ attribute: false }) public renderedOnly = false;
  /** The layout hui-card is given, `grid` for a card in a section, as the dashboard would. */
  @property({ attribute: false }) public layout?: string;

  @state() private _mode: PreviewMode = 'rendered';
  @state() private _theme: PreviewTheme = 'light';
  @state() private _width: PreviewWidth = 'desktop';

  // What the YAML looked like last time, so the changed line can be found.
  private _lastYaml?: string;
  @state() private _changed?: number;
  // How wide the stage really is: a tablet width asked for in a narrower dialog is capped.
  @state() private _measured?: number;
  private _sizes?: ResizeObserver;

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
      }
      .bar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin: 0 0 10px;
      }
      .bar .spacer {
        flex: 1;
      }
      .seg {
        display: inline-flex;
        border: 1px solid var(--divider-color);
        border-radius: 20px;
        overflow: hidden;
        font-size: 0.85em;
      }
      .seg button {
        border: 0;
        background: transparent;
        color: var(--secondary-text-color);
        padding: 5px 12px;
        font: inherit;
        cursor: pointer;
      }
      .seg button[aria-pressed='true'] {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
      }
      .stage {
        background: var(--primary-background-color);
        border-radius: 12px;
        padding: 12px;
        margin: 0 auto;
        position: relative;
      }
      .stage.narrow {
        border-left: 1px dashed var(--secondary-text-color);
        border-right: 1px dashed var(--secondary-text-color);
        border-radius: 0;
      }
      .both {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .label {
        font-size: 0.8em;
        color: var(--secondary-text-color);
        margin: 0 0 6px;
      }
      .caption {
        text-align: center;
        font-size: 0.8em;
        color: var(--secondary-text-color);
        margin: 6px 0 0;
      }
      pre {
        margin: 0;
        padding: 8px 12px;
        font-family: var(--ha-font-family-code, monospace);
        font-size: 0.85em;
        line-height: 1.5;
        overflow: auto;
        -webkit-user-select: text;
        user-select: text;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
      }
      /* One block per line: inline spans would run together on a single line (round 1, idea 19). */
      pre span {
        display: block;
        min-height: 1.5em;
        white-space: pre;
      }
      pre .hl {
        background: color-mix(in srgb, var(--warning-color, #ffa600) 20%, transparent);
      }
      .note {
        font-size: 0.8em;
        color: var(--secondary-text-color);
        margin: 6px 0 0;
      }
    `;
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    const stage = this.renderRoot.querySelector('.stage');
    if (!stage || typeof ResizeObserver === 'undefined') return;
    this._sizes ??= new ResizeObserver((entries) => {
      const width = Math.round(entries[0]?.contentRect.width ?? 0);
      // Padding either side of the stage is not the card's width.
      if (width && width !== this._measured) this._measured = width;
    });
    this._sizes.disconnect();
    this._sizes.observe(stage);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._sizes?.disconnect();
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (changed.has('config')) {
      const yaml = toYaml(this.config ?? {});
      if (this._lastYaml !== undefined && this._lastYaml !== yaml) {
        const before = this._lastYaml.split('\n');
        const after = yaml.split('\n');
        const at = after.findIndex((line, index) => before[index] !== line);
        this._changed = at === -1 ? undefined : at;
      }
      this._lastYaml = yaml;
    }
  }

  protected render(): TemplateResult {
    if (!this.hass || !this.config) return html``;
    const seg = <T extends string>(
      options: T[],
      value: T,
      pick: (v: T) => void,
      label: (v: T) => string,
    ): TemplateResult =>
      html`<span class="seg" role="group">
        ${options.map(
          (option) =>
            html`<button aria-pressed=${option === value} @click=${(): void => pick(option)}>${label(option)}</button>`,
        )}
      </span>`;
    return html`
      <div class="bar">
        ${
          this.renderedOnly
            ? nothing
            : seg<PreviewMode>(
                ['rendered', 'yaml'],
                this._mode,
                (v) => (this._mode = v),
                (v) => localize(`preview.mode_${v}`, undefined, this.hass),
              )
        }
        <span class="spacer"></span>
        ${
          (this.renderedOnly || this._mode === 'rendered') && this.kind !== 'element'
            ? html`${seg<PreviewTheme>(
                ['light', 'dark', 'both'],
                this._theme,
                (v) => (this._theme = v),
                (v) => localize(`preview.theme_${v}`, undefined, this.hass),
              )}
              ${seg<PreviewWidth>(
                ['desktop', 'tablet', 'phone'],
                this._width,
                (v) => (this._width = v),
                (v) => localize(`preview.width_${v}`, undefined, this.hass),
              )}`
            : nothing
        }
      </div>
      ${this._mode === 'yaml' && !this.renderedOnly ? this._renderYaml() : this._renderRendered()}
    `;
  }

  private _renderYaml(): TemplateResult {
    const lines = (this._lastYaml ?? toYaml(this.config)).split('\n');
    const changed = this.changedLine ?? this._changed;
    return html`
      <pre>${lines.map((line, index) => html`<span class=${index === changed ? 'hl' : ''}>${line}</span>`)}</pre>
      ${changed !== undefined ? html`<p class="note">${localize('preview.changed_line', undefined, this.hass)}</p>` : nothing}
    `;
  }

  private _renderRendered(): TemplateResult {
    const width = PREVIEW_WIDTHS[this._width];
    const style = width ? `width: ${width}px; max-width: 100%;` : '';
    const stage = (dark: boolean, label?: string): TemplateResult => html`
      <div class="stage ${width ? 'narrow' : ''}" style=${style}>
        ${label ? html`<p class="label">${label}</p>` : nothing} ${this._thing(dark)}
      </div>
    `;
    const caption = this._caption(width);
    return html`
      ${
        this._theme === 'both'
          ? html`<div class="both">
              ${stage(false, localize('preview.theme_light', undefined, this.hass))}
              ${stage(true, localize('preview.theme_dark', undefined, this.hass))}
            </div>`
          : stage(this._theme === 'dark')
      }
      ${caption ? html`<p class="caption">${caption}</p>` : nothing}
    `;
  }

  /**
   * The width in pixels and, for a repeat, the column count it gives. The stage cannot be
   * wider than the dialog, so when the dialog is narrower than the width asked for, the
   * caption says what the card really got rather than what was asked.
   */
  private _caption(width: number | undefined): string {
    if (!width) return '';
    const measured = this._measured;
    const actual = measured && measured < width - 1 ? measured : width;
    const repeat = this.repeat;
    let text: string;
    if (!repeat || repeat.copies < 2) text = localize('preview.width_px', { width: actual }, this.hass);
    else {
      const columns = columnsFor(actual, repeat.max, repeat.minWidth);
      text = localize(
        (repeat.minWidth ? 'preview.width_columns_min' : 'preview.width_columns') + (columns === 1 ? '_one' : ''),
        { width: actual, columns, min: repeat.minWidth ?? '' },
        this.hass,
      );
    }
    return actual === width ? text : `${text} ${localize('preview.width_narrower', { width }, this.hass)}`;
  }

  // One element per theme, kept across renders so the card inside is not rebuilt on every keystroke.
  private _things = new Map<string, HTMLElement>();

  private _thing(dark: boolean): HTMLElement | TemplateResult {
    const key = `${dark}:${JSON.stringify(this.config)}:${this.kind}`;
    for (const known of [...this._things.keys()]) {
      if (known !== key && known.startsWith(`${dark}:`)) this._things.delete(known);
    }
    let el = this._things.get(key);
    if (!el) {
      const made = this._make();
      if (!made) return html`<p class="note">${localize('preview.cannot_render', undefined, this.hass)}</p>`;
      const holder = document.createElement('div');
      holder.appendChild(made);
      el = holder;
      this._things.set(key, el);
    }
    const inner = el.firstElementChild as any;
    if (inner) inner.hass = this.hass;
    this._applyTheme(el, dark);
    return el;
  }

  private _make(): HTMLElement | undefined {
    const config = this.config as any;
    if (this.kind === 'card') {
      const Wrapper = customElements.get('hui-card') as any;
      if (!Wrapper) return undefined;
      const card = new Wrapper();
      card.preview = true;
      if (this.layout) card.layout = this.layout;
      card.config = config;
      return card;
    }
    if (this.kind === 'badge') {
      const Wrapper = customElements.get('hui-badge') as any;
      if (!Wrapper) return undefined;
      const badge = new Wrapper();
      badge.preview = true;
      badge.config = config;
      return badge;
    }
    // Rows and elements have no wrapper; show them in an entities card / picture-elements card.
    const Wrapper = customElements.get('hui-card') as any;
    if (!Wrapper) return undefined;
    const card = new Wrapper();
    card.preview = true;
    card.config =
      this.kind === 'row'
        ? { type: 'entities', entities: [config] }
        : {
            type: 'picture-elements',
            image: 'https://demo.home-assistant.io/stub_config/floorplan.png',
            elements: [config],
          };
    return card;
  }

  // The variables applied last time, so a switch back to light takes every one of them off again.
  private _themed = new WeakMap<HTMLElement, string[]>();

  /*
   * The dashboard's own theme in the mode asked for, applied to the holder only. The
   * custom-card-helpers copy of applyThemesOnElement knows nothing of dark mode, so dark is
   * done here the way the frontend does it: Home Assistant's own dark defaults, then the
   * theme's `modes.dark` variables on top when it has them.
   */
  private _applyTheme(el: HTMLElement, dark: boolean): void {
    const hass = this.hass as any;
    const themes = hass?.themes;
    const selected: string = hass?.selectedTheme?.theme ?? themes?.default_theme ?? 'default';
    if (themes && selected !== 'default') {
      try {
        applyThemesOnElement(el, themes, selected, false);
      } catch {
        // Older frontends take a different shape; the light preview still shows.
      }
    }
    for (const name of this._themed.get(el) ?? []) el.style.removeProperty(`--${name}`);
    const vars: Record<string, string> = dark
      ? { ...DARK_STYLES, ...(themes?.themes?.[selected]?.modes?.dark ?? {}) }
      : { ...LIGHT_STYLES, ...(themes?.themes?.[selected]?.modes?.light ?? {}) };
    for (const [name, value] of Object.entries(vars)) el.style.setProperty(`--${name}`, String(value));
    this._themed.set(el, Object.keys(vars));
    el.style.background = 'var(--primary-background-color)';
    el.style.color = 'var(--primary-text-color)';
    el.style.colorScheme = dark ? 'dark' : 'light';
  }
}

export const PREVIEW_FRAME_TAG = 'decluttering-preview-frame';
if (!customElements.get(PREVIEW_FRAME_TAG)) customElements.define(PREVIEW_FRAME_TAG, DeclutteringPreviewFrame);
