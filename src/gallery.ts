/*
 * The template gallery (idea 52): the starter library, the templates other people have
 * shared and the ones installed from either, as one list of tiles with a thumbnail each,
 * searched and filtered the same way. Pure: the dialog in gallery-dialog.ts draws it.
 */
import { TemplateConfig, VariablesConfig } from './types';
import { LibraryEntry } from './library';
import { CommunityEntry } from './community';
import { SAMPLE_HOUSE } from './playground';
import { exampleSets } from './examples';
import { getThingType, thingContent } from './shared';
import { localize } from './localize';
import deepReplace from './deep-replace';
import { getDeclarations, withStateScope } from './variables';
import { VariableDeclaration } from './variables';

/* eslint-disable @typescript-eslint/no-explicit-any */

export type GallerySource = 'library' | 'community' | 'installed';

export interface GalleryEntry {
  /** Unique across sources: `library:name`, `community:id`, `installed:name`. */
  key: string;
  source: GallerySource;
  /** The name it installs under, or is installed under. */
  name: string;
  /** What the tile is called: the name, or a shared post's title. */
  title: string;
  description: string;
  /** The template's own `category:`, or one worked out from what it is. */
  category: string;
  author?: string;
  url?: string;
  template: Record<string, any>;
  includes: Record<string, any>;
  kind: 'card' | 'badge' | 'row' | 'element' | 'group' | 'unknown';
  /** How many variables it declares. */
  variables: number;
  /** Whether a card built from it repeats over the registry on its own. */
  repeats: boolean;
  /** Custom cards it is built from. */
  customCards: string[];
  communityId?: number;
}

const isMapping = (value: unknown): value is Record<string, any> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

function customCardsIn(node: unknown, found = new Set<string>()): string[] {
  if (Array.isArray(node)) node.forEach((item) => customCardsIn(item, found));
  else if (isMapping(node)) {
    if (typeof node.type === 'string' && node.type.startsWith('custom:')) found.add(node.type);
    Object.values(node).forEach((value) => customCardsIn(value, found));
  }
  return [...found].sort();
}

function kindOf(template: Record<string, any>): GalleryEntry['kind'] {
  if ('group' in template) return 'group';
  const kind = getThingType(template as TemplateConfig);
  return kind ?? 'unknown';
}

const declaredCount = (template: Record<string, any>): number => {
  const variables = template.variables;
  if (Array.isArray(variables)) return variables.length;
  if (isMapping(variables)) return Object.keys(variables).length;
  return 0;
};

const repeatsOnItsOwn = (template: Record<string, any>): boolean => {
  const text = JSON.stringify(template.card ?? template.group ?? {});
  return text.includes('"for_each_from"') || text.includes('|repeat:');
};

/** `category:` when the template says one; otherwise a word for what it is. */
export function categoryOf(template: Record<string, any>, hass?: any): string {
  if (typeof template.category === 'string' && template.category.trim()) return template.category.trim();
  const kind = kindOf(template);
  const key =
    kind === 'badge'
      ? 'gallery.category_badges'
      : kind === 'row'
        ? 'gallery.category_rows'
        : kind === 'element'
          ? 'gallery.category_elements'
          : kind === 'group'
            ? 'gallery.category_groups'
            : repeatsOnItsOwn(template)
              ? 'gallery.category_repeats'
              : 'gallery.category_cards';
  return localize(key, undefined, hass);
}

function entryFrom(
  source: GallerySource,
  key: string,
  name: string,
  title: string,
  template: Record<string, any>,
  includes: Record<string, any>,
  hass: any,
  extra: Partial<GalleryEntry> = {},
): GalleryEntry {
  return {
    key,
    source,
    name,
    title,
    description: typeof template.description === 'string' ? template.description : '',
    category: categoryOf(template, hass),
    template,
    includes,
    kind: kindOf(template),
    variables: declaredCount(template),
    repeats: repeatsOnItsOwn(template),
    customCards: customCardsIn([template, ...Object.values(includes)]),
    ...extra,
  };
}

/**
 * Every tile: the library, then the shared list when it has been loaded, then whatever on
 * this dashboard carries a `source:` stamp - which is how an installed one is told from a
 * template written by hand. `summaryOf` gives a library entry its one-line summary in the
 * user's language.
 */
export function galleryEntries(
  input: {
    library: LibraryEntry[];
    community?: CommunityEntry[];
    installed: Record<string, TemplateConfig>;
  },
  summaryOf: (libraryName: string) => string,
  hass?: any,
): GalleryEntry[] {
  const entries: GalleryEntry[] = [];
  for (const entry of input.library) {
    const template = { ...entry.template };
    if (!template.description) template.description = summaryOf(entry.name);
    entries.push(entryFrom('library', `library:${entry.name}`, entry.name, entry.name, template, {}, hass));
  }
  for (const entry of input.community ?? []) {
    entries.push(
      entryFrom('community', `community:${entry.id}`, entry.name, entry.title, entry.template, entry.includes, hass, {
        author: entry.author,
        url: entry.url,
        communityId: entry.id,
      }),
    );
  }
  for (const [name, template] of Object.entries(input.installed)) {
    const source = (template as any)?.source;
    if (!isMapping(source)) continue;
    entries.push(
      entryFrom('installed', `installed:${name}`, name, name, template as Record<string, any>, {}, hass, {
        author: typeof source.author === 'string' ? source.author : undefined,
        url: typeof source.url === 'string' ? source.url : undefined,
      }),
    );
  }
  return entries;
}

