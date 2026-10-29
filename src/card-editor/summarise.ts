import { localize } from '../localize';

/*
 * One line to stand for a chosen card, wherever the editor shows a card it holds as YAML.
 */
export interface CardSummary {
  /** The card's type, without the `custom:` prefix. */
  type: string;
  /** Its first line of text: content, title, name, entity, or how many cards it holds. */
  text: string;
}

/** One line to stand for a chosen card. */
export function summariseCard(config: unknown): CardSummary | undefined {
  if (!config || typeof config !== 'object' || Array.isArray(config)) return undefined;
  const card = config as Record<string, unknown>;
  const rawType = typeof card.type === 'string' ? card.type : '';
  const custom = rawType.startsWith('custom:');
  const type = custom ? rawType.slice('custom:'.length) : rawType ? rawType[0].toUpperCase() + rawType.slice(1) : '';
  const firstLine = (value: unknown): string | undefined =>
    typeof value === 'string' && value.trim() ? value.split('\n')[0].trim() : undefined;
  const cards = Array.isArray(card.cards) ? card.cards.length : undefined;
  const text =
    firstLine(card.content) ??
    firstLine(card.title) ??
    firstLine(card.name) ??
    firstLine(card.entity) ??
    (cards !== undefined ? localize('editor.slot.cards', { count: cards }) : '');
  return { type, text };
}
