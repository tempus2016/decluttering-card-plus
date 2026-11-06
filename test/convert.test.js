/*
 * Converting from other cards (idea 59): button-card templates and auto-entities cards.
 */
const { check } = require('./check');
const {
  convert,
  convertButtonCardTemplates,
  convertAutoEntities,
  asImport,
  CONVERTED_ROWS,
  CONVERTED_CARD,
} = require('../.test-build/convert');

// ---- button-card
const buttonCard = {
  button_card_templates: {
    room_button: {
      variables: { entity: 'light.kitchen_ceiling', label: 'Kitchen' },
      entity: '[[[ return variables.entity ]]]',
      name: '[[[ return variables.label; ]]]',
      icon: 'mdi:ceiling-light',
      tap_action: { action: 'toggle' },
      styles: { card: [{ height: '80px' }] },
      custom_fields: { note: '[[[ return states[variables.entity].state ]]]' },
    },
    big_button: {
      template: 'room_button',
      styles: { card: [{ height: '120px' }] },
    },
    lonely: {
      template: ['room_button', 'not_pasted'],
      name: "[[[ return variables['other'] ]]]",
    },
  },
};
const bc = convertButtonCardTemplates(buttonCard);

check('every entry becomes a template', Object.keys(bc.templates), ['room_button', 'big_button', 'lonely']);
check('variables become declarations with defaults, and plain returns become placeholders', bc.templates.room_button, {
  variables: [
    { name: 'entity', default: 'light.kitchen_ceiling' },
    { name: 'label', default: 'Kitchen' },
  ],
  card: {
    type: 'custom:button-card',
    entity: '[[entity]]',
    name: '[[label]]',
    icon: 'mdi:ceiling-light',
    tap_action: { action: 'toggle' },
    styles: { card: [{ height: '80px' }] },
    custom_fields: { note: '[[[ return states[variables.entity].state ]]]' },
  },
});
check('a template: parent becomes extends: when it was pasted too', bc.templates.big_button.extends, 'room_button');
check('a parent that was not pasted is left out and noted', bc.templates.lonely.extends, 'room_button');
check('a bracketed variable name is read too and declared', bc.templates.lonely.variables, [{ name: 'other' }]);
check(
  'the JavaScript that was kept is noted once per template',
  bc.notes.filter((n) => /room_button/.test(n)).length,
  1,
);
check(
  'the unknown parent is noted',
  bc.notes.some((n) => /not_pasted/.test(n)),
  true,
);
check('button-card is what it needs', bc.needs, ['custom:button-card']);
check(
  'a single body is converted under a stand-in name',
  Object.keys(convertButtonCardTemplates({ icon: 'mdi:x', styles: {} }).templates),
  ['converted'],
);
check(
  'a decluttering template is not mistaken for button-card',
  convertButtonCardTemplates({ card: { type: 'tile' } }),
  undefined,
);
check('a list is nothing', convertButtonCardTemplates([1]), undefined);

// ---- auto-entities, entities card
const autoRows = {
  type: 'custom:auto-entities',
  card: { type: 'entities', title: 'Kitchen lights' },
  filter: {
    include: [{ domain: 'light', area: 'Kitchen', options: { secondary_info: 'last-changed' } }],
    exclude: [{ entity_id: 'light.kitchen_strip' }, { state: 'unavailable' }],
  },
  sort: { method: 'name', reverse: true, count: 5 },
};
const ae = convertAutoEntities(autoRows);
check('an entities card becomes a template with one repeating row', ae.templates[CONVERTED_ROWS], {
  variables: [
    {
      name: 'source',
      default: {
        domain: 'light',
        area: 'Kitchen',
        entities: true,
        exclude: ['light.kitchen_strip'],
        sort: 'name',
        reverse: true,
        limit: 5,
      },
    },
  ],
  let: { row: { entity: '[[entity]]', secondary_info: 'last-changed' } },
  card: { type: 'entities', title: 'Kitchen lights', entities: ['[[row|repeat:source]]'] },
});
check('and a card using it', ae.card, { type: 'custom:decluttering-card-plus', template: CONVERTED_ROWS });
check('an exclude on state is dropped and named', ae.dropped.length === 1 && /unavailable/.test(ae.dropped[0]), true);
check('nothing custom is needed for an entities card', ae.needs, []);

// ---- auto-entities, other card
const autoCards = {
  type: 'custom:auto-entities',
  card: { type: 'grid', columns: 2 },
  card_param: 'cards',
  filter: { include: [{ entity_id: 'camera.*', state: 'idle' }, { domain: 'binary_sensor' }] },
  show_empty: false,
};
const ac = convertAutoEntities(autoCards);
check('another card becomes a card template repeated per entity', ac.card, {
  type: 'custom:decluttering-card-plus',
  template: CONVERTED_CARD,
  for_each_from: { entities: 'camera.*' },
});
check('the card gets the entity filled in', ac.templates[CONVERTED_CARD].card, {
  type: 'grid',
  columns: 2,
  entity: '[[entity]]',
});
check(
  'a state filter is dropped',
  ac.dropped.some((d) => /"state"/.test(d) || /state/.test(d)),
  true,
);
check(
  'a second include is noted',
  ac.notes.some((n) => /2/.test(n)),
  true,
);
check(
  'show_empty is noted',
  ac.notes.some((n) => /empty/.test(n)),
  true,
);
check('a card that is not auto-entities is nothing', convertAutoEntities({ type: 'entities' }), undefined);

// ---- convert() and asImport()
check('convert tries auto-entities first', convert(autoRows).from, 'auto-entities');
check('convert falls back to button-card', convert(buttonCard).from, 'button-card');
check('convert gives nothing for a plain card', convert({ type: 'tile', entity: 'light.a' }), undefined);
check('asImport names the first template and carries the rest as includes', asImport(bc), {
  template: 'room_button',
  ...bc.templates.room_button,
  includes: { big_button: bc.templates.big_button, lonely: bc.templates.lonely },
});
check('asImport of one template has no includes', 'includes' in asImport(ae), false);
