import { LitElement, html, TemplateResult, css, CSSResult, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceConfig } from 'custom-card-helpers';
import { DeclutteringTemplateConfig, FormSchemaEntry } from '../types';
import { PlaygroundResult, StepResult, kindOf, tryPlaceholderIn } from '../playground';
import { listPlaceholders } from '../placeholders';
import { exampleVariables } from '../examples';
import { collectTemplates } from '../templates';
import { KNOWN_PARAM_STEPS, KNOWN_STEPS, normaliseVariables, templateDefaults } from '../variables';
import { localize } from '../localize';
import { previewExamples } from '../shared';

/*
 * Try a placeholder, inside the editor (idea 28): the docs site's playground fed by the
 * template itself - its `let:` and defaults - and the example chosen in the strip, asking
 * the real Home Assistant. Pick one of the template's placeholders or type one, add a step
 * from the chips, and read what each step handed to the next.
 */

// Steps offered as chips, the ones people reach for most; the full list is in the docs.
const CHIP_STEPS = ['slug', 'title', 'upper', 'default:', 'if:', 'bool', 'replace:', 'friendly_name', 'area', 'state'];

export class DeclutteringPlaceholderTool extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public lovelace?: LovelaceConfig | null;
  @property({ attribute: false }) public config?: DeclutteringTemplateConfig;

  @state() private _expression = '';
  @state() private _more = false;

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
      }
      .hint {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
        margin: 0 0 12px;
        font-size: 0.9em;
      }
      .chip {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 3px 8px;
        font-family: var(--ha-font-family-code, monospace);
        font-size: 0.9em;
        cursor: pointer;
        background: var(--card-background-color);
      }
      .chip:hover {
        border-color: var(--primary-color);
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9em;
      }
      th {
        text-align: left;
        color: var(--secondary-text-color);
        font-weight: 500;
        padding: 6px 8px;
        border-bottom: 1px solid var(--divider-color);
      }
      td {
        padding: 6px 8px;
        border-bottom: 1px solid var(--divider-color);
        vertical-align: top;
      }
      td.code {
        font-family: var(--ha-font-family-code, monospace);
        white-space: pre-wrap;
        word-break: break-word;
      }
      td.gap {
        color: var(--secondary-text-color);
        font-style: italic;
      }
      tr.bad td {
        background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      }
      td.bad {
        color: var(--error-color, #db4437);
      }
      td.from {
        color: var(--secondary-text-color);
      }
    `;
  }

  protected render(): TemplateResult {
    const config = this.config;
    if (!config || !this.hass) return html``;
    const offered = listPlaceholders(config);
    const value = this._expression || offered[0] || '';
    const schema: FormSchemaEntry[] = [
      {
        name: 'placeholder',
        label: localize('placeholder_tool.placeholder', undefined, this.hass),
        selector: {
          select: {
            mode: 'dropdown',
            custom_value: true,
            options: offered.map((each) => ({ value: each, label: each })),
          },
        },
      },
    ];
    return html`
      <ha-expansion-panel outlined>
        <span slot="header"
          >${localize('placeholder_tool.header', undefined, this.hass)} <small>${this._exampleLabel()}</small></span
        >
        <div style="padding: 12px 4px 4px">
          <ha-form
            .hass=${this.hass}
            .data=${{ placeholder: value }}
            .schema=${schema}
            .computeLabel=${(s: FormSchemaEntry): string => s.label ?? s.name}
            @value-changed=${this._picked}
          ></ha-form>
          <p class="hint">${localize('placeholder_tool.hint', { count: offered.length }, this.hass)}</p>
          <div class="chips">
            <span>${localize('placeholder_tool.add_step', undefined, this.hass)}</span>
            ${(this._more ? [...KNOWN_STEPS, ...KNOWN_PARAM_STEPS.map((step) => `${step}:`)] : CHIP_STEPS).map(
              (step) => html`<span class="chip" @click=${(): void => this._addStep(value, step)}>${step}</span>`,
            )}
            ${
              this._more
                ? nothing
                : html`<span
                    class="chip"
                    @click=${(): void => {
                      this._more = true;
                    }}
                    >…</span
                  >`
            }
          </div>
          ${value ? this._renderResult(value) : nothing}
        </div>
      </ha-expansion-panel>
    `;
  }

  private _exampleLabel(): string {
    const name = this.config?.template;
    const chosen = name ? previewExamples.get(name) : undefined;
    return chosen === undefined
      ? localize('placeholder_tool.under_defaults', undefined, this.hass)
      : localize('placeholder_tool.under_example', { number: chosen + 1 }, this.hass);
  }

  /* The template as the dashboard resolves it, and the variables the preview is drawn with. */
  private _result(expression: string): PlaygroundResult | undefined {
    const config = this.config;
    if (!config) return undefined;
    const resolved = collectTemplates(this.lovelace, undefined, config)[config.template] ?? config;
    const example = exampleVariables(resolved, previewExamples.get(config.template));
    const variables = example ?? normaliseVariables(templateDefaults(resolved));
    try {
      return tryPlaceholderIn(resolved, variables, expression, this.hass);
    } catch {
      return undefined;
    }
  }

  private _renderResult(expression: string): TemplateResult {
    const result = this._result(expression);
    if (!result) return html``;
    if (result.error) return html`<ha-alert alert-type="error">${result.error}</ha-alert>`;
    const rows = result.steps.length ? result.steps : [];
    const refusedAt = rows.findIndex((row) => row.kind === 'unresolved');
    return html`
      <table>
        <thead>
          <tr>
            <th>${localize('placeholder_tool.col_step', undefined, this.hass)}</th>
            <th>${localize('placeholder_tool.col_gives', undefined, this.hass)}</th>
            <th>${localize('placeholder_tool.col_from', undefined, this.hass)}</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row, index) => this._renderStep(row, index, refusedAt, result))}
          <tr class=${result.whole.kind === 'unresolved' ? 'bad' : ''}>
            <td class="code">${localize('placeholder_tool.result', undefined, this.hass)}</td>
            <td class="code ${result.whole.kind === 'unresolved' ? 'bad' : ''}">
              ${this._shown(result.whole.value, result.whole.kind)}
            </td>
            <td class="from">${localize(`placeholder_tool.kind_${result.whole.kind}`, undefined, this.hass)}</td>
          </tr>
        </tbody>
      </table>
      <p class="hint">${localize('placeholder_tool.steps_hint', undefined, this.hass)}</p>
    `;
  }

  private _renderStep(row: StepResult, index: number, refusedAt: number, result: PlaygroundResult): TemplateResult {
    const bad = row.kind === 'unresolved' && (refusedAt === -1 || index === refusedAt);
    const gap = row.value === undefined || row.value === '' || row.kind === 'removed';
    const from =
      index === 0
        ? result.unset.includes(row.step)
          ? localize('placeholder_tool.from_unset', undefined, this.hass)
          : localize('placeholder_tool.from_variables', undefined, this.hass)
        : bad
          ? localize('placeholder_tool.from_refused', undefined, this.hass)
          : '';
    return html`<tr class=${bad ? 'bad' : ''}>
      <td class="code">${row.step}</td>
      <td class="code ${bad ? 'bad' : gap ? 'gap' : ''}">
        ${gap && !bad ? localize('placeholder_tool.nothing', undefined, this.hass) : this._shown(row.value, row.kind)}
      </td>
      <td class="from">${from}</td>
    </tr>`;
  }

  private _shown(value: unknown, kind: string): string {
    if (kind === 'removed') return localize('placeholder_tool.removed', undefined, this.hass);
    if (value === undefined) return '';
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  }

  private _picked(ev: CustomEvent): void {
    ev.stopPropagation();
    const value = (ev.detail.value as { placeholder?: string }).placeholder;
    this._expression = typeof value === 'string' ? value : '';
  }

  /* A step appended before the closing brackets, keeping an optional marker at the end. */
  private _addStep(current: string, step: string): void {
    let text = current.trim() || '[[]]';
    const optional = text.endsWith('?]]');
    text = text.replace(/\??\]\]$/, '');
    const inner = text.slice(2);
    const joined = inner === '' ? step : `${inner}|${step}`;
    this._expression = `[[${joined}${optional ? '?' : ''}]]`;
  }
}

// The kinds the whole-result row names, so each has a translation.
export const KINDS: ReturnType<typeof kindOf>[] = [
  'text',
  'number',
  'boolean',
  'list',
  'mapping',
  'null',
  'unresolved',
  'removed',
];

export const PLACEHOLDER_TOOL_TAG = 'decluttering-placeholder-tool';
if (!customElements.get(PLACEHOLDER_TOOL_TAG)) customElements.define(PLACEHOLDER_TOOL_TAG, DeclutteringPlaceholderTool);
