#!/usr/bin/env node
/*
 * Empties dist/ of built files before a build. The editors' chunk carries a content hash in
 * its name (idea 4), so without this a build after a change would leave the previous chunk
 * behind as a stale file that the CI dist check then complains about.
 */
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
if (fs.existsSync(DIST)) {
  for (const name of fs.readdirSync(DIST)) {
    if (/\.js(\.map)?$/.test(name)) fs.unlinkSync(path.join(DIST, name));
  }
}
