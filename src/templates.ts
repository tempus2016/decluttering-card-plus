import { HomeAssistant, LovelaceConfig } from 'custom-card-helpers';
import { DeclutteringTemplateConfig, TemplateConfig, VariablesConfig } from './types';
import {
  LetLayer,
  OUTER_LET,
  OWN_DEFAULTS,
  VIEW_VALUES,
  VariableDeclaration,
  CONSUMER_TYPES,
  diagnoseInstance,
  forEachNames,
  getDeclarations,
  normaliseVariables,
  withDeclarationList,
  templateDefaults,
  PLACEHOLDER,
  resolveVariables,
  variableValues,
} from './variables';
import deepReplace from './deep-replace';
import { isRegistrySource, registryNames } from './registry';
import { rebuildOnEntities } from './rebuild';
import { localize } from './localize';
import { isItemTemplate, placeholderHeads, structureNames } from './structure';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const LEGACY_TEMPLATE_TYPE = 'custom:decluttering-template';
export const TEMPLATE_TYPE = 'custom:decluttering-template-plus';

// The key a dashboard uses to borrow templates from other dashboards.
const SOURCES_KEY = 'decluttering_templates_from';

// Values every template on the dashboard falls back on, so that a colour or a size shared
// by a library of templates is written once rather than repeated in each of their
// `default:` lists. yaml anchors do this in yaml mode, and cannot in storage mode.
const DEFAULTS_KEY = 'decluttering_defaults';

/*
 * A dashboard at this path is borrowed from by every other dashboard without being named,
 * so a library of templates written once is available everywhere. Nothing requires it:
 * when there is no such dashboard, looking for it costs one quiet request per page.
 */
export const LIBRARY_DASHBOARD = 'decluttering-templates';

/*
 * Values worked out per card the way a template's `let:` is, written once for a dashboard,
 * a view or a section rather than in every template (discussion #162). Written wherever
 * decluttering_defaults can be; unlike those, a card cannot override them.
 */
const LET_KEY = 'decluttering_let';

