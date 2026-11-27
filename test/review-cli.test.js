/*
 * The command-line linter after the 2026-11-27 review: shapes it used to throw on, tags that
 * are only mentioned, and what it does about files it cannot read.
 * Run with `npm test`.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('child_process');
const cli = require('../.test-build/cli-lint.js');
const { checkDashboard } = require('../.test-build/templates.js');

const { check } = require('./check');

console.warn = () => {};

const levels = (text) => cli.lintText(text, 't.yaml').findings.map((finding) => `${finding.level} ${finding.path}`);

check('views that are not a list are one error, not a throw', levels('views: 3\n'), ['error views']);
check('as text too', levels('views: "x"\n'), ['error views']);
check(
  'a template written as text is an error with its line',
  cli
    .lintText('decluttering_templates:\n  a: str\n', 't.yaml')
    .findings.map((f) => [f.level, f.line, f.path])
    .slice(0, 1),
  [['error', 2, 'a']],
);
check('and so is one written as a list', levels('decluttering_templates:\n  a: [1]\n').includes('error a'), true);
check('an empty template is still only unused', levels('decluttering_templates:\n  a:\n'), ['warning a']);
check(
  'the exit code for either is 1',
  [
    cli.exitCodeFor(cli.lintText('views: 3\n', 't').findings),
    cli.exitCodeFor(cli.lintText('decluttering_templates:\n  a: str\n', 't').findings),
  ],
  [1, 1],
);
check(
  'the health check reads a text template without throwing',
  checkDashboard({ decluttering_templates: { a: 'str' }, views: [] }).unusedTemplates,
  ['a'],
);
check('and views that are not a list', checkDashboard({ decluttering_templates: {}, views: 3 }).missingTemplates, []);

const UNUSED = 'decluttering_templates:\n  unused_one:\n    card: {type: tile}\nviews: []\n';
check('a tag in a comment is not a tag met', cli.lintText(`# see !include docs\n${UNUSED}`, 't').tags, []);
check('so the unused template is still said', levels(`# see !include docs\n${UNUSED}`), ['warning unused_one']);
check('nor is one inside text', cli.lintText(`title: "use !secret here"\n${UNUSED}`, 't').tags, []);
check('a real one is', cli.lintText(`title: !secret name\n${UNUSED}`, 't').tags, ['!secret']);
check('and holds back what cannot be known', levels(`title: !secret name\n${UNUSED}`), []);
check(
  'each kind once, in the listed order',
  cli.lintText('a: !secret x\nb: !include y.yaml\nc: !secret z\n', 't').tags,
  ['!include', '!secret'],
);
check('one parse does not leak into the next', cli.lintText(UNUSED, 't').tags, []);

/* ------------------------------------------------------------------ the executable */

const dcp = path.join(__dirname, '..', 'bin', 'dcp-lint.js');
const built = fs.existsSync(path.join(__dirname, '..', 'bin', 'cli-lint.cjs'));
const run = (...args) => spawnSync(process.execPath, [dcp, ...args], { encoding: 'utf8' });
const OK =
  'decluttering_templates:\n  t:\n    card: {type: markdown, content: hi}\nviews:\n  - cards:\n      - {type: "custom:decluttering-card-plus", template: t}\n';

test(
  'a file that cannot be read is said, the rest are checked, and the run is a 2',
  { skip: built ? false : 'not built' },
  () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dcp-lint-'));
    try {
      fs.writeFileSync(path.join(dir, 'ok.yaml'), OK);
      fs.symlinkSync(path.join(dir, 'nowhere'), path.join(dir, 'dangling.yaml'));
      const linked = run(dir);
      assert.equal(linked.status, 2);
      assert.match(linked.stderr, /cannot read .*dangling\.yaml/);
      assert.match(linked.stdout, /0 errors, 0 warnings, 0 info in 1 file/);
      assert.doesNotMatch(linked.stderr, /\n\s+at /);
      fs.unlinkSync(path.join(dir, 'dangling.yaml'));

      const locked = path.join(dir, 'locked.yaml');
      fs.writeFileSync(locked, OK);
      fs.chmodSync(locked, 0o000);
      let readable = true;
      try {
        fs.readFileSync(locked);
      } catch {
        readable = false;
      }
      // Root reads anything; there the case cannot be made.
      if (!readable) {
        const denied = run(dir);
        assert.equal(denied.status, 2);
        assert.match(denied.stderr, /cannot read .*locked\.yaml/);
        assert.match(denied.stdout, /in 1 file/);
        assert.doesNotMatch(denied.stderr, /\n\s+at /);
      }
      fs.chmodSync(locked, 0o644);
      fs.unlinkSync(locked);
      assert.equal(run(dir).status, 0);
      assert.equal(run(path.join(dir, 'missing.yaml')).status, 2);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  },
);
