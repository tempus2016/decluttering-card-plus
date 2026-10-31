/*
 * Field-level help (idea 61): the wiki's own paragraph for a setting, fetched once from the
 * docs site's help index and shown beside the field. The index is built from the wiki by
 * docs-theme/help_index.py, so the help is never a second copy to keep in step. Without the
 * network there is still a link to the page.
 */

export interface HelpEntry {
  key: string;
  /** The page's title. */
  page: string;
  heading: string;
  /** The first paragraph under the heading, as plain text. */
  text: string;
  /** The first YAML block under it, when there is one. */
  yaml?: string;
  /** The page URL on the docs site, anchor included. */
  url: string;
}

export const DOCS_SITE = 'https://tempus2016.github.io/decluttering-card-plus/';
export const HELP_INDEX_URL = `${DOCS_SITE}help-index.json`;

// Where each setting is documented, for the link when the index cannot be read.
const PAGES: Record<string, string> = {
  template: 'Defining-Templates.html',
  type: 'Defining-Templates.html',
  description: 'Defining-Templates.html',
  category: 'Defining-Templates.html',
  variables: 'Describing-Variables.html',
  default: 'Variables.html',
  defaults: 'Variables.html',
  let: 'Variables.html',
  extends: 'Defining-Templates.html',
  examples: 'Describing-Variables.html',
  for_each: 'Repeating-a-Template.html',
  for_each_from: 'Repeating-a-Template.html',
  columns: 'Repeating-a-Template.html',
  min_column_width: 'Repeating-a-Template.html',
  gap: 'Styling.html',
  empty: 'Repeating-a-Template.html',
  lazy: 'Repeating-a-Template.html',
  style: 'Styling.html',
  grid_options: 'Styling.html',
  on_error: 'Using-Templates.html',
  rebuild_on: 'Using-Templates.html',
  debug: 'Troubleshooting.html',
  strict: 'Using-Templates.html',
  fit: 'Styling.html',
  group: 'Cards.html',
  publish: 'Using-Templates.html',
  suggest_for: 'Using-Templates.html',
  visibility: 'Visibility.html',
};

/** The docs page for a setting, with or without the index. */
export function helpUrl(key: string): string {
  return DOCS_SITE + (PAGES[key] ?? 'Configuration-Reference.html');
}

let index: Promise<Record<string, HelpEntry>> | undefined;

/** The help index, fetched once per page and remembered, even when it could not be read. */
export function loadHelpIndex(fetcher: typeof fetch = fetch): Promise<Record<string, HelpEntry>> {
  index ??= fetcher(HELP_INDEX_URL, { cache: 'force-cache' })
    .then(async (response) => {
      if (!response.ok) return {};
      const data: unknown = await response.json();
      return parseHelpIndex(data);
    })
    .catch(() => ({}));
  return index;
}

/** Only well-formed entries are kept: the index is public data, read with care. */
export function parseHelpIndex(data: unknown): Record<string, HelpEntry> {
  const out: Record<string, HelpEntry> = {};
  if (!data || typeof data !== 'object') return out;
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (!value || typeof value !== 'object') continue;
    const entry = value as Record<string, unknown>;
    if (typeof entry.page !== 'string' || typeof entry.text !== 'string' || typeof entry.url !== 'string') continue;
    // Only the docs site is linked to, whatever the index says.
    if (!entry.url.startsWith(DOCS_SITE)) continue;
    out[key] = {
      key,
      page: entry.page,
      heading: typeof entry.heading === 'string' ? entry.heading : '',
      text: entry.text,
      ...(typeof entry.yaml === 'string' ? { yaml: entry.yaml } : {}),
      url: entry.url,
    };
  }
  return out;
}

/** The help for one setting, or nothing when the index has none. */
export async function helpFor(key: string, fetcher?: typeof fetch): Promise<HelpEntry | undefined> {
  const all = await loadHelpIndex(fetcher);
  return all[key];
}

/** Tests only. */
export function resetHelpIndex(): void {
  index = undefined;
}
