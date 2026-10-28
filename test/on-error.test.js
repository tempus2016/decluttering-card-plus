/*
 * Unit tests for src/on-error.ts - what a card shows instead of an error, and which
 * custom elements it waits for before deciding one was never installed. Run with `npm test`.
 */
const { onErrorOf, customTags, undefinedElements } = require('../.test-build/on-error.js');

const { check } = require('./check');

/* ---------------------------------------------------------------- which on_error */

check('a card config to show instead', onErrorOf({ on_error: { type: 'markdown', content: 'x' } }), {
  config: { type: 'markdown', content: 'x' },
});
check('hide shows nothing', onErrorOf({ on_error: 'hide' }), { hide: true });
check('the template can say it for every card using it', onErrorOf({}, { on_error: 'hide' }), { hide: true });
check('the card beats its template', onErrorOf({ on_error: { type: 'markdown' } }, { on_error: 'hide' }), {
  config: { type: 'markdown' },
});
check(
  'anything else is not an on_error, and the error shows as ever',
  [onErrorOf({ on_error: 'show' }), onErrorOf({ on_error: ['x'] }), onErrorOf({}), onErrorOf(undefined, undefined)],
  [undefined, undefined, undefined, undefined],
);
check(
  'a card whose on_error is not one falls through to its template',
  onErrorOf({ on_error: 3 }, { on_error: 'hide' }),
  { hide: true },
);

/* ---------------------------------------------------------------- custom elements */

check('a custom card needs its element', customTags({ type: 'custom:button-card' }), ['button-card']);
check("one of Home Assistant's own needs nothing", customTags({ type: 'tile' }), []);
check(
  'the cards of a stack are looked at too, once each, and our own types are not',
  customTags({
    type: 'vertical-stack',
    cards: [
      { type: 'custom:button-card' },
      { type: 'custom:mushroom-light-card' },
      { type: 'custom:button-card' },
      { type: 'custom:decluttering-card-plus' },
      { type: 'tile' },
    ],
  }),
  ['button-card', 'mushroom-light-card'],
);
check(
  'a group built by a template is a stack too',
  customTags({ type: 'custom:decluttering-card-plus-group', cards: [{ type: 'custom:x-card' }] }),
  ['x-card'],
);
check(
  'deeper than one level is left to the card around it',
  customTags({ type: 'grid', cards: [{ type: 'vertical-stack', cards: [{ type: 'custom:deep' }] }] }),
  [],
);
check('nothing at all needs nothing', [customTags(undefined), customTags({ type: 'custom:' })], [[], []]);

function registry(defined, later = {}) {
  const known = new Set(defined);
  return {
    get: (tag) => (known.has(tag) ? class {} : undefined),
    whenDefined: (tag) =>
      new Promise((resolve) => {
        if (known.has(tag)) resolve();
        else if (later[tag] !== undefined)
          setTimeout(() => {
            known.add(tag);
            resolve();
          }, later[tag]);
      }),
  };
}

(async () => {
  check('everything defined, nothing to wait for', await undefinedElements(['a'], 50, registry(['a'])), []);
  check('one never installed is reported after the wait', await undefinedElements(['a', 'b'], 30, registry(['a'])), [
    'b',
  ]);
  check(
    'one that turns up within the wait is not',
    await undefinedElements(['late'], 200, registry([], { late: 10 })),
    [],
  );
})();
