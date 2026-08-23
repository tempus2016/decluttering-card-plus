import { HomeAssistant, LovelaceConfig } from 'custom-card-helpers';
import { DeclutteringTemplateConfig, TemplateConfig, VariablesConfig } from './types';
import { diagnoseInstance, forEachNames, normaliseVariables } from './variables';
import { isRegistrySource, registryNames } from './registry';
import { localize } from './localize';

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

/*
 * Everything the console would have muttered about this dashboard, gathered in one look:
 * cards pointing at templates that are not there (with the near miss named), cards
 * leaving variables unset, and templates nothing uses. Same counting cards, one report.
 */
export function checkDashboard(ll: LovelaceConfig | null | undefined): {
  missingTemplates: { template: string; count: number; closest?: string }[];
  unsetVariables: { template: string; names: string[]; count: number }[];
  unusedTemplates: string[];
} {
  const templates = collectTemplates(ll);
  const available = Object.keys(templates);
  const missing = new Map<string, number>();
  const unset = new Map<string, { names: Set<string>; count: number }>();

  const walk = (node: any): void => {
    if (!node) return;
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }
    if (typeof node !== 'object') return;
    if (CONSUMER_TYPES.includes(node.type) && typeof node.template === 'string') {
      const template = templates[node.template];
      if (!template) {
        missing.set(node.template, (missing.get(node.template) ?? 0) + 1);
      } else {
        const supplements = [
          ...forEachNames(node.for_each),
          ...registryNames(node.for_each_from),
          ...(isRegistrySource(node.for_each_from) ? ['index', 'index0', 'count', 'first', 'last', 'total'] : []),
        ].map((name) => ({ [name]: null }));
        const problems = diagnoseInstance(node.variables, template, supplements);
        if (problems.missing.length) {
          const entry = unset.get(node.template) ?? { names: new Set<string>(), count: 0 };
          for (const name of problems.missing) entry.names.add(name);
          entry.count += 1;
          unset.set(node.template, entry);
        }
      }
      return;
    }
    for (const value of Object.values(node)) walk(value);
  };
  walk((ll as any)?.views);

  return {
    missingTemplates: [...missing.entries()].sort().map(([template, count]) => {
      const closest = closestTemplate(template, available);
      return closest ? { template, count, closest } : { template, count };
    }),
    unsetVariables: [...unset.entries()]
      .sort()
      .map(([template, entry]) => ({ template, names: [...entry.names].sort(), count: entry.count })),
    unusedTemplates: available.filter((name) => totalUsages(ll, name) === 0).sort(),
  };
}

/*
 * Every plain card on the dashboard - not this card's own types - with a label that says
 * where it sits and what it shows. The list a "declutter this card" picker offers: the
 * hundred copy-pasted tiles are exactly what is in here.
 */
export function listPlainCards(
  ll: LovelaceConfig | null | undefined,
): { label: string; config: Record<string, any> }[] {
  const found: { label: string; config: Record<string, any> }[] = [];
  const OWN = [...CONSUMER_TYPES, TEMPLATE_TYPE, LEGACY_TEMPLATE_TYPE];
  const walk = (node: any, viewTitle: string): void => {
    if (!node) return;
    if (Array.isArray(node)) {
      for (const item of node) walk(item, viewTitle);
      return;
    }
    if (typeof node !== 'object') return;
    if (typeof node.type === 'string' && OWN.includes(node.type)) return;
    if (typeof node.type === 'string') {
      const shown = node.name ?? node.title ?? node.entity;
      found.push({
        label: shown ? `${viewTitle} · ${node.type} (${shown})` : `${viewTitle} · ${node.type}`,
        config: node,
      });
    }
    // A container card's children are candidates of their own.
    for (const value of Object.values(node)) walk(value, viewTitle);
  };
  for (const view of ((ll as any)?.views ?? []) as any[]) {
    walk(view?.cards, view?.title ?? view?.path ?? '');
    walk(view?.sections, view?.title ?? view?.path ?? '');
  }
  return found;
}

/** The dashboard with the first card written exactly like `original` swapped for `replacement`. */
export function replaceCard(ll: any, original: Record<string, any>, replacement: Record<string, any>): any {
  const wanted = JSON.stringify(original);
  let done = false;
  const walk = (node: any): any => {
    if (done || !node || typeof node !== 'object') return node;
    if (Array.isArray(node)) return node.map(walk);
    if (!done && JSON.stringify(node) === wanted) {
      done = true;
      return replacement;
    }
    const out: any = {};
    for (const [key, value] of Object.entries(node)) out[key] = walk(value);
    return out;
  };
  const swapped = { ...ll, views: walk((ll as any)?.views) };
  return done ? swapped : ll;
}

