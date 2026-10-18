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
  'localize',
  'trace',
  'community',
  'examples',
  'on-error',
  'rebuild',
  'diff',
  'lint',
  'unread',
  'undo',
  'rename-variable',
  'similar',
  'search',
  'report',
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

/*
 * These settle on promises of their own, so they cannot share the process with the
 * patched exit above. Each runs as a child instead - c8 follows child processes, so what
 * they reach still counts - and a failure in one fails the run like any other.
 */
const ASYNC_SUITES = ['labels', 'categories', 'template-source'];
const { spawnSync } = require('child_process');
for (const suite of ASYNC_SUITES) {
  const run = spawnSync(process.execPath, [path.join(__dirname, `${suite}.test.js`)], { stdio: 'inherit' });
  if (run.status) failures += 1;
}

// The borrowing checks in templates.test.js settle asynchronously.
setTimeout(() => {
  process.exit = realExit;
  realExit(failures ? 1 : 0);
}, 2000);

void harness;
