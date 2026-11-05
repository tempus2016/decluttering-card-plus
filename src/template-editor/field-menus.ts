import { LitElement, html, TemplateResult, css, CSSResult, PropertyValues, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant, fireEvent } from 'custom-card-helpers';
import { DeclutteringTemplateConfig, FormSchemaEntry } from '../types';
import { SettingPath, promoteSettingAs, reuseVariable, settingValue } from '../promote';
import { getDeclarations } from '../variables';
import { copyText } from '../utils';
import { localize } from '../localize';
import { watchTarget } from './watch-target';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * A menu on every field of the Card tab (idea 24). Home Assistant's own card editor draws
 * the fields, so the menu button cannot be put inside them; instead each field's place on
 * screen is measured and a small button is laid over its right edge, following it as the
 * dialog scrolls. The menu offers to make the field a variable - the same rewrite as the
 * Settings tab's Turn a setting into a variable, reached from where the value is - to point
 * it at a variable already declared, or to copy its value.
 *
 * Only fields whose value can be found in the template's own content get a button: a field
 * whose form data is not the card config (a feature's editor, a sub-dialog) is left alone,
 * so a menu never rewrites the wrong thing.
 */

interface Field {
  element: Element;
  path: SettingPath;
  value: string | number | boolean;
  label: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

const VALID_NAME = /^[A-Za-z0-9_-]+$/;

function* selectorsIn(root: Element | ShadowRoot): Generator<Element> {
  const queue: (Element | ShadowRoot)[] = [root];
  while (queue.length) {
    const node = queue.shift() as Element | ShadowRoot;
    for (const child of [...(node.children ?? [])]) {
      if (child.localName === 'ha-selector') yield child;
      // A selector that holds a form of its own (an expandable) has fields inside it too.
      if (child.shadowRoot) queue.push(child.shadowRoot);
      queue.push(child);
    }
  }
}

/** The path a selector edits: its own name, under the names of any selectors it is nested in. */
function pathOf(selector: Element): SettingPath | undefined {
  const path: SettingPath = [];
  let node: Node | null = selector;
  while (node) {
    if (node instanceof Element && node.localName === 'ha-selector') {
      const name = (node as any).name ?? (node as any).schema?.name;
      if (typeof name === 'string' && name) path.unshift(name);
    }
    node = node.parentNode instanceof ShadowRoot ? node.parentNode.host : node.parentNode;
  }
  return path.length ? path : undefined;
}

export class DeclutteringFieldMenus extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: DeclutteringTemplateConfig;
  /** The card editor whose fields get a menu. */
  @property({ attribute: false }) public target?: Element;

  @state() private _fields: Field[] = [];
  @state() private _menuFor?: Field;
  @state() private _dialogFor?: Field;
  @state() private _form: { name: string; label: string; default: string; required: boolean } = {
    name: '',
    label: '',
    default: '',
    required: false,
  };
  @state() private _error?: string;
  @state() private _reusing = false;
  private _stopWatching?: () => void;
  private _raf?: number;

  static get styles(): CSSResult {
    return css`
      :host {
        display: contents;
      }
      .btn {
        position: fixed;
        z-index: 900;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 0;
        background: transparent;
        color: var(--secondary-text-color);
        font-size: 18px;
        line-height: 28px;
        cursor: pointer;
        padding: 0;
        opacity: 0.6;
      }
      .btn:hover,
      .btn:focus-visible {
        opacity: 1;
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      }
      .menu,
      .dialog {
        position: fixed;
        z-index: 1000;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        font-size: 0.9em;
      }
      .menu {
        min-width: 220px;
        padding: 4px 0;
      }
      .menu div {
        display: flex;
        gap: 12px;
        padding: 8px 14px;
        cursor: pointer;
      }
      .menu div:hover {
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      }
      .menu div small {
        margin-left: auto;
        color: var(--secondary-text-color);
      }
      .menu .sub {
        padding-left: 28px;
        font-family: var(--ha-font-family-code, monospace);
      }
      .dialog {
        width: min(380px, 90vw);
        padding: 16px;
      }
      .dialog h4 {
        margin: 0 0 8px;
        font-size: 1.05em;
        font-weight: 500;
      }
      .dialog p {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
      }
      .dialog .actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 8px;
      }
      ha-alert {
        display: block;
        margin: 8px 0;
      }
    `;
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('target')) this._watch();
    if (changed.has('config')) this._measure();
  }

  public connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('scroll', this._onMove, true);
    window.addEventListener('resize', this._onMove);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this._onMove, true);
    window.removeEventListener('resize', this._onMove);
    this._stopWatching?.();
    this._stopWatching = undefined;
    if (this._raf) cancelAnimationFrame(this._raf);
  }

  private _onMove = (): void => {
    if (this._raf) return;
    this._raf = requestAnimationFrame(() => {
      this._raf = undefined;
      this._measure();
    });
  };

  /*
   * The editor is handed over before it has rendered, and its fields sit behind shadow roots
   * an observer never sees into, so the watching - wait for the upgrade, observe the shadow
   * root, look again after each change - is shared with the code hooks (watch-target.ts).
   */
  private _watch(): void {
    this._stopWatching?.();
    this._stopWatching = undefined;
    const target = this.target;
    if (!target) {
      this._fields = [];
      return;
    }
    this._stopWatching = watchTarget(target, () => this._measure());
  }

  /** Every field whose value is found in the template, with where it is on screen. */
  private _measure(): void {
    const target = this.target;
    const config = this.config;
    if (!target || !config) {
      this._fields = [];
      return;
    }
    const fields: Field[] = [];
    for (const selector of selectorsIn(target.shadowRoot ?? target)) {
      // A selector holding other selectors (an expandable) is a container, not a field.
      if ((selector as any).selector && 'expandable' in (selector as any).selector) continue;
      const path = pathOf(selector);
      if (!path) continue;
      const value = settingValue(config, path);
      if (value === undefined || value === null || typeof value === 'object') continue;
      if (typeof value === 'string' && /\[\[/.test(value)) continue;
      const rect = selector.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      fields.push({
        element: selector,
        path,
        value: value as string | number | boolean,
        label: path.map((step) => (typeof step === 'number' ? `#${step + 1}` : step)).join(' › '),
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
    this._fields = fields;
    if (this._menuFor && !fields.some((field) => field.element === this._menuFor?.element)) this._menuFor = undefined;
  }

  protected render(): TemplateResult {
    return html`
      ${this._fields.map(
        (field) => html`
          <button
            class="btn"
            style="top: ${field.top + 4}px; left: ${field.left + field.width - 32}px"
            title=${localize('field_menu.button', { field: field.label }, this.hass)}
            aria-label=${localize('field_menu.button', { field: field.label }, this.hass)}
            @click=${(): void => this._openMenu(field)}
          >
            ⋮
          </button>
        `,
      )}
      ${this._menuFor ? this._renderMenu(this._menuFor) : nothing}
      ${this._dialogFor ? this._renderDialog(this._dialogFor) : nothing}
    `;
  }

  private _openMenu(field: Field): void {
    this._menuFor = this._menuFor?.element === field.element ? undefined : field;
    this._reusing = false;
    this._dialogFor = undefined;
  }

  private _renderMenu(field: Field): TemplateResult {
    const declared = getDeclarations(this.config);
    return html`
      <div
        class="menu"
        role="menu"
        style="top: ${field.top + 36}px; left: ${Math.max(8, field.left + field.width - 240)}px"
      >
        <div role="menuitem" @click=${(): void => this._startPromote(field)}>
          ${localize('field_menu.make_variable', undefined, this.hass)}
        </div>
        ${
          declared.length
            ? html`<div
                role="menuitem"
                @click=${(): void => {
                  this._reusing = !this._reusing;
                }}
              >
                ${localize('field_menu.use_existing', undefined, this.hass)} <small>${declared.length}</small>
              </div>`
            : nothing
        }
        ${
          this._reusing
            ? declared.map(
                (each) =>
                  html`<div class="sub" role="menuitem" @click=${(): void => this._reuse(field, each.name)}>
                    [[${each.name}]]
                  </div>`,
              )
            : nothing
        }
        <div role="menuitem" @click=${(): void => void this._copy(field)}>
          ${localize('field_menu.copy_value', undefined, this.hass)}
        </div>
      </div>
    `;
  }

  private _startPromote(field: Field): void {
    const last = field.path[field.path.length - 1];
    const base = typeof last === 'string' ? last.replace(/[^A-Za-z0-9_-]/g, '_') : 'value';
    const taken = new Set(getDeclarations(this.config).map((each) => each.name));
    let name = base;
    let n = 2;
    while (taken.has(name)) name = `${base}_${n++}`;
    this._form = {
      name,
      label: typeof last === 'string' ? last.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) : '',
      default: String(field.value),
      required: false,
    };
    this._error = undefined;
    this._menuFor = undefined;
    this._dialogFor = field;
  }

  private _renderDialog(field: Field): TemplateResult {
    const schema: FormSchemaEntry[] = [
      { name: 'name', label: localize('field_menu.name', undefined, this.hass), selector: { text: {} } },
      { name: 'label', label: localize('field_menu.label', undefined, this.hass), selector: { text: {} } },
      { name: 'default', label: localize('field_menu.default', undefined, this.hass), selector: { text: {} } },
      { name: 'required', label: localize('field_menu.required', undefined, this.hass), selector: { boolean: {} } },
    ];
    return html`
      <div
        class="dialog"
        role="dialog"
        style="top: ${Math.min(field.top + 36, window.innerHeight - 360)}px; left: ${Math.max(8, field.left + field.width - 380)}px"
      >
        <h4>${localize('field_menu.dialog_title', { field: field.label }, this.hass)}</h4>
        <ha-form
          .hass=${this.hass}
          .data=${this._form}
          .schema=${schema}
          .computeLabel=${(s: FormSchemaEntry): string => s.label ?? s.name}
          @value-changed=${(ev: CustomEvent): void => {
            ev.stopPropagation();
            this._form = { ...this._form, ...(ev.detail.value as Record<string, unknown>) } as typeof this._form;
            this._error = this._checkName(this._form.name);
          }}
        ></ha-form>
        <p>${localize('field_menu.dialog_hint', { name: this._form.name || '…' }, this.hass)}</p>
        ${this._error ? html`<ha-alert alert-type="error">${this._error}</ha-alert>` : nothing}
        <div class="actions">
          <ha-button
            appearance="plain"
            @click=${(): void => {
              this._dialogFor = undefined;
            }}
            >${localize('field_menu.cancel', undefined, this.hass)}</ha-button
          >
          <ha-button .disabled=${!!this._error || !this._form.name} @click=${(): void => this._promote(field)}>
            ${localize('field_menu.make', undefined, this.hass)}
          </ha-button>
        </div>
      </div>
    `;
  }

  private _checkName(name: string): string | undefined {
    if (!name) return undefined;
    if (!VALID_NAME.test(name)) return localize('template_editor.promote_name_invalid', undefined, this.hass);
    if (getDeclarations(this.config).some((each) => each.name === name)) {
      return localize('template_editor.promote_name_taken', { name }, this.hass);
    }
    return undefined;
  }

  private _promote(field: Field): void {
    const config = this.config;
    if (!config) return;
    const { name, label, required } = this._form;
    const typed = this._form.default;
    const def: unknown =
      typed === String(field.value)
        ? undefined
        : typeof field.value === 'number' && !Number.isNaN(Number(typed))
          ? Number(typed)
          : typeof field.value === 'boolean'
            ? typed.trim().toLowerCase() === 'true'
            : typed;
    const result = promoteSettingAs(config, field.path, name, { label: label || undefined, required, default: def });
    if (!result.ok) {
      this._error = localize(`template_editor.promote_${result.error}`, { name }, this.hass);
      return;
    }
    this._dialogFor = undefined;
    fireEvent(this, 'config-changed', { config: result.template });
  }

  private _reuse(field: Field, name: string): void {
    const config = this.config;
    if (!config) return;
    const result = reuseVariable(config, field.path, name);
    this._menuFor = undefined;
    if (!result.ok) return;
    fireEvent(this, 'config-changed', { config: result.template });
  }

  private async _copy(field: Field): Promise<void> {
    this._menuFor = undefined;
    await copyText(String(field.value));
  }
}

export const FIELD_MENUS_TAG = 'decluttering-field-menus';
if (!customElements.get(FIELD_MENUS_TAG)) customElements.define(FIELD_MENUS_TAG, DeclutteringFieldMenus);
