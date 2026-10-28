/*
 * Unit tests for src/search.ts: finding a value - an entity id, a name - wherever a card or
 * a template has it written, across dashboards. Run with `npm test`.
 */
const { searchValues } = require('../.test-build/search.js');

const { check } = require('./check');

const home = {
  decluttering_templates: {
    kitchen_tile: { card: { type: 'tile', entity: 'light.kitchen', name: '[[name]]' } },
  },
  views: [
    {
      title: 'Home',
      cards: [
        {
          type: 'custom:decluttering-card-plus',
          template: 'tile',
          variables: [{ entity: 'light.Kitchen' }, { room: { light: 'light.kitchen_strip', size: 3 } }],
        },
        {
          type: 'vertical-stack',
          cards: [
            {
              type: 'custom:decluttering-card',
              template: 'row',
              for_each: [{ entity: 'light.hall' }, { entity: 'light.kitchen_2' }],
              for_each_from: { entities: 'light.*', overrides: { 'light.kitchen_3': { name: 'Kitchen 3' } } },
              card: { tap_action: { entity: 'light.kitchen_4' } },
            },
          ],
        },
        {
          type: 'custom:decluttering-template-plus',
          template: 'on_view',
          card: { type: 'button', entity: 'switch.kitchen' },
        },
        { type: 'tile', entity: 'light.kitchen_plain' },
      ],
    },
  ],
};

const rooms = {
  views: [
    {
      path: 'rooms',
      sections: [
        {
          cards: [{ type: 'custom:decluttering-card-plus', template: 'tile', variables: { entity: 'light.kitchen' } }],
        },
      ],
    },
  ],
};

const found = searchValues(
  [
    { urlPath: 'lovelace', config: home },
    { urlPath: 'rooms', config: rooms },
  ],
  '  KITCHEN ',
);

const short = (match) =>
  `${match.urlPath}/${match.view.title}: ${match.template} ${match.where} ${match.variable}=${match.value}`;

check('every card passing the value, case aside, wherever it writes it', found.cards.map(short), [
  'lovelace/Home: tile variables entity=light.Kitchen',
  'lovelace/Home: tile variables room.light=light.kitchen_strip',
  'lovelace/Home: row for_each entity=light.kitchen_2',
  'lovelace/Home: row overrides light.kitchen_3=light.kitchen_3',
  'lovelace/Home: row overrides light.kitchen_3 › name=Kitchen 3',
  'lovelace/Home: row override_block card.tap_action.entity=light.kitchen_4',
  'rooms/rooms: tile variables entity=light.kitchen',
]);

check('and, apart, every template with it written in', found.templates, [
  { urlPath: 'lovelace', template: 'kitchen_tile', path: 'card.entity', value: 'light.kitchen' },
  { urlPath: 'lovelace', template: 'on_view', path: 'card.entity', value: 'switch.kitchen' },
]);

check('where the view sits comes with it', found.cards[6].view, { title: 'rooms', path: 'rooms', index: 0 });

check('an empty search finds nothing rather than everything', searchValues([{ urlPath: 'x', config: home }], '  '), {
  cards: [],
  templates: [],
});

check(
  'numbers are searched as their text',
  searchValues([{ urlPath: 'x', config: home }], '3').cards.map((match) => match.variable),
  ['room.size', 'light.kitchen_3', 'light.kitchen_3 › name'],
);

check('a dashboard with nothing on it is fine', searchValues([{ urlPath: 'x', config: null }], 'a'), {
  cards: [],
  templates: [],
});
