import { loadAll } from 'js-yaml';
import { CONSUMER_TYPES, isTemplateCardType } from './templates';
import {
  LAYOUT_KEYS,
  MAX_DIFFERING,
  leaves,
  similarReplacement,
  suggestTemplateName,
  valueAt,
  variableNamesFor,
  withoutLayout,
} from './similar';
import { VariablesConfig } from './types';
import { toYaml } from './yaml';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * The template builder on the docs site. Somebody who has not installed the card yet, or
 * has and does not know where to start, pastes the cards they already wrote and gets back
 * the template those cards are copies of and what each card becomes.
 *
 * It goes one step further than "Find similar cards" in the editor. Copied cards are not
 * always exact copies - one tile got an icon, the others did not - and that is what an
 * optional placeholder is for: `icon: '[[icon?]]'` is dropped from any card that does not
 * pass an icon. So a setting only some of the cards have becomes an optional variable,
 * and the cards without it simply leave it out. Lists still have to match: a list that is
 * longer on one card is a different card, not a missing value.
 *
 * What it cannot turn into a template it says why, and for a card that is nearly a copy
 * of another, what differs - usually one setting on one card, and the fix is theirs.
 */

type Path = (string | number)[];

// A pasted dashboard is not anybody's to expand into a billion nodes.
const MAX_ALIASES = 50;

// How many of the cards' values sets go into the template as `examples:` - enough for
// the health panel to have something to build, not thirty copies of the dashboard.
const MAX_EXAMPLES = 3;

// The view types, which hold cards but are not cards.
const VIEW_TYPES = ['masonry', 'sections', 'panel', 'sidebar'];

export interface BuiltTemplate {
  name: string;
  type: string;
  /** Which of the pasted cards it was made from. */
  labels: string[];
  variables: string[];
  /** The variables only some of the cards pass, written `[[name?]]` in the template. */
  optional: string[];
  /** `decluttering_templates:` with this template under it. */
  templateYaml: string;
  /** The cards that stand in for the pasted ones, in the order they were pasted. */
  cardsYaml: string;
}

export type LeftOutReason = 'alone' | 'copies' | 'too_many' | 'template';

export interface LeftOut {
  label: string;
  reason: LeftOutReason;
  /** For `alone`: the closest card of the same type and the settings only one of them has. */
  nearest?: { label: string; onlyHere: string[]; onlyThere: string[] };
  /** For `too_many`: how many places the cards differ. */
  differing?: number;
}

export interface BuilderResult {
  /** The YAML did not read, with where. */
  error?: string;
  /** How many cards were found in it. */
  found: number;
  templates: BuiltTemplate[];
  leftOut: LeftOut[];
  /** Every template made, under one `decluttering_templates:`. */
  templatesYaml?: string;
  /**
   * Everything that was pasted, as it was, with each card that became a template swapped
   * for the decluttering card that draws it - stacks, grids, views and all.
   */
  pastedYaml?: string;
  /** The paste was a whole dashboard, so `pastedYaml` holds the templates too and is all there is to paste. */
  dashboard?: boolean;
}

function isView(node: any): boolean {
  if (Array.isArray(node.sections)) return true;
  return Array.isArray(node.cards) && (node.type === undefined || VIEW_TYPES.includes(node.type));
}

/*
 * Every card in whatever was pasted: a list of cards, one card, a view, a section or a
 * whole dashboard, as many documents as there are. Stacks, grids and conditional cards are
 * followed into, since copies are often the cards inside one. Only the keys that hold
 * cards are followed - a tile's `features:` have a `type` too, and they are not cards.
 */
export function collectCards(parsed: unknown): any[] {
  const found: any[] = [];
  const walk = (node: any): void => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node.views)) {
      walk(node.views);
      return;
    }
    if (isView(node)) {
      // A section is a grid of cards, not a grid card.
      for (const section of node.sections ?? []) walk(section?.cards);
      walk(node.cards);
      return;
    }
    if (typeof node.type !== 'string') return;
    found.push(node);
    if (Array.isArray(node.cards)) walk(node.cards);
    if (node.card && typeof node.card === 'object') walk(node.card);
  };
  walk(parsed);
  return found;
}

function labelFor(card: any, index: number): string {
  const shown = card.name ?? card.title ?? card.entity;
  const type = String(card.type).replace(/^custom:/, '');
  return typeof shown === 'string' && shown ? `${type} "${shown}"` : `${type} #${index + 1}`;
}

const isContainer = (card: any): boolean => Array.isArray(card.cards) || (card.card && typeof card.card === 'object');

const usesTemplate = (card: any): boolean =>
  CONSUMER_TYPES.includes(card.type) || isTemplateCardType(card.type) || JSON.stringify(card).includes('[[');

const INHERITED = new Set(['__proto__', 'constructor', 'prototype']);
const isInherited = (step: string | number): boolean => typeof step === 'string' && INHERITED.has(step);

const keyOf = (path: Path): string => JSON.stringify(path);

