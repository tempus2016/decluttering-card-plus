/*
 * Unit tests for src/builder.ts: the docs site's template builder, which reads pasted
 * cards and makes the templates they are copies of. Run with `npm test`.
 */
const { buildTemplates, collectCards } = require('../.test-build/builder.js');

const deepReplace = require('../.test-build/deep-replace.js').default;
const { load } = require('js-yaml');

const { check, report } = require('./harness');

/*
 * The proof that matters: each card the builder writes, run through the card's own
 * substitution, draws exactly the card that was pasted - layout keys aside, which stay on
 * the decluttering card.
 */
function rebuilds(pasted) {
  const originals = load(pasted);
  const built = buildTemplates(pasted).templates;
  return (
    built.length > 0 &&
    built.every((made) => {
      const template = load(made.templateYaml).decluttering_templates[made.name].card;
      return load(made.cardsYaml).every((card, at) => {
        const original = originals.find((each) => made.labels[at].includes(each.name ?? each.entity));
        const body = { ...original };
        delete body.grid_options;
        return JSON.stringify(deepReplace(card.variables, {}, template)) === JSON.stringify(body);
      });
    })
  );
}

/* ------------------------------------------------------------------ reading */

check(
  'a list of cards is read as the cards',
  collectCards([{ type: 'tile' }, { type: 'entity' }]).map((card) => card.type),
  ['tile', 'entity'],
);

check(
  'a whole dashboard is followed into views and sections',
  collectCards({
    views: [
      { title: 'One', cards: [{ type: 'tile', entity: 'light.a' }] },
      { type: 'sections', sections: [{ type: 'grid', cards: [{ type: 'tile', entity: 'light.b' }] }] },
    ],
  }).map((card) => card.entity),
  ['light.a', 'light.b'],
);

check(
  'stacks and conditional cards are followed into, and kept themselves',
  collectCards([
    { type: 'vertical-stack', cards: [{ type: 'tile' }] },
    { type: 'conditional', card: { type: 'entity' } },
  ]).map((card) => card.type),
  ['vertical-stack', 'tile', 'conditional', 'entity'],
);

check(
  'a grid card is a card, but a grid section in a sections view is not',
  collectCards([{ type: 'grid', cards: [{ type: 'tile' }] }]).map((card) => card.type),
  ['grid', 'tile'],
);

check(
  "a tile's features are not cards",
  collectCards([{ type: 'tile', features: [{ type: 'light-brightness' }] }]).map((card) => card.type),
  ['tile'],
);

check('several documents are read as one paste', buildTemplates('- type: tile\n---\n- type: entity\n').found, 2);

{
  const result = buildTemplates('- type: tile\n  entity: [light.a\n');
  check('YAML that does not read says so', typeof result.error, 'string');
  check('and builds nothing', result.templates, []);
}

check('an alias bomb is refused', typeof buildTemplates(bomb()).error, 'string');

function bomb() {
  const lines = ['a0: &a0 [x, x, x, x, x, x, x, x, x, x]'];
  for (let i = 1; i < 60; i += 1) lines.push(`a${i}: &a${i} [*a${i - 1}, *a${i - 1}]`);
  return lines.join('\n');
}

/* ----------------------------------------------------------------- building */

const tiles = `
- type: tile
  entity: light.kitchen
  name: Kitchen
  grid_options:
    columns: 6
- type: tile
  entity: light.lounge
  name: Lounge
- type: tile
  entity: light.study
  name: Study
`;

{
  const { templates, leftOut, found } = buildTemplates(tiles);
  check('three copies make one template', templates.length, 1);
  check('nothing is left over', leftOut, []);
  check('every card was counted', found, 3);
  const [made] = templates;
  check('it is named for what the cards show', made.name, 'light_tile_card');
  check('the differences are its variables', made.variables, ['entity', 'name']);
  check('it says which cards it came from', made.labels, ['tile "Kitchen"', 'tile "Lounge"', 'tile "Study"']);
  check(
    'the template is written under decluttering_templates, with examples',
    made.templateYaml,
    [
      'decluttering_templates:',
      '  light_tile_card:',
      '    card:',
      '      type: tile',
      '      entity: "[[entity]]"',
      '      name: "[[name]]"',
      '    examples:',
      '      - entity: light.kitchen',
      '        name: Kitchen',
      '      - entity: light.lounge',
      '        name: Lounge',
      '      - entity: light.study',
      '        name: Study',
    ].join('\n'),
  );
  check('each card becomes a decluttering card, keeping where it sits', made.cardsYaml.split('\n').slice(0, 9), [
    '- type: custom:decluttering-card-plus',
    '  template: light_tile_card',
    '  variables:',
    '    - entity: light.kitchen',
    '    - name: Kitchen',
    '  grid_options:',
    '    columns: 6',
    '- type: custom:decluttering-card-plus',
    '  template: light_tile_card',
  ]);
}

{
  const many = Array.from({ length: 5 }, (_, i) => `- type: tile\n  entity: light.l${i}\n`).join('');
  const made = buildTemplates(many).templates[0];
  check('no more than three examples go into the template', (made.templateYaml.match(/- entity:/g) || []).length, 3);
}

{
  const both = `${tiles}
- type: entity
  entity: sensor.a
- type: entity
  entity: sensor.b
`;
  const { templates } = buildTemplates(both);
  check(
    'two sets make two templates, the bigger first',
    templates.map((made) => made.name),
    ['light_tile_card', 'sensor_entity_card'],
  );
}

