import { DeclutteringCardConfig, VariablesConfig } from '../types';
import { mergeVariables, ownVariables, variableName, variableValues } from '../variables';
import { setOrDelete } from '../shared';
import { isShownValue } from './defaults';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * What an edit in the card editor writes into the card. Pure, and apart from the element, so
 * that each of them can be tested: the rule for all of them is that an edit writes what was
 * changed and leaves the rest of the card as it was written.
 */

// Declared variables get their own form field, and the prefix keeps a variable called
// "template" from colliding with the field that chooses the template.
export const VARIABLE_FIELD_PREFIX = 'variable:';

/** A field drawn as something other than the value written - see the editor's _formData. */
export interface ShownAs {
  shown: unknown;
  written: unknown;
}

/**
 * The card after a change in the variables form or the layout form under it. `data` is the
 * whole of what the form holds, as ha-form hands it back on every change; `names` are the
 * variables the template declares, each of which has a field of its own.
 */
export function applyVariablesForm(
  config: DeclutteringCardConfig | undefined,
  data: Record<string, any>,
  names: string[],
  shownAs: Map<string, ShownAs> = new Map(),
  // Fields declared `allow_empty: true` (#514).
  allowEmpty: ReadonlySet<string> = new Set(),
): DeclutteringCardConfig {
  if (!names.length) {
    // With nothing declared the form holds the card itself. Off is lazy's default, so
    // switching it off takes the key out rather than writing false, as it does below.
    const out = { ...data };
    if (out.lazy === false && config?.lazy !== false) delete out.lazy;
    return out as DeclutteringCardConfig;
  }

  const own = variableValues(config?.variables);
  const desired: VariablesConfig[] = [];
  for (const name of names) {
    let value = data[VARIABLE_FIELD_PREFIX + name];
    // A switch shown for a written word it was not moved from keeps the word, and a default
    // only shown in its field (#373) stays unwritten until the field is changed.
    const shown = shownAs.get(name);
    if (shown && isShownValue(value, shown.shown)) value = shown.written;
    else if (allowEmpty.has(name) && (value === undefined || value === '') && (name in own || shown !== undefined)) {
      // Declared allow_empty (#514): a field that was showing something, the card's value or a
      // default, and is cleared writes '', which beats the default. Home Assistant's text and
      // entity fields hand back undefined once cleared, told from one left alone by what the
      // field was showing.
      desired.push({ [name]: '' });
      continue;
    }
    // A field left alone or cleared sets nothing, so the template's own default keeps
    // working. An empty string the card already wrote is a value like any other, and stays.
    if (value === undefined || (value === '' && own[name] !== '')) continue;
    desired.push({ [name]: value });
  }
  // The box under the fields holds a list of entries; a mapping typed there is read the same way.
  desired.push(...ownVariables(data.extras));

  const out = { ...config, template: data.template } as DeclutteringCardConfig;
  // Whatever shape the config was written in, what is saved back is the list form.
  const variables = mergeVariables(ownVariables(config?.variables), desired);
  if (variables.length) out.variables = variables;
  else delete out.variables;
  setOrDelete(out, 'columns', data.columns);
  setOrDelete(out, 'min_column_width', data.min_column_width);
  setOrDelete(out, 'gap', data.gap);
  setOrDelete(out, 'fit', data.fit);
  // Off is the default, so switching it off takes the key out rather than writing false -
  // but a `lazy: false` the card wrote stays while the switch is left off.
  if (data.lazy === true) out.lazy = true;
  else if (config?.lazy !== false) delete out.lazy;
  setOrDelete(out, 'lazy_eager', data.lazy_eager);
  return out;
}

/**
 * The card with a card-valued variable set, in the place it was written, or added after the
 * rest when it is new - and taken out when there is no card to set.
 */
export function withCardVariable(
  config: DeclutteringCardConfig | undefined,
  name: string,
  value: unknown,
): DeclutteringCardConfig {
  const filled = !!value && typeof value === 'object';
  const variables: VariablesConfig[] = [];
  let placed = false;
  for (const entry of ownVariables(config?.variables)) {
    if (variableName(entry) !== name) variables.push(entry);
    else if (filled && !placed) {
      variables.push({ [name]: value });
      placed = true;
    }
  }
  if (filled && !placed) variables.push({ [name]: value });
  const out = { ...config } as DeclutteringCardConfig;
  if (variables.length) out.variables = variables;
  else delete out.variables;
  return out;
}

const sameConfig = (a: unknown, b: unknown): boolean => a === b || JSON.stringify(a) === JSON.stringify(b);

/**
 * Whether a config handed to the editor is another card's rather than this one's next edit.
 * Home Assistant keeps one editor element for as long as the card's type stays the same: a
 * stack's editor moving to its next tab, or the code editor handing back what was typed
 * there, sets a config the editor never sent. Everything the editor remembers about the card
 * it was showing - a row half filled in, a confirmation waiting - belongs to that card.
 *
 * A config the editor fired itself comes straight back to it, and one the same as the card
 * it already holds changes nothing; neither is foreign.
 */
export function isForeignConfig(incoming: unknown, current: unknown, fired: unknown): boolean {
  if (current === undefined) return false;
  if (fired !== undefined && sameConfig(incoming, fired)) return false;
  return !sameConfig(incoming, current);
}

/**
 * The ids of a hand-written list's items after one moved or went, so the editor open on an
 * item stays with that item rather than with its place in the list. An id for every item,
 * new ones numbered on from the highest so far.
 */
export function itemIds(ids: number[], length: number): number[] {
  const out = ids.slice(0, length);
  let next = out.reduce((highest, id) => Math.max(highest, id + 1), 0);
  while (out.length < length) out.push(next++);
  return out;
}

type CardSaver = (config: unknown) => Promise<unknown>;

/**
 * The edit dialog's save, wrapped so that what it saved can be undone as an eject: the
 * dashboard as it was before the save and as it is after. Nothing is kept until the dialog
 * does save, so ejecting and then closing the dialog leaves the last real undo as it was.
 */
export function holdingOnSave(
  save: CardSaver,
  live: () => unknown,
  hold: (before: unknown, after: unknown) => void,
): CardSaver {
  return async (config: unknown) => {
    const before = live();
    const result = await save(config);
    const after = live();
    if (before !== undefined && after !== undefined && after !== before) hold(before, after);
    return result;
  };
}
