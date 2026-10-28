/*
 * Unit tests for src/strategy.ts - the view strategy that writes out a section or a badge
 * per item. Run with `npm test`.
 */
const {
  generateView,
  expandEntry,
  isRepeatEntry,
  wantsLabels,
  findRepeatingCard,
  sectionPerCopy,
  slugPath,
  uniquePath,
  expandView,
  generateDashboard,
  dashboardWantsLabels,
} = require('../.test-build/strategy.js');

const { check } = require('./check');

const hass = {
  floors: { ground: { floor_id: 'ground', name: 'Ground floor' } },
  areas: {
    kitchen: { area_id: 'kitchen', name: 'Kitchen', floor_id: 'ground', labels: [] },
    bedroom: { area_id: 'bedroom', name: 'Bedroom', floor_id: 'ground', labels: [] },
  },
  devices: {},
  entities: {
    'person.anna': { entity_id: 'person.anna', labels: [] },
    'person.ben': { entity_id: 'person.ben', labels: [] },
  },
  states: {
    'person.anna': { attributes: { friendly_name: 'Anna' } },
    'person.ben': { attributes: { friendly_name: 'Ben' } },
  },
};

// Console output from substitution is noise here.
console.warn = () => {};

/* ------------------------------------------------------------- what repeats */

check('an entry with for_each repeats', isRepeatEntry({ for_each: [], section: {} }), true);

check('an entry with for_each_from repeats', isRepeatEntry({ for_each_from: { areas: true } }), true);

check('an ordinary section does not', isRepeatEntry({ type: 'grid', cards: [] }), false);

check('a non-repeat entry passes through untouched', expandEntry({ type: 'grid', cards: [1] }, 'section'), [
  { type: 'grid', cards: [1] },
]);

/* ------------------------------------------------------------- sections */

check(
  'a written-out list gives one section per item, placeholders filled',
  expandEntry(
    {
      for_each: [{ room: 'Kitchen' }, { room: 'Hall' }],
      section: { type: 'grid', title: '[[room]] [[index]]/[[count]]' },
    },
    'section',
  ),
  [
    { type: 'grid', title: 'Kitchen 1/2' },
    { type: 'grid', title: 'Hall 2/2' },
  ],
);

check(
  'a registry source gives one section per area, in name order, area named',
  expandEntry({ for_each_from: { areas: true }, section: { type: 'grid', heading: '[[area]]' } }, 'section', [], hass),
  [
    { type: 'grid', heading: 'Bedroom' },
    { type: 'grid', heading: 'Kitchen' },
  ],
);

check(
  'a templated card in a copy is handed the copy values, after its own',
  expandEntry(
    {
      for_each: [{ area: 'kitchen' }],
      section: {
        type: 'grid',
        cards: [{ type: 'custom:decluttering-card-plus', template: 'room', variables: [{ colour: 'red' }] }],
      },
    },
    'section',
  )[0].cards[0].variables,
  [{ colour: 'red' }, { area: 'kitchen' }, { index: 1 }, { index0: 0 }, { count: 1 }, { first: true }, { last: true }],
);

check(
  'a template card definition inside a copy is left alone',
  expandEntry(
    {
      for_each: [{ area: 'kitchen' }],
      section: { cards: [{ type: 'custom:decluttering-template-plus', template: 't', card: { x: 1 } }] },
    },
    'section',
  )[0].cards[0],
  { type: 'custom:decluttering-template-plus', template: 't', card: { x: 1 } },
);

check(
  'the entry and the strategy both give values, the entry first',
  expandEntry({ for_each: [{}], variables: [{ size: 'big' }], section: { t: '[[size]] [[theme]]' } }, 'section', [
    { size: 'small' },
    { theme: 'dark' },
  ]),
  [{ t: 'big dark' }],
);

check('a repeat over nothing gives no sections', expandEntry({ for_each: [], section: { t: 1 } }, 'section'), []);

check(
  'a repeat over nothing gives its empty: instead',
  expandEntry({ for_each: [], section: { t: 1 }, empty: { type: 'grid', cards: [] } }, 'section'),
  [{ type: 'grid', cards: [] }],
);

check('a repeat with no section to repeat gives nothing', expandEntry({ for_each: [{ a: 1 }] }, 'section'), []);

/* ------------------------------------------------------------- badges */

check(
  'badges repeat the same way',
  expandEntry(
    { for_each_from: { entities: 'person.*' }, badge: { type: 'entity', entity: '[[entity]]' } },
    'badge',
    [],
    hass,
  ),
  [
    { type: 'entity', entity: 'person.anna' },
    { type: 'entity', entity: 'person.ben' },
  ],
);

