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
  closestTemplate,
  didYouMean,
  countLegacyTypes,
  addCardToView,
  moderniseTypes,
  viewIndexFromPath,
  expandSources,
  templatePickerLabel,
  addTemplateToRoot,
  firstUsage,
} = require('../.test-build/templates.js');

const { check, report } = require('./harness');

check(
  'root decluttering_templates key',
  Object.keys(collectTemplates({ decluttering_templates: { a: { card: {} } } })),
  ['a'],
);

/* --------------------------------------------------------- view-level defaults */

const viewDefaultsDashboard = {
  decluttering_templates: { tile: { card: {}, default: [{ own: 'mine' }] } },
  decluttering_defaults: { colour: 'amber', size: 'small' },
  views: [{ title: 'Plain' }, { title: 'Dark', decluttering_defaults: { colour: 'black' } }],
};

check(
  'a view can set defaults of its own, which beat the dashboard-wide ones',
  collectTemplates(viewDefaultsDashboard, 1).tile.default,
  [{ own: 'mine' }, { colour: 'black' }, { colour: 'amber' }, { size: 'small' }],
);

check(
  'a view with no defaults of its own falls straight through to the dashboard',
  collectTemplates(viewDefaultsDashboard, 0).tile.default,
  [{ own: 'mine' }, { colour: 'amber' }, { size: 'small' }],
);

check('no view given reads as before', collectTemplates(viewDefaultsDashboard).tile.default, [
  { own: 'mine' },
  { colour: 'amber' },
  { size: 'small' },
]);

