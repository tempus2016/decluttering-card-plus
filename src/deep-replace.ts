import { VariablesConfig, TemplateConfig } from './types';
import { localize } from './localize';
import { BuildTrace } from './trace';
import { compile, Piece, SITE_SOURCE } from './compiled';
import { warn, WarningKind } from './warnings';
import { isRegistrySource, resolveRegistryItems, SourceContext } from './registry';
import {
  answersUnset,
  applyTransform,
  forEachVariables,
  HA_MARK,
  isStructureStep,
  normaliseVariables,
  FLAT_STEP,
  REPEAT_STEP,
  stepName,
  CONSUMER_TYPES,
  ESCAPE,
  gateOpen,
  hasCondition,
  JSON_STEP,
  resolveFallback,
  takesStructure,
  variableValues,
  withoutOptional,
  isOptional,
  OPTIONAL,
  hasEscape,
  isFallback,
  isJsonNumber,
  PLACEHOLDER,
  insideButtonCardJs,
  resolveVariables,
  STATE_STEP,
  restoreHaText,
  stateScope,
  unlistedState,
  unescapePlaceholders,
  withoutConditions,
  yieldsBoolean,
  yieldsList,
  yieldsNumber,
} from './variables';
import { closestStep, knownStep } from './closest';

/* eslint-disable @typescript-eslint/no-explicit-any */

// What a refusal says, and which way it happened: a transform was handed something it
// cannot shape, Home Assistant had nothing to give, an `if:` did not hold, `json` was
// written somewhere other than first, `state` was asked of an entity the card does not
// rebuild on, a `map:` had no pair for the value, or a `with:` or `repeat:` could not fill
// in. The reason carries the difference so the wording never has to - the wording is
// translated.
type RefusalReason = 'shape' | 'missing' | 'closed' | 'json' | 'unlisted' | 'map' | 'structure';

// The lookup step, whose "no pair for this value" is told apart from Home Assistant having nothing.
const MAP_STEP = 'map';

interface Refusal {
  text: string;
  reason: RefusalReason;
}

/*
 * How deep a condition's own value is worked out. `if:` reads a variable as it will end up,
 * not as it was written - a `let:` value built from the others is still `[[...]]` text until
 * it is substituted - so a condition settles that value first, with the same variables.
 * The settling can meet conditions of its own; past this depth they are read as written,
 * and the build says so. Counted apart from how deep `with:` fills nest, which used to eat
 * into it: a chain of defaults inside an item template ran out after two (#235).
 */
const MAX_CONDITION_DEPTH = 8;

// A variable's value can itself contain placeholders, so substitution runs repeatedly
// until nothing changes. The cap only matters for a variable that refers to itself,
// which would otherwise never settle.
const MAX_PASSES = 10;

// How many times the passes go over what a `default:` or `or:` stand-in brought in (#235).
const MAX_FALLBACK_ROUNDS = 3;

/*
 * What the card hands substitution beyond the variables (#227): the dashboard's item
 * templates - a `decluttering_templates:` entry with an `item:` body rather than a card -
 * for `with:` and `repeat:` to fill in by name, and the context a `repeat:` over a registry
 * source reads, as a card's `for_each_from:` does.
 */
export interface BuildExtras {
  itemTemplates?: Record<string, TemplateConfig>;
  context?: SourceContext;
  /*
   * The variables whose values are Home Assistant's rather than the author's - a registry
   * copy's name, area and the rest - so a style can shield them as it shields what a
   * resolver brings in (review 2026-10-25).
   */
  haNames?: Set<string>;
  /*
   * How much the substituted text may still grow, shared by every fill a build makes: a
   * `repeat:` inside a `repeat:` otherwise did all its work against a fresh ceiling of its
   * own before the outer one threw the result away (review 2026-10-25).
   */
  budget?: { left: number; fills: number };
  // How many values deep a condition or a step is reading, and the names it gave up on
  // past MAX_CONDITION_DEPTH, shared by every read of one build so the build can say so (#235).
  readDepth?: number;
  tooDeep?: Set<string>;
}

/*
 * How many bodies a build may fill in altogether, across every `with:` and `repeat:` at every
 * level. The size ceiling stops the text growing, but a `repeat:` inside a `repeat:` over a
 * long list does its work before anything measures the result - two hundred copies of two
 * hundred copies is forty thousand builds for a card nobody could read (review 2026-10-25).
 */
const MAX_FILLS = 2000;

// How far a `with:` or `repeat:` may nest inside another before it is refused - a body that
// fills itself in would otherwise never settle.
const MAX_EXPAND_DEPTH = 6;

/*
 * A list a `repeat:` built, wrapped so that the pass at the end can splice it into the list
 * it sits in rather than leaving a list inside a list - `cameras:` can then mix fixed
 * entries with repeated ones. A whole value that is not in a list is unwrapped to the list
 * itself. The key is only ever written here and read here, on the same build.
 */
const SPLICE_KEY = '__dcp_splice__';

/** What a structural step produced, or why it would not. */
type Expansion = { value: unknown; splice?: boolean } | { refused: string };

function isSplice(node: any): boolean {
  return (
    !!node &&
    typeof node === 'object' &&
    !Array.isArray(node) &&
    Object.prototype.hasOwnProperty.call(node, SPLICE_KEY) &&
    Array.isArray(node[SPLICE_KEY])
  );
}

/** Every spliced list put into the list it sits in, or unwrapped where it stands alone. */
function unsplice(node: any): any {
  if (Array.isArray(node)) {
    const out: any[] = [];
    for (const each of node) {
      if (isSplice(each)) out.push(...each[SPLICE_KEY].map(unsplice));
      else out.push(unsplice(each));
    }
    return out;
  }
  if (node && typeof node === 'object') {
    if (isSplice(node)) return node[SPLICE_KEY].map(unsplice);
    const out: Record<string, any> = Object.create(null);
    for (const [key, value] of Object.entries(node)) out[key] = unsplice(value);
    return out;
  }
  return node;
}

/*
 * One item of a list to repeat over, as the mapping of variables its copy is given. A
 * mapping is its own variables, as in a `for_each`. A plain value is `item`, and an entity
 * id is `entity` as well, so a list of ids reads the way a registry repeat does.
 */
function scalarAsItem(item: unknown): unknown {
  if (item && typeof item === 'object') return item;
  const entityLike = typeof item === 'string' && /^[a-z_]+\.[a-z0-9_]+$/.test(item);
  return entityLike ? { item, entity: item } : { item };
}

// A ceiling on the substituted text, so a chain of variables that each expand into two of
// the next - `v0: "[[v1]][[v1]]"`, `v1: "[[v2]][[v2]]"`, ... - cannot double its way to a
// gigabyte and take the browser tab with it. The whole expansion happens within a single
// pass, so the guard is inside substitutePass rather than around it: once the text passes
// the ceiling, the remaining variables are left unsubstituted and the placeholders that
// stay are reported like any others. A megabyte, or fifty times the original config,
// whichever is larger - far past anything a real template produces.
const MAX_OUTPUT_LENGTH = 1_000_000;
function outputLimit(originalLength: number): number {
  return Math.max(MAX_OUTPUT_LENGTH, originalLength * 50);
}

