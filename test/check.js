/*
 * One assertion, as a node:test test. The suites are written as straight-line scripts that
 * run the code under test and compare what came back, so `actual` and `expected` are
 * evaluated when check() is called - exactly when the old harness stringified them - and
 * only the comparison runs inside the test. The JSON round trip keeps the old semantics:
 * shape and values, not identity, and `undefined` properties do not count.
 *
 * Run a suite with `node --test test/<name>.test.js`, or all of them with `npm test`.
 */
const test = require('node:test');
const assert = require('node:assert/strict');

const snapshot = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)));

function check(name, actual, expected) {
  const got = snapshot(actual);
  const want = snapshot(expected);
  test(name, () => assert.deepEqual(got, want));
}

module.exports = { check };
