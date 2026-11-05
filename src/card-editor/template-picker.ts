import { LovelaceConfig } from 'custom-card-helpers';
import { TemplateConfig } from '../types';
import { deprecationOf, totalUsages } from '../templates';
import { localize } from '../localize';

/*
 * Idea 21: the Template dropdown as a combo box. Typing filters by name and description;
 * templates are grouped by their `category:`, the ones without one first under no heading
 * so a dashboard that never set one sees a plain list with search; each row is the name,
 * its description underneath, and how many cards on this dashboard use it. Borrowed
 * templates sit under the dashboard they come from, and a deprecated one says so and shows
 * its replacement note as its description.
 */

export interface PickerItem {
  value: string;
  /** What the closed box shows: the name. */
  label: string;
  description?: string;
  category?: string;
  /** How many cards on this dashboard use it; also other templates that build on it. */
  count: number;
  deprecated: boolean;
  /** The dashboard it is borrowed from, when it is. */
  borrowed?: string;
  /** Lower-cased text the filter looks through. */
  search: string;
}

const CONTENT_KEYS = ['card', 'badge', 'row', 'element', 'group'];

export function pickerItems(
  templates: Record<string, TemplateConfig>,
  ll: LovelaceConfig | null | undefined,
  hass: unknown,
  borrowedFrom: (name: string) => string | undefined = () => undefined,
): PickerItem[] {
  const items: PickerItem[] = [];
  for (const [name, template] of Object.entries(templates)) {
    // An item template is not something a card can be built from.
    if (!CONTENT_KEYS.some((key) => key in (template as object))) continue;
    const retired = deprecationOf(template);
    const description =
      typeof retired === 'string' && retired
        ? retired
        : typeof template.description === 'string'
          ? template.description
          : undefined;
    const category = typeof template.category === 'string' && template.category ? template.category : undefined;
    const borrowed = borrowedFrom(name);
    items.push({
      value: name,
      label: retired !== undefined ? name + localize('editor.deprecated_suffix', undefined, hass as undefined) : name,
      description,
      category,
      count: totalUsages(ll, name),
      deprecated: retired !== undefined,
      borrowed,
      search: [name, description ?? '', category ?? '', borrowed ?? ''].join(' ').toLowerCase(),
    });
  }
  const rank = (item: PickerItem): [number, string, number, string] => [
    item.borrowed ? 2 : item.category ? 1 : 0,
    item.borrowed ?? item.category ?? '',
    item.deprecated ? 1 : 0,
    item.value.toLowerCase(),
  ];
  return items.sort((a, b) => {
    const ra = rank(a);
    const rb = rank(b);
    for (let i = 0; i < ra.length; i += 1) {
      if (ra[i] < rb[i]) return -1;
      if (ra[i] > rb[i]) return 1;
    }
    return 0;
  });
}

/** The items whose name, description, category or dashboard contain every word typed. */
export function filterPickerItems(items: PickerItem[], text: string): PickerItem[] {
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return items;
  return items.filter((item) => words.every((word) => item.search.includes(word)));
}

/** The heading an item opens, when it is the first of its group: its category, or the dashboard it is borrowed from. */
export function groupHeading(item: PickerItem, previous: PickerItem | undefined, hass?: unknown): string | undefined {
  const key = (each: PickerItem | undefined): string =>
    each ? `${each.borrowed ? 'b:' + each.borrowed : each.category ? 'c:' + each.category : ''}` : '';
  if (key(item) === '' || key(item) === key(previous)) return undefined;
  return item.borrowed
    ? localize('editor.picker.borrowed_from', { dashboard: item.borrowed }, hass as undefined)
    : item.category;
}

/** What the count says in a row. */
export function countText(count: number, hass?: unknown): string {
  if (count === 0) return localize('editor.picker.unused', undefined, hass as undefined);
  if (count === 1) return localize('editor.picker.used_one', undefined, hass as undefined);
  return localize('editor.picker.used_many', { count }, hass as undefined);
}
