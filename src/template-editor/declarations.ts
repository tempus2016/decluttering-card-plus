import { LitElement, html, TemplateResult, css, CSSResult, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { HomeAssistant, fireEvent } from 'custom-card-helpers';
import { FormSchemaEntry } from '../types';
import { VARIABLE_TYPES, VariableDeclaration } from '../variables';
import {
  DeclRow,
  DeclShape,
  emptyRow,
  groupStarts,
  moveRow,
  rowType,
  rowsFrom,
  shapeOf,
  uniqueName,
  variablesFrom,
  withField,
  withType,
} from '../declarations-rows';
import { localize } from '../localize';
import { DRAG_PATH } from './common';

/*
 * The declarations editor (idea 23): a template's `variables:` as rows, each with the
 * fields that matter most - name, type, label, default, required - and the rest behind a
 * chevron. Every control is a Home Assistant form, so the entity domain is picked from a
 * list and a number gets a number box, and what comes out is the same `variables:` list or
 * mapping that went in, in the same order, with keys this editor has no field for kept.
 *
 * Fires `value-changed` with `{ value }` like ha-form does, so the editor treats it as one
 * more field of the settings form.
 */

// The row's always-visible fields, drawn as one grid of Home Assistant selectors.
const ROW_SCHEMA = (hass?: HomeAssistant): FormSchemaEntry[] => [
  {
    name: '',
    type: 'grid',
    column_min_width: '120px',
    schema: [
      { name: 'name', label: localize('declarations.name', undefined, hass), selector: { text: {} } },
      {
        name: 'type',
        label: localize('declarations.type', undefined, hass),
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: '', label: localize('declarations.type_any', undefined, hass) },
              ...VARIABLE_TYPES.map((type) => ({ value: type, label: localize(`type_name.${type}`, undefined, hass) })),
              { value: 'card', label: localize('type_name.card', undefined, hass) },
            ],
          },
        },
      },
      { name: 'label', label: localize('declarations.label', undefined, hass), selector: { text: {} } },
      { name: 'default', label: localize('declarations.default', undefined, hass), selector: { text: {} } },
      { name: 'required', label: localize('declarations.required', undefined, hass), selector: { boolean: {} } },
    ],
  },
];

// A default that is not text is edited as YAML: a mapping, a list, a number kept as a number.
const DEFAULT_AS_OBJECT = (hass?: HomeAssistant): FormSchemaEntry => ({
  name: 'default',
  label: localize('declarations.default', undefined, hass),
  selector: { object: {} },
});

// mdi:dots-horizontal, so More settings is not a second down arrow beside Move down.
const MORE_PATH =
  'M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z';

/** The fields the open row shows, by its type. */
function extraSchema(row: DeclRow, hass?: HomeAssistant): FormSchemaEntry[] {
  const type = rowType(row);
  const description: FormSchemaEntry = {
    name: 'description',
    label: localize('declarations.description', undefined, hass),
    selector: { text: { multiline: true } },
  };
  const common: FormSchemaEntry[] = [
    { name: 'group', label: localize('declarations.group', undefined, hass), selector: { text: {} } },
  ];
  const byType: FormSchemaEntry[] =
    type === 'entity'
      ? [
          { name: 'domain', label: localize('declarations.domain', undefined, hass), selector: { text: {} } },
          {
            name: 'device_class',
            label: localize('declarations.device_class', undefined, hass),
            selector: { text: {} },
          },
        ]
      : type === 'number'
        ? [
            {
              name: 'min',
              label: localize('declarations.min', undefined, hass),
              selector: { number: { mode: 'box' } },
            },
            {
              name: 'max',
              label: localize('declarations.max', undefined, hass),
              selector: { number: { mode: 'box' } },
            },
            {
              name: 'step',
              label: localize('declarations.step', undefined, hass),
              selector: { number: { mode: 'box' } },
            },
            { name: 'unit', label: localize('declarations.unit', undefined, hass), selector: { text: {} } },
          ]
        : type === 'select'
          ? [{ name: 'allowed', label: localize('declarations.allowed', undefined, hass), selector: { text: {} } }]
          : type === 'text'
            ? [
                {
                  name: 'multiline',
                  label: localize('declarations.multiline', undefined, hass),
                  selector: { boolean: {} },
                },
              ]
            : [];
  const pattern: FormSchemaEntry[] =
    type === 'card'
      ? []
      : [{ name: 'pattern', label: localize('declarations.pattern', undefined, hass), selector: { text: {} } }];
  // Allowed values written without a type still need a field, or the rows could never change them.
  const allowed: FormSchemaEntry[] =
    type !== 'select' && row.allowed !== undefined
      ? [{ name: 'allowed', label: localize('declarations.allowed', undefined, hass), selector: { text: {} } }]
      : [];
  // The description gets the whole width: in a grid column its label is cut off.
  return [
    description,
    { name: '', type: 'grid', column_min_width: '260px', schema: [...common, ...byType, ...allowed, ...pattern] },
  ];
}

