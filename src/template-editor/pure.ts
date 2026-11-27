import { getThingType } from '../build';
import { isFunctionTemplate } from '../functions';
import { setOrDelete } from '../shared';
import { sameConfig } from '../undo';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * The template editor's decisions that need no page to make: what kind of template is open,
 * what an edit to the Describe panel does to it, which rewrites to make again after the edit
 * dialog saves. Kept apart from the elements so the node tests can run them.
 */

// What a template of each kind starts out as, when its type is chosen in the editor. One
// of these is kept and the rest removed, so switching the type swaps the body for a
// starter of the new kind - and leaves an existing body of the chosen kind alone.
export const THING_STUBS: Record<string, unknown> = {
  card: { type: 'entity', entity: 'sun.sun' },
  badge: { type: 'entity', entity: 'sun.sun' },
  row: { entity: 'sun.sun' },
  element: { type: 'icon', icon: 'mdi:weather-sunny', style: { color: 'yellow' } },
};

export type TemplateKind = 'card' | 'badge' | 'row' | 'element' | 'function' | 'item' | 'dashboard';

/** The kind a template says it is by what it holds, or nothing when it holds no body at all. */
function ownKind(template: any): TemplateKind | undefined {
  if (!template || typeof template !== 'object') return undefined;
  const thing = getThingType(template);
  if (thing) return thing as TemplateKind;
  if (isFunctionTemplate(template)) return 'function';
  if ('item' in template) return 'item';
  if (template.dashboard !== undefined) return 'dashboard';
  return undefined;
}

/*
 * What the template defines, for the Type field: a card, badge, row or element; a function
 * (#307); an item template, filled in by `with:` and `repeat:`; or a page, with its content
 * under `dashboard:`. A template with no body of its own that builds on another is what its
 * parents make it, read off `resolved` - the template as the dashboard resolves it. Read as
 * a card otherwise, so a new template starts as one.
 */
export function templateKind(config: unknown, resolved?: unknown): TemplateKind {
  const own = ownKind(config);
  if (own) return own;
  if ((config as any)?.extends !== undefined) return ownKind(resolved) ?? 'card';
  return 'card';
}

/*
 * The template after an edit to the Describe panel: its name, type, description, category.
 * Each field is its own form, so `value` carries one field and the rest is read off the
 * template as it stands.
 *
 * The body is only touched when the Type field itself was changed. A template with no body
 * of its own - one that only `extends:` another, an item template, a page - reads as some
 * type, and writing that type's starter into it on every keystroke in the description put a
 * sun card over what its parents built.
 */
export function describeChange<T extends Record<string, any>>(
  config: T,
  value: Record<string, unknown>,
  resolved?: unknown,
): T {
  const before = templateKind(config, resolved);
  const data = {
    template: config.template,
    thingType: before as string,
    description: config.description,
    category: config.category,
    ...value,
  };
  const out: any = { ...config, template: data.template };
  // Unlike the stubs below, these replace whatever is already there rather than only
  // filling in what is absent.
  setOrDelete(out, 'description', data.description);
  setOrDelete(out, 'category', data.category);
  if (data.thingType === before) return out;

  // A function (#307) has no card: picked, it gets a body of its own; left, it loses it.
  if (before === 'function') {
    delete out.function;
    delete out.parameters;
  }
  // An item template or a page given another type stops being one.
  delete out.item;
  delete out.dashboard;
  if (data.thingType === 'function' && !isFunctionTemplate(out)) out.function = '[[value]]';
  // A group is a card template's body too, so it stays while the type stays a card.
  const keepsGroup = out.group !== undefined && data.thingType === 'card';
  if (!keepsGroup) delete out.group;
  for (const [thingType, stub] of Object.entries(THING_STUBS)) {
    if (!keepsGroup && data.thingType === thingType) {
      if (!(thingType in out)) out[thingType] = stub;
    } else {
      delete out[thingType];
    }
  }
  return out;
}

/** Whether a template's own `card:` says what type of card it is, so Home Assistant's editor can open it. */
export function hasOwnCardType(card: unknown): boolean {
  return !!card && typeof card === 'object' && typeof (card as { type?: unknown }).type === 'string';
}

/*
 * Whether a config handed to the editor came from outside - the dialog's YAML mode, an
 * undo - rather than back from an edit the editor just sent. Compared by content: Home
 * Assistant may hand back a copy of what it was sent.
 */
export function cameFromOutside(incoming: unknown, lastSent: unknown): boolean {
  return lastSent === undefined ? false : !sameConfig(incoming, lastSent);
}

/**
 * The last answer for the same things, compared by identity. The dialog draws again on
 * every state change Home Assistant sends, and what is worked out from the dashboard and
 * the template only changes when one of those objects is replaced.
 */
export function memoLast<T>(): (keys: readonly unknown[], make: () => T) => T {
  let last: { keys: readonly unknown[]; value: T } | undefined;
  return (keys, make) => {
    if (last && last.keys.length === keys.length && last.keys.every((key, index) => key === keys[index])) {
      return last.value;
    }
    const value = make();
    last = { keys, value };
    return value;
  };
}

// The characters a variable's or a step's name is written in; anything else ends one.
const NAME_BREAK = /[^A-Za-z0-9_.$-]+/;

