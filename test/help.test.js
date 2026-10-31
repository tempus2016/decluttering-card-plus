/*
 * Unit tests for src/help.ts - field-level help from the docs site (idea 61).
 * Run with `npm test`.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const { parseHelpIndex, helpUrl, helpFor, resetHelpIndex, DOCS_SITE } = require('../.test-build/help.js');

const { check } = require('./check');

check(
  'a setting links to its page, an unknown one to the reference',
  [helpUrl('for_each_from'), helpUrl('nope')],
  [`${DOCS_SITE}Repeating-a-Template.html`, `${DOCS_SITE}Configuration-Reference.html`],
);

check(
  'only well-formed entries on the docs site are kept',
  parseHelpIndex({
    good: { page: 'P', heading: 'H', text: 'T', yaml: 'a: 1', url: `${DOCS_SITE}P.html#h` },
    noText: { page: 'P', url: `${DOCS_SITE}P.html` },
    elsewhere: { page: 'P', text: 'T', url: 'https://evil.example/P.html' },
    notAnObject: 'x',
  }),
  { good: { key: 'good', page: 'P', heading: 'H', text: 'T', yaml: 'a: 1', url: `${DOCS_SITE}P.html#h` } },
);
check('garbage in gives an empty index', [parseHelpIndex(null), parseHelpIndex('x')], [{}, {}]);

test('helpFor fetches the index once and answers from it', async () => {
  resetHelpIndex();
  let calls = 0;
  const fetcher = async () => {
    calls += 1;
    return {
      ok: true,
      json: async () => ({
        gap: { page: 'Styling', heading: 'Gap', text: 'Space between copies.', url: `${DOCS_SITE}Styling.html#gap` },
      }),
    };
  };
  const first = await helpFor('gap', fetcher);
  const second = await helpFor('gap', fetcher);
  const missing = await helpFor('nope', fetcher);
  assert.equal(first.text, 'Space between copies.');
  assert.deepEqual(second, first);
  assert.equal(missing, undefined);
  assert.equal(calls, 1);
});

test('a failed fetch leaves an empty index rather than throwing', async () => {
  resetHelpIndex();
  const fetcher = async () => {
    throw new Error('offline');
  };
  assert.equal(await helpFor('gap', fetcher), undefined);
  resetHelpIndex();
});
