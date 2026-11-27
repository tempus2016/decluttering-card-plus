import { VariablesConfig } from './types';
import { setKey } from './placeholder-text';

/*
 * A `with:` or `repeat:` body written in place, in quotes (#498):
 *
 *   entities: '[["[[entity]]"|repeat:my_list]]'
 *
 * is what `tmp: '[[entity]]'` and `[[tmp|repeat:my_list]]` say in two lines. Before a build
 * reads anything, each such body is taken out into a variable of its own, with a name nobody
 * writes, and the site points at it - so everything after this sees the two-line form and
 * works exactly as that does. The inner placeholders are the copy's: they cannot be filled
 * at the card's level first, because the body is out of the text before any filling starts.
 *
 * A bang inside the body is taken off once, so `[[!entity]]` there means `[[entity]]` too -
 * the spelling people reach for, expecting to have to stop the card filling it in early.
 * `[[!!x]]` is how a body writes the brackets themselves.
 *
 * Only a quoted head followed straight away by `with` or `repeat` is taken, with an argument
 * or bare (#314): a quoted literal with any other step (#398) is left alone. The scan counts brackets, a character at
 * a time, and never backtracks (#403).
 */
export const INLINE_PREFIX = '__inline_';

const STRUCTURE_AFTER_QUOTE = ['|with', '|repeat'];
// What ends the step's name: its argument, the next step, the optional mark, or the brackets
// of a bare `|with]]` (#314) - anything else is a longer name, a step of somebody's own.
const AFTER_STEP_NAME = [':', '|', '?', ']'];

// Each hidden name and the quoted head it was written as, for saying so in its own words.
const written = new Map<string, string>();
const WRITTEN_KEPT = 500;

function remember(name: string, head: string): void {
  if (written.has(name)) return;
  if (written.size >= WRITTEN_KEPT) written.delete(written.keys().next().value as string);
  written.set(name, head);
}

/**
 * Text with every hidden name put back as the quoted body it was written as, so a warning or
 * a placeholder left in the card shows what its author wrote. `json` is for text that is a
 * template's JSON, where the body's own quotes and backslashes have to be escaped.
 */
export function restoreInlineBodies(text: string, json = false): string {
  if (!text.includes(INLINE_PREFIX)) return text;
  let out = text;
  for (const [name, head] of written) {
    if (!out.includes(name)) continue;
    const shown = json ? JSON.stringify(head).slice(1, -1) : head;
    out = out.split(`[[${name}`).join(`[[${shown}`);
  }
  return out;
}

/** A short, stable name for a body as written: the same body is the same variable, at every level. */
function nameFor(body: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < body.length; index += 1) {
    hash ^= body.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  // Always seven characters, so no hidden name is the start of another: putting the bodies
  // back by name would otherwise write one body into the middle of a longer name.
  return `${INLINE_PREFIX}${hash.toString(36).padStart(7, '0')}`;
}

/** Where the `]]` closing a placeholder whose inside starts at `from` is, or -1. */
function closeOf(text: string, from: number): number {
  let depth = 0;
  for (let index = from; index < text.length - 1; index += 1) {
    if (text[index] === '[' && text[index + 1] === '[') {
      depth += 1;
      index += 1;
    } else if (text[index] === ']' && text[index + 1] === ']') {
      if (depth === 0) return index;
      depth -= 1;
      index += 1;
    }
  }
  return -1;
}

/** Where the quote closing a body that starts at `from` is, or -1 when this is no body. */
function bodyEnd(text: string, from: number, quote: string): number {
  let depth = 0;
  for (let index = from; index < text.length; index += 1) {
    const two = text.slice(index, index + 2);
    if (two === '[[') {
      depth += 1;
      index += 1;
    } else if (two === ']]') {
      // The placeholder closed before any quote that opens a with: or repeat: did.
      if (depth === 0) return -1;
      depth -= 1;
      index += 1;
    } else if (depth === 0 && text[index] === quote) {
      const structural = STRUCTURE_AFTER_QUOTE.some(
        (step) => text.startsWith(step, index + 1) && AFTER_STEP_NAME.includes(text[index + 1 + step.length]),
      );
      if (structural) return index;
    }
  }
  return -1;
}

