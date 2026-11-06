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
