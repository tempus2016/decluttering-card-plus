#!/usr/bin/env node
/*
 * decluttering-card-plus lint - check YAML-mode dashboards from a shell (idea 57).
 *
 *   node bin/dcp-lint.js lint dashboards/rooms.yaml [more files or directories]
 *   node bin/dcp-lint.js lint --format=github dashboards/     annotations for a PR
 *   node bin/dcp-lint.js lint --format=json file.yaml          machine-readable
 *
 * Run from a clone of the repo: the card is not published to npm, so there is no npx.
 *
 * Exit 0 when nothing is an error, 1 when something is, 2 when the command itself could not
 * run (no files, unreadable path). The checks are the template editor's own, built into
 * bin/cli-lint.cjs by rollup; this file only reads files and prints.
 */
const fs = require('fs');
const path = require('path');

const lib = require('./cli-lint.cjs');

const USAGE = `Usage: decluttering-card-plus lint [--format=text|github|json] <file or directory>...

Checks YAML-mode dashboards for the problems the template editor would point out:
placeholders that cannot work, variables declared but never read, cards passing
variables their template never reads, templates that are used nowhere or do not
exist, extends: loops and deprecated templates still in use.

Without Home Assistant it cannot know which entities, areas or labels exist, so a
repeat that will match nothing is not reported. Files brought in with !include are
not followed; the summary says when one was met.

Exit code 1 when anything is an error (a template that does not exist, an extends:
loop); warnings such as a misspelt step are printed with their line and exit 0.
Unreadable files and bad arguments exit 2.`;

/*
 * The .yaml files under a target. A target named on the command line that cannot be read
 * throws, and ends the run; something inside a directory that cannot - a link to nowhere, a
 * folder with no permission - is noted in `unreadable` and the rest of the directory is still read.
 */
function collect(target, out, unreadable, inside = false) {
  let stat;
  let names;
  try {
    stat = fs.statSync(target);
    if (stat.isDirectory()) names = fs.readdirSync(target).sort();
  } catch (err) {
    if (!inside) throw err;
    unreadable.push(`cannot read ${target}: ${err.message}`);
    return;
  }
  if (names) {
    for (const name of names) {
      if (name.startsWith('.')) continue;
      collect(path.join(target, name), out, unreadable, true);
    }
  } else if (/\.ya?ml$/i.test(target)) {
    out.push(target);
  }
}

function main(argv) {
  const args = argv.slice(2);
  if (args[0] === 'lint') args.shift();
  let format = 'text';
  const targets = [];
  for (const arg of args) {
    if (arg === '-h' || arg === '--help') {
      console.log(USAGE);
      return 0;
    }
    if (arg.startsWith('--format=')) {
      format = arg.slice('--format='.length);
      if (!['text', 'github', 'json'].includes(format)) {
        console.error(`unknown format "${format}"; use text, github or json`);
        return 2;
      }
    } else if (arg.startsWith('-')) {
      console.error(`unknown option ${arg}\n\n${USAGE}`);
      return 2;
    } else targets.push(arg);
  }
  if (!targets.length) {
    console.error(USAGE);
    return 2;
  }

  const files = [];
  const unreadable = [];
  for (const target of targets) {
    try {
      collect(target, files, unreadable);
    } catch (err) {
      console.error(`cannot read ${target}: ${err.message}`);
      return 2;
    }
  }
  if (!files.length) {
    unreadable.forEach((line) => console.error(line));
    console.error('no .yaml files found');
    return 2;
  }

  const started = Date.now();
  const findings = [];
  const tagsMet = new Set();
  let checked = 0;
  for (const file of files) {
    let text;
    try {
      text = fs.readFileSync(file, 'utf8');
    } catch (err) {
      unreadable.push(`cannot read ${file}: ${err.message}`);
      continue;
    }
    checked += 1;
    const { findings: found, tags } = lib.lintText(text, file);
    findings.push(...found);
    tags.forEach((tag) => tagsMet.add(tag));
  }

  const out = lib.formatFindings(findings, format);
  if (out) console.log(out);
  if (format !== 'json') {
    console.log(
      (findings.length ? '\n' : '') + lib.summaryLine(lib.summarise(findings, checked), Date.now() - started),
    );
    if (tagsMet.size) console.log(`not followed: ${[...tagsMet].join(', ')} - what they bring in was not checked`);
  }
  // What could not be read is said last, on stderr, and makes the run a 2 whatever else was found.
  unreadable.forEach((line) => console.error(line));
  return unreadable.length ? 2 : lib.exitCodeFor(findings);
}

process.exitCode = main(process.argv);
