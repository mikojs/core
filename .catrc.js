// @flow

const lintConfig = config => ({
  ...config,
  overrides: [
    {
      files: [
        'checkBabelConfig.js',
        'checkFilesInPackages.js',
        '.catrc.js',
        'babel.config.js',
      ],
      settings: {
        /** In packages/** modules */
        'import/core-modules': ['@cat-org/configs', '@cat-org/utils'],
      },
    },
  ],
});

/* eslint-disable flowtype/require-return-type, flowtype/require-parameter-type */
module.exports = require('@cat-org/configs/lib/mergeConfigs')({
  lint: {
    config: lintConfig,
  },
  'lint:watch': {
    config: lintConfig,
  },
});
