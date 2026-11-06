import { DeclutteringCardConfig, VariablesConfig } from '../types';
import { exampleNames, exampleSets } from '../examples';
import { ownVariables, variableName, variableValues } from '../variables';

/*
 * Idea 44: a template's `examples:` offered as presets a card can be filled from at any
 * time, not only while it sets nothing yet. Picking one writes the preset's values over the
 * card's; what the preset does not name is kept. The preset is not stored on the card - the
 * dropdown shows a name only while the card's values still match one.
 */

export function presetOptions(template: unknown): { value: string; label: string }[] {
  return exampleNames(template).map((label, index) => ({ value: String(index), label }));
}

/** The preset every value of which the card currently has, or none. */
export function presetMatching(template: unknown, variables: unknown): number | undefined {
  const current = variableValues(variables as VariablesConfig[] | VariablesConfig | undefined);
  const sets = exampleSets(template);
  for (let index = 0; index < sets.length; index += 1) {
    const wanted = variableValues(sets[index]);
    const names = Object.keys(wanted);
    if (names.length && names.every((name) => JSON.stringify(current[name]) === JSON.stringify(wanted[name])))
      return index;
  }
  return undefined;
}

/** The names the card sets by hand that this preset would change, which is what a confirm is for. */
export function presetConflicts(template: unknown, index: number, variables: unknown): string[] {
  const set = exampleSets(template)[index];
  if (!set) return [];
  const current = variableValues(variables as VariablesConfig[] | VariablesConfig | undefined);
  const wanted = variableValues(set);
  return Object.keys(wanted).filter(
    (name) => name in current && JSON.stringify(current[name]) !== JSON.stringify(wanted[name]),
  );
}

/** The card filled from the preset: its values laid over the card's own, in the list form. */
export function applyPreset(config: DeclutteringCardConfig, template: unknown, index: number): DeclutteringCardConfig {
  const set = exampleSets(template)[index];
  if (!set) return config;
  const own = ownVariables(config.variables);
  const names = new Set(set.map((entry) => variableName(entry)));
  const kept = own.filter((entry) => !names.has(variableName(entry)));
  return { ...config, variables: [...kept, ...set] };
}
