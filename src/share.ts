import { placeholderJson } from './placeholder-text';
import { CONSUMER_TYPES, LEGACY_TEMPLATE_TYPE, TEMPLATE_TYPE, parentsOf, templatesNamedBy } from './templates';
import { localize } from './localize';
import { DEFAULTS_ALIAS, OWN_DEFAULTS, normaliseVariables, templateDefaults, usedVariables } from './variables';
import type { VariablesConfig } from './types';
import { requirementsOf, shareInfo, unquotedVersions } from './sharing';

/* eslint-disable @typescript-eslint/no-explicit-any */

// Anything this bundle provides itself, which whoever receives the export already has.
const OWN_TYPES = [TEMPLATE_TYPE, LEGACY_TEMPLATE_TYPE, ...CONSUMER_TYPES];

// The things a template can define, exactly one of which it must.
const THING_KEYS = ['card', 'badge', 'row', 'element', 'group'];

// Read order for the exported YAML: what the template is, then what it takes, then what
// it draws. Whatever is left over follows, so nothing is silently dropped.
// The sharing details (#345) sit with the description, where whoever reads it looks first.
const EXPORT_KEY_ORDER = [
  'type',
  'template',
  'description',
  'author',
  'license',
  'help',
  'homepage',
  'readme',
  'requires',
  'setup',
  'related',
  'variables',
  'default',
  ...THING_KEYS,
  'style',
];

export interface Dependencies {
  /** Custom card types the recipient has to install before the template will render. */
  customTypes: string[];
  /** Other templates this one calls, which travel separately. */
  templateRefs: string[];
}

function walk(node: any, visit: (obj: any) => void): void {
  if (Array.isArray(node)) {
    for (const item of node) walk(item, visit);
    return;
  }
  if (!node || typeof node !== 'object') return;
  visit(node);
  for (const value of Object.values(node)) walk(value, visit);
}

/** What a template needs from its surroundings, which an export cannot carry with it. */
export function scanDependencies(config: any): Dependencies {
  const customTypes = new Set<string>();
  const templateRefs = new Set<string>();

  walk(config, (node) => {
    const type = node.type;
    if (typeof type !== 'string') return;
    if (type.startsWith('custom:') && !OWN_TYPES.includes(type)) customTypes.add(type);
    // A card choosing by domain uses every template it names.
    for (const name of templatesNamedBy(node)) templateRefs.add(name);
  });

  // The templates this one is built on travel the same way as the ones it uses: without
  // them it is half a template.
  for (const parent of parentsOf(config)) templateRefs.add(parent);

  return {
    customTypes: [...customTypes].sort(),
    templateRefs: [...templateRefs].sort(),
  };
}

