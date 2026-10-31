import { VariableDeclaration, declarationList } from './variables';

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
  'selector',
] as const;

type RowKey = (typeof ROW_KEYS)[number];

export interface DeclRow extends VariableDeclaration {
  /** Keys of the written declaration the editor has no field for, kept as they were. */
  extra: Record<string, unknown>;
  /** The order the written declaration's keys came in, so a round trip changes nothing. */
  order: string[];
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
    if (!entry || typeof entry !== 'object') continue;
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
  const entries = rows.map(entryFrom);
  if (shape === 'mapping') {
    const out: Record<string, unknown> = {};
    for (const entry of entries) {
      const { name, ...rest } = entry;
      const keys = Object.keys(rest);
      if (!keys.length) out[String(name)] = null;
      else if (keys.length === 1 && keys[0] === 'default' && !isPlainObject(rest.default) && rest.default !== null)
        out[String(name)] = rest.default;
      else out[String(name)] = rest;
    }
    return out;
  }
  if (shape === 'none' && !entries.length) return undefined;
  return entries;
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
