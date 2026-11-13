/*
 * Child over parent, and the list edits a child can write in place of a whole list (#209).
 * Shared by `extends:`, which merges before any placeholder is filled in, and by a card's
 * own `card:` override, which merges after.
 */

const isMapping = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const LIST_EDITS = ['__append__', '__prepend__', '__update__', '__remove__'];

/*
 * A list edit `extends:` could not do yet (#453): the list it edits, or what it adds, is still
 * a placeholder - `list: '[[rooms]]'` in the parent, `__append__: '[[more_rooms]]'` in the
 * child. Placeholders are filled in after templates merge, so the edit is written down here
 * with the list it applies to, and done by the build once both are in. The key is only ever
 * written here and read here.
 */
export const LIST_EDIT_KEY = '__dcp_list_edit__';

const PENDING = /\[\[(?!!)/;

/** A value a placeholder still has to fill in, or a list edit still waiting on one. */
function pending(value: unknown): boolean {
  return (typeof value === 'string' && PENDING.test(value)) || isDeferred(value);
}

function isDeferred(value: unknown): value is { [LIST_EDIT_KEY]: Record<string, unknown> } {
  return isMapping(value) && Object.keys(value).length === 1 && isMapping(value[LIST_EDIT_KEY]);
}

function allListEdits(over: Record<string, unknown>): boolean {
  const keys = Object.keys(over);
  return keys.length > 0 && keys.every((key) => LIST_EDITS.includes(key));
}

/** A mapping written where a list is: every key one of the list edits. */
function isListEdit(base: unknown, over: Record<string, unknown>): boolean {
  return (base === undefined || Array.isArray(base)) && allListEdits(over);
}

/*
 * Whether an `extends:` list edit has to wait for the build: the parent's list is a
 * placeholder (or an edit that is itself waiting), or what goes on either end is - a whole
 * list placeholder appended now would go in as one item, a list inside the list.
 */
function mustWait(base: unknown, over: Record<string, unknown>): boolean {
  if (!allListEdits(over)) return false;
  if (pending(base)) return true;
  if (base !== undefined && !Array.isArray(base)) return false;
  return [over.__append__, over.__prepend__].some(
    (added) => pending(added) || (Array.isArray(added) && added.some((item) => pending(item))),
  );
}

/** A list index as written, negative counting from the end; anything else is no index. */
function listIndex(written: unknown, length: number): number | undefined {
  const index = typeof written === 'string' && /^-?\d+$/.test(written.trim()) ? Number(written) : written;
  if (typeof index !== 'number' || !Number.isInteger(index)) return undefined;
  return index < 0 ? (length + index >= 0 ? length + index : undefined) : index;
}

const asList = (value: unknown): unknown[] =>
  value === undefined || value === null ? [] : Array.isArray(value) ? value : [value];

/*
 * Edits to a list rather than a new one (#209). Every index means a place in the list as the
 * template had it, so the edits do not move each other: `__update__` merges into an item the
 * way the rest of an override does (null removes it, an index past the end adds it there),
 * `__remove__` takes items out, and `__prepend__` / `__append__` go on either end.
 */
function editList(base: unknown, edits: Record<string, unknown>): unknown[] {
  const original = Array.isArray(base) ? base : [];
  const items: unknown[] = [...original];
  const removed = new Set<number>();
  const added: unknown[] = [];
  const update = isMapping(edits.__update__) ? edits.__update__ : {};
  for (const [written, value] of Object.entries(update)) {
    const index = listIndex(written, original.length);
    if (index === undefined) continue;
    if (index >= original.length) {
      if (value !== null) added.push(mergeOver(undefined, value));
    } else if (value === null) removed.add(index);
    else items[index] = mergeOver(items[index], value);
  }
  for (const written of asList(edits.__remove__)) {
    const index = listIndex(written, original.length);
    if (index !== undefined) removed.add(index);
  }
  return [
    ...asList(edits.__prepend__),
    ...items.filter((_, index) => !removed.has(index)),
    ...added,
    ...asList(edits.__append__),
  ];
}

/**
 * Child over parent, a mapping merging key by key and a null taking the key away. `waiting`
 * is for `extends:`, merging before placeholders are filled in: a list edit that needs their
 * values is kept for the build to do (#453).
 */
export function mergeOver(base: unknown, over: unknown, waiting = false): unknown {
  if (!isMapping(over)) return over;
  if (waiting && mustWait(base, over)) return { [LIST_EDIT_KEY]: { ...over, [LIST_EDIT_KEY]: base } };
  if (isListEdit(base, over)) return editList(base, over);
  const out: Record<string, unknown> = isMapping(base) ? { ...base } : {};
  for (const [key, value] of Object.entries(over)) {
    // Assigning `out.__proto__` would reparent the result rather than set a key; a card has
    // no use for that key, so it is dropped.
    if (key === '__proto__') continue;
    if (value === null) delete out[key];
    else out[key] = mergeOver(out[key], value, waiting);
  }
  return out;
}

/*
 * Every list edit `extends:` left for the build, done now that its placeholders are in. One
 * whose list or additions are still placeholders - a value an outer build has yet to give -
 * is left for that build. A placeholder that filled in to a list adds its items, not itself.
 */
export function applyListEdits(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(applyListEdits);
  if (!isMapping(node)) return node;
  if (isDeferred(node)) {
    const { [LIST_EDIT_KEY]: base, ...edits } = node[LIST_EDIT_KEY] as Record<string, unknown>;
    const list = applyListEdits(base);
    const done = applyListEdits(edits) as Record<string, unknown>;
    const added = [...asList(done.__append__), ...asList(done.__prepend__)];
    if (pending(list) || added.some(pending)) return { [LIST_EDIT_KEY]: { ...done, [LIST_EDIT_KEY]: list } };
    return editList(list, done);
  }
  const out: Record<string, unknown> = Object.create(null);
  for (const [key, value] of Object.entries(node)) out[key] = applyListEdits(value);
  return out;
}
