/*
 * Unit tests for src/colour.ts (idea 41): colours read from hex, rgb() and CSS names, and the
 * tints, shades, washes and contrast colours derived from them.
 */
const {
  parseColour,
  toHex,
  toRgba,
  lighten,
  darken,
  mix,
  contrast,
  isThemeVariable,
} = require('../.test-build/colour.js');
const { check } = require('./check');

check('a six-digit hex', parseColour('#1565c0'), { r: 21, g: 101, b: 192, a: 1 });
check('a three-digit hex doubles its digits', parseColour('#fa0'), { r: 255, g: 170, b: 0, a: 1 });
check('an eight-digit hex carries alpha', parseColour('#1565c080').a, 128 / 255);
check('rgb()', parseColour('rgb(21, 101, 192)'), { r: 21, g: 101, b: 192, a: 1 });
check('rgba()', parseColour('rgba(21,101,192,0.5)'), { r: 21, g: 101, b: 192, a: 0.5 });
check('the space-separated form', parseColour('rgb(21 101 192 / 50%)'), { r: 21, g: 101, b: 192, a: 0.5 });
check('a CSS name', parseColour('RebeccaPurple'), { r: 102, g: 51, b: 153, a: 1 });
check('a word that is not a colour', parseColour('amberish'), undefined);
check('a bad hex', parseColour('#12345'), undefined);
check('a theme variable is recognised', isThemeVariable('var(--primary-color)'), true);
check('and a hex is not', isThemeVariable('#fff'), false);

const blue = parseColour('#1565c0');
check('toHex writes six digits', toHex(blue), '#1565c0');
check('lighten by twenty', toHex(lighten(blue, 20)), '#4484cd');
check('darken by twenty', toHex(darken(blue, 20)), '#11519a');
check('lighten by a hundred is white', toHex(lighten(blue, 100)), '#ffffff');
check('darken by a hundred is black', toHex(darken(blue, 100)), '#000000');
check('an alpha wash', toRgba(blue, 0.12), 'rgba(21,101,192,0.12)');
check('mixed half and half with orange', toHex(mix(blue, parseColour('#ff9800'), 50)), '#8a7f60');
check('mixed by nothing is the colour itself', toHex(mix(blue, parseColour('#ff9800'), 0)), '#1565c0');
check('white text reads on this blue', contrast(blue), '#ffffff');
check('black text reads on a pale yellow', contrast(parseColour('#fff59d')), '#000000');
check('black text reads on white', contrast(parseColour('white')), '#000000');
check('white text reads on black', contrast(parseColour('#000')), '#ffffff');
