// The release-notes check in CI runs semantic-release against a throwaway local clone so
// it needs no credentials of any kind. Only the plugins that shape the notes are wanted
// there: the publishing ones would be verifying an access it deliberately does not have,
// and none of them contribute a line to the changelog.
const notesOnly = process.env.RELEASE_NOTES_CHECK === '1';

const plugins = [
  '@semantic-release/commit-analyzer',
  [
    '@semantic-release/release-notes-generator',
    {
      preset: 'conventionalcommits',
      presetConfig: {
        types: [
          { type: 'feat', section: 'Features' },
          { type: 'fix', section: 'Bug Fixes' },
          { type: 'doc', hidden: false, section: 'Documentation' },
          { type: 'docs', hidden: false, section: 'Documentation' },
          { type: 'chore', hidden: true, section: 'Chores' },
        ],
      },
    },
  ],
  '@semantic-release/changelog',
  [
    '@semantic-release/npm',
    {
      npmPublish: false,
    },
  ],
  [
    // Rebuild once the new version is in package.json, so the bundle that is committed
    // and attached to the release carries it too.
    '@semantic-release/exec',
    {
      // Appended to the generated notes. See scripts/release-notes.js.
      generateNotesCmd: 'node scripts/release-notes.js ${nextRelease.version}',
      // Rebuild once the new version is in package.json.
      prepareCmd: 'npm run build',
    },
  ],
  [
    '@semantic-release/git',
    {
      assets: ['CHANGELOG.md', 'README.md', 'package.json', 'package-lock.json', 'dist/decluttering-card-plus.js'],
    },
  ],
  [
    '@semantic-release/github',
    {
      assets: 'dist/*.js',
      // Commit messages cite issue numbers from the upstream repository, which do not
      // exist here; the comment step fails the whole run trying to resolve them.
      successComment: false,
      failComment: false,
    },
  ],
];

module.exports = {
  plugins: notesOnly
    ? plugins.filter((plugin) =>
        [
          '@semantic-release/commit-analyzer',
          '@semantic-release/release-notes-generator',
          '@semantic-release/exec',
        ].includes(Array.isArray(plugin) ? plugin[0] : plugin),
      )
    : plugins,
  preset: 'conventionalcommits',
  branches: [{ name: 'main' }, { name: 'dev', channel: 'beta', prerelease: true }],
};
