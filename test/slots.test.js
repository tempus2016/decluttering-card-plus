/*
 * Unit tests for slots (idea 35): `[[name|slot]]` splices a card's cards into a template's
 * list, and `slots:` on the card is another way of writing those variables.
 */
const deepReplace = require('../.test-build/deep-replace.js').default;
const { withSlotVariables, slotNames, SLOTS_KEY } = require('../.test-build/slots.js');
const { KNOWN_STEPS } = require('../.test-build/variables.js');

const { check } = require('./check');

const warnings = [];
const realWarn = console.warn;
console.warn = (m) => warnings.push(m);

const frame = {
  card: {
    type: 'vertical-stack',
    cards: [{ type: 'heading', heading: '[[area]]' }, '[[body|slot]]', '[[footer|slot?]]'],
  },
};

check(
  'a list in a slot is spliced in, entry for entry, after the template’s own card',
  deepReplace(
    [
      { area: 'Kitchen' },
      {
        body: [
          { type: 'tile', entity: 'light.a' },
          { type: 'tile', entity: 'light.b' },
        ],
      },
    ],
    frame,
    frame.card,
  ),
  {
    type: 'vertical-stack',
    cards: [
      { type: 'heading', heading: 'Kitchen' },
      { type: 'tile', entity: 'light.a' },
      { type: 'tile', entity: 'light.b' },
    ],
  },
);

check(
  'a mapping in a slot is one card',
  deepReplace([{ body: { type: 'tile', entity: 'light.a' } }], frame, frame.card).cards.slice(1),
  [{ type: 'tile', entity: 'light.a' }],
);

check(
  'an optional slot nothing fills drops out of the list',
  deepReplace([{ body: [{ type: 'tile' }] }], frame, frame.card).cards.length,
  2,
);

check(
  'both slots filled, in the order the template wrote them',
  deepReplace([{ body: [{ type: 'a' }] }, { footer: [{ type: 'f1' }, { type: 'f2' }] }], frame, frame.card).cards.map(
    (card) => card.type,
  ),
  ['heading', 'a', 'f1', 'f2'],
);

warnings.length = 0;
check(
  'a required slot left empty stays visible, so the card says what is missing',
  deepReplace([{ area: 'Hall' }], frame, frame.card).cards[1],
  '[[body|slot]]',
);
check(
  'and it is reported as unset',
  warnings.some((m) => m.includes('[[body|slot]]')),
  true,
);

check(
  'a card in a slot keeps placeholders meant for the nested card it is',
  deepReplace(
    [{ body: [{ type: 'custom:decluttering-card-plus', template: 't', variables: [{ x: '[[y]]' }] }] }],
    frame,
    frame.card,
  ).cards[1].variables,
  [{ x: '[[y]]' }],
);

check(
  'a slot inside a longer piece of text is just the value as text',
  deepReplace([{ body: 'plain' }], {}, { title: 'x [[body|slot]] y' }),
  { title: 'x plain y' },
);

check(
  'slot must stand alone in its chain',
  deepReplace([{ body: [{ type: 'a' }] }], {}, { cards: ['[[body|slot|upper]]'] }).cards[0],
  '[[body|slot|upper]]',
);

check('slot is a step the lint knows', KNOWN_STEPS.includes('slot'), true);

/* -------------------------------------------------------------- slots: on the card */

check(
  'slots: is folded in front of variables, and the key goes',
  withSlotVariables({ template: 't', variables: [{ area: 'Kitchen' }], slots: { body: [{ type: 'tile' }] } }),
  { template: 't', variables: [{ body: [{ type: 'tile' }] }, { area: 'Kitchen' }] },
);
check('a mapping of variables is read too', withSlotVariables({ variables: { a: 1 }, slots: { b: 2 } }), {
  variables: [{ b: 2 }, { a: 1 }],
});
check('no slots, nothing changes', withSlotVariables({ template: 't', variables: [{ a: 1 }] }), {
  template: 't',
  variables: [{ a: 1 }],
});
check(
  'an empty or malformed slots: is left as it is',
  [withSlotVariables({ slots: {} }), withSlotVariables({ slots: 'x' }), withSlotVariables({ slots: [1] })],
  [{ slots: {} }, { slots: 'x' }, { slots: [1] }],
);
check('the key, for the editors', SLOTS_KEY, 'slots');

/* ------------------------------------------------------------------ slotNames */

check('the slots a template asks for, each once, optional or not', slotNames(frame), ['body', 'footer']);
check('a template with no slots asks for none', slotNames({ card: { type: 'tile', entity: '[[e]]' } }), []);
check('nothing asks for nothing', slotNames(undefined), []);

console.warn = realWarn;
