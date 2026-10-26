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
  hasSectionDefaults,
  isTemplateCardType,
  collectUsages,
  findTemplate,
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
  withLibrary,
  mayBorrowTemplates,
  LIBRARY_DASHBOARD,
  templatePickerLabel,
  addTemplateToRoot,
  firstUsage,
  totalUsages,
  checkDashboard,
  listPlainCards,
  replaceCard,
  applyOverride,
  misplacedOverrides,
  groupCard,
  GROUP_CARD_TYPE,
  parentsOf,
  extendsLoops,
  deprecationOf,
  deprecatedInUse,
  templatePickerOptions,
  warnIfDeprecated,
  byDomainOf,
  templatesNamedBy,
  pickTemplate,
  withPickedEntity,
} = require('../.test-build/templates.js');

const { check, report } = require('./harness');

check(
  'root decluttering_templates key',
  Object.keys(collectTemplates({ decluttering_templates: { a: { card: {} } } })),
  ['a'],
);

/* ---------------------------------------------------------------- group (#176) */

check(
  'a group builds the card that lays its cards out',
  groupCard({ cards: [{ type: 'tile' }, { type: 'heading' }] }),
  { type: GROUP_CARD_TYPE, cards: [{ type: 'tile' }, { type: 'heading' }] },
);

check('a group written as a bare list is the same list', groupCard([{ type: 'tile' }]).cards, [{ type: 'tile' }]);

check('a group with no cards is passed on for the card to refuse', groupCard({}).cards, undefined);

/* ------------------------------------------------------- group grid_options (#194) */

check(
  'a group keeps its grid_options, so the hui-card around a copy can size it',
  groupCard({ grid_options: { columns: 6 }, cards: [{ type: 'tile' }] }),
  { type: GROUP_CARD_TYPE, cards: [{ type: 'tile' }], grid_options: { columns: 6 } },
);

check('a group without grid_options adds no key', Object.keys(groupCard({ cards: [] })), ['type', 'cards']);

check(
  'a width variable in the group grid_options is put in per copy, as a number',
  require('../.test-build/deep-replace.js').default(
    [{ width: 12 }],
    { default: [{ width: 6 }] },
    groupCard({ grid_options: { columns: '[[width]]' }, cards: [{ type: 'tile' }] }),
  ).grid_options,
  { columns: 12 },
);

check('nothing else on the group is carried over', groupCard({ cards: [], grid_options: { columns: 6 }, title: 'x' }), {
  type: GROUP_CARD_TYPE,
  cards: [],
  grid_options: { columns: 6 },
});

check(
  'a group template extends like any other, the child list replacing the parent one',
  collectTemplates({
    decluttering_templates: {
      base: { group: { cards: [{ type: 'tile' }] }, default: [{ a: 1 }] },
      child: { extends: 'base', group: { cards: [{ type: 'heading' }] } },
    },
  }).child.group,
  { cards: [{ type: 'heading' }] },
);

check('a group: block on a card using a card template is never read', misplacedOverrides({ group: {} }, 'card'), [
  'group',
]);

/* --------------------------------------------------------- view-level defaults */

const { resolveVariables, variableValues } = require('../.test-build/variables.js');

const viewDefaultsDashboard = {
  decluttering_templates: {
    tile: {
      card: {},
      variables: [{ name: 'room', default: 'lounge' }],
      default: [{ own: 'mine' }, { colour: 'white' }],
    },
  },
  decluttering_defaults: { colour: 'amber', size: 'small', room: 'hall' },
  views: [{ title: 'Plain' }, { title: 'Kitchen', decluttering_defaults: { colour: 'black', room: 'kitchen' } }],
};

// Sorted by name, so the comparison is about the values and not the order they came in.
const valuesOn = (view, cardVariables) => {
  const values = variableValues(resolveVariables(cardVariables, collectTemplates(viewDefaultsDashboard, view).tile));
  return Object.fromEntries(
    Object.keys(values)
      .sort()
      .map((name) => [name, values[name]]),
  );
};

check('a view sets values that beat the template, its declarations and the dashboard', valuesOn(1), {
  colour: 'black',
  own: 'mine',
  room: 'kitchen',
  size: 'small',
});

check('a value on the card still beats the view', valuesOn(1, [{ room: 'pantry' }]).room, 'pantry');

check('a view with no values of its own leaves the template in charge', valuesOn(0), {
  colour: 'white',
  own: 'mine',
  room: 'lounge',
  size: 'small',
});

check(
  'the dashboard-wide values stay underneath the template',
  collectTemplates(viewDefaultsDashboard, 1).tile.default,
  [{ own: 'mine' }, { colour: 'white' }, { colour: 'amber' }, { size: 'small' }, { room: 'hall' }],
);

check(
  'the view values are not written into the template where an export would see them',
  Object.keys(collectTemplates(viewDefaultsDashboard, 1).tile).sort(),
  ['card', 'default', 'variables'],
);

/* ------------------------------------------------------- section-level defaults */

const sectionsDashboard = {
  decluttering_defaults: { room: 'dashboard', size: 'small' },
  decluttering_templates: { tile: { card: {}, default: [{ room: 'template' }, { colour: 'white' }] } },
  views: [
    {
      type: 'sections',
      decluttering_defaults: { room: 'view', colour: 'black' },
      sections: [
        { type: 'grid', decluttering_defaults: { room: 'kitchen' }, cards: [] },
        { type: 'grid', cards: [] },
      ],
    },
  ],
};

const inSection = (section, cardVariables) =>
  variableValues(resolveVariables(cardVariables, collectTemplates(sectionsDashboard, 0, undefined, section).tile));

check('a section sets values that beat its view, the template and the dashboard', inSection(0), {
  room: 'kitchen',
  colour: 'black',
  size: 'small',
});

check('a value on the card still beats the section', inSection(0, [{ room: 'pantry' }]).room, 'pantry');

check('a section with no values of its own leaves the view in charge', inSection(1).room, 'view');

check('no section given reads as before', inSection(undefined).room, 'view');

check(
  'a view the strategy writes out takes its values from inside the strategy',
  variableValues(
    resolveVariables(
      undefined,
      collectTemplates(
        {
          decluttering_templates: { tile: { card: {} } },
          views: [{ strategy: { type: 'custom:decluttering-card-plus', decluttering_defaults: { room: 'strategy' } } }],
        },
        0,
        undefined,
        2,
      ).tile,
    ),
  ).room,
  'strategy',
);

check(
  'a section only counts where it says something',
  [
    hasSectionDefaults(sectionsDashboard, { view: 0, section: 0 }),
    hasSectionDefaults(sectionsDashboard, { view: 0, section: 1 }),
    hasSectionDefaults(sectionsDashboard, { view: 0, section: 9 }),
    hasSectionDefaults(sectionsDashboard, undefined),
    hasSectionDefaults(null, { view: 0, section: 0 }),
  ],
  [true, false, false, false, false],
);

