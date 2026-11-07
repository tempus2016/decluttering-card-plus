import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    ignores: [
      'dist/**',
      'docs-theme/assets/js/builder.js',
      'docs-theme/assets/js/playground.js',
      'bin/cli-lint.cjs',
      '.test-build/**',
      '.dom-build/**',
      '.tmp/**',
      'node_modules/**',
    ],
  },
  ...tseslint.configs.recommended,
  {
    // The explicit anys that are there stay for now; new code should not add more (idea 7).
    rules: { '@typescript-eslint/no-explicit-any': 'warn' },
  },
  prettierRecommended,
  {
    // The test runner and the release scripts are plain CommonJS Node scripts, not
    // part of the bundle.
    files: ['test/**/*.js', 'scripts/**/*.js', 'bin/**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        experimentalDecorators: true,
      },
    },
  },
];
