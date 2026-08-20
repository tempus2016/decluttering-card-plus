/**
 * How many columns a repeated template is laid out in.
 *
 * `columns` alone is a fixed count, which is cramped on a phone and wasteful on a wide
 * screen. `min_column_width` says how narrow a copy may get instead, and `columns` becomes
 * the most it will ever use - so one card reads sensibly on both.
 */
export function columnsFor(width: number, max: number, minWidth?: number): number {
  const most = Math.max(1, Math.floor(max) || 1);
  // Before the card is in the page there is no width to measure. Laying out at the most
  // columns asked for and narrowing on the first measurement avoids a visible reflow from
  // one column outwards, which is the more jarring of the two.
  if (!minWidth || minWidth <= 0 || !width || width <= 0) return most;
  return Math.min(most, Math.max(1, Math.floor(width / minWidth)));
}
