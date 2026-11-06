/*
 * Unit tests for src/preview-hold.ts (#407): the edit dialog's preview held back while the
 * card editor has it paused, or while a required variable has no value. Run with `npm test`.
 */
const {
  onPreviewHold,
  previewEditorOpen,
  previewEditorOpened,
  previewPaused,
  previewPauseOn,
  renderPreviewNow,
  requiredUnset,
  resetPreviewHold,
  setPreviewPaused,
} = require('../.test-build/preview-hold.js');
const { check } = require('./check');

resetPreviewHold();
check('a page starts unpaused', [previewPauseOn(), previewPaused(), previewEditorOpen()], [false, false, false]);

setPreviewPaused(true);
check('switched on with no editor open, nothing is held', [previewPauseOn(), previewPaused()], [true, false]);

const heard = [];
onPreviewHold((event) => heard.push(event));
const closeOne = previewEditorOpened();
check('an editor opening applies the pause', previewPaused(), true);
check('and says so', heard, ['changed']);

const closeTwo = previewEditorOpened();
check('a second editor says nothing new', heard, ['changed']);
closeOne();
closeOne();
check('closing one twice counts once, and one is still open', previewPaused(), true);
closeTwo();
check('the last editor closing lets previews go', [previewPaused(), previewPauseOn()], [false, true]);
check('and says so', heard, ['changed', 'changed']);

heard.length = 0;
setPreviewPaused(true);
check('switching to what it already is says nothing', heard, []);
setPreviewPaused(false);
renderPreviewNow();
check('a switch and a render are both heard', heard, ['changed', 'render']);

resetPreviewHold();
const stop = onPreviewHold((event) => heard.push(event));
stop();
heard.length = 0;
setPreviewPaused(true);
check('a listener that stopped hears nothing', heard, []);
resetPreviewHold();

const declarations = [
  { name: 'camera', required: true },
  { name: 'title' },
  { name: 'zone', required: true },
  { name: 'icon', required: false },
];
check('a required variable with no value is named', requiredUnset(declarations, ['camera', 'title']), ['camera']);
check('in the order the template declares them', requiredUnset(declarations, ['zone', 'camera']), ['camera', 'zone']);
check('an optional one without a value is not', requiredUnset(declarations, ['title', 'icon']), []);
check('nothing unset, nothing named', requiredUnset(declarations, []), []);
check('no declarations, nothing named', requiredUnset([], ['camera']), []);
