/*
 * Colour conversions (#508): the colour steps read the [r, g, b] list Home Assistant's
 * color_rgb selector gives, and `to_hex`, `to_rgb` and `color_name` write a colour out as
 * hex, as that list again, or by its CSS name.
 */
const { parseColour, toHexWithAlpha, colourName } = require('../.test-build/colour.js');
const { applyTransform, KNOWN_STEPS, yieldsList } = require('../.test-build/variables.js');
const deepReplace = require('../.test-build/deep-replace.js').default;
const { check } = require('./check');

const warnedBefore = console.warn;
const said = [];
console.warn = (m) => said.push(m);

/* ------------------------------------------------------------- reading a list */
check('a list is a colour', parseColour('[0, 0, 255]'), { r: 0, g: 0, b: 255, a: 1 });
check('a list with an alpha', parseColour('[0,0,255,0.5]'), { r: 0, g: 0, b: 255, a: 0.5 });
check('channels are clamped and rounded', parseColour('[300, -4, 12.6]'), { r: 255, g: 0, b: 13, a: 1 });
check('two numbers are not a colour', parseColour('[0, 0]'), undefined);
check('five numbers are not a colour', parseColour('[0, 0, 0, 1, 1]'), undefined);
check('words in a list are not a colour', parseColour('["red", 0, 0]'), undefined);
check('a broken list is not a colour', parseColour('[0, 0, 255'), undefined);

check('darken reads an rgb list value', applyTransform('darken:20', [0, 0, 255]), '#0000cc');
check('lighten reads one too', applyTransform('lighten:50', [0, 0, 255]), '#8080ff');
check('alpha reads one', applyTransform('alpha:0.5', [0, 0, 255]), 'rgba(0,0,255,0.5)');
check('contrast reads one', applyTransform('contrast', [255, 255, 0]), '#000000');
check('mix reads one', applyTransform('mix:#ffffff,50', [0, 0, 0]), '#808080');

/* ------------------------------------------------------------------ to_hex */
check('to_hex writes a list as hex', applyTransform('to_hex', [0, 0, 255]), '#0000ff');
check('to_hex writes a name as hex', applyTransform('to_hex', 'RebeccaPurple'), '#663399');
check('to_hex writes rgb() as hex', applyTransform('to_hex', 'rgb(21, 101, 192)'), '#1565c0');
check('to_hex keeps an alpha', applyTransform('to_hex', 'rgba(0,0,255,0.5)'), '#0000ff80');
check('toHexWithAlpha leaves a solid colour six digits', toHexWithAlpha({ r: 1, g: 2, b: 3, a: 1 }), '#010203');
check('to_hex after darken', applyTransform('darken:20|to_hex', [0, 0, 255]), '#0000cc');
check('to_hex leaves a word that is not a colour', applyTransform('to_hex', 'amberish'), 'amberish');
check('to_hex passes a theme variable through', applyTransform('to_hex', 'var(--x)'), 'var(--x)');

/* ------------------------------------------------------------------ to_rgb */
check('to_rgb writes hex as a list', applyTransform('to_rgb', '#0000ff'), '[0,0,255]');
check('to_rgb after darken', applyTransform('darken:20|to_rgb', [0, 0, 255]), '[0,0,204]');
check('to_rgb drops the alpha', applyTransform('to_rgb', '#0000ff80'), '[0,0,255]');
check('to_rgb then join makes rgb() text', applyTransform('to_rgb|join:,', 'blue'), '0,0,255');
check('to_rgb then first is the red', applyTransform('to_rgb|first', '#ff8000'), '255');
check('to_rgb leaves a word that is not a colour', applyTransform('to_rgb', 'amberish'), 'amberish');
check('a chain ending in to_rgb yields a list', yieldsList('darken:20|to_rgb'), true);
check('and one joined after it does not', yieldsList('to_rgb|join:,'), false);

check(
  'to_rgb as a whole value goes in as a real list',
  deepReplace([{ c: [0, 0, 255] }], {}, { default: '[[c|darken:20|to_rgb]]' }),
  { default: [0, 0, 204] },
);
check('inside text it is written out', deepReplace([{ c: '#0000ff' }], {}, { text: 'rgb is [[c|to_rgb]]' }), {
  text: 'rgb is [0,0,255]',
});
check('a colour that cannot be read stays text', deepReplace([{ c: 'amberish' }], {}, { v: '[[c|to_rgb]]' }), {
  v: 'amberish',
});
check(
  'the reporter example',
  deepReplace(
    [{ color_selected: [0, 0, 255] }],
    {},
    {
      hex: '[[color_selected|to_hex]]',
      header: '[[color_selected|darken:20|to_rgb]]',
      name: '[[color_selected|color_name]]',
    },
  ),
  { hex: '#0000ff', header: [0, 0, 204], name: 'blue' },
);

/* -------------------------------------------------------------- color_name */
check('colourName names an exact match', colourName({ r: 0, g: 0, b: 255, a: 1 }), 'blue');
check('the first spelling wins for gray', colourName({ r: 128, g: 128, b: 128, a: 1 }), 'gray');
check('aqua over cyan', colourName({ r: 0, g: 255, b: 255, a: 1 }), 'aqua');
check('fuchsia over magenta', colourName({ r: 255, g: 0, b: 255, a: 1 }), 'fuchsia');
check('no name for a near miss', colourName({ r: 0, g: 0, b: 254, a: 1 }), undefined);
check('no name with an alpha', colourName({ r: 0, g: 0, b: 255, a: 0.5 }), undefined);
check('color_name of a list', applyTransform('color_name', [0, 0, 255]), 'blue');
check('color_name of hex', applyTransform('color_name', '#FFA500'), 'orange');
check('color_name falls back to hex', applyTransform('color_name', [0, 0, 204]), '#0000cc');
check('color_name keeps the alpha in its hex', applyTransform('color_name', 'rgba(0,0,255,0.5)'), '#0000ff80');
check('color_name after darken', applyTransform('darken:20|color_name', [0, 0, 255]), '#0000cc');
check('color_name of a name is that name', applyTransform('color_name', 'Grey'), 'gray');

/* --------------------------------------------------------------- the lists */
check(
  'the new steps are known to the lint',
  ['to_hex', 'to_rgb', 'color_name'].every((s) => KNOWN_STEPS.includes(s)),
  true,
);
check('the console said something for the words', said.length > 0, true);

console.warn = warnedBefore;
