// @flow

module.exports = {
  extends: [
    './packages/eslint-config-cat/lib/index.js',
  ],
  rules: {
    'import/no-internal-modules': ['error', {
      allow: [
        '**/packages/**',
      ],
    }],
  },
};