// Substitution is string surgery on JSON text, so anything inserted into a JSON string
// has to be escaped for one. Without this a value containing a newline, a double quote
// or a backslash produces invalid JSON and the card dies with "Bad control character"
// or "Unexpected token" from JSON.parse - which is what happens to multi-line values
// and to Jinja templates written with a YAML block scalar.
function escapeForJsonString(value: string): string {
  const quoted = JSON.stringify(value);
  return quoted.slice(1, quoted.length - 1);
}

// A placeholder standing as the whole JSON value takes the place of its quotes too, so it
// can become any JSON. A string is the exception: it is left for the pass below to put
// inside the quotes that are already there.
function asWholeValue(value: any, match: string): string {
  // `typeof null` is 'object', and JSON.stringify(null) is 'null', which is what a bare
  // `"[[name]]"` should become - so null belongs here rather than with the strings.
  if (typeof value === 'object') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return match;
}

// Inside a longer string an object cannot be injected as JSON structure, so it goes in as
// its JSON text. That is what issue #83 asked for.
function asPartOfString(value: any): string {
  if (typeof value === 'object') return escapeForJsonString(JSON.stringify(value));
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return escapeForJsonString(String(value));
}

// A shaped whole value is a JSON string, unless its chain ends in `bool` - then it is the
// bare true or false, which is the only way a card's on/off option can be given one. Only
// exactly those two words go in bare: this is text being spliced into JSON, and anything
// else would be read as structure. A chain ending in arithmetic is the same with a number:
// it goes in bare only when what came out is written exactly as JSON writes a number.
function asShapedWholeValue(text: string, chain: string): string {
  if (yieldsBoolean(chain) && (text === 'true' || text === 'false')) return text;
  // A list is only ever the JSON applyTransform wrote for it, read back to be sure.
  if (yieldsList(chain)) return isJsonList(text) ? text : JSON.stringify(text);
  if (yieldsNumber(chain) && isJsonNumber(text)) return text;
  return JSON.stringify(text);
}

function isJsonList(text: string): boolean {
  if (!text.startsWith('[')) return false;
  try {
    return Array.isArray(JSON.parse(text));
  } catch {
    return false;
  }
}

/*
 * What a style does to text Home Assistant gives it. A name is written into a declaration's
 * value, and these are the characters that would let it end that declaration and start
 * another, escape its way to one, open a `url(` that sends the rest of the value somewhere,
 * or comment the rest of the sheet out. The brackets go too: this runs after the text had
 * its `[[` escaped, and a name of `[{[x]}]` losing its braces here would otherwise come out
 * the other side as a placeholder (review 2026-10-18). Nothing a colour, a size or a name
 * needs is among them.
 */
export function cssSafe(text: string): string {
  return text.replace(/[{}()[\];\\@"'/\u2060]/g, '');
}

/*
 * A card's `for_each_from:` filled in from its own variables and its template's, before it is
 * looked up - the same as a `repeat:` source is (#309). A source with no placeholders is
 * handed back as it was.
 */
export function fillSource(
  source: unknown,
  variables: VariablesConfig[] | undefined,
  templateConfig: TemplateConfig | undefined,
  hass?: any,
): unknown {
  if (!isRegistrySource(source) || !PLACEHOLDER.test(JSON.stringify(source))) return source;
  return deepReplace(variables, templateConfig ?? ({} as TemplateConfig), source, undefined, hass, true);
}

/*
 * Every escape written out, except inside a card that will substitute again: what is handed
 * to a nested decluttering card - its `variables:` - is read as template code by that card,
 * and an escape unwrapped here would be live there. A friendly name of `[[zz?]]` passed down
 * as a label would delete the key it lands in, one card further in (review 2026-10-18). The
 * nested card unwraps what reaches it when its own build is done.
 */
function unescapeOutsideConsumers(node: any): any {
  if (typeof node === 'string') return restoreHaText(unescapePlaceholders(node));
  if (Array.isArray(node)) return node.map(unescapeOutsideConsumers);
  if (!node || typeof node !== 'object') return node;
  if (CONSUMER_TYPES.includes(node.type)) return node;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node)) {
    out[restoreHaText(unescapePlaceholders(key))] = unescapeOutsideConsumers(value);
  }
  return out;
}

/*
 * The keys under which a card carries a stylesheet: card-mod's, button-card's, and the
 * `style:` card-mod used to read and a picture element still does. Text Home Assistant
 * supplies is shielded inside these the way it is in the template's own `style:`, so a name
 * cannot end a declaration and start its own (review 2026-10-25). The template's `style:` is
 * built by the card separately and does not pass through here.
 */
const STYLE_KEYS = ['card_mod', 'styles', 'style'];

function hasStyleKey(node: any): boolean {
  if (Array.isArray(node)) return node.some(hasStyleKey);
  if (!node || typeof node !== 'object') return false;
  return Object.keys(node).some((key) => STYLE_KEYS.includes(key) || hasStyleKey(node[key]));
}

/** How to describe a value that a transform cannot shape, in a sentence about it. */
function kindOf(value: unknown): string {
  return localize(Array.isArray(value) ? 'warn.kind_list' : 'warn.kind_mapping');
}

/*
 * For `debug: console`: what a placeholder became, read back out of the JSON text it was
 * turned into. One left as it was is not noted here - why it stayed is only known once every
 * pass is done, so the end of deepReplace says.
 */
function noted(trace: BuildTrace | undefined, placeholder: string, out: string, whole: boolean): string {
  if (!trace || trace.placeholders.has(placeholder)) return out;
  const unchanged = whole ? out === `"${placeholder}"` : out === placeholder;
  if (unchanged) return out;
  try {
    trace.placeholders.set(placeholder, JSON.parse(whole ? out : `"${out}"`));
  } catch {
    trace.placeholders.set(placeholder, out);
  }
  return out;
}

/*
 * Every site a placeholder can stand at, found by one expression: a quote before and one
 * after mean it is a whole value of its own, otherwise it is part of a longer string. The
 * chain grammar is the closed one from variables.ts, so a chain with a step nobody knows
 * matches nothing and the placeholder stays visible, exactly as before. Global, so it is
 * only ever used through String.replace, which resets lastIndex for itself.
 */
const SITE = new RegExp(SITE_SOURCE, 'g');

/** What one scan of the text finds at a site, as String.replace hands it over. */
type SiteMatch = [
  match: string,
  lead: string | undefined,
  name: string,
  chain: string | undefined,
  optional: string | undefined,
  trail: string | undefined,
];

