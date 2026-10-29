import { LovelaceThingType } from '../types';

/*
 * Idea 19: the Result, live, at the top of the editor instead of in an expandable at the
 * bottom - as the card the dashboard will draw, or as the YAML it builds with the line the
 * last edit changed lit, so the effect of an edit is found without reading the whole thing.
 */

export type PreviewMode = 'rendered' | 'yaml';

export interface PreviewLine {
  text: string;
  /** Not in the previous YAML, so the last edit put it there. */
  changed: boolean;
}

/** Which views make sense: only a card can be drawn on its own, so a row, a badge or an element is YAML only. */
export function previewModes(thingType: LovelaceThingType | undefined): PreviewMode[] {
  return thingType === 'card' ? ['rendered', 'yaml'] : ['yaml'];
}

/** The lines of the built YAML, with the ones the previous build did not have marked. The first build marks nothing. */
export function previewLines(previous: string | undefined, yaml: string): PreviewLine[] {
  const lines = yaml === '' ? [] : yaml.replace(/\n$/, '').split('\n');
  if (previous === undefined) return lines.map((text) => ({ text, changed: false }));
  const before = new Set(previous.replace(/\n$/, '').split('\n'));
  return lines.map((text) => ({ text, changed: !before.has(text) }));
}

/** How long a build took, as the timings panel would say it. */
export function buildTime(startedAt: number, finishedAt: number): string {
  const ms = Math.max(0, finishedAt - startedAt);
  return ms < 1 ? '<1 ms' : `${Math.round(ms)} ms`;
}
