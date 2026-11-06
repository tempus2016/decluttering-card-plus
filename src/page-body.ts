/*
 * The parts of a page template's `dashboard:` body (idea 33) that are read apart from the
 * rest, with nothing to import so the template linter can use them too.
 */

/** The keys a strategy carries that the dashboard it writes must keep: everything decluttering. */
export function declutteringKeys(config: unknown): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries((config as Record<string, unknown>) ?? {})) {
    if (key.startsWith('decluttering_')) out[key] = value;
  }
  return out;
}

/** A body's decluttering keys, kept as written, apart from the rest of it. */
export function splitDeclutteringKeys(body: unknown): { held: Record<string, unknown>; rest: unknown } {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { held: {}, rest: body };
  const held = declutteringKeys(body);
  const rest: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    if (!(key in held)) rest[key] = value;
  }
  return { held, rest };
}

// What a repeat entry is told it repeats over: page variables can go in these, and do here.
const REPEAT_SOURCE_KEYS = ['for_each', 'for_each_from'];

/**
 * The body with every repeat - a view, section, badge or card with `for_each:` or
 * `for_each_from:` - cut down to what it repeats over. Everything else in a repeat is
 * filled again for each copy, by a pass that knows the item's values.
 */
export function withoutRepeatContent(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(withoutRepeatContent);
  if (!node || typeof node !== 'object') return node;
  const record = node as Record<string, unknown>;
  const repeats = REPEAT_SOURCE_KEYS.some((key) => record[key] !== undefined);
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    if (repeats && !REPEAT_SOURCE_KEYS.includes(key)) continue;
    out[key] = withoutRepeatContent(value);
  }
  return out;
}
