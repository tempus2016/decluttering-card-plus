import { VariableDeclaration } from './variables';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * The hard part of adopting this card is the first conversion: taking a card you already
 * built and deciding which parts of it are the ones that change between copies. These are
 * the parts that almost always are.
 */
interface Candidate {
  /** The variable name to propose, before any numbering. */
  base: string;
  label: string;
  selector: any;
  /** Whether this value is worth turning into a variable at all. */
  matches: (value: string) => boolean;
}

const ENTITY_ID = /^[a-z_]+\.[a-z0-9_]+$/;

const CANDIDATES: Record<string, Candidate> = {
  entity: { base: 'entity', label: 'Entity', selector: { entity: {} }, matches: (v) => ENTITY_ID.test(v) },
  entity_id: { base: 'entity', label: 'Entity', selector: { entity: {} }, matches: (v) => ENTITY_ID.test(v) },
  name: { base: 'name', label: 'Name', selector: { text: {} }, matches: (v) => v.trim().length > 0 },
  title: { base: 'title', label: 'Title', selector: { text: {} }, matches: (v) => v.trim().length > 0 },
  heading: { base: 'heading', label: 'Heading', selector: { text: {} }, matches: (v) => v.trim().length > 0 },
  icon: { base: 'icon', label: 'Icon', selector: { icon: {} }, matches: (v) => v.includes(':') },
};

// A value that already refers to a variable is somebody's deliberate work, not a literal
// waiting to be replaced.
const PLACEHOLDER = /\[\[[^[\]]+\]\]/;

function labelFor(candidate: Candidate, index: number): string {
  return index === 1 ? candidate.label : `${candidate.label} ${index}`;
}

/**
 * A card rewritten to take variables, and the variables it now takes. Every variable
 * defaults to the value it replaced, so the template still renders what the card did
 * until somebody passes something else in.
 *
 * `taken` is the names already spoken for, so a suggestion never quietly replaces a
 * variable the template already declares.
 */
export function suggestVariables(card: any, taken: string[]): { card: any; variables: VariableDeclaration[] } {
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
    variables.push({ name, label: labelFor(candidate, index), selector: candidate.selector, default: value });
    return name;
  };

  const walk = (node: any): any => {
    if (Array.isArray(node)) return node.map(walk);
    if (!node || typeof node !== 'object') return node;

    const out: any = {};
    for (const [key, value] of Object.entries(node)) {
      const candidate = CANDIDATES[key];
      // Only a plain string is replaced. A list of entities would have to become a list
      // of variables, and half-replacing one is worse than leaving it alone.
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
