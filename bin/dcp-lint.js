#!/usr/bin/env node
/*
 * decluttering-card-plus lint - check YAML-mode dashboards from a shell (idea 57).
 *
 *   npx decluttering-card-plus lint dashboards/rooms.yaml [more files or directories]
 *   npx decluttering-card-plus lint --format=github dashboards/     annotations for a PR
 *   npx decluttering-card-plus lint --format=json file.yaml          machine-readable
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

function collect(target, out) {
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(target).sort()) {
      if (name.startsWith('.')) continue;
      collect(path.join(target, name), out);
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
  for (const target of targets) {
    try {
      collect(target, files);
    } catch (err) {
      console.error(`cannot read ${target}: ${err.message}`);
      return 2;
    }
  }
  if (!files.length) {
    console.error('no .yaml files found');
    return 2;
  }

  const started = Date.now();
  const findings = [];
  const tagsMet = new Set();
  for (const file of files) {
    const { findings: found, tags } = lib.lintText(fs.readFileSync(file, 'utf8'), file);
    findings.push(...found);
    tags.forEach((tag) => tagsMet.add(tag));
  }

  const out = lib.formatFindings(findings, format);
  if (out) console.log(out);
  if (format !== 'json') {
    console.log(
      (findings.length ? '\n' : '') + lib.summaryLine(lib.summarise(findings, files.length), Date.now() - started),
    );
    if (tagsMet.size) console.log(`not followed: ${[...tagsMet].join(', ')} - what they bring in was not checked`);
  }
  return lib.exitCodeFor(findings);
}

process.exitCode = main(process.argv);
