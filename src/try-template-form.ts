import deepReplace, { BuildExtras } from './deep-replace';
import { shownDefaults } from './card-editor/defaults';
import { hasOptionsFrom, optionsFromSelector } from './options-from';
import { TemplateConfig, VariablesConfig } from './types';
import {
  declarationSelector,
  declarationShown,
  filledReader,
  getDeclarations,
  groupDeclarations,
  isCardDeclaration,
  normaliseVariables,
  resolveVariables,
  variableValues,
  VariableDeclaration,
} from './variables';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * The card editor's form, drawn with plain controls on the docs site (#427). Home Assistant's
 * own selectors cannot load there, so each declared variable gets the nearest plain thing - a
 * text box, a dropdown, a checkbox, a number box - read off the same selector the editor picks
 * (`declarationSelector`, `optionsFromSelector`), with the default the editor shows for an
 * unset field (`shownDefaults`) and the editor's own show_if/hide_if reading (`declarationShown`
 * with `filledReader`). An approximation of the controls; the values, defaults and what shows
 * are the editor's.
 */

export type ControlKind = 'text' | 'select' | 'checkbox' | 'number' | 'card';

export interface StandInOption {
  value: string;
  label: string;
}

export interface StandInField {
  name: string;
  label: string;
  description?: string;
  group?: string;
  control: ControlKind;
  /** The selector's own name - `entity`, `icon`, `text` - which the text box stands in for. */
  selector: string;
  options?: StandInOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  multiline?: boolean;
  required: boolean;
  /** Whether the card sets it, and to what. */
  set: boolean;
  value?: unknown;
  /** What it is built with when the card leaves it unset, as the editor shows it. */
  shown?: unknown;
  /** Whether show_if/hide_if leave it out of the form for now. */
  hidden: boolean;
  /** The conditions written, for saying why. */
  showIf?: string[];
  hideIf?: string[];
}

const TRUE_WORDS = new Set(['true', 'yes', 'on', '1']);

const list = (value: unknown): string[] | undefined =>
  value === undefined || value === null ? undefined : (Array.isArray(value) ? value : [value]).map(String);

function options(written: unknown): StandInOption[] {
  if (!Array.isArray(written)) return [];
  return written.map((each) =>
    each && typeof each === 'object'
      ? { value: String((each as any).value ?? ''), label: String((each as any).label ?? (each as any).value ?? '') }
      : { value: String(each), label: String(each) },
  );
}

/** The plain control a selector stands for. */
export function controlFor(
  selector: any,
): Pick<StandInField, 'control' | 'selector' | 'options' | 'min' | 'max' | 'step' | 'unit' | 'multiline'> {
  const name = selector && typeof selector === 'object' ? (Object.keys(selector)[0] ?? 'text') : 'text';
  const inner = selector?.[name] ?? {};
  if (name === 'select') return { control: 'select', selector: name, options: options(inner.options) };
  if (name === 'boolean') return { control: 'checkbox', selector: name };
  if (name === 'number') {
    return {
      control: 'number',
      selector: name,
      ...(typeof inner.min === 'number' ? { min: inner.min } : {}),
      ...(typeof inner.max === 'number' ? { max: inner.max } : {}),
      ...(typeof inner.step === 'number' ? { step: inner.step } : {}),
      ...(typeof inner.unit_of_measurement === 'string' ? { unit: inner.unit_of_measurement } : {}),
    };
  }
  if (name === 'card') return { control: 'card', selector: name };
  return { control: 'text', selector: name, ...(inner.multiline === true ? { multiline: true } : {}) };
}

/**
 * The form the card editor would draw for this template and this card's variables, field by
 * field, in the editor's order: ungrouped first, then each `group:` as it first appears.
 */
