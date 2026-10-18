import { CONSUMER_TYPES, LEGACY_TEMPLATE_TYPE, TEMPLATE_TYPE, parentsOf, templatesNamedBy } from './templates';
import { localize } from './localize';
import { DEFAULTS_ALIAS, templateDefaults } from './variables';

/* eslint-disable @typescript-eslint/no-explicit-any */

// Anything this bundle provides itself, which whoever receives the export already has.
const OWN_TYPES = [TEMPLATE_TYPE, LEGACY_TEMPLATE_TYPE, ...CONSUMER_TYPES];

// The things a template can define, exactly one of which it must.
const THING_KEYS = ['card', 'badge', 'row', 'element', 'group'];

// Read order for the exported YAML: what the template is, then what it takes, then what
// it draws. Whatever is left over follows, so nothing is silently dropped.
const EXPORT_KEY_ORDER = ['type', 'template', 'description', 'variables', 'default', ...THING_KEYS, 'style'];

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

  /*
   * With the dashboard's templates to hand, the ones this one uses ride along under
   * `includes:`, transitively - a bundle that works on arrival instead of a note saying
   * what else to go and find. The note stays for anything that could not be found.
   */
  const missing: string[] = [];
  if (templates) {
    const includes: Record<string, any> = {};
    const queue = [...templateRefs];
    while (queue.length) {
      const name = queue.shift() as string;
      if (name in includes) continue;
      const found = templates[name];
      if (!found) {
        missing.push(name);
        continue;
      }
      includes[name] = withoutSource(found);
      queue.push(...scanDependencies(found).templateRefs);
    }
    if (Object.keys(includes).length) payload.includes = includes;
  } else {
    missing.push(...templateRefs);
  }

  const notes: string[] = [];
  if (customTypes.length) notes.push(localize('share.requires_custom_cards', { types: customTypes.join(', ') }));
  if (missing.length) {
    notes.push(localize('share.uses_other_templates', { names: missing.join(', ') }));
  }

  return { payload, notes };
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