{
  const { templates, leftOut } = buildTemplates(`
- type: tile
  entity: light.kitchen
  name: Kitchen
- type: tile
  entity: light.lounge
  name: Lounge
  icon: mdi:sofa
  tap_action:
    action: toggle
`);
  check('a setting only some cards have does not stop them sharing a template', templates.length, 1);
  check('and nothing is left over', leftOut, []);
  check(
    'it becomes an optional placeholder, and a block only some have is filled from the card that has it',
    templates[0].templateYaml.split('\n').slice(2, 9),
    [
      '    card:',
      '      type: tile',
      '      entity: "[[entity]]"',
      '      name: "[[name]]"',
      '      icon: "[[icon?]]"',
      '      tap_action:',
      '        action: "[[action?]]"',
    ],
  );
  check('a card without it passes nothing for it', templates[0].cardsYaml.split('\n').slice(0, 5), [
    '- type: custom:decluttering-card-plus',
    '  template: light_tile_card',
    '  variables:',
    '    - entity: light.kitchen',
    '    - name: Kitchen',
  ]);
  check('and a card with it passes its value', templates[0].cardsYaml.split('\n').slice(5), [
    '- type: custom:decluttering-card-plus',
    '  template: light_tile_card',
    '  variables:',
    '    - entity: light.lounge',
    '    - name: Lounge',
    '    - icon: mdi:sofa',
    '    - action: toggle',
  ]);
}

{
  const { templates } = buildTemplates(`
- type: tile
  entity: light.a
  tap_action:
    action: toggle
- type: tile
  entity: light.b
  tap_action:
    action: toggle
- type: tile
  entity: light.c
`);
  check(
    'a value most cards share is still optional when one card lacks it',
    templates[0].templateYaml.includes('action: "[[action?]]"'),
    true,
  );
}

const featured = (entity, features) =>
  `- type: tile\n  entity: ${entity}\n  features:\n${features.map((type) => `    - type: ${type}\n`).join('')}`;

{
  const pasted =
    featured('light.a', ['light-brightness']) +
    featured('light.b', ['light-brightness']) +
    featured('light.c', ['light-brightness', 'light-color-temp']) +
    featured('light.d', ['light-brightness', 'light-color-temp']);
  check(
    'a list longer on some cards splits them, and the two templates never share a name',
    buildTemplates(pasted).templates.map((made) => made.name),
    ['light_tile_card', 'light_tile_card_2'],
  );
}

check('the strict copies draw the cards they replace', rebuilds(tiles), true);

check(
  'cards missing a setting, or a whole block, draw the cards they replace',
  rebuilds(`
- type: tile
  entity: light.kitchen
  name: Kitchen
- type: tile
  entity: light.lounge
  name: Lounge
  icon: mdi:sofa
  tap_action:
    action: navigate
    navigation_path: /lounge
- type: tile
  entity: light.study
  name: Study
  icon: mdi:desk
  vertical: true
`),
  true,
);

/* ------------------------------------------------------------- left as is */

check(
  'a card whose list is longer than its nearest says what only one of them has',
  buildTemplates(featured('light.a', ['light-brightness']) + featured('light.b', ['light-brightness', 'x'])).leftOut,
  [
    {
      label: 'tile "light.a"',
      reason: 'alone',
      nearest: { label: 'tile "light.b"', onlyHere: [], onlyThere: ['features › #2 › type'] },
    },
    {
      label: 'tile "light.b"',
      reason: 'alone',
      nearest: { label: 'tile "light.a"', onlyHere: ['features › #2 › type'], onlyThere: [] },
    },
  ],
);

check(
  'a value on one card and a block on another cannot share a template',
  buildTemplates(
    '- type: tile\n  entity: light.a\n  tap_action: toggle\n- type: tile\n  entity: light.b\n  tap_action:\n    action: toggle\n',
  ).templates,
  [],
);

check(
  'a card with nothing like it says so, with no nearest',
  buildTemplates('- type: markdown\n  content: hi\n').leftOut,
  [{ label: 'markdown #1', reason: 'alone' }],
);

check(
  'exact copies are left, as there is nothing to fill in',
  buildTemplates('- type: tile\n  entity: light.a\n- type: tile\n  entity: light.a\n').leftOut.map(
    (each) => each.reason,
  ),
  ['copies', 'copies'],
);

{
  const keys = Array.from({ length: 9 }, (_, i) => `k${i}`);
  const card = (n) => `- type: custom:x\n${keys.map((key) => `  ${key}: v${n}`).join('\n')}\n`;
  const { leftOut } = buildTemplates(card(1) + card(2));
  check('cards differing in too many places are left, with how many', leftOut[0], {
    label: 'x #1',
    reason: 'too_many',
    differing: 9,
  });
}

check(
  'a card already using a template is left out, and said to be',
  buildTemplates(`
- type: custom:decluttering-card-plus
  template: light_tile_card
- type: tile
  entity: "[[entity]]"
`).leftOut.map((each) => each.reason),
  ['template', 'template'],
);

check(
  'a stack whose cards became a template is not reported itself',
  buildTemplates(`
- type: vertical-stack
  cards:
    - type: tile
      entity: light.a
    - type: tile
      entity: light.b
`).leftOut,
  [],
);

/* ------------------------------------------------- review 2026-10-25: pasted YAML keys */

{
  const cards = load(
    [
      '- type: tile',
      '  entity: light.a',
      '  tap_action: {action: toggle}',
      '- type: tile',
      '  entity: light.b',
      '  tap_action:',
      '    action: toggle',
      '    __proto__:',
      '      polluted: owned',
    ].join('\n'),
  );
  buildTemplates(cards);
  check('a __proto__ key in a pasted card reaches no prototype', {}.polluted, undefined);
}

report();
