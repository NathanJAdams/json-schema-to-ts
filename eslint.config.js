import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts'],
    ignores: [
      'dist/**',
      'node_modules/**',
      '**/*.log',
      '.idea/**',
      '.vscode/**',
    ],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
    },
  },
];
