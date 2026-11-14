/*
 * A placeholder left unset inside an item template is warned about once, naming the item
 * template it is written in beside the card's template, rather than once per level with
 * only the card's template named (#456).
 * Run with `npm test`.
 */
const { check } = require('./check.js');
const deepReplace = require('../.test-build/deep-replace.js').default;

const realWarn = console.warn;
const warnings = [];
console.warn = (message) => warnings.push(String(message));

const build = (variables, content, itemTemplates, quiet = new Set()) =>
  deepReplace(variables, {}, content, 'camera_card', undefined, quiet, undefined, 0, undefined, undefined, false, {
    itemTemplates,
  });
const unsetWarnings = () => warnings.filter((message) => message.includes('nothing gives a value'));

const itemTemplates = {
  inner_item: { item: { color: '[[fg_color.red]]', name: '[[name]]' } },
  outer_item: { item: { inner: '[[inner_item|with]]', title: '[[title]]' } },
};

warnings.length = 0;
build([{ name: 'n' }], { row: '[[inner_item|with]]' }, itemTemplates);
check(
  'an unset placeholder in an item template names the item template and the card template (#456)',
  unsetWarnings(),
  [
    'decluttering-card-plus: item template "inner_item" in template "camera_card" uses [[fg_color.red]], which nothing gives a value to, so it is rendered as written. Set it on the card, or give it a default in the template. To write those brackets on purpose, escape it as [[!fg_color.red]].',
  ],
);

warnings.length = 0;
build([{ name: 'n' }, { title: 't' }], { row: '[[outer_item|with]]' }, itemTemplates);
check(
  'a fill inside a fill: only the innermost item template warns (#456)',
  unsetWarnings().map((message) => message.slice(0, message.indexOf(' uses '))),
  ['decluttering-card-plus: item template "inner_item" in template "camera_card"'],
);

warnings.length = 0;
build([{ name: 'n' }], { row: '[[inner_item|with]]', own: '[[missing]]' }, itemTemplates);
check(
  "the card template's own unset placeholder is still warned about under its name (#456)",
  unsetWarnings().map((message) => message.slice(0, message.indexOf(' which '))),
  [
    'decluttering-card-plus: item template "inner_item" in template "camera_card" uses [[fg_color.red]],',
    'decluttering-card-plus: template "camera_card" uses [[missing]],',
  ],
);

warnings.length = 0;
build([{ name: 'n' }], { row: '[[inner_item|with]]' }, itemTemplates, true);
check('a quiet build says nothing at all (#456)', unsetWarnings(), []);

warnings.length = 0;
build([], { own: '[[missing]]' }, {});
check(
  'with no item template involved the warning reads as before (#456)',
  unsetWarnings().map((message) => message.slice(0, message.indexOf(' uses '))),
  ['decluttering-card-plus: template "camera_card"'],
);

console.warn = realWarn;
