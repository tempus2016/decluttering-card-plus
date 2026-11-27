/*
 * Theme colours in the colour steps (#518): a bare `--name` reads as var(--name), and lighten:,
 * darken:, alpha: and mix: on a theme colour write CSS color-mix() for the browser to work out.
 * The steps that need the value itself pass the theme colour through with a word in the console.
 */
const { isThemeVariable, liveColour, mixCss, alphaCss } = require('../.test-build/colour.js');
const { applyTransform } = require('../.test-build/variables.js');
const deepReplace = require('../.test-build/deep-replace.js').default;
const { check } = require('./check');

const warnedBefore = console.warn;
const said = [];
console.warn = (m) => said.push(m);
const saidAbout = (value) => said.filter((m) => m.includes(`"${value}"`));

/* ------------------------------------------------------- what counts as one */
check('a bare custom property is a theme variable', isThemeVariable('--primary-color'), true);
check('with spaces round it too', isThemeVariable('  --my_name-2 '), true);
check('var() still is', isThemeVariable('var(--x)'), true);
check('one dash is not', isThemeVariable('-x'), false);
check('a property with a space inside is not', isThemeVariable('--a b'), false);
check('a typo of a colour is not', isThemeVariable('bluee'), false);
check('a bare property becomes var()', liveColour(' --x '), 'var(--x)');
check('var() is kept as written', liveColour('var(--x, #fff)'), 'var(--x, #fff)');
check(
  'a color-mix() an earlier step wrote is one',
  liveColour('color-mix(in srgb, var(--x), white 20%)'),
  'color-mix(in srgb, var(--x), white 20%)',
);
check('a hex is not', liveColour('#fff'), undefined);
check('mixCss clamps the percentage', mixCss('var(--x)', 'white', 140), 'color-mix(in srgb, var(--x), white 100%)');
check(
  'alphaCss writes a clean percentage',
  alphaCss('var(--x)', 0.12),
  'color-mix(in srgb, var(--x) 12%, transparent)',
);

/* ------------------------------------------------------ through a placeholder */
check(
  'the reporter example: a quoted bare property lightened',
  deepReplace([], {}, { c: '[["--primary-color"|lighten:20]]' }),
  { c: 'color-mix(in srgb, var(--primary-color), white 20%)' },
);
check(
  'a var() variable darkened',
  deepReplace([{ accent: 'var(--accent-color)' }], {}, { c: '[[accent|darken:10]]' }),
  { c: 'color-mix(in srgb, var(--accent-color), black 10%)' },
);
check('a bare property from the picker given an alpha', deepReplace([{ x: '--x' }], {}, { c: '[[x|alpha:0.5]]' }), {
  c: 'color-mix(in srgb, var(--x) 50%, transparent)',
});
check('an alpha of nought', deepReplace([{ x: '--x' }], {}, { c: '[[x|alpha:0]]' }), {
  c: 'color-mix(in srgb, var(--x) 0%, transparent)',
});
check('a theme colour mixed with a hex', deepReplace([{ x: '--x' }], {}, { c: '[[x|mix:#ff9800,30]]' }), {
  c: 'color-mix(in srgb, var(--x), #ff9800 30%)',
});
check('mix defaults to half', deepReplace([{ x: 'var(--x)' }], {}, { c: '[[x|mix:red]]' }), {
  c: 'color-mix(in srgb, var(--x), #ff0000 50%)',
});
check(
  'two theme colours mixed',
  deepReplace([{ x: '--x' }], {}, { c: '[[x|mix:--y,25]]', d: '[[x|mix:var(--y),25]]' }),
  { c: 'color-mix(in srgb, var(--x), var(--y) 25%)', d: 'color-mix(in srgb, var(--x), var(--y) 25%)' },
);
check('a hex mixed with a theme colour', deepReplace([{ c: '#1565c0' }], {}, { v: '[[c|mix:--accent-color,40]]' }), {
  v: 'color-mix(in srgb, #1565c0, var(--accent-color) 40%)',
});
check('steps chain on a theme colour', deepReplace([{ x: '--x' }], {}, { c: '[[x|lighten:20|alpha:0.5]]' }), {
  c: 'color-mix(in srgb, color-mix(in srgb, var(--x), white 20%) 50%, transparent)',
});
check('a plain placeholder is left as it was', deepReplace([{ x: '--x' }], {}, { c: '[[x]]', d: 'var([[x]])' }), {
  c: '--x',
  d: 'var(--x)',
});
check('a step on a plain colour is as before', applyTransform('lighten:20', '#1565c0'), '#4484cd');

/* ------------------------------------------------- the steps that need a value */
said.length = 0;
check(
  'contrast passes a theme colour through',
  applyTransform('contrast', 'var(--primary-color)'),
  'var(--primary-color)',
);
check(
  'to_hex passes a bare property through as var()',
  applyTransform('to_hex', '--primary-color'),
  'var(--primary-color)',
);
check('to_rgb too', applyTransform('to_rgb', '--primary-color'), 'var(--primary-color)');
check('to_rgb as a whole value stays text', deepReplace([{ x: '--x' }], {}, { v: '[[x|to_rgb]]' }), { v: 'var(--x)' });
check('color_name too', applyTransform('color_name', 'var(--x)'), 'var(--x)');
check(
  'and the console says why',
  saidAbout('var(--primary-color)').some((m) => m.includes('theme colour')),
  true,
);
check(
  'for the bare one as well',
  saidAbout('--primary-color').some((m) => m.includes('contrast') || m.includes('to_hex')),
  true,
);

/* ------------------------------------------------------------ what still warns */
said.length = 0;
check('a typo is left as it was', applyTransform('lighten:20', 'bluee'), 'bluee');
check(
  'and says it is no colour',
  saidAbout('bluee').some((m) => m.includes('works on a colour')),
  true,
);
check('a bad alpha on a theme colour', applyTransform('alpha:7', '--x'), 'var(--x)');
check('a bad lighten on a theme colour', applyTransform('lighten:lots', '--x'), 'var(--x)');
check('mixed with a typo', applyTransform('mix:bluee,30', '--x'), 'var(--x)');
check('a bad mix weight', applyTransform('mix:--y,much', '--x'), 'var(--x)');
check('a hex mixed with a bad weight', applyTransform('mix:--y,much', '#000'), '#000');
check(
  'an empty alpha on a theme colour is no number, so it passes through',
  applyTransform('alpha:', '--x'),
  'var(--x)',
);
check('an empty lighten on a theme colour passes through too', applyTransform('lighten: ', '--x'), 'var(--x)');
check(
  'a hex mixed with an rgb() colour still reads the whole argument',
  applyTransform('mix:rgb(255,255,255)', '#000000'),
  applyTransform('mix:#ffffff,50', '#000000'),
);
check('each said so', said.length >= 5, true);

console.warn = warnedBefore;