// Variable declarations every template on the dashboard can take up by name, so a
// selector, label and default written once serve every template that uses the variable.
const DECLARATIONS_KEY = 'decluttering_variables';

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
export function checkDashboard(
  ll: LovelaceConfig | null | undefined,
  borrowed: Iterable<string> = [],
): {
  missingTemplates: { template: string; count: number; closest?: string }[];
  unsetVariables: { template: string; names: string[]; count: number }[];
  unusedTemplates: string[];
} {
  const templates = collectTemplates(ll);
  // A view's or a section's decluttering_defaults and decluttering_let give names values
  // too, so a card is checked against the templates as its own place sees them.
  const placed = new Map<string, Record<string, TemplateConfig>>();
  const templatesAt = (view: number, section?: number): Record<string, TemplateConfig> => {
    const key = `${view}/${section ?? ''}`;
    if (!placed.has(key)) placed.set(key, collectTemplates(ll, view, undefined, section));
    return placed.get(key) as Record<string, TemplateConfig>;
  };
  // A template borrowed from another dashboard is not missing, however local this sweep
  // is - the card using it renders. Borrowed names are never "unused" here either: they
  // are somebody else's templates, and the only ones this dashboard answers for are its own.
  const elsewhere = new Set(borrowed);
  const available = Object.keys(templates);
  // An item template is used through a placeholder - `[[camera_entry|with:...]]` - rather
  // than a card's `template:`, so it is used when a placeholder anywhere starts with its name.
  const itemNames = available.filter((name) => isItemTemplate(templates[name]));
  const heads = itemNames.length ? placeholderHeads(ll) : new Set<string>();
  const missing = new Map<string, number>();
  const unset = new Map<string, { names: Set<string>; count: number }>();

  // The names a repeat supplies to each copy, whether the repeat is a card's or a section's.
  const suppliedBy = (repeat: any): string[] => [
    // An entity a card rebuilds on stands for itself in a placeholder.
    ...rebuildOnEntities(repeat.rebuild_on),
    ...forEachNames(repeat.for_each),
    ...registryNames(repeat.for_each_from),
    ...(isRegistrySource(repeat.for_each_from) ? ['index', 'index0', 'count', 'first', 'last', 'total'] : []),
  ];

  // `handed` is what an enclosing repeat in the view strategy gives every card inside it.
  const walk = (node: any, handed: string[], here: Record<string, TemplateConfig>): void => {
    if (!node) return;
    if (Array.isArray(node)) {
      for (const item of node) walk(item, handed, here);
      return;
    }
    if (typeof node !== 'object') return;
    // A card choosing its template by domain uses each one it names, so each is looked for.
    // Its variables are shared by copies built from different templates, so they are not
    // held up against any one of them - what one template leaves unset another may not use.
    const byDomain = byDomainOf(node) !== undefined && CONSUMER_TYPES.includes(node.type);
    if (byDomain) {
      for (const name of templatesNamedBy(node)) {
        if (!templates[name] && !elsewhere.has(name)) missing.set(name, (missing.get(name) ?? 0) + 1);
      }
      return;
    }
    if (CONSUMER_TYPES.includes(node.type) && typeof node.template === 'string') {
      const template = here[node.template];
      if (!template) {
        if (!elsewhere.has(node.template)) missing.set(node.template, (missing.get(node.template) ?? 0) + 1);
      } else {
        // A `with:` or `repeat:` in the template supplies names to the body it fills in, and
        // the item templates it names are the dashboard's: neither is the card's to set.
        const supplements = [
          ...suppliedBy(node),
          ...handed,
          ...structureNames(template, normaliseVariables(node.variables)),
          ...itemNames,
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
    // A repeated section or badge in the view strategy hands its copy's values down.
    const repeats = (node.for_each !== undefined || node.for_each_from !== undefined) && (node.section || node.badge);
    const inside = repeats
      ? [...handed, ...suppliedBy(node), ...normaliseVariables(node.variables).map((v) => Object.keys(v)[0])]
      : handed;
    for (const value of Object.values(node)) walk(value, inside, here);
  };
  forEachPlace(ll, (node, view, section) => walk(node, [], templatesAt(view, section)));

  return {
    missingTemplates: [...missing.entries()].sort().map(([template, count]) => {
      const closest = closestTemplate(template, available);
      return closest ? { template, count, closest } : { template, count };
    }),
    unsetVariables: [...unset.entries()]
      .sort()
      .map(([template, entry]) => ({ template, names: [...entry.names].sort(), count: entry.count })),
    unusedTemplates: available
      .filter((name) => totalUsages(ll, name) === 0 && !extendedNames(ll).has(name))
      .filter((name) => !(itemNames.includes(name) && heads.has(name)))
      .sort(),
  };
}

/** The templates other templates build on. Being somebody's parent is a use. */
function extendedNames(ll: LovelaceConfig | null | undefined): Set<string> {
  const parents = new Set<string>();
  for (const template of Object.values(collectRawTemplates(ll))) {
    for (const parent of parentsOf(template)) parents.add(parent);
  }
  return parents;
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

/*
 * Every section of every sections view that has cards, with a label that says where it is.
 * The other half of the declutter picker: a section of tiles copied from room to room is a
 * group template waiting to happen.
 */
export function listSections(
  ll: LovelaceConfig | null | undefined,
): { label: string; view: number; section: number; cards: Record<string, any>[] }[] {
  const found: { label: string; view: number; section: number; cards: Record<string, any>[] }[] = [];
  ((ll as any)?.views ?? []).forEach((view: any, viewIndex: number) => {
    if (!Array.isArray(view?.sections)) return;
    view.sections.forEach((section: any, sectionIndex: number) => {
      const cards = Array.isArray(section?.cards) ? section.cards : [];
      // A section holding template definitions is where templates are kept, not a set of cards.
      if (!cards.length || JSON.stringify(cards).match(/"type":"custom:decluttering-template(-plus)?"/)) return;
      const heading = cards.find((card: any) => card?.type === 'heading' && typeof card.heading === 'string');
      const where = `${view?.title ?? view?.path ?? viewIndex + 1} · ${sectionIndex + 1}`;
      found.push({
        label: heading ? `${where} (${heading.heading})` : where,
        view: viewIndex,
        section: sectionIndex,
        cards,
      });
    });
  });
  return found;
}

/*
 * The dashboard with one section's cards swapped for `replacement` - but only while the
 * section still holds exactly `original`. Somebody may have changed it since it was picked,
 * and replacing cards nobody looked at would lose them; then the dashboard comes back as it was.
 */
export function replaceSectionCards(
  ll: any,
  view: number,
  section: number,
  original: unknown[],
  replacement: Record<string, any>[],
): any {
  const target = ll?.views?.[view]?.sections?.[section];
  if (!target || JSON.stringify(target.cards) !== JSON.stringify(original)) return ll;
  const views = ll.views.map((each: any, viewIndex: number) =>
    viewIndex !== view
      ? each
      : {
          ...each,
          sections: each.sections.map((place: any, sectionIndex: number) =>
            sectionIndex === section ? { ...place, cards: replacement } : place,
          ),
        },
  );
  return { ...ll, views };
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
    if (templatesNamedBy(node).includes(template)) {
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

/* ------------------------------------------------------- template_by_domain */

export const BY_DOMAIN_KEY = 'template_by_domain';

// The entry a domain with none of its own falls back on.
const BY_DOMAIN_DEFAULT = 'default';

/**
 * A card's `template_by_domain:` mapping, with only the entries that name a template. A
 * list or a string is not a mapping of domains, and the card is read as though it had none.
 */
export function byDomainOf(config: unknown): Record<string, string> | undefined {
  const written = (config as any)?.[BY_DOMAIN_KEY];
  if (!isMapping(written)) return undefined;
  const out: Record<string, string> = Object.create(null);
  for (const [domain, name] of Object.entries(written)) if (typeof name === 'string' && name) out[domain] = name;
  // Created without a prototype so a domain called `constructor` is only ever an entry; copied
  // to a plain object on the way out so it compares and prints like any other mapping.
  return { ...out };
}

/**
 * Every template one of our cards names: its `template:` and each one in its
 * `template_by_domain:`, once each. Anything else names nothing - a template card carries
 * the same key, but it defines that template rather than using it.
 */
export function templatesNamedBy(node: any): string[] {
  if (!node || typeof node !== 'object' || !CONSUMER_TYPES.includes(node.type)) return [];
  const names = typeof node.template === 'string' && node.template ? [node.template] : [];
  for (const name of Object.values(byDomainOf(node) ?? {})) if (!names.includes(name)) names.push(name);
  return names;
}

const DOMAIN_OF = /^([a-z0-9_]+)\./i;

/*
 * `template_by_domain:` lets one card - one repeat over a room's entities, say - give each
 * copy the template made for what it shows: a light gets the light tile, a cover the cover
 * tile, anything else the `default:` entry, or the card's own `template:` when there is no
 * `default:`. The domain is read off the copy's `entity` variable as it will end up, so a
 * default or a value built from the others (`light.[[room]]`) counts; those are read
 * against the template the card falls back on, the only one known before choosing.
 *
 * Nothing to fall back on is the usual missing-template error, naming the domain, and a
 * name that is not a template is the usual one naming that.
 *
 * When the entity that picked came from the fallback template rather than the card - its
 * default, say - the template picked knows nothing of it and `[[entity]]` stayed in
 * brackets. So that entity comes back as `entity`, for the card to build with under its
 * own variables (withPickedEntity): the card's values still win, as they always do.
 */
export function pickTemplate(
  config: { template?: unknown; template_by_domain?: unknown },
  variables: VariablesConfig[] | undefined,
  lookup: (name: string) => TemplateConfig | null | undefined,
  hass?: any,
  available: string[] = [],
): { name: string; template: TemplateConfig; entity?: string } {
  const byDomain = byDomainOf(config) ?? {};
  const own = typeof config.template === 'string' && config.template ? config.template : undefined;
  const fallback = Object.prototype.hasOwnProperty.call(byDomain, BY_DOMAIN_DEFAULT)
    ? byDomain[BY_DOMAIN_DEFAULT]
    : own;
  const fallbackTemplate = fallback ? (lookup(fallback) ?? undefined) : undefined;

  let entity = variableValues(resolveVariables(variables, fallbackTemplate)).entity;
  if (typeof entity === 'string' && PLACEHOLDER.test(entity)) {
    entity = deepReplace(variables, fallbackTemplate ?? {}, entity, fallback, hass, true);
  }
  const domain = typeof entity === 'string' ? DOMAIN_OF.exec(entity)?.[1] : undefined;
  const name =
    domain !== undefined && domain !== BY_DOMAIN_DEFAULT && Object.prototype.hasOwnProperty.call(byDomain, domain)
      ? byDomain[domain]
      : fallback;
  if (!name) {
    throw new Error(localize('error.no_template_for_domain', { domain: domain ?? localize('error.no_entity') }, hass));
  }
  const template = lookup(name);
  if (!template) {
    throw new Error(localize('error.template_missing', { template: name }, hass) + didYouMean(name, available));
  }
  const passed = normaliseVariables(variables).some((entry) => Object.keys(entry)[0] === 'entity');
  return !passed && typeof entity === 'string' ? { name, template, entity } : { name, template };
}

/** A card's variables with the entity its template was picked by underneath, when there is one. */
export function withPickedEntity(
  variables: VariablesConfig[] | VariablesConfig | undefined,
  entity: string | undefined,
): VariablesConfig[] | VariablesConfig | undefined {
  return entity === undefined ? variables : [...normaliseVariables(variables), { entity }];
}

/* --------------------------------------------------------------- deprecated */

/**
 * What a template says about being retired: undefined when it is not, an empty text for
 * `deprecated: true`, and the message for `deprecated: "Use room_tile_v2"`. Nothing about
 * how a card using it renders changes - it is a note to whoever maintains the dashboard.
 */
export function deprecationOf(template: unknown): string | undefined {
  const said = (template as any)?.deprecated;
  if (said === true) return '';
  return typeof said === 'string' ? said.trim() : undefined;
}

/*
 * The template picker: every template, labelled as templatePickerLabel labels it, with the
 * deprecated ones marked and put last so a new card is not started on one. Sorted here
 * rather than by the select, which would mix them back in alphabetically.
 */
export function templatePickerOptions(
  templates: Record<string, TemplateConfig>,
  hass?: any,
): { value: string; label: string }[] {
  // An item template is not something a card can be built from, so it is not on offer here.
  const offered = Object.entries(templates).filter(
    ([, template]) => !(isItemTemplate(template) && !TEMPLATE_CONTENT_KEYS.some((key) => key in (template as object))),
  );
  const options = offered.map(([name, template]) => {
    const retired = deprecationOf(template) !== undefined;
    const label = templatePickerLabel(name, template);
    return {
      value: name,
      label: retired ? label + localize('editor.deprecated_suffix', undefined, hass) : label,
      retired,
    };
  });
  options.sort((a, b) => Number(a.retired) - Number(b.retired) || a.label.localeCompare(b.label));
  return options.map(({ value, label }) => ({ value, label }));
}

/**
 * The deprecated templates something on the dashboard still uses, with where - each view
 * and how many cards in it, and the templates that use or extend it - and the message.
 * A deprecated template nothing uses is already as good as gone, and is left out.
 */
export function deprecatedInUse(
  ll: LovelaceConfig | null | undefined,
): { template: string; message: string; views: { title: string; count: number }[]; templates: string[] }[] {
  const found: { template: string; message: string; views: { title: string; count: number }[]; templates: string[] }[] =
    [];
  const templates = collectTemplates(ll);
  for (const name of Object.keys(templates).sort()) {
    const message = deprecationOf(templates[name]);
    if (message === undefined) continue;
    const usages = collectUsages(ll, name);
    if (!usages.views.length && !usages.templates.length) continue;
    found.push({
      template: name,
      message,
      views: usages.views.map((view) => ({ title: view.title, count: view.count })),
      templates: usages.templates,
    });
  }
  return found;
}

// Said once per template for the life of the page: ten cards using it are one thing to fix.
const deprecationsSaid = new Set<string>();

/** Mentions in the console that a card is built from a deprecated template, once per template. */
export function warnIfDeprecated(name: string | undefined, template: TemplateConfig | undefined, hass?: any): void {
  const message = deprecationOf(template);
  if (message === undefined || !name || deprecationsSaid.has(name)) return;
  deprecationsSaid.add(name);
  console.warn(
    message
      ? localize('warn.deprecated_because', { template: name, message }, hass)
      : localize('warn.deprecated', { template: name }, hass),
  );
}

/* -------------------------------------------------------------------- group */

// The card a `group:` template builds. Internal: nobody writes it, and it is not offered anywhere.
export const GROUP_CARD_TYPE = 'custom:decluttering-card-plus-group';

/*
 * A template holding several cards used to have to put them in a stack, and a stack sizes
 * its cards itself - the tiles a section would have laid out side by side came out one
 * under another (#176). `group:` builds a card that lays its cards out the way the section
 * around it would, so one card stands in for the set without changing how any of it looks.
 * `group: { cards: [...] }` is how it is written; a bare list is taken as that list.
 *
 * The group's own `grid_options` go with it (#194). Repeated, each copy is put in a hui-card,
 * which reads them off the config - so copies can each be a different width.
 */
export function groupCard(group: unknown): { type: string; cards: unknown; grid_options?: unknown } {
  if (Array.isArray(group)) return { type: GROUP_CARD_TYPE, cards: group };
  const { cards, grid_options } = (group as any) ?? {};
  return grid_options === undefined ? { type: GROUP_CARD_TYPE, cards } : { type: GROUP_CARD_TYPE, cards, grid_options };
}

/** The cards of a `group:`, whichever way it was written; nothing when it is neither. */
export function groupCards(group: unknown): unknown[] {
  if (Array.isArray(group)) return group;
  const cards = (group as any)?.cards;
  return Array.isArray(cards) ? cards : [];
}

/** The `group:` with its cards swapped for `cards`, written the way it already was. */
export function withGroupCards(group: unknown, cards: unknown[]): unknown {
  return Array.isArray(group) ? cards : { ...(group as Record<string, unknown>), cards };
}

/** A copy of `list` with the item at `from` moved to `to`; the list itself when either is out of range. */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list;
  const out = [...list];
  const [item] = out.splice(from, 1);
  out.splice(to, 0, item);
  return out;
}

/* ------------------------------------------------------------------ extends */

const TEMPLATE_CONTENT_KEYS = ['card', 'badge', 'row', 'element', 'group'] as const;

/*
 * Child over parent: mappings merge key by key, lists and scalars are the child's unless it
 * writes list edits (`__append__` and co, #209), and a null takes the parent's key away -
 * the same rules a card's own `card:` block follows, so `images: null` means one thing
 * wherever it is written (#193).
 */
function deepMergeConfig(parent: any, child: any): any {
  return child === undefined ? parent : mergeOver(parent, child);
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
  // An item template's body merges the same way (#233); it is kept out of the content keys
  // because those are what a card shows, and an item template shows nothing on its own.
  for (const key of [...TEMPLATE_CONTENT_KEYS, 'item']) {
    const combined = deepMergeConfig((parent as any)[key], (child as any)[key]);
    if (combined !== undefined) merged[key] = combined;
  }
  const variables = mergeDeclarations((parent as any).variables, (child as any).variables);
  if (variables.length) merged.variables = variables;
  // The child comes first in both lists, which is what makes its values win downstream. Either
  // may have spelled it `defaults:`; the folded list is written back under the one name.
  const defaults = [...normaliseVariables(templateDefaults(child)), ...normaliseVariables(templateDefaults(parent))];
  delete merged.defaults;
  if (defaults.length) merged.default = defaults;
  const lets = [...normaliseVariables(child.let), ...normaliseVariables(parent.let)];
  if (lets.length) merged.let = lets;
  return merged as TemplateConfig;
}

/*
 * What a template says about itself rather than what it builds: that it is on its way out,
 * and the values it is shown working with. Both are about the template that wrote them, so
 * a child does not take them from its parent - a template built on a deprecated one is new,
 * not deprecated, and a parent's examples were never checked against the child's content.
 */
const NOT_INHERITED = ['deprecated', 'examples'];

/**
 * The templates one names in `extends:`, as a list - one name, or several written as a
 * list (`extends: [base, with_actions]`). Anything that is not a name is not a parent.
 */
export function parentsOf(template: unknown): string[] {
  const written = (template as any)?.extends;
  if (typeof written === 'string') return written ? [written] : [];
  if (!Array.isArray(written)) return [];
  return written.filter((name): name is string => typeof name === 'string' && name.length > 0);
}

/*
 * `extends:` folds a parent template underneath a child, so a family of templates can
 * differ by one line. Several parents fold left to right before the child goes on top, so
 * `extends: [base, with_actions]` is base, then with_actions over it, then the child over
 * both: each one later in the list has the last word over the ones before it, the way each
 * level of a single chain does. Every parent resolves its own `extends` first.
 *
 * A parent nobody defines leaves the child as written, extends key and all, so a later pass
 * over more dashboards can still honour it. With a list that is all or nothing: folding the
 * parents that are here and the missing one later would put it on top of parents written
 * after it. A set that extend each other terminates by merging whichever the walk reached
 * first as it stood; extendsLoops is what says so.
 */
function resolveExtends(templates: Record<string, TemplateConfig>): Record<string, TemplateConfig> {
  // No prototype: a template named `__proto__` is then an entry here, not a new parent.
  const out: Record<string, TemplateConfig> = Object.assign(Object.create(null), templates);
  const walking = new Set<string>();
  const resolve = (name: string): TemplateConfig => {
    const template = out[name];
    const parentNames = parentsOf(template);
    if (!parentNames.length || walking.has(name)) return template;
    if (parentNames.some((parent) => out[parent] === undefined)) return template;
    walking.add(name);
    const parents = parentNames.map((parent) => resolve(parent));
    walking.delete(name);
    const base = parents.slice(1).reduce((under, over) => mergeTemplates(under, over), parents[0]);
    const child: any = { ...(template as any) };
    delete child.extends;
    const merged: any = mergeTemplates(base, child);
    for (const key of NOT_INHERITED) if (!Object.prototype.hasOwnProperty.call(child, key)) delete merged[key];
    out[name] = merged;
    return merged;
  };
  for (const name of Object.keys(out)) resolve(name);
  return out;
}

/**
 * Every loop in a dashboard's `extends:`, through any parent of a list, each named once
 * from where it is first met. resolveExtends already stops going round one; this is what
 * lets the health panel say there is one, rather than leaving a template quietly built from
 * whichever half of the loop was reached first.
 */
export function extendsLoops(ll: LovelaceConfig | null | undefined): string[][] {
  const templates = collectRawTemplates(ll);
  const loops: string[][] = [];
  const seen = new Set<string>();
  const done = new Set<string>();
  const walk = (name: string, path: string[]): void => {
    const at = path.indexOf(name);
    if (at !== -1) {
      const loop = [...path.slice(at), name];
      const key = [...loop.slice(0, -1)].sort().join('\u0000');
      if (!seen.has(key)) {
        seen.add(key);
        loops.push(loop);
      }
      return;
    }
    if (done.has(name) || templates[name] === undefined) return;
    for (const parent of parentsOf(templates[name])) walk(parent, [...path, name]);
    done.add(name);
  };
  for (const name of Object.keys(templates)) walk(name, []);
  return loops;
}

/* ---------------------------------------------------------------- overrides */

const isMapping = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const LIST_EDITS = ['__append__', '__prepend__', '__update__', '__remove__'];

/** A mapping written where a list is: every key one of the list edits. */
function isListEdit(base: unknown, over: Record<string, unknown>): boolean {
  const keys = Object.keys(over);
  return (
    (base === undefined || Array.isArray(base)) && keys.length > 0 && keys.every((key) => LIST_EDITS.includes(key))
  );
}

/** A list index as written, negative counting from the end; anything else is no index. */
function listIndex(written: unknown, length: number): number | undefined {
  const index = typeof written === 'string' && /^-?\d+$/.test(written.trim()) ? Number(written) : written;
  if (typeof index !== 'number' || !Number.isInteger(index)) return undefined;
  return index < 0 ? (length + index >= 0 ? length + index : undefined) : index;
}

const asList = (value: unknown): unknown[] =>
  value === undefined || value === null ? [] : Array.isArray(value) ? value : [value];

/*
 * Edits to a list rather than a new one (#209). Every index means a place in the list as the
 * template had it, so the edits do not move each other: `__update__` merges into an item the
 * way the rest of an override does (null removes it, an index past the end adds it there),
 * `__remove__` takes items out, and `__prepend__` / `__append__` go on either end.
 */
function editList(base: unknown, edits: Record<string, unknown>): unknown[] {
  const original = Array.isArray(base) ? base : [];
  const items: unknown[] = [...original];
  const removed = new Set<number>();
  const added: unknown[] = [];
  const update = isMapping(edits.__update__) ? edits.__update__ : {};
  for (const [written, value] of Object.entries(update)) {
    const index = listIndex(written, original.length);
    if (index === undefined) continue;
    if (index >= original.length) {
      if (value !== null) added.push(mergeOver(undefined, value));
    } else if (value === null) removed.add(index);
    else items[index] = mergeOver(items[index], value);
  }
  for (const written of asList(edits.__remove__)) {
    const index = listIndex(written, original.length);
    if (index !== undefined) removed.add(index);
  }
  return [
    ...asList(edits.__prepend__),
    ...items.filter((_, index) => !removed.has(index)),
    ...added,
    ...asList(edits.__append__),
  ];
}

/** Child over parent, a mapping merging key by key and a null taking the key away. */
function mergeOver(base: unknown, over: unknown): unknown {
  if (!isMapping(over)) return over;
  if (isListEdit(base, over)) return editList(base, over);
  const out: Record<string, unknown> = isMapping(base) ? { ...base } : {};
  for (const [key, value] of Object.entries(over)) {
    // Assigning `out.__proto__` would reparent the result rather than set a key; a card has
    // no use for that key, so it is dropped.
    if (key === '__proto__') continue;
    if (value === null) delete out[key];
    else out[key] = mergeOver(out[key], value);
  }
  return out;
}

/*
 * A card can carry its own `card:` (or `badge:`, `row:`, `element:`) block, laid over
 * what its template builds once the variables are in - so a one-off tweak needs neither
 * a template of its own nor an `extends:` child. It is taken literally, placeholders and
 * all, and a null is the one way to drop something the template sets.
 */
export function applyOverride<T>(resolved: T, instance: Record<string, unknown> | undefined, kind: string): T {
  const override = instance?.[kind];
  if (!isMapping(override) || !isMapping(resolved)) return resolved;
  return mergeOver(resolved, override) as T;
}

/** The override blocks a card carries that its template's kind will never read. */
export function misplacedOverrides(instance: Record<string, unknown> | undefined, kind: string | undefined): string[] {
  if (!instance || !kind) return [];
  return TEMPLATE_CONTENT_KEYS.filter((key) => key !== kind && instance[key] !== undefined);
}

/** The values this dashboard offers every template, as a flat list of one name each. */
export function collectDefaults(ll: LovelaceConfig | null | undefined): VariablesConfig[] {
  return normaliseVariables((ll as any)?.[DEFAULTS_KEY]);
}

/**
 * The values one view sets for the cards rendered in it, with the ones set by the section
 * a card sits in ahead of them - a section is closer to the card than its view is. They
 * beat the template's own defaults - see VIEW_VALUES - where the dashboard-wide ones only
 * fill what nothing sets.
 */
function collectViewDefaults(
  ll: LovelaceConfig | null | undefined,
  view: number | undefined,
  section?: number,
): VariablesConfig[] {
  if (view === undefined) return [];
  const viewConfig = (ll as any)?.views?.[view];
  const inSection = section === undefined ? [] : normaliseVariables(viewConfig?.sections?.[section]?.[DEFAULTS_KEY]);
  // A view written out by the strategy is configured inside it, so its values may be there.
  const inView = viewConfig?.[DEFAULTS_KEY] ?? viewConfig?.strategy?.[DEFAULTS_KEY];
  return [...inSection, ...normaliseVariables(inView)];
}

/** Whether a section sets any values of its own, which is when where a card sits matters. */
export function hasSectionDefaults(
  ll: LovelaceConfig | null | undefined,
  place: { view: number; section: number } | undefined,
): boolean {
  if (!place) return false;
  const section = (ll as any)?.views?.[place.view]?.sections?.[place.section];
  return normaliseVariables(section?.[DEFAULTS_KEY]).length > 0 || normaliseVariables(section?.[LET_KEY]).length > 0;
}

/**
 * Every value a card in one view and section is given from outside it: the
 * decluttering_let and decluttering_defaults of its section, its view and the dashboard.
 * For the health panel, which only needs to know what they are and what they read.
 */
export function placeValues(
  ll: LovelaceConfig | null | undefined,
  view: number | undefined,
  section?: number,
): { lets: VariablesConfig[]; defaults: VariablesConfig[] } {
  return {
    lets: ([] as VariablesConfig[]).concat(
      ...[...placeLet(ll, view, section), ...dashboardLet(ll)].map((layer) => layer.values),
    ),
    defaults: [...collectViewDefaults(ll, view, section), ...collectDefaults(ll)],
  };
}

/**
 * Calls `visit` with every part of each view - a sections view's sections one at a time,
 * with their place - so a sweep can see each card where it sits.
 */
export function forEachPlace(
  ll: LovelaceConfig | null | undefined,
  visit: (node: unknown, view: number, section?: number) => void,
): void {
  ((ll as any)?.views ?? []).forEach((viewConfig: any, view: number) => {
    if (!viewConfig || typeof viewConfig !== 'object') return;
    for (const [key, value] of Object.entries(viewConfig)) {
      if (key === 'sections' && Array.isArray(value)) value.forEach((each, section) => visit(each, view, section));
      else visit(value, view);
    }
  });
}

/** The `decluttering_let:` a whole dashboard writes. */
function dashboardLet(ll: LovelaceConfig | null | undefined): LetLayer[] {
  const values = normaliseVariables((ll as any)?.[LET_KEY]);
  return values.length ? [{ from: 'dashboard_let', values }] : [];
}

/**
 * The `decluttering_let:` layers that reach a card in one view and section, nearest first:
 * the section's, then the view's - read from inside the strategy when the view is written
 * out by it, as its decluttering_defaults are.
 */
function placeLet(ll: LovelaceConfig | null | undefined, view: number | undefined, section?: number): LetLayer[] {
  if (view === undefined) return [];
  const viewConfig = (ll as any)?.views?.[view];
  const layers: LetLayer[] = [];
  const inSection = section === undefined ? [] : normaliseVariables(viewConfig?.sections?.[section]?.[LET_KEY]);
  if (inSection.length) layers.push({ from: 'section_let', values: inSection });
  const inView = normaliseVariables(viewConfig?.[LET_KEY] ?? viewConfig?.strategy?.[LET_KEY]);
  if (inView.length) layers.push({ from: 'view_let', values: inView });
  return layers;
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
 * the fallback. The view's values ride along beside the list rather than in it, because
 * they go the other way and beat what the template says.
 *
 * The template is copied rather than added to. It is part of the dashboard's configuration,
 * which is handed out to whoever asks for it, and quietly growing a `default:` list on it
 * would be a change to the dashboard that nobody made.
 */
function withDefaults(
  template: TemplateConfig,
  view: VariablesConfig[],
  shared: VariablesConfig[],
  lets: LetLayer[] = [],
): TemplateConfig {
  if (!view.length && !shared.length && !lets.length) return template;
  const copy: any = { ...template };
  if (lets.length) copy[OUTER_LET] = lets;
  if (shared.length) {
    // `defaults:` folded into `default:` here, so the copy carries one list rather than two.
    const own = templateDefaults(template);
    copy.default = [...normaliseVariables(own), ...shared];
    copy[OWN_DEFAULTS] = own;
    delete copy.defaults;
  }
  if (view.length) copy[VIEW_VALUES] = view;
  return copy;
}

/** Every template a single dashboard configuration defines, by name, as written. */
export function collectRawTemplates(ll: LovelaceConfig | null | undefined): Record<string, TemplateConfig> {
  // No prototype, so a template declared with the name `__proto__` becomes an own entry here
  // rather than reparenting this map with whatever the dashboard put under that key.
  const templates: Record<string, TemplateConfig> = Object.create(null);
  if (!ll) return templates;

  const declared = (ll as any).decluttering_templates;
  if (declared) Object.assign(templates, declared);

  // The whole view is walked, so wherever a template card has been put - cards, sections,
  // nested inside either - it is found.
  if (ll.views) collectFromNode(ll.views, templates);

  return templates;
}

/*
 * SPIKE #227: the dashboard's item templates - a template with an `item:` body rather than
 * a card, badge or section - which `with:` and `repeat:` fill in by name. Worked out once
 * per dashboard configuration, since every card on the page asks on every build.
 */
const ITEM_TEMPLATES = new WeakMap<object, Record<string, TemplateConfig>>();
export function itemTemplatesOf(ll: LovelaceConfig | null | undefined): Record<string, TemplateConfig> {
  if (!ll || typeof ll !== 'object') return {};
  let found = ITEM_TEMPLATES.get(ll);
  if (!found) {
    found = Object.create(null) as Record<string, TemplateConfig>;
    // extends: first (#233), so a child picks up its parent's item: - list edits and all -
    // and one written with nothing but extends: is an item template too.
    for (const [name, template] of Object.entries(resolveExtends(collectRawTemplates(ll)))) {
      if (template && typeof template === 'object' && 'item' in template) found[name] = template;
    }
    ITEM_TEMPLATES.set(ll, found);
  }
  return found;
}

/** The declarations a dashboard shares, in the same shape as a template's own `variables:`. */
export function collectSharedDeclarations(ll: LovelaceConfig | null | undefined): VariableDeclaration[] {
  return getDeclarations({ variables: (ll as any)?.[DECLARATIONS_KEY] } as TemplateConfig);
}

/**
 * A template's declarations with the shared ones of the same name underneath, so
 * `{ name: colour }` takes the whole shared declaration and anything written beside the
 * name - a different description, say - wins. Only names the template declares are
 * touched; sharing a declaration never adds a variable to a template that has no use for it.
 */
export function withSharedDeclarations(template: TemplateConfig, shared: VariableDeclaration[]): TemplateConfig {
  if (!shared.length || !Array.isArray(template?.variables)) return template;
  const byName = new Map<string, VariableDeclaration>();
  for (const declaration of shared) if (!byName.has(declaration.name)) byName.set(declaration.name, declaration);
  let changed = false;
  const variables = template.variables.map((entry: any) => {
    const base = entry && typeof entry === 'object' ? byName.get(entry.name) : undefined;
    if (!base) return entry;
    changed = true;
    return { ...base, ...entry };
  });
  return changed ? ({ ...template, variables } as TemplateConfig) : template;
}

function withShared(
  templates: Record<string, TemplateConfig>,
  shared: VariableDeclaration[],
): Record<string, TemplateConfig> {
  for (const name of Object.keys(templates)) {
    // Mapping declarations (#223) become the list here, on the way to being rendered from;
    // the raw templates keep the shape they were written in for anything that writes back.
    const template = withDeclarationList(templates[name]);
    templates[name] = shared.length ? withSharedDeclarations(template, shared) : template;
  }
  return templates;
}

/*
 * A template card previews the definition it is handed rather than the saved one: in the
 * edit dialog that is the change being typed, which the dashboard has not seen yet. So it
 * goes into the list in place of whatever the dashboard has under that name, and is then
 * resolved like any other - its parent folded in, the shared values put underneath.
 */
function withOwn(
  templates: Record<string, TemplateConfig>,
  own: DeclutteringTemplateConfig | undefined,
): Record<string, TemplateConfig> {
  if (own && typeof own.template === 'string') templates[own.template] = own;
  return templates;
}

/**
 * The same, with the dashboard's own shared values put underneath each template - which is
 * what a card on this dashboard is rendered from.
 */
export function collectTemplates(
  ll: LovelaceConfig | null | undefined,
  view?: number,
  own?: DeclutteringTemplateConfig,
  section?: number,
): Record<string, TemplateConfig> {
  const templates = resolveExtends(withShared(withOwn(collectRawTemplates(ll), own), collectSharedDeclarations(ll)));
  const here = collectViewDefaults(ll, view, section);
  const shared = collectDefaults(ll);
  const lets = [...placeLet(ll, view, section), ...dashboardLet(ll)];
  if (!here.length && !shared.length && !lets.length) return templates;

  const out: Record<string, TemplateConfig> = Object.create(null);
  for (const [name, template] of Object.entries(templates)) out[name] = withDefaults(template, here, shared, lets);
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
export function fetchDashboardPaths(hass: HomeAssistant): Promise<string[]> {
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

/** Whether the page is showing the library dashboard itself, which has nothing to borrow from itself. */
function onLibraryDashboard(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location?.pathname?.split('/').filter(Boolean)[0] === LIBRARY_DASHBOARD;
}

/**
 * Whether a template this dashboard does not define could still be on another one: one it
 * names in decluttering_templates_from, or the library dashboard every dashboard borrows from.
 */
export function mayBorrowTemplates(ll: LovelaceConfig | null | undefined): boolean {
  return getTemplateSources(ll).length > 0 || !onLibraryDashboard();
}

/**
 * The dashboards to read, in the order they are merged - a later one wins a name clash.
 * The library comes first, so any dashboard named on purpose beats it.
 */
export function withLibrary(sources: string[], onLibrary = onLibraryDashboard()): string[] {
  const named = sources.filter((source) => source !== LIBRARY_DASHBOARD);
  return onLibrary ? named : [LIBRARY_DASHBOARD, ...named];
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
    // The library is looked for on every page, and most installs will never have one.
    if (urlPath === LIBRARY_DASHBOARD) return null;
    // The original dashboard has nothing saved until somebody takes control of it, which
    // is how most installs start out: it has no templates, and that is all.
    if (err?.code === 'config_not_found') return null;
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
  own?: DeclutteringTemplateConfig,
  section?: number,
): Promise<Record<string, TemplateConfig>> {
  const local = collectTemplates(ll, view, own, section);
  let sources = getTemplateSources(ll);
  if (!hass || !mayBorrowTemplates(ll)) return local;
  if (sources.includes('*')) sources = expandSources(sources, await fetchDashboardPaths(hass));
  sources = withLibrary(sources);

  const configs = await Promise.all(sources.map((source) => fetchDashboardConfig(hass, source)));
  const viewValues = collectViewDefaults(ll, view, section);
  const here = collectDefaults(ll);
  const declaredHere = collectSharedDeclarations(ll);
  const letsHere = [...placeLet(ll, view, section), ...dashboardLet(ll)];
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
    // Shared declarations travel the same way, this dashboard's ahead of the lender's - and
    // so does a decluttering_let, the lender's still reaching its own templates underneath.
    const declarations = [...declaredHere, ...collectSharedDeclarations(config)];
    const lets = [...letsHere, ...dashboardLet(config)];
    for (const [name, template] of Object.entries(collectRawTemplates(config))) {
      borrowed[name] = withDefaults(
        withSharedDeclarations(withDeclarationList(template), declarations),
        viewValues,
        shared,
        lets,
      );
    }
  }
  return resolveExtends({ ...borrowed, ...local });
}

/** A single template from this dashboard, without going to the network. */
export function findTemplate(
  ll: LovelaceConfig | null | undefined,
  template: string,
  view?: number,
  section?: number,
): TemplateConfig | null {
  return collectTemplates(ll, view, undefined, section)[template] ?? null;
}

/** A single template from this dashboard or one it borrows from. */
export async function findTemplateAnywhere(
  hass: HomeAssistant | undefined,
  ll: LovelaceConfig | null | undefined,
  template: string,
  view?: number,
  section?: number,
): Promise<TemplateConfig | null> {
  return (await collectAllTemplates(hass, ll, view, undefined, section))[template] ?? null;
}

// The cards that consume a template, as opposed to the ones that define it. Defined with
// the substitution code, which needs them too; re-exported here for everything that reads
// a dashboard.
export { CONSUMER_TYPES };

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

  let uses = templatesNamedBy(node).includes(template) ? 1 : 0;
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
  // A template built on this one depends on it as surely as one that uses it, whichever
  // place in its `extends:` list it has. Read as written, since resolving takes the key away.
  for (const [name, definition] of Object.entries(collectRawTemplates(ll))) {
    if (name === template || usages.templates.includes(name)) continue;
    if (parentsOf(definition).includes(template)) usages.templates.push(name);
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

/** A template's `extends:` with one parent's name changed, written back in the shape it had. */
function renameParent(definition: any, from: string, to: string): void {
  if (!definition || typeof definition !== 'object') return;
  if (definition.extends === from) definition.extends = to;
  else if (Array.isArray(definition.extends)) {
    definition.extends = definition.extends.map((name: unknown) => (name === from ? to : name));
  }
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
    // A template card built on the renamed one follows it too, or it loses its parent.
    if (isTemplateCardType(node.type)) renameParent(out, from, to);
    // So does a card choosing its template by domain, in whichever entries name it.
    const byDomain = CONSUMER_TYPES.includes(node.type) ? out[BY_DOMAIN_KEY] : undefined;
    if (isMapping(byDomain)) {
      for (const [domain, name] of Object.entries(byDomain)) if (name === from) byDomain[domain] = to;
    }
    return out;
  };

  const renamed = rewrite(ll);
  const root = renamed?.decluttering_templates;
  if (root && typeof root === 'object') {
    for (const definition of Object.values(root)) renameParent(definition, from, to);
  }

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

/*
 * A template installed from the shared-templates list carries where it came from under
 * `source:` - the discussion it was posted in and when that post was last edited - so the
 * Share tab can offer to check for a newer version. Only templates defined here count, as
 * written: a template that `extends:` an installed one is somebody's own, even though its
 * parent's `source:` would be folded into it when it is resolved.
 */
export function installedFromShared(
  ll: LovelaceConfig | null | undefined,
): { name: string; source: { discussion: number; updated?: string; name?: string }; template: TemplateConfig }[] {
  const raw = collectRawTemplates(ll);
  return Object.keys(raw)
    .sort()
    .filter((name) => typeof (raw[name] as any)?.source?.discussion === 'number')
    .map((name) => ({ name, source: (raw[name] as any).source, template: raw[name] }));
}

/**
 * The dashboard with one template's definition swapped for another, wherever it is defined -
 * the root `decluttering_templates` key, a template card, or both - and nothing else touched:
 * the cards using it still name it, and are left exactly as they were. A template card keeps
 * its own type, and leads with its type and name as any template card does.
 *
 * Nothing is mutated; the caller gets a new configuration to save.
 */
export function replaceTemplate(ll: any, name: string, template: Record<string, any>): any {
  const rewrite = (node: any): any => {
    if (Array.isArray(node)) return node.map(rewrite);
    if (!node || typeof node !== 'object') return node;
    if (isTemplateCardType(node.type)) {
      if (node.template !== name) return node;
      const content: Record<string, any> = { ...template };
      delete content.type;
      delete content.template;
      return { type: node.type, template: name, ...content };
    }
    const out: any = {};
    for (const [key, value] of Object.entries(node)) out[key] = rewrite(value);
    return out;
  };

  const out: any = { ...ll };
  if (Array.isArray(ll?.views)) out.views = rewrite(ll.views);
  const declared = ll?.decluttering_templates;
  if (declared && typeof declared === 'object' && Object.prototype.hasOwnProperty.call(declared, name)) {
    // Rebuilt in order, so updating one does not move it to the end of the list.
    const rebuilt: Record<string, any> = {};
    for (const [each, definition] of Object.entries(declared)) rebuilt[each] = each === name ? template : definition;
    out.decluttering_templates = rebuilt;
  }
  return out;
}