function substitutePass(
  jsonConfig: string,
  variableArray: VariablesConfig[],
  refused: Map<string, Refusal>,
  read: (name: string) => unknown,
  values: Record<string, any>,
  hass?: any,
  limit?: number,
  trace?: BuildTrace,
  shield?: (text: string) => string,
  settle: (name: string) => unknown = (name) => values[name],
  // How a `with:` or `repeat:` chain is worked out (#227).
  expand?: (name: string, chain: string) => Expansion | undefined,
  // The text already split at its sites, when this is the first pass over a compiled template (idea 3).
  pieces?: Piece[],
  // The variables whose values are Home Assistant's, for the shield.
  haNames?: Set<string>,
  // What the text may still grow by, shared with every fill this build makes.
  budget?: { left: number },
): string {
  /*
   * One scan of the text, each placeholder looked up by name (idea 2). Building two regular
   * expressions per variable and scanning the whole text with each of them, as this used
   * to, cost a 15-variable template thirty scans a pass; a name is compared as a string, so
   * one with regex metacharacters in it needs no escaping either.
   */
  const byName = new Map<string, unknown>();
  for (const variable of variableArray) byName.set(Object.keys(variable)[0], Object.values(variable)[0]);
  // A ceiling on growth, checked inside each replacement: one variable whose value holds two
  // hundred placeholders grows the text two hundredfold in a single step, not twofold. Once
  // what has been added would pass the ceiling, the sites still to come are left as written.
  // With a budget, the room is the build's as a whole, shared with every fill it makes.
  if (budget && budget.left <= 0) return jsonConfig;
  let room = limit === undefined ? Infinity : limit - jsonConfig.length;
  const within = (match: string, out: string): string => {
    const growth = out.length - match.length;
    if (budget) {
      if (growth > budget.left) return match;
      budget.left -= growth;
      return out;
    }
    if (growth > room) return match;
    room -= growth;
    return out;
  };

  const site = (...found: SiteMatch): string => {
    const [match, lead, name, rawTransform, rawOptional, trail] = found;
    if (!byName.has(name)) return match;
    const value = byName.get(name);
    // A registry copy's value is Home Assistant's; a style shields it as it does a resolver's.
    const fromHa = !!haNames?.has(name);
    // The placeholder itself, without whichever quotes the scan took with it.
    const inner = match.slice(lead ? 1 : 0, trail ? -1 : undefined);
    const whole = !!lead && !!trail;

    // Every replacement goes through a function so that `$&`, `$1` and friends in a
    // variable's value are inserted literally rather than read as replacement patterns.
    // A transform shapes text, so it only applies to a scalar: slugging or uppercasing a
    // mapping's JSON garbles its keys, so the placeholder is left visible instead - the
    // same treatment an unrecognised transform gets.
    // Every transform but a few shapes text and refuses anything else. `json` wants the
    // mapping itself, `bool` asks whether there is anything in it, and the list steps read
    // a list as one - so a chain starting with any of those is allowed through.
    const isScalar = value === null || typeof value !== 'object';
    const transformable = (transform?: string): boolean =>
      isScalar || takesStructure((transform ?? '').split('|')[0], value);
    // A placeholder left visible is the deliberate signal that something is wrong, but on
    // its own it does not say what - so each refusal is noted, to be reported once at the
    // end rather than on every pass over the same text.
    const refuse = (match: string, transform: string, why?: string, reason: RefusalReason = 'shape'): string => {
      refused.set(`${name}|${transform}`, { text: why ?? kindOf(value), reason });
      return match;
    };

    /*
     * A chain can ask Home Assistant for something it does not have - an entity that is
     * not there, an attribute it does not carry - and there is no sensible value to put
     * in its place, so the placeholder stays visible and says why, exactly as a transform
     * refusing a mapping does.
     */
    const shaped = (match: string, transform: string, wrap: (text: string) => string, written = transform): string => {
      /*
       * Asked first, before a `default:` further along can paper over it: a state the card
       * does not rebuild on would be right once and then never change, which is worse than
       * the brackets staying until the entity is listed.
       */
      /*
       * A value built from other placeholders - `light.[[room|slug]]` - is shaped as it will
       * end up, not as written: a resolver asked about the text with the brackets still in
       * it finds no such entity, and `exists` says no.
       */
      const input = typeof value === 'string' && PLACEHOLDER.test(value) ? settle(name) : value;
      const unlisted = unlistedState(transform, input, hass, values, read);
      if (unlisted !== undefined) {
        return refuse(match, written, localize('warn.state_unlisted', { entity: unlisted }), 'unlisted');
      }
      const text = applyTransform(transform, input, hass, values, read, shield, fromHa);
      if (text !== undefined) return wrap(text);
      // A gap that an `or:` could not fill is still just a gap - nothing gives it a value -
      // so it is left to be reported as unset rather than blamed on Home Assistant.
      if (gap && transform.split('|').some(isFallback)) return match;
      /*
       * A `map:` with no pair for the value gives nothing too, and that is not Home
       * Assistant's doing. Which step gave up is found by running the chain a step at a
       * time - only on this path, where the placeholder is already being left.
       */
      const steps = transform.split('|');
      for (let upTo = 1; upTo <= steps.length; upTo += 1) {
        if (applyTransform(steps.slice(0, upTo).join('|'), input, hass, values, read, shield, fromHa) !== undefined) {
          continue;
        }
        if (stepName(steps[upTo - 1]) !== MAP_STEP) break;
        const before =
          upTo === 1 ? input : applyTransform(steps.slice(0, upTo - 1).join('|'), input, hass, values, read);
        return refuse(match, written, localize('warn.no_map_match', { value: before }), 'map');
      }
      return refuse(match, written, localize('warn.nothing_for', { value }), 'missing');
    };

    /*
     * An optional placeholder given nothing to say is left exactly as it was written, so
     * that the pass at the end can take the whole option out. Empty means unset, null or
     * the empty string - a zero and a false are values, and stay.
     */
    const gap = value === undefined || value === null || value === '';
    const emptyOptional = (optional?: string): boolean => !!optional && gap;

    /*
     * A transform argument runs to the closing brackets, so it swallows a trailing `?`
     * that was meant as the optional marker - and the pruning pass reads that `?` as the
     * marker regardless. One reading has to win, and it is the marker's: `?` against the
     * brackets means optional, everywhere.
     */
    const marked = (transform?: string, optional?: string): [string | undefined, string | undefined] =>
      !optional && transform?.endsWith(OPTIONAL) ? [transform.slice(0, -1), OPTIONAL] : [transform, optional];

    /*
     * An `if:` that does not hold makes the value a gap, read exactly as an unset variable
     * is: an optional placeholder is left for the pruning pass to take out, a `default:`
     * or `or:` further along still supplies its stand-in, and anything else stays visible -
     * saying why, because the variable is set and the brackets alone would suggest not.
     */
    const closed = (match: string, chain: string, optional: string | undefined, whole: boolean): string => {
      if (optional) return match;
      const text = applyTransform(chain, undefined, hass, values, read, shield);
      if (text === undefined) return refuse(match, chain, localize('warn.condition_closed'), 'closed');
      return whole ? asShapedWholeValue(text, chain) : escapeForJsonString(text);
    };

    const substitute = (
      match: string,
      rawTransform: string | undefined,
      rawOptional: string | undefined,
      whole: boolean,
    ) => {
      const [written, optional] = marked(rawTransform, rawOptional);
      if (emptyOptional(optional)) return match;
      // A condition decides whether there is a value at all, and once it holds it has
      // nothing more to say - so it comes out of the chain, and a mapping gated by nothing
      // but conditions goes in whole like any other.
      let transform = written;
      if (written && hasCondition(written)) {
        if (!gateOpen(written, read)) return closed(match, written, optional, whole);
        transform = withoutConditions(written);
      }
      // A mapping or list is a value, so a `default:` or `or:` before anything else has
      // nothing to fill and comes off: `[[room|default:x]]` is the room, as `[[room]]` is.
      if (transform && !isScalar) {
        const steps = transform.split('|');
        while (steps.length && isFallback(steps[0])) steps.shift();
        transform = steps.join('|');
      }
      if (!transform) {
        const plain = fromHa && shield && typeof value === 'string' ? shield(value) : value;
        return whole ? asWholeValue(plain, match) : asPartOfString(plain);
      }
      // `with:` and `repeat:` build their answer from the variables rather than shaping
      // text, so they are settled here, before the chain machinery would refuse a mapping.
      if (expand && isStructureStep(transform.split('|')[0])) {
        const outcome = expand(name, transform);
        if (outcome === undefined) return match;
        if ('refused' in outcome) return refuse(match, written as string, outcome.refused, 'structure');
        const out = outcome.value === undefined ? null : outcome.value;
        // A fill that came out as nothing - its body an option that dropped - is a gap like
        // any other, so `[[row|with:...?]]` leaves its list rather than putting "" in (#235).
        if (optional && (out === null || out === '')) return match;
        if (!whole) return asPartOfString(out);
        return JSON.stringify(outcome.splice ? { [SPLICE_KEY]: out } : out);
      }
      const chain = transform;
      // `json` reads the variable's own value, so anywhere but first it has nothing to
      // work on - and without this it would be blamed on Home Assistant.
      if (chain.split('|').includes(FLAT_STEP)) {
        return refuse(match, written as string, localize('warn.flat_after_repeat'), 'shape');
      }
      if (chain.split('|').lastIndexOf(JSON_STEP) > 0) {
        return refuse(match, written as string, localize('warn.json_not_first'), 'json');
      }
      if (!transformable(chain)) return refuse(match, written as string);
      return shaped(
        match,
        chain,
        whole ? (text) => asShapedWholeValue(text, chain) : escapeForJsonString,
        written as string,
      );
    };

    /*
     * A whole value first - a mapping, a number, a yes or a no goes in bare - and when that
     * leaves it as written (a plain text value, or nothing to put there) the same site is
     * read as part of a string, inside its quotes, as the second expression used to.
     */
    if (whole) {
      const out = substitute(match, rawTransform, rawOptional, true);
      if (out !== match) return within(match, noted(trace, inner, out, true));
    }
    const part = substitute(inner, rawTransform, rawOptional, false);
    if (part === inner) return match;
    return within(match, `${lead ?? ''}${noted(trace, inner, part, false)}${trail ?? ''}`);
  };

  if (pieces) {
    // Already split: no scan at all, only the sites to fill.
    let out = '';
    for (const piece of pieces) {
      out +=
        typeof piece === 'string'
          ? piece
          : site(piece.text, piece.lead, piece.name, piece.chain, piece.optional, piece.trail);
    }
    return out;
  }
  return jsonConfig.replace(SITE, (...found) => site(...(found.slice(0, 6) as SiteMatch)));
}