const readable = (path: Path): string =>
  path.map((step) => (typeof step === 'number' ? `#${step + 1}` : step)).join(' › ');

interface Plan {
  /** Every setting any of the cards has, the first card's values where they share one. */
  reference: any;
  /** Where the cards differ, a value missing from a card counting as a difference. */
  differing: Path[];
  /** Which of those some of the cards do not have at all - the optional ones. */
  optional: Set<string>;
}

/*
 * What one template for these cards would look like, or undefined when there cannot be
 * one: a setting that is a value on one card and a block on another, or a list longer on
 * one card than another. A setting some cards lack is fine as long as it is not inside a
 * list - an optional placeholder can drop a key, not a list item.
 */
function plan(bodies: any[]): Plan | undefined {
  const reference = JSON.parse(JSON.stringify(bodies[0]));
  const seen = new Map<string, Path>();
  for (const body of bodies) for (const leaf of leaves(body)) seen.set(keyOf(leaf.path), leaf.path);
  // A key that names an object's own machinery is no setting: walked into, `__proto__` is the
  // prototype every object shares, and writing under it would reach them all (review 2026-10-25).
  const paths = [...seen.values()].filter((path) => !path.some(isInherited));
  const keys = new Set(paths.map(keyOf));
  // One card's value where another card has a block of settings.
  for (const path of paths)
    for (let length = 1; length < path.length; length += 1)
      if (keys.has(keyOf(path.slice(0, length)))) return undefined;

  const optional = new Set<string>();
  for (const path of paths) {
    if (bodies.every((body) => valueAt(body, path) !== undefined)) continue;
    if (path.some((step) => typeof step === 'number')) return undefined;
    optional.add(keyOf(path));
    if (valueAt(reference, path) !== undefined) continue;
    let node = reference;
    path.slice(0, -1).forEach((step) => {
      if (node[step] === undefined || node[step] === null || typeof node[step] !== 'object') node[step] = {};
      node = node[step];
    });
    node[path[path.length - 1]] = bodies.map((body) => valueAt(body, path)).find((value) => value !== undefined);
  }

  const differing = leaves(reference)
    .map((leaf) => leaf.path)
    .filter((path) =>
      bodies.some((body) => JSON.stringify(valueAt(body, path)) !== JSON.stringify(valueAt(reference, path))),
    );
  return { reference, differing, optional };
}

/*
 * Cards that can share a template, in the order they were pasted. Each card joins the
 * first set it fits - same type, a plan exists, no more than MAX_DIFFERING variables - or
 * starts one of its own. Exact copies are a set with nothing differing.
 */
function groupCards(cards: any[]): number[][] {
  const groups: number[][] = [];
  cards.forEach((card, index) => {
    const fits = groups.find((group) => {
      if (cards[group[0]].type !== card.type) return false;
      const made = plan([...group, index].map((each) => withoutLayout(cards[each])));
      return !!made && made.differing.length <= MAX_DIFFERING;
    });
    if (fits) fits.push(index);
    else groups.push([index]);
  });
  return groups;
}

/** The template a set of cards becomes, and what each card passes it. */
function makeTemplate(cards: any[]): {
  card: any;
  names: string[];
  optional: string[];
  variables: VariablesConfig[][];
} {
  const bodies = cards.map(withoutLayout);
  const { reference, differing, optional } = plan(bodies) as Plan;
  const names = variableNamesFor(differing);
  const card = JSON.parse(JSON.stringify(reference));
  differing.forEach((path, at) => {
    const parent = valueAt(card, path.slice(0, -1)) as any;
    parent[path[path.length - 1]] = `[[${names[at]}${optional.has(keyOf(path)) ? '?' : ''}]]`;
  });
  const variables = bodies.map((body) =>
    differing
      .map((path, at) => ({ name: names[at], value: valueAt(body, path) }))
      .filter((each) => each.value !== undefined)
      .map((each) => ({ [each.name]: each.value })),
  );
  return { card, names, optional: names.filter((_, at) => optional.has(keyOf(differing[at]))), variables };
}

function layoutOf(card: any): Record<string, unknown> {
  const kept: Record<string, unknown> = {};
  for (const key of LAYOUT_KEYS) if (card?.[key] !== undefined) kept[key] = card[key];
  return kept;
}

function valuesOf(variables: VariablesConfig[]): Record<string, unknown> {
  return Object.assign({}, ...variables);
}

/*
 * Why a card that shares a template with nothing does not: set against the card of its
 * type it is most like, either the two are built differently - and here is what only one
 * of them has - or they would make a template with too many holes in it.
 */
