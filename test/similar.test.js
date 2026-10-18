/*
 * Unit tests for src/similar.ts: finding cards that are copies of each other but for a few
 * values, and turning a set of them into one template. Run with `npm test`.
 */
const {
  MAX_DIFFERING,
  findSimilarCards,
  variableNamesFor,
  templateFromSimilar,
  similarReplacement,
  makeTemplateFromSimilar,
  suggestTemplateName,
} = require('../.test-build/similar.js');

const { check, report } = require('./harness');

const tile = (entity, name, extra = {}) => ({ type: 'tile', entity, name, ...extra });

/* -------------------------------------------------------------------- finding */

{
  const cards = [
    tile('light.kitchen', 'Kitchen'),
    { type: 'entity', entity: 'light.hall', name: 'Hall' },
    tile('light.lounge', 'Lounge'),
    tile('light.bed', 'Bed', { icon: 'mdi:bed' }),
    tile('light.study', 'Study'),
  ];
  const groups = findSimilarCards(cards);
  check(
    'cards of one type and one shape are a group',
    groups.map((group) => group.indices),
    [[0, 2, 4]],
  );
  check('it says where they differ', groups[0].differing, [['entity'], ['name']]);
  check('and what type they are', groups[0].type, 'tile');
}

check(
  'a different type with the same keys is a different group',
  findSimilarCards([tile('a.a', 'A'), { type: 'button', entity: 'a.b', name: 'B' }]),
  [],
);

check(
  'key order does not matter',
  findSimilarCards([tile('a.a', 'A'), { name: 'B', type: 'tile', entity: 'a.b' }]).map((group) => group.indices),
  [[0, 1]],
);

check(
  'list lengths are part of the shape',
  findSimilarCards([
    { type: 'entities', entities: ['a.a', 'a.b'] },
    { type: 'entities', entities: ['a.c'] },
  ]),
  [],
);

check(
  'list items are places they can differ',
  findSimilarCards([
    { type: 'entities', entities: ['a.a', 'a.b'] },
    { type: 'entities', entities: ['a.a', 'a.c'] },
  ])[0].differing,
  [['entities', 1]],
);

check('exact copies are not offered', findSimilarCards([tile('a.a', 'A'), tile('a.a', 'A')]), []);

check(
  'where a card sits is not part of what it is',
  findSimilarCards([
    tile('a.a', 'A', { grid_options: { columns: 6 } }),
    tile('a.b', 'B', { visibility: [{ condition: 'screen' }] }),
  ])[0].differing,
  [['entity'], ['name']],
);

{
  const a = { type: 'custom:x' };
  const b = { type: 'custom:x' };
  for (let i = 0; i < MAX_DIFFERING + 1; i += 1) {
    a[`k${i}`] = `a${i}`;
    b[`k${i}`] = `b${i}`;
  }
  check(`more than ${MAX_DIFFERING} differences is not really one card`, findSimilarCards([a, b]), []);
  const c = { ...a, k0: 'same' };
  const d = { ...b, k0: 'same' };
  check(
    `exactly ${MAX_DIFFERING} differences are offered`,
    findSimilarCards([c, d])[0].differing.length,
    MAX_DIFFERING,
  );
}

check(
  'a card already holding a placeholder is left out',
  findSimilarCards([tile('[[entity]]', 'A'), tile('a.b', 'B')]),
  [],
);

check('anything that is not a card is skipped', findSimilarCards([null, 'x', { name: 'no type' }, 3]), []);

check(
  'the biggest groups come first',
  findSimilarCards([
    { type: 'button', entity: 'a.a' },
    { type: 'button', entity: 'a.b' },
    tile('a.a', 'A'),
    tile('a.b', 'B'),
    tile('a.c', 'C'),
  ]).map((group) => group.indices),
  [
    [2, 3, 4],
    [0, 1],
  ],
);

check(
  'a group has a key that stays the same',
  findSimilarCards([tile('a', 'A'), tile('b', 'B')])[0].key,
  JSON.stringify(['tile', { entity: 0, name: 0, type: 0 }]),
);

/* -------------------------------------------------------------------- names */

check('a name from the key the value sits under', variableNamesFor([['entity'], ['name']]), ['entity', 'name']);
check(
  'two places with one key are named by their paths',
  variableNamesFor([['tap_action', 'navigation_path'], ['hold_action', 'navigation_path'], ['icon']]),
  ['tap_action_navigation_path', 'hold_action_navigation_path', 'icon'],
);
check('a list item is named by its list and place', variableNamesFor([['entities', 1]]), ['entities_2']);
check('a list item in a list of lists falls back on the nearest key', variableNamesFor([['rows', 0, 2]]), ['rows_3']);
check('a bare list item has a name too', variableNamesFor([[0]]), ['item_1']);
check(
  'a name that is still taken gets a number',
  variableNamesFor([
    ['a', 'b_c', 'k'],
    ['a_b', 'c', 'k'],
  ]),
  ['a_b_c_k', 'a_b_c_k_2'],
);
check('odd characters are tidied out of a name', variableNamesFor([['my key!']]), ['my_key']);
check('a key with nothing usable in it still gets a name', variableNamesFor([['!!']]), ['value']);

