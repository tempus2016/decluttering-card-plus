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
