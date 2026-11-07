/*
 * Unit tests for src/page-template.ts (idea 33) and the dashboard strategy writing a page out.
 */
const {
  pageOf,
  isPageTemplate,
  buildPage,
  declutteringKeys,
  errorDashboard,
} = require('../.test-build/page-template.js');
const { generateDashboard } = require('../.test-build/strategy.js');

const { check } = require('./check');

const kiosk = {
  variables: [{ name: 'use_wallpanel', type: 'boolean' }, { name: 'room' }],
  dashboard: {
    wallpanel: { enabled: '[[use_wallpanel|bool]]', hide_toolbar: true },
    views: [
      {
        title: '[[room|title]]',
        path: '[[room|slug]]',
        cards: [{ type: 'custom:decluttering-card-plus', template: 'room_summary', variables: [{ area: '[[room]]' }] }],
      },
    ],
  },
};
const templates = { kiosk_page: kiosk, room_summary: { card: { type: 'tile' } } };
const strategy = {
  type: 'custom:decluttering-card-plus',
  decluttering_templates: templates,
  page: { template: 'kiosk_page', variables: [{ use_wallpanel: true }, { room: 'kitchen' }] },
};

check('the page a strategy asks for', pageOf(strategy), {
  template: 'kiosk_page',
  variables: [{ use_wallpanel: true }, { room: 'kitchen' }],
});
check('decluttering_page: is read the same way', pageOf({ decluttering_page: { template: 'x' } }), {
  template: 'x',
  variables: undefined,
});
check('no page, nothing', [pageOf({}), pageOf({ page: 'x' }), pageOf({ page: {} })], [undefined, undefined, undefined]);
check(
  'a page template is one with a dashboard: body',
  [isPageTemplate(kiosk), isPageTemplate({ card: {} })],
  [true, false],
);
check(
  'the decluttering keys a strategy carries',
  declutteringKeys({ type: 'x', decluttering_templates: {}, decluttering_defaults: [1], views: [] }),
  {
    decluttering_templates: {},
    decluttering_defaults: [1],
  },
);

const built = buildPage(strategy, templates);
check('the page builds the dashboard with the variables filled in, the templates kept, and no page key', built, {
  dashboard: {
    wallpanel: { enabled: true, hide_toolbar: true },
    views: [
      {
        title: 'Kitchen',
        path: 'kitchen',
        cards: [{ type: 'custom:decluttering-card-plus', template: 'room_summary', variables: [{ area: 'kitchen' }] }],
      },
    ],
    decluttering_templates: templates,
  },
});
check('a missing page template is an error', 'error' in buildPage({ page: { template: 'nope' } }, templates), true);
check(
  'a template of another kind is an error',
  'error' in buildPage({ page: { template: 'room_summary' } }, templates),
  true,
);
check(
  'a page beside views is refused',
  'error' in buildPage({ ...strategy, views: [{ title: 'x' }] }, templates),
  true,
);
check('the error dashboard is one markdown card', errorDashboard('oops').views[0].cards, [
  { type: 'markdown', content: 'oops' },
]);

/* ------------------------------------------------------ through the strategy */

const dashboard = generateDashboard(strategy, undefined, undefined, templates);
check(
  'the strategy writes the page out as the dashboard',
  [dashboard.wallpanel, dashboard.views.map((v) => v.title), dashboard.page],
  [{ enabled: true, hide_toolbar: true }, ['Kitchen'], undefined],
);
check(
  'a repeated view inside the page is written out too',
  generateDashboard(
    {
      type: 'custom:decluttering-card-plus',
      decluttering_templates: {
        rooms: { dashboard: { views: [{ for_each: [{ room: 'a' }, { room: 'b' }], view: { title: '[[room]]' } }] } },
      },
      page: { template: 'rooms' },
    },
    undefined,
    undefined,
    { rooms: { dashboard: { views: [{ for_each: [{ room: 'a' }, { room: 'b' }], view: { title: '[[room]]' } }] } } },
  ).views.map((v) => v.title),
  ['a', 'b'],
);
check(
  'a page that cannot be built becomes a dashboard that says so',
  generateDashboard({ type: 'custom:decluttering-card-plus', page: { template: 'nope' } }, undefined, undefined, {})
    .views[0].cards[0].type,
  'markdown',
);

