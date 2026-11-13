import { DeclutteringCardConfig, TemplateConfig } from '../types';
import { BY_DOMAIN_KEY, deprecationOf } from '../templates';
import { localize } from '../localize';
import { isBaseTemplate } from './template-picker';

/*
 * Idea 16: `template_by_domain:` as a table of domain to template. The mapping is written
 * back exactly as a hand writes it, `default:` last; a mapping the table cannot read (a
 * value that is not a template name) is left to the alert the editor showed before.
 */

export interface ByDomainRow {
  domain: string;
  template: string;
}

const DEFAULT_KEY = 'default';

function mappingOf(config: unknown): Record<string, unknown> | undefined {
  const written = (config as Record<string, unknown> | undefined)?.[BY_DOMAIN_KEY];
  return written && typeof written === 'object' && !Array.isArray(written)
    ? (written as Record<string, unknown>)
    : undefined;
}

/** Whether every value is a template name, which is all the table knows how to show. */
export function isReadableByDomain(config: unknown): boolean {
  const mapping = mappingOf(config);
  return !mapping || Object.values(mapping).every((value) => typeof value === 'string');
}

/** The rows of the table, and the template for anything else. */
export function byDomainRows(config: unknown): { rows: ByDomainRow[]; fallback: string | undefined } {
  const mapping = mappingOf(config) ?? {};
  const rows = Object.entries(mapping)
    .filter(([domain, template]) => domain !== DEFAULT_KEY && typeof template === 'string')
    .map(([domain, template]) => ({ domain, template: template as string }));
  const fallback = typeof mapping[DEFAULT_KEY] === 'string' ? (mapping[DEFAULT_KEY] as string) : undefined;
  return { rows, fallback };
}

/** The card with the table written back. Empty rows are dropped; no rows and no default take the key away. */
export function applyByDomainRows(
  config: DeclutteringCardConfig,
  rows: ByDomainRow[],
  fallback: string,
): DeclutteringCardConfig {
  const mapping: Record<string, string> = {};
  for (const row of rows) {
    const domain = row.domain?.trim();
    const template = row.template?.trim();
    if (domain && template && domain !== DEFAULT_KEY) mapping[domain] = template;
  }
  if (fallback?.trim()) mapping[DEFAULT_KEY] = fallback.trim();
  const out = { ...config } as Record<string, unknown>;
  if (Object.keys(mapping).length) out[BY_DOMAIN_KEY] = mapping;
  else delete out[BY_DOMAIN_KEY];
  return out as DeclutteringCardConfig;
}

// A template that builds a card: a `card:` or a `group:`, which is a card made of cards.
function isCardTemplate(template: TemplateConfig | undefined): boolean {
  return (
    !!template &&
    ((template as { card?: unknown }).card !== undefined || (template as { group?: unknown }).group !== undefined)
  );
}

/** The templates a copy can be built from: cards only, since every copy has to be one. */
export function cardTemplateOptions(
  templates: Record<string, TemplateConfig>,
  hass?: unknown,
): { value: string; label: string }[] {
  return Object.keys(templates)
    .filter((name) => isCardTemplate(templates[name]) && !isBaseTemplate(templates[name]))
    .sort()
    .map((name) => ({
      value: name,
      label:
        deprecationOf(templates[name]) !== undefined
          ? name + localize('editor.deprecated_suffix', undefined, hass as undefined)
          : name,
    }));
}

/** The domains not mapped yet, which is what a new row offers first. */
export function remainingDomains(all: string[], rows: ByDomainRow[]): string[] {
  const taken = new Set(rows.map((row) => row.domain));
  return all.filter((domain) => !taken.has(domain));
}
