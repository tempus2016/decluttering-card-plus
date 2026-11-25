import { LibraryEntry, libraryEntry, libraryNeeds, librarySource } from '../library';
import { addTemplateToRoot, byDomainOf } from '../templates';
import { freeName } from '../share';
import { TEMPLATE_TAG } from '../shared';
import { TemplateConfig } from '../types';

/*
 * A card just added from the picker names no template (its stub has none), so the editor
 * opens on choosing one rather than on an error about a template nobody made. Everything a
 * card that does name one sees is unchanged.
 */

/** Whether the card has not chosen what to build yet: no `template:` and no `template_by_domain:`. */
export function choosingTemplate(config: unknown): boolean {
  if (!config || typeof config !== 'object') return false;
  const template = (config as { template?: unknown }).template;
  return (template === undefined || template === null || template === '') && !byDomainOf(config);
}

/**
 * Whether the card is the picker's stub as it was handed over: nothing written but its type
 * (and the layout keys Home Assistant adds by itself). Only then is the rest of the form left
 * out, so a card written by hand without a template still shows what it holds.
 */
export function isBareStub(config: unknown): boolean {
  if (!choosingTemplate(config)) return false;
  const ignored = new Set(['type', 'template', 'grid_options', 'layout_options', 'view_layout', 'visibility']);
  return Object.keys(config as Record<string, unknown>).every((key) => ignored.has(key));
}

/**
 * The dashboard with a starter-library template written into `decluttering_templates`, with
 * any library template it calls. Names the dashboard already has are left exactly as they are.
 */
export function withLibraryInstalled(
  ll: unknown,
  name: string,
  existing: string[],
  version: string,
  find: (name: string) => LibraryEntry | undefined = libraryEntry,
): unknown {
  const entry = find(name);
  if (!entry) return ll;
  const wanted = [...libraryNeeds(entry, existing), entry.name].filter((each) => !existing.includes(each));
  return wanted.reduce((built, each) => {
    const one = find(each);
    if (!one) return built;
    // Stamped the way the template editor stamps its installs, so it is known where it came from.
    const stamped = { ...one.template, source: librarySource(one.name, version) };
    return addTemplateToRoot(built, one.name, stamped as TemplateConfig);
  }, ll);
}

/** The name "Create a template" gives the new template card: free on this dashboard. */
export const NEW_TEMPLATE_NAME = 'my_template';

/**
 * What "Create a template" turns this card into: a template card defining a new template, the
 * template editor's own stub. Saved, the template is on the view, and the next card added from
 * the picker offers it.
 */
export function newTemplateCard(existing: string[]): Record<string, unknown> {
  return {
    type: `custom:${TEMPLATE_TAG}`,
    template: freeName(NEW_TEMPLATE_NAME, existing),
    card: { type: 'entity', entity: 'sun.sun' },
  };
}

type CardSaver = ((config: unknown) => Promise<unknown>) & { dcpKeeps?: string[]; dcpOriginal?: CardSaver };

/**
 * Home Assistant's edit dialog saves the card into the dashboard as it was when the dialog
 * opened, so its Save would drop a template installed since. This wraps that save so the
 * templates come back on top of it, read from the dashboard as it stands then. Wrapped again
 * for another name, it keeps every name and still calls the dialog's own save once.
 */
export function keepingTemplates(
  save: CardSaver,
  name: string,
  live: () => { config: unknown; saveConfig: (config: unknown) => Promise<unknown> } | undefined,
  namesOf: (ll: unknown) => string[],
  version: string,
  find: (name: string) => LibraryEntry | undefined = libraryEntry,
): CardSaver {
  const keeps = [...new Set([...(save.dcpKeeps ?? []), name])];
  const original = save.dcpOriginal ?? save;
  const wrapped: CardSaver = async (config: unknown) => {
    const result = await original(config);
    const panel = live();
    if (!panel) return result;
    let next = panel.config;
    for (const each of keeps) next = withLibraryInstalled(next, each, namesOf(next), version, find);
    if (next !== panel.config) await panel.saveConfig(next);
    return result;
  };
  wrapped.dcpKeeps = keeps;
  wrapped.dcpOriginal = original;
  return wrapped;
}