/* ------------------------------------- a page's repeats, as ha-dev found them */

const { writeDashboard } = require('../.test-build/strategy.js');
const { withoutRepeatContent } = require('../.test-build/page-template.js');
const { checkExamples } = require('../.test-build/examples.js');
const { lintTemplate } = require('../.test-build/lint.js');
const { listPlaceholders } = require('../.test-build/placeholders.js');

const JINJA = "{{ ['light.hallway','light.living_room'] }}";
const jinjaPage = {
  dashboard: {
    views: [
      {
        for_each_from: { template: JINJA },
        view: {
          title: 'J [[entity]]',
          cards: [{ type: 'markdown', content: 'jinja [[entity]] [[index]] of [[count]]' }],
        },
      },
    ],
  },
};
const fetches = (templates, asked) => ({
  render: async (template) => {
    asked.push(`render ${template}`);
    return { result: ['light.hallway', 'light.living_room'] };
  },
  labels: async () => asked.push('labels'),
  categories: async () => asked.push('categories'),
  templates: async () => templates,
});

const lightsHass = {
  states: {
    'light.hallway': { entity_id: 'light.hallway', state: 'on', attributes: {} },
    'light.living_room': { entity_id: 'light.living_room', state: 'on', attributes: {} },
  },
  entities: {},
};

