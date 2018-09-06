// @flow

/* eslint-disable flowtype/require-return-type */
/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable require-jsdoc */
const lint = {
  run: argv => [
    ...argv,
    '--ignore-pattern',
    'packages/eslint-config-cat/src/__tests__/__ignore__',
  ],
  config: config => ({
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
  }),
};

module.exports = require('@cat-org/configs/lib/mergeConfigs')({
  lint,
  'lint:watch': lint,
});
