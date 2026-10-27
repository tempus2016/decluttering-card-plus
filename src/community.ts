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
import deepReplace from './deep-replace';
import { isRegistrySource } from './registry';
import { scanDependencies, validateImport } from './share';
import { CONSUMER_TYPES } from './templates';
import { TemplateConfig, VariablesConfig } from './types';

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
// megabytes the moment they are copied, and take the tab with them. Text counts towards the
// size as well as structure, a unit for every few characters, because the same trick works
// with one long string shared between a handful of lists - few pieces, but each a mouthful.
// And the parser is told how many aliases to accept before any of that: a template shares a
// few action blocks at most, a bomb needs dozens.
const MAX_BODY_LENGTH = 65_536;
const MAX_NODES = 20_000;
const CHARS_PER_NODE = 16;
const MAX_ALIASES = 50;

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

/*
 * What GitHub shows of a post is what people judge it by - the moderation, the reactions the
 * list is ordered on - so the card has to read the same YAML they saw. A code block inside an
 * HTML comment is invisible on GitHub but was the first block to this reader, which let a post
 * show one template and install another (review 2026-10-25). Comments go before anything is
 * read; an unterminated one hides the rest of the post, as it does on GitHub.
 */
function withoutHiddenHtml(body: string): string {
  return body.replace(/<!--[\s\S]*?(?:-->|$)/g, '');
}

/**
 * The YAML in a post: the first block marked as YAML, or failing that the first unmarked
 * one. Anything else in the post is prose for people, not for the card.
 */