/** The categories in play, in the order they first appear. */
export function galleryCategories(entries: GalleryEntry[]): string[] {
  const seen: string[] = [];
  for (const entry of entries) if (!seen.includes(entry.category)) seen.push(entry.category);
  return seen;
}

/**
 * The tiles matching a source, a category and a search - the search reads the name, the
 * title, the description, the author and the custom cards it needs, so "mushroom" finds
 * every template built on one.
 */
export function filterGallery(
  entries: GalleryEntry[],
  filter: { source?: GallerySource; category?: string; query?: string },
): GalleryEntry[] {
  const needle = (filter.query ?? '').trim().toLowerCase();
  return entries.filter((entry) => {
    if (filter.source && entry.source !== filter.source) return false;
    if (filter.category && entry.category !== filter.category) return false;
    if (!needle) return true;
    const haystack = [entry.name, entry.title, entry.description, entry.author ?? '', ...entry.customCards]
      .join('\n')
      .toLowerCase();
    return haystack.includes(needle);
  });
}

/** How many of each source, for the tabs. */
export function galleryCounts(entries: GalleryEntry[]): Record<GallerySource, number> {
  const counts: Record<GallerySource, number> = { library: 0, community: 0, installed: 0 };
  for (const entry of entries) counts[entry.source] += 1;
  return counts;
}

/** The sample entities every thumbnail can read, as if each card listed them in rebuild_on. */
const HOUSE = withStateScope(SAMPLE_HOUSE, Object.keys(SAMPLE_HOUSE.states));

/*
 * What a tile is drawn with when the template carries no example: the names a template
 * tends to use, filled from the sample house, so `[[area]]` reads Kitchen rather than
 * staying in brackets. A declared variable with an entity selector gets the first sample
 * entity of its domain; anything declared with a default keeps it.
 */
const SAMPLE_VALUES: Record<string, unknown> = {
  area: 'Kitchen',
  area_id: 'kitchen',
  area_name: 'Kitchen',
  room: 'Kitchen',
  floor: 'Ground floor',
  floor_id: 'ground_floor',
  label: 'Evening lights',
  label_id: 'evening',
  name: 'Kitchen ceiling',
  title: 'Kitchen',
  entity_count: 2,
  count: 3,
  total: 3,
  index: 1,
  index0: 0,
  first: true,
  last: false,
  device: 'Hue ceiling',
  device_id: 'kitchen_hue',
};

const SAMPLE_ENTITIES = Object.keys(SAMPLE_HOUSE.states);

function sampleEntity(domains: string[] | undefined): string {
  if (domains?.length) {
    const hit = SAMPLE_ENTITIES.find((id) => domains.includes(id.split('.')[0]));
    if (hit) return hit;
  }
  return SAMPLE_ENTITIES[0];
}

const asList = (value: unknown): string[] | undefined =>
  Array.isArray(value)
    ? value.filter((each): each is string => typeof each === 'string')
    : typeof value === 'string'
      ? [value]
      : undefined;

