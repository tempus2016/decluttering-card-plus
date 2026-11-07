import { LovelaceConfig } from 'custom-card-helpers';
import { closestTemplate, isTemplateCardType, totalUsages } from './templates';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * What the error card says beyond the message (idea 49): which template, the line that
 * failed, the nearest name and how common it is, and what the card can do about it. The
 * message itself is still the one the console gets; this is the structure around it.
 */
export type ErrorKind = 'missing_template' | 'custom_missing' | 'unset' | 'check' | 'other';

export interface ErrorLine {
  key: string;
  value: string;
  /** What is wrong with it, in a few words: "not found", "not registered", "required by the template". */
  note: string;
}

export interface ErrorDetail {
  kind: ErrorKind;
  template?: string;
  line?: ErrorLine;
  /** The nearest existing template to a misspelt one, and how many cards use it here. */
  closest?: { name: string; uses: number };
  /** The custom element types the built card needs and the page does not have. */
  missingTypes?: string[];
  /** The variables left unset, when that is the error. */
  unset?: string[];
}

/** A template that is not there: the nearest name and its usage count, when there is one. */
export function missingTemplateDetail(
  ll: LovelaceConfig | null | undefined,
  template: string,
  available: string[],
  notFound: string,
): ErrorDetail {
  const closest = closestTemplate(template, available);
  return {
    kind: 'missing_template',
    template,
    line: { key: 'template', value: template, note: notFound },
    ...(closest ? { closest: { name: closest, uses: totalUsages(ll, closest) } } : {}),
  };
}

/** A built card whose custom element is not on the page. */
export function customMissingDetail(template: string | undefined, types: string[], notRegistered: string): ErrorDetail {
  return {
    kind: 'custom_missing',
    template,
    missingTypes: types,
    line: { key: 'type', value: types[0] ?? '', note: notRegistered },
  };
}

/** A strict card that refused because a variable has no value. */
export function unsetDetail(template: string | undefined, names: string[], required: string): ErrorDetail {
  return {
    kind: 'unset',
    template,
    unset: names,
    line: { key: names[0] ?? '', value: '', note: required },
  };
}

/*
 * A strict card a failed `error` check refused (#389 with #390). The check's own message is
 * what the card says, so the error itself is the message the error card shows.
 */
export function checkDetail(template: string | undefined): ErrorDetail {
  return { kind: 'check', template };
}

/** The config with its template swapped for the nearest one, the one key changed. */
export function withTemplate<T extends { template?: string }>(config: T, template: string): T {
  return { ...config, template };
}

/**
 * Where a card sits, as Home Assistant addresses it: `[view, card]` in a masonry view,
 * `[view, section, card]` in a sections view. Found by being written exactly like `config`,
 * which is how the editors find a card too. Undefined for a card nested in another card,
 * which the dialog cannot open on its own.
 */
export function findCardPath(ll: LovelaceConfig | null | undefined, config: unknown): number[] | undefined {
  const wanted = JSON.stringify(config);
  const views: any[] = Array.isArray((ll as any)?.views) ? (ll as any).views : [];
  for (let view = 0; view < views.length; view += 1) {
    const cards: any[] = Array.isArray(views[view]?.cards) ? views[view].cards : [];
    const card = cards.findIndex((each) => JSON.stringify(each) === wanted);
    if (card !== -1) return [view, card];
    const sections: any[] = Array.isArray(views[view]?.sections) ? views[view].sections : [];
    for (let section = 0; section < sections.length; section += 1) {
      const inSection: any[] = Array.isArray(sections[section]?.cards) ? sections[section].cards : [];
      const found = inSection.findIndex((each) => JSON.stringify(each) === wanted);
      if (found !== -1) return [view, section, found];
    }
  }
  return undefined;
}

/**
 * Where the template card defining `name` sits, in the same shape, so the chip and the
 * error card can open it in Home Assistant's own editor. Undefined for a template declared
 * under the root key, which has no card to open, and for one defined inside a stack.
 */
export function templateEditPath(ll: LovelaceConfig | null | undefined, name: string): number[] | undefined {
  const defines = (card: any): boolean => isTemplateCardType(card?.type) && card?.template === name;
  const views: any[] = Array.isArray((ll as any)?.views) ? (ll as any).views : [];
  for (let view = 0; view < views.length; view += 1) {
    const cards: any[] = Array.isArray(views[view]?.cards) ? views[view].cards : [];
    const card = cards.findIndex(defines);
    if (card !== -1) return [view, card];
    const sections: any[] = Array.isArray(views[view]?.sections) ? views[view].sections : [];
    for (let section = 0; section < sections.length; section += 1) {
      const inSection: any[] = Array.isArray(sections[section]?.cards) ? sections[section].cards : [];
      const found = inSection.findIndex(defines);
      if (found !== -1) return [view, section, found];
    }
  }
  return undefined;
}
