// @flow

/* eslint-disable flowtype/require-return-type, flowtype/require-parameter-type */
module.exports = {
  ...require('@cat-org/configs'),
  esw: config => ({
    ...config,
    overrides: [
      {
        files: ['__tests__/**/*.js', '.catrc.js'],
        settings: {
          /** In packages/** modules */
          'import/core-modules': ['@cat-org/configs', '@cat-org/utils'],
        },
      },
    ],
  }),
};
