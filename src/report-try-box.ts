import { html, TemplateResult, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { FormSchemaEntry } from './types';
import { PlaygroundResult } from './playground';
import { DeclutteringPlaceholderTool } from './template-editor/placeholder-tool';
import { TryScope, tryInReport, tryScopes } from './report-try';
import { TraceReport } from './trace';
import { localize } from './localize';

/*
 * The report view's Try a placeholder box (#376): the template editor's tool, with a scope
 * picker in place of the example strip. The scopes are the builds in the report - the card,
 * each copy of a repeat, each card nested inside and each item template's fill - and what is
 * typed in is built the way that build was, against Home Assistant as it is now. Loaded only
 * when a report is on show, so a dashboard without one never downloads it.
 */
export class DeclutteringReportTry extends DeclutteringPlaceholderTool {
  @property({ attribute: false }) public reports: TraceReport[] = [];
  /** `redact: false` on the card: values are shown as they are. */
  @property({ attribute: false }) public unredacted = false;

  @state() private _scope = 0;

  private _scopesFor?: { reports: TraceReport[]; scopes: TryScope[] };

  private get _scopes(): TryScope[] {
    if (this._scopesFor?.reports !== this.reports) {
      this._scopesFor = { reports: this.reports, scopes: tryScopes(this.reports, this.hass) };
    }
    return this._scopesFor.scopes;
  }

  private get _current(): TryScope | undefined {
    const scopes = this._scopes;
    return scopes[Math.min(this._scope, scopes.length - 1)];
  }

  protected render(): TemplateResult {
    const scopes = this._scopes;
    const scope = this._current;
    if (!scope || !this.hass) return html``;
    const t = (key: string, params?: Record<string, unknown>): string => localize(key, params, this.hass);
    const value = this._expression || scope.offered[0] || '';
    const schema: FormSchemaEntry[] = [
      {
        name: 'scope',
        label: t('report_try.scope'),
        selector: {
          select: {
            mode: 'dropdown',
            options: scopes.map((each, index) => ({ value: String(index), label: each.label })),
          },
        },
      },
      {
        name: 'placeholder',
        label: t('placeholder_tool.placeholder'),
        selector: {
          select: {
            mode: 'dropdown',
            custom_value: true,
            options: scope.offered.map((each) => ({ value: each, label: each })),
          },
        },
      },
    ];
    return html`
      <ha-expansion-panel outlined>
        <span slot="header">${t('placeholder_tool.header')}</span>
        <div style="padding: 12px 4px 4px">
          <p class="hint">${t('report_try.hint')}</p>
          <ha-form
            .hass=${this.hass}
            .data=${{ scope: String(scopes.indexOf(scope)), placeholder: value }}
            .schema=${schema}
            .computeLabel=${(s: FormSchemaEntry): string => s.label ?? s.name}
            @value-changed=${this._picked}
          ></ha-form>
          ${this._renderChips(value)} ${value ? this._renderResult(value) : nothing}
        </div>
      </ha-expansion-panel>
    `;
  }

  protected _result(expression: string): PlaygroundResult | undefined {
    const scope = this._current;
    if (!scope) return undefined;
    try {
      return tryInReport(scope, expression, this.reports, !this.unredacted);
    } catch {
      return undefined;
    }
  }

  protected _picked(ev: CustomEvent): void {
    ev.stopPropagation();
    const data = ev.detail.value as { scope?: string; placeholder?: string };
    // The placeholder stays when the scope changes: the same one in another build is often the question.
    this._scope = Number(data.scope ?? this._scope);
    this._expression = typeof data.placeholder === 'string' ? data.placeholder : '';
  }
}

export const REPORT_TRY_TAG = 'decluttering-report-try';
if (!customElements.get(REPORT_TRY_TAG)) customElements.define(REPORT_TRY_TAG, DeclutteringReportTry);
