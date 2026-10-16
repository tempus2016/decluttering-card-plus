/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * Templates other people have shared. The bundled library covers the shapes everybody
 * asks for; this is everything else, posted as discussions on the project's GitHub. A post
 * is a template the way Share writes one out - YAML in a code block - so posting one is a
 * paste, and so is reading one back.
 *
 * There is no server in between. The browser asks GitHub directly, and only when somebody
 * presses the button: a dashboard never reaches the internet just by being opened.
 */

import { load } from 'js-yaml';
import { scanDependencies, validateImport } from './share';

export const COMMUNITY_REPO = 'tempus2016/decluttering-card-plus';
// Posts are matched on the slug, which GitHub derives from the category's name.
export const COMMUNITY_CATEGORY = 'share-your-templates';
export const COMMUNITY_POST_URL = `https://github.com/${COMMUNITY_REPO}/discussions/new?category=${COMMUNITY_CATEGORY}`;

// Without a token GitHub allows 60 requests an hour per address, shared with anything else
// on the network asking. The list changes slowly, so it is kept for a while and reused.
const CACHE_KEY = 'decluttering-card-plus-community';
const CACHE_HOURS = 6;
// A page is 100 discussions; ten pages is more than this project will have for a long time.
const MAX_PAGES = 10;

// Anyone with a GitHub account can post, and every post is read by everyone who loads the
// list - so a post gets a bounded amount of work, however it is written. A body longer than
// this is not a template, and a parsed value with more pieces than this has been pumped up
// by aliases: a few hundred bytes of `&a1 [*a0,*a0,...]` otherwise unfold into hundreds of
// megabytes the moment they are copied, and take the tab with them.
const MAX_BODY_LENGTH = 65_536;
const MAX_NODES = 20_000;

export interface CommunityEntry {
  /** The discussion's number, which is how an entry is told apart from the others. */
  id: number;
  /** The post's title, which is what the list shows. */
  title: string;
  /** Who posted it. */
  author: string;
  /** Where to read the post, its comments and any newer version. */
  url: string;
  /** The template's own name, which it is installed under unless that is taken. */
  name: string;
  /** The template as posted, minus its name and type - what a template card would hold. */
  template: Record<string, any>;
  /** Templates the post carries with it, by name. */
  includes: Record<string, any>;
  /** Reactions on the post, for ordering. */
  reactions: number;
  /** When the post was last edited, ISO. */
  updated: string;
}

export interface CommunityList {
  entries: CommunityEntry[];
  /** When the list was fetched, epoch milliseconds. */
  fetched: number;
}

/**
 * The YAML in a post: the first block marked as YAML, or failing that the first unmarked
 * one. Anything else in the post is prose for people, not for the card.
 */
