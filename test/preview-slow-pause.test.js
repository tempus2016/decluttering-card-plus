/*
 * Unit tests for the slow-build pause in src/preview-hold.ts (#456): a preview build that
 * takes SLOW_PREVIEW_MS or longer, with a card editor open, switches the pause on by itself
 * and remembers how long it took, until someone resumes or pauses by hand.
 * Run with `npm test`.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  notePreviewBuild,
  onPreviewHold,
  previewEditorOpened,
  previewPauseOn,
  previewSlowPause,
  resetPreviewHold,
  setPreviewPaused,
  SLOW_PREVIEW_MS,
} = require('../.test-build/preview-hold.js');
const { check } = require('./check');

check('the threshold is a second and a half (#456)', SLOW_PREVIEW_MS, 1500);

resetPreviewHold();
notePreviewBuild(5000);
check(
  'with no card editor open a slow build pauses nothing (#456)',
  [previewPauseOn(), previewSlowPause()],
  [false, undefined],
);

resetPreviewHold();
let close = previewEditorOpened();
notePreviewBuild(SLOW_PREVIEW_MS - 1);
check('a build under the threshold pauses nothing (#456)', previewPauseOn(), false);
notePreviewBuild(NaN);
check('a build with no usable time pauses nothing (#456)', previewPauseOn(), false);

notePreviewBuild(2817.6);
check(
  'a slow build with an editor open pauses the preview (#456)',
  [previewPauseOn(), previewSlowPause()],
  [true, 2818],
);
notePreviewBuild(9000);
check('a second slow build keeps the first one as the reason (#456)', previewSlowPause(), 2818);

setPreviewPaused(false);
check('resuming clears the reason (#456)', [previewPauseOn(), previewSlowPause()], [false, undefined]);
setPreviewPaused(true);
check('pausing by hand gives no slow reason (#456)', previewSlowPause(), undefined);
notePreviewBuild(9000);
check('a slow build while paused by hand changes nothing (#456)', previewSlowPause(), undefined);
close();

test('the pause is told after the build, not during it (#456)', async () => {
  resetPreviewHold();
  const heard = [];
  onPreviewHold((event) => heard.push(event));
  const closeEditor = previewEditorOpened();
  notePreviewBuild(2000);
  assert.deepEqual(heard, []);
  await Promise.resolve();
  assert.deepEqual(heard, ['changed']);
  closeEditor();
  resetPreviewHold();
});
