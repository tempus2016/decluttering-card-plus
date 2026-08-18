import { LEGACY_TEMPLATE_TYPE, TEMPLATE_TYPE } from './templates';

/* eslint-disable @typescript-eslint/no-explicit-any */

// The cards that consume a template, as opposed to the ones that define it. A template
// nested inside another template is one of these, and names the template it needs.
const CONSUMER_TYPES = ['custom:decluttering-card-plus', 'custom:decluttering-card'];

// Anything this bundle provides itself, which whoever receives the export already has.
const OWN_TYPES = [TEMPLATE_TYPE, LEGACY_TEMPLATE_TYPE, ...CONSUMER_TYPES];

// The four things a template can define, exactly one of which it must.
const THING_KEYS = ['card', 'badge', 'row', 'element'];

// Read order for the exported YAML: what the template is, then what it takes, then what
// it draws. Whatever is left over follows, so nothing is silently dropped.
const EXPORT_KEY_ORDER = ['type', 'template', 'default', ...THING_KEYS, 'style'];

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
  if (customTypes.length) notes.push(`Requires these custom cards: ${customTypes.join(', ')}`);
  if (templateRefs.length) {
    notes.push(`Uses these other templates, which are not included here: ${templateRefs.join(', ')}`);
  }

  return { payload, notes };
}

/**
 * Whether pasted text describes a template. Every problem is reported together, so that
 * fixing one does not just reveal the next.
 */
export function validateImport(parsed: any): { ok: boolean; errors: string[] } {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, errors: ['This does not look like a template: it should be a block of YAML keys and values.'] };
  }

  const errors: string[] = [];
  if (typeof parsed.template !== 'string' || !parsed.template.trim()) {
    errors.push('This template has no name: it needs a "template:" line.');
  }

  const things = THING_KEYS.filter((key) => parsed[key] !== undefined);
  if (things.length === 0) {
    errors.push('This template defines nothing: it needs one of "card:", "badge:", "row:" or "element:".');
  } else if (things.length > 1) {
    errors.push(`This template defines both "${things[0]}" and "${things[1]}": it can only define one of them.`);
  }

  return { ok: errors.length === 0, errors };
}
