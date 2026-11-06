/*
 * Unit tests for src/error-card.ts (idea 49): what the error card knows beyond the message.
 */
const {
  missingTemplateDetail,
  customMissingDetail,
  unsetDetail,
  withTemplate,
  findCardPath,
  templateEditPath,
} = require('../.test-build/error-card.js');

const { check } = require('./check');

const ll = {
  decluttering_templates: { room_light_tile: { card: { type: 'tile' } } },
  views: [
    {
      title: 'Home',
      cards: [
        { type: 'custom:decluttering-card-plus', template: 'room_light_tile', variables: [{ entity: 'light.a' }] },
        { type: 'custom:decluttering-card-plus', template: 'room_ligth_tile' },
        { type: 'custom:decluttering-template-plus', template: 'sensor_line', row: { entity: '[[e]]' } },
      ],
    },
    {
      title: 'Rooms',
      type: 'sections',
      sections: [
        { cards: [{ type: 'markdown', content: 'x' }] },
        {
          cards: [
            { type: 'custom:decluttering-card-plus', template: 'room_light_tile', variables: [{ entity: 'light.b' }] },
            { type: 'custom:decluttering-template-plus', template: 'status_badge', badge: { type: 'entity' } },
          ],
        },
      ],
    },
  ],
};

check(
  'a misspelt template names the nearest one and how many cards use it',
  missingTemplateDetail(ll, 'room_ligth_tile', ['room_light_tile', 'sensor_line'], 'not found'),
  {
    kind: 'missing_template',
    template: 'room_ligth_tile',
    line: { key: 'template', value: 'room_ligth_tile', note: 'not found' },
    closest: { name: 'room_light_tile', uses: 2 },
  },
);
check(
  'with nothing close, there is no suggestion',
  missingTemplateDetail(ll, 'zzz', ['room_light_tile'], 'not found').closest,
  undefined,
);
check(
  'a missing custom element names the first type on the line',
  customMissingDetail('t', ['custom:a', 'custom:b'], 'not registered'),
  {
    kind: 'custom_missing',
    template: 't',
    missingTypes: ['custom:a', 'custom:b'],
    line: { key: 'type', value: 'custom:a', note: 'not registered' },
  },
);
check('an unset variable is the line', unsetDetail('sensor_line', ['entity'], 'required by the template'), {
  kind: 'unset',
  template: 'sensor_line',
  unset: ['entity'],
  line: { key: 'entity', value: '', note: 'required by the template' },
});
check('withTemplate changes the one key', withTemplate({ type: 'x', template: 'a', variables: [1] }, 'b'), {
  type: 'x',
  template: 'b',
  variables: [1],
});

check('a masonry card is [view, card]', findCardPath(ll, ll.views[0].cards[1]), [0, 1]);
check('a sections card is [view, section, card]', findCardPath(ll, ll.views[1].sections[1].cards[0]), [1, 1, 0]);
check('a card written differently is not found', findCardPath(ll, { type: 'markdown', content: 'y' }), undefined);

check('the template card in a masonry view', templateEditPath(ll, 'sensor_line'), [0, 2]);
check('the template card in a section', templateEditPath(ll, 'status_badge'), [1, 1, 1]);
check('a root-declared template has no card to open', templateEditPath(ll, 'room_light_tile'), undefined);
