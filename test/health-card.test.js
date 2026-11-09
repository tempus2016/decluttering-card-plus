/*
 * Unit tests for the checks behind the health card and badge (idea 50), in src/health-card-pure.ts.
 */
const { healthEntries, shownKinds, toLookAt, cardLabel } = require('../.test-build/health-card-pure.js');

const { check } = require('./check');

const templates = {
  room_light_tile: { variables: [{ name: 'entity', required: true }], card: { type: 'tile', entity: '[[entity]]' } },
  media_tile: { card: { type: 'tile', entity: '[[entity]]' } },
  camera_old: { deprecated: 'use camera_tile', card: { type: 'picture-entity', entity: '[[entity]]' } },
  camera_tile: { card: { type: 'picture-entity', entity: '[[entity]]' } },
};

const ll = {
  views: [
    {
      title: 'Home',
      type: 'sections',
      sections: [
        {
          cards: [
            { type: 'custom:decluttering-card-plus', template: 'room_ligth_tile', name: 'Hall lamp' },
            { type: 'custom:decluttering-card-plus', template: 'media_tile', name: 'Kitchen display' },
            { type: 'custom:decluttering-card-plus', template: 'room_light_tile', variables: [{ entity: 'light.a' }] },
          ],
        },
      ],
    },
    {
      title: 'Upstairs',
      cards: [
        { type: 'custom:decluttering-card-plus', template: 'camera_old', variables: [{ entity: 'camera.driveway' }] },
        {
          type: 'vertical-stack',
          cards: [
            { type: 'custom:decluttering-card-plus', template: 'camera_tile', variables: [{ entity: 'camera.x' }] },
          ],
        },
        {
          type: 'custom:decluttering-card-plus',
          template: 'room_light_tile',
          for_each_from: { entities: true, domain: 'light' },
        },
      ],
    },
  ],
};

const report = healthEntries(ll, templates, 'lovelace');

check('the counts: one missing, one unset, one deprecated, and the rest fine', report.counts, {
  missing: 1,
  unset: 1,
  deprecated: 1,
  fine: 3,
  cards: 6,
});
check(
  'each finding names the card, where it is, and the path the editor opens',
  report.entries.map((e) => [
    e.kind,
    e.label,
    e.view.title,
    e.path.join('/'),
    e.closest ?? e.names?.join(',') ?? e.message,
  ]),
  [
    ['missing', 'Hall lamp', 'Home', '0/0/0', 'room_light_tile'],
    ['unset', 'Kitchen display', 'Home', '0/0/1', 'entity'],
    ['deprecated', 'camera.driveway', 'Upstairs', '1/0', 'use camera_tile'],
  ],
);
check('a repeat over the registry supplies its names, so its copies are not called unset', report.counts.unset, 1);
check(
  'show: narrows what is listed but not what is counted',
  healthEntries(ll, templates, 'lovelace', ['missing']).entries.length,
  1,
);
check('the badge number is everything to look at', toLookAt(report.counts), 3);

// A card's `slots:` fill a template's `|slot` placeholders; they are variables by another
// name, as the editor's health panel and the lint already read them (idea 35).
const framed = {
  light_frame: {
    variables: [
      { name: 'body', required: true },
      { name: 'title', required: true },
    ],
    card: { type: 'vertical-stack', cards: [{ type: 'heading', heading: '[[title]]' }, '[[body|slot]]'] },
  },
};
const slotted = {
  views: [
    {
      title: 'Home',
      cards: [
        {
          type: 'custom:decluttering-card-plus',
          template: 'light_frame',
          variables: [{ title: 'Lamps' }],
          slots: { body: { type: 'tile', entity: 'light.a' } },
        },
        { type: 'custom:decluttering-card-plus', template: 'light_frame', variables: [{ title: 'Empty' }] },
      ],
    },
  ],
};
const slotReport = healthEntries(slotted, framed, 'lovelace');
check('a slot filled through slots: is not an unset variable', slotReport.counts, {
  missing: 0,
  unset: 1,
  deprecated: 0,
  fine: 1,
  cards: 2,
});
check(
  'only the card that fills no slot is listed, naming the slot',
  slotReport.entries.map((e) => [e.kind, e.label, e.names?.join(',')]),
  [['unset', 'Empty', 'body']],
);

check(
  'show reads a list or comma text, and falls back to everything',
  [shownKinds(['missing']), shownKinds('unset, deprecated'), shownKinds('nonsense'), shownKinds(undefined)],
  [['missing'], ['unset', 'deprecated'], ['missing', 'unset', 'deprecated'], ['missing', 'unset', 'deprecated']],
);

check(
  'a card is called by its name, else a value worth a name, else its template',
  [
    cardLabel({ template: 't', name: 'Hall' }),
    cardLabel({ template: 't', variables: [{ entity: 'light.a' }] }),
    cardLabel({ template: 't', variables: [{ area: 'Kitchen' }, { entity: 'light.a' }] }),
    cardLabel({ template: 't' }),
  ],
  ['Hall', 'light.a', 'Kitchen', 't'],
);

{
  const withBadges = {
    views: [
      {
        title: 'Badges',
        badges: [
          { type: 'custom:decluttering-card-plus', template: 'nope_badge' },
          { type: 'custom:decluttering-card-plus', template: 'media_tile', variables: [{ entity: 'light.a' }] },
        ],
        cards: [],
      },
    ],
  };
  const badgeReport = healthEntries(withBadges, templates, 'lovelace');
  check(
    "a view's badges count, as the panel lists them, and point at the view",
    [badgeReport.counts, badgeReport.entries.map((e) => [e.kind, e.template, e.path.join('/')])],
    [{ missing: 1, unset: 0, deprecated: 0, fine: 1, cards: 2 }, [['missing', 'nope_badge', '0']]],
  );
}
