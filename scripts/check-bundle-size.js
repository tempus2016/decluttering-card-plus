#!/usr/bin/env node
/*
 * The bundle budget (idea 12). What a dashboard downloads before the first card builds is the
 * entry file plus every chunk it imports statically (the `core` chunk, idea 4); that total is
 * recorded in scripts/bundle-size.json, and a build that comes out more than BUDGET_PERCENT
 * larger than the record fails, so growth is a decision somebody makes rather than something
 * nobody notices. The editors and the languages load later and are not counted.
 *
 *   node scripts/check-bundle-size.js            compare, exit 1 when over budget
 *   node scripts/check-bundle-size.js --record   write the current size as the new record
 *
 * Record deliberately, in the pull request that grows the bundle, and say why in its body.
 */
const fs = require('fs');
const path = require('path');

const BUDGET_PERCENT = 5;
const DIST = path.join(__dirname, '..', 'dist');
const ENTRY = 'decluttering-card-plus.js';
const RECORD = path.join(__dirname, 'bundle-size.json');

/** The entry and the chunks it reaches through static imports, each counted once. */
function staticFiles(name, seen = new Map()) {
  if (seen.has(name)) return seen;
  const file = path.join(DIST, name);
  seen.set(name, fs.statSync(file).size);
  const code = fs.readFileSync(file, 'utf8');
  // `from"./x.js"` and bare `import"./x.js"`; a dynamic `import("./x.js")` is not counted.
  for (const match of code.matchAll(/(?:from|import)\s*"\.\/([^"]+\.js)"/g)) staticFiles(match[1], seen);
  return seen;
}

const files = staticFiles(ENTRY);
const size = [...files.values()].reduce((sum, bytes) => sum + bytes, 0);
const listing = [...files].map(([name, bytes]) => `${name} ${bytes}`).join(', ');

if (process.argv.includes('--record')) {
  fs.writeFileSync(
    RECORD,
    JSON.stringify({ bytes: size, recorded: new Date().toISOString().slice(0, 10) }, null, 2) + '\n',
  );
  console.log(`bundle size recorded: ${size} bytes (${listing})`);
  process.exit(0);
}

const record = JSON.parse(fs.readFileSync(RECORD, 'utf8'));
const limit = Math.floor(record.bytes * (1 + BUDGET_PERCENT / 100));
const change = (((size - record.bytes) / record.bytes) * 100).toFixed(2);
if (size > limit) {
  console.error(
    `bundle is ${size} bytes (${listing}), ${change}% over the ${record.bytes} recorded on ${record.recorded}; ` +
      `the budget is ${BUDGET_PERCENT}% (${limit} bytes). ` +
      'If the growth is meant, run `node scripts/check-bundle-size.js --record` and commit scripts/bundle-size.json.',
  );
  process.exit(1);
}
console.log(
  `bundle size ${size} bytes (${listing}; ${change >= 0 ? '+' : ''}${change}% against the record, budget ${BUDGET_PERCENT}%)`,
);
