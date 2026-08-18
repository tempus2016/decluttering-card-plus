#!/usr/bin/env node
/*
 * Prints the hand-written notes for a release, if there are any.
 *
 * semantic-release concatenates the output of every generateNotes plugin, so whatever this
 * prints is appended to the list the commit analyser produces. That list is only as good as
 * the commit subjects behind it — squash merges with prose titles produce almost nothing —
 * so this is where a release gets an actual description.
 *
 * Silent when docs/release-notes/<version>.md does not exist, which leaves the generated
 * notes standing on their own.
 *
 * Nothing unreleased lives in this repository. A notes file is added as part of the release
 * itself, not merged to main ahead of time - a draft on the default branch is a public
 * announcement of a version that does not exist yet.
 */
const fs = require('fs');
const path = require('path');

const version = process.argv[2];
if (!version) process.exit(0);

const file = path.join(__dirname, '..', 'docs', 'release-notes', `${version}.md`);
if (!fs.existsSync(file)) process.exit(0);

process.stdout.write(`${fs.readFileSync(file, 'utf8').trim()}\n`);