/** How many things on one dashboard use a template: cards on views, and other templates. */
export function totalUsages(ll: LovelaceConfig | null | undefined, template: string): number {
  const usages = collectUsages(ll, template);
  return usages.views.reduce((sum, view) => sum + view.count, 0) + usages.templates.length;
}

/**
 * What other dashboards make of a template: each one that uses the name, with its count.
 * Read-only - it looks, it never writes - and a dashboard that cannot be read simply
 * does not appear, the same silence fetchDashboardConfig already keeps.
 */
export async function usagesOnOtherDashboards(
  hass: HomeAssistant | undefined,
  template: string,
  ownPath: string | undefined,
): Promise<{ urlPath: string; total: number }[]> {
  if (!hass) return [];
  const paths = (await fetchDashboardPaths(hass)).filter((path) => path !== ownPath);
  const found: { urlPath: string; total: number }[] = [];
  for (const urlPath of paths) {
    const config = await fetchDashboardConfig(hass, urlPath);
    if (!config) continue;
    const total = totalUsages(config, template);
    if (total > 0) found.push({ urlPath, total });
  }
  return found;
}

/**
 * The first card on the dashboard that uses a template, config and all. One real usage,
 * with its real variables, is what makes an impact preview honest: it shows what an edit
 * does to a card somebody actually has.
 */
export function firstUsage(ll: LovelaceConfig | null | undefined, template: string): any | null {
  let found: any = null;
  const walk = (node: any): void => {
    if (found || !node) return;
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }
    if (typeof node !== 'object') return;
    if (CONSUMER_TYPES.includes(node.type) && node.template === template) {
      found = node;
      return;
    }
    for (const value of Object.values(node)) walk(value);
  };
  walk((ll as any)?.views);
  return found;
}

/** The dashboard with one more template under `decluttering_templates`, nothing else touched. */
export function addTemplateToRoot(ll: any, name: string, template: TemplateConfig): any {
  return { ...ll, decluttering_templates: { ...(ll?.decluttering_templates ?? {}), [name]: template } };
}

/**
 * What the template picker shows for one template. A `category:` groups a big collection:
 * it leads the label, so alphabetical sorting brings a category's templates together.
 */
export function templatePickerLabel(name: string, template: TemplateConfig | undefined): string {
  const category = (template as any)?.category;
  const described = template?.description ? `${name} — ${template.description}` : name;
  return typeof category === 'string' && category ? `${category} · ${described}` : described;
}

/* ------------------------------------------------------------------ extends */

const TEMPLATE_CONTENT_KEYS = ['card', 'badge', 'row', 'element'] as const;

/** Child over parent: mappings merge key by key, lists and scalars are the child's. */
function deepMergeConfig(parent: any, child: any): any {
  if (parent === undefined) return child;
  if (child === undefined) return parent;
  const mergeable = (value: any): boolean => value !== null && typeof value === 'object' && !Array.isArray(value);
  if (!mergeable(parent) || !mergeable(child)) return child;
  const out: any = { ...parent };
  for (const [key, value] of Object.entries(child)) out[key] = deepMergeConfig(parent[key], value);
  return out;
}

/** Parent order kept, a child declaration of the same name replacing in place, new ones after. */
function mergeDeclarations(parent: any, child: any): any[] {
  const parentList: any[] = Array.isArray(parent) ? parent : [];
  const childList: any[] = Array.isArray(child) ? child : [];
  const byName = new Map(childList.filter((entry) => entry?.name).map((entry) => [entry.name, entry]));
  const merged = parentList.map((entry) => (entry?.name && byName.has(entry.name) ? byName.get(entry.name) : entry));
  const parentNames = new Set(parentList.map((entry) => entry?.name));
  return [...merged, ...childList.filter((entry) => !parentNames.has(entry?.name))];
}

function mergeTemplates(parent: TemplateConfig, child: TemplateConfig): TemplateConfig {
  const merged: any = { ...parent, ...child };
  for (const key of TEMPLATE_CONTENT_KEYS) {
    const combined = deepMergeConfig((parent as any)[key], (child as any)[key]);
    if (combined !== undefined) merged[key] = combined;
  }
  const variables = mergeDeclarations((parent as any).variables, (child as any).variables);
  if (variables.length) merged.variables = variables;
  // The child comes first in both lists, which is what makes its values win downstream.
  const defaults = [...normaliseVariables(child.default), ...normaliseVariables(parent.default)];
  if (defaults.length) merged.default = defaults;
  const lets = [...normaliseVariables(child.let), ...normaliseVariables(parent.let)];
  if (lets.length) merged.let = lets;
  return merged as TemplateConfig;
}

/*
 * `extends:` folds a parent template underneath a child, so a family of templates can
 * differ by one line. A parent nobody defines leaves the child as written, extends key
 * and all, so a later pass over more dashboards can still honour it - and a pair that
 * extend each other terminates by merging whichever the walk reached first as it stood.
 */
