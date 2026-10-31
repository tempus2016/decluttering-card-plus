import { VariablesConfig } from './types';
import { exampleSets } from './examples';
import { variableName, variableValues } from './variables';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * The example strip (idea 26) names each example by something a person recognises - the
 * name or entity it sets - rather than only "Example 2", and can add the preview's current
 * values as a new example.
 */

// The variables most likely to say what an example is about, in the order they are tried.
const TELLING = ['name', 'title', 'label', 'entity', 'area', 'room'];

/** Something short that says what the example is about, or nothing when it sets nothing telling. */
export function exampleHint(set: VariablesConfig[]): string | undefined {
  const values = variableValues(set);
  for (const key of TELLING) {
    const value = values[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number') return String(value);
  }
  const first = set.map(variableName).find((name) => name !== undefined);
  if (first !== undefined) {
    const value = values[first];
    if (typeof value === 'string' || typeof value === 'number') return `${first}: ${value}`;
  }
  return undefined;
}

/** The template with one more example, written as a mapping of the values given. */
export function addExample(template: any, values: VariablesConfig[]): any {
  // A plain object: variableValues builds one with no prototype, and Home Assistant's own
  // deep-equal calls hasOwnProperty on what it is handed.
  const mapping = Object.assign({}, variableValues(values));
  const written = template?.examples;
  const list = written === undefined || written === null ? [] : Array.isArray(written) ? written : [written];
  return { ...template, examples: [...list, mapping] };
}

/** How many of a template's examples pass, given the failures the health check found for it. */
export function passCount(template: unknown, failedExamples: number): { passes: number; total: number } {
  const total = exampleSets(template).length;
  return { passes: Math.max(0, total - failedExamples), total };
}
