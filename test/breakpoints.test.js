/*
 * Unit tests for src/breakpoints.ts (idea 42): variables that only apply when the card is narrow.
 */
const {
  hasMobileVariables,
  mobileThreshold,
  isMobileWidth,
  withMobileVariables,
  isMobileViewport,
  MOBILE_VIEWPORT_QUERY,
} = require('../.test-build/breakpoints.js');

const { check } = require('./check');

const card = {
  template: 't',
  variables: [{ columns: 3 }, { label: '[[area]] lights' }],
  variables_mobile: [{ columns: 2 }, { label: '[[area]]' }],
};

check(
  'the screen decides unless the card names a width of its own',
  [mobileThreshold({}), mobileThreshold({ mobile_below: 480 })],
  [undefined, 480],
);
check(
  'a threshold that is not a usable number leaves it to the screen',
  [mobileThreshold({ mobile_below: 'wide' }), mobileThreshold({ mobile_below: -5 })],
  [undefined, undefined],
);
check("the screen's narrow query is Home Assistant's own", MOBILE_VIEWPORT_QUERY, '(max-width: 870px)');
check('with nothing to ask, the screen is never narrow', isMobileViewport(), false);
{
  const before = globalThis.matchMedia;
  globalThis.matchMedia = (query) => ({ matches: query === '(max-width: 870px)' });
  check('a narrow screen is read through matchMedia', isMobileViewport(), true);
  globalThis.matchMedia = before;
}
check(
  'narrow is strictly below the threshold; unmeasured is the desktop',
  [isMobileWidth(380, 600), isMobileWidth(600, 600), isMobileWidth(0, 600), isMobileWidth(NaN, 600)],
  [true, false, false, false],
);
check(
  'a card with mobile values, and one without',
  [hasMobileVariables(card), hasMobileVariables({ variables: [] })],
  [true, false],
);

check(
  'on a wide card the mobile keys come out and the variables are the card’s own',
  withMobileVariables(card, false),
  {
    template: 't',
    variables: [{ columns: 3 }, { label: '[[area]] lights' }],
  },
);
check('on a narrow card the mobile values go in front, so they win', withMobileVariables(card, true), {
  template: 't',
  variables: [{ columns: 2 }, { label: '[[area]]' }, { columns: 3 }, { label: '[[area]] lights' }],
});
check(
  'a mapping is read like a list, for both',
  withMobileVariables({ variables: { a: 1, b: 2 }, variables_mobile: { a: 9 }, mobile_below: 500 }, true),
  { variables: [{ a: 9 }, { a: 1 }, { b: 2 }] },
);
check('a card with no mobile keys is handed back untouched', withMobileVariables({ template: 't' }, true), {
  template: 't',
});
