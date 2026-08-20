import { VariablesConfig, TemplateConfig } from './types';
import {
  applyTransform,
  ESCAPE,
  isOptional,
  OPTIONAL_SUFFIX,
  hasEscape,
  PLACEHOLDER,
  resolveVariables,
  TRANSFORM_SUFFIX,
  unescapePlaceholders,
} from './variables';

/* eslint-disable @typescript-eslint/no-explicit-any */

// How a refusal reads when Home Assistant had nothing to give, as opposed to when a
// transform was handed something it cannot shape.
const NOTHING_FOR = 'nothing in Home Assistant for';

// A variable's value can itself contain placeholders, so substitution runs repeatedly
// until nothing changes. The cap only matters for a variable that refers to itself,
// which would otherwise never settle.
const MAX_PASSES = 10;

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

/** How to describe a value that a transform cannot shape, in a sentence about it. */
function kindOf(value: unknown): string {
  return Array.isArray(value) ? 'a list' : 'a mapping';
}

function substitutePass(
  jsonConfig: string,
  variableArray: VariablesConfig[],
  refused: Map<string, string>,
  hass?: any,
): string {
  let json = jsonConfig;
  variableArray.forEach((variable) => {
    const key = escapeForRegExp(Object.keys(variable)[0]);
    const value = Object.values(variable)[0];
    const wholeValue = new RegExp(`"\\[\\[${key}${TRANSFORM_SUFFIX}${OPTIONAL_SUFFIX}\\]\\]"`, 'gm');
    const withinString = new RegExp(`\\[\\[${key}${TRANSFORM_SUFFIX}${OPTIONAL_SUFFIX}\\]\\]`, 'gm');

    // Every replacement goes through a function so that `$&`, `$1` and friends in a
    // variable's value are inserted literally rather than read as replacement patterns.
    // A transform shapes text, so it only applies to a scalar: slugging or uppercasing a
    // mapping's JSON garbles its keys, so the placeholder is left visible instead - the
    // same treatment an unrecognised transform gets.
    const transformable = value === null || typeof value !== 'object';
    // A placeholder left visible is the deliberate signal that something is wrong, but on
    // its own it does not say what - so each refusal is noted, to be reported once at the
    // end rather than on every pass over the same text.
    const refuse = (match: string, transform: string, why?: string): string => {
      refused.set(`${Object.keys(variable)[0]}|${transform}`, why ?? kindOf(value));
      return match;
    };

    /*
     * A chain can ask Home Assistant for something it does not have - an entity that is
     * not there, an attribute it does not carry - and there is no sensible value to put
     * in its place, so the placeholder stays visible and says why, exactly as a transform
     * refusing a mapping does.
     */
    const shaped = (match: string, transform: string, wrap: (text: string) => string): string => {
      const text = applyTransform(transform, value, hass);
      return text === undefined ? refuse(match, transform, `${NOTHING_FOR} "${value}"`) : wrap(text);
    };

    /*
     * An optional placeholder given nothing to say is left exactly as it was written, so
     * that the pass at the end can take the whole option out. Empty means unset, null or
     * the empty string - a zero and a false are values, and stay.
     */
    const emptyOptional = (optional?: string): boolean =>
      !!optional && (value === undefined || value === null || value === '');

    json = json.replace(wholeValue, (match: string, transform?: string, optional?: string) => {
      if (emptyOptional(optional)) return match;
      return transform
        ? transformable
          ? shaped(match, transform, (text) => JSON.stringify(text))
          : refuse(match, transform)
        : asWholeValue(value, match);
    });
    json = json.replace(withinString, (match: string, transform?: string, optional?: string) => {
      if (emptyOptional(optional)) return match;
      return transform
        ? transformable
          ? shaped(match, transform, escapeForJsonString)
          : refuse(match, transform)
        : asPartOfString(value);
    });
  });
  return json;
}

/*
 * The placeholders still standing once substitution has done all it can, which are the
 * ones no variable defines. An escaped `[[!name]]` is not one of them - it is meant to be
 * there - and neither is a placeholder a transform deliberately refused, which says so
 * for itself in a message of its own.
 */