check(
  'a templated badge is handed the copy values',
  expandEntry(
    { for_each: [{ who: 'person.anna' }], badge: { type: 'custom:decluttering-card-plus', template: 'person_badge' } },
    'badge',
  )[0].variables[0],
  { who: 'person.anna' },
);

/* ------------------------------------------------------------- the view */

const view = generateView(
  {
    type: 'custom:decluttering-card-plus',
    max_columns: 3,
    variables: [{ theme: 'dark' }],
    badges: [
      { type: 'entity', entity: 'sun.sun' },
      { for_each: [{ e: 'a' }, { e: 'b' }], badge: { entity: '[[e]]' } },
    ],
    sections: [
      { type: 'grid', cards: [] },
      { for_each: [{ r: 'x' }], section: { type: 'grid', title: '[[r]] [[theme]]' } },
    ],
  },
  hass,
);

check('the view keeps everything that is not the strategy own', view.max_columns, 3);

check('the strategy keys do not leak into the view', [view.variables, view.strategy], [undefined, undefined]);

check('asking for sections gives a sections view', view.type, 'sections');

check('fixed and repeated sections sit in order', view.sections, [
  { type: 'grid', cards: [] },
  { type: 'grid', title: 'x dark' },
]);

check('fixed and repeated badges sit in order', view.badges, [
  { type: 'entity', entity: 'sun.sun' },
  { entity: 'a' },
  { entity: 'b' },
]);

check('a view type that is asked for is kept', generateView({ view_type: 1, sections: [] }).type, 'sections');

check('no sections asked for, no view type imposed', generateView({ badges: [] }).type, undefined);

check(
  'labels are wanted when a repeat names them',
  wantsLabels({ sections: [{ for_each_from: { labels: true } }] }),
  true,
);

check('and not otherwise', wantsLabels({ sections: [{ for_each_from: { areas: true } }] }), false);

/* ------------------------------------------------------------- one section per copy */

const repeating = {
  type: 'custom:decluttering-card-plus',
  template: 'room',
  for_each_from: { areas: true },
  columns: 2,
  empty: { type: 'markdown', content: 'none' },
  variables: [{ shade: 'dark' }],
};
const dashboard = {
  decluttering_templates: { room: { card: {} } },
  views: [
    { title: 'Masonry', cards: [repeating] },
    {
      title: 'Rooms',
      path: 'rooms',
      badges: [{ entity: 'sun.sun' }],
      sections: [
        { type: 'grid', cards: [{ type: 'heading', heading: 'Top' }] },
        { type: 'grid', background: true, cards: [{ type: 'heading', heading: 'Rooms' }, repeating] },
      ],
    },
  ],
};

check('a repeating card in a section is found', findRepeatingCard(dashboard, repeating), {
  view: 1,
  section: 1,
  card: 1,
});

check(
  'a card that does not repeat is not offered',
  findRepeatingCard(dashboard, { type: 'heading', heading: 'Top' }),
  undefined,
);

check(
  'a card in a masonry view is not offered',
  findRepeatingCard({ views: [dashboard.views[0]] }, repeating),
  undefined,
);

const converted = sectionPerCopy(dashboard, repeating);

check('the view keeps its own settings', [converted.views[1].title, converted.views[1].path], ['Rooms', 'rooms']);

check('the view is handed to the strategy', converted.views[1].strategy.type, 'custom:decluttering-card-plus');

check(
  'its sections and badges move into the strategy',
  [converted.views[1].sections, converted.views[1].badges],
  [undefined, undefined],
);

check('the badges go along unchanged', converted.views[1].strategy.badges, [{ entity: 'sun.sun' }]);

check(
  'the strategy has the sections in order, the rest of the section kept ahead of the repeat',
  converted.views[1].strategy.sections,
  [
    { type: 'grid', cards: [{ type: 'heading', heading: 'Top' }] },
    { type: 'grid', background: true, cards: [{ type: 'heading', heading: 'Rooms' }] },
    {
      for_each_from: { areas: true },
      section: {
        type: 'grid',
        background: true,
        cards: [{ type: 'custom:decluttering-card-plus', template: 'room', variables: [{ shade: 'dark' }] }],
      },
      empty: { type: 'grid', background: true, cards: [{ type: 'markdown', content: 'none' }] },
    },
  ],
);

check('other views are untouched', converted.views[0], dashboard.views[0]);

check('the original is not mutated', dashboard.views[1].sections[1].cards.length, 2);

check(
  'a section holding only the card becomes only the repeat',
  sectionPerCopy(
    { views: [{ sections: [{ type: 'grid', cards: [{ ...repeating, empty: undefined }] }] }] },
    {
      ...repeating,
      empty: undefined,
    },
  ).views[0].strategy.sections.length,
  1,
);

