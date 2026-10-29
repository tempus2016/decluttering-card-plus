/*
 * Idea 19: the live result preview. Pure parts.
 */
const { check } = require('./check');
const { previewModes, previewLines, buildTime } = require('../.test-build/card-editor/result-preview');

check('a card can be drawn or read', previewModes('card'), ['rendered', 'yaml']);
check('a row is YAML only', previewModes('row'), ['yaml']);
check('the first build marks nothing', previewLines(undefined, 'type: tile\nname: Kitchen\n'), [
  { text: 'type: tile', changed: false },
  { text: 'name: Kitchen', changed: false },
]);
check('the line the edit changed is marked', previewLines('type: tile\nname: Kitchen\n', 'type: tile\nname: Hall\n'), [
  { text: 'type: tile', changed: false },
  { text: 'name: Hall', changed: true },
]);
check('an empty build has no lines', previewLines('a: 1', ''), []);
check('a build time reads in milliseconds', buildTime(100, 104.4), '4 ms');
check('a fast build is under a millisecond', buildTime(100, 100.2), '<1 ms');
