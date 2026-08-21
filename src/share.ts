import { CONSUMER_TYPES, LEGACY_TEMPLATE_TYPE, TEMPLATE_TYPE } from './templates';
import { localize } from './localize';

/* eslint-disable @typescript-eslint/no-explicit-any */

// Anything this bundle provides itself, which whoever receives the export already has.
const OWN_TYPES = [TEMPLATE_TYPE, LEGACY_TEMPLATE_TYPE, ...CONSUMER_TYPES];

// The four things a template can define, exactly one of which it must.
const THING_KEYS = ['card', 'badge', 'row', 'element'];

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
    if (CONSUMER_TYPES.includes(type) && typeof node.template === 'string') templateRefs.add(node.template);
  });

  return {
    customTypes: [...customTypes].sort(),
    templateRefs: [...templateRefs].sort(),
  };
}

/**
 * A template ready to be handed to someone else: the config as it will be written out,
 * and the things they need to know that the config cannot tell them.
 */
export function buildExport(config: any): { payload: Record<string, any>; notes: string[] } {
  const payload: Record<string, any> = {};
  for (const key of EXPORT_KEY_ORDER) {
    if (config?.[key] !== undefined) payload[key] = config[key];
  }
  for (const key of Object.keys(config ?? {})) {
    if (!(key in payload)) payload[key] = config[key];
  }

  const { customTypes, templateRefs } = scanDependencies(config);
  const notes: string[] = [];
  if (customTypes.length) notes.push(localize('share.requires_custom_cards', { types: customTypes.join(', ') }));
  if (templateRefs.length) {
    notes.push(localize('share.uses_other_templates', { names: templateRefs.join(', ') }));
  }

  return { payload, notes };
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
