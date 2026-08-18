/*
 * Unit tests for template discovery in src/templates.ts - which dashboard configuration
 * shapes a template can be declared in, and which dashboards a config borrows from.
 * Run with `npm test`.
 */
const {
  collectTemplates,
  getTemplateSources,
  isTemplateCardType,
  collectUsages,
} = require('../.test-build/templates.js');

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

/* --- collectUsages --- */

const USED_IN = {
  views: [
    {
      title: 'First',
      path: 'one',
      cards: [
        { type: 'custom:decluttering-card-plus', template: 'tile' },
        { type: 'vertical-stack', cards: [{ type: 'custom:decluttering-card-plus', template: 'tile' }] },
        { type: 'custom:decluttering-card-plus', template: 'other' },
      ],
      badges: [{ type: 'custom:decluttering-card-plus', template: 'tile' }],
    },
    {
      path: 'two',
      sections: [{ cards: [{ type: 'custom:decluttering-card', template: 'tile' }] }],
    },
    { title: 'Empty', path: 'three', cards: [{ type: 'markdown' }] },
  ],
  decluttering_templates: {
    wrapper: { card: { type: 'custom:decluttering-card-plus', template: 'tile' } },
    unrelated: { card: { type: 'markdown' } },
  },
};

check('a template used nowhere has no usages', collectUsages(USED_IN, 'missing'), { views: [], templates: [] });

check('usages are counted per view, wherever they are nested', collectUsages(USED_IN, 'tile').views, [
  { title: 'First', path: 'one', count: 3 },
  { title: 'two', path: 'two', count: 1 },
]);

check('a template that calls another one is listed by name', collectUsages(USED_IN, 'tile').templates, ['wrapper']);

check(
  'a template card defining the template is not a use of it',
  collectUsages(
    {
      views: [{ path: 'a', cards: [{ type: 'custom:decluttering-template-plus', template: 'tile', card: {} }] }],
    },
    'tile',
  ),
  { views: [], templates: [] },
);

check(
  'a template defined as a card is listed when it calls another',
  collectUsages(
    {
      views: [
        {
          path: 'a',
          cards: [
            {
              type: 'custom:decluttering-template-plus',
              template: 'wrapper_card',
              card: { type: 'custom:decluttering-card-plus', template: 'tile' },
            },
          ],
        },
      ],
    },
    'tile',
  ),
  { views: [], templates: ['wrapper_card'] },
);

check(
  'a template does not count as using itself',
  collectUsages(
    {
      decluttering_templates: { tile: { card: { type: 'custom:decluttering-card-plus', template: 'tile' } } },
    },
    'tile',
  ).templates,
  [],
);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