/*
 * The placeholders still standing once substitution has done all it can, which are the
 * ones no variable defines. An escaped `[[!name]]` is not one of them - it is meant to be
 * there - and neither is a placeholder a transform deliberately refused, which says so
 * for itself in a message of its own.
 */
function unresolvedPlaceholders(json: string, refused: Map<string, Refusal>): string[] {
  const names = new Set<string>();
  const everyPlaceholder = new RegExp(PLACEHOLDER.source, 'g');
  let match = everyPlaceholder.exec(json);
  while (match) {
    const inside = match[1];
    // An optional one having no value is the point of it, not a mistake worth reporting.
    const reported = !inside.startsWith(ESCAPE) && !refused.has(inside) && !isOptional(inside);
    if (reported && !insideButtonCardJs(json, match.index)) names.add(inside);
    match = everyPlaceholder.exec(json);
  }
  return [...names];
}

/** Whether this text is nothing but one optional placeholder that found no value. */
function isEmptyOption(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const match = new RegExp(`^${PLACEHOLDER.source}$`).exec(value);
  return !!match && !match[1].startsWith(ESCAPE) && isOptional(match[1]);
}

/*
 * Taking the empty options out. An option that is only an unresolved optional placeholder
 * goes altogether - the key with it, so the card is configured as though it had never been
 * written - and one sitting inside a longer piece of text just leaves quietly.
 *
 * Done on the parsed config rather than on its JSON text, because removing a key from JSON
 * by hand means getting its commas right, and getting them wrong means a card that will
 * not parse at all.
 *
 * A block left with nothing in it once its options have gone goes too, and so on upward:
 * `features: [{ type: '[[light_type?]]' }]` with no `light_type` loses the `type`, then the
 * item that only held it, then `features` itself - which is the only way to make a whole
 * block depend on one variable (discussion #141). A block that was written empty, a `[]`
 * or `{}` in the template, never had an option in it and is left exactly as it was.
 */
const GONE = Symbol('gone');

function pruneBlock(value: any, path = '', dropped?: string[]): any {
  if (isEmptyOption(value)) {
    dropped?.push(localize('trace.dropped_option', { path: path || '/', placeholder: value }));
    return GONE;
  }
  if (Array.isArray(value)) {
    if (!value.length) return value;
    // A dropped item leaves no hole: a list of cards with one missing is a shorter list,
    // not a list with a gap in it.
    const kept = value
      .map((item, index) => pruneBlock(item, `${path}[${index}]`, dropped))
      .filter((item) => item !== GONE);
    if (kept.length) return kept;
    if (path) dropped?.push(localize('trace.dropped_block', { path }));
    return GONE;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    // Rebuilt without a prototype so that a config key of `__proto__` sets a plain own
    // property here rather than reparenting the object it is copied into. The card is parsed
    // straight back from this with JSON, which does not care whether the object has a
    // prototype, so nothing downstream is affected.
    const out: Record<string, any> = Object.create(null);
    if (!entries.length) return out;
    for (const [key, entry] of entries) {
      const pruned = pruneBlock(entry, path ? `${path}.${key}` : key, dropped);
      if (pruned !== GONE) out[key] = pruned;
    }
    if (Object.keys(out).length) return out;
    if (path) dropped?.push(localize('trace.dropped_block', { path }));
    return GONE;
  }
  return pruneEmptyOptions(value);
}

function pruneEmptyOptions(value: any, dropped?: string[]): any {
  if (Array.isArray(value) || (value && typeof value === 'object')) {
    // The card itself is never taken away, however little is left of it: an empty one is
    // still the card that was asked for, and says so more clearly than nothing at all.
    const pruned = pruneBlock(value, '', dropped);
    if (pruned !== GONE) return pruned;
    return Array.isArray(value) ? [] : Object.create(null);
  }
  if (typeof value === 'string') {
    const anyOptional = new RegExp(PLACEHOLDER.source, 'g');
    return value.replace(anyOptional, (match, inside: string) =>
      !inside.startsWith(ESCAPE) && isOptional(inside) ? '' : match,
    );
  }
  return value;
}

/*
 * Placeholders that say what to do when nothing sets them. Ordinary substitution only ever
 * looks at variables that exist, so `[[room|default:Somewhere]]` with no `room` anywhere is
 * never even reached by it - this pass is what gives those their turn, once everything that
 * could be substituted has been.
 */
