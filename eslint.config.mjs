import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'node_modules/',
      '.expo/',
      'dist/',
      'web-build/',
      '*.config.js',
      '*.config.mjs',
      'package-lock.json',
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error', 'info', 'log'] }],
    },
  },
  eslintConfigPrettier,
];
