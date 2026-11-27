import { VariableDeclaration, declarationList, hasLabelledAllowed, isBuiltinType, isNoteEntry } from './variables';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * The declarations editor (idea 23) draws a template's `variables:` as a table of rows and
 * writes the table back. A template's declarations can be written as a list or, since
 * #223, as a mapping keyed by name; whichever way they came in, they go back out the same
 * way, with every key the editor does not know about kept where it was. So the editor is
 * a view of the YAML and never a reason to lose any of it.
 */

export type DeclShape = 'list' | 'mapping' | 'none';

/** The keys the table has a column or a field for, in the order they are written when new. */
export const ROW_KEYS = [
  'type',
  'label',
  'description',
  'default',
  'required',
  'allow_empty',
  'group',
  'pattern',
  'allowed',
  'domain',
  'device_class',
  'min',
  'max',
  'step',
  'unit',
  'multiline',
  'multiple',
  'selector',
] as const;

type RowKey = (typeof ROW_KEYS)[number];

export interface DeclRow extends VariableDeclaration {
  /** Keys of the written declaration the editor has no field for, kept as they were. */
  extra: Record<string, unknown>;
  /** The order the written declaration's keys came in, so a round trip changes nothing. */
  order: string[];
  /**
   * An entry of a written list the table cannot draw - a bare word, a mapping with no name -
   * kept exactly as it was. The card reads no variable from it, but it is the user's YAML and
   * an edit to another row is no reason to lose or rewrite it.
   */
  raw?: unknown;
}

/** Whether a row stands for an entry the table has no way to draw, and so passes through untouched. */
export function isOpaqueRow(row: DeclRow): boolean {
  return 'raw' in row;
}

/** How a template's `variables:` is written. */
export function shapeOf(variables: unknown): DeclShape {
  if (Array.isArray(variables)) return 'list';
  if (variables && typeof variables === 'object') return 'mapping';
  return 'none';
}

/** The rows of the table, one per declaration, from either written shape. */
export function rowsFrom(variables: unknown): DeclRow[] {
  const rows: DeclRow[] = [];
  for (const entry of declarationList(variables)) {
    const nameless =
      !entry ||
      typeof entry !== 'object' ||
      Array.isArray(entry) ||
      (!isNoteEntry(entry) && (entry.name === undefined || entry.name === null || entry.name === ''));
    if (nameless) {
      rows.push({ name: '', extra: {}, order: [], raw: entry });
      continue;
    }
    const name = typeof entry.name === 'string' ? entry.name : String(entry.name ?? '');
    const row: DeclRow = { name, extra: {}, order: Object.keys(entry).filter((key) => key !== 'name') };
    for (const [key, value] of Object.entries(entry)) {
      if (key === 'name') continue;
      if ((ROW_KEYS as readonly string[]).includes(key)) (row as any)[key] = value;
      else row.extra[key] = value;
    }
    rows.push(row);
  }
  return rows;
}

/** Whether a row is a note (#509): text among the variables, with no name of its own in a list. */
export function isNoteRow(row: DeclRow): boolean {
  return !isOpaqueRow(row) && isNoteEntry(entryFrom(row));
}

/**
 * A key for each row that no other row has, for drawing them as a keyed list: the name, with
 * the row's place added where two rows share one - `variables:` can be written with the same
 * name twice, and a keyed list does not survive two rows under one key.
 */
export function rowKeys(rows: DeclRow[]): string[] {
  const seen = new Set<string>();
  return rows.map((row, index) => {
    // A note in a list has no name (#509), so its place stands in for one.
    const base = isOpaqueRow(row) ? `raw:${index}` : isNoteRow(row) ? `note:${row.name || index}` : row.name;
    const key = seen.has(base) ? `${base}#${index}` : base;
    seen.add(key);
    return key;
  });
}

/** A new note row, named only where the mapping form needs a key for it. */
export function emptyNoteRow(rows: DeclRow[], shape: DeclShape): DeclRow {
  return { name: shape === 'mapping' ? uniqueName(rows, 'note') : '', extra: { note: '' }, order: ['note'] };
}

