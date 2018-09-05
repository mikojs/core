// @flow

const { esw, ...configs } = require('@cat-org/configs');

/* eslint-disable flowtype/require-return-type, flowtype/require-parameter-type */
module.exports = {
  ...configs,
  esw: {
    ...esw,
    config: config => ({
      ...config,
      overrides: [
        {
          files: ['__tests__/**/*.js', '.catrc.js'],
          settings: {
            /** In packages/** modules */
            'import/core-modules': ['@cat-org/configs'],
          },
        },
      ],
    }),
  },
};