function fallbackPass(
  jsonConfig: string,
  values: Record<string, any>,
  read: (name: string) => unknown,
  hass?: any,
  trace?: BuildTrace,
  shield?: (text: string) => string,
): string {
  // An empty stand-in is still a gap, so an optional placeholder that ends up with one is
  // left for the pruning pass to take out - `[[name|default:?]]` drops the key, as
  // `[[name?]]` would (discussion #155).
  const standIn = (inside: string): string | undefined => {
    // A state the card does not rebuild on keeps its brackets here too, a `default:` or
    // not. Unset, the name is the entity - `[[sensor.x|state|default:off]]`.
    const [name, ...steps] = withoutOptional(inside).split('|');
    if (steps.includes(STATE_STEP) && unlistedState(steps.join('|'), values[name] ?? name, hass, values, read)) {
      return undefined;
    }
    const text = resolveFallback(inside, values, hass, read, shield);
    return text === '' && isOptional(inside) ? undefined : text;
  };
  let json = jsonConfig;
  // The whole value first, so a stand-in replaces the quotes around it too rather than
  // landing inside them twice.
  json = json.replace(/"\[\[([^[\]]+)\]\]"/g, (match: string, inside: string) => {
    const text = standIn(inside);
    if (text === undefined) return match;
    return noted(
      trace,
      `[[${inside}]]`,
      asShapedWholeValue(text, withoutOptional(inside).split('|').slice(1).join('|')),
      true,
    );
  });
  return json.replace(/\[\[([^[\]]+)\]\]/g, (match: string, inside: string) => {
    const text = standIn(inside);
    return text === undefined ? match : noted(trace, match, escapeForJsonString(text), false);
  });
}

/** Whether anything here says what to do when nothing sets it. */
function hasFallback(jsonConfig: string): boolean {
  const pattern = /\[\[([^[\]]+)\]\]/g;
  let match = pattern.exec(jsonConfig);
  while (match !== null) {
    if (withoutOptional(match[1]).split('|').slice(1).some(answersUnset)) return true;
    match = pattern.exec(jsonConfig);
  }
  return false;
}

/*
 * The placeholders still standing once every pass is done, and why: an optional one found
 * nothing and is about to be taken out, a refused one says what refused it, and anything else
 * is a name nothing sets. Escaped ones are meant to be there, so they are not mentioned.
 */
function noteLeftStanding(trace: BuildTrace, json: string, refused: Map<string, Refusal>): void {
  const everyPlaceholder = new RegExp(PLACEHOLDER.source, 'g');
  let match = everyPlaceholder.exec(json);
  while (match) {
    const placeholder = match[0];
    const inside = match[1];
    if (!inside.startsWith(ESCAPE) && !trace.placeholders.has(placeholder) && !insideButtonCardJs(json, match.index)) {
      const refusal = refused.get(inside) ?? refused.get(withoutOptional(inside));
      const why = refusal
        ? localize('trace.left_refused', { why: refusal.text })
        : localize(isOptional(inside) ? 'trace.left_empty' : 'trace.left_unset');
      trace.placeholders.set(placeholder, why);
    }
    match = everyPlaceholder.exec(json);
  }
}

/*
 * A variable whose value is a fill - `thing: '[[camera_entry|with:entity=camera.front]]'` -
 * also offers the item template's own values, as they ended up for that fill:
 * `[[thing.ent_exists]]`, or `if:thing.ent_exists`. The fill does its working out and the
 * caller decides what to do with it (#235). Only the names something here asks for are
 * worked out, each with the item template's body swapped for that one value.
 */
