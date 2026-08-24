/*
 * Unit tests for src/cycles.ts - stopping a template that uses itself, which otherwise
 * builds levels forever and makes the tab unresponsive. Run with `npm test`.
 */
const {
  CHAIN_KEY,
  MAX_NESTING,
  chainOf,
  chainWith,
  findCycle,
  describeCycle,
  describeTooDeep,
  withChain,
} = require('../.test-build/cycles.js');

const { check, report } = require('./harness');

/* --------------------------------------------------------------- reading the chain */

check('a card with nothing above it has an empty chain', chainOf({ type: 'custom:decluttering-card-plus' }), []);

check('a chain that was handed down is read back', chainOf({ [CHAIN_KEY]: ['a', 'b'] }), ['a', 'b']);

check('a chain that is not a list is ignored', chainOf({ [CHAIN_KEY]: 'a' }), []);

check('entries that are not names are dropped', chainOf({ [CHAIN_KEY]: ['a', 3, null, 'b'] }), ['a', 'b']);

check('no config at all is an empty chain', [chainOf(undefined), chainOf(null)], [[], []]);

/* --------------------------------------------------------------- extending it */

check('a card adds its own template to what it passes down', chainWith(['a'], 'b'), ['a', 'b']);

check('a card with no template of its own passes the chain along unchanged', chainWith(['a'], undefined), ['a']);

check('an empty name is not a template to record', chainWith(['a'], ''), ['a']);

check('the outermost card starts the chain', chainWith(undefined, 'a'), ['a']);

check(
  'the chain handed down is a new list, not the one held above',
  (() => {
    const open = ['a'];
    const next = chainWith(open, 'b');
    next.push('c');
    return open;
  })(),
  ['a'],
);

/* ------------------------------------------------------------------ finding a loop */

check('a template that is not open above is not a loop', [findCycle(['a', 'b'], 'c')], [null]);

check('a template using itself is a loop of one', findCycle(['selfie'], 'selfie'), ['selfie', 'selfie']);

check('two templates using each other is a loop of two', findCycle(['a', 'b'], 'a'), ['a', 'b', 'a']);

check('the loop is reported from where it starts, not from the top', findCycle(['outer', 'a', 'b'], 'a'), [
  'a',
  'b',
  'a',
]);

check('an empty chain can never be a loop', [findCycle([], 'a')], [null]);

check('nothing to render is not a loop', [findCycle(['a'], undefined), findCycle(['a'], '')], [null, null]);

/* ------------------------------------------------------------------ what it says */

check(
  'a template using itself is described as using itself',
  describeCycle(['selfie', 'selfie']).includes('"selfie" uses itself (selfie → selfie)'),
  true,
);

check('a longer loop names the whole path', describeCycle(['a', 'b', 'a']).includes('a → b → a'), true);

check(
  'a longer loop says one of them has to stop',
  describeCycle(['a', 'b', 'a']).includes('stop using the next'),
  true,
);

check(
  'nesting too deep names the depth it gave up at',
  describeTooDeep(['a', 'b', 'c']).includes(String(MAX_NESTING)),
  true,
);

/* ------------------------------------------------------------------- handing it on */

check(
  'a card built from a template is told what is open above it',
  withChain({ type: 'custom:decluttering-card-plus', template: 'inner' }, ['outer'])[CHAIN_KEY],
  ['outer'],
);

check(
  'the original is never written on, so a template cannot pick the key up',
  (() => {
    const original = { type: 'custom:decluttering-card-plus', template: 'inner' };
    withChain(original, ['outer']);
    return Object.keys(original);
  })(),
  ['type', 'template'],
);

check(
  'a configuration holding none of our cards is handed back as it is',
  (() => {
    const original = { type: 'tile', entity: 'light.hall' };
    return withChain(original, ['outer']) === original;
  })(),
  true,
);

check(
  'a card nested inside a stack is told too',
  (() => {
    const config = {
      type: 'vertical-stack',
      cards: [{ type: 'tile' }, { type: 'custom:decluttering-card-plus', template: 'inner' }],
    };
    return withChain(config, ['outer']).cards[1][CHAIN_KEY];
  })(),
  ['outer'],
);

check(
  'the original card type is told as well as the plus one',
  (() => {
    return withChain({ type: 'custom:decluttering-card', template: 'inner' }, ['outer'])[CHAIN_KEY];
  })(),
  ['outer'],
);

check(
  'a card that is not one of ours is left alone',
  (() => {
    return Object.keys(withChain({ type: 'tile', entity: 'light.hall' }, ['outer']));
  })(),
  ['type', 'entity'],
);

check(
  'every card in a list is told, not just the first',
  (() => {
    const config = [
      { type: 'custom:decluttering-card-plus', template: 'a' },
      { type: 'custom:decluttering-card-plus', template: 'b' },
    ];
    return withChain(config, ['outer']).map((c) => c[CHAIN_KEY]);
  })(),
  [['outer'], ['outer']],
);

/* --------------------------------------------------- template cards carry the chain */

// A template card nested in another template's content has to be handed the chain as well,
// or it inherits an empty one and overwrites the chain stamped beneath it - the chain then
// never grows and a template that reaches itself through a nested template card recurses
// without end. Both spellings of the template card are stamped.
check(
  'a template card is handed the open chain like a consumer',
  withChain({ type: 'custom:decluttering-template-plus', template: 'A2' }, ['A'])[CHAIN_KEY],
  ['A'],
);
check(
  'the legacy template card is handed the chain too',
  withChain({ type: 'custom:decluttering-template', template: 'A2' }, ['A'])[CHAIN_KEY],
  ['A'],
);
check(
  'a template card nested in content is reached',
  withChain({ type: 'vertical-stack', cards: [{ type: 'custom:decluttering-template-plus', template: 'X' }] }, ['top'])
    .cards[0][CHAIN_KEY],
  ['top'],
);

report();