function explainAlone(cards: any[], index: number, groups: number[][], labels: string[]): LeftOut {
  const label = labels[index];
  const mine = leaves(withoutLayout(cards[index])).map((leaf) => readable(leaf.path));
  let nearest: number | undefined;
  let fewest = Infinity;
  cards.forEach((card, other) => {
    if (other === index || card.type !== cards[index].type) return;
    const theirs = leaves(withoutLayout(card)).map((leaf) => readable(leaf.path));
    const count = mine.filter((path) => !theirs.includes(path)).length + theirs.filter((p) => !mine.includes(p)).length;
    if (count < fewest) {
      fewest = count;
      nearest = other;
    }
  });
  if (nearest === undefined) return { label, reason: 'alone' };

  const group = groups.find((each) => each.includes(nearest as number)) as number[];
  const together = plan([...group, index].map((each) => withoutLayout(cards[each])));
  if (together) return { label, reason: 'too_many', differing: together.differing.length };
  const theirs = leaves(withoutLayout(cards[nearest])).map((leaf) => readable(leaf.path));
  return {
    label,
    reason: 'alone',
    nearest: {
      label: labels[nearest],
      onlyHere: mine.filter((path) => !theirs.includes(path)),
      onlyThere: theirs.filter((path) => !mine.includes(path)),
    },
  };
}

/** Read pasted YAML and make every template it holds. */
export function buildTemplates(text: string): BuilderResult {
  let documents: unknown[];
  try {
    documents = loadAll(text, { maxAliases: MAX_ALIASES }) as unknown[];
  } catch (err) {
    return { error: (err as Error).message, found: 0, templates: [], leftOut: [] };
  }

  const all = collectCards(documents);
  const allLabels = all.map(labelFor);
  const leftOut: LeftOut[] = [];
  const cards: any[] = [];
  const labels: string[] = [];
  all.forEach((card, index) => {
    if (usesTemplate(card)) {
      leftOut.push({ label: allLabels[index], reason: 'template' });
    } else {
      cards.push(card);
      labels.push(allLabels[index]);
    }
  });

  const groups = groupCards(cards);
  // A template with nothing to fill in only adds a level, so copies are left alone.
  const useful = groups
    .filter((group) => group.length > 1 && plan(group.map((index) => withoutLayout(cards[index])))?.differing.length)
    // The biggest sets first: those are the ones a template saves the most on.
    .sort((a, b) => b.length - a.length || a[0] - b[0]);

  // A pasted dashboard may have templates already; a new one must not take their names.
  const taken: string[] = [];
  for (const doc of documents as any[])
    if (isDashboard(doc) && doc.decluttering_templates && typeof doc.decluttering_templates === 'object')
      taken.push(...Object.keys(doc.decluttering_templates));
  const replacements = new Map<any, any>();
  const madeTemplates: Record<string, unknown> = {};
  const templates: BuiltTemplate[] = useful.map((group) => {
    const members = group.map((index) => cards[index]);
    const name = suggestTemplateName(members[0].type, taken, members);
    taken.push(name);
    const made = makeTemplate(members);
    const examples = made.variables.slice(0, MAX_EXAMPLES).map(valuesOf);
    madeTemplates[name] = { card: made.card, examples };
    const standIns = made.variables.map((variables, at) => similarReplacement(name, variables, layoutOf(members[at])));
    members.forEach((member, at) => replacements.set(member, standIns[at]));
    return {
      name,
      type: members[0].type,
      labels: group.map((index) => labels[index]),
      variables: made.names,
      optional: made.optional,
      templateYaml: toYaml({
        decluttering_templates: {
          [name]: { card: made.card, examples },
        },
      }),
      cardsYaml: toYaml(standIns),
    };
  });

  // Why the rest were not. A container is not reported: it holds the cards that matter.
  for (const group of groups) {
    if (useful.includes(group)) continue;
    for (const index of group) {
      if (isContainer(cards[index])) continue;
      leftOut.push(
        group.length > 1 ? { label: labels[index], reason: 'copies' } : explainAlone(cards, index, groups, labels),
      );
    }
  }

  if (!templates.length) return { found: all.length, templates, leftOut };

  const dashboard = documents.length === 1 && isDashboard(documents[0]);
  const rewritten = documents.map((doc) => swapCards(doc, replacements));
  if (dashboard) {
    const { decluttering_templates: before, ...rest } = rewritten[0] as any;
    rewritten[0] = { decluttering_templates: { ...(before ?? {}), ...madeTemplates }, ...rest };
  }
  return {
    found: all.length,
    templates,
    leftOut,
    templatesYaml: toYaml({ decluttering_templates: madeTemplates }),
    pastedYaml: rewritten.map(toYaml).join('---\n'),
    dashboard,
  };
}

const isDashboard = (doc: any): boolean => !!doc && typeof doc === 'object' && Array.isArray(doc.views);

/** A copy of what was pasted with each card in `replacements` swapped for its stand-in. */
function swapCards(node: any, replacements: Map<any, any>): any {
  if (replacements.has(node)) return replacements.get(node);
  if (Array.isArray(node)) return node.map((each) => swapCards(each, replacements));
  if (!node || typeof node !== 'object') return node;
  const copy: Record<string, unknown> = {};
  for (const key of Object.keys(node)) {
    if (isInherited(key)) continue;
    copy[key] = swapCards(node[key], replacements);
  }
  return copy;
}

export { MAX_DIFFERING };
