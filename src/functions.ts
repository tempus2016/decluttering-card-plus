import { TemplateConfig, VariablesConfig } from './types';
import { localize } from './localize';
import { argText, FunctionHost, isBuiltinStepName, quotedText } from './variables';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * Templates used as steps (#307). A template with a `function:` key is one:
 *
 *   occ_sens:
 *     parameters: [detect_type, suffix]
 *     default: { detect_type: car, suffix: occupancy }
 *     let:
 *       sensor: 'binary_sensor.[[value|lower]]_[[detect_type]]_[[suffix]]'
 *     function: '[[sensor|if_exists]]'
 *
 * and `[[room|occ_sens:cat]]` is that result for the room's value. It is `with:` cut short:
 * the value goes in as `[[value]]`, the argument as the parameters, and it sees nothing else
 * of the card - so the same function gives the same answer wherever it is used.
 */

/** The key a function template's result is written under. */
export const FUNCTION_KEY = 'function';

/** The name the value a function is applied to takes inside it. */
export const FUNCTION_VALUE = 'value';

/** Whether a template is used as a step. */
export function isFunctionTemplate(template: unknown): boolean {
  return !!template && typeof template === 'object' && FUNCTION_KEY in (template as object);
}

/** A function template's parameters, as names; anything that is not a name is left out. */
export function functionParameters(template: TemplateConfig | undefined): string[] {
  const written = (template as any)?.parameters;
  const list = Array.isArray(written) ? written : typeof written === 'string' ? [written] : [];
  return list.filter((name): name is string => typeof name === 'string' && name.trim() !== '').map((n) => n.trim());
}

// Names already warned about, so a dashboard that builds a hundred cards says it once.
const shadowedSaid = new Set<string>();

/**
 * The templates among these that are steps, by name. One named after a built-in step is not:
 * the built-in always wins, and the console says so once.
 */
// Worked out once per set of templates: every build of every card asks.
const functionsFound = new WeakMap<object, Map<string, TemplateConfig>>();

export function functionTemplatesOf(
  templates: Record<string, TemplateConfig> | undefined,
  say: (message: string) => void = (message) => console.warn(`decluttering-card-plus: ${message}`),
): Map<string, TemplateConfig> {
  if (!templates) return new Map();
  const cached = functionsFound.get(templates);
  if (cached) return cached;
  const found = new Map<string, TemplateConfig>();
  functionsFound.set(templates, found);
  for (const [name, template] of Object.entries(templates)) {
    if (!isFunctionTemplate(template)) continue;
    if (isBuiltinStepName(name)) {
      if (!shadowedSaid.has(name)) {
        shadowedSaid.add(name);
        say(localize('warn.function_shadowed', { name }));
      }
      continue;
    }
    found.set(name, template);
  }
  return found;
}

/** The names of the templates among these that are steps, for the lint and the autocomplete. */
export function functionNamesOf(templates: Record<string, TemplateConfig> | undefined): string[] {
  if (!templates) return [];
  return Object.entries(templates)
    .filter(([name, template]) => isFunctionTemplate(template) && !isBuiltinStepName(name))
    .map(([name]) => name);
}

/*
 * A step's argument taken apart at its commas, a comma in quotes staying in its piece. The
 * text is the template's JSON, where a double quote is written `\"`.
 */
function pieces(arg: string): string[] {
  const out: string[] = [];
  let current = '';
  let quote: string | undefined;
  for (let i = 0; i < arg.length; i += 1) {
    const char = arg[i];
    if (quote) {
      if (quote === '\\"' && arg.startsWith('\\"', i)) {
        current += '\\"';
        i += 1;
        quote = undefined;
        continue;
      }
      if (char === quote) quote = undefined;
      current += char;
      continue;
    }
    if (arg.startsWith('\\"', i)) {
      quote = '\\"';
      current += '\\"';
      i += 1;
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    if (char === ',') {
      out.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  out.push(current);
  return out;
}

// What an unquoted piece says, read back from the JSON it is written in.
function plain(text: string): string {
  const trimmed = text.trim();
  if (!trimmed.includes('\\')) return trimmed;
  try {
    const parsed = JSON.parse(`"${trimmed}"`);
    return typeof parsed === 'string' ? parsed : trimmed;
  } catch {
    return trimmed;
  }
}

// One argument's value: its quotes off when it is quoted (#398), trimmed when it is not.
function argValue(text: string): string {
  const trimmed = text.trim();
  return quotedText(trimmed) !== undefined ? argText(trimmed) : plain(trimmed);
}

const NAMED = /^\s*([A-Za-z_][A-Za-z0-9_-]*)\s*=([\s\S]*)$/;

/**
 * The values a function step's argument gives: `cat,detected` in the order of `parameters:`,
 * `suffix=found` by name, the two mixed if need be. More unnamed ones than parameters, or a
 * name that is not one of them, is a mistake, said rather than guessed at.
 */
export function functionArguments(
  arg: string | undefined,
  parameters: string[],
): { values: VariablesConfig[] } | { refused: string } {
  if (arg === undefined || arg === '') return { values: [] };
  const values: VariablesConfig[] = [];
  let position = 0;
  for (const piece of pieces(arg)) {
    const named = quotedText(piece.trim()) === undefined ? NAMED.exec(piece) : null;
    if (named) {
      // Only what parameters: names can be passed by name (#451): anything else would reach
      // into the function's own defaults, or - a typo - go nowhere without a word.
      if (!parameters.includes(named[1])) {
        return {
          refused: localize('warn.function_unknown_name', {
            arg: named[1],
            names: parameters.length ? parameters.join(', ') : localize('warn.function_no_parameters'),
          }),
        };
      }
      values.push({ [named[1]]: argValue(named[2]) });
      continue;
    }
    if (position >= parameters.length) {
      return { refused: localize('warn.function_too_many', { count: String(parameters.length) }) };
    }
    values.push({ [parameters[position]]: argValue(piece) });
    position += 1;
  }
  return { values };
}

// The functions being worked out right now, innermost last, shared by every build so a
// function that calls itself - straight away or by way of another - is caught wherever it is.
const calling: string[] = [];

/**
 * A host for a build's function steps. `build` fills one function in with the variables
 * given and nothing else; `say` is the build's own way of warning.
 */
export function makeFunctionHost(
  functions: Map<string, TemplateConfig>,
  build: (name: string, template: TemplateConfig, variables: VariablesConfig[]) => unknown,
  say: (message: string) => void,
): FunctionHost {
  // The same function on the same value with the same argument gives the same answer, so a
  // build asks once - every pass of the substitution would otherwise ask again.
  const answers = new Map<string, string | number | boolean | undefined>();
  return {
    has: (name) => functions.has(name),
    names: () => [...functions.keys()],
    refusal: (name, arg) => {
      const template = functions.get(name);
      if (!template) return undefined;
      const parsed = functionArguments(arg, functionParameters(template));
      return 'refused' in parsed ? parsed.refused : undefined;
    },
    call: (name, arg, value) => {
      const template = functions.get(name);
      if (!template) return undefined;
      if (calling.includes(name)) {
        say(localize('warn.function_recursive', { name, path: [...calling, name].join(' > ') }));
        return undefined;
      }
      let key: string;
      try {
        key = JSON.stringify([name, arg ?? null, value === undefined ? null : value]);
      } catch {
        key = '';
      }
      if (key && answers.has(key)) return answers.get(key);
      const parsed = functionArguments(arg, functionParameters(template));
      let answer: string | number | boolean | undefined;
      if ('refused' in parsed) {
        say(localize('warn.function_failed', { name, why: parsed.refused }));
      } else {
        calling.push(name);
        let out: unknown;
        try {
          // The value first, so no argument can stand in for it.
          out = build(name, template, [{ [FUNCTION_VALUE]: value }, ...parsed.values]);
        } finally {
          calling.pop();
        }
        if (typeof out === 'string') {
          // Still holding a placeholder is not an answer: the card around it must not fill it
          // with its own variables. The build inside has already said what was missing.
          // Nothing at all - an option inside that dropped - is a gap too, so a `?` after the
          // step takes the option out and a `default:` stands in.
          answer = out === '' || /\[\[(?!!)/.test(out) ? undefined : out;
        } else if (typeof out === 'number' || typeof out === 'boolean') {
          answer = out;
        } else if (out !== undefined && out !== null) {
          say(localize('warn.function_failed', { name, why: localize('warn.function_not_simple') }));
        }
      }
      if (key) answers.set(key, answer);
      return answer;
    },
  };
}
