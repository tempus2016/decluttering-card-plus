/*
 * Unit tests for usesLabels (#456): only a template that shows labels waits for the label
 * registry, not one that merely has a `label:` option of its own. Run with `npm test`.
 */
const { check } = require('./check.js');
const { usesLabels } = require('../.test-build/variables.js');

check('a |labels step counts', usesLabels({ card: { type: 'markdown', content: '[[entity|labels]]' } }), true);
check(
  'a label: option does not',
  usesLabels({
    card: { type: 'custom:camera', menu: { buttons: { a: { label: 'Snapshot' } } }, name: '[[entity|name]]' },
  }),
  false,
);
check('another step does not', usesLabels({ card: { type: 'tile', name: '[[entity|area]]' } }), false);
check(
  'a |labels step in an item template the card reaches counts',
  usesLabels(
    { card: { type: 'vertical-stack', cards: '[[row|with:rows]]' } },
    { row: { item: { type: 'markdown', content: '[[item|labels]]' } } },
  ),
  true,
);