function resolveExtends(templates: Record<string, TemplateConfig>): Record<string, TemplateConfig> {
  const out = { ...templates };
  const walking = new Set<string>();
  const resolve = (name: string): TemplateConfig => {
    const template = out[name];
    const parentName = (template as any)?.extends;
    if (typeof parentName !== 'string' || walking.has(name)) return template;
    walking.add(name);
    const parent = out[parentName] !== undefined ? resolve(parentName) : undefined;
    walking.delete(name);
    if (parent === undefined) return template;
    const child: any = { ...(template as any) };
    delete child.extends;
    const merged = mergeTemplates(parent, child);
    out[name] = merged;
    return merged;
  };
  for (const name of Object.keys(out)) resolve(name);
  return out;
}

/** The values this dashboard offers every template, as a flat list of one name each. */
export function collectDefaults(ll: LovelaceConfig | null | undefined): VariablesConfig[] {
  return normaliseVariables((ll as any)?.[DEFAULTS_KEY]);
}

/** The values one view offers the cards rendered in it, ahead of the dashboard-wide ones. */
function collectViewDefaults(ll: LovelaceConfig | null | undefined, view: number | undefined): VariablesConfig[] {
  if (view === undefined) return [];
  return normaliseVariables(((ll as any)?.views?.[view] as any)?.[DEFAULTS_KEY]);
}

/**
 * Which view a path segment names: its `path` first, its position as a number second, and
 * the first view when the segment names nothing - which is also the view Home Assistant
 * itself shows for a URL that stops at the dashboard.
 */
export function viewIndexFromPath(ll: LovelaceConfig | null | undefined, segment: string | undefined): number {
  const views: any[] = (ll as any)?.views ?? [];
  if (segment) {
    const byPath = views.findIndex((view) => view?.path === segment);
    if (byPath !== -1) return byPath;
    const numeric = Number(segment);
    if (Number.isInteger(numeric) && numeric >= 0 && numeric < views.length) return numeric;
  }
  return 0;
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
export function collectTemplates(ll: LovelaceConfig | null | undefined, view?: number): Record<string, TemplateConfig> {
  const templates = resolveExtends(collectRawTemplates(ll));
  const shared = [...collectViewDefaults(ll, view), ...collectDefaults(ll)];
  if (!shared.length) return templates;

  const out: Record<string, TemplateConfig> = {};
  for (const [name, template] of Object.entries(templates)) out[name] = withDefaults(template, shared);
  return out;
}

/**
 * `'*'` in the sources list stands for every dashboard there is. Named sources keep
 * their place ahead of it - their templates win name clashes by being merged last - and
 * nothing is fetched twice.
 */
export function expandSources(sources: string[], available: string[]): string[] {
  if (!sources.includes('*')) return sources;
  const named = sources.filter((source) => source !== '*');
  const out = [...named];
  for (const path of available) if (!out.includes(path)) out.push(path);
  return out;
}

let dashboardListCache: Promise<string[]> | null = null;

/** Every dashboard's url path, for expanding `'*'`. The default dashboard is 'lovelace'. */
function fetchDashboardPaths(hass: HomeAssistant): Promise<string[]> {
  dashboardListCache ??= (hass as any)
    .callWS({ type: 'lovelace/dashboards/list' })
    .then((list: any[]) =>
      (list ?? [])
        .map((dashboard) => dashboard?.url_path)
        .filter((path): path is string => typeof path === 'string' && !!path)
        .sort()
        .concat('lovelace'),
    )
    .catch(() => []) as Promise<string[]>;
  return dashboardListCache;
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
  view?: number,
): Promise<Record<string, TemplateConfig>> {
  const local = collectTemplates(ll, view);
  let sources = getTemplateSources(ll);
  if (!hass || !sources.length) return local;
  if (sources.includes('*')) sources = expandSources(sources, await fetchDashboardPaths(hass));

  const configs = await Promise.all(sources.map((source) => fetchDashboardConfig(hass, source)));
  const here = [...collectViewDefaults(ll, view), ...collectDefaults(ll)];
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
  return resolveExtends({ ...borrowed, ...local });
}

/** A single template from this dashboard, without going to the network. */
export function findTemplate(
  ll: LovelaceConfig | null | undefined,
  template: string,
  view?: number,
): TemplateConfig | null {
  return collectTemplates(ll, view)[template] ?? null;
}

/** A single template from this dashboard or one it borrows from. */
export async function findTemplateAnywhere(
  hass: HomeAssistant | undefined,
  ll: LovelaceConfig | null | undefined,
  template: string,
  view?: number,
): Promise<TemplateConfig | null> {
  return (await collectAllTemplates(hass, ll, view))[template] ?? null;
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
  return closest ? localize('error.did_you_mean', { closest }) : '';
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