/* ------------------------------------------------- decluttering_let (#162) */

const letDashboard = {
  decluttering_let: { place: 'dashboard', slug: '[[room|slug]]', only_dashboard: 'd' },
  decluttering_templates: {
    tile: { card: { name: '[[slug]] [[place]]' }, default: [{ room: 'Living Room' }] },
    own_let: { card: {}, let: { place: 'template' } },
  },
  views: [
    {
      decluttering_let: { place: 'view', only_view: 'v' },
      sections: [{ decluttering_let: { place: 'section' } }, {}],
    },
    { strategy: { type: 'custom:decluttering-card-plus', decluttering_let: { place: 'strategy view' } } },
  ],
};

const letValues = (template, view, section, cardVariables) =>
  variableValues(resolveVariables(cardVariables, collectTemplates(letDashboard, view, undefined, section)[template]));

check(
  'a dashboard decluttering_let is worked out per card, from its own variables',
  require('../.test-build/deep-replace.js').default(
    [{ room: 'Back Hall' }],
    collectTemplates(letDashboard).tile,
    collectTemplates(letDashboard).tile.card,
  ),
  { name: 'back_hall dashboard' },
);

check(
  'a card cannot override a decluttering_let',
  letValues('tile', undefined, undefined, [{ place: 'card' }]).place,
  'dashboard',
);

check('a view decluttering_let beats the dashboard one', letValues('tile', 0).place, 'view');

check('a section decluttering_let beats its view', letValues('tile', 0, 0).place, 'section');

check('a section without one leaves the view in charge', letValues('tile', 0, 1).place, 'view');

check(
  'names only an outer level sets still come through',
  [letValues('tile', 0, 0).only_view, letValues('tile', 0, 0).only_dashboard],
  ['v', 'd'],
);

check("a template's own let: beats every decluttering_let", letValues('own_let', 0, 0).place, 'template');

check(
  'a view the strategy writes out takes its decluttering_let from inside the strategy',
  letValues('tile', 1).place,
  'strategy view',
);

check(
  'a section with only a decluttering_let still counts as placing its cards',
  hasSectionDefaults(letDashboard, { view: 0, section: 0 }),
  true,
);

check(
  'decluttering_let is never written into the template where an export would see it',
  Object.keys(collectTemplates(letDashboard, 0, undefined, 0).tile).sort(),
  ['card', 'default'],
);

check(
  'the health check counts a decluttering_let as setting the variable',
  checkDashboard({
    decluttering_let: { room: 'hall' },
    decluttering_templates: { tile: { card: { name: '[[room]]' } } },
    views: [{ cards: [{ type: 'custom:decluttering-card-plus', template: 'tile' }] }],
  }).unsetVariables,
  [],
);

/* ---------------------------------------------------------- defaults: (#175) */

check(
  'defaults: sits on top of the dashboard values, like default:',
  variableValues(
    resolveVariables(
      undefined,
      collectTemplates({
        decluttering_defaults: { colour: 'amber', size: 'small' },
        decluttering_templates: { tile: { card: {}, defaults: { colour: 'white' } } },
      }).tile,
    ),
  ),
  { colour: 'white', size: 'small' },
);

check(
  'a dashboard-values copy carries one folded default: list and no defaults:',
  (() => {
    const tile = collectTemplates({
      decluttering_defaults: { size: 'small' },
      decluttering_templates: { tile: { card: {}, default: [{ a: 1 }], defaults: { b: 2 } } },
    }).tile;
    return [tile.default, tile.defaults];
  })(),
  [[{ a: 1 }, { b: 2 }, { size: 'small' }], undefined],
);

check(
  'extends folds defaults: from both the child and the parent',
  variableValues(
    resolveVariables(
      undefined,
      collectTemplates({
        decluttering_templates: {
          base: { card: {}, defaults: { room: 'lounge', colour: 'white' } },
          child: { extends: 'base', defaults: { room: 'kitchen' } },
        },
      }).child,
    ),
  ),
  { room: 'kitchen', colour: 'white' },
);

check(
  'the health check reads defaults: before calling a variable unset',
  checkDashboard({
    decluttering_templates: { tile: { card: { name: '[[room]]' }, defaults: { room: 'hall' } } },
    views: [{ cards: [{ type: 'custom:decluttering-card-plus', template: 'tile' }] }],
  }).unsetVariables,
  [],
);

check(
  'decluttering_variables can say defaults: too',
  variableValues(
    resolveVariables(
      undefined,
      collectTemplates({
        decluttering_variables: [{ name: 'room', defaults: 'hall' }],
        decluttering_templates: { tile: { card: {}, variables: [{ name: 'room' }] } },
      }).tile,
    ),
  ).room,
  'hall',
);

/* ------------------------------------------------ declarations as a mapping (#223) */

const mappingDashboard = {
  decluttering_variables: { colour: { default: 'red', label: 'Colour' }, size: 2 },
  decluttering_templates: {
    tile: { card: { type: 'tile' }, variables: { colour: null, room: 'hall', size: { label: 'Size' } } },
    listed: { card: { type: 'tile' }, variables: [{ name: 'colour' }] },
    child: { extends: 'tile', variables: { room: 'kitchen' } },
  },
};
const mappingOut = collectTemplates(mappingDashboard);
check('a template declaring by mapping is read as the list, shared ones underneath', mappingOut.tile.variables, [
  { default: 'red', label: 'Colour', name: 'colour' },
  { name: 'room', default: 'hall' },
  { name: 'size', default: 2, label: 'Size' },
]);
check('a mapping decluttering_variables reaches a listed declaration', mappingOut.listed.variables, [
  { default: 'red', label: 'Colour', name: 'colour' },
]);
check(
  'a mapping default is a declared default when rendering',
  variableValues(resolveVariables(undefined, mappingOut.tile)),
  { colour: 'red', room: 'hall', size: 2 },
);
check('a card still wins over it', variableValues(resolveVariables([{ room: 'den' }], mappingOut.tile)).room, 'den');
check(
  'extends merges mapping declarations by name',
  variableValues(resolveVariables(undefined, mappingOut.child)).room,
  'kitchen',
);
check('the dashboard as written keeps its mapping', mappingDashboard.decluttering_templates.tile.variables, {
  colour: null,
  room: 'hall',
  size: { label: 'Size' },
});

/* ------------------------------------------------ a template card's own preview */

// A template card previews the definition it is handed, which in the edit dialog is the
// unsaved one - so it is passed in rather than read back off the dashboard.
const previewDashboard = {
  decluttering_defaults: { dashboard: 'home' },
  views: [
    {
      cards: [
        {
          type: 'custom:decluttering-template-plus',
          template: 'room_button',
          card: { type: 'button', name: '[[room]]', tap_action: { navigation_path: '/[[dashboard]]/[[room]]' } },
          default: [{ room: 'lounge' }],
        },
        { type: 'custom:decluttering-template-plus', template: 'room_button_kitchen', extends: 'room_button' },
      ],
    },
    { decluttering_defaults: { room: 'hall' } },
  ],
};