/** One string with its quoted bodies taken out, and the bodies, by name. */
function hoistText(text: string, found: Map<string, string>): string {
  if (!text.includes('[["') && !text.includes("[['")) return text;
  let out = '';
  let index = 0;
  while (index < text.length) {
    const open = text.indexOf('[[', index);
    if (open === -1) break;
    const quote = text[open + 2];
    if (quote !== '"' && quote !== "'") {
      out += text.slice(index, open + 2);
      index = open + 2;
      continue;
    }
    const end = bodyEnd(text, open + 3, quote);
    const close = end === -1 ? -1 : closeOf(text, end + 1);
    if (close === -1) {
      out += text.slice(index, open + 2);
      index = open + 2;
      continue;
    }
    const raw = text.slice(open + 3, end);
    const body = raw.replace(/\[\[!/g, '[[');
    const name = nameFor(raw);
    found.set(name, body);
    remember(name, `${quote}${raw}${quote}`);
    out += `${text.slice(index, open)}[[${name}${text.slice(end + 1, close)}]]`;
    index = close + 2;
  }
  return out + text.slice(index);
}

/** Any value with its quoted bodies taken out: the same value back when it has none. */
function hoistValue(value: unknown, found: Map<string, string>): unknown {
  if (typeof value === 'string') return hoistText(value, found);
  if (!value || typeof value !== 'object') return value;
  /*
   * A mapping or a list is taken apart once and kept against it. Every nested build is handed
   * the whole scope again - each item template's body is a variable in it - and walking all of
   * that for every value read was most of a large card's build.
   */
  let known = memo.get(value);
  if (!known) {
    const own = new Map<string, string>();
    known = { content: hoistWalk(value, own), found: own };
    memo.set(value, known);
  }
  for (const [name, body] of known.found) found.set(name, body);
  return known.content;
}

function hoistWalk(value: unknown, found: Map<string, string>): unknown {
  if (typeof value === 'string') return hoistText(value, found);
  if (Array.isArray(value)) {
    let changed = false;
    const out = value.map((item) => {
      const next = hoistWalk(item, found);
      if (next !== item) changed = true;
      return next;
    });
    return changed ? out : value;
  }
  if (value && typeof value === 'object') {
    let changed = false;
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      const next = hoistWalk(item, found);
      if (next !== item) changed = true;
      setKey(out, key, next);
    }
    return changed ? out : value;
  }
  return value;
}

interface Hoisted {
  content: unknown;
  found: Map<string, string>;
}

// A template's content is the same object on every build, so it is taken apart once (idea 3).
const memo = new WeakMap<object, Hoisted>();

function hoistContent(content: unknown): Hoisted {
  const found = new Map<string, string>();
  return { content: hoistValue(content, found), found };
}

/**
 * The content and the variables with every quoted `with:`/`repeat:` body taken out, and the
 * variables that now hold them. Nothing to take out gives back the same content and list.
 */
export function hoistInlineBodies(
  content: unknown,
  variables: VariablesConfig[],
): { content: unknown; variables: VariablesConfig[]; added: VariablesConfig[] } {
  const fromContent = hoistContent(content);
  const found = new Map(fromContent.found);
  let list = variables;
  for (let index = 0; index < variables.length; index += 1) {
    const entry = variables[index];
    const key = Object.keys(entry)[0];
    if (key === undefined || key.startsWith(INLINE_PREFIX)) continue;
    const value = entry[key];
    const next = hoistValue(value, found);
    if (next === value) continue;
    if (list === variables) list = [...variables];
    list[index] = { [key]: next };
  }
  const given = new Set(list.map((entry) => Object.keys(entry)[0]));
  const added: VariablesConfig[] = [];
  for (const [name, body] of found) {
    if (!given.has(name)) added.push({ [name]: body });
  }
  return { content: fromContent.content, variables: list, added };
}

/**
 * A template with its quoted bodies taken out into its own `default:`, for what reads a
 * template without building it - the card editor's and the health check's diagnosis - so a
 * quoted body is read exactly as the two-line form is. The same template back when it has none.
 */
export function withInlineBodies<T>(template: T): T {
  if (!template || typeof template !== 'object') return template;
  const { content, added } = hoistInlineBodies(template, []);
  if (!added.length) return template;
  const written = (content as Record<string, unknown>).default;
  const defaults = Array.isArray(written)
    ? [...written, ...added]
    : written && typeof written === 'object'
      ? { ...(written as object), ...Object.assign({}, ...added) }
      : added;
  return { ...(content as object), default: defaults } as T;
}

/** Whether a name is one of the hidden ones a quoted body was taken out into. */
export function isInlineName(name: string): boolean {
  return name.startsWith(INLINE_PREFIX);
}
