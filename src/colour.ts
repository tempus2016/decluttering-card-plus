/*
 * Colours for a placeholder (idea 41). One colour variable written once; `lighten:`,
 * `darken:`, `alpha:`, `mix:` and `contrast` derive a tint, a shade, a wash, a blend or a
 * readable text colour from it, so a `type: color` declaration's one pick carries a whole
 * scheme. Each reads a hex, an rgb() or a named CSS colour and writes a hex back (alpha
 * writes rgba()), so the result goes anywhere CSS goes. A theme variable - `var(--x)` -
 * cannot be read at build time, and is passed through untouched with a word in the console.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
  /** 0 to 1; 1 when the colour was written without one. */
  a: number;
}

// The CSS named colours, as the browser knows them.
const NAMED: Record<string, string> = {
  aliceblue: 'f0f8ff',
  antiquewhite: 'faebd7',
  aqua: '00ffff',
  aquamarine: '7fffd4',
  azure: 'f0ffff',
  beige: 'f5f5dc',
  bisque: 'ffe4c4',
  black: '000000',
  blanchedalmond: 'ffebcd',
  blue: '0000ff',
  blueviolet: '8a2be2',
  brown: 'a52a2a',
  burlywood: 'deb887',
  cadetblue: '5f9ea0',
  chartreuse: '7fff00',
  chocolate: 'd2691e',
  coral: 'ff7f50',
  cornflowerblue: '6495ed',
  cornsilk: 'fff8dc',
  crimson: 'dc143c',
  cyan: '00ffff',
  darkblue: '00008b',
  darkcyan: '008b8b',
  darkgoldenrod: 'b8860b',
  darkgray: 'a9a9a9',
  darkgreen: '006400',
  darkgrey: 'a9a9a9',
  darkkhaki: 'bdb76b',
  darkmagenta: '8b008b',
  darkolivegreen: '556b2f',
  darkorange: 'ff8c00',
  darkorchid: '9932cc',
  darkred: '8b0000',
  darksalmon: 'e9967a',
  darkseagreen: '8fbc8f',
  darkslateblue: '483d8b',
  darkslategray: '2f4f4f',
  darkslategrey: '2f4f4f',
  darkturquoise: '00ced1',
  darkviolet: '9400d3',
  deeppink: 'ff1493',
  deepskyblue: '00bfff',
  dimgray: '696969',
  dimgrey: '696969',
  dodgerblue: '1e90ff',
  firebrick: 'b22222',
  floralwhite: 'fffaf0',
  forestgreen: '228b22',
  fuchsia: 'ff00ff',
  gainsboro: 'dcdcdc',
  ghostwhite: 'f8f8ff',
  gold: 'ffd700',
  goldenrod: 'daa520',
  gray: '808080',
  green: '008000',
  greenyellow: 'adff2f',
  grey: '808080',
  honeydew: 'f0fff0',
  hotpink: 'ff69b4',
  indianred: 'cd5c5c',
  indigo: '4b0082',
  ivory: 'fffff0',
  khaki: 'f0e68c',
  lavender: 'e6e6fa',
  lavenderblush: 'fff0f5',
  lawngreen: '7cfc00',
  lemonchiffon: 'fffacd',
  lightblue: 'add8e6',
  lightcoral: 'f08080',
  lightcyan: 'e0ffff',
  lightgoldenrodyellow: 'fafad2',
  lightgray: 'd3d3d3',
  lightgreen: '90ee90',
  lightgrey: 'd3d3d3',
  lightpink: 'ffb6c1',
  lightsalmon: 'ffa07a',
  lightseagreen: '20b2aa',
  lightskyblue: '87cefa',
  lightslategray: '778899',
  lightslategrey: '778899',
  lightsteelblue: 'b0c4de',
  lightyellow: 'ffffe0',
  lime: '00ff00',
  limegreen: '32cd32',
  linen: 'faf0e6',
  magenta: 'ff00ff',
  maroon: '800000',
  mediumaquamarine: '66cdaa',
  mediumblue: '0000cd',
  mediumorchid: 'ba55d3',
  mediumpurple: '9370db',
  mediumseagreen: '3cb371',
  mediumslateblue: '7b68ee',
  mediumspringgreen: '00fa9a',
  mediumturquoise: '48d1cc',
  mediumvioletred: 'c71585',
  midnightblue: '191970',
  mintcream: 'f5fffa',
  mistyrose: 'ffe4e1',
  moccasin: 'ffe4b5',
  navajowhite: 'ffdead',
  navy: '000080',
  oldlace: 'fdf5e6',
  olive: '808000',
  olivedrab: '6b8e23',
  orange: 'ffa500',
  orangered: 'ff4500',
  orchid: 'da70d6',
  palegoldenrod: 'eee8aa',
  palegreen: '98fb98',
  paleturquoise: 'afeeee',
  palevioletred: 'db7093',
  papayawhip: 'ffefd5',
  peachpuff: 'ffdab9',
  peru: 'cd853f',
  pink: 'ffc0cb',
  plum: 'dda0dd',
  powderblue: 'b0e0e6',
  purple: '800080',
  rebeccapurple: '663399',
  red: 'ff0000',
  rosybrown: 'bc8f8f',
  royalblue: '4169e1',
  saddlebrown: '8b4513',
  salmon: 'fa8072',
  sandybrown: 'f4a460',
  seagreen: '2e8b57',
  seashell: 'fff5ee',
  sienna: 'a0522d',
  silver: 'c0c0c0',
  skyblue: '87ceeb',
  slateblue: '6a5acd',
  slategray: '708090',
  slategrey: '708090',
  snow: 'fffafa',
  springgreen: '00ff7f',
  steelblue: '4682b4',
  tan: 'd2b48c',
  teal: '008080',
  thistle: 'd8bfd8',
  tomato: 'ff6347',
  turquoise: '40e0d0',
  violet: 'ee82ee',
  wheat: 'f5deb3',
  white: 'ffffff',
  whitesmoke: 'f5f5f5',
  yellow: 'ffff00',
  yellowgreen: '9acd32',
};

