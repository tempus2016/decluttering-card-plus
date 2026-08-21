import { HomeAssistant, LovelaceConfig } from 'custom-card-helpers';
import { DeclutteringTemplateConfig, TemplateConfig, VariablesConfig } from './types';
import { normaliseVariables } from './variables';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const LEGACY_TEMPLATE_TYPE = 'custom:decluttering-template';
export const TEMPLATE_TYPE = 'custom:decluttering-template-plus';

// The key a dashboard uses to borrow templates from other dashboards.
const SOURCES_KEY = 'decluttering_templates_from';

// Values every template on the dashboard falls back on, so that a colour or a size shared
// by a library of templates is written once rather than repeated in each of their
// `default:` lists. yaml anchors do this in yaml mode, and cannot in storage mode.
const DEFAULTS_KEY = 'decluttering_defaults';

// The original dashboard has no url_path of its own; the websocket API wants null for it.
const DEFAULT_DASHBOARD_PATHS = ['lovelace', 'default', ''];

export function isTemplateCardType(type: string | undefined): boolean {
  return type === TEMPLATE_TYPE || type === LEGACY_TEMPLATE_TYPE;
}

/*
 * A template card can sit anywhere a card can, which includes inside a stack, a grid or a
 * conditional card - people group their template definitions exactly like anything else on
 * the dashboard. Only the top level used to be looked at, so a template tidied away inside
 * a stack was invisible and every card using it failed with "doesn't exist".
 *
 * A template card's own content is not descended into: a template card inside a template
 * card is part of the outer definition, not another definition of its own.
 */
function collectFromNode(node: any, templates: Record<string, TemplateConfig>): void {
  if (Array.isArray(node)) {
    for (const item of node) collectFromNode(item, templates);
    return;
  }
  if (!node || typeof node !== 'object') return;

  if (isTemplateCardType(node.type)) {
    if (typeof node.template === 'string') templates[node.template] = node as DeclutteringTemplateConfig;
    return;
  }
  for (const value of Object.values(node)) collectFromNode(value, templates);
}

/** The values this dashboard offers every template, as a flat list of one name each. */
export function collectDefaults(ll: LovelaceConfig | null | undefined): VariablesConfig[] {
  return normaliseVariables((ll as any)?.[DEFAULTS_KEY]);
}

/*
 * A template's own `default:` list with the dashboard's shared values added underneath it,
 * which is where they belong: resolution takes the first definition of a name it finds, so
 * anything the template says for itself is reached first and a shared value is only ever
 * the fallback.
 *
 * The template is copied rather than added to. It is part of the dashboard's configuration,
 * which is handed out to whoever asks for it, and quietly growing a `default:` list on it
 * would be a change to the dashboard that nobody made.
 */
function withDefaults(template: TemplateConfig, shared: VariablesConfig[]): TemplateConfig {
  if (!shared.length) return template;
  return { ...template, default: [...normaliseVariables(template.default), ...shared] };
}

/** Every template a single dashboard configuration defines, by name, as written. */
function collectRawTemplates(ll: LovelaceConfig | null | undefined): Record<string, TemplateConfig> {
  const templates: Record<string, TemplateConfig> = {};
  if (!ll) return templates;

  const declared = (ll as any).decluttering_templates;
  if (declared) Object.assign(templates, declared);

  // The whole view is walked, so wherever a template card has been put - cards, sections,
  // nested inside either - it is found.
  if (ll.views) collectFromNode(ll.views, templates);

  return templates;
}

/**
 * The same, with the dashboard's own shared values put underneath each template - which is
 * what a card on this dashboard is rendered from.
 */
export function collectTemplates(ll: LovelaceConfig | null | undefined): Record<string, TemplateConfig> {
  const templates = collectRawTemplates(ll);
  const shared = collectDefaults(ll);
  if (!shared.length) return templates;

  const out: Record<string, TemplateConfig> = {};
  for (const [name, template] of Object.entries(templates)) out[name] = withDefaults(template, shared);
  return out;
}

/** The dashboards this one borrows templates from, in the order they were listed. */
export function getTemplateSources(ll: LovelaceConfig | null | undefined): string[] {
  const sources = (ll as any)?.[SOURCES_KEY];
  if (!sources) return [];
  return (Array.isArray(sources) ? sources : [sources]).filter((s) => typeof s === 'string');
}

