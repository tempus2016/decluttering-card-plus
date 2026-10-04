/*
 * Unit tests for src/strategy.ts - the view strategy that writes out a section or a badge
 * per item. Run with `npm test`.
 */
const { generateView, expandEntry, isRepeatEntry, wantsLabels } = require('../.test-build/strategy.js');

const { check, report } = require('./harness');

const hass = {
  floors: { ground: { floor_id: 'ground', name: 'Ground floor' } },
  areas: {
    kitchen: { area_id: 'kitchen', name: 'Kitchen', floor_id: 'ground', labels: [] },
    bedroom: { area_id: 'bedroom', name: 'Bedroom', floor_id: 'ground', labels: [] },
  },
  devices: {},
  entities: {
    'person.anna': { entity_id: 'person.anna', labels: [] },
    'person.ben': { entity_id: 'person.ben', labels: [] },
  },
  states: {
    'person.anna': { attributes: { friendly_name: 'Anna' } },
    'person.ben': { attributes: { friendly_name: 'Ben' } },
  },
};

// Console output from substitution is noise here.
console.warn = () => {};

/* ------------------------------------------------------------- what repeats */

check('an entry with for_each repeats', isRepeatEntry({ for_each: [], section: {} }), true);

check('an entry with for_each_from repeats', isRepeatEntry({ for_each_from: { areas: true } }), true);

check('an ordinary section does not', isRepeatEntry({ type: 'grid', cards: [] }), false);

check('a non-repeat entry passes through untouched', expandEntry({ type: 'grid', cards: [1] }, 'section'), [
  { type: 'grid', cards: [1] },
]);

/* ------------------------------------------------------------- sections */

check(
  'a written-out list gives one section per item, placeholders filled',
  expandEntry(
    {
      for_each: [{ room: 'Kitchen' }, { room: 'Hall' }],
      section: { type: 'grid', title: '[[room]] [[index]]/[[count]]' },
    },
    'section',
  ),
  [
    { type: 'grid', title: 'Kitchen 1/2' },
    { type: 'grid', title: 'Hall 2/2' },
  ],
);

check(
  'a registry source gives one section per area, in name order, area named',
  expandEntry({ for_each_from: { areas: true }, section: { type: 'grid', heading: '[[area]]' } }, 'section', [], hass),
  [
    { type: 'grid', heading: 'Bedroom' },
    { type: 'grid', heading: 'Kitchen' },
  ],
);

check(
  'a templated card in a copy is handed the copy values, after its own',
  expandEntry(
    {
      for_each: [{ area: 'kitchen' }],
      section: {
        type: 'grid',
        cards: [{ type: 'custom:decluttering-card-plus', template: 'room', variables: [{ colour: 'red' }] }],
      },
    },
    'section',
  )[0].cards[0].variables,
  [{ colour: 'red' }, { area: 'kitchen' }, { index: 1 }, { index0: 0 }, { count: 1 }, { first: true }, { last: true }],
);

check(
  'a template card definition inside a copy is left alone',
  expandEntry(
    {
      for_each: [{ area: 'kitchen' }],
      section: { cards: [{ type: 'custom:decluttering-template-plus', template: 't', card: { x: 1 } }] },
    },
    'section',
  )[0].cards[0],
  { type: 'custom:decluttering-template-plus', template: 't', card: { x: 1 } },
);

check(
  'the entry and the strategy both give values, the entry first',
  expandEntry({ for_each: [{}], variables: [{ size: 'big' }], section: { t: '[[size]] [[theme]]' } }, 'section', [
    { size: 'small' },
    { theme: 'dark' },
  ]),
  [{ t: 'big dark' }],
);

check('a repeat over nothing gives no sections', expandEntry({ for_each: [], section: { t: 1 } }, 'section'), []);

check(
  'a repeat over nothing gives its empty: instead',
  expandEntry({ for_each: [], section: { t: 1 }, empty: { type: 'grid', cards: [] } }, 'section'),
  [{ type: 'grid', cards: [] }],
);

check('a repeat with no section to repeat gives nothing', expandEntry({ for_each: [{ a: 1 }] }, 'section'), []);

/* ------------------------------------------------------------- badges */

check(
  'badges repeat the same way',
  expandEntry(
    { for_each_from: { entities: 'person.*' }, badge: { type: 'entity', entity: '[[entity]]' } },
    'badge',
    [],
    hass,
  ),
  [
    { type: 'entity', entity: 'person.anna' },
    { type: 'entity', entity: 'person.ben' },
  ],
);

check(
  'a templated badge is handed the copy values',
  expandEntry(
    { for_each: [{ who: 'person.anna' }], badge: { type: 'custom:decluttering-card-plus', template: 'person_badge' } },
    'badge',
  )[0].variables[0],
  { who: 'person.anna' },
);

/* ------------------------------------------------------------- the view */

const view = generateView(
  {
    type: 'custom:decluttering-card-plus',
    max_columns: 3,
    variables: [{ theme: 'dark' }],
    badges: [
      { type: 'entity', entity: 'sun.sun' },
      { for_each: [{ e: 'a' }, { e: 'b' }], badge: { entity: '[[e]]' } },
    ],
    sections: [
      { type: 'grid', cards: [] },
      { for_each: [{ r: 'x' }], section: { type: 'grid', title: '[[r]] [[theme]]' } },
    ],
  },
  hass,
);

check('the view keeps everything that is not the strategy own', view.max_columns, 3);

check('the strategy keys do not leak into the view', [view.variables, view.strategy], [undefined, undefined]);

check('asking for sections gives a sections view', view.type, 'sections');

check('fixed and repeated sections sit in order', view.sections, [
  { type: 'grid', cards: [] },
  { type: 'grid', title: 'x dark' },
]);

check('fixed and repeated badges sit in order', view.badges, [
  { type: 'entity', entity: 'sun.sun' },
  { entity: 'a' },
  { entity: 'b' },
]);

check('a view type that is asked for is kept', generateView({ view_type: 1, sections: [] }).type, 'sections');

check('no sections asked for, no view type imposed', generateView({ badges: [] }).type, undefined);

check(
  'labels are wanted when a repeat names them',
  wantsLabels({ sections: [{ for_each_from: { labels: true } }] }),
  true,
);

check('and not otherwise', wantsLabels({ sections: [{ for_each_from: { areas: true } }] }), false);

report();