const FILL_VALUE = /^\[\[([A-Za-z0-9_-]+)\|with:(.*)\]\]$/;
const DOTTED_ASK = /(?:\[\[!?|\|(?:if:!?|or:))([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)/g;

function exposeFillValues(
  variableArray: VariablesConfig[],
  content: unknown,
  itemTemplates: Record<string, TemplateConfig>,
  build: (variables: VariablesConfig[], template: TemplateConfig, key: string) => unknown,
  // The with: arguments filled in here first, as the pass that fills the fill would have.
  settleText: (text: string) => unknown,
): void {
  if (!Object.keys(itemTemplates).length) return;
  const values = variableValues(variableArray);
  const text = JSON.stringify([content, variableArray]);
  if (typeof text !== 'string' || !text.includes('.')) return;
  const asked = new Set<string>();
  for (let match = DOTTED_ASK.exec(text); match !== null; match = DOTTED_ASK.exec(text)) {
    asked.add(`${match[1]}.${match[2]}`);
  }
  DOTTED_ASK.lastIndex = 0;
  for (const dotted of asked) {
    if (Object.prototype.hasOwnProperty.call(values, dotted)) continue;
    const [name, key] = dotted.split('.');
    const raw = values[name];
    const fill = typeof raw === 'string' ? FILL_VALUE.exec(raw) : null;
    if (!fill || !Object.prototype.hasOwnProperty.call(itemTemplates, fill[1])) continue;
    const arg = fill[2].includes('[[') ? settleText(fill[2]) : fill[2];
    if (typeof arg !== 'string' || arg.includes('[[')) continue;
    const overlay = fillOverlay(arg, values);
    if (!overlay) continue;
    const value = build([...overlay, ...variableArray], itemTemplates[fill[1]], key);
    // Nothing in the fill sets it: left alone, so it reads as unset like any other name.
    if (value === undefined || value === `[[${key}]]`) continue;
    variableArray.push({ [dotted]: value });
  }
}

// The values a `with:` lays over, read the same way as where it is filled in.
function fillOverlay(arg: string, values: Record<string, any>): VariablesConfig[] | undefined {
  if (!arg) return [];
  if (arg.includes('=')) {
    const pairs: VariablesConfig[] = [];
    for (const pair of arg.split(',')) {
      const equals = pair.indexOf('=');
      if (equals === -1) return undefined;
      pairs.push({ [pair.slice(0, equals).trim()]: pair.slice(equals + 1) });
    }
    return pairs;
  }
  const mapping = values[arg];
  return mapping && typeof mapping === 'object' && !Array.isArray(mapping) ? normaliseVariables(mapping) : undefined;
}

function deepReplace(
  variables: VariablesConfig[] | undefined,
  templateConfig: TemplateConfig,
  content: any,
  templateName?: string,
  hass?: any,
  // true says nothing in the console. A set says each thing once: what has been said is
  // kept in it, so a card building again - on every change of what it rebuilds on - does
  // not repeat itself.
  quiet?: boolean | Set<string>,
  onUnresolved?: (names: string[]) => void,
  depth = 0,
  trace?: BuildTrace,
  // What to do to text Home Assistant supplies before it goes in; a style passes cssSafe.
  shield?: (text: string) => string,
  // Leave every escape in place: the output is itself going to be substituted, as the
  // variables handed down to a nested card are.
  keepEscapes = false,
  // The item templates and registry context `with:` and `repeat:` read (#227).
  extras?: BuildExtras,
  // For a fill being traced, the names whose values `debug:` shows as they ended up (#235).
  noteValues?: string[],
): any {
  if (content === undefined) return content;
  // What the console is told is also noted on the trace, for `debug: report` (#207) -
  // once per build, so a card building again still has the warning in its report even
  // when the set it keeps has heard it before.
  const say = (message: string, kind: WarningKind = 'other'): void => {
    if (quiet === true) return;
    trace?.warnings.push(message);
    if (quiet instanceof Set) {
      if (quiet.has(message)) return;
      quiet.add(message);
    }
    warn({ kind, message, template: templateName, expansion: trace?.expansion });
  };
  const variableArray = resolveVariables(variables, templateConfig);
  /*
   * An entity the card rebuilds on can be written straight into a placeholder -
   * `[[input_select.layout|state]]` - with no variable to carry it. It stands for itself,
   * after everything the card and template set, so a variable of the same name still wins.
   */
  for (const entity of stateScope(hass)) {
    if (!variableArray.some((entry) => Object.keys(entry)[0] === entity)) variableArray.push({ [entity]: entity });
  }
  /*
   * An item template stands as a variable too, its body as the value, so
   * `[[camera_entry|with:...]]` is reached by the same pass as any placeholder - and a bare
   * `[[camera_entry]]` is the body filled in with nothing but the card's own variables.
   * A variable of the same name wins, as it does over an entity.
   */
  const itemTemplates = extras?.itemTemplates ?? {};
  for (const [name, template] of Object.entries(itemTemplates)) {
    if (!variableArray.some((entry) => Object.keys(entry)[0] === name)) {
      variableArray.push({ [name]: (template as any)?.item });
    }
  }
  exposeFillValues(
    variableArray,
    content,
    itemTemplates,
    (vars, template, key) =>
      depth >= MAX_EXPAND_DEPTH
        ? undefined
        : deepReplace(
            vars,
            template,
            `[[${key}]]`,
            templateName,
            hass,
            true,
            undefined,
            depth + 1,
            undefined,
            shield,
            true,
            {
              ...extras,
              tooDeep: extras?.tooDeep,
            },
          ),
    (text) =>
      deepReplace(variableArray, {}, text, templateName, hass, true, undefined, depth + 1, undefined, shield, true),
  );
  const values = variableValues(variableArray);

  /*
   * `with:` and `repeat:` (#227) fill a body in again with values of their own: the same
   * block of config used twice with different entities, or once per thing a list or the
   * registry holds, inside a card's own list - a camera card's `cameras:` - where a nested
   * card cannot go. The body is an item template's `item:`, with the template itself for
   * its `default:` and `let:`, or a plain mapping variable's value.
   */
  const bodyOf = (name: unknown): { body: unknown; template: TemplateConfig } | undefined => {
    if (typeof name !== 'string' || !name) return undefined;
    const template = Object.prototype.hasOwnProperty.call(itemTemplates, name) ? itemTemplates[name] : undefined;
    if (template && typeof template === 'object' && 'item' in template) {
      return { body: (template as any).item, template };
    }
    if (Object.prototype.hasOwnProperty.call(values, name))
      return { body: values[name], template: {} as TemplateConfig };
    return undefined;
  };
  // The body filled in once: these values first, then everything the card already has -
  // which includes the dashboard's shared values - and the item template's own defaults
  // under both, as any template's are.
  const fill = (
    found: { body: unknown; template: TemplateConfig },
    own: VariablesConfig[],
    // The names among `own` whose values are Home Assistant's, when the copy is a registry's.
    fromHa?: Set<string>,
    // What filled it in, and which copy, when this build is traced.
    from?: { placeholder: string; copy?: { number: number; count: number } },
  ): unknown => {
    budget.fills += 1;
    let itemTrace: BuildTrace | undefined;
    let names: string[] | undefined;
    if (trace && from) {
      itemTrace = { placeholders: new Map(), dropped: [], warnings: [] };
      names = [
        ...new Set([
          ...own.map((entry) => Object.keys(entry)[0]),
          ...resolveVariables([], found.template).map((entry) => Object.keys(entry)[0]),
        ]),
      ].filter((name) => name !== undefined && !name.includes('.'));
      (trace.items ??= []).push({ ...from, trace: itemTrace });
    }
    return deepReplace(
      [...own, ...variableArray],
      found.template,
      found.body,
      templateName,
      hass,
      quiet,
      onUnresolved,
      depth + 1,
      itemTrace,
      shield,
      keepEscapes,
      { ...extras, budget, tooDeep, haNames: fromHa ? new Set([...(haNames ?? []), ...fromHa]) : haNames },
      names,
    );
  };
  // The list a `repeat:` runs over: a list variable, or what a registry source finds - the
  // second being Home Assistant's words, which a style shields.
  const itemsOf = (name: string): { items: unknown[]; fromHa: boolean } | undefined => {
    const source = values[name];
    if (Array.isArray(source)) return { items: source, fromHa: false };
    if (isRegistrySource(source)) {
      return { items: resolveRegistryItems(hass, filledSource(name, source), extras?.context), fromHa: true };
    }
    return undefined;
  };
  /*
   * A registry source is filled in from the variables before it is looked up, so a filter
   * can be built from them - `entities: binary_sensor.[[name]]_*` - and a repeat inside
   * another repeat's copy can filter by that copy's values (#309).
   */
  const filledSource = (name: string, source: unknown): unknown => {
    const below = deeper(name, JSON.stringify(source));
    if (!below) return source;
    return deepReplace(
      variableArray,
      {},
      source,
      templateName,
      hass,
      true,
      undefined,
      depth,
      undefined,
      undefined,
      false,
      below,
    );
  };
  // What a `with:` lays over the variables: `a=1,b=2` pairs read as text, or a mapping variable.
  const overlayOf = (arg: string): VariablesConfig[] | undefined => {
    if (!arg) return [];
    if (arg.includes('=')) {
      const pairs: VariablesConfig[] = [];
      for (const pair of arg.split(',')) {
        const equals = pair.indexOf('=');
        if (equals === -1) return undefined;
        pairs.push({ [pair.slice(0, equals).trim()]: pair.slice(equals + 1) });
      }
      return pairs;
    }
    const mapping = values[arg];
    if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) return undefined;
    /*
     * An entry that names itself - `ent_exists: '[[ent_exists]]'` - can only mean the value
     * out here: inside the fill it would be its own value, and never settle. So it is filled
     * in from these variables first (#235).
     */
    return normaliseVariables(mapping).map((entry) => {
      const [name, value] = Object.entries(entry)[0] ?? [];
      if (typeof value !== 'string' || !value.includes(`[[${name}`)) return entry;
      const below = deeper(name, value);
      if (!below) return entry;
      return {
        [name]: deepReplace(
          variableArray,
          {},
          value,
          templateName,
          hass,
          true,
          undefined,
          depth,
          undefined,
          shield,
          true,
          below,
        ),
      };
    });
  };
  // One copy per item, each given its item's values and its place, as a `for_each` copy is.
  const repeatOver = (
    found: { body: unknown; template: TemplateConfig },
    items: unknown[],
    fromHa: boolean,
    placeholder: string,
  ) =>
    items.map((item, index) => {
      const own = scalarAsItem(item);
      return fill(
        found,
        forEachVariables(own, undefined, index, items.length),
        fromHa ? new Set(Object.keys(own as object)) : undefined,
        { placeholder, copy: { number: index + 1, count: items.length } },
      );
    });
  // Each placeholder is expanded once per build: the variables do not change between
  // passes, and a body that refers to itself would otherwise be filled in again on every
  // pass of every level - ten to the power of the depth, which hangs the tab.
  const expansions = new Map<string, Expansion | undefined>();
  const expand = (name: string, chain: string): Expansion | undefined => {
    const key = `${name}|${chain}`;
    if (expansions.has(key)) return expansions.get(key);
    const outcome = ((): Expansion | undefined => {
      const [step, ...rest] = chain.split('|');
      const flat = rest.length === 1 && rest[0] === FLAT_STEP;
      if (flat && stepName(step) !== REPEAT_STEP) return { refused: localize('warn.flat_after_repeat') };
      if (rest.length && !flat) return { refused: localize('warn.step_not_alone', { step: `${stepName(step)}:` }) };
      if (depth >= MAX_EXPAND_DEPTH) return { refused: localize('warn.fills_itself', { name }) };
      const found = bodyOf(name);
      if (!found) return undefined;
      const kind = stepName(step);
      const arg = step.slice(kind.length + 1);
      if (kind === REPEAT_STEP) {
        /*
         * Inside a copy, a list its item does not have - `zones:` on one detection but not the
         * next - is no copies rather than a placeholder left in the list (#311). At the card's
         * own level a missing name is still a mistake worth showing.
         */
        if (arg && depth > 0 && values[arg] === undefined) {
          trace?.dropped.push(localize('trace.repeat_missing', { placeholder: `[[${key}]]`, arg }));
          return { value: [], splice: true };
        }
        const listed = itemsOf(arg);
        if (!listed) return { refused: localize('warn.not_a_list_source', { arg: arg || '""' }) };
        if (budget.fills + listed.items.length > MAX_FILLS) {
          return { refused: localize('warn.too_many_fills', { max: MAX_FILLS }) };
        }
        // A copy whose body dropped out - an item template gated on its own `if:...?` - leaves
        // the list rather than putting "" in its place, so a repeat can decide copy by copy (#235).
        const kept = (copy: unknown) => copy !== undefined && copy !== null && copy !== '';
        const copies = repeatOver(found, listed.items, listed.fromHa, `[[${key}]]`).filter(kept);
        // `|flat` lays a copy that is a list out in the outer list, one level deep (#311).
        if (flat) {
          const laid: unknown[] = [];
          for (const copy of copies) {
            if (Array.isArray(copy)) laid.push(...copy.filter(kept));
            else laid.push(copy);
          }
          return { value: laid, splice: true };
        }
        return { value: copies, splice: true };
      }
      if (budget.fills >= MAX_FILLS) return { refused: localize('warn.too_many_fills', { max: MAX_FILLS }) };
      const overlay = overlayOf(arg);
      if (!overlay) return { refused: localize('warn.not_a_mapping', { arg }) };
      const value = fill(found, overlay, undefined, { placeholder: `[[${key}]]` });
      // A body still carrying a structural placeholder of its own name is one that fills
      // itself in: refused here, so every level says so rather than inserting another copy
      // of it on every pass until the size ceiling stops it.
      if (JSON.stringify(value)?.includes(`[[${name}|`)) return { refused: localize('warn.fills_itself', { name }) };
      return { value };
    })();
    expansions.set(key, outcome);
    return outcome;
  };

  // The template's content is the same object on every build, so its text and the sites in
  // it come from the compiled form (idea 3); anything else - a value, a style string - is
  // stringified here as it always was.
  const built = content && typeof content === 'object' ? compile(content) : undefined;
  let jsonConfig = built ? built.json : JSON.stringify(content);
  let pieces = built?.pieces;
  const haNames = extras?.haNames;
  // How much the text may still grow, counted across every fill this build makes.
  const limit = outputLimit(jsonConfig.length);
  const budget = extras?.budget ?? { left: limit - jsonConfig.length, fills: 0 };

  /*
   * A stylesheet inside the card - card-mod's, button-card's - is built first, with the shield
   * on, and put back for the pass over the rest to find already written. Escapes and markers
   * stay in until the end like everything else's; a nested template card inside is left for
   * its own build. A build that is itself a style has the shield already and skips this.
   */
  const shieldStyles = (node: any): any => {
    if (Array.isArray(node)) return node.map(shieldStyles);
    if (!node || typeof node !== 'object') return node;
    if (CONSUMER_TYPES.includes(node.type)) return node;
    const out: Record<string, any> = {};
    for (const [key, value] of Object.entries(node)) {
      if (!STYLE_KEYS.includes(key)) {
        out[key] = shieldStyles(value);
        continue;
      }
      // Built inside a wrapper, so a style that is nothing but options nobody set is taken out
      // of the wrapper rather than left as an empty string - and is then put back as written
      // here, for the pass over the whole card to take out along with whatever held it.
      const styled = deepReplace(
        variables,
        templateConfig,
        { style: value },
        templateName,
        hass,
        true,
        undefined,
        depth,
        trace,
        cssSafe,
        true,
        { ...extras, budget },
      );
      out[key] = styled && typeof styled === 'object' && 'style' in styled ? styled.style : value;
    }
    return out;
  };
  if (shield === undefined && hasStyleKey(content)) {
    jsonConfig = JSON.stringify(shieldStyles(content));
    // The compiled sites belong to the text as written, not to this one.
    pieces = undefined;
  }

  // What an `if:` reads: a variable's value as it will end up, worked out once per name.
  const readDepth = extras?.readDepth ?? 0;
  const tooDeep = extras?.tooDeep ?? new Set<string>();
  // What a value read below this one is handed: one level further down, and the same note
  // of what was given up on.
  const deeper = (name: string, raw: unknown): BuildExtras | undefined => {
    if (typeof raw !== 'string' || !PLACEHOLDER.test(raw)) return undefined;
    if (readDepth >= MAX_CONDITION_DEPTH) {
      tooDeep.add(name);
      return undefined;
    }
    return { readDepth: readDepth + 1, tooDeep };
  };
  const settled = new Map<string, unknown>();
  const read = (name: string): unknown => {
    if (settled.has(name)) return settled.get(name);
    const raw = values[name];
    const below = deeper(name, raw);
    const value = below
      ? deepReplace(
          variableArray,
          {},
          raw,
          templateName,
          hass,
          true,
          undefined,
          depth,
          undefined,
          undefined,
          false,
          below,
        )
      : raw;
    settled.set(name, value);
    return value;
  };
  /*
   * What a transform reads: the same, but with every escape kept, so that text Home
   * Assistant supplied is still wearing its bang when a step shapes it and cannot turn
   * into a placeholder on the next pass. Quiet, because the card says what is wrong
   * about the outer placeholders itself.
   */
  const shapedInputs = new Map<string, unknown>();
  const settle = (name: string): unknown => {
    if (shapedInputs.has(name)) return shapedInputs.get(name);
    const raw = values[name];
    const below = deeper(name, raw);
    const value = below
      ? deepReplace(variableArray, {}, raw, templateName, hass, true, undefined, depth, undefined, shield, true, below)
      : raw;
    shapedInputs.set(name, value);
    return value;
  };
  // Each placeholder a transform refused, and what its value turned out to be.
  const refused = new Map<string, Refusal>();
  const substituteAll = (): void => {
    let passes = 0;
    while (PLACEHOLDER.test(jsonConfig) && passes < MAX_PASSES && budget.left > 0) {
      const before = jsonConfig;
      jsonConfig = substitutePass(
        jsonConfig,
        variableArray,
        refused,
        read,
        values,
        hass,
        limit,
        trace,
        shield,
        settle,
        expand,
        pieces,
        haNames,
        budget,
      );
      // The compiled sites describe the text as written, so only the very first pass can use
      // them: a later pass, or a round after a fallback brought text in, has to scan (#235).
      pieces = undefined;
      passes += 1;
      // Every remaining placeholder is one no variable defines, so further passes cannot help.
      if (jsonConfig === before) break;
      // A chain that keeps growing has been stopped mid-expansion; carrying on would only
      // grow it further, so give up here and let the placeholders left standing be reported.
      if (jsonConfig.length > limit || budget.left <= 0) {
        say(localize('warn.gave_up', { passes }));
        break;
      }
    }
    if (passes === MAX_PASSES && PLACEHOLDER.test(jsonConfig)) {
      say(localize('warn.gave_up', { passes: MAX_PASSES }));
    }
  };
  /*
   * Anything still saying `default:`, `or:` or `bool` gets its turn after the passes, whether
   * or not there were any variables to substitute in the first place. What it puts in can
   * carry placeholders of its own - `or:` hands over the other variable as it was written -
   * so the passes go over that again (#235). Inside a value a condition reads, nothing comes
   * after this build to finish them, and `exists` was asked about half an entity id.
   */
  let fallbacks = false;
  for (let round = 0; ; round += 1) {
    if (variableArray.length) substituteAll();
    if (!hasFallback(jsonConfig)) break;
    fallbacks = true;
    const before = jsonConfig;
    jsonConfig = fallbackPass(jsonConfig, values, read, hass, trace, shield);
    if (jsonConfig === before || !variableArray.length || round >= MAX_FALLBACK_ROUNDS) break;
    if (!PLACEHOLDER.test(jsonConfig) || budget.left <= 0) break;
  }

  if (variableArray.length && refused.size) {
    const each = [...refused].map(([placeholder, refusal]) => `[[${placeholder}]] (${refusal.text})`);
    // The ways a chain gives up read differently, so say whichever apply rather than a
    // sentence that only half fits.
    const reasons = new Set([...refused.values()].map((refusal) => refusal.reason));
    const why = [
      reasons.has('shape') ? localize('warn.refused_transform') : '',
      reasons.has('missing') ? localize('warn.refused_resolver') : '',
      reasons.has('closed') ? localize('warn.refused_condition') : '',
      reasons.has('json') ? localize('warn.refused_json') : '',
      reasons.has('unlisted') ? localize('warn.refused_unlisted') : '',
      reasons.has('map') ? localize('warn.refused_map') : '',
      // A `with:` or `repeat:` refusal already says in its own words what was wrong.
    ]
      .filter(Boolean)
      .join(' ');
    say(localize('warn.refused', { which: each.join(', '), why }).replace(/\s+$/, ''), 'refused');
  }

  // Said once, by the build that started the reading, however many fills and reads met it.
  if (!extras?.tooDeep && tooDeep.size) {
    say(localize('warn.read_too_deep', { names: [...tooDeep].join(', '), depth: MAX_CONDITION_DEPTH }));
  }
  if (trace) noteLeftStanding(trace, jsonConfig, refused);
  // A traced fill notes its values as they ended up, `exists` and `if:` answers and all.
  if (trace && noteValues) {
    trace.values = new Map();
    for (const name of noteValues) {
      if (Object.prototype.hasOwnProperty.call(values, name)) trace.values.set(name, read(name));
    }
  }

  /*
   * A variable nobody set renders as the literal `[[name]]` on the card. The editors
   * already say so while you are editing, but a dashboard that was saved with one missing
   * just shows the brackets and gives no clue where they came from - so say it here too,
   * where it is the running card talking rather than the editor.
   */
  const unresolved = unresolvedPlaceholders(jsonConfig, refused);
  /*
   * Reported here rather than worked out from the result, because by the time the result
   * exists an escaped `[[!name]]` has become the text `[[name]]` and is indistinguishable
   * from a variable nobody set. This is the only place that still knows the difference.
   */
  if (onUnresolved && unresolved.length) onUnresolved(unresolved);
  /*
   * `[[sensor.x|state]]` with nothing called sensor.x is an entity the card does not
   * rebuild on, rather than a variable somebody forgot - so it says that instead.
   */
  const asksState = (inside: string): boolean => withoutOptional(inside).split('|').slice(1).includes(STATE_STEP);
  const unlistedNames = unresolved.filter(asksState);
  if (unlistedNames.length) {
    const which = unlistedNames.map((name) => `[[${name}]]`).join(', ');
    say(localize('warn.state_unlisted_unset', { which }), 'state_unlisted');
  }
  /*
   * A chain with a word in it that is not a step never matches the placeholder grammar, so
   * it is left standing however set its variable is. When the variable does have a value -
   * or a `default:` or `or:` would give it one - the step is the thing to fix, and calling
   * the variable unset sends the author looking in the wrong place.
   */
  const unknownSteps = new Map<string, string>();
  for (const inside of unresolved) {
    if (asksState(inside)) continue;
    const [head, ...steps] = withoutOptional(inside).split('|');
    const unknown = steps.find((step) => !knownStep(step));
    if (unknown === undefined) continue;
    const given = Object.prototype.hasOwnProperty.call(values, head) && read(head) !== undefined;
    if (given || steps.some(isFallback)) unknownSteps.set(inside, unknown);
  }
  if (unknownSteps.size) {
    const which = [...unknownSteps]
      .map(([inside, step]) => {
        const closest = closestStep(step);
        return (
          localize('warn.unknown_step_one', { placeholder: `[[${inside}]]`, step }) +
          (closest ? localize('error.did_you_mean', { closest }) : '')
        );
      })
      .join(' ');
    say(localize('warn.unknown_step', { which }), 'other');
  }
  const unset = unresolved.filter((inside) => !asksState(inside) && !unknownSteps.has(inside));
  if (unset.length) {
    const which = unset.map((name) => `[[${name}]]`).join(', ');
    const whose = templateName
      ? localize('warn.unresolved_template', { name: templateName })
      : localize('warn.unresolved_this');
    say(localize('warn.unresolved', { whose, which, escape: `${ESCAPE}${unset[0]}` }), 'unset');
  }

  // Escapes are unwrapped only once every substitution is done, so `[[!name]]` cannot be
  // turned back into a placeholder and then substituted on a later pass. Nothing to do
  // and nothing substituted means the content is already what it should be.
  /*
   * Empty options come out before the escapes are unwrapped, and not after: `[[!name?]]`
   * becomes the text `[[name?]]`, which is indistinguishable from an option that found no
   * value once it has been unwrapped. Doing it in this order, the escaped one is still
   * wearing its bang and is left alone.
   */
  /*
   * Asked of the text as substitution left it, not as it was written: `[[colours.[[level]]?]]`
   * has brackets inside it, so it only reads as one optional placeholder once `[[level]]` is
   * in - and one whose key the mapping does not have still has to drop out (#192).
   */
  const hasOptional = new RegExp(`\\[\\[[^[\\]]*\\${'?'}\\]\\]`).test(jsonConfig);
  const marked = jsonConfig.includes(HA_MARK);
  const nothingToDo = !variableArray.length && !hasOptional && !fallbacks && !hasEscape(jsonConfig) && !marked;
  if (nothingToDo) return content;

  const parsed = hasOptional ? pruneEmptyOptions(JSON.parse(jsonConfig), trace?.dropped) : JSON.parse(jsonConfig);
  // The lists a `repeat:` built go into the lists they sit in.
  const pruned = jsonConfig.includes(`"${SPLICE_KEY}"`) ? unsplice(parsed) : parsed;
  if (keepEscapes || (!hasEscape(jsonConfig) && !marked)) return pruned;
  return unescapeOutsideConsumers(pruned);
}

export default deepReplace;
