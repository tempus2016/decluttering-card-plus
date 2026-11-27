import { localize } from './localize';
import { PLACEHOLDER, VariableDeclaration } from './variables';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * The hard part of adopting this card is the first conversion: taking a card you already
 * built and deciding which parts of it are the ones that change between copies. These are
 * the parts that almost always are.
 */
interface Candidate {
  /** The variable name to propose, before any numbering. */
  base: string;
  /** The locale key of the label the variable is declared with. */
  label: string;
  selector: any;
  /** Whether this value is worth turning into a variable at all. */
  matches: (value: string) => boolean;
}

/** What an entity id looks like where a card names one; promote.ts reads a setting's kind with it too. */
export const ENTITY_ID = /^[a-z_]+\.[a-z0-9_]+$/;

// `entity` and `entity_id` are one candidate under two keys, so they cannot drift apart.
const entityCandidate: Candidate = {
  base: 'entity',
  label: 'suggest.label_entity',
  selector: { entity: {} },
  matches: (v) => ENTITY_ID.test(v),
};

function textCandidate(base: string, label: string): Candidate {
  return { base, label, selector: { text: {} }, matches: (v) => v.trim().length > 0 };
}

const CANDIDATES: Record<string, Candidate> = {
  entity: entityCandidate,
  entity_id: entityCandidate,
  name: textCandidate('name', 'suggest.label_name'),
  title: textCandidate('title', 'suggest.label_title'),
  heading: textCandidate('heading', 'suggest.label_heading'),
  icon: { base: 'icon', label: 'suggest.label_icon', selector: { icon: {} }, matches: (v) => v.includes(':') },
};

// In the language of whoever is making the template: the label is written into it.
function labelFor(candidate: Candidate, index: number, hass?: unknown): string {
  const label = localize(candidate.label, undefined, hass as undefined);
  return index === 1 ? label : `${label} ${index}`;
}

/**
 * A card rewritten to take variables, and the variables it now takes. Every variable
 * defaults to the value it replaced, so the template still renders what the card did
 * until somebody passes something else in.
 *
 * `taken` is the names already spoken for, so a suggestion never quietly replaces a
 * variable the template already declares. `hass` says whose language the labels are in;
 * without it they are in the page's.
 */
export function suggestVariables(
  card: any,
  taken: string[],
  hass?: unknown,
): { card: any; variables: VariableDeclaration[] } {
  const used = new Set(taken);
  const variables: VariableDeclaration[] = [];
  // The same value in the same kind of place is the same variable: an entity named twice
  // in a stack should be one thing to fill in, not two.
  const assigned = new Map<string, string>();

  const nameFor = (candidate: Candidate, value: string): string => {
    const key = `${candidate.base} ${value}`;
    const already = assigned.get(key);
    if (already) return already;

    let index = 1;
    let name = candidate.base;
    while (used.has(name)) {
      index += 1;
      name = `${candidate.base}_${index}`;
    }
    used.add(name);
    assigned.set(key, name);
    variables.push({ name, label: labelFor(candidate, index, hass), selector: candidate.selector, default: value });
    return name;
  };

  const walk = (node: any): any => {
    if (Array.isArray(node)) return node.map(walk);
    if (!node || typeof node !== 'object') return node;

    const out: any = {};
    for (const [key, value] of Object.entries(node)) {
      // Own names only: `constructor` or `toString` as a key would find Object's, not a candidate.
      const candidate = Object.prototype.hasOwnProperty.call(CANDIDATES, key) ? CANDIDATES[key] : undefined;
      // Only a plain string is replaced. A list of entities would have to become a list
      // of variables, and half-replacing one is worse than leaving it alone.
      // A value that already refers to a variable is somebody's deliberate work, not a
      // literal waiting to be replaced.
      if (candidate && typeof value === 'string' && !PLACEHOLDER.test(value) && candidate.matches(value)) {
        out[key] = `[[${nameFor(candidate, value)}]]`;
      } else {
        out[key] = walk(value);
      }
    }
    return out;
  };

  return { card: walk(card), variables };
}