const kitchenCard = {
  type: 'custom:decluttering-template-plus',
  template: 'room_button_kitchen',
  extends: 'room_button',
  default: [{ room: 'kitchen' }],
};

check(
  'a template card previews with its parent folded in',
  collectTemplates(previewDashboard, 0, kitchenCard).room_button_kitchen.card,
  { type: 'button', name: '[[room]]', tap_action: { navigation_path: '/[[dashboard]]/[[room]]' } },
);

check(
  "a template card previews with the dashboard's defaults underneath its own",
  variableValues(resolveVariables([], collectTemplates(previewDashboard, 0, kitchenCard).room_button_kitchen)),
  { room: 'kitchen', dashboard: 'home' },
);

check(
  "a template card previews with its view's defaults on top",
  variableValues(resolveVariables([], collectTemplates(previewDashboard, 1, kitchenCard).room_button_kitchen)).room,
  'hall',
);

check(
  'the definition handed in beats the saved one of the same name',
  variableValues(resolveVariables([], collectTemplates(previewDashboard, 0, kitchenCard).room_button_kitchen)).room,
  'kitchen',
);

check(
  'a template card on no dashboard previews as written',
  collectTemplates(null, undefined, kitchenCard).room_button_kitchen,
  kitchenCard,
);

check('no view given reads as before', valuesOn(undefined), {
  colour: 'white',
  own: 'mine',
  room: 'lounge',
  size: 'small',
});

check(
  'a template built on another keeps its view values',
  variableValues(
    resolveVariables(
      [],
      collectTemplates(
        {
          decluttering_templates: { base: { card: {}, default: [{ room: 'lounge' }] }, child: { extends: 'base' } },
          views: [{ decluttering_defaults: { room: 'kitchen' } }],
        },
        0,
      ).child,
    ),
  ).room,
  'kitchen',
);

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
/* ------------------------------------------------- shared variable declarations */

const SHARED_DECLARATIONS = {
  decluttering_variables: [
    { name: 'colour', label: 'Colour', selector: { select: { options: ['red', 'blue'] } }, default: 'red' },
    { name: 'light', label: 'Light', selector: { entity: { domain: 'light' } } },
  ],
  decluttering_templates: {
    takes_colour: { variables: [{ name: 'colour' }], card: { type: 'tile', color: '[[colour]]' } },
    own_words: {
      variables: [
        { name: 'colour', description: 'The background' },
        { name: 'size', default: 2 },
      ],
      card: { type: 'tile' },
    },
    child: { extends: 'takes_colour', variables: [{ name: 'colour', label: 'Shade' }] },
    nothing_shared: { card: { type: 'tile' } },
  },
};
const sharedOut = collectTemplates(SHARED_DECLARATIONS);

check('a template naming a shared declaration takes all of it', sharedOut.takes_colour.variables, [
  SHARED_DECLARATIONS.decluttering_variables[0],
]);
check('what a template writes beside the name wins', sharedOut.own_words.variables[0], {
  name: 'colour',
  label: 'Colour',
  selector: { select: { options: ['red', 'blue'] } },
  default: 'red',
  description: 'The background',
});
check('a declaration nothing shares is left as written', sharedOut.own_words.variables[1], {
  name: 'size',
  default: 2,
});
check(
  'a shared declaration is not pushed onto a template that never names it',
  sharedOut.nothing_shared.variables,
  undefined,
);
check('extends keeps the child override on top of the shared declaration', sharedOut.child.variables[0].label, 'Shade');
check('and the rest of the shared declaration underneath', sharedOut.child.variables[0].default, 'red');
check(
  'a shared default is a default like any other',
  resolveVariables([], sharedOut.takes_colour).find((entry) => 'colour' in entry),
  { colour: 'red' },
);

check('the library is read first, so anything named beats it', withLibrary(['a', 'b'], false), [
  'decluttering-templates',
  'a',
  'b',
]);
check('the library is read once however it is named', withLibrary(['decluttering-templates', 'a'], false), [
  'decluttering-templates',
  'a',
]);
check('the library borrows nothing from itself', withLibrary(['a', 'decluttering-templates'], true), ['a']);
check('a dashboard naming nothing may still borrow from the library', mayBorrowTemplates({}), true);
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

/* ---------------------------------------------------------------- overrides */

const builtTile = {
  type: 'tile',
  entity: 'light.living_room',
  icon: 'mdi:lightbulb',
  tap_action: { action: 'toggle', haptic: 'light' },
  features: [{ type: 'light-brightness' }],
};

check(
  'override: a card: block merges over what the template built, key by key',
  applyOverride(builtTile, { card: { icon: 'mdi:flood-light', tap_action: { action: 'more-info' } } }, 'card'),
  {
    type: 'tile',
    entity: 'light.living_room',
    icon: 'mdi:flood-light',
    tap_action: { action: 'more-info', haptic: 'light' },
    features: [{ type: 'light-brightness' }],
  },
);
check(
  'override: a list replaces rather than merges',
  applyOverride(builtTile, { card: { features: [{ type: 'toggle' }] } }, 'card').features,
  [{ type: 'toggle' }],
);
check(
  'override: a null drops the key the template set',
  Object.keys(applyOverride(builtTile, { card: { icon: null, tap_action: { haptic: null } } }, 'card')),
  ['type', 'entity', 'tap_action', 'features'],
);
check(
  'override: a null nested under a new key is dropped too',
  applyOverride({ type: 'tile' }, { card: { hold_action: { action: 'none', data: null } } }, 'card'),
  { type: 'tile', hold_action: { action: 'none' } },
);
check(
  'override: placeholders in it are taken literally',
  applyOverride(builtTile, { card: { name: '[[room]]' } }, 'card').name,
  '[[room]]',
);
check(
  'override: only the block matching the kind applies',
  applyOverride({ type: 'entity' }, { card: { icon: 'mdi:x' }, badge: { color: 'red' } }, 'badge'),
  { type: 'entity', color: 'red' },
);
check('override: no block leaves the result as it was', applyOverride(builtTile, { template: 't' }, 'card'), builtTile);
check(
  'override: a block that is not a mapping is ignored',
  applyOverride(builtTile, { card: 'tile' }, 'card'),
  builtTile,
);
check('override: the original is not touched', builtTile.icon, 'mdi:lightbulb');