check(
  'viewIndexFromPath matches a view by its path, then by its number, then settles on the first',
  [
    viewIndexFromPath({ views: [{ path: 'home' }, { path: 'garden' }] }, 'garden'),
    viewIndexFromPath({ views: [{}, {}] }, '1'),
    viewIndexFromPath({ views: [{ path: 'home' }] }, 'nothing-known'),
    viewIndexFromPath({ views: [{ path: 'home' }] }, undefined),
  ],
  [1, 1, 0, 0],
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

check('a star borrows from every dashboard there is', expandSources(['*'], ['guests', 'holiday']), [
  'guests',
  'holiday',
]);

check(
  'named sources keep their place ahead of the star, and are not fetched twice',
  expandSources(['holiday', '*'], ['guests', 'holiday']),
  ['holiday', 'guests'],
);

check('no star changes nothing', expandSources(['a', 'b'], ['guests']), ['a', 'b']);

check('a star with nothing known is just the named ones', expandSources(['a', '*'], []), ['a']);
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

/* ---------------------------------------------------------------- extends */

const FAMILY = {
  decluttering_templates: {
    base_tile: {
      variables: [{ name: 'entity', selector: { entity: {} } }, { name: 'icon' }],
      default: [{ colour: 'blue' }],
      card: { type: 'tile', entity: '[[entity]]', features: [{ type: 'toggle' }] },
    },
    dim_tile: {
      extends: 'base_tile',
      variables: [{ name: 'entity', default: 'light.dim' }, { name: 'level' }],
      default: [{ colour: 'grey' }],
      card: { color: 'grey' },
    },
    dimmer_tile: { extends: 'dim_tile', card: { name: 'Dimmer' } },
    orphan: { extends: 'nowhere', card: { type: 'button' } },
  },
};

check('a child template deep-merges its content over its parent', collectTemplates(FAMILY).dim_tile.card, {
  type: 'tile',
  entity: '[[entity]]',
  features: [{ type: 'toggle' }],
  color: 'grey',
});

check(
  'declarations merge by name, the child having the last word in place',
  collectTemplates(FAMILY).dim_tile.variables,
  [{ name: 'entity', default: 'light.dim' }, { name: 'icon' }, { name: 'level' }],
);

check('a child default beats the parent default of the same name', collectTemplates(FAMILY).dim_tile.default, [
  { colour: 'grey' },
  { colour: 'blue' },
]);

check('extends chains, grandchild through child to parent', collectTemplates(FAMILY).dimmer_tile.card, {
  type: 'tile',
  entity: '[[entity]]',
  features: [{ type: 'toggle' }],
  color: 'grey',
  name: 'Dimmer',
});

check('the extends key is gone once it has been honoured', 'extends' in collectTemplates(FAMILY).dim_tile, false);

check('a parent nobody defines leaves the child as written, extends still on it', collectTemplates(FAMILY).orphan, {
  extends: 'nowhere',
  card: { type: 'button' },
});

check(
  'two templates extending each other do not hang',
  Object.keys(
    collectTemplates({
      decluttering_templates: { a: { extends: 'b', card: { x: 1 } }, b: { extends: 'a', card: { y: 2 } } },
    }),
  ).length,
  2,
);

/* ---------------------------------------------------------------- picker labels */

check(
  'a categorised template sorts and reads under its category',
  templatePickerLabel('room_tile', { category: 'Rooms', description: 'One room', card: {} }),
  'Rooms · room_tile — One room',
);

check(
  'no category reads as before',
  [templatePickerLabel('plain', { card: {} }), templatePickerLabel('desc', { description: 'Words', card: {} })],
  ['plain', 'desc — Words'],
);

check(
  'a template lands in decluttering_templates without touching anything else',
  addTemplateToRoot({ views: [{ title: 'Home' }] }, 'room_tile', { card: { type: 'tile' } }),
  { views: [{ title: 'Home' }], decluttering_templates: { room_tile: { card: { type: 'tile' } } } },
);

check(
  'installing at the root keeps the templates already there',
  addTemplateToRoot({ decluttering_templates: { kept: { card: {} } } }, 'added', { card: {} }).decluttering_templates,
  { kept: { card: {} }, added: { card: {} } },
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

check('the first card using a template is found, wherever it is nested', firstUsage(USED_IN, 'tile'), {
  type: 'custom:decluttering-card-plus',
  template: 'tile',
});

check('a template nothing uses has no first usage', firstUsage(USED_IN, 'missing'), null);

check(
  'a usage keeps its variables, which is what makes the preview real',
  firstUsage(
    { views: [{ cards: [{ type: 'custom:decluttering-card-plus', template: 'x', variables: [{ room: 'Hall' }] }] }] },
    'x',
  ).variables,
  [{ room: 'Hall' }],
);

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

/* ------------------------------------------------------------- did you mean */

check('a single letter wrong is a typo', closestTemplate('room_tiel', ['room_tile', 'weather']), 'room_tile');

check('a missing letter is a typo', closestTemplate('room_tle', ['room_tile', 'weather']), 'room_tile');

check('a wrong case is a typo', closestTemplate('Room_Tile', ['room_tile']), 'room_tile');

check(
  'something unrelated is not a typo of anything',
  [closestTemplate('completely_different', ['room_tile', 'weather'])],
  [null],
);

check('a name that exists needs no suggestion', [closestTemplate('room_tile', ['room_tile'])], [null]);

check('nothing to suggest from suggests nothing', [closestTemplate('room_tile', [])], [null]);

check('an empty name suggests nothing', [closestTemplate('', ['room_tile'])], [null]);

check(
  'the closest of several is the one offered',
  closestTemplate('room_tilx', ['weather', 'room_tile', 'room_tiles_extra']),
  'room_tile',
);

check('the sentence reads as a question', didYouMean('room_tiel', ['room_tile']), ' Did you mean "room_tile"?');

check('with nothing close it adds nothing at all', didYouMean('zzzz', ['room_tile']), '');

/* --------------------------------------------------- moving off the original names */

const OLD = {
  decluttering_templates: { tile: { card: { type: 'custom:decluttering-card', template: 'other' } } },
  views: [
    {
      cards: [
        { type: 'custom:decluttering-template', template: 'tile', card: { type: 'tile' } },
        { type: 'custom:decluttering-card', template: 'tile' },
        { type: 'vertical-stack', cards: [{ type: 'custom:decluttering-card-plus', template: 'tile' }] },
      ],
    },
  ],
};

check('every card still on the old names is counted', countLegacyTypes(OLD), 3);

check('a dashboard already moved over counts none', countLegacyTypes(moderniseTypes(OLD)), 0);

check(
  'the definition and the uses both move',
  moderniseTypes(OLD).views[0].cards.map((c) => c.type),
  ['custom:decluttering-template-plus', 'custom:decluttering-card-plus', 'vertical-stack'],
);

check(
  'a use inside a template definition moves too',
  moderniseTypes(OLD).decluttering_templates.tile.card.type,
  'custom:decluttering-card-plus',
);

check(
  'a card already on the new names is left exactly as it was',
  moderniseTypes(OLD).views[0].cards[2].cards[0].type,
  'custom:decluttering-card-plus',
);

check(
  'moving over does not mutate what it was given',
  (() => {
    const before = JSON.stringify(OLD);
    moderniseTypes(OLD);
    return JSON.stringify(OLD) === before;
  })(),
  true,
);

/* --------------------------------------------------------- dropping a card into a view */

check(
  'a card is added to the end of the view asked for',
  addCardToView({ views: [{ cards: [{ type: 'a' }] }, { cards: [] }] }, 0, { type: 'b' }).views[0].cards,
  [{ type: 'a' }, { type: 'b' }],
);

check(
  'a view with no cards yet gets its first',
  addCardToView({ views: [{ title: 'One' }] }, 0, { type: 'b' }).views[0].cards,
  [{ type: 'b' }],
);

check(
  'the other views are left exactly as they were',
  addCardToView({ views: [{ cards: [] }, { cards: [{ type: 'keep' }] }] }, 0, { type: 'b' }).views[1].cards,
  [{ type: 'keep' }],
);

check(
  'a view that is not there changes nothing rather than inventing one',
  addCardToView({ views: [{ cards: [] }] }, 7, { type: 'b' }).views.length,
  1,
);

check('a dashboard with no views at all is left alone', addCardToView({}, 0, { type: 'b' }), {});

check(
  'adding does not mutate what it was given',
  (() => {
    const original = { views: [{ cards: [] }] };
    addCardToView(original, 0, { type: 'b' });
    return original.views[0].cards.length;
  })(),
  0,
);

// The borrowing checks are asynchronous and call report() when they settle, so anything
// added after this point would run after the totals were printed.
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
