import { closestTemplate } from './closest';

/*
 * Every key a template under decluttering_templates may have (#494): the keys of
 * TemplateConfig in types.ts. Types are gone at run time, so they are written out here, and
 * test/schema.test.js keeps this list and the YAML schema built from the type in step.
 */
export const TEMPLATE_KEYS: readonly string[] = [
  'alert',
  'author',
  'badge',
  'base',
  'card',
  'category',
  'changes',
  'checks',
  'dashboard',
  'default',
  'defaults',
  'deprecated',
  'description',
  'editor_hide',
  'element',
  'examples',
  'extends',
  'for_each',
  'for_each_from',
  'function',
  'grid_options',
  'group',
  'groups',
  'help',
  'homepage',
  'item',
  'language',
  'let',
  'license',
  'name',
  'on_error',
  'parameters',
  'publish',
  'readme',
  'rebuild_on',
  'rebuild_on_watch',
  'related',
  'requires',
  'row',
  'setup',
  'show_card_errors',
  'strict',
  'style',
  'suggest_for',
  'types',
  'variables',
  'version',
  'visibility',
];

const KNOWN = new Set(TEMPLATE_KEYS);

export interface UnknownTemplateKey {
  template: string;
  key: string;
  /** The template key it is probably a slip for, when one is close. */
  closest?: string;
}

/*
 * The keys in a dashboard's decluttering_templates that no template reads, so the card
 * passes them over without a word: `variblees:` for `variables:`. Only the dashboard's own
 * definitions are read. A template card is a card as well, and Home Assistant and other
 * cards put keys of their own on it (view_layout, card_mod), so it is left alone.
 */
export function unknownTemplateKeys(ll: unknown): UnknownTemplateKey[] {
  const declared =
    ll && typeof ll === 'object' ? (ll as { decluttering_templates?: unknown }).decluttering_templates : undefined;
  if (!declared || typeof declared !== 'object' || Array.isArray(declared)) return [];
  const found: UnknownTemplateKey[] = [];
  for (const template of Object.keys(declared).sort()) {
    const definition = (declared as Record<string, unknown>)[template];
    if (!definition || typeof definition !== 'object' || Array.isArray(definition)) continue;
    for (const key of Object.keys(definition)) {
      if (KNOWN.has(key)) continue;
      const closest = closestTemplate(key, [...TEMPLATE_KEYS]);
      found.push(closest ? { template, key, closest } : { template, key });
    }
  }
  return found;
}
