import { html, TemplateResult, css, CSSResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { DeclutteringTemplateConfig, TemplateConfig } from './types';
import { collectTemplates, collectAllTemplates, mayBorrowTemplates, parentsOf } from './templates';
import { trashHass, watchForTrash } from './trash';
import { chainOf, describeCycle, describeTooDeep, findCycle, MAX_NESTING } from './cycles';
import { exampleVariables } from './examples';
import { getLovelaceConfig } from './utils';
import { localize } from './localize';
import { DeclutteringElement } from './element';
import { PREVIEW_EXAMPLE_EVENT, TEMPLATE_EDITOR_TAG, TEMPLATE_TAG, previewExamples } from './shared';

export class DeclutteringTemplate extends DeclutteringElement {
  @property({ type: Boolean, reflect: true }) preview = false;

  @state() private _template?: string;
  // The config the preview was last drawn from, and one still waiting on a borrowed parent.
  private _previewConfig?: DeclutteringTemplateConfig;
  private _pendingPreview?: DeclutteringTemplateConfig;

  // The editors live in a chunk of their own, fetched the first time one is opened (idea 4).
  static async getConfigElement(): Promise<HTMLElement> {
    await import('./editors');
    return document.createElement(TEMPLATE_EDITOR_TAG);
  }

  static getStubConfig(): DeclutteringTemplateConfig {
    return {
      type: `custom:${TEMPLATE_TAG}`,
      template: 'follow_the_sun',
      card: {
        type: 'entity',
        entity: 'sun.sun',
      },
    };
  }

  static get styles(): CSSResult {
    return css`
      ${DeclutteringElement.styles}
      .badge {
        margin: 8px;
        color: var(--primary-color);
      }
      :host([preview]) {
        display: block !important;
        border: 1px solid var(--primary-color);
      }
    `;
  }

  // A different example picked for this template's preview in its editor.
  private _examplePicked = (ev: Event): void => {
    if ((ev as CustomEvent).detail?.template === this._template) this._rebuild();
  };

  public connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener(PREVIEW_EXAMPLE_EVENT, this._examplePicked);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener(PREVIEW_EXAMPLE_EVENT, this._examplePicked);
  }

  public setConfig(config: DeclutteringTemplateConfig): void {
    // A template card draws its own definition, so it is the outermost open template for
    // whatever that definition contains. When it is nested inside another template it also
    // inherits the chain stamped above it, so the same self-reference check a consumer makes
    // applies here - otherwise a template that reaches itself through a nested template card
    // would build level after level without end.
    this._openTemplates = chainOf(config);
    this._templateName = config.template;

    if (!config.template) {
      throw new Error(localize('error.missing_template_property'));
    }

    // Said rather than thrown, for the same reason as in DeclutteringCard: a throw in
    // setConfig hides the reason the loop is fixable behind "Configuration error".
    const cycle = findCycle(this._openTemplates, config.template);
    const tooDeep = this._openTemplates.length >= MAX_NESTING;
    if (cycle || tooDeep) {
      this._error = cycle ? describeCycle(cycle) : describeTooDeep(this._openTemplates);
      return;
    }
    this._error = undefined;

    this._template = config.template;
    this._previewConfig = config;

    /*
     * The preview draws the template the way a card using it would get it: its parent
     * folded in, and the dashboard's and the view's decluttering_defaults applied. Drawn
     * from the raw config, a template that leaves a value to the dashboard previewed with
     * the brackets still in it, and one built with `extends` showed only its own few lines
     * (upstream issue #125). Outside a dashboard there is nothing to add, and it is drawn
     * as written.
     */
    const ll = getLovelaceConfig();
    const place = this._place(ll);
    const resolved = collectTemplates(ll, place.view, config, place.section)[config.template] ?? config;

    // An `extends` still standing means the parent is not on this dashboard. It may be on
    // one this dashboard borrows from, which has to be fetched, so drawing waits for hass
    // - drawn now, a child with no card of its own would fail before its parent arrived.
    const unresolved = parentsOf(resolved).length > 0;
    if (unresolved && mayBorrowTemplates(ll)) {
      this._pendingPreview = config;
      if (this._hass) this.hassAvailable(this._hass);
      return;
    }
    this._pendingPreview = undefined;
    // The config passed here IS the template, so its style is picked up as the
    // template's own - passing it again as the instance style would emit it twice.
    // Drawn with the example picked in the editor, when there is one, or the defaults as ever.
    const example = exampleVariables(resolved, previewExamples.get(config.template));
    this._setTemplateConfig(resolved, example, undefined, config.template);
  }

  protected _rebuild(): void {
    if (this._previewConfig) this.setConfig(this._previewConfig);
  }

  protected hassAvailable(hass: HomeAssistant): void {
    watchForTrash(hass);
    trashHass(hass);
    const config = this._pendingPreview;
    if (!config) return;
    this._pendingPreview = undefined;

    const ll = getLovelaceConfig();
    const place = this._place(ll);
    collectAllTemplates(hass, ll, place.view, config, place.section)
      // Drawn as written when the fetch fails, which says what is missing the same way it
      // always has.
      .catch(() => ({}) as Record<string, TemplateConfig>)
      .then((all) => {
        // A newer config may have arrived while the other dashboards were being fetched.
        if (this._previewConfig !== config) return;
        try {
          const resolved = all[config.template] ?? config;
          const example = exampleVariables(resolved, previewExamples.get(config.template));
          this._setTemplateConfig(resolved, example, undefined, config.template);
          this._error = undefined;
        } catch (err) {
          // Outside setConfig nobody catches a throw, so the card says it itself.
          this._error = (err as Error)?.message ?? String(err);
        }
      });
  }

  protected render(): TemplateResult | void {
    this.setHidden(!this.preview);
    if (this.preview) {
      return html`
        <div class="badge">${this._template}</div>
        ${super.render()}
      `;
    }
    return html``;
  }

  private setHidden(hidden: boolean): void {
    if (this.hasAttribute('hidden') !== hidden) {
      this.toggleAttribute('hidden', hidden);
      this.dispatchEvent(
        new Event('card-visibility-changed', {
          bubbles: true,
          composed: true,
        }),
      );
    }
  }
}
