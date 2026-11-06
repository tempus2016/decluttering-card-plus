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
    variables: { entity: '[[entity]]' },
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

// Kept JavaScript reads variables.* from the card, so the card is handed what it reads (#296).
const nested = convertButtonCardTemplates({
  button_card_templates: {
    base: {
      variables: { colour: 'red' },
      styles: { icon: [{ color: '[[[ return variables.colour ]]]' }] },
      custom_fields: { tag: "[[[ return variables['colour'] + '!' ]]]" },
    },
    light_btn: {
      template: 'base',
      variables: { room: 'Kitchen' },
      label: '[[[ return variables.room + " is " + entity.state ]]]',
      name: '[[[ return variables.colour + variables.room ]]]',
    },
  },
});
check('kept JavaScript gets the variables it reads passed on the card', nested.templates.light_btn, {
  extends: 'base',
  variables: [{ name: 'room', default: 'Kitchen' }],
  card: {
    type: 'custom:button-card',
    label: '[[[ return variables.room + " is " + entity.state ]]]',
    name: '[[[ return variables.colour + variables.room ]]]',
    variables: { room: '[[room]]', colour: '[[colour]]' },
  },
});
check('a variable the parent declares is not declared again bare in the child', nested.templates.light_btn.variables, [
  { name: 'room', default: 'Kitchen' },
]);
check(
  'the parent passes the variable its own JavaScript reads, bracketed or not',
  nested.templates.base.card.variables,
  {
    colour: '[[colour]]',
  },
);
check(
  'a template with no kept JavaScript gets no variables: on its card',
  'variables' in
    convertButtonCardTemplates({ x: { name: '[[[ return variables.n ]]]', icon: 'mdi:x' } }).templates.x.card,
  false,
);
check(
  'a variable only kept JavaScript reads is declared',
  convertButtonCardTemplates({ x: { label: '[[[ return variables.n + 1 ]]]', icon: 'mdi:x' } }).templates.x.variables,
  [{ name: 'n' }],
);

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

// ---- auto-entities, other cards: the card_param list repeats, the card is drawn once (#296)
const autoCards = {
  type: 'custom:auto-entities',
  card: { type: 'grid', columns: 2 },
  card_param: 'cards',
  filter: {
    include: [
      { entity_id: 'camera.*', state: 'idle', options: { type: 'picture-entity' } },
      { domain: 'binary_sensor' },
    ],
  },
  show_empty: false,
};
const ac = convertAutoEntities(autoCards);
check('a card_param: cards grid repeats its cards', ac.templates[CONVERTED_ROWS], {
  variables: [{ name: 'source', default: { entities: 'camera.*' } }],
  let: { row: { entity: '[[entity]]', type: 'picture-entity' } },
  card: { type: 'grid', columns: 2, cards: ['[[row|repeat:source]]'] },
});
check('and one decluttering card uses it', ac.card, {
  type: 'custom:decluttering-card-plus',
  template: CONVERTED_ROWS,
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
check(
  'the note names the list that repeats',
  ac.notes.some((n) => /cards:/.test(n)),
  true,
);

const glance = convertAutoEntities({
  type: 'custom:auto-entities',
  card: { type: 'glance', title: 'Glance', entities: ['sensor.old'] },
  filter: { include: [{ domain: 'light' }] },
});
check('a glance is one glance whose entities repeat', glance.templates[CONVERTED_ROWS].card, {
  type: 'glance',
  title: 'Glance',
  entities: ['[[row|repeat:source]]'],
});
for (const type of ['map', 'history-graph', 'logbook', 'statistics-graph', 'picture-glance']) {
  const out = convertAutoEntities({
    type: 'custom:auto-entities',
    card: { type, title: 'T' },
    filter: { include: [{ domain: 'sensor' }] },
  });
  check(`a ${type} card's entities repeat`, out.templates[CONVERTED_ROWS].card, {
    type,
    title: 'T',
    entities: ['[[row|repeat:source]]'],
  });
}
const vstack = convertAutoEntities({
  type: 'custom:auto-entities',
  card: { type: 'vertical-stack' },
  card_param: 'cards',
  filter: { include: [{ domain: 'light', options: { type: 'custom:mushroom-light-card' } }] },
});
check('a vertical-stack repeats cards', vstack.templates[CONVERTED_ROWS].card, {
  type: 'vertical-stack',
  cards: ['[[row|repeat:source]]'],
});
check('a custom card in the options is needed', vstack.needs, ['custom:mushroom-light-card']);
const chips = convertAutoEntities({
  type: 'custom:auto-entities',
  card: { type: 'custom:mushroom-chips-card' },
  card_param: 'chips',
  filter: { include: [{ domain: 'light', options: { type: 'entity' } }] },
});
check('any card_param is the list that repeats', chips.templates[CONVERTED_ROWS].card, {
  type: 'custom:mushroom-chips-card',
  chips: ['[[row|repeat:source]]'],
});
check('the wrapped custom card is needed', chips.needs, ['custom:mushroom-chips-card']);

// ---- auto-entities, this.entity_id in options becomes [[entity]] (#296)
const thisId = convertAutoEntities({
  type: 'custom:auto-entities',
  card: { type: 'entities' },
  filter: {
    include: [
      {
        domain: 'light',
        options: {
          tap_action: { action: 'more-info', entity: 'this.entity_id' },
          hold_action: { action: 'call-service', data: { entity_id: ['this.entity_id'] } },
          name: 'Light this.entity_id here',
        },
      },
    ],
  },
});
check(
  'this.entity_id becomes [[entity]] anywhere in the options, inside text too',
  thisId.templates[CONVERTED_ROWS].let,
  {
    row: {
      entity: '[[entity]]',
      tap_action: { action: 'more-info', entity: '[[entity]]' },
      hold_action: { action: 'call-service', data: { entity_id: ['[[entity]]'] } },
      name: 'Light [[entity]] here',
    },
  },
);
check(
  'a word that only starts the same is left',
  convertAutoEntities({
    type: 'custom:auto-entities',
    filter: { include: [{ domain: 'light', options: { name: 'this.entity_ids' } }] },
  }).templates[CONVERTED_ROWS].let.row.name,
  'this.entity_ids',
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
