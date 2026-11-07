/*
 * Unit tests for src/idle.ts (idea 10): when a card's first build may wait for idle time,
 * and how the wait is scheduled where requestIdleCallback is missing.
 */
const {
  shouldDefer,
  whenIdle,
  whenVisible,
  isNearScreen,
  measureNearScreen,
  IDLE_TIMEOUT_MS,
  PLACEMENT_FRAMES,
} = require('../.test-build/idle.js');
const { check } = require('./check');

const plain = { type: 'custom:decluttering-card-plus', template: 'tile' };
const open = { inDialog: false, preview: false, builtBefore: false, group: false, canObserve: true };

check('a fresh card on a page may wait', shouldDefer(plain, open), true);
check('not in the edit dialog', shouldDefer(plain, { ...open, inDialog: true }), false);
check('not as a preview', shouldDefer(plain, { ...open, preview: true }), false);
check('not once it has built before', shouldDefer(plain, { ...open, builtBefore: true }), false);
check('not a group', shouldDefer(plain, { ...open, group: true }), false);
check('not where the page cannot say what is on screen', shouldDefer(plain, { ...open, canObserve: false }), false);
check('not with debug on', shouldDefer({ ...plain, debug: true }, open), false);
check('nor debug yaml', shouldDefer({ ...plain, debug: 'yaml' }, open), false);
check('nor the report', shouldDefer({ ...plain, debug: 'report' }, open), false);
check('debug false is off', shouldDefer({ ...plain, debug: false }, open), true);
check('the longest wait is two seconds', IDLE_TIMEOUT_MS, 2000);

// Node has no requestIdleCallback, so the timer stands in - and can be cancelled.
const test = require('node:test');
test('whenIdle runs the function soon where requestIdleCallback is missing', (t, done) => {
  whenIdle(() => done());
});
test('whenIdle can be cancelled', (t, done) => {
  let ran = false;
  const cancel = whenIdle(() => {
    ran = true;
  });
  cancel();
  setTimeout(() => {
    if (ran) done(new Error('ran after cancel'));
    else done();
  }, 20);
});
test('whenIdle uses requestIdleCallback when there is one', () => {
  const calls = [];
  globalThis.requestIdleCallback = (fn, options) => {
    calls.push(options);
    fn();
    return 7;
  };
  globalThis.cancelIdleCallback = (id) => calls.push(`cancel ${id}`);
  let ran = false;
  const cancel = whenIdle(() => {
    ran = true;
  }, 500);
  cancel();
  delete globalThis.requestIdleCallback;
  delete globalThis.cancelIdleCallback;
  if (!ran) throw new Error('did not run');
  if (JSON.stringify(calls) !== JSON.stringify([{ timeout: 500 }, 'cancel 7'])) throw new Error(JSON.stringify(calls));
});
test('whenVisible says visible at once where there is no requestAnimationFrame', () => {
  let told;
  whenVisible({}, (visible) => {
    told = visible;
  });
  if (told !== true) throw new Error(String(told));
});

// isNearScreen measures the element, or its cell when the element has no height yet.
const box = (top, height, parentElement) => ({
  getBoundingClientRect: () => ({ top, bottom: top + height, height }),
  parentElement,
});
test('isNearScreen', () => {
  globalThis.innerHeight = 500;
  if (!isNearScreen(box(100, 56))) throw new Error('on screen');
  if (!isNearScreen(box(900, 56))) throw new Error('within a screen below');
  if (isNearScreen(box(1100, 56))) throw new Error('two screens down is far');
  if (isNearScreen(box(-700, 56))) throw new Error('more than a screen above is far');
  if (isNearScreen(box(1800, 0, box(1800, 64)))) throw new Error('an empty card is measured by its cell');
  if (!isNearScreen(box(300, 0, box(300, 64)))) throw new Error('an empty card in a visible cell is near');
  if (!isNearScreen(box(0, 0))) throw new Error('nothing measurable counts as near');
  if (measureNearScreen(box(0, 0)) !== undefined) throw new Error('but measured, it is not placed yet');
  if (measureNearScreen(box(300, 0, box(300, 64))) !== true) throw new Error('a placed empty card measures');
  delete globalThis.innerHeight;
});

// A masonry view sizes its cards before it places them: an unplaced card is measured again
// frame by frame, and told where it is once it has a place - never 'visible' for having none.
test('whenVisible waits for an unplaced card to be placed', () => {
  globalThis.innerHeight = 500;
  const frames = [];
  globalThis.requestAnimationFrame = (fn) => frames.push(fn);
  const element = box(0, 0);
  let told;
  whenVisible(element, (visible) => {
    told = visible;
  });
  // Two settling frames, then a measurement that finds nothing placed.
  frames.shift()();
  frames.shift()();
  if (told !== undefined) throw new Error('told before being placed');
  // Placed two frames later, far down the page.
  frames.shift()();
  element.getBoundingClientRect = () => ({ top: 1800, bottom: 1856, height: 56 });
  frames.shift()();
  if (told !== false) throw new Error('a card placed far down is not near: ' + told);
  if (frames.length) throw new Error('stops measuring once told');
  delete globalThis.requestAnimationFrame;
  delete globalThis.innerHeight;
});

test('whenVisible builds a card that never gets a place, after a bounded wait', () => {
  globalThis.innerHeight = 500;
  const frames = [];
  globalThis.requestAnimationFrame = (fn) => frames.push(fn);
  let told;
  whenVisible(box(0, 0), (visible) => {
    told = visible;
  });
  let ran = 0;
  while (frames.length) {
    frames.shift()();
    ran += 1;
  }
  if (told !== true) throw new Error('never built: ' + told);
  if (ran !== 2 + PLACEMENT_FRAMES) throw new Error('frames used: ' + ran);
  delete globalThis.requestAnimationFrame;
  delete globalThis.innerHeight;
});
