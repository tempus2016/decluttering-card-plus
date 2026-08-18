import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    ignores: ['dist/**', '.test-build/**', 'node_modules/**'],
  },
  ...tseslint.configs.recommended,
  prettierRecommended,
  {
    // The test runner is a plain CommonJS Node script, not part of the bundle.
    files: ['test/**/*.js'],
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
