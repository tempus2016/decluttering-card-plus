import { VariablesConfig, TemplateConfig } from './types';
import { resolveVariables } from './variables';

/* eslint-disable @typescript-eslint/no-explicit-any */

// A variable's value can itself contain placeholders, so substitution runs repeatedly
// until nothing changes. The cap only matters for a variable that refers to itself,
// which would otherwise never settle.
const MAX_PASSES = 10;
const PLACEHOLDER = /\[\[[^[\]]+\]\]/;

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

// Every replacement goes through a function so that `$&`, `$1` and friends in a variable's
// value are inserted literally instead of being read as replacement patterns.
function replaceAll(json: string, pattern: RegExp, replacement: string): string {
  return json.replace(pattern, () => replacement);
}

function substitutePass(jsonConfig: string, variableArray: VariablesConfig[]): string {
  let json = jsonConfig;
  variableArray.forEach((variable) => {
    const key = escapeForRegExp(Object.keys(variable)[0]);
    const value = Object.values(variable)[0];
    // `"[[name]]"` is the whole value, so the replacement takes the place of the quotes
    // too and can be any JSON. `[[name]]` on its own sits inside a larger string.
    const wholeValue = new RegExp(`"\\[\\[${key}\\]\\]"`, 'gm');
    const withinString = new RegExp(`\\[\\[${key}\\]\\]`, 'gm');

    if (typeof value === 'object') {
      // `typeof null` is 'object', and JSON.stringify(null) is 'null', which is what a bare
      // `"[[name]]"` should become - so null belongs here rather than with the strings.
      const valueJson = JSON.stringify(value);
      json = replaceAll(json, wholeValue, valueJson);
      // Used inside a longer string an object cannot be injected as JSON structure, so
      // it goes in as its JSON text. That is what issue #83 asked for.
      json = replaceAll(json, withinString, escapeForJsonString(valueJson));
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      json = replaceAll(json, wholeValue, String(value));
      json = replaceAll(json, withinString, String(value));
    } else {
      json = replaceAll(json, withinString, escapeForJsonString(String(value)));
    }
  });
  return json;
}

export default (variables: VariablesConfig[] | undefined, templateConfig: TemplateConfig, content: any): any => {
  const variableArray = resolveVariables(variables, templateConfig);
  if (!variableArray.length) {
    return content;
  }
  let jsonConfig = JSON.stringify(content);
  let passes = 0;
  while (PLACEHOLDER.test(jsonConfig) && passes < MAX_PASSES) {
    const before = jsonConfig;
    jsonConfig = substitutePass(jsonConfig, variableArray);
    passes += 1;
    // Every remaining placeholder is one no variable defines, so further passes cannot help.
    if (jsonConfig === before) break;
  }
  if (passes === MAX_PASSES && PLACEHOLDER.test(jsonConfig)) {
    console.warn(
      `decluttering-card-plus: gave up substituting variables after ${MAX_PASSES} passes. ` +
        'Check whether a variable refers to itself.',
    );
  }
  return JSON.parse(jsonConfig);
};