function unresolvedPlaceholders(json: string, refused: Map<string, string>): string[] {
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
 */
function pruneEmptyOptions(value: any): any {
  if (Array.isArray(value)) {
    // A dropped item leaves no hole: a list of cards with one missing is a shorter list,
    // not a list with a gap in it.
    return value.filter((item) => !isEmptyOption(item)).map((item) => pruneEmptyOptions(item));
  }
  if (value && typeof value === 'object') {
    const out: Record<string, any> = {};
    for (const [key, entry] of Object.entries(value)) {
      if (isEmptyOption(entry)) continue;
      out[key] = pruneEmptyOptions(entry);
    }
    return out;
  }
  if (typeof value === 'string') {
    const anyOptional = new RegExp(PLACEHOLDER.source, 'g');
    return value.replace(anyOptional, (match, inside: string) =>
      !inside.startsWith(ESCAPE) && isOptional(inside) ? '' : match,
    );
  }
  return value;
}

export default (
  variables: VariablesConfig[] | undefined,
  templateConfig: TemplateConfig,
  content: any,
  templateName?: string,
  hass?: any,
  quiet?: boolean,
): any => {
  if (content === undefined) return content;
  const variableArray = resolveVariables(variables, templateConfig);
  let jsonConfig = JSON.stringify(content);
  // Worth knowing before any work is done: a template with no optional placeholder in it
  // never needs the pruning pass at the end.
  const hasOptional = new RegExp(`\\[\\[[^[\\]]*\\${'?'}\\]\\]`).test(jsonConfig);

  // Each placeholder a transform refused, and what its value turned out to be.
  const refused = new Map<string, string>();

  if (variableArray.length) {
    let passes = 0;
    while (PLACEHOLDER.test(jsonConfig) && passes < MAX_PASSES) {
      const before = jsonConfig;
      jsonConfig = substitutePass(jsonConfig, variableArray, refused, hass);
      passes += 1;
      // Every remaining placeholder is one no variable defines, so further passes cannot help.
      if (jsonConfig === before) break;
    }
    if (!quiet && passes === MAX_PASSES && PLACEHOLDER.test(jsonConfig)) {
      console.warn(
        `decluttering-card-plus: gave up substituting variables after ${MAX_PASSES} passes. ` +
          'Check whether a variable refers to itself.',
      );
    }

    if (!quiet && refused.size) {
      const each = [...refused].map(([placeholder, kind]) => `[[${placeholder}]] (${kind})`);
      // The two ways a chain gives up read differently, so say whichever applies rather
      // than a sentence that only half fits.
      const missing = [...refused.values()].some((kind) => kind.startsWith(NOTHING_FOR));
      const shaping = [...refused.values()].some((kind) => !kind.startsWith(NOTHING_FOR));
      const why = [
        shaping
          ? 'A transform only shapes text, so it needs a scalar value - applying one to a mapping ' +
            'or a list would garble its JSON. Give the variable a scalar value, or drop the transform.'
          : '',
        missing
          ? 'A resolver reads its value as an entity id and asks Home Assistant, so it needs one ' +
            'that exists and carries what was asked for.'
          : '',
      ]
        .filter(Boolean)
        .join(' ');
      console.warn(`decluttering-card-plus: left ${each.join(', ')} in the card rather than substituting. ${why}`);
    }
  }

  /*
   * A variable nobody set renders as the literal `[[name]]` on the card. The editors
   * already say so while you are editing, but a dashboard that was saved with one missing
   * just shows the brackets and gives no clue where they came from - so say it here too,
   * where it is the running card talking rather than the editor.
   */
  const unresolved = unresolvedPlaceholders(jsonConfig, refused);
  if (!quiet && unresolved.length) {
    const which = unresolved.map((name) => `[[${name}]]`).join(', ');
    const whose = templateName ? `template "${templateName}"` : 'this template';
    console.warn(
      `decluttering-card-plus: ${whose} uses ${which}, which nothing gives a value to, ` +
        'so it is rendered as written. Set it on the card, or give it a default in the template. ' +
        `To write those brackets on purpose, escape it as [[${ESCAPE}${unresolved[0]}]].`,
    );
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
  const nothingToDo = !variableArray.length && !hasOptional && !hasEscape(jsonConfig);
  if (nothingToDo) return content;

  const pruned = hasOptional ? pruneEmptyOptions(JSON.parse(jsonConfig)) : JSON.parse(jsonConfig);
  if (!hasEscape(jsonConfig)) return pruned;
  return JSON.parse(unescapePlaceholders(JSON.stringify(pruned)));
};
