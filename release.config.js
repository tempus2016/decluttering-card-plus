module.exports = {
  plugins: [
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
      },
    ],
  ],
  preset: 'conventionalcommits',
  branches: [{ name: 'main' }, { name: 'dev', channel: 'beta', prerelease: true }],
};
