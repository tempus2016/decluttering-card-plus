/*
 * Unit tests for src/on-error.ts - what a card shows instead of an error, and which
 * custom elements it waits for before deciding one was never installed. Run with `npm test`.
 */
const {
  onErrorOf,
  customTags,
  undefinedElements,
  whenElementsDefined,
  listenersWaiting,
} = require('../.test-build/on-error.js');

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

// As a browser's registry answers: a name that could never be an element's is refused.
const VALID_NAME = /^[a-z][a-z0-9._-]*-[a-z0-9._-]*$/;

function registry(defined, later = {}) {
  const known = new Set(defined);
  const asked = [];
  return {
    asked,
    get: (tag) => (known.has(tag) ? class {} : undefined),
    whenDefined: (tag) =>
      new Promise((resolve, reject) => {
        asked.push(tag);
        if (!VALID_NAME.test(tag)) reject(new SyntaxError(`"${tag}" is not a valid custom element name`));
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
  check('everything defined, nothing to wait for', await undefinedElements(['a-card'], 50, registry(['a-card'])), []);
  check(
    'one never installed is reported after the wait',
    await undefinedElements(['a-card', 'b-card'], 30, registry(['a-card'])),
    ['b-card'],
  );
  check(
    'one that turns up within the wait is not',
    await undefinedElements(['late-card'], 200, registry([], { 'late-card': 10 })),
    [],
  );
  // #456: a page still busy when the two seconds are up is waited for, so a card script that
  // runs once the page is free is not called missing.
  check(
    'one that turns up while the page is still busy after the wait is not',
    await undefinedElements(
      ['busy-card'],
      10,
      registry([], { 'busy-card': 40 }),
      () => new Promise((r) => setTimeout(r, 80)),
    ),
    [],
  );
  check(
    'one never installed is still reported once the page is free',
    await undefinedElements(['never-card'], 10, registry([]), () => new Promise((r) => setTimeout(r, 20))),
    ['never-card'],
  );

  // A type that could never name an element - no hyphen, a capital - is missing, said at once.
  const strict = registry(['a-card']);
  check(
    'a name no element can have is missing, not an error thrown',
    [
      await undefinedElements(['mushroomcard'], 5000, strict),
      await undefinedElements(['Button-Card', 'a-card'], 5000, strict),
    ],
    [['mushroomcard'], ['Button-Card']],
  );
  check('and the registry is never asked to wait for it', strict.asked, []);
  check(
    'beside one that may yet load, that one is still waited for',
    await undefinedElements(['nohyphen', 'late-card'], 200, registry([], { 'late-card': 10 })),
    ['nohyphen'],
  );

  /* -------------------------------------------------------------- hearing an element arrive */

  const arriving = registry([], { 'one-card': 10, 'two-card': 30 });
  const heard = [];
  whenElementsDefined(['one-card', 'two-card'], () => heard.push('both'), arriving);
  whenElementsDefined(['one-card'], () => heard.push('one'), arriving);
  const stop = whenElementsDefined(['one-card'], () => heard.push('stopped'), arriving);
  stop();
  whenElementsDefined(['never-card'], () => heard.push('never'), arriving);
  whenElementsDefined(['one-card', 'nohyphen'], () => heard.push('invalid'), arriving);
  await new Promise((resolve) => setTimeout(resolve, 20));
  check('a listener hears once every element it waits for is there', heard, ['one']);
  await new Promise((resolve) => setTimeout(resolve, 30));
  check('one that stopped, one never installed and one that can never be are not told', heard, ['one', 'both']);
  check('however many listen, the registry is asked once per element', arriving.asked.sort(), [
    'never-card',
    'one-card',
    'two-card',
  ]);
  const again = [];
  whenElementsDefined(['one-card'], () => again.push('late'), arriving);
  await new Promise((resolve) => setTimeout(resolve, 5));
  check('one asked about after it arrived is told too', again, ['late']);
  for (let i = 0; i < 50; i += 1) whenElementsDefined(['never-card'], () => undefined, arriving)();
  check('listeners that stopped are let go of', listenersWaiting('never-card', arriving), 1);
})();
