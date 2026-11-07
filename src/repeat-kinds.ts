import { LovelaceThingType } from './types';

/*
 * Which kinds of template can repeat (idea 34), and which of a card's repeat options mean
 * nothing once the copies are rows or picture elements rather than cards in a grid.
 */

/** A card lays its copies out in a stack; a row or element hands them to one wrapper. A badge has nowhere to go. */
export function canRepeat(kind: LovelaceThingType | undefined): kind is 'card' | 'row' | 'element' {
  return kind === 'card' || kind === 'row' || kind === 'element';
}

// The options that shape a grid of cards. Rows run down the entities card and elements sit
// where their style puts them, so none of these has anything to act on.
const CARD_ONLY_OPTIONS = ['columns', 'min_column_width', 'gap', 'lazy', 'lazy_eager'];

/** The repeat options written on the card that a repeat of this kind ignores, in the order written. */
export function ignoredRepeatOptions(config: Record<string, unknown> | undefined, kind: LovelaceThingType): string[] {
  if (kind === 'card' || !config) return [];
  return Object.keys(config).filter((key) => CARD_ONLY_OPTIONS.includes(key) && config[key] !== undefined);
}