check('a card that is not there leaves the dashboard as it was', sectionPerCopy(dashboard, { type: 'x' }), dashboard);

check(
  'what the conversion writes generates the same sections the card would have repeated over',
  generateView(converted.views[1].strategy, hass).sections.map((each) => each.cards[0].variables?.[1]),
  [undefined, undefined, { area_id: 'bedroom' }, { area_id: 'kitchen' }],
);

check(
  'a views repeat reads the dashboard it is handed',
  generateView(
    {
      badges: [
        { for_each_from: { views: true }, badge: { type: 'entity', name: '[[name]]', tap: '[[navigation_path]]' } },
      ],
    },
    hass,
    { views: [{ title: 'Home', path: 'home' }], dashboard: 'lovelace' },
  ).badges,
  [{ type: 'entity', name: 'Home', tap: '/lovelace/home' }],
);

/* ------------------------------------------------------------- the dashboard strategy */

check('a path is made fit for an address', slugPath('Living Room / Upstairs'), 'living-room-upstairs');

check('an area id is already fit and stays as it is', slugPath('living_room'), 'living_room');

check('a path of digits gets a word in front, or it reads as a position', slugPath(12), 'view-12');

check('a path with nothing usable in it is no path', [slugPath('***'), slugPath(undefined)], [undefined, undefined]);

{
  const taken = new Set(['kitchen']);
  check(
    'a taken path gets the first free number',
    [uniquePath('kitchen', taken), uniquePath('kitchen', taken)],
    ['kitchen-2', 'kitchen-3'],
  );
}

check('an ordinary view passes through untouched', expandView({ title: 'Home', cards: [{ type: 'x' }] }), [
  { title: 'Home', cards: [{ type: 'x' }] },
]);

check(
  'a repeated view is written out per area, placeholders filled',
  expandView(
    { for_each_from: { areas: true }, view: { title: '[[area]]', path: '[[area_id]]', icon: 'mdi:sofa' } },
    [],
    hass,
  ),
  [
    { title: 'Bedroom', path: 'bedroom', icon: 'mdi:sofa' },
    { title: 'Kitchen', path: 'kitchen', icon: 'mdi:sofa' },
  ],
);

check(
  'a templated card in a repeated view is handed the view values',
  expandView(
    {
      for_each: [{ room: 'hall' }],
      view: { sections: [{ cards: [{ type: 'custom:decluttering-card-plus', template: 'room' }] }] },
    },
    [],
  )[0].sections[0].cards[0].variables[0],
  { room: 'hall' },
);

check(
  'a repeat over nothing gives its empty: view',
  expandView({ for_each: [], view: { title: 'x' }, empty: { title: 'Nothing yet' } }),
  [{ title: 'Nothing yet' }],
);

check('a repeat with no view to repeat gives nothing', expandView({ for_each: [{ a: 1 }] }), []);

{
  const nested = expandView(
    {
      for_each: [{ area_id: 'kitchen', name: 'Kitchen' }],
      view: {
        title: '[[name]]',
        strategy: {
          type: 'custom:decluttering-card-plus',
          sections: [
            {
              for_each_from: { entities: 'light.*', area: '[[area_id]]' },
              section: { type: 'grid', title: '[[name]]' },
            },
          ],
        },
      },
    },
    [],
  )[0];

  check('a nested view strategy has what it repeats over filled in', nested.strategy.sections[0].for_each_from, {
    entities: 'light.*',
    area: 'kitchen',
  });

  check('but not what it repeats, which belongs to its own items', nested.strategy.sections[0].section, {
    type: 'grid',
    title: '[[name]]',
  });

  check(
    'the view values reach it as shared values, without the outer position',
    nested.strategy.variables.map((entry) => Object.keys(entry)[0]),
    ['area_id', 'name'],
  );

  check('and the view itself is filled in', nested.title, 'Kitchen');
}

check(
  'somebody else strategy in a repeated view is filled in like the rest',
  expandView({ for_each: [{ a: 'x' }], view: { strategy: { type: 'custom:other', area: '[[a]]' } } })[0].strategy,
  { type: 'custom:other', area: 'x' },
);

