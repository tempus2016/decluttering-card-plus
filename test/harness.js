/*
 * The check-and-count harness every suite shares. Require it, call check() as many times
 * as you like, and call report() last - it prints the totals and sets the exit code.
 *
 * `log` is bound at load, so a suite that replaces a console method to capture what the
 * code under test writes still gets its own results printed.
 */
const log = console.log.bind(console);

let passed = 0;
let failed = 0;

/**
 * Compares as JSON, which is exactly what these tests are about: the shape and the values,
 * not object identity.
 */
function check(name, actual, expected) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    passed += 1;
    log(`PASS ${name}`);
  } else {
    failed += 1;
    log(`FAIL ${name}\n  got      ${a}\n  expected ${e}`);
  }
}

function report() {
  log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}

module.exports = { check, report };
