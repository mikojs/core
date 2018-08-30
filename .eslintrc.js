// @flow

module.exports = {
  extends: ['@cat-org/eslint-config-cat'],
  rules: {
    'prettier/prettier': ['error', require('@cat-org/configs/lib/prettier')],
  },
  overrides: [
    {
      files: [
        '__tests__/**/*.js',
        'babel.config.js',
        'jest.config.js',
        '.lintstagedrc.js',
        '.prettierrc.js',
        '.eslintrc.js',
      ],
      settings: {
        /** In packages/** modules */
        'import/core-modules': ['@cat-org/configs', '@cat-org/utils'],
      },
    },
  ],
};