/** One declaration as it is written in a list: name first, then the keys in their original order, new ones after. */
function entryFrom(row: DeclRow): Record<string, unknown> {
  const fields: Record<string, unknown> = {};
  for (const key of ROW_KEYS) {
    const value = (row as any)[key];
    if (value !== undefined) fields[key] = value;
  }
  Object.assign(fields, row.extra);
  const out: Record<string, unknown> = { name: row.name };
  for (const key of row.order) if (key in fields) out[key] = fields[key];
  for (const key of Object.keys(fields)) if (!(key in out)) out[key] = fields[key];
  // A note written in a list has no name (#509), and gets none from going through the table.
  if (row.name === '' && isNoteEntry(out)) delete out.name;
  return out;
}

function isPlainObject(value: unknown): boolean {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/**
 * The rows written back as `variables:`, in the shape they were read in. A mapping entry
 * holding nothing but a default that is not itself a mapping is written as that value, the
 * short form #223 reads it from; a bare name is written as null; anything else is the
 * declaration under the name.
 */
export function variablesFrom(rows: DeclRow[], shape: DeclShape): unknown {
  if (shape !== 'mapping') {
    const written = rows.map((row) => (isOpaqueRow(row) ? row.raw : entryFrom(row)));
    if (shape === 'none' && !written.length) return undefined;
    return written;
  }
  // A mapping has a name for every entry, so there is nothing in it the table cannot draw.
  const entries = rows.filter((row) => !isOpaqueRow(row)).map(entryFrom);
  const out: Record<string, unknown> = {};
  for (const entry of entries) {
    const { name = 'note', ...rest } = entry;
    const keys = Object.keys(rest);
    if (!keys.length) out[String(name)] = null;
    else if (keys.length === 1 && keys[0] === 'default' && !isPlainObject(rest.default) && rest.default !== null)
      out[String(name)] = rest.default;
    else out[String(name)] = rest;
  }
  return out;
}

/** A new, empty row with a name no other row has. */
export function emptyRow(rows: DeclRow[], base = 'variable'): DeclRow {
  return { name: uniqueName(rows, base), extra: {}, order: [] };
}

/** `base`, or `base_2`, `base_3`... until no row has it. */
export function uniqueName(rows: DeclRow[], base: string): string {
  const taken = new Set(rows.map((row) => row.name));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}_${n}`)) n += 1;
  return `${base}_${n}`;
}

/** A row with one field changed; `undefined` removes the key. */
export function withField(row: DeclRow, key: RowKey | 'name', value: unknown): DeclRow {
  const out: DeclRow = { ...row, extra: { ...row.extra } };
  if (value === undefined) delete (out as any)[key];
  else (out as any)[key] = value;
  return out;
}

/** The rows with one moved from `from` to `to`; the same list when nothing moves. */
export function moveRow(rows: DeclRow[], from: number, to: number): DeclRow[] {
  if (from === to || from < 0 || to < 0 || from >= rows.length || to >= rows.length) return rows;
  const out = [...rows];
  const [moved] = out.splice(from, 1);
  out.splice(to, 0, moved);
  return out;
}

/** The group each row sits under, for drawing a heading where the group changes. */
export function groupStarts(rows: DeclRow[]): (string | undefined)[] {
  return rows.map((row, index) => {
    const group = row.group === undefined ? undefined : String(row.group);
    const before = index ? rows[index - 1].group : undefined;
    return group !== undefined && group !== (before === undefined ? undefined : String(before)) ? group : undefined;
  });
}

/** The declaration's type as the dropdown shows it: a known type, `card` for a card selector, else blank. */
export function rowType(row: DeclRow): string {
  if (row.type !== undefined) return String(row.type);
  if (row.selector && typeof row.selector === 'object' && 'card' in (row.selector as object)) return 'card';
  return '';
}

/** The row with its type changed: `card` is a selector, not a type; blank clears both. */
export function withType(row: DeclRow, type: string): DeclRow {
  let out = withField(row, 'type', undefined);
  out = withField(out, 'selector', undefined);
  if (type === 'card') return withField(out, 'selector', { card: {} });
  if (type) return withField(out, 'type', type);
  return out;
}

/*
 * The built-in type a row's type comes down to: a named type (#472) stands for the built-in
 * one it says, if any, so a row typed `percent` gets the number fields a `type: number` would.
 */
export function builtinType(row: DeclRow, types: Record<string, Record<string, unknown>> = {}): string {
  const type = rowType(row);
  if (isBuiltinType(type) || type === 'card' || !Object.prototype.hasOwnProperty.call(types, type)) return type;
  const under = types[type].type;
  return typeof under === 'string' ? under : '';
}

/** Whether a row's default is shown in a text box: nothing, text, a number or yes/no. A mapping or a list is edited as YAML. */
export function hasScalarDefault(row: DeclRow): boolean {
  return row.default === undefined || ['string', 'number', 'boolean'].includes(typeof row.default);
}

/** What the row's default field shows: the text of a plain value, or the mapping or list itself. */
export function shownDefault(row: DeclRow): unknown {
  if (!hasScalarDefault(row)) return row.default;
  return row.default === undefined ? undefined : String(row.default);
}

const blank = (value: unknown): boolean => value === undefined || value === null || value === '';

/*
 * What the default field handed back means for the row. The form sends every field of the
 * row with each edit, so the default comes back as the text it was shown as - and a `3` or a
 * `false` written without a type must not turn into `"3"` or `"false"` because the label
 * beside it was typed in. Only a default that differs from what the box showed is an edit;
 * then it is a number for a number variable, yes/no for a boolean, the text otherwise, and
 * nothing when the box was emptied.
 */
export function defaultFromEdit(row: DeclRow, shown: unknown, type: string): { changed: boolean; value?: unknown } {
  const before = shownDefault(row);
  if (shown === before || (blank(shown) && before === undefined)) return { changed: false };
  if (shown && typeof shown === 'object' && JSON.stringify(shown) === JSON.stringify(before)) return { changed: false };
  if (blank(shown)) return { changed: true, value: undefined };
  if (typeof shown !== 'string') return { changed: true, value: shown };
  if (type === 'number' && shown.trim() !== '' && !Number.isNaN(Number(shown))) {
    return { changed: true, value: Number(shown) };
  }
  if (type === 'boolean' && ['true', 'false'].includes(shown.trim().toLowerCase())) {
    return { changed: true, value: shown.trim().toLowerCase() === 'true' };
  }
  return { changed: true, value: shown };
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

/** What the fields behind a row's More settings show, by field. */
export function moreData(row: DeclRow): Record<string, unknown> {
  return {
    description: row.description,
    group: row.group,
    pattern: row.pattern,
    domain: asText(row.domain),
    device_class: asText(row.device_class),
    min: row.min,
    max: row.max,
    step: row.step,
    unit: row.unit,
    allowed: hasLabelledAllowed(row) ? undefined : asText(row.allowed),
    multiline: row.multiline,
    multiple: row.multiple,
    allow_empty: row.allow_empty,
  };
}

/*
 * The row after an edit behind More settings. The form sends every field with each edit, so
 * only a field that differs from what it was shown as is written: read back from its text, a
 * list of numbers would come out as a list of words, and a `min:` written as a placeholder
 * would be dropped for not being a number - by an edit to the description.
 */
export function withMore(row: DeclRow, data: Record<string, unknown>): DeclRow {
  const shown = moreData(row);
  const edited = (key: string): boolean => data[key] !== shown[key] && !(blank(data[key]) && blank(shown[key]));
  const text = (value: unknown): string | undefined => (typeof value === 'string' && value.trim() ? value : undefined);
  let out = row;
  for (const key of ['description', 'group', 'pattern', 'unit'] as const) {
    if (edited(key)) out = withField(out, key, text(data[key]));
  }
  for (const key of ['min', 'max', 'step'] as const) {
    if (edited(key)) out = withField(out, key, typeof data[key] === 'number' ? data[key] : undefined);
  }
  for (const key of ['multiline', 'multiple', 'allow_empty'] as const) {
    if ((data[key] === true) !== (shown[key] === true))
      out = withField(out, key, data[key] === true ? true : undefined);
  }
  // One domain stays a word, several become a list - the two spellings the card reads.
  const listOrWord = (value: unknown): unknown => {
    const list = typeof value === 'string' ? asList(value) : undefined;
    return list === undefined ? undefined : list.length === 1 ? list[0] : list;
  };
  for (const key of ['domain', 'device_class'] as const) {
    if (edited(key)) out = withField(out, key, listOrWord(data[key]));
  }
  // Labelled values have no field here, so they stay as written (#482).
  if (!hasLabelledAllowed(out) && edited('allowed')) {
    // One made from a placeholder (#491) stays the text it is, not a list of one.
    const allowed = typeof data.allowed === 'string' ? data.allowed.trim() : undefined;
    out = withField(out, 'allowed', allowed?.includes('[[') ? allowed : allowed ? asList(allowed) : undefined);
  }
  return out;
}
