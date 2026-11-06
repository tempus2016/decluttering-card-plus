import { LovelaceConfig } from 'custom-card-helpers';
import { TemplateConfig, VariablesConfig } from './types';
import { CONSUMER_TYPES, closestTemplate, deprecationOf } from './templates';
import { diagnoseInstance, forEachNames, normaliseVariables, POSITION_NAMES } from './variables';
import { isRegistrySource, registryNames } from './registry';
import { rebuildOnEntities } from './rebuild';
import { structureNames } from './structure';

/* eslint-disable @typescript-eslint/no-explicit-any */

// The keys a card's values are named by, in the order a person would look for one.
const LABEL_KEYS = ['name', 'area', 'friendly_name', 'floor', 'label', 'device', 'entity', 'item'];

/** A short name for a card from its values: the first named one, else the first plain value. */
function itemLabel(item: unknown, index: number): string {
  if (item && typeof item === 'object' && !Array.isArray(item)) {
    const record = item as Record<string, unknown>;
    for (const key of LABEL_KEYS) {
      if (typeof record[key] === 'string' && record[key]) return record[key] as string;
    }
    const scalar = Object.values(record).find((value) => typeof value === 'string' || typeof value === 'number');
    if (scalar !== undefined) return String(scalar);
  } else if (typeof item === 'string' || typeof item === 'number') {
    return String(item);
  }
  return `#${index + 1}`;
}

/*
 * The checks behind the health card and badge (idea 50), with nothing that needs a browser:
 * every card on a dashboard with something to look at, and the counts the badge wears.
 */
export const HEALTH_CARD_TAG = 'decluttering-card-plus-health-card';
export const HEALTH_CARD_TYPE = `custom:${HEALTH_CARD_TAG}`;

export type HealthKind = 'missing' | 'unset' | 'deprecated';

export interface HealthEntry {
  kind: HealthKind;
  /** The dashboard's url path, `lovelace` for the original. */
  dashboard: string;
  view: { index: number; title: string };
  /** Where Home Assistant's editor finds the card: [view, card] or [view, section, card]. */
  path: number[];
  /** What the card is called: its `name:`, else its first value worth a name, else its template. */
  label: string;
  template: string;
  closest?: string;
  names?: string[];
  message?: string;
}

export interface HealthCounts {
  missing: number;
  unset: number;
  deprecated: number;
  fine: number;
  cards: number;
}

export interface HealthReport {
  counts: HealthCounts;
  entries: HealthEntry[];
}

export interface HealthCardConfig {
  type: string;
  dashboards?: 'this' | 'all';
  show?: HealthKind[] | string;
  limit?: number;
  hide_when_clean?: boolean;
  title?: string;
}

export const ALL_KINDS: HealthKind[] = ['missing', 'unset', 'deprecated'];

/** Which kinds the card shows: all three unless it says. */
export function shownKinds(show: unknown): HealthKind[] {
  const list = Array.isArray(show) ? show : typeof show === 'string' ? show.split(',').map((s) => s.trim()) : [];
  const kinds = list.filter((each): each is HealthKind => ALL_KINDS.includes(each as HealthKind));
  return kinds.length ? kinds : ALL_KINDS;
}

/** The names a repeat gives every copy of a card, so they do not count as unset. */
function suppliedBy(card: any): string[] {
  return [
    ...rebuildOnEntities(card.rebuild_on),
    ...forEachNames(card.for_each),
    ...registryNames(card.for_each_from),
    ...(isRegistrySource(card.for_each_from) ? [...POSITION_NAMES, 'total'] : []),
  ];
}

/** What to call a card in the list: its own name, else the first value worth a name, else its template. */
export function cardLabel(card: any): string {
  if (typeof card?.name === 'string' && card.name) return card.name;
  const values: Record<string, unknown> = {};
  for (const entry of normaliseVariables(card?.variables)) Object.assign(values, entry);
  const label = Object.keys(values).length ? itemLabel(values, 0) : '';
  return label && !label.startsWith('#') ? label : String(card?.template ?? '');
}

/**
 * Every card on the dashboard with something to look at: pointing at a template that is not
 * there, leaving a variable unset, or using a deprecated template. `templates` is every
 * template the dashboard can see, borrowed ones included; `borrowed` names the ones that
 * are still on their way, so they are not called missing.
 */