{
  const generated = generateDashboard(
    {
      type: 'custom:decluttering-card-plus',
      variables: [{ theme: 'dark' }],
      decluttering_templates: { room: { card: { type: 'markdown' } } },
      decluttering_defaults: [{ size: 1 }],
      decluttering_variables: [{ name: 'size' }],
      decluttering_templates_from: ['other'],
      title: 'House',
      views: [
        { title: 'Home', path: 'bedroom' },
        { for_each_from: { areas: true }, view: { title: '[[area]] [[theme]]', path: '[[area]]' } },
        { for_each: [{ n: 'Kitchen' }, { n: 'Kitchen' }], view: { title: '[[n]]', path: '[[n]]' } },
        { for_each: [{ n: '***' }], view: { title: 'no path', path: '[[n]]' } },
        { strategy: { type: 'custom:decluttering-card-plus', sections: [] } },
      ],
    },
    hass,
  );

  check(
    'the template keys go to the dashboard root, where the cards look for them',
    [
      generated.decluttering_templates,
      generated.decluttering_defaults,
      generated.decluttering_variables,
      generated.decluttering_templates_from,
      generated.title,
    ],
    [{ room: { card: { type: 'markdown' } } }, [{ size: 1 }], [{ name: 'size' }], ['other'], 'House'],
  );

  check(
    'the strategy own keys do not leak into the dashboard',
    [generated.type, generated.variables],
    [undefined, undefined],
  );

  check(
    'views come out in order, every path unique, a written path kept as written',
    generated.views.map((view) => view.path),
    ['bedroom', 'bedroom-2', 'kitchen', 'kitchen-2', 'kitchen-3', undefined, undefined],
  );

  check('the strategy values reach every repeat', generated.views[1].title, 'Bedroom dark');

  check('a path that slugs to nothing is left out, so the view goes by position', 'path' in generated.views[5], false);

  check(
    'a view with its own view strategy passes through for Home Assistant to run, with the values',
    generated.views[6],
    {
      strategy: { type: 'custom:decluttering-card-plus', sections: [], variables: [{ theme: 'dark' }] },
    },
  );
}

{
  // #226: the strategy's values reach the dashboard's own settings and the plain views too.
  const generated = generateDashboard(
    {
      type: 'custom:decluttering-card-plus',
      variables: [{ use_wallpanel: false }, { room: 'Hall' }],
      wallpanel: { enabled: '[[use_wallpanel]]', hide_toolbar: true },
      decluttering_templates: { t: { card: { type: 'markdown', content: '[[room]]' } } },
      views: [
        {
          title: '[[room]]',
          path: '[[room]]',
          cards: [
            { type: 'markdown', content: '[[room]] [[not_set]]' },
            { type: 'custom:button-card', name: '[[[ return 1 ]]]' },
            { type: 'custom:decluttering-card-plus', template: 't', variables: [{ name: '[[room]]' }] },
          ],
        },
        { strategy: { type: 'custom:other', area: '[[room]]' } },
      ],
    },
    hass,
  );

  check('a dashboard setting is filled in, keeping its type', generated.wallpanel, {
    enabled: false,
    hide_toolbar: true,
  });

  check('the templates are left for the cards to fill', generated.decluttering_templates.t.card.content, '[[room]]');

  check(
    'a plain view is filled in, and what nothing sets stays as written',
    [generated.views[0].title, generated.views[0].path, generated.views[0].cards[0].content],
    ['Hall', 'Hall', 'Hall [[not_set]]'],
  );

  check('button-card JavaScript is left alone', generated.views[0].cards[1].name, '[[[ return 1 ]]]');

  check('a card using a template gets the value in its variables', generated.views[0].cards[2].variables, [
    { name: 'Hall' },
  ]);

  check('somebody else strategy in a plain view is filled in', generated.views[1].strategy, {
    type: 'custom:other',
    area: 'Hall',
  });
}

{
  const config = { title: '[[x]]', views: [{ title: '[[x]]' }] };
  check(
    'with no values set, nothing changes',
    [generateDashboard(config).title, generateDashboard(config).views],
    ['[[x]]', [{ title: '[[x]]' }]],
  );
}

check('a dashboard with no views asked for has none', generateDashboard({ type: 'x' }).views, []);

check(
  'labels are wanted when a repeated view names them',
  dashboardWantsLabels({ views: [{ for_each_from: { labels: true } }] }),
  true,
);

check('and not otherwise', dashboardWantsLabels({ views: [{ title: 'x' }] }), false);

check(
  'a dashboard repeat reads a rendered Jinja list like a section repeat does',
  generateDashboard(
    { views: [{ for_each_from: { template: '{{ x }}' }, view: { title: '[[item]]', path: '[[item]]' } }] },
    { states: {}, entities: {} },
    { rendered: { '{{ x }}': { result: ['Upstairs', 'Downstairs'] } } },
  ).views,
  [
    { title: 'Upstairs', path: 'upstairs' },
    { title: 'Downstairs', path: 'downstairs' },
  ],
);
