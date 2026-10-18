import { TemplateConfig, VariablesConfig } from './types';
import {
  conditionTarget,
  ESCAPE,
  forEachItems,
  getDeclarations,
  INHERIT_FLAG,
  normaliseVariables,
  OWN_DEFAULTS,
  ownVariables,
  templateDefaults,
  variableName,
} from './variables';
import { CONSUMER_TYPES, closestTemplate, forEachPlace, placeValues } from './templates';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * A card can pass a variable its template never reads: a typo (`entitiy:`), a name the
 * template has since renamed, or something copied from a card using a different template.
 * Nothing goes wrong - the value simply goes nowhere - which is exactly why it is worth
 * saying. The template quietly falls back on its default, and the card looks almost right.
 */

// Innermost placeholders, read from the inside out so a lookup like
// `[[colours.[[level]]]]` gives both `level` and `colours`.
const INNERMOST = '\\[\\[([^[\\]]*)\\]\\]';
const STAND_IN = '_';

/**
 * Every variable the placeholders in a value read: the name a placeholder starts with (and
 * the part before its first dot, since `[[room.light]]` reads `room`), and the names its
 * `or:` and `if:` steps read. An escaped `[[!name]]` reads nothing.
 */
export function readsIn(value: unknown): string[] {
  let text = typeof value === 'string' ? value : JSON.stringify(value);
  if (typeof text !== 'string' || !text.includes('[[')) return [];
  const names = new Set<string>();
  for (let pass = 0; pass < 5; pass += 1) {
    let found = false;
    text = text.replace(new RegExp(INNERMOST, 'g'), (_match, inside: string) => {
      found = true;
      if (inside.startsWith(ESCAPE)) return STAND_IN;
      const bare = inside.endsWith('?') ? inside.slice(0, -1) : inside;
      const [head, ...steps] = bare.split('|');
      const name = head.endsWith('?') ? head.slice(0, -1) : head;
      for (const each of [name, name.split('.')[0]]) if (each && each !== STAND_IN) names.add(each);
      for (const step of steps) {
        const target = step.startsWith('or:') ? step.slice(3) : conditionTarget(step);
        if (target && target !== STAND_IN) names.add(target);
      }
      return STAND_IN;
    });
    if (!found) break;
  }
  return [...names];
}

/** The nested cards inside a template that ask for every variable of the card around them. */
function inheritingTemplates(node: any, found: string[] = []): string[] {
  if (Array.isArray(node)) {
    for (const item of node) inheritingTemplates(item, found);
    return found;
  }
  if (!node || typeof node !== 'object') return found;
  if (CONSUMER_TYPES.includes(node.type) && node[INHERIT_FLAG] === true && typeof node.template === 'string') {
    found.push(node.template);
  }
  for (const value of Object.values(node)) inheritingTemplates(value, found);
  return found;
}

/**
 * Every name a template has any use for: what it declares, what it defaults, and what a
 * placeholder anywhere in it reads - its content, its `let:` values, a group's cards - plus
 * whatever a nested card handed all its variables (`inherit_variables: true`) reads in turn.
 *
 * `complete` is false when one of those nested templates is not in `templates`: what it
 * reads cannot be known, so nothing the card passes can be called unread.
 */
export function templateReads(
  template: TemplateConfig | undefined,
  templates: Record<string, TemplateConfig>,
  seen: Set<string> = new Set(),
): { names: Set<string>; complete: boolean } {
  const names = new Set<string>();
  if (!template) return { names, complete: true };
  /*
   * A template collected from a dashboard carries the dashboard's decluttering_defaults
   * under its own, and those are every template's - a name in them says nothing about
   * whether this template reads it. Its own list is kept aside, and that is the one read.
   */
  if (OWN_DEFAULTS in template) template = { ...template, default: (template as any)[OWN_DEFAULTS] };
  for (const declaration of getDeclarations(template)) names.add(declaration.name);
  for (const entry of normaliseVariables(templateDefaults(template))) {
    const name = variableName(entry);
    if (name !== undefined) names.add(name);
  }
  for (const name of readsIn(template)) names.add(name);

  let complete = true;
  for (const nested of inheritingTemplates(template)) {
    if (seen.has(nested)) continue;
    seen.add(nested);
    // Own properties only: a template called `constructor` is not Object.prototype's.
    if (!Object.prototype.hasOwnProperty.call(templates, nested)) {
      complete = false;
      continue;
    }
    const inner = templateReads(templates[nested], templates, seen);
    for (const name of inner.names) names.add(name);
    if (!inner.complete) complete = false;
  }
  return { names, complete };
}

/**
 * The variables a card passes that its template never reads - not declared, not defaulted,
 * not read by any placeholder - each with the name it was probably meant to be, when one of
 * the template's own is a near miss. A variable read only through `or:` or `if:` is read,
 * and so is one the value of another passed variable reads. A name the template works out
 * in `let:` is never read from the card either: `let:` wins, so the card's value is ignored.
 *
 * `outside` is what the card's section, view and dashboard give it - their
 * decluttering_let and decluttering_defaults. A name one of their values reads is read,
 * and a name a decluttering_let works out is, like the template's own `let:`, never read
 * from the card. `reads` is anything else that reads the card's variables - its own
 * `on_error:` card, which is filled in from them.
 */
