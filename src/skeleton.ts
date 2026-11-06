/*
 * The place a card holds while it is still on its way (idea 48): a borrowed template being
 * fetched, a card waiting for hass, a lazy copy not yet near the screen. Sized from the
 * `grid_options` the card or its template asked for - a sections grid lays rows out at a
 * known height - so the layout is final from the first paint and nothing moves when the
 * card lands. A card that asks for nothing holds one row, which is still better than zero
 * height. Not animated unless a theme asks (`--decluttering-skeleton-animation`).
 */

/** Home Assistant's section grid: the height of a row and the gap between rows. */
export const SKELETON_ROW_HEIGHT = 56;
export const SKELETON_ROW_GAP = 8;

/** How many rows a `grid_options` asks for, when it asks for a number. */
export function skeletonRows(gridOptions: unknown): number | undefined {
  const rows = (gridOptions as { rows?: unknown } | undefined)?.rows;
  const count = typeof rows === 'number' ? rows : typeof rows === 'string' ? Number(rows) : NaN;
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : undefined;
}

/** The height, in pixels, a skeleton holds for a card asking for these grid options. */
export function skeletonHeight(gridOptions: unknown, rowHeight = SKELETON_ROW_HEIGHT, gap = SKELETON_ROW_GAP): number {
  const rows = skeletonRows(gridOptions) ?? 1;
  return rows * rowHeight + (rows - 1) * gap;
}

/*
 * A masonry view places cards by the size each says it is, before any is drawn, so a card
 * still waiting says it is an ordinary card (idea 10): three of Home Assistant's 50px units,
 * and a skeleton that tall. Saying 1 piled every waiting card at the top of its column.
 */
export const MASONRY_WAITING_SIZE = 3;
export const MASONRY_UNIT = 50;

/** Whether an element sits in a masonry view rather than a section, looking up through shadow roots. */
export function inMasonry(element: Element): boolean {
  let node: Node | null = element;
  while (node) {
    const tag = (node as Element).localName;
    if (tag === 'hui-masonry-view') return true;
    if (tag === 'hui-section' || tag === 'hui-grid-section' || tag === 'hui-panel-view') return false;
    node = node.parentNode ?? (node as ShadowRoot).host ?? null;
  }
  return false;
}
