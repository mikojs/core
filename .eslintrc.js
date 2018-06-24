// @flow

const checkConfigs = require('./packages/eslint-config-cat/lib/checkConfigs');

module.exports = checkConfigs({
  extends: ['./packages/eslint-config-cat/lib/index.js'],
  rules: {
    'import/no-internal-modules': [
      'error',
      {
        allow: ['**/packages/**'],
      },
    ],
    'import/no-restricted-paths': [
      'error',
      {
        zones: [],
      },
    ],
  },
});
