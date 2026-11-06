import { TemplateConfig, VariablesConfig } from './types';
import { normaliseVariables, SLOT_STEP } from './variables';

/*
 * Slots (idea 35): a template leaves a place a card fills with cards of its own.
 *
 *   room_frame:
 *     card:
 *       type: vertical-stack
 *       cards:
 *         - type: heading
 *           heading: '[[area]]'
 *         - [[body|slot]]
 *         - [[footer|slot?]]
 *
 * `|slot` is a step that puts a list-valued variable into the list it sits in, entry for
 * entry, through the same splice a `repeat:` uses - so the frame is the template's and the
 * tiles inside it are the card's, exactly as written. A mapping is one card; an optional
 * slot nothing fills drops out of the list like any optional placeholder; a required one
 * left empty stays visible and is reported unset, as `[[body]]` would be.
 *
 * The card writes the cards under `slots:` (mockup) or straight under `variables:` - the two
 * are the same thing, and `slots:` is folded in front of `variables:` here so a slot beats a
 * variable of the same name.
 */
export const SLOTS_KEY = 'slots';

/** The config with its `slots:` folded into `variables:`, in front, and the key gone. */
export function withSlotVariables<T extends { variables?: unknown; slots?: unknown }>(config: T): T {
  const slots = config?.[SLOTS_KEY as 'slots'];
  if (!slots || typeof slots !== 'object' || Array.isArray(slots)) return config;
  const entries: VariablesConfig[] = Object.entries(slots as Record<string, unknown>).map(([name, value]) => ({
    [name]: value,
  }));
  if (!entries.length) return config;
  const out = { ...config, variables: [...entries, ...normaliseVariables(config.variables)] };
  delete (out as { slots?: unknown }).slots;
  return out;
}

const SLOT_PLACEHOLDER = new RegExp(`\\[\\[([^|[\\]?]+)\\|${SLOT_STEP}\\??\\]\\]`, 'g');

/** The names a template's `|slot` placeholders ask for, each once, in the order written. */
export function slotNames(template: TemplateConfig | undefined): string[] {
  if (!template) return [];
  const names: string[] = [];
  const json = JSON.stringify(template);
  if (typeof json !== 'string') return names;
  for (let match = SLOT_PLACEHOLDER.exec(json); match !== null; match = SLOT_PLACEHOLDER.exec(json)) {
    if (!names.includes(match[1])) names.push(match[1]);
  }
  SLOT_PLACEHOLDER.lastIndex = 0;
  return names;
}
