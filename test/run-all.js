/*
 * Runs every suite in one process, which is what a coverage tool needs to see them all.
 * `npm test` still runs them separately - a suite that crashes should not take the rest
 * of the output with it - so this only exists for `npm run coverage`.
 */
const path = require('path');

const SUITES = [
  'deep-replace',
  'templates',
  'share',
  'variables',
  'suggest',
  'layout',
  'registry',
  'cycles',
  'library',
];

// Each suite calls report(), which exits the process. Patching it here lets them run one
// after another and still fail the run if any check failed.
const harness = require('./harness');
let failures = 0;
const realExit = process.exit.bind(process);
process.exit = (code) => {
  if (code) failures += 1;
};

for (const suite of SUITES) {
  require(path.join(__dirname, `${suite}.test.js`));
}

// The borrowing checks in templates.test.js settle asynchronously.
setTimeout(() => {
  process.exit = realExit;
  realExit(failures ? 1 : 0);
}, 2000);

void harness;
