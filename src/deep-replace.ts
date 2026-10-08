import { VariablesConfig, TemplateConfig } from './types';
import { localize } from './localize';
import {
  answersUnset,
  applyTransform,
  BOOL_STEP,
  ESCAPE,
  gateOpen,
  hasCondition,
  JSON_STEP,
  resolveFallback,
  variableValues,
  withoutOptional,
  isOptional,
  OPTIONAL,
  OPTIONAL_SUFFIX,
  hasEscape,
  isFallback,
  PLACEHOLDER,
  resolveVariables,
  TRANSFORM_SUFFIX,
  unescapePlaceholders,
  withoutConditions,
  yieldsBoolean,
} from './variables';

/* eslint-disable @typescript-eslint/no-explicit-any */

// What a refusal says, and which way it happened: a transform was handed something it
// cannot shape, Home Assistant had nothing to give, or an `if:` did not hold. The reason
// carries the difference so the wording never has to - the wording is translated.
type RefusalReason = 'shape' | 'missing' | 'closed';

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
// bare true or false, which is the only way a card's on/off option can be given one.
function asShapedWholeValue(text: string, chain: string): string {
  return yieldsBoolean(chain) ? text : JSON.stringify(text);
}

/** How to describe a value that a transform cannot shape, in a sentence about it. */
function kindOf(value: unknown): string {
  return localize(Array.isArray(value) ? 'warn.kind_list' : 'warn.kind_mapping');
}

