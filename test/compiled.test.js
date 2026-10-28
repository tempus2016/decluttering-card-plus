/*
 * Unit tests for src/compiled.ts (idea 3): a template's content is stringified and split at
 * its placeholder sites once per content object, and every build of it reuses that.
 */
const { compile, compileCount, splitSites } = require('../.test-build/compiled.js');
const deepReplace = require('../.test-build/deep-replace.js').default;
const { check } = require('./check');

check('text with no placeholder is one literal piece', splitSites('{"a":"b"}'), ['{"a":"b"}']);

check(
  'sites are split out with their quotes and parts',
  splitSites('{"a":"[[x]]","b":"p [[y|upper]] q","c":"[[z?]]"}'),
  [
    '{"a":',
    { text: '"[[x]]"', lead: '"', name: 'x', trail: '"' },
    ',"b":"p ',
    { text: '[[y|upper]]', name: 'y', chain: 'upper' },
    ' q","c":',
    { text: '"[[z?]]"', lead: '"', name: 'z', optional: '?', trail: '"' },
    '}',
  ],
);

check('a chain with an unknown step is not a site, so it is left as text', splitSites('{"a":"[[x|nope]]"}'), [
  '{"a":"[[x|nope]]"}',
]);

const content = { type: 'tile', entity: '[[entity]]', name: '[[name|upper]] ([[area|slug]])', extra: '[[gone?]]' };
const before = compileCount();
const first = compile(content);
check('compiling twice gives the same object back', compile(content) === first, true);
check('one content object is compiled once', compileCount() - before, 1);
check('a different object is compiled again', compile({ ...content }) !== first, true);
check('and counted', compileCount() - before, 2);

const results = [];
const countBefore = compileCount();
for (let i = 0; i < 50; i += 1) {
  results.push(deepReplace([{ entity: `light.l${i}` }, { name: `Lamp ${i}` }, { area: 'Living Room' }], {}, content));
}
check('fifty builds of the same content compile it at most once more', compileCount() - countBefore <= 1, true);
check('and build the right thing', results[7], { type: 'tile', entity: 'light.l7', name: 'LAMP 7 (living_room)' });
check('every copy differs where its variables do', results[49].entity, 'light.l49');

check(
  'a value holding placeholders of its own still settles over later passes',
  deepReplace([{ a: '[[b]]-[[c]]' }, { b: 'B' }, { c: 'C' }], {}, { v: '[[a]]', w: 'x[[a]]y' }),
  { v: 'B-C', w: 'xB-Cy' },
);
