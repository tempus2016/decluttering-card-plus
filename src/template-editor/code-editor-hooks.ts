import { LitElement, html, TemplateResult, css, CSSResult, PropertyValues, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceConfig } from 'custom-card-helpers';
import { DeclutteringTemplateConfig } from '../types';
import { Completion, PlaceholderSpan, SpanKind, completionsAt, placeholderSpans } from '../code-hooks';
import { tryPlaceholderIn } from '../playground';
import { exampleSets, exampleVariables } from '../examples';
import { collectSharedDeclarations, collectTemplates } from '../templates';
import { definedNames, lintTemplate } from '../lint';
import { RESOLVERS, getDeclarations, normaliseVariables, templateDefaults, variableName } from '../variables';
import { localize } from '../localize';
import { previewExamples } from '../shared';
import { watchTarget } from './watch-target';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * Hooks into Home Assistant's code editor on the Card tab (ideas 25 and 27). The YAML
 * editor Home Assistant draws when Show code editor is pressed is a CodeMirror 6 instance,
 * and ha-code-editor exposes it as `codemirror` along with the module it loaded it from.
 * With those, placeholders are coloured by what they resolve to under the chosen example,
 * and a small list opens after `[[`, `|` and a step's `:` offering what fits there.
 *
 * Everything here is best effort against internals that are not an API: when the editor is
 * not found, or the module lacks what is needed, the colours fall back to a read-only copy
 * under the editor and the completions to nothing. Nothing here ever changes the YAML
 * except to insert what the user picked.
 */

const PH_STYLE = `
  .dcp-ph { border-radius: 3px; padding: 0 1px; }
  .dcp-ph-ok { background: color-mix(in srgb, var(--warning-color, #e39400) 22%, transparent); }
  .dcp-ph-unset { background: color-mix(in srgb, var(--secondary-text-color, #727272) 18%, transparent); }
  .dcp-ph-bad { background: color-mix(in srgb, var(--error-color, #db4437) 14%, transparent); text-decoration: underline wavy var(--error-color, #db4437); }
`;

const hooked = new WeakSet<Element>();

function deepFind(root: Element | ShadowRoot | null | undefined, tag: string): Element | undefined {
  if (!root) return undefined;
  const queue: (Element | ShadowRoot)[] = [root];
  while (queue.length) {
    const node = queue.shift() as Element | ShadowRoot;
    const hit = node.querySelector?.(tag);
    if (hit) return hit;
    const children: Element[] = [...((node as Element).children ?? [])];
    for (const child of children) {
      if (child.shadowRoot) queue.push(child.shadowRoot);
      queue.push(child);
    }
    if ((node as Element).shadowRoot) queue.push((node as Element).shadowRoot as ShadowRoot);
  }
  return undefined;
}

/*
 * The three CodeMirror classes the placeholder colours need. Home Assistant 2026.7 stopped
 * exporting them from ha-code-editor's loaded module, but they are still within reach through
 * what it does export, and they must be the editor's own copies - a second copy of CodeMirror
 * bundled here would be rejected by the editor's state. In order: the export itself; a
 * compartment's reconfigure effect, whose class is StateEffect; the active-line extension, which
 * is a ViewPlugin; and a decoration the active-line plugin has drawn, whose base class is
 * Decoration. Anything missing leaves the coloured copy under the editor instead.
 */
export function codeMirrorClasses(cm: any, view: any): { Decoration?: any; ViewPlugin?: any; StateEffect?: any } {
  let StateEffect = cm?.StateEffect;
  let ViewPlugin = cm?.ViewPlugin;
  let Decoration = cm?.Decoration;
  try {
    if (!StateEffect && cm?.langCompartment?.reconfigure) {
      const effect = cm.langCompartment.reconfigure([]);
      if (effect?.constructor?.appendConfig) StateEffect = effect.constructor;
    }
  } catch {
    // keep looking
  }
  let activeLine: any;
  try {
    activeLine = cm?.highlightActiveLine?.();
    if (!ViewPlugin && activeLine?.constructor?.fromClass) ViewPlugin = activeLine.constructor;
  } catch {
    // keep looking
  }
  try {
    if (!Decoration && activeLine && view?.plugin) {
      const plugin = view.plugin(activeLine);
      let found: any;
      plugin?.decorations?.between?.(0, view.state.doc.length, (_from: number, _to: number, value: any) => {
        found = value;
        return false;
      });
      const base = found ? Object.getPrototypeOf(found.constructor) : undefined;
      if (base?.mark && base?.set) Decoration = base;
    }
  } catch {
    // the copy stands in
  }
  return { Decoration, ViewPlugin, StateEffect };
}