// Lists written as text, one value per comma.
const asText = (value: unknown): string =>
  Array.isArray(value) ? value.map(String).join(', ') : value === undefined || value === null ? '' : String(value);
const asList = (text: string): unknown[] | undefined => {
  const items = text
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length ? items : undefined;
};

export class DeclutteringDeclarationsEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  /** The template's `variables:` as written: a list, a mapping, or nothing. */
  @property({ attribute: false }) public variables?: unknown;
  // A mapping-form template was reordered and so written as a list (see _move).
  @state() private _reorderedAsList = false;
  /** The dashboard's shared declarations, offered by "Take one from the dashboard". */
  @property({ attribute: false }) public shared: VariableDeclaration[] = [];

  @state() private _open?: string;
  @state() private _asYaml = false;
  @state() private _picking = false;
  private _dragging?: number;

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
        margin-bottom: 16px;
      }
      .hint {
        margin: 6px 0 0;
        color: var(--secondary-text-color);
        font-size: 12.5px;
      }
      .rows {
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        overflow: hidden;
      }
      .group {
        padding: 6px 12px;
        background: var(--secondary-background-color);
        color: var(--secondary-text-color);
        font-size: 0.9em;
        border-top: 1px solid var(--divider-color);
      }
      .row {
        display: flex;
        align-items: flex-start;
        gap: 4px;
        padding: 10px 8px 2px;
        border-top: 1px solid var(--divider-color);
      }
      .rows > :first-child {
        border-top: 0;
      }
      .row ha-form {
        flex: 1;
        min-width: 0;
      }
      .row .handle {
        color: var(--secondary-text-color);
        cursor: grab;
        margin-top: 16px;
      }
      .row[data-dragging] {
        opacity: 0.5;
      }
      .buttons {
        display: flex;
        flex-direction: column;
      }
      .more {
        padding: 0 16px 12px 44px;
        border-top: 1px dashed var(--divider-color);
        background: var(--secondary-background-color);
      }
      .more ha-form {
        display: block;
        padding-top: 12px;
      }
      .add {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
      }
      .add .spacer {
        flex: 1;
      }
      .pick {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 8px 12px;
        margin-top: 8px;
      }
      .pick ul {
        margin: 4px 0 0;
        padding-left: 18px;
      }
      .pick a {
        cursor: pointer;
        color: var(--primary-color);
      }
      .empty {
        padding: 12px;
        color: var(--secondary-text-color);
      }
    `;
  }

  private get _rows(): DeclRow[] {
    return rowsFrom(this.variables);
  }

  private get _shape(): DeclShape {
    const shape = shapeOf(this.variables);
    // Something written as a list stays a list; nothing yet becomes a list, the common form.
    return shape === 'none' ? 'list' : shape;
  }

  protected render(): TemplateResult {
    const rows = this._rows;
    return html`
      ${this._asYaml ? this._renderYaml() : this._renderRows(rows)}
      ${
        this._reorderedAsList
          ? html`<p class="hint">${localize('declarations.reordered_as_list', undefined, this.hass)}</p>`
          : nothing
      }
      <div class="add">
        <ha-button @click=${this._add}>${localize('declarations.add', undefined, this.hass)}</ha-button>
        ${
          this.shared.length
            ? html`<ha-button
                appearance="plain"
                @click=${(): void => {
                  this._picking = !this._picking;
                }}
                >${localize('declarations.take_shared', undefined, this.hass)}</ha-button
              >`
            : nothing
        }
        <span class="spacer"></span>
        <ha-button
          appearance="plain"
          @click=${(): void => {
            this._asYaml = !this._asYaml;
          }}
          >${localize(this._asYaml ? 'declarations.as_rows' : 'declarations.as_yaml', undefined, this.hass)}</ha-button
        >
      </div>
      ${this._picking ? this._renderShared(rows) : nothing}
    `;
  }

  private _renderRows(rows: DeclRow[]): TemplateResult {
    if (!rows.length) {
      return html`<div class="rows">
        <div class="empty">${localize('declarations.none', undefined, this.hass)}</div>
      </div>`;
    }
    const starts = groupStarts(rows);
    return html`<div class="rows">
      ${repeat(
        rows,
        (row) => row.name,
        (row, index) => html`
          ${starts[index] !== undefined ? html`<div class="group">${starts[index]}</div>` : nothing}
          <div
            class="row"
            draggable="true"
            ?data-dragging=${this._dragging === index}
            @dragstart=${(): void => {
              this._dragging = index;
            }}
            @dragover=${(ev: DragEvent): void => {
              if (this._dragging !== undefined) ev.preventDefault();
            }}
            @drop=${(ev: DragEvent): void => this._drop(ev, index)}
            @dragend=${(): void => {
              this._dragging = undefined;
              this.requestUpdate();
            }}
          >
            <ha-svg-icon
              class="handle"
              role="img"
              aria-label=${localize('template_editor.drag_hint', undefined, this.hass)}
              .path=${DRAG_PATH}
            ></ha-svg-icon>
            <ha-form
              .hass=${this.hass}
              .data=${this._rowData(row)}
              .schema=${this._rowSchema(row)}
              .computeLabel=${(s: FormSchemaEntry): string => s.label ?? s.name}
              @value-changed=${(ev: CustomEvent): void => this._rowChanged(ev, index)}
            ></ha-form>
            <div class="buttons">
              <ha-icon-button
                .path=${MORE_PATH}
                .label=${localize(this._open === row.name ? 'declarations.less' : 'declarations.more', undefined, this.hass)}
                @click=${(): void => {
                  this._open = this._open === row.name ? undefined : row.name;
                }}
              ></ha-icon-button>
              <ha-icon-button
                .path=${'M7,15L12,10L17,15H7Z'}
                .disabled=${index === 0}
                .label=${localize('template_editor.move_up', { name: row.name }, this.hass)}
                @click=${(): void => this._move(index, index - 1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${'M7,10L12,15L17,10H7Z'}
                .disabled=${index === rows.length - 1}
                .label=${localize('template_editor.move_down', { name: row.name }, this.hass)}
                @click=${(): void => this._move(index, index + 1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z'}
                .label=${localize('declarations.remove', { name: row.name }, this.hass)}
                @click=${(): void => this._remove(index)}
              ></ha-icon-button>
            </div>
          </div>
          ${this._open === row.name ? this._renderMore(row, index) : nothing}
        `,
      )}
    </div>`;
  }

  private _renderMore(row: DeclRow, index: number): TemplateResult {
    const data: Record<string, unknown> = {
      description: row.description,
      group: row.group,
      pattern: row.pattern,
      domain: asText(row.domain),
      device_class: asText(row.device_class),
      min: row.min,
      max: row.max,
      step: row.step,
      unit: row.unit,
      allowed: asText(row.allowed),
      multiline: row.multiline,
    };
    return html`<div class="more">
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${extraSchema(row, this.hass)}
        .computeLabel=${(s: FormSchemaEntry): string => s.label ?? s.name}
        @value-changed=${(ev: CustomEvent): void => this._moreChanged(ev, index)}
      ></ha-form>
      ${
        row.selector !== undefined && rowType(row) !== 'card'
          ? html`<ha-form
              .hass=${this.hass}
              .data=${{ selector: row.selector }}
              .schema=${[
                {
                  name: 'selector',
                  label: localize('declarations.selector', undefined, this.hass),
                  selector: { object: {} },
                },
              ]}
              .computeLabel=${(s: FormSchemaEntry): string => s.label ?? s.name}
              @value-changed=${(ev: CustomEvent): void => this._selectorChanged(ev, index)}
            ></ha-form>`
          : nothing
      }
    </div>`;
  }

  private _renderYaml(): TemplateResult {
    return html`<ha-form
      .hass=${this.hass}
      .data=${{ variables: this.variables }}
      .schema=${[
        {
          name: 'variables',
          label: localize('template_editor.declarations_label', undefined, this.hass),
          helper: localize('template_editor.declarations_helper', undefined, this.hass),
          selector: { object: {} },
        },
      ]}
      .computeLabel=${(s: FormSchemaEntry): string => s.label ?? s.name}
      .computeHelper=${(s: FormSchemaEntry): string => s.helper ?? ''}
      @value-changed=${(ev: CustomEvent): void => {
        ev.stopPropagation();
        this._emit((ev.detail.value as { variables?: unknown }).variables);
      }}
    ></ha-form>`;
  }

  private _renderShared(rows: DeclRow[]): TemplateResult {
    const taken = new Set(rows.map((row) => row.name));
    const offered = this.shared.filter((declaration) => !taken.has(declaration.name));
    return html`<div class="pick">
      ${localize('declarations.take_shared_hint', undefined, this.hass)}
      ${
        offered.length
          ? html`<ul>
              ${offered.map(
                (declaration) =>
                  html`<li>
                    <a @click=${(): void => this._takeShared(declaration)}>${declaration.name}</a>
                    ${declaration.label ? html` - ${declaration.label}` : nothing}
                  </li>`,
              )}
            </ul>`
          : html`<p>${localize('declarations.take_shared_none', undefined, this.hass)}</p>`
      }
    </div>`;
  }

  /* ------------------------------------------------------------------ data in and out */

  private _rowData(row: DeclRow): Record<string, unknown> {
    const scalar = row.default === undefined || ['string', 'number', 'boolean'].includes(typeof row.default);
    return {
      name: row.name,
      type: rowType(row),
      label: row.label,
      default: scalar ? (row.default === undefined ? undefined : String(row.default)) : row.default,
      required: row.required === true,
    };
  }

  private _rowSchema(row: DeclRow): FormSchemaEntry[] {
    const scalar = row.default === undefined || ['string', 'number', 'boolean'].includes(typeof row.default);
    const [grid] = ROW_SCHEMA(this.hass);
    if (scalar) return [grid];
    const schema = (grid.schema as FormSchemaEntry[]).map((entry) =>
      entry.name === 'default' ? DEFAULT_AS_OBJECT(this.hass) : entry,
    );
    return [{ ...grid, schema }];
  }

  private _rowChanged(ev: CustomEvent, index: number): void {
    ev.stopPropagation();
    const rows = this._rows;
    const was = rows[index];
    if (!was) return;
    const data = ev.detail.value as Record<string, unknown>;
    let row = was;
    const name = typeof data.name === 'string' ? data.name.trim() : was.name;
    if (name && name !== was.name) {
      row = withField(
        row,
        'name',
        uniqueName(
          rows.filter((_, i) => i !== index),
          name,
        ),
      );
      if (this._open === was.name) this._open = row.name;
    }
    if ((data.type ?? '') !== rowType(was)) row = withType(row, String(data.type ?? ''));
    row = withField(row, 'label', typeof data.label === 'string' && data.label !== '' ? data.label : undefined);
    row = withField(row, 'required', data.required === true ? true : undefined);
    if (data.default !== was.default && !(data.default === '' && was.default === undefined)) {
      row = withField(row, 'default', this._defaultFrom(data.default, was));
    }
    this._emit(
      variablesFrom(
        rows.map((each, i) => (i === index ? row : each)),
        this._shape,
      ),
    );
  }

  /*
   * What a typed default means: a number for a number variable, yes/no for a boolean, the
   * text otherwise - and nothing when the box was emptied. A default that was a mapping or a
   * list stays whatever the object field gave back.
   */
  private _defaultFrom(value: unknown, row: DeclRow): unknown {
    if (value === '' || value === undefined || value === null) return undefined;
    if (typeof value !== 'string') return value;
    const type = rowType(row);
    if (type === 'number' && value.trim() !== '' && !Number.isNaN(Number(value))) return Number(value);
    if (type === 'boolean' && ['true', 'false'].includes(value.trim().toLowerCase())) return value.trim() === 'true';
    return value;
  }

  private _moreChanged(ev: CustomEvent, index: number): void {
    ev.stopPropagation();
    const rows = this._rows;
    const was = rows[index];
    if (!was) return;
    const data = ev.detail.value as Record<string, unknown>;
    let row = was;
    const text = (value: unknown): string | undefined =>
      typeof value === 'string' && value.trim() ? value : undefined;
    row = withField(row, 'description', text(data.description));
    row = withField(row, 'group', text(data.group));
    row = withField(row, 'pattern', text(data.pattern));
    row = withField(row, 'unit', text(data.unit));
    for (const key of ['min', 'max', 'step'] as const) {
      row = withField(row, key, typeof data[key] === 'number' ? data[key] : undefined);
    }
    row = withField(row, 'multiline', data.multiline === true ? true : undefined);
    // One domain stays a word, several become a list - the two spellings the card reads.
    const listOrWord = (value: unknown): unknown => {
      const list = typeof value === 'string' ? asList(value) : undefined;
      return list === undefined ? undefined : list.length === 1 ? list[0] : list;
    };
    row = withField(row, 'domain', listOrWord(data.domain));
    row = withField(row, 'device_class', listOrWord(data.device_class));
    row = withField(row, 'allowed', typeof data.allowed === 'string' ? asList(data.allowed) : undefined);
    this._emit(
      variablesFrom(
        rows.map((each, i) => (i === index ? row : each)),
        this._shape,
      ),
    );
  }

  private _selectorChanged(ev: CustomEvent, index: number): void {
    ev.stopPropagation();
    const rows = this._rows;
    const value = (ev.detail.value as { selector?: unknown }).selector;
    const row = withField(rows[index], 'selector', value && typeof value === 'object' ? value : undefined);
    this._emit(
      variablesFrom(
        rows.map((each, i) => (i === index ? row : each)),
        this._shape,
      ),
    );
  }

  private _add(): void {
    const rows = this._rows;
    const row = emptyRow(rows);
    this._open = row.name;
    this._emit(variablesFrom([...rows, row], this._shape));
  }

  private _takeShared(declaration: VariableDeclaration): void {
    const rows = this._rows;
    // Only the name: the dashboard's declaration supplies the rest, and anything written
    // here beside the name would win over it.
    const row: DeclRow = { name: declaration.name, extra: {}, order: [] };
    this._picking = false;
    this._emit(variablesFrom([...rows, row], this._shape));
  }

  private _remove(index: number): void {
    const rows = this._rows;
    this._emit(
      variablesFrom(
        rows.filter((_, i) => i !== index),
        this._shape,
      ),
    );
  }

  /*
   * A reorder of a mapping-form template (#223) is written back as a list: Home Assistant's
   * element editor drops a config that only differs in the order of a mapping's keys, since
   * it compares them as sets, so a mapping whose keys moved never reaches the dialog. The
   * list says the order outright; the row below the table says what happened.
   */
  private _move(from: number, to: number): void {
    const rows = this._rows;
    const moved = moveRow(rows, from, to);
    if (moved === rows) return;
    const shape = this._shape === 'mapping' ? 'list' : this._shape;
    this._reorderedAsList = this._shape === 'mapping';
    this._emit(variablesFrom(moved, shape));
  }

  private _drop(ev: DragEvent, to: number): void {
    ev.preventDefault();
    const from = this._dragging;
    this._dragging = undefined;
    if (from !== undefined) this._move(from, to);
  }

  private _emit(value: unknown): void {
    fireEvent(this, 'value-changed', { value });
  }
}

export const DECLARATIONS_EDITOR_TAG = 'decluttering-declarations-editor';
if (!customElements.get(DECLARATIONS_EDITOR_TAG))
  customElements.define(DECLARATIONS_EDITOR_TAG, DeclutteringDeclarationsEditor);