(async () => {
  const pageStrategy = (name, page) => ({
    type: 'custom:decluttering-card-plus',
    decluttering_templates: { [name]: page },
    page: { template: name },
  });

  let asked = [];
  const jinja = await writeDashboard(
    pageStrategy('kiosk_page', jinjaPage),
    lightsHass,
    fetches({ kiosk_page: jinjaPage }, asked),
  );
  check(
    'a page view repeating from Jinja builds a view per item',
    jinja.views.map((v) => v.title),
    ['J light.hallway', 'J light.living_room'],
  );
  check('its Jinja is rendered from the page the template builds', asked, [`render ${JINJA}`]);
  check('its cards are filled too', jinja.views[1].cards[0].content, 'jinja light.living_room 2 of 2');

  asked = [];
  const straight = await writeDashboard(
    { type: 'custom:decluttering-card-plus', views: jinjaPage.dashboard.views },
    lightsHass,
    fetches({}, asked),
  );
  check(
    'the same views written straight on the strategy build the same',
    straight.views.map((v) => v.title),
    ['J light.hallway', 'J light.living_room'],
  );

  const labelled = {
    dashboard: {
      views: [
        { for_each_from: { labels: true }, view: { title: '[[name]]' } },
        { for_each_from: { entities: 'automation.*', category: 'Lighting' }, view: { title: '[[entity]]' } },
      ],
    },
  };
  asked = [];
  await writeDashboard(pageStrategy('labelled', labelled), undefined, fetches({ labelled }, asked));
  check('labels and categories repeats inside a page are fetched for first', asked, ['labels', 'categories']);

  asked = [];
  const missing = await writeDashboard(
    { type: 'custom:decluttering-card-plus', page: { template: 'nope' } },
    undefined,
    fetches({}, asked),
  );
  check(
    'a page that cannot be built fetches nothing more and says so',
    [asked, missing.views[0].cards[0].type],
    [[], 'markdown'],
  );

  /* ------------------------------------------- the page build is quiet about repeats */

  const said = [];
  const realWarn = console.warn;
  console.warn = (message) => said.push(String(message));
  const quietPage = {
    dashboard: {
      wallpanel: { enabled: '[[use_wallpanel|bool]]' },
      views: [
        {
          for_each: ['light.a', 'light.b'],
          view: { title: '[[entity]] [[index]]/[[count]] [[first]] [[last]]' },
        },
        { title: '[[room_quiet_test]]' },
      ],
      decluttering_templates: { inner: { card: { type: 'tile', entity: '[[entity]]' } } },
    },
  };
  const quietBuilt = buildPage(
    { page: { template: 'quiet_page', variables: [{ use_wallpanel: true }] } },
    { quiet_page: quietPage },
  );
  console.warn = realWarn;
  check(
    'the page build says nothing about what its repeats fill in',
    said.some((m) => /\[\[(entity|index|count|first|last)\]\]/.test(m)),
    false,
  );
  check(
    'but still says what the page itself leaves unset',
    said.filter((m) => m.includes('[[room_quiet_test]]')).length,
    1,
  );
  check(
    'a repeat is left for the writing-out, and the page fills the rest',
    [quietBuilt.dashboard.wallpanel, quietBuilt.dashboard.views[0].view.title],
    [{ enabled: true }, '[[entity]] [[index]]/[[count]] [[first]] [[last]]'],
  );
  check(
    'the template keys inside a page are kept as written',
    quietBuilt.dashboard.decluttering_templates,
    quietPage.dashboard.decluttering_templates,
  );
  check(
    'a repeat is cut down to what it repeats over',
    withoutRepeatContent({
      views: [{ for_each_from: { area: '[[a]]' }, view: { title: '[[b]]' }, variables: [] }, { title: 'x' }],
    }),
    { views: [{ for_each_from: { area: '[[a]]' } }, { title: 'x' }] },
  );

  /* -------------------------------------- the places that know a dashboard: key */

  const examplePage = {
    variables: [{ name: 'room' }],
    examples: [{ room: 'kitchen' }, {}],
    dashboard: {
      views: [{ title: '[[room]]' }, { for_each: ['light.a'], view: { title: '[[entity]] [[index]]' } }],
    },
  };
  const failedExamples = checkExamples({ example_page: examplePage });
  check(
    "a page template's example builds cleanly, and one leaving its own variable unset does not",
    failedExamples.map((f) => [f.template, f.example, f.problems.length]),
    [['example_page', 2, 1]],
  );
  check(
    "the unset one is the page's own, not the repeat's",
    [/\[\[room\]\]/.test(failedExamples[0].problems[0]), /entity|index/.test(failedExamples[0].problems[0])],
    [true, false],
  );

  const lintPage = {
    dashboard: {
      views: [
        { title: '[[undeclared_room]]' },
        {
          for_each: ['light.a'],
          view: { title: '[[entity]] [[item_name|uper]]', cards: [{ type: 'x', name: '[[open' }] },
        },
      ],
      decluttering_templates: { inner: { card: { name: '[[only_inner]]' } } },
    },
  };
  const findings = lintTemplate(lintPage).map((f) => `${f.key} ${JSON.stringify(f.params)} @${f.path}`);
  check(
    "the linter reads a page: the page's own names, and mistakes inside its repeats",
    [
      findings.some((f) => f.startsWith('lint.undeclared') && f.includes('undeclared_room')),
      findings.some(
        (f) =>
          f.startsWith('lint.undeclared') &&
          (f.includes('entity') || f.includes('item_name') || f.includes('only_inner')),
      ),
      findings.some((f) => f.startsWith('lint.unknown_step')),
      findings.some((f) => f.startsWith('lint.unclosed')),
    ],
    [true, false, true, true],
  );
  check('the placeholders a page template writes', listPlaceholders(examplePage), [
    '[[room]]',
    '[[entity]]',
    '[[index]]',
  ]);
})();

{
  const { withoutRepeatContent: cut } = require('../.test-build/page-body.js');
  check(
    'a decluttering strategy inside a page keeps only what it is handed: its own variables fill the rest',
    cut({
      strategy: {
        type: 'custom:decluttering-card-plus',
        variables: [{ area: '[[room]]-written' }],
        section: { cards: [{ type: 'heading', heading: 'H [[area]]' }] },
      },
    }),
    { strategy: { type: 'custom:decluttering-card-plus', variables: [{ area: '[[room]]-written' }] } },
  );
}
