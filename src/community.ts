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
  if (typeof body !== 'string') return undefined;
  const fence = /^[ \t]*(`{3,}|~{3,})[ \t]*([\w-]*)[^\n]*\n([\s\S]*?)^[ \t]*\1[ \t]*$/gm;
  const blocks: RegExpExecArray[] = [];
  for (let found = fence.exec(body); found; found = fence.exec(body)) blocks.push(found);
  const marked = blocks.find((block) => /^ya?ml$/i.test(block[2]));
  const chosen = marked ?? blocks.find((block) => block[2] === '');
  return chosen?.[3];
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
    // A round trip through JSON leaves plain objects, lists and values only, which is all a
    // card config is. A `__proto__` key goes too: copied onto an object later, it would
    // replace the object's prototype instead of becoming a key.
    parsed = JSON.parse(JSON.stringify(load(text)), (key, value) => (key === '__proto__' ? undefined : value));
  } catch {
    return undefined;
  }
  if (!validateImport(parsed).ok) return undefined;

  const { template: name, includes, ...template } = parsed;
  delete template.type;
  return {
    id: discussion.number,
    title: typeof discussion.title === 'string' && discussion.title.trim() ? discussion.title.trim() : name,
    author: discussion.user?.login ?? '',
    url: discussion.html_url ?? '',
    name: name.trim(),
    template,
    includes: includes && typeof includes === 'object' && !Array.isArray(includes) ? includes : {},
    reactions: discussion.reactions?.total_count ?? 0,
    updated: discussion.updated_at ?? discussion.created_at ?? '',
  };
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

function readCache(storage: Storage | undefined): CommunityList | undefined {
  try {
    const cached = JSON.parse(storage?.getItem(CACHE_KEY) ?? 'null');
    return cached && Array.isArray(cached.entries) && typeof cached.fetched === 'number' ? cached : undefined;
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