// Fetching another dashboard is a round trip, and a dashboard full of templated cards would
// otherwise make one per card, so each is fetched once and kept.
const configCache = new Map<string, Promise<LovelaceConfig | null>>();

/**
 * The cache keys a change to one dashboard invalidates. The original dashboard has no
 * url_path of its own and is written several ways, so a change to it has to forget all of
 * them - otherwise a dashboard borrowing from `lovelace` would keep a copy that a change
 * reported as `null` never cleared.
 */
export function dashboardsToForget(urlPath: string | null | undefined): string[] {
  const path = urlPath ?? '';
  return DEFAULT_DASHBOARD_PATHS.includes(path) ? [...DEFAULT_DASHBOARD_PATHS] : [path];
}

// Subscribed once for the life of the page, the first time a dashboard is borrowed from.
let watching = false;

/*
 * A borrowed template used to be fixed until the browser was refreshed, which is a poor
 * answer when the whole point of borrowing is to keep a template library in one place and
 * edit it there. Home Assistant announces a saved dashboard, so the copy of it is dropped
 * and the next card to ask for it fetches the new one.
 */

function watchForSavedDashboards(hass: any): void {
  if (watching || typeof hass?.connection?.subscribeEvents !== 'function') return;
  watching = true;
  hass.connection.subscribeEvents((event: any) => {
    for (const path of dashboardsToForget(event?.data?.url_path)) configCache.delete(path);
  }, 'lovelace_updated');
}

function fetchDashboardConfig(hass: HomeAssistant, urlPath: string): Promise<LovelaceConfig | null> {
  watchForSavedDashboards(hass);
  const cached = configCache.get(urlPath);
  if (cached) return cached;

  const url_path = DEFAULT_DASHBOARD_PATHS.includes(urlPath) ? null : urlPath;
  const request = (hass as any).callWS({ type: 'lovelace/config', url_path }).catch((err: any) => {
    console.warn(`decluttering-card-plus: could not read the dashboard "${urlPath}":`, err?.message ?? err);
    return null;
  }) as Promise<LovelaceConfig | null>;

  configCache.set(urlPath, request);
  return request;
}

/**
 * Every template available to a dashboard: its own, then the ones it borrows. A dashboard's
 * own templates win, so borrowing cannot silently change a template that is already defined.
 */
export async function collectAllTemplates(
  hass: HomeAssistant | undefined,
  ll: LovelaceConfig | null | undefined,
): Promise<Record<string, TemplateConfig>> {
  const local = collectTemplates(ll);
  const sources = getTemplateSources(ll);
  if (!hass || !sources.length) return local;

  const configs = await Promise.all(sources.map((source) => fetchDashboardConfig(hass, source)));
  const here = collectDefaults(ll);
  const borrowed: Record<string, TemplateConfig> = {};
  for (const config of configs) {
    /*
     * A borrowed template is read as written and then given both sets of shared values,
     * this dashboard's first: it goes on working where it lives, because the lender's are
     * still there underneath, and borrowing a library never means giving up what you set
     * here. Reading it raw is what puts them in that order - collectTemplates would have
     * folded the lender's in already, ahead of ours.
     */
    const shared = [...here, ...collectDefaults(config)];
    for (const [name, template] of Object.entries(collectRawTemplates(config))) {
      borrowed[name] = withDefaults(template, shared);
    }
  }
  return { ...borrowed, ...local };
}

/** A single template from this dashboard, without going to the network. */
export function findTemplate(ll: LovelaceConfig | null | undefined, template: string): TemplateConfig | null {
  return collectTemplates(ll)[template] ?? null;
}

/** A single template from this dashboard or one it borrows from. */
export async function findTemplateAnywhere(
  hass: HomeAssistant | undefined,
  ll: LovelaceConfig | null | undefined,
  template: string,
): Promise<TemplateConfig | null> {
  return (await collectAllTemplates(hass, ll))[template] ?? null;
}

// The cards that consume a template, as opposed to the ones that define it.
export const CONSUMER_TYPES = ['custom:decluttering-card-plus', 'custom:decluttering-card'];

export interface TemplateUsages {
  /** Each view that uses the template, and how many times. The index is the view's
   *  position, which is how Home Assistant addresses a view that has no path. */
  views: { title: string; path: string; index: number; count: number }[];
  /** Other templates that call this one. */
  templates: string[];
}

