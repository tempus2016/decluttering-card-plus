/*
 * Unit tests for template discovery in src/templates.ts - which dashboard configuration
 * shapes a template can be declared in, and which dashboards a config borrows from.
 * Run with `npm test`.
 */
const {
  collectAllTemplates,
  collectDefaults,
  collectTemplates,
  getTemplateSources,
  isTemplateCardType,
  collectUsages,
  findTemplateLocation,
  renameTemplate,
  dashboardsToForget,
} = require('../.test-build/templates.js');

const { check, report } = require('./harness');

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

check(
  'a template card inside a stack is found',
  Object.keys(
    collectTemplates({
      views: [
        {
          cards: [
            {
              type: 'vertical-stack',
              cards: [{ type: 'custom:decluttering-template-plus', template: 'nested', card: {} }],
            },
          ],
        },
      ],
    }),
  ),
  ['nested'],
);

check(
  'a template card inside a grid inside a stack is found',
  Object.keys(
    collectTemplates({
      views: [
        {
          cards: [
            {
              type: 'horizontal-stack',
              cards: [
                { type: 'grid', cards: [{ type: 'custom:decluttering-template-plus', template: 'deep', card: {} }] },
              ],
            },
          ],
        },
      ],
    }),
  ),
  ['deep'],
);

check(
  'a template card inside a conditional card is found',
  Object.keys(
    collectTemplates({
      views: [
        {
          cards: [
            {
              type: 'conditional',
              card: { type: 'custom:decluttering-template-plus', template: 'conditional', card: {} },
            },
          ],
        },
      ],
    }),
  ),
  ['conditional'],
);

check(
  'a template card nested in a section is found',
  Object.keys(
    collectTemplates({
      views: [
        {
          sections: [
            {
              cards: [
                {
                  type: 'vertical-stack',
                  cards: [{ type: 'custom:decluttering-template-plus', template: 'sectioned', card: {} }],
                },
              ],
            },
          ],
        },
      ],
    }),
  ),
  ['sectioned'],
);

check(
  'a template card inside a template card belongs to the outer definition, not the dashboard',
  Object.keys(
    collectTemplates({
      views: [
        {
          cards: [
            {
              type: 'custom:decluttering-template-plus',
              template: 'outer',
              card: { type: 'custom:decluttering-template-plus', template: 'inner', card: {} },
            },
          ],
        },
      ],
    }),
  ),
  ['outer'],
);

check(
  'a view with no cards at all is not an error',
  Object.keys(collectTemplates({ views: [{ title: 'Empty' }, { cards: null }] })),
  [],
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
  { title: 'First', path: 'one', index: 0, count: 3 },
  { title: 'two', path: 'two', index: 1, count: 1 },
]);

check(
  'a view with no path still says which view it is',
  collectUsages(
    { views: [{ cards: [] }, { title: 'Second', cards: [{ type: 'custom:decluttering-card-plus', template: 'a' }] }] },
    'a',
  ).views,
  [{ title: 'Second', path: '', index: 1, count: 1 }],
);

check(
  'a consumer sitting in a definition default value is a use too',
  collectUsages(
    {
      decluttering_templates: {
        chrome: {
          card: { type: 'tile' },
          default: [{ inner: { type: 'custom:decluttering-card-plus', template: 'a' } }],
        },
      },
    },
    'a',
  ).templates,
  ['chrome'],
);

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

check(
  'every key of a definition is scanned for consumers, not a hand-kept list',
  collectUsages(
    {
      decluttering_templates: {
        holder: { card: { type: 'tile' }, header: { type: 'custom:decluttering-card-plus', template: 'a' } },
      },
    },
    'a',
  ).templates,
  ['holder'],
);

/* ------------------------------------------------------- where a template lives */

check(
  'a template card in a view reports the view it sits in',
  findTemplateLocation(
    {
      views: [
        { title: 'One', cards: [] },
        { title: 'Two', path: 'two', cards: [{ type: 'custom:decluttering-template-plus', template: 'tile' }] },
      ],
    },
    'tile',
  ),
  { declared: false, view: { title: 'Two', path: 'two', index: 1 } },
);

check(
  'a template nested inside a stack still reports its view',
  findTemplateLocation(
    {
      views: [
        {
          title: 'One',
          cards: [{ type: 'vertical-stack', cards: [{ type: 'custom:decluttering-template', template: 'tile' }] }],
        },
      ],
    },
    'tile',
  ),
  { declared: false, view: { title: 'One', path: '', index: 0 } },
);

check(
  'a template declared in the root key has no card to open',
  findTemplateLocation({ decluttering_templates: { tile: { card: {} } } }, 'tile'),
  { declared: true },
);

check('a template that is nowhere reports nothing', findTemplateLocation({ views: [] }, 'tile'), null);

check('no config at all reports nothing', findTemplateLocation(null, 'tile'), null);

/* ------------------------------------------------------------- renaming a template */

