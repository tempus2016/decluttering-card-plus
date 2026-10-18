import { VariablesConfig, TemplateConfig } from './types';
import { localize } from './localize';
import { BuildTrace } from './trace';
import {
  answersUnset,
  applyTransform,
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
  OPTIONAL_SUFFIX,
  hasEscape,
  isFallback,
  isJsonNumber,
  PLACEHOLDER,
  resolveVariables,
  STATE_STEP,
  stateScope,
  TRANSFORM_SUFFIX,
  unlistedState,
  unescapePlaceholders,
  withoutConditions,
  yieldsBoolean,
  yieldsList,
  yieldsNumber,
} from './variables';

/* eslint-disable @typescript-eslint/no-explicit-any */

// What a refusal says, and which way it happened: a transform was handed something it
// cannot shape, Home Assistant had nothing to give, an `if:` did not hold, `json` was
// written somewhere other than first, or `state` was asked of an entity the card does not
// rebuild on. The reason carries the difference so the wording never has to - the wording
// is translated.
type RefusalReason = 'shape' | 'missing' | 'closed' | 'json' | 'unlisted';

interface Refusal {
  text: string;
  reason: RefusalReason;
}

/*
 * How deep a condition's own value is worked out. `if:` reads a variable as it will end up,
 * not as it was written - a `let:` value built from the others is still `[[...]]` text until
 * it is substituted - so a condition settles that value first, with the same variables.
 * The settling can meet conditions of its own; past this depth they are read as written.
 */
const MAX_CONDITION_DEPTH = 3;

// A variable's value can itself contain placeholders, so substitution runs repeatedly
// until nothing changes. The cap only matters for a variable that refers to itself,
// which would otherwise never settle.
const MAX_PASSES = 10;

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