export function extractYaml(body: string): string | undefined {
  if (typeof body !== 'string' || body.length > MAX_BODY_LENGTH) return undefined;
  // Read a line at a time rather than with one expression over the whole post: a post made
  // of fences that never close would otherwise be tried from every one of them.
  // A fence indented four spaces or more is not a fence to GitHub - it shows as text.
  const opening = /^ {0,3}(`{3,}|~{3,})[ \t]*([\w-]*)/;
  const blocks: { lang: string; text: string }[] = [];
  let open: { fence: string; lang: string; lines: string[] } | undefined;
  for (const line of withoutHiddenHtml(body).split('\n')) {
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

/**
 * Whether a parsed value is of a size a template could be, counting what aliases share:
 * every piece once for being there, and text - keys included - once more for every
 * CHARS_PER_NODE characters, so what the copy will produce is bounded whatever shape it has.
 */
export function withinBudget(value: unknown): boolean {
  let left = MAX_NODES;
  const charge = (length: number): boolean => (left -= 1 + Math.ceil(length / CHARS_PER_NODE)) >= 0;
  const walk = (node: unknown): boolean => {
    if (typeof node === 'string') return charge(node.length);
    if (!charge(0)) return false;
    if (Array.isArray(node)) return node.every(walk);
    if (node && typeof node === 'object') {
      return Object.entries(node).every(([key, child]) => charge(key.length) && walk(child));
    }
    return true;
  };
  return walk(value);
}

const isMapping = (value: unknown): value is Record<string, any> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

/*
 * A value as plain objects, lists and scalars, within the budget, and with no `__proto__`
 * key anywhere - copied onto an object later, that key would replace the object's prototype
 * instead of becoming a key. Nothing when it is too big to be a template.
 */
function plainWithinBudget(value: unknown): any {
  if (!withinBudget(value)) return undefined;
  return JSON.parse(JSON.stringify(value), (key, inner) => (key === '__proto__' ? undefined : inner));
}

/*
 * A title as the list shows it. Blank-looking characters that are not spaces - the Braille
 * blank, the Hangul filler, format characters - let a title end in a run of nothing that pushes
 * the real author off the end of the line, so they go, and a title is cut to a length that
 * leaves room for the author after it (review 2026-10-25).
 */
const MAX_TITLE_LENGTH = 80;
const BLANKS = /[\p{Cf}\u2800\u3164\u115F\u1160\uFFA0]/gu;
export function cleanTitle(title: unknown): string | undefined {
  if (typeof title !== 'string') return undefined;
  const text = title.replace(BLANKS, '').replace(/\s+/g, ' ').trim();
  if (!text) return undefined;
  return text.length > MAX_TITLE_LENGTH ? `${text.slice(0, MAX_TITLE_LENGTH - 1)}…` : text;
}

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
    // Too many aliases is a parse error, which lands in the catch below like any other.
    const loaded = load(text, { maxAliases: MAX_ALIASES });
    // Sized before it is copied: the copy is what unfolds every alias. The round trip through
    // JSON leaves plain objects, lists and values only, which is all a card config is.
    parsed = plainWithinBudget(loaded);
    if (parsed === undefined) return undefined;
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
    title: cleanTitle(discussion.title) ?? name,
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
  /** Services the template calls when something on it is pressed, and presses that work a lock, a cover, an alarm or a script. */
  actions: string[];
  /** Addresses outside Home Assistant that it reaches. */
  urls: string[];
  /** Whether it embeds a web page. */
  embeds: boolean;
  /** Whether it carries JavaScript or Jinja that runs with the viewer's login. */
  scripts: boolean;
  /** Whether what a press does, or what kind of card it is, is spelt by a variable - which the post cannot show. */
  placeholders: boolean;
  /** Whether a style lays a card invisibly over the whole screen, where any press lands on it. */
  overlay: boolean;
}

// Pressing something on an entity in one of these domains does more than switch a light,
// so an action that works the entity - a toggle, above all - is worth a sentence. On a light,
// a switch or a fan it is what the card is for.
const SENSITIVE_DOMAINS = [
  'lock',
  'alarm_control_panel',
  'cover',
  'valve',
  'siren',
  'script',
  'automation',
  'button',
  'input_button',
  'water_heater',
  'lawn_mower',
  'update',
];
// Actions that only show something or go somewhere, fine on anything.
const HARMLESS_ACTIONS = ['more-info', 'navigate', 'none', 'assist'];
// The values that decide what a press does and what a card is. A placeholder in one of them
// is a risk in itself: whoever reads the post cannot tell what it will become.
const DECIDING_KEYS = ['action', 'perform_action', 'service', 'type'];

/*
 * An address: a scheme in any case followed by a dotted host, with or without the `//` -
 * a browser reads `https:evil.example/x` as an address, and `mdi:lightbulb` has no dot - or
 * no scheme at all but `//` and a dotted host, which is what tells `//evil.example/x` from
 * the `//` that opens a comment. Up to the first template marker: what is after `{{` is not
 * part of it. Backslashes are read as the slashes a browser makes of them before any of this
 * is matched (review 2026-10-25).
 */
const URL_PATTERN =
  /\b[a-z][a-z0-9+.-]{1,31}:(?:\/\/)?[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?|\/\/[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?/gi;
// A style fetches too, through url(), image-set(), src() and @import.
const CSS_FETCHES = [/(?:url|image-set|src)\(\s*['"]?([^'")\s{}]+)/gi, /@import\s+(?:url\(\s*)?['"]?([^'")\s;{}]+)/gi];
// What a style can fetch without leaving Home Assistant: its own files, an anchor, inline data.
const LOCAL_FETCH = /^(?:\/(?!\/)|#|data:)/i;
// Keys whose value is fetched as an address by the card that reads them: an image, a page, a
// picture. One that is not a path of this Home Assistant's own, a placeholder or inline data
// goes somewhere, scheme or no scheme.
const FETCHED_KEYS = ['image', 'url', 'url_path', 'entity_picture', 'camera_image', 'image_url', 'icon_url', 'src'];
// JavaScript the way button-card, config-template-card and Jinja carry it.
const SCRIPT_MARKERS = /\[\[\[|\{\{|\{%|\$\{/;
// A url action aimed at a scheme the browser runs rather than fetches.
const SCRIPT_SCHEMES = /^\s*(?:javascript|data|vbscript):/i;
/*
 * A style that takes a card out of the flow and across the screen while hiding it: anything
 * pressed anywhere is pressed on it, and whatever action it has fires (review 2026-10-25).
 */
const COVERS_SCREEN = /position\s*:\s*(?:fixed|absolute)/i;
const HIDDEN = /opacity\s*:\s*0(?:[^.\d]|$)|visibility\s*:\s*hidden|transparent/i;

const sensitive = (entity: unknown): entity is string =>
  typeof entity === 'string' && SENSITIVE_DOMAINS.includes(entity.split('.')[0]);

/** Slashes the way a browser reads them: a backslash in an address is a slash. */
const asBrowserReads = (text: string): string => text.replace(/\\/g, '/');

/*
 * The domains a filter can reach: named outright, or read off the entity patterns it lists,
 * where a pattern with no domain in front of its dot - or no pattern at all - reaches every
 * domain. For a registry source and for an auto-entities filter alike.
 */
const ANY_DOMAIN = '*';
function domainsOf(domain: unknown, patterns: unknown): string[] {
  const named = ([] as unknown[]).concat(domain ?? []).filter((each): each is string => typeof each === 'string');
  if (named.length) return named.includes(ANY_DOMAIN) ? [ANY_DOMAIN] : named;
  const listed = ([] as unknown[]).concat(patterns ?? []).filter((each): each is string => typeof each === 'string');
  if (!listed.length) return [ANY_DOMAIN];
  const domains = listed.map((pattern) => {
    const dot = pattern.indexOf('.');
    const head = dot === -1 ? pattern : pattern.slice(0, dot);
    return /^[a-z_]+$/.test(head) ? head : ANY_DOMAIN;
  });
  return domains.includes(ANY_DOMAIN) ? [ANY_DOMAIN] : [...new Set(domains)];
}

/*
 * The presses in a block of config whose target is not spelt out - it is a placeholder, or
 * there is none and the card's own entity stands for it. Each is a danger exactly when what
 * fills the entity in can be something sensitive, which the caller knows and this does not.
 */
function unaimedPresses(node: unknown, entity: string | undefined, found = new Set<string>()): Set<string> {
  if (Array.isArray(node)) {
    node.forEach((each) => unaimedPresses(each, entity, found));
    return found;
  }
  if (!isMapping(node)) return found;
  const own = typeof node.entity === 'string' ? node.entity : entity;
  const action = node.action;
  if (typeof action === 'string' && !HARMLESS_ACTIONS.includes(action) && !action.includes('[[')) {
    if (action !== 'perform-action' && action !== 'call-service' && action !== 'fire-dom-event' && action !== 'url') {
      const aimed = ([] as unknown[]).concat(node.target?.entity_id ?? node.entity_id ?? own ?? []);
      if (!aimed.length || aimed.some((target) => typeof target !== 'string' || target.includes('[['))) {
        found.add(action);
      }
    }
  }
  Object.values(node).forEach((each) => unaimedPresses(each, own, found));
  return found;
}

/*
 * The thing a template defines with the template's own defaults in place - its `default:`
 * list and what its declarations default to - and nothing from Home Assistant, which this
 * scan does not have. Nothing when substitution cannot run on it: the raw text is scanned
 * either way.
 */
function withOwnDefaults(template: Record<string, any>, variables?: VariablesConfig[]): unknown {
  const key = THING_KEYS.find((each) => template[each] !== undefined);
  if (!key) return undefined;
  try {
    return deepReplace(variables, template as TemplateConfig, template[key], undefined, undefined, true);
  } catch {
    return undefined;
  }
}

/** The variables a nested template card passes, as a list of single-key entries. */
function passedVariables(value: unknown): VariablesConfig[] | undefined {
  if (Array.isArray(value)) return value.filter(isMapping) as VariablesConfig[];
  if (isMapping(value)) return Object.entries(value).map(([name, each]) => ({ [name]: each }));
  return undefined;
}

/*
 * What installing a post would let it do, read off its config: nobody has checked the post,
 * so the card says what it found and lets the person decide. A false alarm costs a sentence;
 * a lock opened by a tile labelled "Lights" costs rather more.
 *
 * Read twice: as written, and with the template's own defaults substituted. A post can
 * write `action: '[[a]]'` and keep `a: perform-action` in its defaults, and only the second
 * reading sees the service call - while the first is what notices the placeholder.
 */
export function communityRisks(
  entry: Pick<CommunityEntry, 'template' | 'includes'> & Partial<Pick<CommunityEntry, 'name'>>,
): CommunityRisks {
  const actions = new Set<string>();
  const urls = new Set<string>();
  let embeds = false;
  let scripts = false;
  let placeholders = false;
  let overlay = false;

  const scanText = (raw: string): void => {
    const text = asBrowserReads(raw);
    for (const url of text.match(URL_PATTERN) ?? []) urls.add(url);
    for (const pattern of CSS_FETCHES) {
      pattern.lastIndex = 0;
      let found = pattern.exec(text);
      while (found) {
        if (!LOCAL_FETCH.test(found[1])) urls.add(found[1]);
        found = pattern.exec(text);
      }
    }
    if (SCRIPT_MARKERS.test(raw)) scripts = true;
    if (COVERS_SCREEN.test(raw) && HIDDEN.test(raw)) overlay = true;
  };

  // A value a card fetches: anything that is not this Home Assistant's own path, a
  // placeholder, inline data or an anchor goes somewhere - with a scheme or without one.
  const scanFetched = (raw: string): void => {
    const text = asBrowserReads(raw).trim();
    if (!text || LOCAL_FETCH.test(text) || text.startsWith('[[') || text.startsWith('{{')) return;
    if (/^[\w.-]+\.[a-z]{2,}(?:[:/?#]|$)/i.test(text)) urls.add(text);
  };

  // The template a nested template card calls, by the name it uses here.
  // The templates being read again with a card's variables right now, outermost first.
  const calling = new Set<string>();
  const templateNamed = (name: unknown): Record<string, any> | undefined => {
    if (typeof name !== 'string') return undefined;
    if (name === entry.name) return entry.template;
    return Object.prototype.hasOwnProperty.call(entry.includes, name) ? entry.includes[name] : undefined;
  };

  // What a press whose target is filled in from a filter can reach: each sensitive domain the
  // filter reaches, or everything when the filter does not say.
  const noteReach = (presses: Set<string>, domains: string[]): void => {
    for (const action of presses) {
      if (domains.includes(ANY_DOMAIN)) actions.add(`${action} *`);
      else for (const domain of domains) if (SENSITIVE_DOMAINS.includes(domain)) actions.add(`${action} ${domain}.*`);
    }
  };

  // An action, with the entity the card it sits on is about, which is what a toggle works.
  const noteAction = (node: Record<string, any>, entity: string | undefined): void => {
    const action = node.action;
    if (action === 'perform-action' || action === 'call-service') {
      const service = node.perform_action ?? node.service;
      // A placeholder here is reported as one, not as a service nobody can name.
      if (typeof service !== 'string') actions.add('?');
      else if (!service.includes('[[')) actions.add(service);
      return;
    }
    if (action === 'fire-dom-event') {
      actions.add('fire-dom-event');
      return;
    }
    if (action === 'url') {
      urls.add(typeof node.url_path === 'string' ? node.url_path : '?');
      if (typeof node.url_path === 'string' && SCRIPT_SCHEMES.test(node.url_path)) scripts = true;
      return;
    }
    if (HARMLESS_ACTIONS.includes(action) || action.includes('[[')) return;
    const aimed = ([] as unknown[]).concat(node.target?.entity_id ?? node.entity_id ?? node.entity ?? entity ?? []);
    for (const target of aimed) if (sensitive(target)) actions.add(`${action} ${target}`);
  };

  const walk = (node: unknown, entity: string | undefined): void => {
    if (typeof node === 'string') {
      scanText(node);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((each) => walk(each, entity));
      return;
    }
    if (!isMapping(node)) return;
    const own = typeof node.entity === 'string' ? node.entity : entity;
    if (Object.keys(node).some((key) => key.includes('[['))) placeholders = true;
    if (DECIDING_KEYS.some((key) => typeof node[key] === 'string' && node[key].includes('[['))) placeholders = true;
    if (typeof node.action === 'string') noteAction(node, own);
    if (node.type === 'iframe' || node.type === 'webpage') embeds = true;
    for (const key of FETCHED_KEYS) if (typeof node[key] === 'string') scanFetched(node[key]);
    /*
     * A nested template card chooses what a `[[entity]]` in the template it calls becomes:
     * by the registry it repeats over, or by the variables it passes. The scan of the called
     * template alone sees a placeholder and nothing more, so it is read again here with what
     * this card gives it (review 2026-10-25).
     */
    if (typeof node.type === 'string' && CONSUMER_TYPES.includes(node.type)) {
      const called = templateNamed(node.template);
      if (called) {
        if (isRegistrySource(node.for_each_from)) {
          const source = node.for_each_from;
          const body = THING_KEYS.map((key) => called[key]).find((each) => each !== undefined);
          noteReach(unaimedPresses(body, undefined), domainsOf(source.domain, source.entities));
        }
        // A template that calls itself, or two that call each other, is read once per chain:
        // reading it again with the same card inside would never end.
        const passed = passedVariables(node.variables);
        if (passed?.length && !calling.has(node.template)) {
          calling.add(node.template);
          walk(withOwnDefaults(called, passed), undefined);
          calling.delete(node.template);
        }
      }
    }
    // auto-entities fills its card with whatever its filters find, and the options on each
    // filter are what a press on those does.
    if (node.type === 'custom:auto-entities' && isMapping(node.filter)) {
      for (const filter of ([] as unknown[]).concat(node.filter.include ?? [])) {
        if (!isMapping(filter)) continue;
        const reach = domainsOf(filter.domain, filter.entity_id);
        noteReach(unaimedPresses(filter.options, undefined), reach);
        noteReach(unaimedPresses(node.card, undefined), reach);
      }
    }
    Object.values(node).forEach((each) => walk(each, own));
  };

  const templates = [entry.template, ...Object.values(entry.includes)];
  walk(templates, undefined);
  for (const template of templates) walk(withOwnDefaults(template), undefined);
  return { actions: [...actions].sort(), urls: [...urls].sort(), embeds, scripts, placeholders, overlay };
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
  // Sized, flattened and checked as a fresh post is: storage is anybody's on this origin.
  const plain = plainWithinBudget({ template: value.template, includes: value.includes });
  if (!plain || !isMapping(plain.template)) return undefined;
  if (!validateImport({ template: value.name, ...plain.template }).ok) return undefined;
  const template = { ...plain.template };
  delete template.type;
  if (typeof template.description !== 'string') delete template.description;
  return {
    id: value.id,
    title: cleanTitle(value.title) ?? value.name,
    author: typeof value.author === 'string' ? value.author : '',
    url: postUrl(value.id, value.url),
    name: value.name,
    template,
    includes: usableIncludes(plain.includes),
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

/** Where an installed shared template came from, stamped on it as `source:`. */
export interface CommunitySource {
  /** The discussion it was posted in. */
  discussion: number;
  /** When that post was last edited, as GitHub said at the time - what a later check compares against. */
  updated: string;
  /** Its name in the post, which is not always the name it was installed under. */
  name: string;
  /** Who had posted it. A later version by anybody else is not the same template, and is not offered. */
  author: string;
}

/** The stamp for one template out of a post: the post itself, or one of the templates it carries. */
export function communitySource(
  entry: Pick<CommunityEntry, 'id' | 'updated' | 'author'>,
  name: string,
): CommunitySource {
  return { discussion: entry.id, updated: entry.updated, name, author: entry.author };
}

/** A template out of a post, ready to install: whatever `source:` it was posted with replaced by where it came from. */
export function stampedTemplate(template: Record<string, any>, source: unknown): Record<string, any> {
  return { ...template, source };
}

/** The template a stamp points at in a post as it is now, or nothing if the post no longer carries it. */
function postTemplate(entry: CommunityEntry, name: string | undefined): Record<string, any> | undefined {
  if (name === undefined || name === entry.name) return entry.template;
  return Object.prototype.hasOwnProperty.call(entry.includes, name) ? entry.includes[name] : undefined;
}

export interface SharedUpdate {
  /** The name it is installed under here. */
  name: string;
  /**
   * `update` when the post has been edited since, `current` when not, `gone` when the post or
   * the template in it is no longer there, and `unverified` when the post is there but is not
   * by whoever the stamp says posted what was installed.
   */
  status: 'update' | 'current' | 'gone' | 'unverified';
  /** The post, when it is still listed. */
  entry?: CommunityEntry;
  /** The template as the post has it now, stamped and ready to replace the installed one. */
  latest?: Record<string, any>;
}

/**
 * Which installed shared templates have a newer version, read against a freshly fetched
 * list. The post's own edit time is what is compared - not the content, which the person
 * may have changed since installing - so an update is offered exactly when the author has
 * changed something, and never because somebody tweaked their own copy.
 *
 * The stamp is only believed as far as it can be checked. It names a post and who posted
 * it; a post by anybody else under that number - or a stamp that never said who, which no
 * install writes - is reported, not offered, whatever its edit time says. Updating replaces
 * the template wherever it is defined and saves the dashboard, and that is only ever done
 * towards the account the template was taken from in the first place.
 */
export function sharedUpdates(
  installed: { name: string; source: { discussion: number; updated?: string; name?: string; author?: string } }[],
  list: CommunityList,
): SharedUpdate[] {
  return installed.map(({ name, source }) => {
    const entry = list.entries.find((each) => each.id === source.discussion);
    const nameInPost = typeof source.name === 'string' ? source.name : undefined;
    const template = entry ? postTemplate(entry, nameInPost) : undefined;
    if (!entry || !template) return { name, status: 'gone' as const, ...(entry ? { entry } : {}) };
    if (typeof source.author !== 'string' || !source.author || source.author !== entry.author) {
      return { name, status: 'unverified' as const, entry };
    }
    const was = Date.parse(source.updated ?? '');
    const now = Date.parse(entry.updated);
    // A stamp without a readable time cannot be compared, so a post with any time at all is newer than it.
    const newer = Number.isFinite(was) ? Number.isFinite(now) && now > was : Number.isFinite(now);
    return {
      name,
      status: newer ? ('update' as const) : ('current' as const),
      entry,
      latest: stampedTemplate(template, communitySource(entry, nameInPost ?? entry.name)),
    };
  });
}
