/*
 * Unit tests for src/describe.ts: the template builder's "describe what you want", which
 * writes a template from answers to a few questions. Run with `npm test`.
 */
const { describeTemplate, readEntities, supported } = require('../.test-build/describe.js');
const deepReplace = require('../.test-build/deep-replace.js').default;
const { load } = require('js-yaml');

const { check } = require('./check');

const base = (more = {}) => ({ kind: 'card', cardType: 'tile', changes: [], entities: ['light.kitchen'], ...more });

/*
 * What each card it writes draws: the template, given that card's variables, through the
 * card's own substitution. The proof that the YAML it hands over does what it says.
 */
function draws(described) {
  const template = Object.values(load(described.templateYaml).decluttering_templates)[0];
  const content = template.card ?? template.badge ?? template.row;
  let usage = load(described.usageYaml);
  if (!Array.isArray(usage)) usage = usage.entities;
  return usage.flatMap((card) => {
    const sets = card.for_each ? card.for_each.map((item) => [item]) : [card.variables];
    return sets.map((variables) => deepReplace(variables, template, content, 'x', undefined, true));
  });
}

/* ----------------------------------------------------------------- reading */

check(
  'entities are read one a line or comma-separated, duplicates and junk dropped',
  readEntities('light.kitchen\nlight.hall, light.kitchen\nnot an entity\n  sensor.a_b  '),
  ['light.kitchen', 'light.hall', 'sensor.a_b'],
);

check('a tile can be told everything', supported({ kind: 'card', cardType: 'tile' }), [
  'name',
  'icon',
  'color',
  'navigate',
]);
check('a button has no colour', supported({ kind: 'card', cardType: 'button' }).includes('color'), false);
check(
  'a custom card is assumed to take it all',
  supported({ kind: 'card', cardType: 'custom:mushroom-entity-card' }).length,
  4,
);

/* ---------------------------------------------------------------- the least */

{
  const made = describeTemplate(base({ entities: ['light.kitchen', 'light.hall'] }));
  check('it is named for the type and the domain', made.name, 'light_tile_card');
  check(
    'the least it writes is the type and the entity',
    made.templateYaml,
    [
      'decluttering_templates:',
      '  light_tile_card:',
      '    card:',
      '      type: tile',
      '      entity: "[[entity]]"',
    ].join('\n'),
  );
  check('and one card per entity, each drawing a tile for it', draws(made), [
    { type: 'tile', entity: 'light.kitchen' },
    { type: 'tile', entity: 'light.hall' },
  ]);
}

check('a name of their own is used, cleaned up', describeTemplate(base({ name: 'Room Light!' })).name, 'room_light');
check(
  'with no entities there is still one example card',
  load(describeTemplate(base({ entities: [], domain: 'switch' })).usageYaml)[0].variables,
  [{ entity: 'switch.example' }],
);

/* ------------------------------------------------------------ what changes */

{
  const made = describeTemplate(base({ changes: ['name', 'icon', 'color', 'navigate'] }));
  check('a copy that sets nothing optional gets a plain tile that opens its page', draws(made), [
    { type: 'tile', entity: 'light.kitchen', tap_action: { action: 'navigate', navigation_path: '/lovelace/kitchen' } },
  ]);
  check('the optional ones are marked so', made.templateYaml.includes('icon: "[[icon?]]"'), true);
  check('and the page to open is not', made.templateYaml.includes('navigation_path: "[[path]]"'), true);
  const usage = load(made.usageYaml);
  usage[0].variables.push({ name: 'Kitchen' }, { color: 'amber' });
  const template = load(made.templateYaml).decluttering_templates.light_tile_card;
  check(
    'a copy that does set them gets them',
    deepReplace(usage[0].variables, template, template.card, 'x', undefined, true),
    {
      type: 'tile',
      entity: 'light.kitchen',
      name: 'Kitchen',
      color: 'amber',
      tap_action: { action: 'navigate', navigation_path: '/lovelace/kitchen' },
    },
  );
}