/* -------------------------------------------------------------------- the template */

{
  const cards = [
    tile('light.kitchen', 'Kitchen', { tap_action: { action: 'more-info' }, grid_options: { columns: 6 } }),
    tile('light.lounge', 'Lounge', { tap_action: { action: 'toggle' } }),
  ];
  const made = templateFromSimilar(cards);
  check('the first card is the template, with a placeholder where they differ', made.template, {
    card: { type: 'tile', entity: '[[entity]]', name: '[[name]]', tap_action: { action: '[[action]]' } },
  });
  check('the names it chose', made.names, ['entity', 'name', 'action']);
  check('each card passes its own values', made.variables, [
    [{ entity: 'light.kitchen' }, { name: 'Kitchen' }, { action: 'more-info' }],
    [{ entity: 'light.lounge' }, { name: 'Lounge' }, { action: 'toggle' }],
  ]);
  check('and keeps where it sits', made.layout, [{ grid_options: { columns: 6 } }, {}]);
  check('the cards handed in are not touched', cards[0].entity, 'light.kitchen');
}

check(
  'a value keeps its type, so a number stays a number',
  templateFromSimilar([
    { type: 'gauge', entity: 'a', max: 100 },
    { type: 'gauge', entity: 'a', max: 50 },
  ]).variables,
  [[{ max: 100 }], [{ max: 50 }]],
);

check('the stand-in card', similarReplacement('lights', [{ entity: 'a' }], { grid_options: { columns: 3 } }), {
  type: 'custom:decluttering-card-plus',
  template: 'lights',
  variables: [{ entity: 'a' }],
  grid_options: { columns: 3 },
});

check('no cards is an empty template', templateFromSimilar([]), {
  template: { card: {} },
  names: [],
  variables: [],
  layout: [],
});

/* -------------------------------------------------------------------- the dashboard */

{
  const a = tile('light.a', 'A', { grid_options: { columns: 6 } });
  const b = tile('light.b', 'B');
  const ll = {
    decluttering_templates: { existing: { card: {} } },
    views: [{ cards: [a, { type: 'markdown' }, { type: 'vertical-stack', cards: [b] }] }],
  };
  const out = makeTemplateFromSimilar(ll, [a, b], 'light_tile');
  check(
    'the template goes under decluttering_templates, beside what is there',
    Object.keys(out.decluttering_templates),
    ['existing', 'light_tile'],
  );
  check('every card is replaced where it was', out.views[0].cards, [
    {
      type: 'custom:decluttering-card-plus',
      template: 'light_tile',
      variables: [{ entity: 'light.a' }, { name: 'A' }],
      grid_options: { columns: 6 },
    },
    { type: 'markdown' },
    {
      type: 'vertical-stack',
      cards: [
        {
          type: 'custom:decluttering-card-plus',
          template: 'light_tile',
          variables: [{ entity: 'light.b' }, { name: 'B' }],
        },
      ],
    },
  ]);
  check('the dashboard handed in is not touched', ll.views[0].cards[0], a);
}

{
  const a = tile('light.a', 'A');
  const b = tile('light.b', 'B');
  const ll = { views: [{ cards: [a, a, b] }] };
  const out = makeTemplateFromSimilar(ll, [a, a, b], 'twins');
  check(
    'two identical copies in a set are each replaced',
    out.views[0].cards.map((card) => card.type),
    ['custom:decluttering-card-plus', 'custom:decluttering-card-plus', 'custom:decluttering-card-plus'],
  );
}

check(
  'a name offered from the card type',
  suggestTemplateName('custom:mushroom-light-card', []),
  'mushroom_light_card',
);
check('a bare type says it is a card, not the card itself', suggestTemplateName('tile', []), 'tile_card');
check(
  'and which kind, when every card shows an entity of one domain',
  suggestTemplateName('tile', [], [{ entity: 'light.a' }, { entity: 'light.b' }]),
  'light_tile_card',
);
check(
  'but not when they are of several',
  suggestTemplateName('tile', [], [{ entity: 'light.a' }, { entity: 'switch.b' }]),
  'tile_card',
);
check('nor when one has none', suggestTemplateName('tile', [], [{ entity: 'light.a' }, { name: 'x' }]), 'tile_card');
check(
  'and one that is free',
  suggestTemplateName('tile', ['light_tile_card', 'light_tile_card_2'], [{ entity: 'light.a' }]),
  'light_tile_card_3',
);

report();
