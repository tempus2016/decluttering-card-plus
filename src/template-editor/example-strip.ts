import { LitElement, html, TemplateResult, css, CSSResult, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { HomeAssistant, LovelaceConfig, fireEvent } from 'custom-card-helpers';
import { DeclutteringTemplateConfig, FormSchemaEntry } from '../types';
import { checkExamples, exampleSets } from '../examples';
import { addExample, exampleHint } from '../example-labels';
import { collectTemplates } from '../templates';
import { normaliseVariables, templateDefaults } from '../variables';
import { localize } from '../localize';
import { PREVIEW_EXAMPLE_EVENT, previewExamples } from '../shared';

/*
 * The example strip (idea 26): which of the template's examples the preview, the
 * placeholder colours and the lint are drawn with. It sits under the tabs and stays there
 * whichever tab is open, so the current example is never out of sight. Picking changes
 * nothing in the template; `+` adds the current values as a new example, which does.
 */
export class DeclutteringExampleStrip extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public lovelace?: LovelaceConfig | null;
  @property({ attribute: false }) public config?: DeclutteringTemplateConfig;

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
        margin: 0 0 16px;
      }
      .strip {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        background: var(--secondary-background-color);
        border-radius: 8px;
      }
      .strip ha-form {
        flex: 1;
        min-width: 160px;
      }
      .passes {
        font-size: 0.85em;
        padding: 2px 8px;
        border-radius: 10px;
        background: var(--success-color, #43a047);
        color: #fff;
        white-space: nowrap;
      }
      .passes.some {
        background: var(--warning-color, #ffa600);
      }
      ha-alert {
        display: block;
        margin-top: 8px;
      }
    `;
  }

  protected render(): TemplateResult {
    const config = this.config;
    const name = config?.template;
    if (!config || !name) return html``;
    const sets = exampleSets(config);
    const chosen = previewExamples.get(name);
    const current = chosen === undefined || chosen >= sets.length ? '' : String(chosen);
    // The template as the dashboard would resolve it, so an example is checked against
    // what a card gets, parents and shared declarations included.
    const resolved = collectTemplates(this.lovelace, undefined, config)[name] ?? config;
    const failed = sets.length ? checkExamples({ [name]: resolved }, [], this.hass) : [];
    const passes = sets.length - failed.length;
    const failing = current === '' ? undefined : failed.find((each) => each.example === Number(current) + 1);
    const schema: FormSchemaEntry[] = [
      {
        name: 'example',
        label: localize('template_editor.preview_example_label', undefined, this.hass),
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: '', label: localize('template_editor.preview_defaults', undefined, this.hass) },
              ...sets.map((set, index) => {
                const hint = exampleHint(set);
                const label = localize('template_editor.example_n', { number: index + 1 }, this.hass);
                return { value: String(index), label: hint ? `${label}: ${hint}` : label };
              }),
            ],
          },
        },
      },
    ];
    return html`
      <div class="strip">
        <ha-form
          .hass=${this.hass}
          .data=${{ example: current }}
          .schema=${schema}
          .computeLabel=${(s: FormSchemaEntry): string => s.label ?? s.name}
          @value-changed=${this._picked}
        ></ha-form>
        ${
          sets.length
            ? html`<span class="passes ${passes < sets.length ? 'some' : ''}"
                >${localize('template_editor.examples_pass', { passes, total: sets.length }, this.hass)}</span
              >`
            : nothing
        }
        <ha-icon-button
          .path=${'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z'}
          .label=${localize('template_editor.example_add', undefined, this.hass)}
          @click=${this._add}
        ></ha-icon-button>
      </div>
      ${
        failing
          ? html`<ha-alert alert-type="warning"
              >${localize(
                'tools.health_example',
                { template: name, number: failing.example, problems: failing.problems.join(' ') },
                this.hass,
              )}</ha-alert
            >`
          : nothing
      }
    `;
  }

  private _picked(ev: CustomEvent): void {
    // Not part of the template's configuration, so it must not reach the settings handler.
    ev.stopPropagation();
    const name = this.config?.template;
    if (!name) return;
    const picked = (ev.detail.value as { example?: string }).example;
    if (picked === undefined || picked === '') previewExamples.delete(name);
    else previewExamples.set(name, Number(picked));
    window.dispatchEvent(new CustomEvent(PREVIEW_EXAMPLE_EVENT, { detail: { template: name } }));
    this.dispatchEvent(
      new CustomEvent('example-picked', {
        detail: { template: name, example: picked === '' ? undefined : Number(picked) },
        bubbles: true,
        composed: true,
      }),
    );
    this.requestUpdate();
  }

  /*
   * The preview's current values become a new example: the chosen example's own, or the
   * template's defaults when the preview is drawn from them. The editor writes it.
   */
  private _add(): void {
    const config = this.config;
    if (!config) return;
    const sets = exampleSets(config);
    const chosen = previewExamples.get(config.template);
    const values = chosen !== undefined && sets[chosen] ? sets[chosen] : normaliseVariables(templateDefaults(config));
    fireEvent(this, 'config-changed', { config: addExample(config, values) });
  }
}

export const EXAMPLE_STRIP_TAG = 'decluttering-example-strip';
if (!customElements.get(EXAMPLE_STRIP_TAG)) customElements.define(EXAMPLE_STRIP_TAG, DeclutteringExampleStrip);
