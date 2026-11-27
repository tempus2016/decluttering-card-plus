/*
 * Regression tests for the template editor review: the dashboard rewrites its tools make
 * (src/templates.ts). Run with `npm test`.
 */
const { replaceCard, replaceTemplate, collectTemplates } = require('../.test-build/templates.js');
const { makeTemplateFromSimilar } = require('../.test-build/similar.js');

const { check } = require('./check');

const TEMPLATE = 'custom:decluttering-template-plus';
const CARD = 'custom:decluttering-card-plus';

// --- replaceCard never reaches into a template's own body -------------------------------
const tile = { type: 'tile', entity: 'light.kitchen' };
const dash = {
  views: [
    { title: 'Templates', cards: [{ type: TEMPLATE, template: 'my', card: { ...tile } }] },
    { title: 'Home', cards: [{ ...tile }, { type: 'tile', entity: 'light.x' }] },
  ],
};
const swapped = replaceCard(dash, tile, { type: CARD, template: 'my' });
check('the template keeps its body when a card written the same is replaced', swapped.views[0].cards[0].card, tile);
check('the card on the view is the one replaced', swapped.views[1].cards[0], { type: CARD, template: 'my' });
check(
  'the legacy template card is skipped too',
  replaceCard(
    { views: [{ cards: [{ type: 'custom:decluttering-template', template: 'old', card: { ...tile } }, { ...tile }] }] },
    tile,
    { type: 'x' },
  ).views[0].cards,
  [{ type: 'custom:decluttering-template', template: 'old', card: tile }, { type: 'x' }],
);
check(
  'a card only a template holds is not found, so nothing changes',
  replaceCard({ views: [dash.views[0]] }, tile, { type: 'x' }),
  { views: [dash.views[0]] },
);

const lights = [
  { type: 'tile', entity: 'light.a', name: 'A' },
  { type: 'tile', entity: 'light.b', name: 'B' },
];
const similarDash = {
  views: [
    { cards: [{ type: TEMPLATE, template: 'held', card: { ...lights[0] } }, { ...lights[0] }, { ...lights[1] }] },
  ],
};
const made = makeTemplateFromSimilar(similarDash, lights, 'tile_card');
check('making a template of similar cards leaves another template alone', made.views[0].cards[0].card, lights[0]);
check(
  'and swaps both cards',
  made.views[0].cards.slice(1).map((card) => [card.type, card.template]),
  [
    [CARD, 'tile_card'],
    [CARD, 'tile_card'],
  ],
);

// --- replaceTemplate keeps what the card itself carries ---------------------------------
const placed = {
  views: [
    {
      cards: [
        {
          type: TEMPLATE,
          template: 'tile_light',
          view_layout: { position: 'sidebar' },
          card_mod: { style: 'ha-card { display: none }' },
          description: 'old',
          default: [{ colour: 'red' }],
          card: { type: 'tile', entity: '[[entity]]' },
        },
      ],
    },
  ],
};
const updated = replaceTemplate(placed, 'tile_light', { description: 'new', card: { type: 'button' } }).views[0]
  .cards[0];
check(
  'the keys other cards and Home Assistant put on a template card stay',
  [updated.view_layout, updated.card_mod],
  [{ position: 'sidebar' }, { style: 'ha-card { display: none }' }],
);
check(
  'the template itself is the new one, with nothing of the old left',
  [updated.description, updated.card, updated.default],
  ['new', { type: 'button' }, undefined],
);
check('type and name still lead', Object.keys(updated).slice(0, 2), ['type', 'template']);
check('the template resolves to the new body', collectTemplates({ views: [{ cards: [updated] }] }).tile_light.card, {
  type: 'button',
});
