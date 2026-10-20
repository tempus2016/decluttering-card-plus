import { VariablesConfig } from './types';
import { addTemplateToRoot, replaceCard } from './templates';
import { freeName } from './share';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * The dashboards that most need templates are the ones built before anybody knew about
 * them: thirty tiles, copy-pasted, differing by an entity and a name. "Declutter this card"
 * turns one of them into a template, but which ones are copies of each other is exactly
 * what is hard to see from the dashboard - so this finds them, and makes the template for
 * the whole set at once.
 */

/*
 * Past this many differences a set of cards is not really one card written several times,
 * it is several cards that happen to be built alike - and a template with nine holes in it
 * is harder to read than the cards were. Eight covers an entity, a name, an icon, a colour
 * and an action or two with room to spare.
 */
export const MAX_DIFFERING = 8;

// Where a card sits rather than what it is. Each copy keeps its own, on the card that uses
// the template, so the template is the card and the layout stays the dashboard's.
export const LAYOUT_KEYS = ['grid_options', 'visibility', 'view_layout', 'layout_options'];

type Path = (string | number)[];

export interface SimilarGroup {
  /** Positions of the cards in the list handed in. */
  indices: number[];
  /** The card type they share. */
  type: string;
  /** Where they differ, as paths into the card. */
  differing: Path[];
  /** What identifies the group from one look to the next, for holding state against it. */
  key: string;
}

/** The card without where it sits - what two copies of a card are compared on. */
export function withoutLayout(card: any): any {
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(card ?? {})) if (!LAYOUT_KEYS.includes(key)) out[key] = value;
  return out;
}

/** The card's shape: its keys and list lengths all the way down, with every leaf the same. */
function shape(value: any): any {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') {
    const out: Record<string, any> = {};
    for (const key of Object.keys(value).sort()) out[key] = shape(value[key]);
    return out;
  }
  return 0;
}

/** Every leaf of a value, as its path and the value there. */
export function leaves(value: any, path: Path = [], out: { path: Path; value: unknown }[] = []): typeof out {
  if (Array.isArray(value)) value.forEach((item, index) => leaves(item, [...path, index], out));
  else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) leaves(item, [...path, key], out);
  } else out.push({ path, value });
  return out;
}

export function valueAt(card: any, path: Path): unknown {
  return path.reduce((node, step) => (node === undefined || node === null ? undefined : node[step]), card);
}

/**
 * Groups of two or more cards with the same type and the same structure - the same keys,
 * the same list lengths, all the way down - that differ only in values. A group where they
 * differ in more than MAX_DIFFERING places is not offered, and nor are cards that are exact
 * copies of each other: a template with nothing to fill in only adds a level. A card that
 * already holds a placeholder is somebody's template work, not a copy, and is left out.
 */
export function findSimilarCards(cards: any[]): SimilarGroup[] {
  const buckets = new Map<string, number[]>();
  cards.forEach((card, index) => {
    if (!card || typeof card !== 'object' || typeof card.type !== 'string') return;
    const body = withoutLayout(card);
    if (JSON.stringify(body).includes('[[')) return;
    const key = JSON.stringify([card.type, shape(body)]);
    buckets.set(key, [...(buckets.get(key) ?? []), index]);
  });

  const groups: SimilarGroup[] = [];
  for (const [key, indices] of buckets) {
    if (indices.length < 2) continue;
    const bodies = indices.map((index) => withoutLayout(cards[index]));
    const differing = leaves(bodies[0])
      .map((leaf) => leaf.path)
      .filter((path) =>
        bodies.some((body) => JSON.stringify(valueAt(body, path)) !== JSON.stringify(valueAt(bodies[0], path))),
      );
    if (!differing.length || differing.length > MAX_DIFFERING) continue;
    groups.push({ indices, type: cards[indices[0]].type, differing, key });
  }
  // The biggest sets first: those are the ones a template saves the most on.
  return groups.sort((a, b) => b.indices.length - a.indices.length || a.indices[0] - b.indices[0]);
}