/* list edits (#209) */
const listed = { type: 'entities', entities: ['a', 'b', 'c'] };
const edit = (entities) => applyOverride(listed, { card: { entities } }, 'card').entities;
check('list edit: __append__ adds to the end', edit({ __append__: ['x', 'y'] }), ['a', 'b', 'c', 'x', 'y']);
check('list edit: __prepend__ adds to the start', edit({ __prepend__: ['x'] }), ['x', 'a', 'b', 'c']);
check('list edit: a single value appends as one item', edit({ __append__: 'x' }), ['a', 'b', 'c', 'x']);
check('list edit: __update__ replaces a scalar item', edit({ __update__: { 1: 'x' } }), ['a', 'x', 'c']);
check('list edit: __update__ with null removes the item', edit({ __update__: { 1: null } }), ['a', 'c']);
check('list edit: __update__ past the end adds it', edit({ __update__: { 5: 'z' } }), ['a', 'b', 'c', 'z']);
check('list edit: a negative index counts from the end', edit({ __update__: { '-1': 'z' } }), ['a', 'b', 'z']);
check('list edit: __remove__ takes indexes out', edit({ __remove__: [0, 1] }), ['c']);
check('list edit: __remove__ a single index', edit({ __remove__: 2 }), ['a', 'b']);
check('list edit: indexes nobody can read are ignored', edit({ __remove__: ['x', 1.5, -9] }), ['a', 'b', 'c']);
check(
  'list edit: combined, every index meaning the list as the template had it',
  edit({ __append__: ['x'], __update__: { 0: 'y' }, __remove__: [1] }),
  ['y', 'c', 'x'],
);
check(
  'list edit: __update__ merges into a mapping item',
  applyOverride(
    { type: 'entities', entities: [{ entity: 'light.a', name: 'A' }, { entity: 'light.b' }] },
    { card: { entities: { __update__: { 0: { name: 'Lamp', icon: 'mdi:lamp' } } } } },
    'card',
  ).entities,
  [{ entity: 'light.a', name: 'Lamp', icon: 'mdi:lamp' }, { entity: 'light.b' }],
);
check(
  'list edit: nothing there yet starts from an empty list',
  applyOverride({ type: 'x' }, { card: { features: { __append__: [{ type: 'toggle' }] } } }, 'card').features,
  [{ type: 'toggle' }],
);
check(
  'list edit: over a mapping the keys are ordinary keys',
  applyOverride({ type: 'x', data: { a: 1 } }, { card: { data: { __append__: 2 } } }, 'card').data,
  { a: 1, __append__: 2 },
);
check('list edit: a mapping with other keys besides is an ordinary mapping', edit({ __append__: ['x'], other: 1 }), {
  __append__: ['x'],
  other: 1,
});
check('list edit: the template list is not touched', listed.entities, ['a', 'b', 'c']);
check('misplaced: a card: block on a badge template', misplacedOverrides({ card: {}, badge: {} }, 'badge'), ['card']);
check('misplaced: the matching block is fine', misplacedOverrides({ card: {} }, 'card'), []);
check('misplaced: unknown kind says nothing', misplacedOverrides({ card: {} }, undefined), []);

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

check(
  'a null in a child takes the parent key away, as on a card (#193)',
  collectTemplates({
    decluttering_templates: {
      cam: { card: { type: 'camera', images: ['a'], menu: { enabled: true, style: 'hover' } } },
      lean: { extends: 'cam', card: { images: null, menu: { style: null } } },
    },
  }).lean.card,
  { type: 'camera', menu: { enabled: true } },
);

check(
  'a child can edit the parent list instead of replacing it (#209)',
  collectTemplates({
    decluttering_templates: {
      cam: { card: { type: 'camera', images: ['a', 'b'] } },
      more: { extends: 'cam', card: { images: { __append__: ['c'], __remove__: [0] } } },
    },
  }).more.card,
  { type: 'camera', images: ['b', 'c'] },
);

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

/* ---------------------------------------------------------- extends from several */

const MIXINS = {
  decluttering_templates: {
    base: {
      variables: [{ name: 'entity' }, { name: 'icon', default: 'mdi:a' }],
      default: [{ colour: 'blue' }, { size: 1 }],
      card: { type: 'tile', entity: '[[entity]]', icon: '[[icon]]', tap_action: { action: 'toggle' } },
    },
    with_actions: {
      variables: [{ name: 'icon', default: 'mdi:b' }, { name: 'target' }],
      default: [{ colour: 'red' }],
      card: { tap_action: { action: 'navigate', navigation_path: '[[target]]' }, hold_action: { action: 'more-info' } },
    },
    room: {
      extends: ['base', 'with_actions'],
      default: [{ size: 3 }],
      card: { name: 'Room' },
    },
    single: { extends: ['base'], card: { name: 'One' } },
    nested_mixin: { extends: 'with_actions', card: { hold_action: null } },
    deep: { extends: ['base', 'nested_mixin'], card: { name: 'Deep' } },
    half_known: { extends: ['base', 'nowhere'], card: { name: 'Half' } },
  },
};
const mixed = collectTemplates(MIXINS);

check('several parents fold left to right, the later one winning, the child over both', mixed.room.card, {
  type: 'tile',
  entity: '[[entity]]',
  icon: '[[icon]]',
  tap_action: { action: 'navigate', navigation_path: '[[target]]' },
  hold_action: { action: 'more-info' },
  name: 'Room',
});

check('declarations from several parents merge by name, a later parent replacing in place', mixed.room.variables, [
  { name: 'entity' },
  { name: 'icon', default: 'mdi:b' },
  { name: 'target' },
]);

check('defaults: the child first, then the later parent, then the earlier one', mixed.room.default, [
  { size: 3 },
  { colour: 'red' },
  { colour: 'blue' },
  { size: 1 },
]);

check('a list of one parent is the same as the name on its own', mixed.single.card.name, 'One');
check('the extends list is gone once it has been honoured', 'extends' in mixed.room, false);

check('each parent resolves its own extends first, a null in it still taking a key away', mixed.deep.card, {
  type: 'tile',
  entity: '[[entity]]',
  icon: '[[icon]]',
  tap_action: { action: 'navigate', navigation_path: '[[target]]' },
  name: 'Deep',
});

check('a list naming a parent nobody defines leaves the child as written', mixed.half_known, {
  extends: ['base', 'nowhere'],
  card: { name: 'Half' },
});

check(
  'a loop through the second parent of a list does not hang',
  Object.keys(
    collectTemplates({
      decluttering_templates: {
        a: { extends: ['c', 'b'], card: { x: 1 } },
        b: { extends: ['a'], card: { y: 2 } },
        c: { card: { z: 3 } },
      },
    }),
  ).length,
  3,
);

check(
  'templateParents reads a name, a list, and anything else',
  [
    parentsOf({ extends: 'a' }),
    parentsOf({ extends: ['a', 3, 'b'] }),
    parentsOf({ extends: null }),
    parentsOf(undefined),
  ],
  [['a'], ['a', 'b'], [], []],
);

check(
  'extendsLoops names a loop through any parent, once',
  extendsLoops({
    decluttering_templates: {
      a: { extends: ['c', 'b'], card: {} },
      b: { extends: 'a', card: {} },
      c: { card: {} },
      d: { extends: 'd', card: {} },
    },
  }),
  [
    ['a', 'b', 'a'],
    ['d', 'd'],
  ],
);