function countUses(node: any, template: string): number {
  if (Array.isArray(node)) return node.reduce((total, item) => total + countUses(item, template), 0);
  if (!node || typeof node !== 'object') return 0;

  // A template card carries the same `template:` key but defines the template rather than
  // using it, and its content belongs to the definition - so neither is a use.
  if (isTemplateCardType(node.type)) return 0;

  let uses = CONSUMER_TYPES.includes(node.type) && node.template === template ? 1 : 0;
  for (const value of Object.values(node)) uses += countUses(value, template);
  return uses;
}

/**
 * Everywhere a template is used, which is what you want to know before changing it. The
 * whole view is walked rather than just its cards, so a use inside a stack, a grid, a
 * conditional card, a badge or a picture element is counted like any other.
 */
export function collectUsages(ll: LovelaceConfig | null | undefined, template: string): TemplateUsages {
  const usages: TemplateUsages = { views: [], templates: [] };
  if (!ll) return usages;

  (ll.views ?? []).forEach((view, index) => {
    const count = countUses(view, template);
    if (count)
      usages.views.push({
        title: view.title ?? (view as any).path ?? '',
        path: (view as any).path ?? '',
        index,
        count,
      });
  });

  // Both ways of defining a template are checked. Every value of the definition is
  // walked rather than a hand-kept list of keys, so content-bearing keys added later
  // cannot silently fall outside the count. The definition's own `template:` name is a
  // bare string, which the walk ignores.
  for (const [name, definition] of Object.entries(collectTemplates(ll))) {
    if (name === template) continue;
    if (countUses(Object.values(definition), template)) usages.templates.push(name);
  }
  return usages;
}

/** Where a template is defined, which is what an editor needs to offer to open it. */
export interface TemplateLocation {
  /** True when it comes from the root `decluttering_templates` key, which has no card. */
  declared: boolean;
  /** The view holding the template card, when there is one to open. */
  view?: { title: string; path: string; index: number };
}

function definesTemplate(node: any, template: string): boolean {
  if (Array.isArray(node)) return node.some((item) => definesTemplate(item, template));
  if (!node || typeof node !== 'object') return false;
  if (isTemplateCardType(node.type)) return node.template === template;
  return Object.values(node).some((value) => definesTemplate(value, template));
}

/**
 * Which view defines a template, so a card using it can offer a way back to it. A template
 * declared in the root key has no card to open, and says so rather than pretending it is
 * nowhere. The whole view is walked, so a definition tidied away inside a stack is found
 * exactly as `collectTemplates` finds it.
 */
export function findTemplateLocation(ll: LovelaceConfig | null | undefined, template: string): TemplateLocation | null {
  if (!ll) return null;

  const views = ll.views ?? [];
  for (let index = 0; index < views.length; index += 1) {
    const view = views[index] as any;
    if (definesTemplate(view, template)) {
      return { declared: false, view: { title: view.title ?? view.path ?? '', path: view.path ?? '', index } };
    }
  }

  // Checked second, because a template card is the one a person can actually open.
  if ((ll as any).decluttering_templates?.[template] !== undefined) return { declared: true };
  return null;
}

/**
 * The dashboard with a template renamed: its definition, every card using it, and any use
 * inside another template. Renaming is the one edit that cannot be done in the template
 * card alone - every card naming the old one would break the moment it was saved.
 *
 * Nothing is mutated; the caller gets a new configuration to save.
 */
export function renameTemplate(ll: any, from: string, to: string): any {
  const rewrite = (node: any): any => {
    if (Array.isArray(node)) return node.map(rewrite);
    if (!node || typeof node !== 'object') return node;

    const out: any = {};
    for (const [key, value] of Object.entries(node)) out[key] = rewrite(value);

    // Both the card that defines the template and the cards that use it name it in the
    // same key, and both have to move. A bare string elsewhere is somebody's content.
    const names = isTemplateCardType(node.type) || CONSUMER_TYPES.includes(node.type);
    if (names && node.template === from) out.template = to;
    return out;
  };

  const renamed = rewrite(ll);

  // The root key holds templates by name, so there the name is the key itself. Rebuilt in
  // order, so renaming does not shuffle the rest of the list.
  const declared = renamed?.decluttering_templates;
  if (declared && typeof declared === 'object' && from in declared) {
    const rebuilt: Record<string, any> = {};
    for (const [name, definition] of Object.entries(declared)) rebuilt[name === from ? to : name] = definition;
    renamed.decluttering_templates = rebuilt;
  }
  return renamed;
}

