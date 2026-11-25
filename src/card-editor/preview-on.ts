import { VariablesConfig } from '../types';
import { VariableDeclaration } from '../variables';
import { changedNames } from './left-behind';

/*
 * #510: a field declared `preview_on: leave` tells Home Assistant's preview about its value
 * only when the field is left - tab, a click elsewhere, Enter - rather than on every
 * keystroke. Typing a number that feeds a camera card's layout otherwise rebuilds the camera
 * once per digit. The editor keeps the typed value meanwhile, so nothing is lost, and the
 * preview keeps the last card it built rather than going blank.
 */

export const PREVIEW_ON_VALUES = ['typing', 'leave'] as const;
export type PreviewOn = (typeof PREVIEW_ON_VALUES)[number];

/** Whether the declaration waits for its field to be left. */
export function updatesOnLeave(declaration: Pick<VariableDeclaration, 'preview_on'> | undefined): boolean {
  return declaration?.preview_on === 'leave';
}

type Config = Record<string, unknown> & { variables?: VariablesConfig[] | VariablesConfig };

function withoutVariables(config: Config | undefined): string {
  if (!config) return '';
  const rest = { ...config };
  delete rest.variables;
  return JSON.stringify(rest);
}

/**
 * Whether going from `before` to `after` changes only the values of variables that wait for
 * their field to be left. Anything else changing - another variable, the template, a layout
 * setting - goes to the preview straight away, and takes any held value with it.
 */
export function onlyLeaveFieldsChanged(
  before: Config | undefined,
  after: Config,
  declarations: Pick<VariableDeclaration, 'name' | 'preview_on'>[],
): boolean {
  if (!before) return false;
  const changed = changedNames(before.variables, after.variables);
  if (!changed.length) return false;
  if (withoutVariables(before) !== withoutVariables(after)) return false;
  const waiting = new Set(declarations.filter(updatesOnLeave).map((declaration) => declaration.name));
  return changed.every((name) => waiting.has(name));
}