const clean = (text: string): string => text.replace(/[^A-Za-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '') || 'value';

/** The short name for a path: its last key, or for a list item the list's key and the item's place. */
function shortName(path: Path): string {
  const last = path[path.length - 1];
  if (typeof last === 'string') return clean(last);
  const key = [...path].reverse().find((step) => typeof step === 'string');
  return clean(`${key ?? 'item'}_${(last as number) + 1}`);
}

/** The long name for a path, every step of it, for when two short names clash. */
function longName(path: Path): string {
  return clean(path.map((step) => (typeof step === 'number' ? String(step + 1) : step)).join('_'));
}

/**
 * A name for each place the cards differ: the key it sits under (`entity`, `name`), or -
 * when two places share a key - the whole path to it (`tap_action_navigation_path`), with
 * a number on the end only if even that is taken.
 */
export function variableNamesFor(differing: Path[]): string[] {
  const short = differing.map(shortName);
  const clashes = (name: string): boolean => short.filter((each) => each === name).length > 1;
  const names: string[] = [];
  differing.forEach((path, index) => {
    const wanted = clashes(short[index]) ? longName(path) : short[index];
    names.push(freeName(wanted, names));
  });
  return names;
}

/**
 * The template a set of similar cards becomes, and what each card passes it. The first
 * card is the template, with each place the cards differ replaced by a placeholder; each
 * card passes its own values, typed as they were, so a number stays a number. Where a card
 * sits - grid_options, visibility, view_layout - stays on that card.
 */
export function templateFromSimilar(cards: any[]): {
  template: { card: any };
  names: string[];
  variables: VariablesConfig[][];
  layout: Record<string, unknown>[];
} {
  const bodies = cards.map(withoutLayout);
  const reference = bodies[0] ?? {};
  const differing = leaves(reference)
    .map((leaf) => leaf.path)
    .filter((path) =>
      bodies.some((body) => JSON.stringify(valueAt(body, path)) !== JSON.stringify(valueAt(reference, path))),
    );
  const names = variableNamesFor(differing);

  const card = JSON.parse(JSON.stringify(reference));
  differing.forEach((path, index) => {
    const parent = valueAt(card, path.slice(0, -1)) as any;
    parent[path[path.length - 1]] = `[[${names[index]}]]`;
  });

  return {
    template: { card },
    names,
    variables: bodies.map((body) => differing.map((path, index) => ({ [names[index]]: valueAt(body, path) }))),
    layout: cards.map((each) => {
      const kept: Record<string, unknown> = {};
      for (const key of LAYOUT_KEYS) if (each?.[key] !== undefined) kept[key] = each[key];
      return kept;
    }),
  };
}

/** The decluttering card that stands in for one of the similar cards. */
export function similarReplacement(
  name: string,
  variables: VariablesConfig[],
  layout: Record<string, unknown>,
): Record<string, unknown> {
  return { type: 'custom:decluttering-card-plus', template: name, variables, ...layout };
}

/**
 * The dashboard with the template added under decluttering_templates and every one of the
 * cards replaced by a decluttering card passing its values. Nothing is mutated; a card no
 * longer on the dashboard as it was is simply not found, and the rest still go through.
 */
export function makeTemplateFromSimilar(ll: any, cards: any[], name: string): any {
  const { template, variables, layout } = templateFromSimilar(cards);
  let config = addTemplateToRoot(ll, name, template);
  cards.forEach((card, index) => {
    config = replaceCard(config, card, similarReplacement(name, variables[index], layout[index]));
  });
  return config;
}

/**
 * A first name to offer for the template. The card type alone - `tile` - reads like the
 * card itself rather than a template of it, so it says it is one kind of card (`tile_card`),
 * and when every card in the set shows an entity of the same domain, which kind:
 * `light_tile_card`. Never a name already taken.
 */
export function suggestTemplateName(type: string, taken: string[], cards: any[] = []): string {
  let base = clean(type.replace(/^custom:/, '').replace(/-/g, '_')).toLowerCase();
  if (!/(^|_)card$/.test(base)) base = `${base}_card`;
  const domains = new Set(
    cards.map((card) =>
      typeof card?.entity === 'string' && card.entity.includes('.') ? card.entity.split('.')[0] : '',
    ),
  );
  const [domain] = [...domains];
  if (domains.size === 1 && domain) base = `${clean(domain).toLowerCase()}_${base}`;
  return freeName(base, taken);
}
