#!/usr/bin/env node
/*
 * Which packages a pull request's package-lock.json changes outside the trees of the packages
 * it says it bumps. The Dependabot auto-merge reads this: a bump of c8 may re-resolve c8's own
 * node_modules, but if it also moves a copy of semver that eslint, rollup and semantic-release
 * load, a person looks first.
 *
 *   node scripts/lockfile-changes.js <base package-lock.json> <head package-lock.json> <names>
 *
 * `names` is the comma-separated list Dependabot gives. Prints one path per line for every
 * package entry added, removed or changed anywhere else, and nothing when there is none.
 * Exits 0 either way, 2 when a lockfile cannot be read.
 *
 * Both files are parsed and compared entry by entry. Reading the diff instead missed every
 * package whose version changed in place: its `"node_modules/x": {` line is then context, not
 * a changed line (review 2026-11-27).
 */
const fs = require('fs');

// What makes an entry the same package as before. `dev`, `peer` and the like are bookkeeping
// that moves when another package's needs change; the code installed does not.
const IDENTITY = ['version', 'resolved', 'integrity'];

function packagesOf(lock) {
  const packages = lock && typeof lock === 'object' ? lock.packages : undefined;
  return packages && typeof packages === 'object' ? packages : {};
}

/** Whether a lockfile path is the named package or something installed under it. */
function inTreeOf(lockPath, name) {
  const own = `node_modules/${name}`;
  return lockPath === own || lockPath.startsWith(`${own}/`);
}

/** Every package path that differs between two parsed lockfiles, sorted. The root entry is package.json's, not a package. */
function changedPaths(base, head) {
  const before = packagesOf(base);
  const after = packagesOf(head);
  const changed = [];
  for (const lockPath of new Set([...Object.keys(before), ...Object.keys(after)])) {
    if (lockPath === '') continue;
    const was = before[lockPath];
    const is = after[lockPath];
    if (!was || !is || IDENTITY.some((key) => was[key] !== is[key])) changed.push(lockPath);
  }
  return changed.sort();
}

/** The changed paths that are not in the tree of any named package. */
function changedOutside(base, head, names) {
  const wanted = names.map((name) => name.trim()).filter(Boolean);
  return changedPaths(base, head).filter((lockPath) => !wanted.some((name) => inTreeOf(lockPath, name)));
}

function main(argv) {
  const [basePath, headPath, names = ''] = argv.slice(2);
  if (!basePath || !headPath) {
    console.error('usage: lockfile-changes.js <base package-lock.json> <head package-lock.json> <names>');
    return 2;
  }
  let base;
  let head;
  try {
    base = JSON.parse(fs.readFileSync(basePath, 'utf8'));
    head = JSON.parse(fs.readFileSync(headPath, 'utf8'));
  } catch (err) {
    console.error(`cannot read a lockfile: ${err.message}`);
    return 2;
  }
  const outside = changedOutside(base, head, names.split(','));
  if (outside.length) console.log(outside.join('\n'));
  return 0;
}

if (require.main === module) process.exitCode = main(process.argv);

module.exports = { changedPaths, changedOutside };
