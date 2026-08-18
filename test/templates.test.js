/*
 * Unit tests for template discovery in src/templates.ts - which dashboard configuration
 * shapes a template can be declared in, and which dashboards a config borrows from.
 * Run with `npm test`.
 */
const { collectTemplates, getTemplateSources, isTemplateCardType } = require('../.test-build/templates.js');

let passed = 0;
let failed = 0;

function check(name, actual, expected) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    passed += 1;
    console.log(`PASS ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL ${name}\n  got      ${a}\n  expected ${e}`);
  }
}

check(
  'root decluttering_templates key',
  Object.keys(collectTemplates({ decluttering_templates: { a: { card: {} } } })),
  ['a'],
);

check(
  'template cards in a masonry view',
  Object.keys(
    collectTemplates({ views: [{ cards: [{ type: 'custom:decluttering-template-plus', template: 'b', card: {} }] }] }),
  ),
  ['b'],
);

check(
  'legacy template cards are found too',
  Object.keys(
    collectTemplates({ views: [{ cards: [{ type: 'custom:decluttering-template', template: 'c', card: {} }] }] }),
  ),
  ['c'],
);

check(
  'template cards inside sections',
  Object.keys(
    collectTemplates({
      views: [{ sections: [{ cards: [{ type: 'custom:decluttering-template-plus', template: 'd', card: {} }] }] }],
    }),
  ),
  ['d'],
);

check(
  'a template card overrides the root key of the same name',
  collectTemplates({
    decluttering_templates: { e: { card: { type: 'from-root' } } },
    views: [{ cards: [{ type: 'custom:decluttering-template-plus', template: 'e', card: { type: 'from-card' } }] }],
  }).e.card.type,
  'from-card',
);

check(
  'other card types are ignored',
  Object.keys(collectTemplates({ views: [{ cards: [{ type: 'markdown', template: 'nope' }] }] })),
  [],
);

check(
  'empty and missing configs',
  [collectTemplates(null), collectTemplates(undefined), collectTemplates({})].map(Object.keys),
  [[], [], []],
);

check('sources as a list', getTemplateSources({ decluttering_templates_from: ['a', 'b'] }), ['a', 'b']);
check('sources as a single string', getTemplateSources({ decluttering_templates_from: 'a' }), ['a']);
check('no sources', getTemplateSources({}), []);
check('non-string sources are dropped', getTemplateSources({ decluttering_templates_from: ['a', 3, null] }), ['a']);

check(
  'template card type recognition',
  [
    isTemplateCardType('custom:decluttering-template'),
    isTemplateCardType('custom:decluttering-template-plus'),
    isTemplateCardType('markdown'),
    isTemplateCardType(undefined),
  ],
  [true, true, false, false],
);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
