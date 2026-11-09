import type { PageState } from './playground-house';

/*
 * Links that open "Try a placeholder" with an example already in it (#427): what is in the
 * boxes goes in the address after `#`, so nothing is sent anywhere - the part after `#`
 * never leaves the browser - and a link pasted into an issue opens with the same example.
 *
 * Two spellings are read:
 *
 *   #try=j.<base64url>   what the page writes: the boxes as JSON, UTF-8, base64url
 *   #try=z.<base64url>   the same JSON deflated first, when the browser can do that
 *
 *   #placeholder=[[room|upper]]&variables=room:%20Hall
 *                        written by hand, for a docs page's "try it" link: any of
 *                        placeholder, variables, entities, templates and only (1 for
 *                        "only my entities"), each URL-encoded
 *
 * A link that does not read - cut short, from a later version, deflated where this browser
 * cannot inflate - opens the page as it is without one, and says so.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

const PREFIX = 'try=';
// Past this the address is not something a person pasted; and no box needs a megabyte.
const MAX_HASH = 200_000;
const MAX_JSON = 1_000_000;

/*
 * The Try a template page (#427) shares the same links: its card box goes in as `card`, and
 * its "every state readable" box as `all`. The two pages read only the fields they have.
 */
export type SharedState = Partial<PageState> & { card?: string; readAll?: boolean };

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let at = 0; at < bytes.length; at += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(at, at + 0x8000));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text: string): Uint8Array {
  const binary = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(binary.length);
  for (let at = 0; at < binary.length; at += 1) bytes[at] = binary.charCodeAt(at);
  return bytes;
}

async function through(
  bytes: Uint8Array,
  stream: TransformStream<Uint8Array, Uint8Array>,
  limit: number,
): Promise<Uint8Array> {
  const writer = stream.writable.getWriter();
  writer.write(bytes).catch(() => undefined);
  writer.close().catch(() => undefined);
  const reader = stream.readable.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    // A small link can inflate to a great deal; stop reading rather than fill the tab.
    if (size > limit) {
      reader.cancel().catch(() => undefined);
      throw new Error('too large');
    }
    chunks.push(value);
  }
  const out = new Uint8Array(size);
  let at = 0;
  for (const chunk of chunks) {
    out.set(chunk, at);
    at += chunk.length;
  }
  return out;
}

const canDeflate = (): boolean => typeof (globalThis as any).CompressionStream === 'function';
const canInflate = (): boolean => typeof (globalThis as any).DecompressionStream === 'function';

/** Only what differs from an empty page goes in, under short names. */
function packed(state: SharedState): Record<string, unknown> {
  const out: Record<string, unknown> = { v: 1 };
  if (state.variables) out.vars = state.variables;
  if (state.placeholder) out.ph = state.placeholder;
  if (state.entities) out.ent = state.entities;
  if (state.onlyMine) out.only = true;
  if (state.templates) out.tpl = state.templates;
  if (state.card) out.card = state.card;
  if (state.readAll) out.all = true;
  return out;
}

// Each field taken only when it is what it should be, so a link from some other version
// fills in what it can and leaves the rest.
function unpacked(data: any): SharedState {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('not a mapping');
  const state: SharedState = {};
  if (typeof data.vars === 'string') state.variables = data.vars;
  if (typeof data.ph === 'string') state.placeholder = data.ph;
  if (typeof data.ent === 'string') state.entities = data.ent;
  if (data.only === true) state.onlyMine = true;
  if (typeof data.tpl === 'string') state.templates = data.tpl;
  if (typeof data.card === 'string') state.card = data.card;
  if (data.all === true) state.readAll = true;
  return state;
}

/** The hash for these boxes, without the `#`: deflated when the browser can and it is shorter. */
export async function encodeState(state: SharedState, deflate = canDeflate()): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(packed(state)));
  const plain = `${PREFIX}j.${toBase64Url(bytes)}`;
  if (!deflate) return plain;
  try {
    const squeezed = await through(bytes, new (globalThis as any).CompressionStream('deflate-raw'), MAX_JSON);
    const zipped = `${PREFIX}z.${toBase64Url(squeezed)}`;
    return zipped.length < plain.length ? zipped : plain;
  } catch {
    return plain;
  }
}

export type Decoded = { state: SharedState } | { problem: string } | undefined;

/**
 * What a hash says to put in the boxes. Undefined when it says nothing of the kind - no hash,
 * or one that is only a heading's id - and a problem, in words, when it tried and failed.
 */
export async function decodeHash(hash: string): Promise<Decoded> {
  const text = hash.replace(/^#/, '');
  if (!text) return undefined;
  if (text.length > MAX_HASH) return { problem: 'That link is too long to be one this page made.' };
  if (text.startsWith(PREFIX)) {
    const body = text.slice(PREFIX.length);
    const kind = body.slice(0, 2);
    try {
      let bytes = fromBase64Url(body.slice(2));
      if (kind === 'z.') {
        if (!canInflate())
          return {
            problem: 'This browser cannot open that link: it was squeezed, and this browser cannot unsqueeze it.',
          };
        bytes = await through(bytes, new (globalThis as any).DecompressionStream('deflate-raw'), MAX_JSON);
      } else if (kind !== 'j.') throw new Error('unknown kind');
      if (bytes.length > MAX_JSON) throw new Error('too large');
      return { state: unpacked(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes))) };
    } catch {
      return { problem: 'That link did not read - it may have been cut short when it was copied.' };
    }
  }
  // Written by hand: names a docs page can spell out.
  const params = new URLSearchParams(text);
  const names = ['placeholder', 'variables', 'entities', 'templates', 'only', 'card'];
  if (!names.some((name) => params.has(name))) return undefined;
  const state: SharedState = {};
  const read = (name: string): string | undefined => {
    const value = params.get(name);
    return value === null ? undefined : value.slice(0, MAX_JSON);
  };
  if (read('placeholder') !== undefined) state.placeholder = read('placeholder');
  if (read('variables') !== undefined) state.variables = read('variables');
  if (read('entities') !== undefined) state.entities = read('entities');
  if (read('templates') !== undefined) state.templates = read('templates');
  if (read('card') !== undefined) state.card = read('card');
  if (params.get('only') === '1' || params.get('only') === 'true') state.onlyMine = true;
  return { state };
}

/**
 * A hand-written "try it" link for a docs page: the page's address and the boxes spelled
 * out. Longer than what the Copy link button makes, but a person can read and edit it.
 */
export function readableHash(state: SharedState): string {
  const params = new URLSearchParams();
  if (state.placeholder) params.set('placeholder', state.placeholder);
  if (state.variables) params.set('variables', state.variables);
  if (state.entities) params.set('entities', state.entities);
  if (state.templates) params.set('templates', state.templates);
  if (state.card) params.set('card', state.card);
  if (state.onlyMine) params.set('only', '1');
  // URLSearchParams writes a space as +; %20 reads the same and survives more places.
  return params.toString().replace(/\+/g, '%20');
}