/*
 * How many single-character edits turn one name into the other, capped: past a couple of
 * edits two names are not a typo of each other, and stopping early keeps a dashboard full
 * of templates cheap to check.
 */
function editDistance(a: string, b: string, cap: number): number {
  if (Math.abs(a.length - b.length) > cap) return cap + 1;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const row = [i];
    for (let j = 1; j <= b.length; j += 1) {
      row[j] = a[i - 1] === b[j - 1] ? previous[j - 1] : 1 + Math.min(previous[j - 1], previous[j], row[j - 1]);
    }
    if (Math.min(...row) > cap) return cap + 1;
    previous = row;
  }
  return previous[b.length];
}

/**
 * The name somebody probably meant, out of the ones that exist. A missing template is
 * nearly always a typo or a rename, and the card already knows every name there is - so
 * saying "did you mean" turns a hunt through the dashboard into a glance.
 */
export function closestTemplate(wanted: string, available: string[]): string | undefined {
  if (!wanted) return undefined;
  // Two edits on a short name, three on a long one: enough for a transposition and a
  // missing letter, not enough to start pointing at unrelated templates.
  const cap = wanted.length > 8 ? 3 : 2;

  let best: string | undefined;
  let bestScore = cap + 1;
  for (const name of available) {
    if (name === wanted) return undefined;
    const score = editDistance(wanted.toLowerCase(), name.toLowerCase(), cap);
    if (score < bestScore) {
      bestScore = score;
      best = name;
    }
  }
  return bestScore <= cap ? best : undefined;
}

/** How that reads on the end of a "doesn't exist" message. */
export function didYouMean(wanted: string, available: string[]): string {
  const closest = closestTemplate(wanted, available);
  return closest ? ` Did you mean "${closest}"?` : '';
}

/** Every card on the dashboard still using the original card's type names. */
export function countLegacyTypes(ll: any): number {
  let found = 0;
  const walk = (node: any): void => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (!node || typeof node !== 'object') return;
    if (node.type === LEGACY_TEMPLATE_TYPE || node.type === 'custom:decluttering-card') found += 1;
    Object.values(node).forEach(walk);
  };
  walk(ll);
  return found;
}

/**
 * The dashboard with every original decluttering-card type moved to this card's own.
 *
 * Installing this card over the original needs no changes at all - it answers to both sets
 * of names. But a dashboard that says `custom:decluttering-card` everywhere is a dashboard
 * that still breaks if the original is ever installed alongside, because Home Assistant
 * loads resources in the order they were added and the original would win.
 *
 * Nothing is mutated; the caller gets a new configuration to save.
 */
export function moderniseTypes(ll: any): any {
  const moved: Record<string, string> = {
    'custom:decluttering-card': 'custom:decluttering-card-plus',
    [LEGACY_TEMPLATE_TYPE]: TEMPLATE_TYPE,
  };
  const rewrite = (node: any): any => {
    if (Array.isArray(node)) return node.map(rewrite);
    if (!node || typeof node !== 'object') return node;
    const out: any = {};
    for (const [key, value] of Object.entries(node)) out[key] = rewrite(value);
    if (typeof node.type === 'string' && moved[node.type]) out.type = moved[node.type];
    return out;
  };
  return rewrite(ll);
}

/**
 * The dashboard with one more card in a view. Used for dropping a template in - a copy of
 * one that is there, or one out of the library - which has to go somewhere, and the view
 * being looked at is the least surprising somewhere.
 *
 * Nothing is mutated; the caller gets a new configuration to save.
 */
export function addCardToView(ll: any, viewIndex: number, card: any): any {
  const views = Array.isArray(ll?.views) ? ll.views : [];
  // No view to put it in - a dashboard with none, or an index from a stale lookup - and
  // the safest thing is to change nothing at all rather than invent a view.
  if (!views[viewIndex]) return ll;

  return {
    ...ll,
    views: views.map((view: any, index: number) =>
      index === viewIndex ? { ...view, cards: [...(view.cards ?? []), card] } : view,
    ),
  };
}