check('no loop, nothing to report', extendsLoops(MIXINS), []);

check(
  'every parent in a list counts as used',
  checkDashboard({
    decluttering_templates: MIXINS.decluttering_templates,
    views: [{ cards: [{ type: 'custom:decluttering-card-plus', template: 'room' }] }],
  }).unusedTemplates,
  ['deep', 'half_known', 'single'],
);

{
  // A view's and a section's decluttering_let and decluttering_defaults give names values
  // the health panel must count, each only where it reaches.
  const PLACED = {
    decluttering_templates: { let_t: { card: { type: 'markdown', content: '[[vlet]] [[slet]] [[sdef]]' } } },
    views: [
      {
        type: 'sections',
        decluttering_let: [{ vlet: 'V' }],
        sections: [
          {
            decluttering_let: [{ slet: 'S' }],
            decluttering_defaults: [{ sdef: 'D' }],
            cards: [{ type: 'custom:decluttering-card-plus', template: 'let_t' }],
          },
          { cards: [{ type: 'custom:decluttering-card-plus', template: 'let_t' }] },
        ],
      },
      { cards: [{ type: 'custom:decluttering-card-plus', template: 'let_t' }] },
    ],
  };
  check(
    "names given by the card's view and section are not unset; elsewhere they are",
    checkDashboard(PLACED).unsetVariables,
    [{ template: 'let_t', names: ['sdef', 'slet', 'vlet'], count: 2 }],
  );
}

check(
  'where-used lists the templates that extend this one, whichever place in the list it has',
  collectUsages(MIXINS, 'with_actions').templates,
  ['room', 'nested_mixin'],
);

check(
  'a rename follows an extends written as a name or in a list',
  (() => {
    const out = renameTemplate(
      {
        decluttering_templates: { base: { card: {} }, a: { extends: 'base' }, b: { extends: ['x', 'base'] } },
        views: [{ cards: [{ type: 'custom:decluttering-template-plus', template: 'c', extends: ['base'] }] }],
      },
      'base',
      'root',
    );
    return [
      Object.keys(out.decluttering_templates),
      out.decluttering_templates.a.extends,
      out.decluttering_templates.b.extends,
      out.views[0].cards[0].extends,
    ];
  })(),
  [['root', 'a', 'b'], 'root', ['x', 'root'], ['root']],
);

/* ---------------------------------------------------------------- deprecated */

check(
  'deprecated: true, a message, and nothing at all',
  [
    deprecationOf({ deprecated: true }),
    deprecationOf({ deprecated: 'Use room_tile_v2' }),
    deprecationOf({}),
    deprecationOf({ deprecated: false }),
  ],
  ['', 'Use room_tile_v2', undefined, undefined],
);

check('an empty or blank message is still deprecated, with nothing to add', deprecationOf({ deprecated: '  ' }), '');

const RETIRING = {
  decluttering_templates: {
    old_tile: { deprecated: 'Use room_tile_v2', card: { type: 'tile' } },
    older: { deprecated: true, card: { type: 'tile' } },
    unused_old: { deprecated: true, card: { type: 'tile' } },
    built_on_old: { extends: 'old_tile', card: { name: 'x' } },
    fresh: { card: { type: 'tile' } },
  },
  views: [
    {
      title: 'Rooms',
      cards: [
        { type: 'custom:decluttering-card-plus', template: 'old_tile' },
        { type: 'custom:decluttering-card-plus', template: 'old_tile' },
        { type: 'custom:decluttering-card-plus', template: 'built_on_old' },
      ],
    },
    { path: 'hall', cards: [{ type: 'custom:decluttering-card-plus', template: 'older' }] },
  ],
};

check(
  'a template built on a deprecated one is not itself deprecated',
  deprecationOf(collectTemplates(RETIRING).built_on_old),
  undefined,
);
check(
  'but one that says so for itself is',
  deprecationOf(
    collectTemplates({ decluttering_templates: { a: { card: {} }, b: { extends: 'a', deprecated: true } } }).b,
  ),
  '',
);

check('deprecated templates still in use, with where and why', deprecatedInUse(RETIRING), [
  {
    template: 'old_tile',
    message: 'Use room_tile_v2',
    views: [{ title: 'Rooms', count: 2 }],
    templates: ['built_on_old'],
  },
  { template: 'older', message: '', views: [{ title: 'hall', count: 1 }], templates: [] },
]);

check('the picker marks deprecated templates and puts them last', templatePickerOptions(collectTemplates(RETIRING)), [
  { value: 'built_on_old', label: 'built_on_old' },
  { value: 'fresh', label: 'fresh' },
  { value: 'old_tile', label: 'old_tile (deprecated)' },
  { value: 'older', label: 'older (deprecated)' },
  { value: 'unused_old', label: 'unused_old (deprecated)' },
]);

{
  const said = [];
  const original = console.warn;
  console.warn = (text) => said.push(text);
  warnIfDeprecated('old_tile', { deprecated: 'Use room_tile_v2' });
  warnIfDeprecated('old_tile', { deprecated: 'Use room_tile_v2' });
  warnIfDeprecated('older', { deprecated: true });
  warnIfDeprecated('fresh', { card: {} });
  console.warn = original;
  check('a deprecated template is mentioned once per page, with its message', said, [
    'decluttering-card-plus: the template "old_tile" is deprecated: Use room_tile_v2',
    'decluttering-card-plus: the template "older" is deprecated. Cards using it still work, but it may be removed.',
  ]);
}

/* ------------------------------------------------------------ template_by_domain */

const BY_DOMAIN = {
  type: 'custom:decluttering-card-plus',
  template_by_domain: { light: 'light_tile', cover: 'cover_tile', default: 'generic_tile', bad: 3 },
};
const DOMAIN_TEMPLATES = {
  light_tile: { card: { type: 'tile', entity: '[[entity]]', name: 'light' } },
  cover_tile: { card: { type: 'tile', entity: '[[entity]]', name: 'cover' } },
  generic_tile: { default: [{ entity: 'sensor.default' }], card: { type: 'entity', entity: '[[entity]]' } },
  plain: { card: { type: 'button' } },
  room: { default: [{ room: 'hall' }], card: { type: 'tile', entity: '[[entity]]' } },
};
const lookup = (name) => DOMAIN_TEMPLATES[name];
{
  // The fallback template's default picks; the picked template must be built with it.
  const config = { template: 'c_dflt_ent', template_by_domain: { light: 'c_room_light' } };
  const templates = {
    c_dflt_ent: { default: [{ entity: 'light.bedroom' }], card: { type: 'markdown', content: 'DFLT [[entity]]' } },
    c_room_light: { card: { type: 'markdown', content: 'ROOM-LIGHT [[entity]]' } },
  };
  const pick = pickTemplate(config, [{ other: 1 }], (name) => templates[name]);
  check(
    'an entity from the fallback default comes back with the pick',
    [pick.name, pick.entity],
    ['c_room_light', 'light.bedroom'],
  );
  const build = require('../.test-build/deep-replace.js').default;
  check(
    'and the picked template is built with it',
    build(withPickedEntity([{ other: 1 }], pick.entity), pick.template, pick.template.card).content,
    'ROOM-LIGHT light.bedroom',
  );
  check(
    "a card's own entity is not handed back - it is already there, and wins",
    pickTemplate(config, [{ entity: 'light.kitchen' }], (name) => templates[name]).entity,
    undefined,
  );
  check('nothing picked by, nothing added', withPickedEntity([{ a: 1 }], undefined), [{ a: 1 }]);
}