export function extractYaml(body: string): string | undefined {
  if (typeof body !== 'string' || body.length > MAX_BODY_LENGTH) return undefined;
  // Read a line at a time rather than with one expression over the whole post: a post made
  // of fences that never close would otherwise be tried from every one of them.
  const opening = /^[ \t]*(`{3,}|~{3,})[ \t]*([\w-]*)/;
  const blocks: { lang: string; text: string }[] = [];
  let open: { fence: string; lang: string; lines: string[] } | undefined;
  for (const line of body.split('\n')) {
    if (open) {
      if (line.trim() === open.fence) {
        blocks.push({ lang: open.lang, text: open.lines.join('\n') + '\n' });
        open = undefined;
      } else {
        open.lines.push(line);
      }
      continue;
    }
    const found = opening.exec(line);
    if (found) open = { fence: found[1], lang: found[2], lines: [] };
  }
  const marked = blocks.find((block) => /^ya?ml$/i.test(block.lang));
  const chosen = marked ?? blocks.find((block) => block.lang === '');
  return chosen?.text;
}

/** Whether a parsed value is of a size a template could be, counting what aliases share. */
function withinBudget(value: unknown): boolean {
  let left = MAX_NODES;
  const walk = (node: unknown): boolean => {
    if ((left -= 1) < 0) return false;
    if (Array.isArray(node)) return node.every(walk);
    if (node && typeof node === 'object') return Object.values(node).every(walk);
    return true;
  };
  return walk(value);
}

const isMapping = (value: unknown): value is Record<string, any> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const THING_KEYS = ['card', 'badge', 'row', 'element', 'group'];

/** The templates a post carries with it: mappings that define something, nothing else. */
function usableIncludes(includes: unknown): Record<string, any> {
  if (!isMapping(includes)) return {};
  const out: Record<string, any> = {};
  for (const [name, template] of Object.entries(includes)) {
    if (isMapping(template) && THING_KEYS.some((key) => template[key] !== undefined)) out[name] = template;
  }
  return out;
}

/** Where a post lives: GitHub's own link to it, or the one its number says, never anything else. */
function postUrl(id: number, given: unknown): string {
  return typeof given === 'string' && /^https:\/\/github\.com\//.test(given)
    ? given
    : `https://github.com/${COMMUNITY_REPO}/discussions/${id}`;
}

/**
 * A discussion read as a template, or nothing if it does not hold one. A post that fails
 * to parse is left out of the list rather than offered and refused at install.
 */
export function parseDiscussion(discussion: any): CommunityEntry | undefined {
  const text = extractYaml(discussion?.body);
  if (!text) return undefined;

  let parsed: any;
  try {
    const loaded = load(text);
    // Sized before it is copied: the copy is what unfolds every alias.
    if (!withinBudget(loaded)) return undefined;
    // A round trip through JSON leaves plain objects, lists and values only, which is all a
    // card config is. A `__proto__` key goes too: copied onto an object later, it would
    // replace the object's prototype instead of becoming a key.
    parsed = JSON.parse(JSON.stringify(loaded), (key, value) => (key === '__proto__' ? undefined : value));
  } catch {
    return undefined;
  }
  if (!validateImport(parsed).ok) return undefined;
  if (typeof discussion?.number !== 'number') return undefined;

  const { template: name, includes, ...template } = parsed;
  delete template.type;
  // The description is shown as text next to the install button, so it has to be text.
  if (typeof template.description !== 'string') delete template.description;
  return {
    id: discussion.number,
    title: typeof discussion.title === 'string' && discussion.title.trim() ? discussion.title.trim() : name,
    author: typeof discussion.user?.login === 'string' ? discussion.user.login : '',
    url: postUrl(discussion.number, discussion.html_url),
    name: name.trim(),
    template,
    includes: usableIncludes(includes),
    reactions: typeof discussion.reactions?.total_count === 'number' ? discussion.reactions.total_count : 0,
    updated:
      typeof (discussion.updated_at ?? discussion.created_at) === 'string'
        ? (discussion.updated_at ?? discussion.created_at)
        : '',
  };
}

export interface CommunityRisks {
  /** Services the template calls when something on it is pressed. */
  actions: string[];
  /** Addresses outside Home Assistant that it reaches. */
  urls: string[];
  /** Whether it embeds a web page. */
  embeds: boolean;
  /** Whether it carries JavaScript or Jinja that runs with the viewer's login. */
  scripts: boolean;
}

/*
 * What installing a post would let it do, read off its config: nobody has checked the post,
 * so the card says what it found and lets the person decide. A false alarm costs a sentence;
 * a lock opened by a tile labelled "Lights" costs rather more.
 */
export function communityRisks(entry: Pick<CommunityEntry, 'template' | 'includes'>): CommunityRisks {
  const actions = new Set<string>();
  const urls = new Set<string>();
  let embeds = false;
  let scripts = false;
  const walk = (node: unknown): void => {
    if (typeof node === 'string') {
      // The address up to its first template marker: what is after `{{` is not part of it.
      for (const url of node.match(/https?:\/\/[^\s"'<>)\]{}]+/g) ?? []) urls.add(url);
      if (node.includes('[[[') || node.includes('{{') || node.includes('{%')) scripts = true;
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (!isMapping(node)) return;
    if (node.action === 'perform-action' || node.action === 'call-service') {
      const service = node.perform_action ?? node.service;
      actions.add(typeof service === 'string' ? service : '?');
    }
    if (node.type === 'iframe' || node.type === 'webpage') embeds = true;
    Object.values(node).forEach(walk);
  };
  walk([entry.template, ...Object.values(entry.includes)]);
  return { actions: [...actions].sort(), urls: [...urls].sort(), embeds, scripts };
}

/** The posts in the shared-templates category, best received first, then newest. */
export function parseDiscussions(discussions: any[]): CommunityEntry[] {
  return discussions
    .filter((discussion) => discussion?.category?.slug === COMMUNITY_CATEGORY)
    .map(parseDiscussion)
    .filter((entry): entry is CommunityEntry => !!entry)
    .sort((a, b) => b.reactions - a.reactions || b.updated.localeCompare(a.updated));
}

/**
 * What a shared template needs that installing it will not bring: custom cards, and
 * templates it calls that neither travel with it nor are already here.
 */
export function communityNeeds(
  entry: CommunityEntry,
  existing: string[],
): { customTypes: string[]; templates: string[] } {
  const customTypes = new Set<string>();
  const templates = new Set<string>();
  for (const one of [entry.template, ...Object.values(entry.includes)]) {
    const found = scanDependencies(one);
    found.customTypes.forEach((each) => customTypes.add(each));
    found.templateRefs.forEach((each) => templates.add(each));
  }
  return {
    customTypes: [...customTypes].sort(),
    templates: [...templates]
      .filter((each) => each !== entry.name && !(each in entry.includes) && !existing.includes(each))
      .sort(),
  };
}

/** A template written out as a discussion post: what it is, then the YAML to paste. */
export function postBody(yaml: string, notes: string[], description?: string): string {
  const intro = [description, ...notes].filter((line) => typeof line === 'string' && line.trim());
  return [...intro, '```yaml\n' + yaml.replace(/\n*$/, '') + '\n```'].join('\n\n') + '\n';
}

export class CommunityError extends Error {
  /** A list fetched earlier, still worth showing when this attempt failed. */
  cached?: CommunityList;
  /** For a rate limit: when GitHub will answer again, epoch milliseconds. */
  retryAt?: number;
}

/** An entry read back from storage, checked as if it had just arrived, or nothing. */
function cachedEntry(value: any): CommunityEntry | undefined {
  if (!isMapping(value) || typeof value.id !== 'number' || typeof value.name !== 'string') return undefined;
  if (!isMapping(value.template)) return undefined;
  return {
    id: value.id,
    title: typeof value.title === 'string' ? value.title : value.name,
    author: typeof value.author === 'string' ? value.author : '',
    url: postUrl(value.id, value.url),
    name: value.name,
    template: value.template,
    includes: usableIncludes(value.includes),
    reactions: typeof value.reactions === 'number' ? value.reactions : 0,
    updated: typeof value.updated === 'string' ? value.updated : '',
  };
}

function readCache(storage: Storage | undefined): CommunityList | undefined {
  try {
    const cached = JSON.parse(storage?.getItem(CACHE_KEY) ?? 'null');
    if (!cached || !Array.isArray(cached.entries) || typeof cached.fetched !== 'number') return undefined;
    // Storage is shared with everything else on the origin, so what is in it is checked the
    // way a fresh post is rather than trusted for having been written here.
    const entries = cached.entries.map(cachedEntry).filter((entry: CommunityEntry | undefined) => !!entry);
    return { entries, fetched: cached.fetched };
  } catch {
    return undefined;
  }
}

/**
 * The shared templates, from the cache while it is fresh and from GitHub otherwise -
 * or always from GitHub when `refresh` is set. A failure carries whatever was cached, so
 * the caller can still show something.
 */
export async function fetchCommunity(
  options: { refresh?: boolean; fetcher?: typeof fetch; storage?: Storage; now?: number } = {},
): Promise<CommunityList> {
  const fetcher = options.fetcher ?? fetch.bind(globalThis);
  const storage = options.storage ?? (typeof localStorage === 'undefined' ? undefined : localStorage);
  const now = options.now ?? Date.now();

  const cached = readCache(storage);
  if (cached && !options.refresh && now - cached.fetched < CACHE_HOURS * 3600 * 1000) return cached;

  const discussions: any[] = [];
  try {
    for (let page = 1; page <= MAX_PAGES; page += 1) {
      const response = await fetcher(
        `https://api.github.com/repos/${COMMUNITY_REPO}/discussions?per_page=100&page=${page}`,
        { headers: { Accept: 'application/vnd.github+json' } },
      );
      if (!response.ok) {
        const error = new CommunityError(`GitHub answered ${response.status}`);
        if (response.headers.get('x-ratelimit-remaining') === '0') {
          error.retryAt = Number(response.headers.get('x-ratelimit-reset')) * 1000 || undefined;
        }
        throw error;
      }
      const batch = await response.json();
      if (!Array.isArray(batch)) break;
      discussions.push(...batch);
      if (batch.length < 100) break;
    }
  } catch (err) {
    const error = err instanceof CommunityError ? err : new CommunityError((err as Error)?.message ?? String(err));
    error.cached = cached;
    throw error;
  }

  const list = { entries: parseDiscussions(discussions), fetched: now };
  try {
    storage?.setItem(CACHE_KEY, JSON.stringify(list));
  } catch {
    // A full or blocked storage only costs the next visit a fetch.
  }
  return list;
}