function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
  return text.replace(/[{}()[\];\\@"'/]/g, '');
}

/*
 * Every escape written out, except inside a card that will substitute again: what is handed
 * to a nested decluttering card - its `variables:` - is read as template code by that card,
 * and an escape unwrapped here would be live there. A friendly name of `[[zz?]]` passed down
 * as a label would delete the key it lands in, one card further in (review 2026-10-18). The
 * nested card unwraps what reaches it when its own build is done.
 */
function unescapeOutsideConsumers(node: any): any {
  if (typeof node === 'string') return unescapePlaceholders(node);
  if (Array.isArray(node)) return node.map(unescapeOutsideConsumers);
  if (!node || typeof node !== 'object') return node;
  if (CONSUMER_TYPES.includes(node.type)) return node;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node)) out[unescapePlaceholders(key)] = unescapeOutsideConsumers(value);
  return out;
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
): string {
  let json = jsonConfig;
  for (const variable of variableArray) {
    // A single pass fully unrolls a self-doubling chain, so the size is checked before each
    // variable is applied rather than only after the pass - and inside each replace as well,
    // because one variable whose value holds two hundred placeholders grows the text two
    // hundredfold in a single step, not twofold. Once what has been added would pass the
    // ceiling, the matches still to come are left as written.
    if (limit !== undefined && json.length > limit) break;
    let room = limit === undefined ? Infinity : limit - json.length;
    const within = (match: string, out: string): string => {
      const growth = out.length - match.length;
      if (growth > room) return match;
      room -= growth;
      return out;
    };
    const key = escapeForRegExp(Object.keys(variable)[0]);
    const value = Object.values(variable)[0];
    const wholeValue = new RegExp(`"\\[\\[${key}${TRANSFORM_SUFFIX}${OPTIONAL_SUFFIX}\\]\\]"`, 'gm');
    const withinString = new RegExp(`\\[\\[${key}${TRANSFORM_SUFFIX}${OPTIONAL_SUFFIX}\\]\\]`, 'gm');

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
      refused.set(`${Object.keys(variable)[0]}|${transform}`, { text: why ?? kindOf(value), reason });
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
      const input = typeof value === 'string' && PLACEHOLDER.test(value) ? settle(Object.keys(variable)[0]) : value;
      const unlisted = unlistedState(transform, input, hass, values, read);
      if (unlisted !== undefined) {
        return refuse(match, written, localize('warn.state_unlisted', { entity: unlisted }), 'unlisted');
      }
      const text = applyTransform(transform, input, hass, values, read, shield);
      if (text !== undefined) return wrap(text);
      // A gap that an `or:` could not fill is still just a gap - nothing gives it a value -
      // so it is left to be reported as unset rather than blamed on Home Assistant.
      if (gap && transform.split('|').some(isFallback)) return match;
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
      if (!transform) return whole ? asWholeValue(value, match) : asPartOfString(value);
      const chain = transform;
      // `json` reads the variable's own value, so anywhere but first it has nothing to
      // work on - and without this it would be blamed on Home Assistant.
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

    json = json.replace(wholeValue, (match: string, rawTransform?: string, rawOptional?: string) =>
      within(match, noted(trace, match.slice(1, -1), substitute(match, rawTransform, rawOptional, true), true)),
    );
    json = json.replace(withinString, (match: string, rawTransform?: string, rawOptional?: string) =>
      within(match, noted(trace, match, substitute(match, rawTransform, rawOptional, false), false)),
    );
  }
  return json;
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
    if (!inside.startsWith(ESCAPE) && !refused.has(inside) && !isOptional(inside)) names.add(inside);
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
    if (!inside.startsWith(ESCAPE) && !trace.placeholders.has(placeholder)) {
      const refusal = refused.get(inside) ?? refused.get(withoutOptional(inside));
      const why = refusal
        ? localize('trace.left_refused', { why: refusal.text })
        : localize(isOptional(inside) ? 'trace.left_empty' : 'trace.left_unset');
      trace.placeholders.set(placeholder, why);
    }
    match = everyPlaceholder.exec(json);
  }
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
): any {
  if (content === undefined) return content;
  // What the console is told is also noted on the trace, for `debug: report` (#207) -
  // once per build, so a card building again still has the warning in its report even
  // when the set it keeps has heard it before.
  const say = (message: string): void => {
    if (quiet === true) return;
    trace?.warnings.push(message);
    if (quiet instanceof Set) {
      if (quiet.has(message)) return;
      quiet.add(message);
    }
    console.warn(message);
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
  const values = variableValues(variableArray);
  let jsonConfig = JSON.stringify(content);

  // What an `if:` reads: a variable's value as it will end up, worked out once per name.
  const settled = new Map<string, unknown>();
  const read = (name: string): unknown => {
    if (settled.has(name)) return settled.get(name);
    const raw = values[name];
    const value =
      typeof raw === 'string' && PLACEHOLDER.test(raw) && depth < MAX_CONDITION_DEPTH
        ? deepReplace(variableArray, {}, raw, templateName, hass, true, undefined, depth + 1)
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
    const value =
      typeof raw === 'string' && PLACEHOLDER.test(raw) && depth < MAX_CONDITION_DEPTH
        ? deepReplace(variableArray, {}, raw, templateName, hass, true, undefined, depth + 1, undefined, shield, true)
        : raw;
    shapedInputs.set(name, value);
    return value;
  };
  // Each placeholder a transform refused, and what its value turned out to be.
  const refused = new Map<string, Refusal>();
  if (variableArray.length) {
    const limit = outputLimit(jsonConfig.length);
    let passes = 0;
    while (PLACEHOLDER.test(jsonConfig) && passes < MAX_PASSES) {
      const before = jsonConfig;
      jsonConfig = substitutePass(jsonConfig, variableArray, refused, read, values, hass, limit, trace, shield, settle);
      passes += 1;
      // Every remaining placeholder is one no variable defines, so further passes cannot help.
      if (jsonConfig === before) break;
      // A chain that keeps growing has been stopped mid-expansion; carrying on would only
      // grow it further, so give up here and let the placeholders left standing be reported.
      if (jsonConfig.length > limit) {
        say(localize('warn.gave_up', { passes }));
        break;
      }
    }
    if (passes === MAX_PASSES && PLACEHOLDER.test(jsonConfig)) {
      say(localize('warn.gave_up', { passes: MAX_PASSES }));
    }

    if (refused.size) {
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
      ]
        .filter(Boolean)
        .join(' ');
      say(localize('warn.refused', { which: each.join(', '), why }));
    }
  }

  // Anything still saying `default:`, `or:` or `bool` gets its turn now, whether or not there were
  // any variables to substitute in the first place.
  const fallbacks = hasFallback(jsonConfig);
  if (fallbacks) jsonConfig = fallbackPass(jsonConfig, values, read, hass, trace, shield);
  if (trace) noteLeftStanding(trace, jsonConfig, refused);

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
    say(localize('warn.state_unlisted_unset', { which }));
  }
  const unset = unresolved.filter((inside) => !asksState(inside));
  if (unset.length) {
    const which = unset.map((name) => `[[${name}]]`).join(', ');
    const whose = templateName
      ? localize('warn.unresolved_template', { name: templateName })
      : localize('warn.unresolved_this');
    say(localize('warn.unresolved', { whose, which, escape: `${ESCAPE}${unset[0]}` }));
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
  const nothingToDo = !variableArray.length && !hasOptional && !fallbacks && !hasEscape(jsonConfig);
  if (nothingToDo) return content;

  const pruned = hasOptional ? pruneEmptyOptions(JSON.parse(jsonConfig), trace?.dropped) : JSON.parse(jsonConfig);
  if (!hasEscape(jsonConfig) || keepEscapes) return pruned;
  return unescapeOutsideConsumers(pruned);
}

export default deepReplace;