check(
  'renaming rewrites the definition and every use',
  renameTemplate(
    {
      views: [
        {
          cards: [
            { type: 'custom:decluttering-template-plus', template: 'tile', card: { type: 'tile' } },
            { type: 'custom:decluttering-card-plus', template: 'tile', variables: [{ a: 1 }] },
            { type: 'vertical-stack', cards: [{ type: 'custom:decluttering-card', template: 'tile' }] },
          ],
        },
      ],
    },
    'tile',
    'room_tile',
  ),
  {
    views: [
      {
        cards: [
          { type: 'custom:decluttering-template-plus', template: 'room_tile', card: { type: 'tile' } },
          { type: 'custom:decluttering-card-plus', template: 'room_tile', variables: [{ a: 1 }] },
          { type: 'vertical-stack', cards: [{ type: 'custom:decluttering-card', template: 'room_tile' }] },
        ],
      },
    ],
  },
);

check(
  'a use of a different template is left alone',
  renameTemplate(
    { views: [{ cards: [{ type: 'custom:decluttering-card-plus', template: 'other' }] }] },
    'tile',
    'room_tile',
  ),
  { views: [{ cards: [{ type: 'custom:decluttering-card-plus', template: 'other' }] }] },
);

check(
  'a template declared in the root key is renamed by its key',
  renameTemplate(
    { decluttering_templates: { tile: { card: { type: 'tile' } }, other: { card: {} } } },
    'tile',
    'room_tile',
  ),
  { decluttering_templates: { room_tile: { card: { type: 'tile' } }, other: { card: {} } } },
);

check(
  'a use inside another template definition is rewritten too',
  renameTemplate(
    { decluttering_templates: { holder: { card: { type: 'custom:decluttering-card-plus', template: 'tile' } } } },
    'tile',
    'room_tile',
  ),
  { decluttering_templates: { holder: { card: { type: 'custom:decluttering-card-plus', template: 'room_tile' } } } },
);

check(
  'a bare string that happens to match is not a template reference',
  renameTemplate({ views: [{ cards: [{ type: 'markdown', content: 'tile' }] }] }, 'tile', 'room_tile'),
  { views: [{ cards: [{ type: 'markdown', content: 'tile' }] }] },
);

check(
  'renaming does not mutate the configuration it was given',
  (() => {
    const original = { views: [{ cards: [{ type: 'custom:decluttering-card-plus', template: 'tile' }] }] };
    renameTemplate(original, 'tile', 'room_tile');
    return original.views[0].cards[0].template;
  })(),
  'tile',
);
/* ------------------------------------------- forgetting a borrowed dashboard */

check('a named dashboard is forgotten on its own', dashboardsToForget('library'), ['library']);

check('the original dashboard is forgotten under every name it goes by', dashboardsToForget(null).sort(), [
  '',
  'default',
  'lovelace',
]);

check('a change reported for "lovelace" forgets the same set', dashboardsToForget('lovelace').sort(), [
  '',
  'default',
  'lovelace',
]);

check('a change reported with no path at all is the original dashboard', dashboardsToForget(undefined).sort(), [
  '',
  'default',
  'lovelace',
]);

// decluttering_defaults - values every template on the dashboard falls back on.

check('a dashboard with no defaults offers none', collectDefaults({ views: [] }), []);
check(
  'defaults are read as a flat list whichever way they are written',
  collectDefaults({ decluttering_defaults: { colour: 'amber', size: 32 } }),
  [{ colour: 'amber' }, { size: 32 }],
);
check(
  'and a list is read the same way',
  collectDefaults({ decluttering_defaults: [{ colour: 'amber' }, { size: 32 }] }),
  [{ colour: 'amber' }, { size: 32 }],
);

const withShared = collectTemplates({
  decluttering_defaults: { colour: 'amber' },
  decluttering_templates: {
    plain: { card: { type: 'tile' } },
    owned: { default: [{ colour: 'blue' }], card: { type: 'tile' } },
  },
});

check('a template with no defaults of its own picks up the shared ones', withShared.plain.default, [
  { colour: 'amber' },
]);
check('and a template that sets it itself keeps its own first', withShared.owned.default, [
  { colour: 'blue' },
  { colour: 'amber' },
]);

const untouched = { plain: { card: { type: 'tile' } } };
collectTemplates({ decluttering_defaults: { colour: 'amber' }, decluttering_templates: untouched });
check('the dashboard config itself is not changed', untouched.plain.default, undefined);

check(
  'no defaults means the templates come back exactly as written',
  collectTemplates({ decluttering_templates: { plain: { card: { type: 'tile' } } } }).plain.default,
  undefined,
);

// Borrowing: the borrower's shared values come first, the lender's stay underneath.
const lender = {
  decluttering_defaults: { colour: 'green', shape: 'lender-shape' },
  decluttering_templates: { shared_badge: { default: [{ own: 'template-own' }], card: { type: 'markdown' } } },
};
const borrower = { decluttering_defaults: { colour: 'amber' }, decluttering_templates_from: ['lend'], views: [] };

const hass = { callWS: () => Promise.resolve(lender) };

collectAllTemplates(hass, borrower).then((all) => {
  const badge = all.shared_badge;
  check('a borrowed template keeps its own default first, then the borrower, then the lender', badge.default, [
    { own: 'template-own' },
    { colour: 'amber' },
    { colour: 'green' },
    { shape: 'lender-shape' },
  ]);
  report();
});
