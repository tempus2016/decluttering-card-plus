/*
 * The parts of the edit-mode chip (idea 47) that need no browser: its tag and its words.
 */
export const CHIP_TAG = 'decluttering-card-plus-chip';

export type ChipAction = 'edit' | 'where_used' | 'show' | 'eject';

/** The chip's text: the template, and the dashboard it is borrowed from after a dot. */
export function chipLabel(name: string, source?: string): string {
  return source ? `${name} · ${source}` : name;
}

/** The copy count a repeat shows beside its name, or nothing for a single card. */
export function copiesLabel(copies: number | undefined): string {
  return typeof copies === 'number' && copies > 1 ? `×${copies}` : '';
}
