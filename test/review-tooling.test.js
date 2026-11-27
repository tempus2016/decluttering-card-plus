/*
 * Build tooling after the 2026-11-27 review: the lockfile comparison the Dependabot auto-merge
 * reads, and the lists that decide what merges without a person.
 * Run with `npm test`.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { changedPaths, changedOutside } = require('../scripts/lockfile-changes.js');

const { check } = require('./check');

const entry = (version) => ({
  version,
  resolved: `https://registry.npmjs.org/x/-/x-${version}.tgz`,
  integrity: `sha512-${version}`,
  dev: true,
});
const lock = (packages) => ({
  lockfileVersion: 3,
  packages: { '': { name: 'root', devDependencies: {} }, ...packages },
});

const base = lock({
  'node_modules/c8': entry('12.0.0'),
  'node_modules/c8/node_modules/yargs': entry('17.0.0'),
  'node_modules/semver': entry('7.6.0'),
  'node_modules/c8-reporter': entry('1.0.0'),
  'node_modules/gone': entry('1.0.0'),
  'node_modules/@scope/pkg': entry('1.0.0'),
});
const head = lock({
  'node_modules/c8': entry('12.1.0'),
  'node_modules/c8/node_modules/yargs': entry('17.1.0'),
  'node_modules/semver': entry('7.6.3'),
  'node_modules/c8-reporter': entry('1.0.1'),
  'node_modules/brand-new': entry('1.0.0'),
  'node_modules/@scope/pkg': { ...entry('1.0.0'), dev: false },
});

check('every entry that moved is seen, a version changed in place included', changedPaths(base, head), [
  'node_modules/brand-new',
  'node_modules/c8',
  'node_modules/c8-reporter',
  'node_modules/c8/node_modules/yargs',
  'node_modules/gone',
  'node_modules/semver',
]);
check("what is outside the bumped package's own tree", changedOutside(base, head, ['c8']), [
  'node_modules/brand-new',
  'node_modules/c8-reporter',
  'node_modules/gone',
  'node_modules/semver',
]);
check(
  'a name that only starts the same is not its tree',
  changedOutside(base, head, ['c8']).includes('node_modules/c8-reporter'),
  true,
);
check(
  'several names, as Dependabot lists a group',
  changedOutside(base, head, [' c8', 'semver ', 'c8-reporter', 'gone', 'brand-new']),
  [],
);
check(
  'a bump that only re-resolves its own tree is clean',
  changedOutside(
    lock({
      'node_modules/c8': entry('12.0.0'),
      'node_modules/c8/node_modules/yargs': entry('17.0.0'),
      'node_modules/semver': entry('7.6.0'),
    }),
    lock({
      'node_modules/c8': entry('12.1.0'),
      'node_modules/c8/node_modules/yargs': entry('17.1.0'),
      'node_modules/semver': entry('7.6.0'),
    }),
    ['c8'],
  ),
  [],
);
check(
  'a scoped name has a tree too',
  changedOutside(lock({ 'node_modules/@a/b': entry('1.0.0') }), lock({ 'node_modules/@a/b': entry('1.0.1') }), [
    '@a/b',
  ]),
  [],
);
check(
  'the root entry is not a package',
  changedPaths(lock({}), { lockfileVersion: 3, packages: { '': { name: 'root', version: '2' } } }),
  [],
);
check(
  'only the bookkeeping moving is not a change',
  changedPaths(base, head).includes('node_modules/@scope/pkg'),
  false,
);
check(
  'a different tarball at the same version is',
  changedPaths(
    lock({ 'node_modules/a': entry('1.0.0') }),
    lock({ 'node_modules/a': { ...entry('1.0.0'), integrity: 'sha512-other' } }),
  ),
  ['node_modules/a'],
);
check('no names means everything is outside', changedOutside(base, head, ['']).length, 6);
check('a lockfile with no packages has none', changedPaths({}, null), []);

{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dcp-lock-'));
  const script = path.join(__dirname, '..', 'scripts', 'lockfile-changes.js');
  fs.writeFileSync(path.join(dir, 'base.json'), JSON.stringify(base));
  fs.writeFileSync(path.join(dir, 'head.json'), JSON.stringify(head));
  fs.writeFileSync(path.join(dir, 'bad.json'), '{');
  const run = (...args) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
  const outside = run(path.join(dir, 'base.json'), path.join(dir, 'head.json'), 'c8, semver');
  const clean = run(path.join(dir, 'base.json'), path.join(dir, 'base.json'), 'c8');
  const broken = run(path.join(dir, 'base.json'), path.join(dir, 'bad.json'), 'c8');
  const usage = run();
  fs.rmSync(dir, { recursive: true, force: true });
  check(
    'run from a shell it prints one path a line',
    [outside.status, outside.stdout.trim().split('\n')],
    [0, ['node_modules/brand-new', 'node_modules/c8-reporter', 'node_modules/gone']],
  );
  check('nothing outside prints nothing', [clean.status, clean.stdout], [0, '']);
  check('a lockfile that does not read is a 2, so the workflow step fails rather than passes', broken.status, 2);
  check('as is being run with nothing', usage.status, 2);
}

/* ------------------------------------------------------------------ what the release job runs waits for a person */

{
  const root = path.join(__dirname, '..');
  const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'dependabot-auto-merge.yml'), 'utf8');
  const dependabot = fs.readFileSync(path.join(root, '.github', 'dependabot.yml'), 'utf8');
  const release = fs.readFileSync(path.join(root, 'release.config.js'), 'utf8');
  const ci = fs.readFileSync(path.join(root, '.github', 'workflows', 'build.yml'), 'utf8');
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  check('the schema generator runs in the release build', /npm run schema/.test(packageJson.scripts.build), true);
  check(
    'so the auto-merge leaves it for a person',
    workflow.includes("!contains(steps.meta.outputs.dependency-names, 'ts-json-schema-generator')"),
    true,
  );
  check(
    'and Dependabot groups it with the release tooling, both lists',
    dependabot.split("- 'ts-json-schema-generator'").length - 1,
    2,
  );
  check(
    'the auto-merge compares the lockfiles with the script',
    workflow.includes('node scripts/lockfile-changes.js'),
    true,
  );
  check(
    'every action in it is pinned to a commit',
    (workflow.match(/uses: \S+/g) ?? []).filter((use) => !/@[0-9a-f]{40}$/.test(use)),
    [],
  );
  for (const bundle of ['builder.js', 'playground.js', 'try-template.js']) {
    check(
      `the release commits docs-theme/assets/js/${bundle}`,
      release.includes(`'docs-theme/assets/js/${bundle}'`),
      true,
    );
  }
  check(
    'CI checks every committed bundle for staleness',
    /git status --porcelain --ignored=matching -- dist\/ bin\/ docs-theme\/assets\/js\//.test(ci),
    true,
  );
}
