module.exports = {
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'react-app',
    'react-app/jest',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  rules: {
    '@typescript-eslint/no-empty-interface': 'warn',
    'no-empty-pattern': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'import/no-anonymous-default-export': 'off',
  },
};