// The name a placeholder starts with: `camera_entry` in `[[camera_entry|with:entity=x]]`.
const PLACEHOLDER_HEAD = /\[\[!?([A-Za-z0-9_-]+)/g;

/*
 * The item templates a template fills in (#399). `with:` and `repeat:` name one as the head
 * of a placeholder - `[[camera_entry|with:...]]`, or a bare `[[camera_entry]]` - so they are
 * found by name among the dashboard's templates rather than by card type. A head that is no
 * item template here is a variable, and goes unsaid.
 */
function itemTemplateRefs(config: any, templates: Record<string, any>): string[] {
  const text = placeholderJson(config ?? null);
  const found: string[] = [];
  for (let match = PLACEHOLDER_HEAD.exec(text); match !== null; match = PLACEHOLDER_HEAD.exec(text)) {
    const name = match[1];
    if (found.includes(name) || !Object.prototype.hasOwnProperty.call(templates, name)) continue;
    const template = templates[name];
    if (template && typeof template === 'object' && 'item' in template) found.push(name);
  }
  PLACEHOLDER_HEAD.lastIndex = 0;
  return found;
}

/*
 * A template name built from a placeholder - `template: '[[kind]]_tile'` - is picked when the
 * card builds, so an export cannot know which one it needs (#399). It is not a name to go
 * looking for: every template whose name fits the pattern is one it could pick.
 */
function isPicked(name: string): boolean {
  return name.includes('[[');
}

function fitsPicked(pattern: string, names: string[]): string[] {
  const parts = pattern.split(/\[\[[^\]]*\]\]/);
  // Nothing written around the placeholder fits every template there is, which says nothing.
  if (!parts.join('')) return [];
  const escaped = parts.map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.+');
  const fits = new RegExp(`^${escaped}$`);
  return names.filter((name) => fits.test(name));
}

/**
 * A template ready to be handed to someone else: the config as it will be written out,
 * and the things they need to know that the config cannot tell them.
 */
export function buildExport(
  config: any,
  templates?: Record<string, any>,
): { payload: Record<string, any>; notes: string[] } {
  /*
   * `defaults:` goes out folded into `default:`, the spelling every version of this card
   * reads - whoever imports it may be running one from before the plural was understood.
   */
  const source =
    config && typeof config === 'object' && config[DEFAULTS_ALIAS] !== undefined
      ? { ...config, default: templateDefaults(config) }
      : config;
  const payload: Record<string, any> = {};
  for (const key of EXPORT_KEY_ORDER) {
    if (source?.[key] !== undefined) payload[key] = source[key];
  }
  // Where this copy was installed from is bookkeeping for this dashboard, not part of the template.
  for (const key of Object.keys(source ?? {})) {
    if (!(key in payload) && key !== DEFAULTS_ALIAS && key !== 'source') payload[key] = source[key];
  }

  const { customTypes, templateRefs } = scanDependencies(config);

  const bundled = new Set<string>();
  const askedFor = new Set<string>();
  const resolvedSelf = templates?.[config?.template];
  const withValues = (written: any, resolved: any): any => {
    const out = bundleValues(written, resolved);
    for (const name of out.bundled) bundled.add(name);
    for (const name of out.askedFor) askedFor.add(name);
    return out.template;
  };
  if (resolvedSelf) {
    const out = withValues({ ...config, default: payload.default }, resolvedSelf);
    if (out.default !== undefined) payload.default = out.default;
  }

  /*
   * With the dashboard's templates to hand, the ones this one uses ride along under
   * `includes:`, transitively - a bundle that works on arrival instead of a note saying
   * what else to go and find. The note stays for anything that could not be found.
   */
  const missing: string[] = [];
  const picked: string[] = [];
  // Whether any template here fitted a picked name and went along because of it.
  let pickedFound = false;
  if (templates) {
    const includes: Record<string, any> = {};
    const queue = [...templateRefs, ...itemTemplateRefs(config, templates)];
    /*
     * The templates it names under `related:` go too, and theirs in turn, though nothing calls
     * them: that is what the list is for. One that is not here is not missing anything this
     * template needs, so it goes unsaid.
     */
    const self = config?.template;
    const related = new Set(shareInfo(config).related.filter((each) => each !== self));
    queue.push(...related);
    while (queue.length) {
      const name = queue.shift() as string;
      if (name in includes || name === self) continue;
      if (isPicked(name)) {
        if (!picked.includes(name)) picked.push(name);
        const fits = fitsPicked(name, Object.keys(templates)).filter((each) => each !== self);
        if (fits.length) pickedFound = true;
        queue.push(...fits);
        continue;
      }
      const found = templates[name];
      if (!found) {
        if (!related.has(name)) missing.push(name);
        continue;
      }
      includes[name] = withValues(asWritten(withoutSource(found)), found);
      queue.push(...scanDependencies(found).templateRefs, ...itemTemplateRefs(found, templates));
      for (const each of shareInfo(found).related) {
        if (each === self || related.has(each)) continue;
        related.add(each);
        queue.push(each);
      }
    }
    if (Object.keys(includes).length) payload.includes = includes;
  } else {
    for (const name of templateRefs) (isPicked(name) ? picked : missing).push(name);
  }

  /*
   * The custom cards it needs - its own and the included templates' - go into `requires:`
   * rather than a comment (#399). A comment is gone the first time a dashboard edited in the
   * UI saves, where `requires:` stays with the template and is checked when it is installed.
   * Cards the author already listed are left as written.
   */
  const needed = new Set(customTypes);
  for (const included of Object.values<any>(payload.includes ?? {})) {
    for (const type of scanDependencies(included).customTypes) needed.add(type);
  }
  const listed = new Set<string>();
  for (const each of requirementsOf(payload))
    if (each.kind === 'custom_card') each.any.forEach((name) => listed.add(name));
  const add = [...needed].map((type) => type.replace(/^custom:/, '')).filter((name) => !listed.has(name));
  if (add.length) {
    const written = payload.requires;
    const requires = written && typeof written === 'object' && !Array.isArray(written) ? { ...written } : {};
    requires.custom_cards = [...([] as unknown[]).concat(requires.custom_cards ?? []), ...add.sort()];
    payload.requires = requires;
    reorder(payload);
  }

  const notes: string[] = [];
  if (missing.length) {
    notes.push(localize('share.uses_other_templates', { names: missing.join(', ') }));
  }
  if (picked.length) {
    const key = pickedFound ? 'share.picked_templates_found' : 'share.picked_templates';
    notes.push(localize(key, { names: picked.join(', ') }));
  }
  if (bundled.size) notes.push(localize('share.bundled_values', { names: [...bundled].sort().join(', ') }));
  if (askedFor.size) notes.push(localize('share.setup_values_left_out', { names: [...askedFor].sort().join(', ') }));
  const unquoted = unquotedVersions(config);
  if (unquoted.length) notes.push(localize('share.version_unquoted', { keys: unquoted.join(', ') }));

  return { payload, notes };
}

// Puts the keys back in read order after one was added late, leaving the rest where they were.
function reorder(payload: Record<string, any>): void {
  const entries = Object.entries(payload);
  for (const [key] of entries) delete payload[key];
  const rank = (key: string): number => {
    const at = EXPORT_KEY_ORDER.indexOf(key);
    return at === -1 ? EXPORT_KEY_ORDER.length : at;
  };
  for (const [key, value] of entries.sort((a, b) => rank(a[0]) - rank(b[0]))) payload[key] = value;
}

/*
 * A template installed from the shared list carries where it came from under `source:`,
 * and Check for updates believes that stamp: it names the post whose next edit will be
 * offered as a replacement. So the stamp stays with the install it was written for. It
 * does not go out in an export, and it does not come in with a paste - a paste is somebody
 * handing over text, not the card installing from a post, and a stamp typed into that text
 * would point updates at whatever post its author chose. Only an install writes `source:`.
 */
export function withoutSource(template: any): any {
  if (!template || typeof template !== 'object' || Array.isArray(template)) return template;
  const rest = { ...template };
  delete rest.source;
  return rest;
}

/*
 * The dashboard's templates come with its `decluttering_defaults` - and the library's -
 * folded into their `default:`, which is how a card builds with them. Those values are the
 * dashboard's, not the template's, and every one of them was riding out with every template
 * carried under `includes:`, whether it used them or not - a password kept there with it
 * (#399). An included template goes out with the defaults written on it and nothing else.
 */
function asWritten(template: any): any {
  if (!template || typeof template !== 'object' || !(OWN_DEFAULTS in template)) return template;
  const own = template[OWN_DEFAULTS];
  const out = { ...template };
  if (own === undefined || own === null || (Array.isArray(own) && !own.length)) delete out.default;
  else out.default = own;
  return out;
}

/*
 * The dashboard's values a template uses, brought into its own `default:` (#399). A template
 * that reads `[[frigate_port]]` from the dashboard's decluttering_defaults otherwise arrives
 * with nothing for it. Only names it uses go, and only ones its own defaults do not already
 * set, after them, so its own still win. A name in `setup:` stays behind: it is asked for on
 * install, which is where a password or anything else personal belongs.
 */
function bundleValues(written: any, resolved: any): { template: any; bundled: string[]; askedFor: string[] } {
  const none = { template: written, bundled: [], askedFor: [] };
  if (!written || typeof written !== 'object' || !resolved || !(OWN_DEFAULTS in resolved)) return none;
  const own = normaliseVariables(templateDefaults(written));
  const shared = normaliseVariables(resolved.default).slice(normaliseVariables(resolved[OWN_DEFAULTS]).length);
  if (!shared.length) return none;
  const ownNames = new Set(own.map((entry) => Object.keys(entry)[0]));
  const used = new Set(usedVariables({ ...written, default: [...own, ...shared] }));
  const setup = new Set(shareInfo(written).setup);
  const take: VariablesConfig[] = [];
  const bundled: string[] = [];
  const askedFor: string[] = [];
  for (const entry of shared) {
    const name = Object.keys(entry)[0];
    if (!used.has(name) || ownNames.has(name) || bundled.includes(name) || askedFor.includes(name)) continue;
    if (setup.has(name)) {
      askedFor.push(name);
      continue;
    }
    take.push(entry);
    bundled.push(name);
  }
  if (!take.length) return { template: written, bundled, askedFor };
  return { template: { ...written, default: [...own, ...take] }, bundled, askedFor };
}

/** A pasted template with any `source:` stamp taken off it and off each template it carries. */
export function withoutSources(parsed: any): any {
  const out = withoutSource(parsed);
  if (out?.includes && typeof out.includes === 'object' && !Array.isArray(out.includes)) {
    const includes: Record<string, any> = {};
    for (const [name, template] of Object.entries(out.includes)) includes[name] = withoutSource(template);
    out.includes = includes;
  }
  return out;
}

/** The first spelling of `name` that nothing in `taken` already answers to. */
export function freeName(name: string, taken: string[]): string {
  if (!taken.includes(name)) return name;
  let counter = 2;
  while (taken.includes(`${name}_${counter}`)) counter += 1;
  return `${name}_${counter}`;
}

/**
 * Whether pasted text describes a template. Every problem is reported together, so that
 * fixing one does not just reveal the next.
 */
export function validateImport(parsed: any): { ok: boolean; errors: string[] } {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, errors: [localize('share.import_not_a_template')] };
  }

  const errors: string[] = [];
  if (typeof parsed.template !== 'string' || !parsed.template.trim()) {
    errors.push(localize('share.import_no_name'));
  }

  const things = THING_KEYS.filter((key) => parsed[key] !== undefined);
  if (things.length === 0) {
    errors.push(localize('share.import_defines_nothing'));
  } else if (things.length > 1) {
    errors.push(localize('share.import_defines_both', { first: things[0], second: things[1] }));
  }

  return { ok: errors.length === 0, errors };
}

/*
 * The custom cards a template is built from that this browser does not have. A template
 * installs either way - it may be the first step of setting one of them up - but a card
 * using it shows an error until then, so it is said before anything is installed rather
 * than discovered afterwards. `isDefined` is asked about the element's tag, which is the
 * type without its `custom:`.
 */
export function missingCustomCards(templates: unknown[], isDefined: (tag: string) => boolean): string[] {
  const missing = new Set<string>();
  for (const template of templates) {
    for (const type of scanDependencies(template).customTypes) {
      const tag = type.slice('custom:'.length);
      if (tag && !isDefined(tag)) missing.add(tag);
    }
  }
  return [...missing].sort();
}
