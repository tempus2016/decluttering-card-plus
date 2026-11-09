import { loadAll, dump } from 'js-yaml';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * "Load gist" on the Try a template page (#427): a public gist read by id, with no login, into
 * the page's boxes. Load only - making or changing a gist needs a GitHub login, which a
 * static docs page has no business holding.
 *
 * A gist fills the boxes in one of two ways:
 *
 *   separate files     templates.yaml, card.yaml, entities.yaml (.yml too). Any other file
 *                      is left alone. Each file is the box as you would type it.
 *   one YAML file      a single .yaml/.yml file with `decluttering_templates:` (and any
 *                      decluttering_defaults:, decluttering_let: beside it), `card:` and
 *                      `entities:` keys. The card and entities are taken out; everything
 *                      else is the templates box.
 */

export const GIST_API = 'https://api.github.com/gists/';
// The API cuts a file off past a megabyte and says so; the boxes do not need more than that.
const MAX_TOTAL = 1_000_000;
const MAX_ALIASES = 50;

/** The file names each box is filled from, first found wins. */
export const GIST_FILES = {
  templates: ['templates.yaml', 'templates.yml'],
  card: ['card.yaml', 'card.yml'],
  entities: ['entities.yaml', 'entities.yml'],
} as const;

export interface GistBoxes {
  templates?: string;
  card?: string;
  entities?: string;
}

export type GistResult = { boxes: GistBoxes; files: string[]; owner?: string } | { problem: string };

/** A gist id from what was typed: the id itself, or a gist's address. Undefined when it is neither. */
export function gistId(text: string): string | undefined {
  const typed = text.trim();
  if (/^[0-9a-f]{5,64}$/i.test(typed)) return typed.toLowerCase();
  const url = /^https?:\/\/gist\.github(?:usercontent)?\.com\/(?:[A-Za-z0-9-]+\/)?([0-9a-f]{5,64})(?:[/#?].*)?$/i.exec(
    typed,
  );
  return url ? url[1].toLowerCase() : undefined;
}

const yamlName = (name: string): boolean => /\.ya?ml$/i.test(name);

/** The boxes a gist's API answer fills, or why it fills none. */
export function boxesFromGist(gist: any): GistResult {
  const files: Record<string, any> = gist?.files && typeof gist.files === 'object' ? gist.files : {};
  const names = Object.keys(files);
  if (!names.length) return { problem: 'That gist has no files in it.' };
  let total = 0;
  for (const name of names) {
    if (files[name]?.truncated)
      return { problem: `${name} in that gist is too large for this page (over a megabyte).` };
    total += typeof files[name]?.content === 'string' ? files[name].content.length : 0;
  }
  if (total > MAX_TOTAL) return { problem: 'That gist is too large for this page (over a megabyte altogether).' };
  const owner = typeof gist?.owner?.login === 'string' ? gist.owner.login : undefined;
  const lower = new Map(names.map((name) => [name.toLowerCase(), name]));
  const boxes: GistBoxes = {};
  const used: string[] = [];
  for (const box of Object.keys(GIST_FILES) as (keyof typeof GIST_FILES)[]) {
    const found = GIST_FILES[box].map((name) => lower.get(name)).find((name) => name !== undefined);
    if (found !== undefined && typeof files[found].content === 'string') {
      boxes[box] = files[found].content;
      used.push(found);
    }
  }
  if (used.length) return { boxes, files: used, ...(owner ? { owner } : {}) };

  // One YAML file holding everything.
  const yamls = names.filter(yamlName);
  if (yamls.length !== 1) {
    return {
      problem: `That gist has no ${[...GIST_FILES.templates, ...GIST_FILES.card].slice(0, 3).join(', ')} or entities.yaml, and ${
        yamls.length ? 'more than one' : 'no'
      } other YAML file to read everything from.`,
    };
  }
  const name = yamls[0];
  let doc: any;
  try {
    doc = loadAll(String(files[name].content ?? ''), { maxAliases: MAX_ALIASES }).filter((each) => each != null)[0];
  } catch (err) {
    return { problem: `${name} does not read as YAML: ${(err as Error).message.split('\n')[0]}` };
  }
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
    return { problem: `${name} should be a mapping with decluttering_templates:, card: and entities: in it.` };
  }
  const { card, entities, ...rest } = doc;
  if (!rest.decluttering_templates && card === undefined) {
    return { problem: `${name} has neither decluttering_templates: nor card: in it.` };
  }
  const write = (value: unknown): string => dump(value, { lineWidth: -1, noRefs: true });
  return {
    boxes: {
      ...(Object.keys(rest).length ? { templates: write(rest) } : {}),
      ...(card !== undefined ? { card: write(card) } : {}),
      ...(entities !== undefined ? { entities: write(entities) } : {}),
    },
    files: [name],
    ...(owner ? { owner } : {}),
  };
}

type Fetch = (
  url: string,
  init?: any,
) => Promise<{
  ok: boolean;
  status: number;
  headers: { get(name: string): string | null };
  json(): Promise<any>;
}>;

/** Fetch a public gist by id and read it into boxes. Never throws: what went wrong comes back in words. */
export async function loadGist(id: string, fetcher: Fetch = (globalThis as any).fetch): Promise<GistResult> {
  const wanted = gistId(id);
  if (!wanted) return { problem: 'That is not a gist id or a gist address.' };
  let response;
  try {
    response = await fetcher(`${GIST_API}${wanted}`, {
      headers: { Accept: 'application/vnd.github+json' },
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    });
  } catch {
    return { problem: 'GitHub could not be reached, so the gist did not load. Try again in a moment.' };
  }
  if (response.status === 404)
    return { problem: 'There is no public gist with that id - or it was deleted, or is secret to its owner.' };
  if (response.status === 403 || response.status === 429) {
    const left = response.headers.get('x-ratelimit-remaining');
    const reset = Number(response.headers.get('x-ratelimit-reset'));
    // The headers only reach the page when GitHub exposes them; the message says it either way.
    let said = '';
    try {
      said = String((await response.json())?.message ?? '');
    } catch {
      said = '';
    }
    if (left === '0' || response.status === 429 || /rate limit/i.test(said)) {
      const when =
        Number.isFinite(reset) && reset > 0 ? ` after ${new Date(reset * 1000).toLocaleTimeString()}` : ' in a while';
      return {
        problem: `GitHub lets a browser load sixty gists an hour without a login, and this one has used them. Try again${when}.`,
      };
    }
    return { problem: 'GitHub refused to give out that gist.' };
  }
  if (!response.ok) return { problem: `GitHub answered ${response.status}, so the gist did not load.` };
  const length = Number(response.headers.get('content-length'));
  if (Number.isFinite(length) && length > 4 * MAX_TOTAL) return { problem: 'That gist is too large for this page.' };
  let gist;
  try {
    gist = await response.json();
  } catch {
    return { problem: 'GitHub sent back something that is not a gist.' };
  }
  return boxesFromGist(gist);
}
