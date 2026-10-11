import { entityPasses, RegistrySource } from './registry';
import { TemplateConfig } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface EntitySuggestion {
  label: string;
  config: { type: string; template: string; variables: Record<string, string>[] };
}

/*
 * What Home Assistant's add-card dialog offers for one entity: a card per template that
 * says, with `suggest_for:`, which entities it is meant for. The filters are the ones a
 * repeat over entities takes, and the entity goes in as `entity`, the name a repeat
 * gives it too - so a template written for one works for the other unchanged.
 */
export function entitySuggestions(
  hass: any,
  entityId: string,
  templates: Record<string, TemplateConfig>,
  kind: 'card' | 'badge',
  type: string,
): EntitySuggestion[] {
  return Object.keys(templates)
    .sort()
    .filter((name) => {
      const template = templates[name] as any;
      return template?.[kind] !== undefined && entityPasses(hass, entityId, template.suggest_for as RegistrySource);
    })
    .map((name) => ({ label: name, config: { type, template: name, variables: [{ entity: entityId }] } }));
}

export interface PublishedTemplate {
  template: string;
  kind: 'card' | 'badge';
  /** The custom element the picker knows the entry by. */
  tag: string;
  name: string;
  description?: string;
}

const PUBLISH_PREFIX = 'decluttering-card-plus--';

/*
 * The card a published entry adds: an ordinary decluttering card using the template. A
 * template that says which entities it is for, with `suggest_for:`, starts out with the
 * first of them filled in - the way Home Assistant's own cards pick an entity to show -
 * so the dialog's preview is the card rather than an "Entity not found".
 */
export function publishedStub(hass: any, template: string, config: TemplateConfig | undefined, type: string): any {
  const stub: any = { type, template };
  const filter = (config as any)?.suggest_for;
  if (filter && typeof filter === 'object') {
    const entity = Object.keys(hass?.states ?? {})
      .sort()
      .find((entityId) => entityPasses(hass, entityId, filter as RegistrySource));
    if (entity) stub.variables = [{ entity }];
  }
  return stub;
}

/**
 * The element name a published template is listed under. Home Assistant's card list knows
 * an entry only by its element type, so each template needs one of its own; the name has
 * to be a valid custom element name, which a template name often is not.
 */
export function publishTag(template: string): string {
  const slug = template
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return PUBLISH_PREFIX + (slug || 'template');
}

/*
 * The templates that ask, with `publish:`, to be listed in Home Assistant's add-card dialog
 * as cards of their own. `publish: true` lists one under its template name, and a string
 * under that name instead. Only cards and badges have a list to be in. Two names that come
 * out as the same element name are told apart by a number.
 */
export function publishedTemplates(templates: Record<string, TemplateConfig>): PublishedTemplate[] {
  const taken = new Set<string>();
  const out: PublishedTemplate[] = [];
  for (const template of Object.keys(templates).sort()) {
    const config = templates[template] as any;
    const publish = config?.publish;
    if (publish !== true && !(typeof publish === 'string' && publish.trim())) continue;
    const kind = config.card !== undefined ? 'card' : config.badge !== undefined ? 'badge' : undefined;
    if (!kind) continue;
    let tag = publishTag(template);
    for (let n = 2; taken.has(tag); n++) tag = `${publishTag(template)}-${n}`;
    taken.add(tag);
    out.push({
      template,
      kind,
      tag,
      name: typeof publish === 'string' ? publish.trim() : template,
      ...(typeof config.description === 'string' ? { description: config.description } : {}),
    });
  }
  return out;
}