/** Whether the text names a theme variable, which has no value until the page paints. */
export function isThemeVariable(text: string): boolean {
  return /^\s*var\(/.test(text);
}

const clamp = (n: number, low = 0, high = 255): number => Math.min(high, Math.max(low, n));

function channel(part: string): number | undefined {
  const text = part.trim();
  if (text.endsWith('%')) {
    const pct = Number(text.slice(0, -1));
    return Number.isFinite(pct) ? clamp(Math.round((pct / 100) * 255)) : undefined;
  }
  const n = Number(text);
  return Number.isFinite(n) ? clamp(Math.round(n)) : undefined;
}

/** The colour the text writes - hex, rgb()/rgba() or a CSS name - or undefined for anything else. */
export function parseColour(text: string): Rgb | undefined {
  const value = text.trim().toLowerCase();
  if (!value) return undefined;
  const hex = value.startsWith('#') ? value.slice(1) : NAMED[value];
  if (hex !== undefined) {
    if (!/^[0-9a-f]+$/.test(hex)) return undefined;
    const digits = hex.length === 3 || hex.length === 4 ? [...hex].map((d) => d + d).join('') : hex;
    if (digits.length !== 6 && digits.length !== 8) return undefined;
    const at = (i: number): number => parseInt(digits.slice(i, i + 2), 16);
    return { r: at(0), g: at(2), b: at(4), a: digits.length === 8 ? at(6) / 255 : 1 };
  }
  const fn = /^rgba?\(([^)]*)\)$/.exec(value);
  if (fn) {
    const parts = fn[1].split(/[\s,/]+/).filter(Boolean);
    if (parts.length !== 3 && parts.length !== 4) return undefined;
    const [r, g, b] = parts.slice(0, 3).map(channel);
    if (r === undefined || g === undefined || b === undefined) return undefined;
    let a = 1;
    if (parts.length === 4) {
      const raw = parts[3];
      a = raw.endsWith('%') ? Number(raw.slice(0, -1)) / 100 : Number(raw);
      if (!Number.isFinite(a)) return undefined;
      a = clamp(a, 0, 1);
    }
    return { r, g, b, a };
  }
  return undefined;
}

const hex2 = (n: number): string => clamp(Math.round(n)).toString(16).padStart(2, '0');

/** `#rrggbb`, alpha dropped. */
export function toHex(colour: Rgb): string {
  return `#${hex2(colour.r)}${hex2(colour.g)}${hex2(colour.b)}`;
}

/** `rgba(r, g, b, a)` with the alpha written as given. */
export function toRgba(colour: Rgb, alpha: number): string {
  const a = clamp(alpha, 0, 1);
  return `rgba(${clamp(Math.round(colour.r))},${clamp(Math.round(colour.g))},${clamp(Math.round(colour.b))},${Number(a.toPrecision(4))})`;
}

/** Blends towards another colour by a percentage: 0 is the colour itself, 100 the other. */
export function mix(colour: Rgb, other: Rgb, percent: number): Rgb {
  const p = clamp(percent, 0, 100) / 100;
  return {
    r: colour.r + (other.r - colour.r) * p,
    g: colour.g + (other.g - colour.g) * p,
    b: colour.b + (other.b - colour.b) * p,
    a: colour.a + (other.a - colour.a) * p,
  };
}

const WHITE: Rgb = { r: 255, g: 255, b: 255, a: 1 };
const BLACK: Rgb = { r: 0, g: 0, b: 0, a: 1 };

/** Towards white by a percentage. */
export function lighten(colour: Rgb, percent: number): Rgb {
  return mix(colour, WHITE, percent);
}

/** Towards black by a percentage. */
export function darken(colour: Rgb, percent: number): Rgb {
  return mix(colour, BLACK, percent);
}

function luminance(colour: Rgb): number {
  const linear = (c: number): number => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(colour.r) + 0.7152 * linear(colour.g) + 0.0722 * linear(colour.b);
}

/** White or black, whichever reads better on the colour by WCAG contrast. */
export function contrast(colour: Rgb): string {
  const l = luminance(colour);
  const withWhite = 1.05 / (l + 0.05);
  const withBlack = (l + 0.05) / 0.05;
  return withWhite >= withBlack ? '#ffffff' : '#000000';
}
