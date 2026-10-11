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