const picked = (config, variables) => {
  try {
    return pickTemplate(config, variables, lookup, undefined, Object.keys(DOMAIN_TEMPLATES)).name;
  } catch (err) {
    return `error: ${err.message}`;
  }
};

check(
  'by domain: only the names, and only as a mapping',
  [byDomainOf(BY_DOMAIN), byDomainOf({ template_by_domain: ['a'] }), byDomainOf({})],
  [{ light: 'light_tile', cover: 'cover_tile', default: 'generic_tile' }, undefined, undefined],
);

check('every template a card names, by domain and plain', templatesNamedBy({ ...BY_DOMAIN, template: 'plain' }), [
  'plain',
  'light_tile',
  'cover_tile',
  'generic_tile',
]);
check('a card that is not ours names nothing', templatesNamedBy({ type: 'tile', template: 'x' }), []);

check(
  'the entity picks the template by its domain',
  [picked(BY_DOMAIN, [{ entity: 'light.a' }]), picked(BY_DOMAIN, [{ entity: 'cover.b' }])],
  ['light_tile', 'cover_tile'],
);
check('a domain with no entry takes default:', picked(BY_DOMAIN, [{ entity: 'switch.c' }]), 'generic_tile');
check(
  'with no default:, template: is the default',
  picked({ template: 'plain', template_by_domain: { light: 'light_tile' } }, [{ entity: 'switch.c' }]),
  'plain',
);
check(
  'default: beats template: when both are written',
  picked({ template: 'plain', template_by_domain: { default: 'generic_tile' } }, [{ entity: 'switch.c' }]),
  'generic_tile',
);
check("the entity can come from the default template's defaults", picked(BY_DOMAIN, []), 'generic_tile');
check(
  'an entity built from other variables is worked out first',
  picked({ template: 'room', template_by_domain: { light: 'light_tile' } }, [{ entity: 'light.[[room]]' }]),
  'light_tile',
);
check(
  'a domain with no entry and nothing to fall back on names the domain',
  picked({ template_by_domain: { light: 'light_tile' } }, [{ entity: 'switch.c' }]),
  'error: No template for the domain "switch" in template_by_domain, and no default: or template: to fall back on.',
);
check(
  'no entity at all says so the same way',
  picked({ template_by_domain: { light: 'light_tile' } }, []),
  'error: No template for the domain "(no entity)" in template_by_domain, and no default: or template: to fall back on.',
);
check(
  'a name that does not exist is the usual missing-template error, with its near miss',
  picked({ template_by_domain: { light: 'light_tlie' } }, [{ entity: 'light.a' }]).startsWith(
    'error: The template "light_tlie" doesn\'t exist',
  ) && picked({ template_by_domain: { light: 'light_tlie' } }, [{ entity: 'light.a' }]).includes('light_tile'),
  true,
);
check(
  'a domain lookup only reads names set on the mapping',
  picked({ template_by_domain: { default: 'plain' } }, [{ entity: 'constructor.x' }]),
  'plain',
);

const DOMAIN_DASH = {
  decluttering_templates: DOMAIN_TEMPLATES,
  views: [
    {
      title: 'Mixed',
      cards: [
        {
          type: 'custom:decluttering-card-plus',
          template_by_domain: { light: 'light_tile', fan: 'fan_tile', default: 'generic_tile' },
          for_each: [{ entity: 'light.a' }],
        },
      ],
    },
  ],
};
check(
  'a by-domain card counts as a use of every template it names',
  [
    totalUsages(DOMAIN_DASH, 'light_tile'),
    totalUsages(DOMAIN_DASH, 'generic_tile'),
    totalUsages(DOMAIN_DASH, 'cover_tile'),
  ],
  [1, 1, 0],
);
check(
  'a name it gives that does not exist is reported missing',
  checkDashboard(DOMAIN_DASH).missingTemplates.map((m) => m.template),
  ['fan_tile'],
);
check(
  'it is the first usage of each of them for the impact preview',
  firstUsage(DOMAIN_DASH, 'light_tile') !== null,
  true,
);
check(
  'a rename follows into template_by_domain',
  renameTemplate(DOMAIN_DASH, 'light_tile', 'lamp_tile').views[0].cards[0].template_by_domain,
  { light: 'lamp_tile', fan: 'fan_tile', default: 'generic_tile' },
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

check('totalUsages counts cards and consuming templates together', totalUsages(USED_IN, 'tile'), 5);

check('totalUsages of nothing is zero', totalUsages(USED_IN, 'missing'), 0);

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
  decluttering_let: { lent: 'lender-let', clash: 'lender' },
  decluttering_templates: { shared_badge: { default: [{ own: 'template-own' }], card: { type: 'markdown' } } },
};
const borrower = {
  decluttering_defaults: { colour: 'amber' },
  decluttering_let: { clash: 'borrower' },
  decluttering_templates_from: ['lend'],
  views: [],
};

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

/* -------------------------------------------- a __proto__ key never reparents an object */

const protoOverride = applyOverride({ a: 1 }, JSON.parse('{"card":{"__proto__":{"polluted":1}}}'), 'card');
check(
  'an override written with a __proto__ key leaves the result a plain object',
  [Object.getPrototypeOf(protoOverride) === Object.prototype, protoOverride.polluted, {}.polluted],
  [true, undefined, undefined],
);

const protoLl = {
  decluttering_templates: JSON.parse(
    '{"p":{"card":{"type":"tile"}},"c":{"extends":"p","card":{"__proto__":{"polluted":2}}}}',
  ),
};
const protoChild = collectTemplates(protoLl).c.card;
check(
  'an extends child written with a __proto__ key leaves the merged card a plain object',
  [Object.getPrototypeOf(protoChild) === Object.prototype, protoChild.polluted],
  [true, undefined],
);

check(
  'a template looked up by an inherited name is not found',
  [
    findTemplate({ decluttering_templates: { a: { card: {} } } }, 'constructor'),
    findTemplate({ decluttering_templates: {} }, 'toString'),
  ],
  [null, null],
);

