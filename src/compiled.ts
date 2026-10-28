import { OPTIONAL_SUFFIX, TRANSFORM_SUFFIX } from './variables';

/*
 * A template compiled once (idea 3). Substitution works on the JSON text of a template's
 * content, and the first thing every build did was stringify that content and scan it for
 * placeholders - the same text, the same sites, once per copy of a repeat and once per card
 * using the template. The content object is the same object every time, so the text and
 * the sites it holds are worked out once and kept against it. A WeakMap holds no reference
 * of its own: when the dashboard configuration is replaced on a save, the old templates and
 * their compiled forms go together.
 *
 * Only the first pass of a build reads the pieces. A value that itself holds placeholders
 * puts new sites into the text, and those are found by scanning the result as before.
 */

/** One place a placeholder stands in the text, with whichever quotes the scan took with it. */
export interface Site {
  /** The matched text, quotes included, exactly as String.replace would hand it over. */
  text: string;
  lead: string | undefined;
  name: string;
  chain: string | undefined;
  optional: string | undefined;
  trail: string | undefined;
}

/** Literal text between sites, or a site. */
export type Piece = string | Site;

export interface Compiled {
  json: string;
  pieces: Piece[];
}

/*
 * Every site a placeholder can stand at: a quote before and one after mean it is a whole
 * value of its own, otherwise it is part of a longer string. The chain grammar is the closed
 * one from variables.ts, so a chain with a step nobody knows matches nothing and the
 * placeholder stays visible. deep-replace.ts scans with the same source.
 */
export const SITE_SOURCE = `(")?\\[\\[([^|\\[\\]?]+)${TRANSFORM_SUFFIX}${OPTIONAL_SUFFIX}\\]\\](")?`;

const compiled = new WeakMap<object, Compiled>();

// How many times a content object has actually been compiled - what the tests count.
let compiles = 0;

/** Text split into literal runs and the sites between them. */
export function splitSites(json: string): Piece[] {
  const pieces: Piece[] = [];
  const scan = new RegExp(SITE_SOURCE, 'g');
  let last = 0;
  let match = scan.exec(json);
  while (match) {
    if (match.index > last) pieces.push(json.slice(last, match.index));
    pieces.push({
      text: match[0],
      lead: match[1],
      name: match[2],
      chain: match[3],
      optional: match[4],
      trail: match[5],
    });
    last = match.index + match[0].length;
    match = scan.exec(json);
  }
  if (last < json.length) pieces.push(json.slice(last));
  return pieces;
}

/** The content's JSON text and the sites in it, worked out once per content object. */
export function compile(content: object): Compiled {
  let found = compiled.get(content);
  if (!found) {
    const json = JSON.stringify(content);
    found = { json, pieces: splitSites(json) };
    compiled.set(content, found);
    compiles += 1;
  }
  return found;
}

/** How many content objects have been compiled since the page loaded. For tests. */
export function compileCount(): number {
  return compiles;
}
