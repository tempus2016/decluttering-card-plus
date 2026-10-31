/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * The placeholders a template writes, each once, as written - `[[name|default:x]]`,
 * nesting included - for the Try a placeholder tool (idea 28) to offer in its dropdown.
 */

// The parts of a template that are substituted into; a description mentioning `[[name]]` is prose.
const CONTENT_KEYS = [
  'card',
  'badge',
  'row',
  'element',
  'group',
  'style',
  'let',
  'default',
  'defaults',
  'grid_options',
  'name',
];

// A placeholder, with up to two levels of placeholder nested inside it.
const INNER = '[^[\\]]*';
const ONE = `\\[\\[${INNER}\\]\\]`;
const TWO = `\\[\\[(?:${INNER}|${ONE})*\\]\\]`;
const PLACEHOLDER_ANY = new RegExp(`\\[\\[(?:${INNER}|${TWO})*\\]\\]`, 'g');

/** Every distinct placeholder in `text`, outermost ones, in order of first appearance. */
export function placeholdersIn(text: string): string[] {
  const out: string[] = [];
  for (const match of text.match(PLACEHOLDER_ANY) ?? []) {
    // Escaped placeholders are meant to be seen, not substituted.
    if (match.startsWith('[[!')) continue;
    if (!out.includes(match)) out.push(match);
  }
  return out;
}

/** Every distinct placeholder a template's content writes. */
export function listPlaceholders(template: unknown): string[] {
  if (!template || typeof template !== 'object') return [];
  const out: string[] = [];
  for (const key of CONTENT_KEYS) {
    const value = (template as any)[key];
    if (value === undefined) continue;
    const text = typeof value === 'string' ? value : JSON.stringify(value);
    for (const each of placeholdersIn(text)) if (!out.includes(each)) out.push(each);
  }
  return out;
}