function substitutePass(
  jsonConfig: string,
  variableArray: VariablesConfig[],
  refused: Map<string, Refusal>,
  read: (name: string) => unknown,
  values: Record<string, any>,
  hass?: any,
  limit?: number,
): string {
  let json = jsonConfig;
  for (const variable of variableArray) {
    // A single pass fully unrolls a self-doubling chain, so the size is checked before each
    // variable is applied rather than only after the pass. The text can at most double per
    // variable, so stopping here holds the result to about twice the ceiling.
    if (limit !== undefined && json.length > limit) break;
    const key = escapeForRegExp(Object.keys(variable)[0]);
    const value = Object.values(variable)[0];
    const wholeValue = new RegExp(`"\\[\\[${key}${TRANSFORM_SUFFIX}${OPTIONAL_SUFFIX}\\]\\]"`, 'gm');
    const withinString = new RegExp(`\\[\\[${key}${TRANSFORM_SUFFIX}${OPTIONAL_SUFFIX}\\]\\]`, 'gm');

    // Every replacement goes through a function so that `$&`, `$1` and friends in a
    // variable's value are inserted literally rather than read as replacement patterns.
    // A transform shapes text, so it only applies to a scalar: slugging or uppercasing a
    // mapping's JSON garbles its keys, so the placeholder is left visible instead - the
    // same treatment an unrecognised transform gets.
    // Every transform but two shapes text and refuses anything else. `json` wants the
    // mapping itself and `bool` asks whether there is anything in it, so a chain starting
    // with either is allowed through.
    const isScalar = value === null || typeof value !== 'object';
    const transformable = (transform?: string): boolean =>
      isScalar || [JSON_STEP, BOOL_STEP].includes((transform ?? '').split('|')[0]);
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
      const text = applyTransform(transform, value, hass, values, read);
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
      const text = applyTransform(chain, undefined, hass, values, read);
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
      if (!transformable(chain)) return refuse(match, written as string);
      return shaped(
        match,
        chain,
        whole ? (text) => asShapedWholeValue(text, chain) : escapeForJsonString,
        written as string,
      );
    };

    json = json.replace(wholeValue, (match: string, rawTransform?: string, rawOptional?: string) =>
      substitute(match, rawTransform, rawOptional, true),
    );
    json = json.replace(withinString, (match: string, rawTransform?: string, rawOptional?: string) =>
      substitute(match, rawTransform, rawOptional, false),
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

function pruneBlock(value: any): any {
  if (isEmptyOption(value)) return GONE;
  if (Array.isArray(value)) {
    if (!value.length) return value;
    // A dropped item leaves no hole: a list of cards with one missing is a shorter list,
    // not a list with a gap in it.
    const kept = value.map((item) => pruneBlock(item)).filter((item) => item !== GONE);
    return kept.length ? kept : GONE;
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
      const pruned = pruneBlock(entry);
      if (pruned !== GONE) out[key] = pruned;
    }
    return Object.keys(out).length ? out : GONE;
  }
  return pruneEmptyOptions(value);
}

function pruneEmptyOptions(value: any): any {
  if (Array.isArray(value) || (value && typeof value === 'object')) {
    // The card itself is never taken away, however little is left of it: an empty one is
    // still the card that was asked for, and says so more clearly than nothing at all.
    const pruned = pruneBlock(value);
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
): string {
  // An empty stand-in is still a gap, so an optional placeholder that ends up with one is
  // left for the pruning pass to take out - `[[name|default:?]]` drops the key, as
  // `[[name?]]` would (discussion #155).
  const standIn = (inside: string): string | undefined => {
    const text = resolveFallback(inside, values, hass, read);
    return text === '' && isOptional(inside) ? undefined : text;
  };
  let json = jsonConfig;
  // The whole value first, so a stand-in replaces the quotes around it too rather than
  // landing inside them twice.
  json = json.replace(/"\[\[([^[\]]+)\]\]"/g, (match: string, inside: string) => {
    const text = standIn(inside);
    if (text === undefined) return match;
    return asShapedWholeValue(text, withoutOptional(inside).split('|').slice(1).join('|'));
  });
  return json.replace(/\[\[([^[\]]+)\]\]/g, (match: string, inside: string) => {
    const text = standIn(inside);
    return text === undefined ? match : escapeForJsonString(text);
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

function deepReplace(
  variables: VariablesConfig[] | undefined,
  templateConfig: TemplateConfig,
  content: any,
  templateName?: string,
  hass?: any,
  quiet?: boolean,
  onUnresolved?: (names: string[]) => void,
  depth = 0,
): any {
  if (content === undefined) return content;
  const variableArray = resolveVariables(variables, templateConfig);
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
  // Worth knowing before any work is done: a template with no optional placeholder in it
  // never needs the pruning pass at the end.
  const hasOptional = new RegExp(`\\[\\[[^[\\]]*\\${'?'}\\]\\]`).test(jsonConfig);

  // Each placeholder a transform refused, and what its value turned out to be.
  const refused = new Map<string, Refusal>();

  if (variableArray.length) {
    const limit = outputLimit(jsonConfig.length);
    let passes = 0;
    while (PLACEHOLDER.test(jsonConfig) && passes < MAX_PASSES) {
      const before = jsonConfig;
      jsonConfig = substitutePass(jsonConfig, variableArray, refused, read, values, hass, limit);
      passes += 1;
      // Every remaining placeholder is one no variable defines, so further passes cannot help.
      if (jsonConfig === before) break;
      // A chain that keeps growing has been stopped mid-expansion; carrying on would only
      // grow it further, so give up here and let the placeholders left standing be reported.
      if (jsonConfig.length > limit) {
        if (!quiet) console.warn(localize('warn.gave_up', { passes }));
        break;
      }
    }
    if (!quiet && passes === MAX_PASSES && PLACEHOLDER.test(jsonConfig)) {
      console.warn(localize('warn.gave_up', { passes: MAX_PASSES }));
    }

    if (!quiet && refused.size) {
      const each = [...refused].map(([placeholder, refusal]) => `[[${placeholder}]] (${refusal.text})`);
      // The ways a chain gives up read differently, so say whichever apply rather than a
      // sentence that only half fits.
      const reasons = new Set([...refused.values()].map((refusal) => refusal.reason));
      const why = [
        reasons.has('shape') ? localize('warn.refused_transform') : '',
        reasons.has('missing') ? localize('warn.refused_resolver') : '',
        reasons.has('closed') ? localize('warn.refused_condition') : '',
      ]
        .filter(Boolean)
        .join(' ');
      console.warn(localize('warn.refused', { which: each.join(', '), why }));
    }
  }

  // Anything still saying `default:`, `or:` or `bool` gets its turn now, whether or not there were
  // any variables to substitute in the first place.
  const fallbacks = hasFallback(jsonConfig);
  if (fallbacks) jsonConfig = fallbackPass(jsonConfig, values, read, hass);

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
  if (!quiet && unresolved.length) {
    const which = unresolved.map((name) => `[[${name}]]`).join(', ');
    const whose = templateName
      ? localize('warn.unresolved_template', { name: templateName })
      : localize('warn.unresolved_this');
    console.warn(localize('warn.unresolved', { whose, which, escape: `${ESCAPE}${unresolved[0]}` }));
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
  const nothingToDo = !variableArray.length && !hasOptional && !fallbacks && !hasEscape(jsonConfig);
  if (nothingToDo) return content;

  const pruned = hasOptional ? pruneEmptyOptions(JSON.parse(jsonConfig)) : JSON.parse(jsonConfig);
  if (!hasEscape(jsonConfig)) return pruned;
  return JSON.parse(unescapePlaceholders(JSON.stringify(pruned)));
}

export default deepReplace;