// The borrowing checks are asynchronous and call report() when they settle, so anything
// added after this point would run after the totals were printed.
const library = {
  decluttering_defaults: { colour: 'library-colour', reach: 'everywhere' },
  decluttering_templates: {
    library_only: { card: { type: 'markdown', content: '[[reach]]' } },
    shared_badge: { card: { type: 'library-version' } },
  },
};
const hass = {
  callWS: ({ url_path }) => Promise.resolve(url_path === LIBRARY_DASHBOARD ? library : lender),
};

collectAllTemplates(hass, { views: [] }).then((all) => {
  check('a dashboard naming nothing gets the library templates', Object.keys(all).sort(), [
    'library_only',
    'shared_badge',
  ]);
  check('a library template keeps the library defaults', all.library_only.default, [
    { colour: 'library-colour' },
    { reach: 'everywhere' },
  ]);
});

collectAllTemplates(hass, borrower).then((all) => {
  check('a dashboard named on purpose beats the library', all.shared_badge.card, { type: 'markdown' });
  check('and the library still fills in what it does not have', !!all.library_only, true);
});

collectAllTemplates(hass, borrower).then((all) => {
  const badge = all.shared_badge;
  check('a borrowed template keeps its own default first, then the borrower, then the lender', badge.default, [
    { own: 'template-own' },
    { colour: 'amber' },
    { colour: 'green' },
    { shape: 'lender-shape' },
  ]);

  check(
    "a borrowed template gets this dashboard's decluttering_let first, then the lender's",
    variableValues(resolveVariables([{ clash: 'card' }], badge)),
    { clash: 'borrower', lent: 'lender-let', own: 'template-own', colour: 'amber', shape: 'lender-shape' },
  );

  /* ---------------------------------------------------------------- health */

  const UNHEALTHY = {
    decluttering_templates: {
      room_tile: { card: { type: 'tile', entity: '[[entity]]' } },
      never_used: { card: { type: 'tile' } },
    },
    views: [
      {
        cards: [
          { type: 'custom:decluttering-card-plus', template: 'room_tile', variables: [{ entity: 'light.a' }] },
          { type: 'custom:decluttering-card-plus', template: 'room_tile' },
          { type: 'custom:decluttering-card-plus', template: 'room_tlie' },
        ],
      },
    ],
  };

  const HEALTH = checkDashboard(UNHEALTHY);

  check('a card naming a template that does not exist is found, with the near miss', HEALTH.missingTemplates, [
    { template: 'room_tlie', count: 1, closest: 'room_tile' },
  ]);

  check('a card leaving a variable unset is found', HEALTH.unsetVariables, [
    { template: 'room_tile', names: ['entity'], count: 1 },
  ]);

  check('a template nothing uses is found', HEALTH.unusedTemplates, ['never_used']);

  check(
    'a card using a template borrowed from another dashboard is not missing',
    checkDashboard(
      {
        decluttering_templates_from: 'elsewhere',
        views: [{ cards: [{ type: 'custom:decluttering-card-plus', template: 'from_elsewhere' }] }],
      },
      ['from_elsewhere'],
    ).missingTemplates,
    [],
  );

  check(
    'but a name nobody defines still is, borrowing or not',
    checkDashboard(
      {
        decluttering_templates_from: 'elsewhere',
        views: [{ cards: [{ type: 'custom:decluttering-card-plus', template: 'typo_tile' }] }],
      },
      ['from_elsewhere'],
    ).missingTemplates.map((m) => m.template),
    ['typo_tile'],
  );

  check(
    'a template another one extends is not unused',
    checkDashboard({
      decluttering_templates: {
        base: { card: { type: 'tile' } },
        child: { extends: 'base', card: { name: 'x' } },
      },
      views: [{ cards: [{ type: 'custom:decluttering-card-plus', template: 'child' }] }],
    }).unusedTemplates,
    [],
  );

  check(
    'a healthy dashboard reports nothing at all',
    checkDashboard({
      decluttering_templates: { tile: { card: { entity: '[[entity]]' } } },
      views: [{ cards: [{ type: 'custom:decluttering-card-plus', template: 'tile', variables: [{ entity: 'x' }] }] }],
    }),
    { missingTemplates: [], unsetVariables: [], unusedTemplates: [] },
  );

  /* ---------------------------------------------------------- declutter this card */

  const PLAIN_DASH = {
    views: [
      {
        title: 'Home',
        cards: [
          { type: 'tile', entity: 'light.a', name: 'Lamp' },
          { type: 'custom:decluttering-card-plus', template: 'tile' },
          { type: 'vertical-stack', cards: [{ type: 'markdown', content: 'hi' }] },
          { type: 'custom:decluttering-template-plus', template: 'x', card: { type: 'button' } },
        ],
      },
    ],
  };

  check(
    'plain cards are listed with a place and a label, this card and its kin left out',
    listPlainCards(PLAIN_DASH).map((c) => c.label),
    ['Home · tile (Lamp)', 'Home · vertical-stack', 'Home · markdown'],
  );

  check('the listed config is the card as written', listPlainCards(PLAIN_DASH)[0].config, {
    type: 'tile',
    entity: 'light.a',
    name: 'Lamp',
  });

  check(
    'replaceCard swaps the first identical card and nothing else',
    replaceCard(
      PLAIN_DASH,
      { type: 'tile', entity: 'light.a', name: 'Lamp' },
      { type: 'custom:decluttering-card-plus', template: 'room' },
    ).views[0].cards[0],
    { type: 'custom:decluttering-card-plus', template: 'room' },
  );

  check(
    'replaceCard leaves a dashboard without the card untouched',
    replaceCard(PLAIN_DASH, { type: 'tile', entity: 'nope' }, { type: 'x' }),
    PLAIN_DASH,
  );

  // A template card whose parent lives on a dashboard this one borrows from.
  const childOfBorrowed = {
    type: 'custom:decluttering-template-plus',
    template: 'badge_child',
    extends: 'shared_badge',
  };
  return collectAllTemplates(hass, borrower, undefined, childOfBorrowed).then((withChild) => {
    check(
      'a template card previews with a borrowed parent folded in',
      [withChild.badge_child.extends, withChild.badge_child.card],
      [undefined, all.shared_badge.card],
    );
    check(
      'the health check counts what a repeated section in the view strategy hands its cards',
      checkDashboard({
        decluttering_templates: { room: { card: { type: 'markdown', content: '[[area_id]] [[shade]] [[gone]]' } } },
        views: [
          {
            strategy: {
              type: 'custom:decluttering-card-plus',
              sections: [
                {
                  for_each_from: { areas: true },
                  variables: [{ shade: 'dark' }],
                  section: { type: 'grid', cards: [{ type: 'custom:decluttering-card-plus', template: 'room' }] },
                },
              ],
            },
          },
        ],
      }).unsetVariables,
      [{ template: 'room', names: ['gone'], count: 1 }],
    );

    /* ------------------------------------------------------------- installed shared templates */

    {
      const { installedFromShared, replaceTemplate } = require('../.test-build/templates.js');
      const stamp = { discussion: 7, updated: '2026-01-01T00:00:00Z', name: 'tile_light' };
      const ll = {
        decluttering_templates: {
          first: { card: { type: 'a' } },
          tile_light: { source: stamp, card: { type: 'tile' } },
          third: { card: { type: 'c' } },
          from_library: { source: { library: 'room_summary', version: '1.15.2' }, card: { type: 'x' } },
          mine: { extends: 'tile_light', card: { name: 'mine' } },
        },
        views: [
          {
            cards: [
              { type: 'custom:decluttering-template-plus', template: 'posted', source: { discussion: 9 }, card: {} },
              { type: 'custom:decluttering-card-plus', template: 'tile_light' },
              {
                type: 'vertical-stack',
                cards: [
                  {
                    type: 'custom:decluttering-template',
                    template: 'tile_light',
                    source: stamp,
                    card: { type: 'old' },
                  },
                ],
              },
            ],
          },
        ],
      };

      check(
        'the templates installed from a post are listed, wherever they are defined, by name',
        installedFromShared(ll).map((each) => [each.name, each.source.discussion]),
        [
          ['posted', 9],
          ['tile_light', 7],
        ],
      );

      check(
        'a template built on an installed one is not itself installed',
        installedFromShared(ll).some((each) => each.name === 'mine'),
        false,
      );

      check('a dashboard with nothing installed lists nothing', installedFromShared({ views: [] }), []);

      const latest = { source: { ...stamp, updated: '2026-02-01T00:00:00Z' }, card: { type: 'tile', new: true } };
      const replaced = replaceTemplate(ll, 'tile_light', latest);

      check(
        'the root definition is replaced in its place in the list',
        [Object.keys(replaced.decluttering_templates), replaced.decluttering_templates.tile_light],
        [['first', 'tile_light', 'third', 'from_library', 'mine'], latest],
      );

      check(
        'a template card of the same name is replaced too, keeping its own type and leading with it',
        replaced.views[0].cards[2].cards[0],
        { type: 'custom:decluttering-template', template: 'tile_light', ...latest },
      );

      check('the cards using it are left exactly as they were', replaced.views[0].cards[1], {
        type: 'custom:decluttering-card-plus',
        template: 'tile_light',
      });

      check('other templates are untouched', replaced.views[0].cards[0], ll.views[0].cards[0]);

      check('the original is not mutated', ll.decluttering_templates.tile_light.source.updated, '2026-01-01T00:00:00Z');

      check(
        'a template defined only on a card leaves the root alone',
        replaceTemplate({ views: [] }, 'x', { card: {} }).decluttering_templates,
        undefined,
      );
    }

    /*
     * The original dashboard, on an instance that never took control of it, has nothing
     * saved: Home Assistant answers config_not_found. That is normal and says nothing;
     * anything else failing still does.
     */
    const said = [];
    const original = console.warn;
    console.warn = (...args) => said.push(args.join(' '));
    const refusing = {
      callWS: ({ url_path }) =>
        url_path === null
          ? Promise.reject({ code: 'config_not_found', message: 'No config found.' })
          : url_path === 'broken'
            ? Promise.reject({ code: 'unknown_error', message: 'boom' })
            : Promise.resolve({}),
    };
    Promise.all([
      collectAllTemplates(refusing, { decluttering_templates_from: 'lovelace', views: [] }),
      collectAllTemplates(refusing, { decluttering_templates_from: 'broken', views: [] }),
    ]).then(([fromDefault]) => {
      console.warn = original;
      check(
        'an original dashboard with nothing saved lends nothing - only the library is there',
        Object.keys(fromDefault).sort(),
        ['library_only', 'shared_badge'],
      );
      check(
        'and is not warned about, while a dashboard that failed to read still is',
        said.map((line) => line.replace(/:.*$/, '')),
        ['decluttering-card-plus'],
      );
      check('the one warned about is the broken one', /"broken"/.test(said[0] ?? ''), true);

      // Item templates and `with:`/`repeat:` in the health check (#227).
      {
        const { itemTemplatesOf, templatePickerOptions } = require('../.test-build/templates.js');
        const { structureNames } = require('../.test-build/structure.js');
        const ll = {
          decluttering_defaults: {
            lights: { domain: 'light' },
            row: { entity: '[[entity]]', name: '[[name]] [[area]]' },
          },
          decluttering_templates: {
            camera_entry: { item: { camera_entity: '[[camera_entity]]' } },
            rows: {
              card: {
                type: 'entities',
                entities: ['[[row|repeat:lights]]', '[[camera_entry|with:camera_entity=camera.x]]'],
              },
            },
            spare: { card: { type: 'markdown', content: 'x' } },
          },
          views: [{ cards: [{ type: 'custom:decluttering-card-plus', template: 'rows' }] }],
        };
        check('itemTemplatesOf finds the templates with an item: body', Object.keys(itemTemplatesOf(ll)), [
          'camera_entry',
        ]);
        // #233: an item template's extends: is folded in, list edits and all, and a child with
        // nothing but extends: is still an item template.
        const extended = itemTemplatesOf({
          decluttering_templates: {
            item_1: { item: { test: 'string1', entities: ['[[e1?]]', 'sun.sun'] } },
            item_2: { extends: 'item_1', item: { entities: { __append__: ['camera.a', 'camera.b'] } } },
            item_3: { extends: 'item_1' },
          },
        });
        check('an item template inherits its parent through extends:', extended.item_2, {
          item: { test: 'string1', entities: ['[[e1?]]', 'sun.sun', 'camera.a', 'camera.b'] },
        });
        check('an item template with only extends: is found', extended.item_3, {
          item: { test: 'string1', entities: ['[[e1?]]', 'sun.sun'] },
        });
        const health = checkDashboard(ll);
        check('names a repeat: or with: supplies are not called unset', health.unsetVariables, []);
        check(
          'an item template used through a placeholder is not unused; a card template nobody uses still is',
          health.unusedTemplates,
          ['spare'],
        );
        check(
          'the template picker does not offer an item template',
          templatePickerOptions(ll.decluttering_templates).map((o) => o.value),
          ['rows', 'spare'],
        );
        check(
          'structureNames reads pairs, a mapping variable and a registry source',
          structureNames({
            default: { lights: { domain: 'light' }, m: { a: 1, b: 2 } },
            card: { x: '[[r|with:p=1,q=2]]', y: '[[r|with:m]]', z: '[[r|repeat:lights]]' },
          }).sort(),
          [
            'a',
            'area',
            'area_id',
            'b',
            'count',
            'domain',
            'entity',
            'first',
            'index',
            'index0',
            'item',
            'last',
            'name',
            'p',
            'q',
            'total',
          ],
        );
      }

      report();
    });
  });
});
