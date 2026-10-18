import { TemplateConfig, VariablesConfig } from './types';
import deepReplace from './deep-replace';
import { localize } from './localize';
import { describeCycle, describeTooDeep, MAX_NESTING } from './cycles';
import { groupCard, templatesNamedBy } from './templates';
import { INHERIT_FLAG, ownVariables, validateDeclared } from './variables';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * `examples:` on a template is a list of variable sets, each written the way a card writes
 * its `variables:` - a mapping, or a list of one-name entries. They are the template's own
 * test cases: the health panel builds every one and says which fail, the template's
 * preview can be drawn with any of them, and a new card can start from one.
 *
 * Each set is one entry of the list, so a mapping in the list is a whole example, not one
 * variable of it - a list-form example is a list inside the list. A single mapping in place
 * of the list is taken as a list of one, the forgiveness `for_each` gets.
 */
// How many nested templates one example is followed into, all told.
const MAX_FOLLOWS = 500;

export function exampleSets(template: unknown): VariablesConfig[][] {
  const written = (template as any)?.examples;
  if (written === undefined || written === null) return [];
  const list = Array.isArray(written) ? written : [written];
  return list.map((example) => ownVariables(example));
}

/** The variables one example sets, or none when there is no such example - the template's defaults then apply. */
export function exampleVariables(template: unknown, index: number | undefined): VariablesConfig[] | undefined {
  if (index === undefined) return undefined;
  return exampleSets(template)[index];
}

// The things a template can define, exactly one of which it must.
const CONTENT_KEYS = ['card', 'row', 'element', 'badge', 'group'];

function contentOf(template: TemplateConfig): { content?: unknown; problem?: string } {
  const defined = CONTENT_KEYS.filter((key) => (template as any)[key] !== undefined);
  if (defined.length !== 1) {
    return {
      problem: defined.length
        ? localize('error.defines_both', { first: defined[0], second: defined[1] })
        : localize('error.defines_nothing'),
    };
  }
  const key = defined[0];
  return { content: key === 'group' ? groupCard(template.group) : (template as any)[key] };
}

/** Every card of ours inside a built config, with the place it was found. */
function consumersIn(node: any, found: any[] = []): any[] {
  if (Array.isArray(node)) {
    node.forEach((item) => consumersIn(item, found));
    return found;
  }
  if (!node || typeof node !== 'object') return found;
  if (templatesNamedBy(node).length) {
    found.push(node);
    // Its own content comes from its template, which is followed separately.
    return found;
  }
  Object.values(node).forEach((value) => consumersIn(value, found));
  return found;
}

/*
 * What goes wrong building one example: anything the card would refuse or leave showing.
 * The templates nested inside are followed as far as the card would follow them, to find
 * one that does not exist or one that leads back round - their own variables are their
 * business, so only the top level is held to having every value set.
 */
function problemsOf(
  name: string,
  template: TemplateConfig,
  variables: VariablesConfig[],
  templates: Record<string, TemplateConfig>,
  borrowed: Set<string>,
  hass: any,
): string[] {
  const problems: string[] = [];
  const { content, problem } = contentOf(template);
  if (problem) return [problem];

  const unresolved: string[] = [];
  let built: unknown;
  try {
    built = deepReplace(variables, template, content, name, hass, true, (names) => unresolved.push(...names));
  } catch (err) {
    return [String((err as Error)?.message ?? err)];
  }
  if (unresolved.length) {
    problems.push(localize('examples.unset', { which: unresolved.map((each) => `[[${each}]]`).join(', ') }, hass));
  }
  for (const each of validateDeclared(variables, template, hass)) {
    problems.push(localize('editor.invalid_value', { name: each.name, expected: each.expected }, hass));
  }

  const said = new Set<string>();
  const say = (text: string): void => {
    if (said.has(text)) return;
    said.add(text);
    problems.push(text);
  };
  /*
   * Each nested template is followed once per set of values handed to it. A chain of
   * templates each naming the next twice would otherwise be followed 2^depth times - which
   * at the nesting limit is minutes, in a panel a shared bundle can fill (review
   * 2026-10-18). A ceiling on the whole walk stands behind that for anything the memo
   * does not catch; past it the rest is simply not looked at.
   */
  const followed = new Set<string>();
  let left = MAX_FOLLOWS;
  const follow = (node: unknown, chain: string[], handed: VariablesConfig[]): void => {
    for (const card of consumersIn(node)) {
      const own = ownVariables(card.variables);
      const given = card[INHERIT_FLAG] === true ? [...own, ...handed] : own;
      for (const nested of templatesNamedBy(card)) {
        const at = chain.indexOf(nested);
        if (at !== -1) {
          say(describeCycle([...chain.slice(at), nested]));
          continue;
        }
        if (chain.length >= MAX_NESTING) {
          say(describeTooDeep(chain));
          continue;
        }
        const inner = templates[nested];
        if (!inner) {
          if (!borrowed.has(nested)) say(localize('examples.missing', { template: nested }, hass));
          continue;
        }
        const once = `${nested}\u0000${JSON.stringify(given)}`;
        if (followed.has(once) || (left -= 1) < 0) continue;
        followed.add(once);
        const inside = contentOf(inner);
        if (inside.content === undefined) continue;
        let innerBuilt: unknown;
        try {
          innerBuilt = deepReplace(given, inner, inside.content, nested, hass, true);
        } catch {
          continue;
        }
        follow(innerBuilt, [...chain, nested], given);
      }
    }
  };
  follow(built, [name], variables);
  return problems;
}

/**
 * Every example of every template here that does not build cleanly, with what is wrong:
 * a nested template that does not exist, a loop, a value it leaves unset - which a strict
 * card would refuse - or a value its declaration would not accept. A template borrowed from
 * another dashboard is not here to follow, so naming one is not a problem.
 */
export function checkExamples(
  templates: Record<string, TemplateConfig>,
  borrowed: Iterable<string> = [],
  hass?: any,
): { template: string; example: number; problems: string[] }[] {
  const elsewhere = new Set(borrowed);
  const failed: { template: string; example: number; problems: string[] }[] = [];
  for (const name of Object.keys(templates).sort()) {
    const template = templates[name];
    exampleSets(template).forEach((variables, index) => {
      const problems = problemsOf(name, template, variables, templates, elsewhere, hass);
      if (problems.length) failed.push({ template: name, example: index + 1, problems });
    });
  }
  return failed;
}