export function standInFields(
  template: TemplateConfig | undefined,
  variables: VariablesConfig[] | VariablesConfig | undefined,
  templateName: string | undefined,
  hass: any,
  extras: BuildExtras,
): StandInField[] {
  const declarations = getDeclarations(template);
  if (!template || !declarations.length) return [];
  const own = variableValues(variables);
  const unset = declarations.filter((each) => !(each.name in own) && !isCardDeclaration(each)).map((each) => each.name);
  const defaults = shownDefaults(unset, variables, template, hass, extras);
  // show_if/hide_if read every value the card builds with, filled in as the card fills it (#426).
  const read = filledReader(variableValues(resolveVariables(variables, template)), (content) =>
    deepReplace(
      normaliseVariables(variables),
      template,
      content,
      templateName,
      hass,
      true,
      undefined,
      0,
      undefined,
      undefined,
      false,
      extras,
    ),
  );
  const fields: StandInField[] = [];
  for (const bucket of groupDeclarations(declarations)) {
    for (const declaration of bucket.declarations)
      fields.push(field(declaration, bucket.group, own, defaults, read, hass));
  }
  return fields;
}

function field(
  declaration: VariableDeclaration,
  group: string | undefined,
  own: Record<string, unknown>,
  defaults: Map<string, unknown>,
  read: (name: string) => unknown,
  hass: any,
): StandInField {
  const selector = hasOptionsFrom(declaration)
    ? optionsFromSelector(declaration, hass)
    : declarationSelector(declaration);
  const control = controlFor(selector);
  const set = declaration.name in own;
  let shown = set ? undefined : defaults.get(declaration.name);
  // A switch shows a word default the way the card reads it (as the editor does).
  if (control.control === 'checkbox' && shown !== undefined && typeof shown !== 'boolean') {
    shown = TRUE_WORDS.has(String(shown).trim().toLowerCase());
  }
  return {
    name: declaration.name,
    label: declaration.label ?? declaration.name,
    ...(declaration.description ? { description: declaration.description } : {}),
    ...(group ? { group } : {}),
    ...control,
    required: declaration.required === true,
    set,
    ...(set ? { value: own[declaration.name] } : {}),
    ...(shown !== undefined ? { shown } : {}),
    hidden: !declarationShown(declaration, read),
    ...(list(declaration.show_if) ? { showIf: list(declaration.show_if) } : {}),
    ...(list(declaration.hide_if) ? { hideIf: list(declaration.hide_if) } : {}),
  };
}

/** What a control's text reads as, for its variable: a number box a number, a checkbox true or false. */
export function controlValue(field: Pick<StandInField, 'control'>, text: string | boolean): unknown {
  if (field.control === 'checkbox') return text === true;
  if (typeof text !== 'string') return text;
  if (field.control === 'number') {
    const number = Number(text);
    return text.trim() !== '' && Number.isFinite(number) ? number : text;
  }
  return text;
}

/**
 * The card with one variable set - or taken out, for `undefined`, so its default applies
 * again - in whichever shape its `variables:` were written: a list of one-key entries, or a
 * mapping. A variable written more than once is set where the build reads it, the first time.
 */
export function withVariable(card: Record<string, any>, name: string, value: unknown): Record<string, any> {
  const written = card.variables;
  if (written && typeof written === 'object' && !Array.isArray(written)) {
    const next = { ...written };
    if (value === undefined) delete next[name];
    else next[name] = value;
    return { ...card, variables: next };
  }
  const entries: any[] = Array.isArray(written) ? [...written] : [];
  const at = entries.findIndex(
    (entry) =>
      entry && typeof entry === 'object' && !Array.isArray(entry) && Object.prototype.hasOwnProperty.call(entry, name),
  );
  if (value === undefined) {
    if (at === -1) return card;
    const rest = { ...entries[at] };
    delete rest[name];
    if (Object.keys(rest).length) entries[at] = rest;
    else entries.splice(at, 1);
  } else if (at === -1) entries.push({ [name]: value });
  else entries[at] = { ...entries[at], [name]: value };
  const out: Record<string, any> = { ...card, variables: entries };
  if (!entries.length) delete out.variables;
  return out;
}
