import { HomeAssistant, LovelaceConfig } from 'custom-card-helpers';
import { DeclutteringTemplateConfig, TemplateConfig } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const LEGACY_TEMPLATE_TYPE = 'custom:decluttering-template';
export const TEMPLATE_TYPE = 'custom:decluttering-template-plus';

// The key a dashboard uses to borrow templates from other dashboards.
const SOURCES_KEY = 'decluttering_templates_from';

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

/** Every template a single dashboard configuration defines, by name. */
export function collectTemplates(ll: LovelaceConfig | null | undefined): Record<string, TemplateConfig> {
  const templates: Record<string, TemplateConfig> = {};
  if (!ll) return templates;

  const declared = (ll as any).decluttering_templates;
  if (declared) Object.assign(templates, declared);

  // The whole view is walked, so wherever a template card has been put - cards, sections,
  // nested inside either - it is found.
  if (ll.views) collectFromNode(ll.views, templates);
  return templates;
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
  const borrowed: Record<string, TemplateConfig> = {};
  for (const config of configs) Object.assign(borrowed, collectTemplates(config));
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
