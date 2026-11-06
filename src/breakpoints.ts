import { normaliseVariables } from './variables';

/*
 * Variables that only apply when the card is narrow (idea 42):
 *
 *   variables:
 *     - columns: 3
 *     - label: '[[area]] lights'
 *   variables_mobile:
 *     - columns: 2
 *     - label: '[[area]]'
 *   mobile_below: 600
 *
 * Narrow means the screen is a phone's, the way Home Assistant itself decides (its own
 * narrow layout starts at 870 px), so a desktop never reads as mobile just because the card
 * sits in a narrow column. A card that should switch on its own width says so with
 * `mobile_below: 500`, and is then measured itself. The overlay goes in front of the card's
 * variables, so a mobile value beats the card's own, and a template's `let:` still beats
 * both, as it does everything a card sets. Crossing the threshold builds the card again
 * once, the way a change of column count does.
 */
export const MOBILE_VARIABLES_KEY = 'variables_mobile';
export const MOBILE_BELOW_KEY = 'mobile_below';
/** The media query Home Assistant's own narrow layout answers to. */
export const MOBILE_VIEWPORT_QUERY = '(max-width: 870px)';

interface Breakable {
  variables?: unknown;
  variables_mobile?: unknown;
  mobile_below?: unknown;
}

/** Whether the card has mobile values to switch to at all. */
export function hasMobileVariables(config: Breakable | undefined): boolean {
  return normaliseVariables(config?.[MOBILE_VARIABLES_KEY as 'variables_mobile']).length > 0;
}

/** The card width, in pixels, below which the card counts as narrow - or nothing, when the screen decides. */
export function mobileThreshold(config: Breakable | undefined): number | undefined {
  const written = Number(config?.[MOBILE_BELOW_KEY as 'mobile_below']);
  return Number.isFinite(written) && written > 0 ? written : undefined;
}

/** Whether the screen is a phone's, by Home Assistant's own measure; never, where nothing can be asked. */
export function isMobileViewport(): boolean {
  return typeof matchMedia === 'function' && matchMedia(MOBILE_VIEWPORT_QUERY).matches;
}

/** Whether a measured width is narrow. Nothing measured yet - zero - is the desktop, as columns assume. */
export function isMobileWidth(width: number, threshold: number): boolean {
  return Number.isFinite(width) && width > 0 && width < threshold;
}

/**
 * The config as the build reads it: on a narrow card the mobile values go in front of the
 * card's own; either way the two mobile keys come out, so nothing downstream sees them.
 */
export function withMobileVariables<T extends Breakable>(config: T, mobile: boolean): T {
  const overlay = normaliseVariables(config?.[MOBILE_VARIABLES_KEY as 'variables_mobile']);
  if (!overlay.length && config?.[MOBILE_BELOW_KEY as 'mobile_below'] === undefined) return config;
  const out: Breakable = { ...config };
  delete out.variables_mobile;
  delete out.mobile_below;
  if (mobile && overlay.length) out.variables = [...overlay, ...normaliseVariables(config.variables)];
  return out as T;
}