export class DeclutteringCodeHooks extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public lovelace?: LovelaceConfig | null;
  @property({ attribute: false }) public config?: DeclutteringTemplateConfig;
  /** The card editor whose code view is hooked. */
  @property({ attribute: false }) public target?: Element;

  @state() private _editor?: any;
  @state() private _decorated = false;
  @state() private _completion?: Completion & { x: number; y: number; pos: number };
  @state() private _selected = 0;
  @state() private _spans: PlaceholderSpan[] = [];
  private _stopWatching?: () => void;
  private _tries = 0;

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
      }
      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        font-size: 0.85em;
        color: var(--secondary-text-color);
        margin: 8px 0;
      }
      .legend i {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 3px;
        vertical-align: -1px;
        margin-right: 5px;
      }
      .legend .ok {
        background: color-mix(in srgb, var(--warning-color, #e39400) 40%, transparent);
      }
      .legend .unset {
        background: color-mix(in srgb, var(--secondary-text-color, #727272) 35%, transparent);
      }
      .legend .bad {
        background: color-mix(in srgb, var(--error-color, #db4437) 30%, transparent);
      }
      .pop {
        position: fixed;
        z-index: 1000;
        min-width: 220px;
        max-height: 260px;
        overflow: auto;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        padding: 4px 0;
        font-size: 0.9em;
      }
      .pop .hd {
        padding: 4px 14px 6px;
        font-size: 0.8em;
        color: var(--secondary-text-color);
        border-bottom: 1px solid var(--divider-color);
        margin-bottom: 2px;
      }
      .pop div.opt {
        display: flex;
        gap: 12px;
        padding: 6px 14px;
        cursor: pointer;
        font-family: var(--ha-font-family-code, monospace);
      }
      .pop div.opt.sel {
        background: color-mix(in srgb, var(--primary-color) 14%, transparent);
      }
      .pop div.opt small {
        margin-left: auto;
        color: var(--secondary-text-color);
        font-family: var(--ha-font-family, inherit);
      }
      pre.copy {
        margin: 0;
        padding: 8px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        font-family: var(--ha-font-family-code, monospace);
        font-size: 0.85em;
        white-space: pre-wrap;
        word-break: break-word;
      }
      pre.copy .dcp-ph {
        border-radius: 3px;
        padding: 0 1px;
      }
      pre.copy .dcp-ph-ok {
        background: color-mix(in srgb, var(--warning-color, #e39400) 22%, transparent);
      }
      pre.copy .dcp-ph-unset {
        background: color-mix(in srgb, var(--secondary-text-color, #727272) 18%, transparent);
      }
      pre.copy .dcp-ph-bad {
        background: color-mix(in srgb, var(--error-color, #db4437) 14%, transparent);
        text-decoration: underline wavy var(--error-color, #db4437);
      }
    `;
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('target')) this._watch();
    if (changed.has('config') || changed.has('hass')) {
      // The example or the template changed: colours are worked out again.
      this._refresh();
    }
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopWatching?.();
    this._stopWatching = undefined;
  }

  // See watch-target.ts: the editor upgrades late and its code editor sits behind shadow roots.
  private _watch(): void {
    this._stopWatching?.();
    this._stopWatching = undefined;
    this._editor = undefined;
    this._decorated = false;
    const target = this.target;
    if (!target) return;
    this._stopWatching = watchTarget(target, () => this._attach());
  }

  /** Finds ha-code-editor inside the card editor and hooks it once; waits for CodeMirror to load. */
  private _attach(): void {
    const target = this.target;
    if (!target) return;
    const editor = deepFind(target.shadowRoot ?? target, 'ha-code-editor') as any;
    if (!editor) {
      if (this._editor) {
        this._editor = undefined;
        this._completion = undefined;
      }
      return;
    }
    if (this._editor === editor) return;
    this._editor = editor;
    this._tries = 0;
    this._hookWhenReady(editor);
  }

  private _hookWhenReady(editor: any): void {
    if (this._editor !== editor) return;
    const view = editor.codemirror;
    if (!view) {
      if (this._tries++ < 40) setTimeout(() => this._hookWhenReady(editor), 100);
      return;
    }
    if (!hooked.has(editor)) {
      hooked.add(editor);
      this._decorate(editor, view);
      editor.addEventListener('keyup', (ev: KeyboardEvent) => this._keyup(ev));
      editor.addEventListener('click', () => this._complete());
      editor.addEventListener('keydown', (ev: KeyboardEvent) => this._keydown(ev), true);
      editor.addEventListener('focusout', () => setTimeout(() => (this._completion = undefined), 150));
    }
    this._refresh();
  }

  /* ---------------------------------------------------------------- what a placeholder is */

  private _resolved(): { template: any; variables: any[]; bad: Map<string, string> } | undefined {
    const config = this.config;
    if (!config) return undefined;
    const ll = this.lovelace;
    const resolved = collectTemplates(ll, undefined, config)[config.template] ?? config;
    const variables =
      exampleVariables(resolved, previewExamples.get(config.template)) ??
      normaliseVariables(templateDefaults(resolved));
    // What the lint says will not work, by the name it names.
    const bad = new Map<string, string>();
    for (const finding of lintTemplate(config, definedNames(resolved))) {
      if (finding.level !== 'warning') continue;
      const name = finding.params.name ?? finding.params.placeholder ?? finding.params.step;
      if (name) {
        bad.set(
          name,
          localize(finding.key, finding.params, this.hass) +
            (finding.params.closest
              ? localize('error.did_you_mean', { closest: finding.params.closest }, this.hass)
              : ''),
        );
      }
    }
    return { template: resolved, variables, bad };
  }

  private _judge(
    placeholder: string,
    ctx: { template: any; variables: any[]; bad: Map<string, string> },
  ): { kind: SpanKind; message?: string } {
    const head = placeholder.slice(2).split(/[|?\]]/)[0];
    for (const [name, message] of ctx.bad) {
      if (placeholder.includes(name)) return { kind: 'bad', message };
    }
    let result;
    try {
      result = tryPlaceholderIn(ctx.template, ctx.variables, placeholder, this.hass);
    } catch {
      return { kind: 'unset' };
    }
    if (result.whole.kind === 'removed') {
      return { kind: 'unset', message: localize('code_hooks.unset_optional', { name: head }, this.hass) };
    }
    if (result.whole.kind === 'unresolved' || result.whole.value === undefined) {
      return result.unset.length
        ? { kind: 'unset', message: localize('code_hooks.unset', { name: result.unset.join(', ') }, this.hass) }
        : { kind: 'bad', message: localize('code_hooks.left_as_written', undefined, this.hass) };
    }
    const value = typeof result.whole.value === 'string' ? result.whole.value : JSON.stringify(result.whole.value);
    return { kind: 'ok', message: value };
  }

  private _refresh(): void {
    const editor = this._editor;
    const ctx = this._resolved();
    const text = typeof editor?.value === 'string' ? editor.value : '';
    this._spans = ctx ? placeholderSpans(text, (p) => this._judge(p, ctx)) : [];
    // The CodeMirror plugin reads the spans through this element; nudge it.
    const view = editor?.codemirror;
    if (view && this._decorated) {
      try {
        view.dispatch({});
      } catch {
        // A view that was torn down; the next attach makes a new one.
      }
    }
  }

  /* ---------------------------------------------------------------- idea 25: decorations */

  private _decorate(editor: any, view: any): void {
    const { Decoration, ViewPlugin, StateEffect } = codeMirrorClasses(editor._loadedCodeMirror, view);
    if (!Decoration || !ViewPlugin || !StateEffect) return;
    const compute = (v: any): any => {
      const ctx = this._resolved();
      if (!ctx) return Decoration.none;
      const text = v.state.doc.toString();
      const spans = placeholderSpans(text, (p) => this._judge(p, ctx));
      this._spans = spans;
      return Decoration.set(
        spans.map((span) =>
          Decoration.mark({
            class: `dcp-ph dcp-ph-${span.kind}`,
            attributes: span.message ? { title: span.message } : undefined,
          }).range(span.from, span.to),
        ),
        true,
      );
    };
    const plugin = ViewPlugin.fromClass(
      class {
        decorations: any;
        constructor(v: any) {
          this.decorations = compute(v);
        }
        update(update: any): void {
          this.decorations = compute(update.view);
        }
      },
      { decorations: (v: any) => v.decorations },
    );
    try {
      view.dispatch({ effects: StateEffect.appendConfig.of([plugin]) });
      const style = document.createElement('style');
      style.textContent = PH_STYLE;
      (editor.shadowRoot ?? editor).appendChild(style);
      this._decorated = true;
    } catch {
      this._decorated = false;
    }
  }

  /* ---------------------------------------------------------------- idea 27: completions */

  private _keyup(ev: KeyboardEvent): void {
    if (['ArrowDown', 'ArrowUp', 'Enter', 'Tab', 'Escape'].includes(ev.key)) return;
    this._complete();
  }

  private _complete(): void {
    const view = this._editor?.codemirror;
    const config = this.config;
    if (!view || !config) return;
    const text: string = view.state.doc.toString();
    const pos: number = view.state.selection.main.head;
    const resolved = collectTemplates(this.lovelace, undefined, config)[config.template] ?? config;
    const lets = normaliseVariables((resolved as any).let)
      .map(variableName)
      .filter((name): name is string => name !== undefined);
    const sampleEntity = this._sampleEntity(resolved);
    const completion = completionsAt(text, pos, {
      variables: getDeclarations(config),
      lets,
      shared: collectSharedDeclarations(this.lovelace),
      sample: sampleEntity
        ? (step): string | undefined => {
            try {
              return RESOLVERS[step]?.(sampleEntity, this.hass);
            } catch {
              return undefined;
            }
          }
        : undefined,
    });
    if (!completion) {
      this._completion = undefined;
      return;
    }
    const coords = view.coordsAtPos(pos);
    this._completion = { ...completion, x: coords?.left ?? 0, y: coords?.bottom ?? 0, pos };
    this._selected = 0;
  }

  /** The example's entity, for sample values beside the resolver steps. */
  private _sampleEntity(template: any): string | undefined {
    // The example being previewed; with none picked, the template's first example, whose
    // entity is a real one - the defaults usually leave `entity` for the card to set.
    const picked = previewExamples.get(this.config?.template ?? '');
    const variables = [
      ...(exampleVariables(template, picked) ?? []),
      ...(picked === undefined ? (exampleSets(template)[0] ?? []) : []),
      ...normaliseVariables(templateDefaults(template)),
    ];
    for (const entry of variables) {
      const value = Object.values(entry)[0];
      if (typeof value === 'string' && /^[a-z_]+\.[a-z0-9_]+$/.test(value)) return value;
    }
    return undefined;
  }

  private _keydown(ev: KeyboardEvent): void {
    const completion = this._completion;
    if (!completion) return;
    if (ev.key === 'ArrowDown') {
      this._selected = (this._selected + 1) % completion.options.length;
    } else if (ev.key === 'ArrowUp') {
      this._selected = (this._selected - 1 + completion.options.length) % completion.options.length;
    } else if (ev.key === 'Enter' || ev.key === 'Tab') {
      this._accept(this._selected);
    } else if (ev.key === 'Escape') {
      this._completion = undefined;
    } else return;
    ev.preventDefault();
    ev.stopPropagation();
  }

  private _accept(index: number): void {
    const completion = this._completion;
    const view = this._editor?.codemirror;
    if (!completion || !view) return;
    const option = completion.options[index];
    if (!option) return;
    const insert = option.insert ?? option.label;
    try {
      view.dispatch({
        changes: { from: completion.from, to: completion.pos, insert },
        selection: { anchor: completion.from + insert.length },
      });
      view.focus();
    } catch {
      // The view was replaced under us; nothing to insert into.
    }
    this._completion = undefined;
  }

  /* ---------------------------------------------------------------- rendering */

  protected render(): TemplateResult {
    if (!this._editor) return html``;
    return html`
      <div class="legend">
        <span><i class="ok"></i>${localize('code_hooks.legend_ok', undefined, this.hass)}</span>
        <span><i class="unset"></i>${localize('code_hooks.legend_unset', undefined, this.hass)}</span>
        <span><i class="bad"></i>${localize('code_hooks.legend_bad', undefined, this.hass)}</span>
        <span>${localize('code_hooks.legend_hint', undefined, this.hass)}</span>
      </div>
      ${this._decorated ? nothing : this._renderCopy()}
      ${this._completion ? this._renderPop(this._completion) : nothing}
    `;
  }

  /** Without CodeMirror's decorations, the same colours on a read-only copy under the editor. */
  private _renderCopy(): TemplateResult {
    const text = typeof this._editor?.value === 'string' ? this._editor.value : '';
    if (!text) return html``;
    const parts: (string | TemplateResult)[] = [];
    let at = 0;
    for (const span of this._spans) {
      parts.push(text.slice(at, span.from));
      parts.push(html`<span class="dcp-ph dcp-ph-${span.kind}" title=${span.message ?? ''}>${span.text}</span>`);
      at = span.to;
    }
    parts.push(text.slice(at));
    return html`<pre class="copy">${parts}</pre>`;
  }

  private _renderPop(completion: Completion & { x: number; y: number }): TemplateResult {
    return html`
      <div class="pop" style="left: ${completion.x}px; top: ${completion.y + 4}px" role="listbox">
        <div class="hd">
          ${localize(`code_hooks.heading_${completion.heading}`, { template: this.config?.template ?? '' }, this.hass)}
        </div>
        ${completion.options.slice(0, 40).map(
          (option, index) => html`
            <div
              class="opt ${index === this._selected ? 'sel' : ''}"
              role="option"
              aria-selected=${index === this._selected}
              @mousedown=${(ev: Event): void => {
                ev.preventDefault();
                this._accept(index);
              }}
            >
              ${option.label} ${option.detail ? html`<small>${option.detail}</small>` : nothing}
            </div>
          `,
        )}
      </div>
    `;
  }
}

export const CODE_HOOKS_TAG = 'decluttering-code-hooks';
if (!customElements.get(CODE_HOOKS_TAG)) customElements.define(CODE_HOOKS_TAG, DeclutteringCodeHooks);
