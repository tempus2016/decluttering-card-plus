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

/** What a card asks of a sections grid, as Home Assistant reads it from `getGridOptions`. */
export interface GridOptions {
  columns?: number | string;
  rows?: number | string;
  min_columns?: number;
  max_columns?: number;
  min_rows?: number;
  max_rows?: number;
}

const clamp = (value: number, min?: number, max?: number): number =>
  Math.min(Math.max(value, min ?? -Infinity), max ?? Infinity);

/*
 * The cell a card gets in a sections grid, worked out the way Home Assistant's own section
 * does it: 12 columns and as many rows as it needs unless it says otherwise, and a number
 * kept between the card's own minimum and maximum. A group lays its cards out with this so
 * each one gets exactly the cell it would have had written straight into the section.
 */
export function gridSize(options: GridOptions | undefined): { columns: number | string; rows: number | string } {
  const rows = options?.rows ?? 'auto';
  const columns = options?.columns ?? 12;
  return {
    columns: typeof columns === 'string' ? columns : clamp(columns, options?.min_columns, options?.max_columns),
    rows: typeof rows === 'string' ? rows : clamp(rows, options?.min_rows, options?.max_rows),
  };
}
