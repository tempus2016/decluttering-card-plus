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
// otherwise make one per card. Cached for the life of the page, so a change to a source
// dashboard needs a browser refresh to be picked up.
const configCache = new Map<string, Promise<LovelaceConfig | null>>();

function fetchDashboardConfig(hass: HomeAssistant, urlPath: string): Promise<LovelaceConfig | null> {
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
const CONSUMER_TYPES = ['custom:decluttering-card-plus', 'custom:decluttering-card'];

export interface TemplateUsages {
  /** Each view that uses the template, and how many times. */
  views: { title: string; path: string; count: number }[];
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

  for (const view of ll.views ?? []) {
    const count = countUses(view, template);
    if (count)
      usages.views.push({ title: view.title ?? (view as any).path ?? '', path: (view as any).path ?? '', count });
  }

  // Both ways of defining a template are checked, and only the content is walked: the
  // definition itself carries a `template:` key that names itself, not a use.
  for (const [name, definition] of Object.entries(collectTemplates(ll))) {
    if (name === template) continue;
    const content = [definition.card, definition.row, definition.element, definition.badge];
    if (countUses(content, template)) usages.templates.push(name);
  }
  return usages;
}