export function healthEntries(
  ll: LovelaceConfig | null | undefined,
  templates: Record<string, TemplateConfig>,
  dashboard: string,
  kinds: HealthKind[] = ALL_KINDS,
): HealthReport {
  const counts: HealthCounts = { missing: 0, unset: 0, deprecated: 0, fine: 0, cards: 0 };
  const entries: HealthEntry[] = [];
  const available = Object.keys(templates);
  const itemNames = available.filter((name) => 'item' in (templates[name] ?? {}));
  const views: any[] = Array.isArray((ll as any)?.views) ? (ll as any).views : [];

  const inspect = (card: any, view: HealthEntry['view'], path: number[], handed: string[]): void => {
    if (!card || typeof card !== 'object') return;
    if (Array.isArray(card)) {
      card.forEach((each) => inspect(each, view, path, handed));
      return;
    }
    if (CONSUMER_TYPES.includes(card.type) && typeof card.template === 'string') {
      counts.cards += 1;
      const template = Object.prototype.hasOwnProperty.call(templates, card.template)
        ? templates[card.template]
        : undefined;
      const base = { dashboard, view, path, label: cardLabel(card), template: card.template };
      let problems = 0;
      if (!template) {
        counts.missing += 1;
        problems += 1;
        if (kinds.includes('missing')) {
          const closest = closestTemplate(card.template, available);
          entries.push({ kind: 'missing', ...base, ...(closest ? { closest } : {}) });
        }
      } else {
        const supplements = [
          ...suppliedBy(card),
          ...handed,
          ...structureNames(template, normaliseVariables(card.variables)),
          ...itemNames,
        ].map((name) => ({ [name]: null }) as VariablesConfig);
        const missing = diagnoseInstance(card.variables, template, supplements).missing;
        if (missing.length) {
          counts.unset += 1;
          problems += 1;
          if (kinds.includes('unset')) entries.push({ kind: 'unset', ...base, names: missing });
        }
        const retired = deprecationOf(template);
        if (retired !== undefined) {
          counts.deprecated += 1;
          problems += 1;
          if (kinds.includes('deprecated')) entries.push({ kind: 'deprecated', ...base, message: retired });
        }
      }
      if (!problems) counts.fine += 1;
    }
    // Cards inside this one keep its path: the editor opens the outermost card.
    for (const [key, value] of Object.entries(card)) {
      if (key === 'variables' || key === 'for_each' || key === 'slots') continue;
      inspect(value, view, path, handed);
    }
  };

  views.forEach((viewConfig, index) => {
    if (!viewConfig || typeof viewConfig !== 'object') return;
    const view = { index, title: String(viewConfig.title ?? viewConfig.path ?? '') };
    const cards: any[] = Array.isArray(viewConfig.cards) ? viewConfig.cards : [];
    cards.forEach((card, cardIndex) => inspect(card, view, [index, cardIndex], []));
    const sections: any[] = Array.isArray(viewConfig.sections) ? viewConfig.sections : [];
    sections.forEach((section, sectionIndex) => {
      const inSection: any[] = Array.isArray(section?.cards) ? section.cards : [];
      inSection.forEach((card, cardIndex) => inspect(card, view, [index, sectionIndex, cardIndex], []));
    });
    // A view strategy's repeated sections hand their copy's values down; those cards are checked loosely.
    const strategy = viewConfig.strategy;
    if (strategy && typeof strategy === 'object') {
      for (const list of [strategy.sections, strategy.badges]) {
        if (!Array.isArray(list)) continue;
        list.forEach((entry: any) => {
          const handed = [
            ...suppliedBy(entry ?? {}),
            ...normaliseVariables(entry?.variables).map((v) => Object.keys(v)[0]),
            ...normaliseVariables(strategy.variables).map((v) => Object.keys(v)[0]),
          ];
          inspect(entry?.section ?? entry?.badge ?? entry, view, [index], handed);
        });
      }
    }
  });
  return { counts, entries };
}

/** The number the badge wears: everything there is to look at. */
export function toLookAt(counts: HealthCounts): number {
  return counts.missing + counts.unset + counts.deprecated;
}
