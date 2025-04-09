/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{json,md}': 'prettier --write',
  '*.{ts,tsx,js,jsx}': ['eslint --fix --quiet', 'prettier --write'],
};
