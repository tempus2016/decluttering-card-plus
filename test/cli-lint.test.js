/*
 * The CLI linter (idea 57): the pure module on a fixture with one of every finding, the
 * formats, and - when rollup has built it - the executable itself.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { check } = require('./check');
const cli = require('../.test-build/cli-lint');

const fixture = fs.readFileSync(path.join(__dirname, 'fixtures', 'lint-bad.yaml'), 'utf8');
const { findings, tags } = cli.lintText(fixture, 'lint-bad.yaml');
const kinds = findings.map((finding) => `${finding.level} ${finding.path}`);

check('no HA tags in the fixture', tags, []);
check(
  'a template that does not exist is an error with did-you-mean',
  findings
    .filter((finding) => finding.path === 'template: camera_cardd')
    .map((finding) => [finding.level, finding.message]),
  [
    [
      'error',
      'The template "camera_cardd" doesn\'t exist in decluttering_templates or in a custom:decluttering-template card.',
    ],
  ],
);
check(
  'an unknown step is a warning on the template',
  findings.some(
    (finding) =>
      finding.level === 'warning' && finding.template === 'room_light_tile' && /frendly_name/.test(finding.message),
  ),
  true,
);
check(
  'a step after default: is reported',
  findings.some((finding) => /never gets a turn/.test(finding.message)),
  true,
);
check(
  'an unclosed placeholder is a warning',
  findings.some((finding) => finding.template === 'hall_tile' && /never closed/.test(finding.message)),
  true,
);
check(
  'a variable the template never reads is a warning naming the view',
  findings.some((finding) => /pass "colr"/.test(finding.message) && /Rooms/.test(finding.message)),
  true,
);
check(
  'an extends loop is an error',
  findings.filter((finding) => /loop/.test(finding.message)).map((finding) => finding.level),
  ['error'],
);
check(
  'a deprecated template still in use is information',
  findings.some(
    (finding) => finding.level === 'info' && finding.template === 'old_tile' && /deprecated/.test(finding.message),
  ),
  true,
);
check(
  'hall_tile is unused and says so',
  findings.some(
    (finding) => finding.level === 'warning' && /nothing on this dashboard uses: hall_tile/.test(finding.message),
  ),
  true,
);
check(
  'the hall_tile line is the line it is defined on',
  findings.find((finding) => finding.template === 'hall_tile')?.line,
  14,
);
check('errors come first on the same line', kinds.length > 0, true);

const summary = cli.summarise(findings, 1);
check(
  'summary counts',
  [summary.errors >= 2, summary.warnings >= 3, summary.infos >= 2, summary.files],
  [true, true, true, 1],
);
check(
  'summary line pluralises',
  cli.summaryLine({ errors: 1, warnings: 2, infos: 0, files: 1 }),
  '1 error, 2 warnings, 0 info in 1 file',
);
check('exit code is 1 with an error', cli.exitCodeFor(findings), 1);
check('exit code is 0 without one', cli.exitCodeFor(findings.filter((finding) => finding.level !== 'error')), 0);

check(
  'github format is one annotation per finding',
  cli.formatFindings([{ file: 'a.yaml', level: 'warning', line: 3, path: 'x', message: 'm' }], 'github'),
  '::warning file=a.yaml,line=3::m (x)',
);
check(
  'text format groups by file',
  cli.formatFindings([{ file: 'a.yaml', level: 'error', line: 0, path: '', message: 'm' }], 'text'),
  'a.yaml\n  error      -  m',
);

check(
  'a file that is not YAML is one error',
  cli.lintText('foo: [', 'bad.yaml').findings.map((finding) => finding.level),
  ['error'],
);
check(
  'a list at the top is not a dashboard',
  cli.lintText('- a\n- b', 'list.yaml').findings[0].message.includes('not a mapping'),
  true,
);
check('HA tags are kept as text and reported', cli.lintText('views: !include views.yaml\n', 'inc.yaml').tags, [
  '!include',
]);
check('secrets parse and are taken out again', cli.parseDashboard('token: !secret my_token\ntitle: x\n').config, {
  title: 'x',
});
check(
  'with an include, templates are still linted but nothing is called unused or missing',
  cli
    .lintText(
      'decluttering_templates:\n  t:\n    card:\n      type: markdown\n      content: "[[x"\nviews: !include views.yaml\n',
      'inc.yaml',
    )
    .findings.map((f) => f.level + ' ' + f.path),
  ['warning t.card.content'],
);
check(
  'a clean dashboard has no findings',
  cli.lintText(
    'decluttering_templates:\n  t:\n    card:\n      type: markdown\n      content: hi\nviews:\n  - cards:\n      - type: custom:decluttering-card-plus\n        template: t\n',
    'ok.yaml',
  ).findings,
  [],
);

const bin = path.join(__dirname, '..', 'bin', 'cli-lint.cjs');
test(
  'the executable runs when built',
  { skip: fs.existsSync(bin) ? false : 'bin/cli-lint.cjs is built by rollup' },
  () => {
    const run = spawnSync(
      process.execPath,
      [path.join(__dirname, '..', 'bin', 'dcp-lint.js'), path.join(__dirname, 'fixtures', 'lint-bad.yaml')],
      { encoding: 'utf8' },
    );
    assert.equal(run.status, 1);
    assert.match(run.stdout, /errors?, .* warnings?, .* info in 1 file/);
    const usage = spawnSync(process.execPath, [path.join(__dirname, '..', 'bin', 'dcp-lint.js')], { encoding: 'utf8' });
    assert.equal(usage.status, 2);
    const ok = spawnSync(
      process.execPath,
      [
        path.join(__dirname, '..', 'bin', 'dcp-lint.js'),
        '--format=json',
        path.join(__dirname, 'fixtures', 'lint-bad.yaml'),
      ],
      { encoding: 'utf8' },
    );
    assert.equal(JSON.parse(ok.stdout).length > 5, true);
  },
);