/*
 * What the lint said about a placeholder, if anything: the message kept for a name the
 * placeholder really uses. Each finding is filed under the name it names - a variable, a
 * step, or the whole placeholder - and a name only counts as a whole word, so a warning
 * about `name` says nothing of `[[entity_name]]`.
 */
export function badMessageFor(placeholder: string, bad: Map<string, string>): string | undefined {
  if (!bad.size) return undefined;
  const whole = bad.get(placeholder);
  if (whole !== undefined) return whole;
  const inner = placeholder.replace(/^\[\[/, '').replace(/\]\]$/, '');
  const names = new Set<string>([inner]);
  for (const word of inner.split(NAME_BREAK)) {
    if (!word) continue;
    names.add(word);
    // A dotted read is a use of what it is read from: `item.name` uses `item`.
    for (let dot = word.indexOf('.'); dot !== -1; dot = word.indexOf('.', dot + 1)) names.add(word.slice(0, dot));
  }
  for (const [name, message] of bad) if (names.has(name)) return message;
  return undefined;
}

/**
 * The templates a pasted bundle carries under `includes:` that are worth installing: the
 * ones that are templates at all - a mapping each - under names the dashboard does not have.
 * Anything else is left out, as it is from a shared post: written into
 * decluttering_templates it is no template, and the dashboard's checks trip over it.
 */
export function importableIncludes(
  includes: unknown,
  existing: readonly string[],
): [string, Record<string, unknown>][] {
  if (!includes || typeof includes !== 'object' || Array.isArray(includes)) return [];
  return Object.entries(includes as Record<string, unknown>).filter(
    (entry): entry is [string, Record<string, unknown>] =>
      !existing.includes(entry[0]) && !!entry[1] && typeof entry[1] === 'object' && !Array.isArray(entry[1]),
  );
}

type Rewrite = (config: any) => unknown;
type DialogSave = ((config: unknown) => Promise<unknown>) & {
  dcpRewrites?: Rewrite[];
  dcpSave?: DialogSave;
  dcpBase?: unknown;
};

const isMapping = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

/**
 * Whether `saved` is `base` with exactly one thing put in - an entry in one list, or one new
 * key - and nothing else different. That is what Home Assistant's dialog for a card being
 * added saves: the dashboard as it was when the dialog opened, plus the card.
 */
export function addsOneNode(base: unknown, saved: unknown): boolean {
  if (Array.isArray(base) && Array.isArray(saved)) {
    if (saved.length === base.length + 1) {
      let at = 0;
      while (at < base.length && sameConfig(base[at], saved[at])) at += 1;
      return base.slice(at).every((each, index) => sameConfig(each, saved[at + index + 1]));
    }
    if (saved.length !== base.length) return false;
    const differing = [...base.keys()].filter((index) => !sameConfig(base[index], saved[index]));
    return differing.length === 1 && addsOneNode(base[differing[0]], saved[differing[0]]);
  }
  if (isMapping(base) && isMapping(saved)) {
    if (Object.keys(base).some((key) => !(key in saved))) return false;
    const added = Object.keys(saved).filter((key) => !(key in base));
    const differing = Object.keys(base).filter((key) => !sameConfig(base[key], saved[key]));
    if (added.length === 1 && !differing.length) return true;
    return !added.length && differing.length === 1 && addsOneNode(base[differing[0]], saved[differing[0]]);
  }
  return false;
}

/**
 * Home Assistant's dialog for a card being added saves the card into the dashboard as it
 * was when the dialog opened, so its Save would undo every rewrite a tool here has saved
 * since - a template installed, cards swapped for a template, a rename. This wraps that save
 * so the rewrites are made again on top of it, from the dashboard as it stands then. Wrapped
 * again for another rewrite, it keeps them all in order and still calls the dialog's own
 * save once.
 *
 * `base` is the dashboard as the dialog first had it. The rewrites are only made again when
 * what the dialog saved is that dashboard plus the one card: a dialog editing a card already
 * there saves over the dashboard as it stands, the rewrites are still in it, and making one
 * again - swapping the next card written like the one already swapped - would be a second
 * rewrite nobody asked for.
 */
export function redoingRewrites(
  save: DialogSave,
  rewrite: Rewrite,
  live: () => { config: unknown; saveConfig: (config: unknown) => Promise<unknown> } | null | undefined,
  base: unknown,
): DialogSave {
  const rewrites = [...(save.dcpRewrites ?? []), rewrite];
  const original = save.dcpSave ?? save;
  // The first rewrite's: by the second, the dashboard on the page is no longer what the dialog holds.
  const opened = save.dcpSave ? save.dcpBase : base;
  const wrapped: DialogSave = async (config: unknown) => {
    const result = await original(config);
    const panel = live();
    if (!panel || !addsOneNode(opened, panel.config)) return result;
    let next = panel.config;
    for (const each of rewrites) next = each(next);
    if (next !== panel.config && !sameConfig(next, panel.config)) await panel.saveConfig(next);
    return result;
  };
  wrapped.dcpRewrites = rewrites;
  wrapped.dcpSave = original;
  wrapped.dcpBase = opened;
  return wrapped;
}
