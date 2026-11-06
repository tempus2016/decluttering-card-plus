/*
 * Unit tests for src/placeholder-text.ts, and for the scans that read placeholders out of a
 * value's JSON: a list inside a list must never be read as a `[[...]]` placeholder.
 * Run with `npm test`.
 */
const { placeholderJson } = require('../.test-build/placeholder-text.js');
const { diagnoseInstance, diagnoseTemplate, usedVariables } = require('../.test-build/variables.js');
const { lintTemplate } = require('../.test-build/lint.js');
const { namesInUse } = require('../.test-build/promote.js');
const { placeholderHeads } = require('../.test-build/structure.js');
const { readsIn } = require('../.test-build/unread.js');
const deepReplace = require('../.test-build/deep-replace.js').default;

const { check } = require('./check');

// The text itself.
check('a list of mappings in a list has its two brackets kept apart', placeholderJson([[{ a: 1 }]]), '[ [{"a":1}] ]');
check('a list of lists is kept apart at every level', placeholderJson([[[1]], [2]]), '[ [ [1] ],[2] ]');
check(
  'a value with no brackets meeting is JSON.stringify exactly',
  placeholderJson({ a: [1, { b: [2] }] }),
  '{"a":[1,{"b":[2]}]}',
);
check('brackets inside a string are left as written', placeholderJson(['[[a]]', '[[[ x ]]]']), '["[[a]]","[[[ x ]]]"]');
check(
  'an escaped quote does not end the string early',
  placeholderJson([['a\\"[[b]]', 'c"]]']]),
  '[ ["a\\\\\\"[[b]]","c\\"]]"] ]',
);
check('the text parses back to the same value', JSON.parse(placeholderJson([[{ a: '[[x]]' }], [[[]]]])), [
  [{ a: '[[x]]' }],
  [[[]]],
]);
check('undefined is undefined, as JSON.stringify gives', placeholderJson(undefined), undefined);

// The card editor's warning, from a group template (the bug).
const group = {
  default: [{ area: 'living_room' }],
  group: [
    { type: 'heading', heading: 'GROUP [[area]]' },
    { type: 'tile', entity: 'light.[[area]]' },
  ],
};
check('a group template is not missing a variable named after its cards', diagnoseInstance(undefined, group), {
  missing: [],
  unused: [],
  required: [],
});
check('a group template uses its own variable', usedVariables(group), ['area']);
check('a group template has nothing wrong with it', diagnoseTemplate(group), {
  unused: [],
  duplicated: [],
  contradictory: [],
});
check('a group template lints clean', lintTemplate(group), []);
check(
  'a group template with nothing set still names the real variable',
  diagnoseInstance(undefined, { group: [{ type: 'tile', entity: 'light.[[room]]' }] }).missing,
  ['room'],
);

// A list of lists of mappings, and of plain values, inside a card.
const nested = { card: { type: 'grid', cards: [[{ type: 'tile', entity: '[[e]]' }]] } };
check('a list of lists of mappings reads only the placeholder inside', usedVariables(nested), ['e']);
check('a list of lists of mappings, set, is missing nothing', diagnoseInstance([{ e: 'light.a' }], nested).missing, []);
check('a list of lists of mappings, unset, is missing that one', diagnoseInstance(undefined, nested).missing, ['e']);
const plain = {
  card: {
    type: 'x',
    rows: [
      [1, 2],
      [true, null],
      ['a', 'b'],
    ],
  },
};
check('a list of lists of plain values uses no variable', usedVariables(plain), []);
check('a list of lists of numbers is no name to promote', namesInUse(plain), []);
check('a list of lists is no placeholder head', [...placeholderHeads(plain.card)], []);
check('a list of lists reads nothing', readsIn(plain.card), []);

// The build: the cards come out filled, and no warning about a placeholder nobody set.
const warnings = [];
const realWarn = console.warn;
console.warn = (message) => warnings.push(message);
const built = deepReplace([{ a: 'x' }], {}, { cards: [[{ y: '[[a]]' }], [[1, 2]]] });
const builtList = deepReplace([{ a: 'x' }], {}, [[{ y: '[[a]]' }]]);
// A list of lists given as a variable's whole value goes in as a list, and is not read again.
const asValue = deepReplace([{ rows: [[1, 2], [3]] }], {}, { rows: '[[rows]]' });
console.warn = realWarn;
check('a list of lists of mappings builds filled', built, { cards: [[{ y: 'x' }], [[1, 2]]] });
check('content that is a list of lists builds filled', builtList, [[{ y: 'x' }]]);
check('a list of lists as a whole value goes in as it is', asValue, { rows: [[1, 2], [3]] });
check('no build warned about a placeholder made of brackets', warnings, []);
