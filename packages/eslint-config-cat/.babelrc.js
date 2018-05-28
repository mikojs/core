// @flow

const babelConfig = require('./../../.build-babelrc');

module.exports = babelConfig
  .addPlugin('add-module-exports', -1)
  .addPlugin('transform-imports', 0, {
    'cat-utils': {
      transform: 'cat-utils/lib/${member}',
    },
    fbjs: {
      transform: 'fbjs/lib/${member}',
    },
  })
  .addConfigs({
    ignore: [
      '**/__tests__/**/*.js',
      '**/__testsFiles__/**/*.js',
    ],
  });
