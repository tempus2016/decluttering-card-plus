import { VariablesConfig, TemplateConfig } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */

// A variable's value can itself contain placeholders, so substitution runs repeatedly
// until nothing changes. The cap only matters for a variable that refers to itself,
// which would otherwise never settle.
const MAX_PASSES = 10;
const PLACEHOLDER = /\[\[[^[\]]+\]\]/;

// Passed variables take precedence over the template's defaults, so only the first
// definition of each name is kept. Order alone is not enough once substitution loops:
// a default would otherwise win whenever the placeholder is introduced by an earlier
// substitution rather than being present in the template from the start.
function firstDefinitionWins(variableArray: VariablesConfig[]): VariablesConfig[] {
  const seen = new Set<string>();
  return variableArray.filter((variable) => {
    const key = Object.keys(variable)[0];
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function substitutePass(jsonConfig: string, variableArray: VariablesConfig[]): string {
  let json = jsonConfig;
  variableArray.forEach((variable) => {
    const key = Object.keys(variable)[0];
    const value = Object.values(variable)[0];
    if (typeof value === 'number' || typeof value === 'boolean') {
      const rxp2 = new RegExp(`"\\[\\[${key}\\]\\]"`, 'gm');
      json = json.replace(rxp2, value as unknown as any);
    }
    if (typeof value === 'object') {
      const rxp2 = new RegExp(`"\\[\\[${key}\\]\\]"`, 'gm');
      const valueString = JSON.stringify(value);
      json = json.replace(rxp2, valueString);
    } else {
      const rxp = new RegExp(`\\[\\[${key}\\]\\]`, 'gm');
      json = json.replace(rxp, value);
    }
  });
  return json;
}

export default (variables: VariablesConfig[] | undefined, templateConfig: TemplateConfig, content: any): any => {
  if (!variables && !templateConfig.default) {
    return content;
  }
  let variableArray: VariablesConfig[] = [];
  if (variables) {
    variableArray = variables.slice(0);
  }
  if (templateConfig.default) {
    variableArray = variableArray.concat(templateConfig.default);
  }
  variableArray = firstDefinitionWins(variableArray);
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
