import { PickerItem, groupHeading, countText, filterPickerItems } from './template-picker';

/*
 * Idea 21 on a Home Assistant that has `ha-generic-picker` (2025.7 and later) and no
 * `ha-combo-box` (gone in 2026.7): the same rows, as the items that picker takes. A heading
 * - a category, or the dashboard a template is borrowed from - is a plain string in front of
 * its group, which the picker draws as a section title and never offers to pick.
 */

export interface ComboItem {
  id: string;
  primary: string;
  secondary?: string;
  /** Every word the editor's own filter looks through, for the picker's search keys. */
  search: string;
  sorting_label: string;
}

/** The picker's items, in the editor's order, without headings. */
export function comboItems(items: PickerItem[], hass?: unknown): ComboItem[] {
  return items.map((item, index) => ({
    id: item.value,
    primary: item.label,
    secondary: [item.description, countText(item.count, hass)].filter(Boolean).join(' · '),
    search: item.search,
    // Padded, so the picker's own sort - when it is not told to keep ours - keeps our order.
    sorting_label: String(index).padStart(6, '0'),
  }));
}

/**
 * What the picker lists for a search, empty for the whole list: the items that match every
 * word, in the editor's order, each group led by its heading as a plain string - which is how
 * Home Assistant's picker takes a section title. Used for getItems and for searchFn, so the
 * headings are there before anything is typed (searchFn is only called once something is)
 * and the search matches what the editor's own filter always matched.
 */
export function pickerList(all: PickerItem[], search: string, hass?: unknown): (ComboItem | string)[] {
  const combo = new Map(comboItems(all, hass).map((item) => [item.id, item]));
  const out: (ComboItem | string)[] = [];
  let previous: PickerItem | undefined;
  for (const item of filterPickerItems(all, search)) {
    const heading = groupHeading(item, previous, hass);
    if (heading) out.push(heading);
    out.push(combo.get(item.value) as ComboItem);
    previous = item;
  }
  return out;
}
