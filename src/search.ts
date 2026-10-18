import { CONSUMER_TYPES, collectRawTemplates, isTemplateCardType } from './templates';
import { forEachItems, ownVariables } from './variables';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * "Which cards show light.kitchen?" is the question a renamed entity or a replaced bulb
 * asks, and with templates the answer is not where Home Assistant's own search looks: the
 * entity is a value passed to a template, on whichever dashboard, under whatever name the
 * template gave it. This looks there - and in the templates themselves, where a value
 * written straight in is the same entity hiding somewhere else.
 */

export interface CardValueMatch {
  urlPath: string;
  view: { title: string; path: string; index: number };
  template: string;
  /** Where on the card: its variables, an item of its repeat, an override, or its own card block. */
  where: 'variables' | 'for_each' | 'overrides' | 'override_block';
  /** The variable's name - dotted into a mapping, prefixed by the entity for an override. */
  variable: string;
  value: string;
}

export interface TemplateValueMatch {
  urlPath: string;
  template: string;
  /** Where in the template, written like `card.entities[0].entity`. */
  path: string;
  value: string;
}

// A card's own blocks, laid over what its template builds - written by hand, so searched.
const OVERRIDE_BLOCKS = ['card', 'badge', 'row', 'element'];

/** Every scalar inside a value, with the path to it. */
function scalars(value: any, path: string, out: { path: string; value: string }[] = []): typeof out {
  if (Array.isArray(value)) value.forEach((item, index) => scalars(item, `${path}[${index}]`, out));
  else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) scalars(item, path ? `${path}.${key}` : key, out);
  } else if (value !== undefined && value !== null) out.push({ path, value: String(value) });
  return out;
}

/**
 * Every place on the dashboards handed in where a value contains `query`, case aside: in a
 * decluttering card's variables, its for_each items, its for_each_from overrides and its
 * own card: block; and, separately, anywhere in a template's definition. A template card's
 * contents are the template's, so they are found as a template rather than as cards.
 */
export function searchValues(
  dashboards: { urlPath: string; config: any }[],
  query: string,
): { cards: CardValueMatch[]; templates: TemplateValueMatch[] } {
  const wanted = query.trim().toLowerCase();
  const cards: CardValueMatch[] = [];
  const templates: TemplateValueMatch[] = [];
  if (!wanted) return { cards, templates };
  const hits = (value: string): boolean => value.toLowerCase().includes(wanted);

  for (const { urlPath, config } of dashboards) {
    const fromCard = (node: any, view: CardValueMatch['view']): void => {
      const add = (where: CardValueMatch['where'], variable: string, value: string): void => {
        cards.push({ urlPath, view, template: node.template, where, variable, value });
      };
      const variablesIn = (where: CardValueMatch['where'], variables: unknown, prefix = ''): void => {
        for (const entry of ownVariables(variables)) {
          const [name, value] = Object.entries(entry)[0];
          for (const each of scalars(value, `${prefix}${name}`))
            if (hits(each.value)) add(where, each.path, each.value);
        }
      };
      variablesIn('variables', node.variables);
      for (const item of forEachItems(node.for_each) ?? []) variablesIn('for_each', item);
      const overrides = node.for_each_from?.overrides;
      if (overrides && typeof overrides === 'object') {
        for (const [entity, values] of Object.entries(overrides)) {
          // The entity an override is for is a value somebody wrote, as much as what it sets.
          if (hits(entity)) add('overrides', entity, entity);
          variablesIn('overrides', values, `${entity} › `);
        }
      }
      for (const block of OVERRIDE_BLOCKS) {
        if (node[block] === undefined) continue;
        for (const each of scalars(node[block], block))
          if (hits(each.value)) add('override_block', each.path, each.value);
      }
    };

    const walk = (node: any, view: CardValueMatch['view']): void => {
      if (Array.isArray(node)) {
        for (const item of node) walk(item, view);
        return;
      }
      if (!node || typeof node !== 'object' || isTemplateCardType(node.type)) return;
      if (CONSUMER_TYPES.includes(node.type) && typeof node.template === 'string') fromCard(node, view);
      for (const value of Object.values(node)) walk(value, view);
    };
    ((config?.views ?? []) as any[]).forEach((view, index) =>
      walk(view, { title: view?.title ?? view?.path ?? '', path: view?.path ?? '', index }),
    );

    for (const [name, definition] of Object.entries(collectRawTemplates(config))) {
      // A template card's type and name say what it is, not what it holds.
      const body: Record<string, unknown> = { ...((definition ?? {}) as any) };
      delete body.type;
      delete body.template;
      for (const each of scalars(body, '')) if (hits(each.value)) templates.push({ urlPath, template: name, ...each });
    }
  }
  return { cards, templates };
}