export function unreadVariables(
  template: TemplateConfig | undefined,
  templates: Record<string, TemplateConfig>,
  variables: VariablesConfig[] | VariablesConfig | undefined,
  outside: { lets: VariablesConfig[]; defaults: VariablesConfig[] } = { lets: [], defaults: [] },
  reads: unknown = undefined,
): { name: string; closest?: string }[] {
  if (!template) return [];
  const { names, complete } = templateReads(template, templates);
  if (!complete) return [];

  const lets = new Set(
    [...normaliseVariables(template.let), ...outside.lets]
      .map(variableName)
      .filter((name): name is string => name !== undefined),
  );
  const passed = ownVariables(variables);
  const known = new Set(names);
  for (const read of readsIn(reads)) known.add(read);
  for (const entry of [...outside.lets, ...outside.defaults]) {
    const name = variableName(entry);
    if (name !== undefined) for (const read of readsIn(entry[name])) known.add(read);
  }
  const isRead = (name: string): boolean => !lets.has(name) && (known.has(name) || known.has(name.split('.')[0]));

  // A passed value can hold placeholders of its own - `label: '[[room]] light'` - and when
  // it is read, so is what it reads. Repeated until nothing new turns up.
  let grew = true;
  const followed = new Set<string>();
  while (grew) {
    grew = false;
    for (const entry of passed) {
      const name = variableName(entry) as string;
      if (followed.has(name) || !isRead(name)) continue;
      followed.add(name);
      for (const read of readsIn(entry[name])) {
        if (!known.has(read)) {
          known.add(read);
          grew = true;
        }
      }
    }
  }

  const passedNames = new Set(passed.map((entry) => variableName(entry) as string));
  // A near miss is one of the template's names that the card is not already passing.
  const candidates = [...known].filter((name) => !passedNames.has(name) && !lets.has(name));
  const out: { name: string; closest?: string }[] = [];
  for (const name of passedNames) {
    if (isRead(name)) continue;
    const closest = closestTemplate(name, candidates);
    out.push(closest ? { name, closest } : { name });
  }
  return out;
}

export interface UnreadFinding {
  view: { title: string; path: string; index: number };
  template: string;
  name: string;
  closest?: string;
  /** Where the card wrote it: its own variables, an item of its `for_each`, or an override. */
  where: 'variables' | 'for_each' | 'overrides';
  /** How many cards on that view do the same. */
  count: number;
}

/**
 * Every card on the dashboard passing a variable its template never reads, gathered by view,
 * template and name so a hundred copies of one mistake are one line. Cards whose template
 * is not in `templates` are skipped - a borrowed template still on its way is not a reason
 * to accuse them of anything. View, section and dashboard values are not cards, and are not
 * looked at - but what they read counts as read for every card they reach.
 */
export function checkUnreadVariables(ll: any, templates: Record<string, TemplateConfig>): UnreadFinding[] {
  const found = new Map<string, UnreadFinding>();
  const add = (view: UnreadFinding['view'], template: string, where: UnreadFinding['where'], each: any): void => {
    const key = JSON.stringify([view.index, template, each.name, where]);
    const existing = found.get(key);
    if (existing) {
      existing.count += 1;
      // One card may already pass the name another was meant to be, so has no near miss to offer.
      if (!existing.closest && each.closest) existing.closest = each.closest;
    } else
      found.set(key, {
        view,
        template,
        name: each.name,
        ...(each.closest ? { closest: each.closest } : {}),
        where,
        count: 1,
      });
  };

  type Outside = Parameters<typeof unreadVariables>[3];
  const walk = (node: any, view: UnreadFinding['view'], outside: Outside): void => {
    if (Array.isArray(node)) {
      for (const item of node) walk(item, view, outside);
      return;
    }
    if (!node || typeof node !== 'object') return;
    if (CONSUMER_TYPES.includes(node.type) && typeof node.template === 'string') {
      const template = Object.prototype.hasOwnProperty.call(templates, node.template)
        ? templates[node.template]
        : undefined;
      if (template) {
        // A name is reported once per card, from the first place the card wrote it.
        const said = new Set<string>();
        const report = (where: UnreadFinding['where'], variables: unknown): void => {
          // The card's own on_error: is built from its variables too; the template's is
          // part of the template, and read with it.
          for (const each of unreadVariables(
            template,
            templates,
            variables as VariablesConfig[],
            outside,
            node.on_error,
          )) {
            if (said.has(each.name)) continue;
            said.add(each.name);
            add(view, node.template, where, each);
          }
        };
        report('variables', node.variables);
        for (const item of forEachItems(node.for_each) ?? []) report('for_each', item);
        const overrides = node.for_each_from?.overrides;
        if (overrides && typeof overrides === 'object') {
          for (const values of Object.values(overrides)) report('overrides', values);
        }
      }
    }
    for (const value of Object.values(node)) walk(value, view, outside);
  };

  forEachPlace(ll, (node, index, section) => {
    const view = ll.views[index];
    walk(
      node,
      { title: view?.title ?? view?.path ?? '', path: view?.path ?? '', index },
      placeValues(ll, index, section),
    );
  });
  return [...found.values()].map(({ view, template, name, closest, where, count }) =>
    closest ? { view, template, name, closest, where, count } : { view, template, name, where, count },
  );
}
