import { VariablesConfig, TemplateConfig } from './types';
import { applyTransform, resolveVariables, TRANSFORM_SUFFIX } from './variables';

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

function substitutePass(jsonConfig: string, variableArray: VariablesConfig[]): string {
  let json = jsonConfig;
  variableArray.forEach((variable) => {
    const key = escapeForRegExp(Object.keys(variable)[0]);
    const value = Object.values(variable)[0];
    const wholeValue = new RegExp(`"\\[\\[${key}${TRANSFORM_SUFFIX}\\]\\]"`, 'gm');
    const withinString = new RegExp(`\\[\\[${key}${TRANSFORM_SUFFIX}\\]\\]`, 'gm');

    // Every replacement goes through a function so that `$&`, `$1` and friends in a
    // variable's value are inserted literally rather than read as replacement patterns.
    // A transformed placeholder is text whatever the value's own type, since a transform
    // is a way of writing the value out rather than a way of choosing it.
    json = json.replace(wholeValue, (match: string, transform?: string) =>
      transform ? JSON.stringify(applyTransform(transform, value)) : asWholeValue(value, match),
    );
    json = json.replace(withinString, (_match: string, transform?: string) =>
      transform ? escapeForJsonString(applyTransform(transform, value)) : asPartOfString(value),
    );
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
