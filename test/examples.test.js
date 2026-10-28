/*
 * Unit tests for src/examples.ts - a template's `examples:`, read in either shape and
 * built the way a card would build them, so the health panel can say which fail.
 * Run with `npm test`.
 */
const { exampleSets, exampleVariables, checkExamples } = require('../.test-build/examples.js');

const { check } = require('./check');

/* ---------------------------------------------------------------- reading them */

check(
  'each entry is a whole set, written as a mapping or as a list',
  exampleSets({
    examples: [{ entity: 'light.a', name: 'A' }, [{ entity: 'light.b' }, { name: 'B' }]],
  }),
  [
    [{ entity: 'light.a' }, { name: 'A' }],
    [{ entity: 'light.b' }, { name: 'B' }],
  ],
);

check('a single mapping is a list of one', exampleSets({ examples: { entity: 'light.a' } }), [[{ entity: 'light.a' }]]);

check(
  'no examples, none to read',
  [exampleSets({}), exampleSets(undefined), exampleSets({ examples: null })],
  [[], [], []],
);

check(
  'one example by its place, and none past the end or when none is asked for',
  [
    exampleVariables({ examples: [{ a: 1 }, { a: 2 }] }, 1),
    exampleVariables({ examples: [{ a: 1 }] }, 4),
    exampleVariables({ examples: [{ a: 1 }] }, undefined),
  ],
  [[{ a: 2 }], undefined, undefined],
);

/* ---------------------------------------------------------------- checking them */

const TEMPLATES = {
  tile: {
    variables: [
      { name: 'entity', type: 'entity', domain: 'light' },
      { name: 'size', allowed: ['small', 'big'] },
    ],
    default: [{ size: 'small' }],
    examples: [{ entity: 'light.kitchen' }, { entity: 'switch.kettle' }, { size: 'huge', entity: 'light.hall' }, {}],
    card: { type: 'tile', entity: '[[entity]]', name: '[[size]]' },
  },
  stack: {
    examples: [{ room: 'hall' }],
    card: {
      type: 'vertical-stack',
      cards: [
        { type: 'custom:decluttering-card-plus', template: 'tile', variables: [{ entity: 'light.[[room]]' }] },
        { type: 'custom:decluttering-card-plus', template: 'lent' },
      ],
    },
  },
  loop_a: { examples: [{}], card: { type: 'custom:decluttering-card-plus', template: 'loop_b' } },
  loop_b: { card: { type: 'custom:decluttering-card-plus', template: 'loop_a' } },
  both: { examples: [{}], card: {}, badge: {} },
  by_domain: {
    examples: [{}],
    card: {
      type: 'custom:decluttering-card-plus',
      template_by_domain: { light: 'tile', default: 'nowhere' },
    },
  },
  quiet: { card: { type: 'button' } },
};

// Review 2026-10-18: a chain of templates each naming the next twice is followed once per
// level, not 2^level times.
{
  const doubling = {};
  for (let i = 0; i < 20; i += 1) {
    const next = `d${i + 1}`;
    doubling[`d${i}`] = {
      card: {
        type: 'vertical-stack',
        cards: [
          { type: 'custom:decluttering-card-plus', template: next },
          { type: 'custom:decluttering-card-plus', template: next },
        ],
      },
    };
  }
  doubling.d20 = { card: { type: 'markdown', content: 'end' } };
  doubling.d0.examples = [{}];
  const started = Date.now();
  check('a doubling chain of nested templates is checked without blowing up', checkExamples(doubling), []);
  check('and quickly', Date.now() - started < 300, true);
}

const failed = checkExamples(TEMPLATES, ['lent']);

check(
  'only the examples that fail are reported, numbered from one',
  failed.map((each) => `${each.template} #${each.example}`),
  ['both #1', 'by_domain #1', 'loop_a #1', 'tile #2', 'tile #3', 'tile #4'],
);

const problems = (template, example) =>
  failed.find((each) => each.template === template && each.example === example)?.problems ?? [];

check('a value the declared type will not take', problems('tile', 2), [
  'The value of entity is not one the template accepts. It expects: an entity in light.',
]);
check('a value outside allowed:', problems('tile', 3), [
  'The value of size is not one the template accepts. It expects: small, big.',
]);
check('a variable left unset, which a strict card would refuse', problems('tile', 4), [
  'Leaves [[entity]] unset, so it shows as written and a strict card refuses it.',
]);
check('a nested template that does not exist is named; a borrowed one is not a problem', problems('stack', 1), []);
check('a loop through a nested template is named', problems('loop_a', 1), [
  'These templates use each other in a loop (loop_a → loop_b → loop_a), which would never finish. One of them has to stop using the next.',
]);
check('a template defining two things says so', problems('both', 1), [
  'This template defines both "card" and "badge". A template can only define one of card, badge, element or row.',
]);
check('every template a by-domain card names is followed', problems('by_domain', 1), [
  'Uses the template "nowhere", which does not exist.',
]);

check(
  'the nested missing template is reported against the template it sits in',
  checkExamples(
    {
      ...TEMPLATES,
      stack: {
        ...TEMPLATES.stack,
        card: {
          ...TEMPLATES.stack.card,
          cards: [...TEMPLATES.stack.card.cards, { type: 'custom:decluttering-card-plus', template: 'gone' }],
        },
      },
    },
    [],
  ).find((each) => each.template === 'stack')?.problems,
  ['Uses the template "lent", which does not exist.', 'Uses the template "gone", which does not exist.'],
);