/** The names a template's content writes in brackets, each once, without their steps. */
function placeholderNames(content: unknown): string[] {
  const names = new Set<string>();
  const text = JSON.stringify(content ?? '');
  const grammar = /\[\[([a-zA-Z_][\w.]*)/g;
  let match: RegExpExecArray | null;
  while ((match = grammar.exec(text)) !== null) names.add(match[1].split('.')[0]);
  return [...names];
}

/**
 * The variables a thumbnail is built with: the template's first example when it has one,
 * otherwise a sample value per declared variable and per name its content uses that the
 * sample house can stand in for.
 */
export function sampleVariables(template: TemplateConfig, content: unknown): VariablesConfig[] {
  const example: VariablesConfig[] | undefined = exampleSets(template)[0];
  if (example?.length) return example;
  const out: VariablesConfig[] = [];
  const set = new Set<string>();
  const declarations: VariableDeclaration[] = (() => {
    try {
      return getDeclarations(template);
    } catch {
      return [];
    }
  })();
  for (const declaration of declarations) {
    if (!declaration?.name || 'default' in declaration) continue;
    const selector = (declaration as any).selector;
    const entity = isMapping(selector) && isMapping(selector.entity) ? selector.entity : undefined;
    const type = (declaration as any).type;
    if (entity || type === 'entity' || declaration.name === 'entity') {
      const domain = entity ? (asList(entity.domain) ?? asList(entity.filter?.domain)) : undefined;
      out.push({ [declaration.name]: sampleEntity(domain) });
      set.add(declaration.name);
    } else if (declaration.name in SAMPLE_VALUES && declaration.name !== 'name') {
      out.push({ [declaration.name]: SAMPLE_VALUES[declaration.name] });
      set.add(declaration.name);
    } else {
      // Declared with nothing to stand in for it: a gap, so `or:` and `default:` fill it as on a card.
      out.push({ [declaration.name]: '' });
      set.add(declaration.name);
    }
  }
  const declared = new Set(declarations.map((each) => each?.name));
  for (const name of placeholderNames(content)) {
    if (set.has(name) || declared.has(name)) continue;
    if (name in SAMPLE_VALUES) out.push({ [name]: SAMPLE_VALUES[name] });
    else if (name === 'entity' || name.endsWith('_entity')) out.push({ [name]: sampleEntity(undefined) });
  }
  return out;
}

const CONSUMERS = ['custom:decluttering-card-plus', 'custom:decluttering-card'];

/*
 * A card inside the thumbnail that uses another template is built here too, from the
 * templates the gallery knows - the entry's own bundle and the other tiles - because the
 * drawn card has no dashboard of its own to find them on. One copy stands for a repeat.
 */
function expandNested(node: unknown, templates: Record<string, any>, depth: number): unknown {
  if (depth > 4) return node;
  if (Array.isArray(node)) return node.map((item) => expandNested(item, templates, depth));
  if (!isMapping(node)) return node;
  if (typeof node.type === 'string' && CONSUMERS.includes(node.type) && typeof node.template === 'string') {
    const template = templates[node.template];
    if (isMapping(template)) {
      try {
        const kind = getThingType(template as TemplateConfig);
        const content = kind === 'card' ? thingContent(template as TemplateConfig) : undefined;
        if (content) {
          const passed = Array.isArray(node.variables)
            ? node.variables
            : isMapping(node.variables)
              ? Object.entries(node.variables).map(([key, value]) => ({ [key]: value }))
              : [];
          const variables = [...passed, ...sampleVariables(template as TemplateConfig, content)];
          const built = deepReplace(variables, template as TemplateConfig, content, node.template, HOUSE, true);
          if (isMapping(built)) return expandNested(built, templates, depth + 1);
        }
      } catch {
        // Left as it is: the card itself says what is wrong, if it ever lands on a dashboard.
      }
    }
    return node;
  }
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(node)) out[key] = expandNested(value, templates, depth);
  return out;
}

/** Every template the gallery can see, by name: each entry's own and what it bundles. */
export function galleryTemplates(entries: GalleryEntry[]): Record<string, any> {
  const out: Record<string, any> = {};
  for (const entry of entries) {
    for (const [name, template] of Object.entries(entry.includes)) if (!(name in out)) out[name] = template;
    if (!(entry.name in out)) out[entry.name] = entry.template;
  }
  return out;
}

/**
 * The card a tile shows: the template built against the sample house with its first
 * example, or with sample values for what it declares and uses. A group shows its first
 * card; a badge, row or element has no card to show and gives nothing, so the tile says
 * what it is instead. A template that will not build gives nothing too, rather than an
 * error in a thumbnail. Cards inside it that use other templates are built from
 * `templates`, the gallery's own, since the thumbnail has no dashboard to find them on.
 */
export function thumbnailConfig(
  entry: GalleryEntry,
  templates: Record<string, any> = {},
): Record<string, any> | undefined {
  if (entry.kind !== 'card' && entry.kind !== 'group') return undefined;
  const template = entry.template as TemplateConfig;
  try {
    const content = entry.kind === 'group' ? firstGroupCard(template) : thingContent(template);
    if (!content) return undefined;
    const variables = sampleVariables(template, content);
    const built = deepReplace(variables, template, content, entry.name, HOUSE, true);
    if (!isMapping(built) || typeof built.type !== 'string') return undefined;
    // A repeat is the card's doing, not the template's; the tile shows one copy.
    const { for_each_from: _from, for_each: _each, ...one } = built;
    void _from;
    void _each;
    const known = { ...templates, ...entry.includes, [entry.name]: entry.template };
    const expanded = expandNested(one, known, 0);
    return isMapping(expanded) ? expanded : one;
  } catch {
    return undefined;
  }
}

function firstGroupCard(template: TemplateConfig): unknown {
  const group = (template as any).group;
  const cards = Array.isArray(group) ? group : isMapping(group) && Array.isArray(group.cards) ? group.cards : [];
  return cards[0];
}

/** The hass a thumbnail is drawn with: the page's, but with the sample house's entities. */
export function thumbnailHass(hass: any): any {
  if (!hass) return undefined;
  return {
    ...hass,
    states: { ...SAMPLE_HOUSE.states },
    entities: { ...SAMPLE_HOUSE.entities },
    devices: { ...SAMPLE_HOUSE.devices },
    areas: { ...SAMPLE_HOUSE.areas },
    floors: { ...SAMPLE_HOUSE.floors },
  };
}
