import { VariablesConfig, TemplateConfig } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */
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
  let jsonConfig = JSON.stringify(content);
  variableArray.forEach((variable) => {
    const key = Object.keys(variable)[0];
    const value = Object.values(variable)[0];
    if (typeof value === 'number' || typeof value === 'boolean') {
      const rxp2 = new RegExp(`"\\[\\[${key}\\]\\]"`, 'gm');
      jsonConfig = jsonConfig.replace(rxp2, value as unknown as any);
    }
    if (typeof value === 'object') {
      const rxp2 = new RegExp(`"\\[\\[${key}\\]\\]"`, 'gm');
      const valueString = JSON.stringify(value);
      jsonConfig = jsonConfig.replace(rxp2, valueString);
    } else {
      const rxp = new RegExp(`\\[\\[${key}\\]\\]`, 'gm');
      jsonConfig = jsonConfig.replace(rxp, value);
    }
  });
  return JSON.parse(jsonConfig);
};