{
  const made = describeTemplate(base({ cardType: 'button', changes: ['name', 'color'] }));
  check('what a button cannot take is left out, and said to be', made.skipped, ['color']);
  check('and not written', made.templateYaml.includes('color'), false);
}

{
  const made = describeTemplate(base({ extra: ['show_state', 'bad key', 'entity', 'show_state'] }));
  check('other settings become optional variables, once, and only real keys', made.templateYaml.split('\n').slice(-1), [
    '      show_state: "[[show_state?]]"',
  ]);
}

/* --------------------------------------------------------------- the extras */

{
  const made = describeTemplate(base({ hideUnavailable: true }));
  check('hiding while unavailable is a visibility condition on the entity', draws(made)[0].visibility, [
    { condition: 'state', entity: 'light.kitchen', state_not: 'unavailable' },
  ]);
}

{
  const made = describeTemplate(base({ describe: true, domain: 'light', changes: ['name', 'navigate'] }));
  const template = load(made.templateYaml).decluttering_templates.light_tile_card;
  check('describing the variables declares each one, the entity narrowed and required', template.variables, [
    { name: 'entity', label: 'Entity', type: 'entity', domain: 'light', required: true },
    { name: 'name', label: 'Name', type: 'text', description: "Leave empty to use the entity's own name" },
    {
      name: 'path',
      label: 'Opens',
      type: 'text',
      description: 'The dashboard path it opens, like /lovelace/kitchen',
      required: true,
    },
  ]);
  check('and the copies still draw', draws(made).length, 1);
}

{
  const made = describeTemplate(base({ repeat: true, entities: ['light.a', 'light.b'], changes: ['navigate'] }));
  const usage = load(made.usageYaml);
  check('repeating makes one card with for_each', usage.length, 1);
  check('one entry per entity', usage[0].for_each, [
    { entity: 'light.a', path: '/lovelace/a' },
    { entity: 'light.b', path: '/lovelace/b' },
  ]);
  check(
    'which draws one tile each',
    draws(made).map((card) => card.entity),
    ['light.a', 'light.b'],
  );
}

/* ---------------------------------------------------------- badges and rows */

{
  const made = describeTemplate({ kind: 'badge', changes: ['color'], entities: ['sensor.power'], repeat: true });
  check('a badge is an entity badge under badge:', load(made.templateYaml).decluttering_templates.sensor_badge, {
    badge: { type: 'entity', entity: '[[entity]]', color: '[[color?]]' },
  });
  check('and is never repeated - for_each is for cards', Array.isArray(load(made.usageYaml)), true);
  check(
    'it says where badges go',
    made.notes.some((note) => note.link === 'Badges.html'),
    true,
  );
}

{
  const made = describeTemplate({
    kind: 'row',
    changes: ['name'],
    entities: ['sensor.a', 'sensor.b'],
    hideUnavailable: true,
  });
  const template = load(made.templateYaml).decluttering_templates.sensor_row;
  check('a row has no type and no visibility', template, { row: { entity: '[[entity]]', name: '[[name?]]' } });
  check('and comes inside an entities card', load(made.usageYaml).type, 'entities');
  check('drawing a row per entity', draws(made), [{ entity: 'sensor.a' }, { entity: 'sensor.b' }]);
}

/* -------------------------------------------------------------------- notes */

{
  const made = describeTemplate(
    base({ changes: ['name', 'navigate'], hideUnavailable: true, describe: true, repeat: true }),
  );
  check(
    'every part it wrote has a note pointing at its page',
    made.notes.map((note) => note.link),
    [
      'Variables.html#passing-values',
      'Variables.html#a-variable-the-template-can-do-without-v110',
      'Variables.html#writing-placeholders',
      'Visibility.html',
      'Describing-Variables.html#declaring-them',
      'Repeating-a-Template.html',
    ],
  );
}
