import { TemplateConfig } from './types';
import { parentsOf, deprecationOf } from './templates';
import { contentKey } from './promote';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * A family of templates built with `extends:` (idea 29): who builds on whom, how many cards
 * use each, and what each layer changes about the one under it - the picture the Where used
 * tab draws, where before there was only the word `extends` in the YAML.
 */

export interface FamilyNode {
  name: string;
  children: FamilyNode[];
  /** Cards using this template directly, on this dashboard. */
  uses: number;
  deprecated: boolean;
  /** A root's own content keys. */
  sets: string[];
  /** Content keys this template gives a different value from its parent's. */
  changes: string[];
  /** Content keys this template has that its parent has not. */
  adds: string[];
  /** Content keys this template sets to null, taking them out. */
  drops: string[];
  /** Whether a parent named in `extends:` is nowhere to be found. */
  missingParent?: string;
}

function contentOf(template: any): Record<string, unknown> {
  const key = contentKey(template);
  const content = key ? template[key] : undefined;
  return content && typeof content === 'object' && !Array.isArray(content) ? content : {};
}

function same(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/* The raw templates merged along the chain of parents, content key by content key - enough to say what each layer changed. */
function mergedContent(
  templates: Record<string, TemplateConfig>,
  name: string,
  seen = new Set<string>(),
): Record<string, unknown> {
  const template = templates[name];
  if (!template || seen.has(name)) return {};
  seen.add(name);
  let base: Record<string, unknown> = {};
  for (const parent of parentsOf(template)) base = { ...base, ...mergedContent(templates, parent, seen) };
  const own = contentOf(template);
  const out = { ...base };
  for (const [key, value] of Object.entries(own)) {
    if (value === null) delete out[key];
    else out[key] = value;
  }
  return out;
}

function nodeFor(
  templates: Record<string, TemplateConfig>,
  name: string,
  usage: (name: string) => number,
  seen: Set<string>,
): FamilyNode {
  const template = templates[name] as any;
  const parents = parentsOf(template);
  const own = contentOf(template);
  const under = parents.length ? mergedContent(templates, parents[parents.length - 1], new Set([name])) : {};
  // Several parents: the last one is what this template's own content sits on; the others are
  // underneath it in turn, and their keys count as the parent's.
  const base: Record<string, unknown> =
    parents.length > 1
      ? parents.reduce<Record<string, unknown>>(
          (acc, parent) => ({ ...acc, ...mergedContent(templates, parent, new Set([name])) }),
          {},
        )
      : under;
  const node: FamilyNode = {
    name,
    children: [],
    uses: usage(name),
    deprecated: deprecationOf(template) !== undefined,
    sets: parents.length ? [] : Object.keys(own),
    changes: parents.length
      ? Object.keys(own).filter((key) => key in base && own[key] !== null && !same(own[key], base[key]))
      : [],
    adds: parents.length ? Object.keys(own).filter((key) => !(key in base) && own[key] !== null) : [],
    drops: parents.length ? Object.keys(own).filter((key) => own[key] === null) : [],
  };
  const missing = parents.find((parent) => !templates[parent]);
  if (missing) node.missingParent = missing;
  seen.add(name);
  for (const childName of Object.keys(templates)) {
    if (seen.has(childName)) continue;
    const childParents = parentsOf(templates[childName]);
    // A child of several parents hangs under the last, which is the one its content sits on.
    if (childParents.length && childParents[childParents.length - 1] === name) {
      node.children.push(nodeFor(templates, childName, usage, seen));
    }
  }
  node.children.sort((a, b) => a.name.localeCompare(b.name));
  return node;
}

/**
 * Every family on the dashboard, as trees from the templates with no parent (or whose
 * parent is missing), children sorted by name. Templates with neither parent nor child are
 * left out: they are not a family.
 */
export function extendsFamilies(
  templates: Record<string, TemplateConfig>,
  usage: (name: string) => number,
): FamilyNode[] {
  const names = Object.keys(templates);
  const hasChild = new Set<string>();
  for (const name of names) {
    const parents = parentsOf(templates[name]);
    if (parents.length) hasChild.add(parents[parents.length - 1]);
  }
  const seen = new Set<string>();
  const roots: FamilyNode[] = [];
  for (const name of names.sort()) {
    const parents = parentsOf(templates[name]);
    const orphan = parents.length > 0 && !parents.every((parent) => templates[parent]);
    if ((parents.length && !orphan) || seen.has(name)) continue;
    if (!hasChild.has(name) && !orphan) continue;
    roots.push(nodeFor(templates, name, usage, seen));
  }
  return roots;
}

/** The family tree a template belongs to, or nothing when it stands alone. */
export function familyOf(roots: FamilyNode[], name: string): FamilyNode | undefined {
  const holds = (node: FamilyNode): boolean => node.name === name || node.children.some(holds);
  return roots.find(holds);
}

export interface Layer {
  from: string;
  /** The content keys this layer contributes, as written on it. */
  content: Record<string, unknown>;
}

/** How a template is built: each ancestor's own content, root first, this template last. */
export function layersOf(templates: Record<string, TemplateConfig>, name: string): Layer[] {
  const chain: string[] = [];
  const walk = (each: string, seen: Set<string>): void => {
    if (seen.has(each) || !templates[each]) return;
    seen.add(each);
    for (const parent of parentsOf(templates[each])) walk(parent, seen);
    chain.push(each);
  };
  walk(name, new Set());
  return chain.map((from) => ({ from, content: contentOf(templates[from]) }));
}

/** How many templates and cards a family holds, for its heading. */
export function familySize(node: FamilyNode): { templates: number; cards: number } {
  let templates = 0;
  let cards = 0;
  const walk = (each: FamilyNode): void => {
    templates += 1;
    cards += each.uses;
    each.children.forEach(walk);
  };
  walk(node);
  return { templates, cards };
}
