// @flow

const babelConfig = require('./../../babel.config');

module.exports = babelConfig
  .addPlugin('add-module-exports', -1)
  .addConfigs({
    ignore: [
      '**/__tests__/**/*.js',
      '**/__testsFiles__/**/*.js',
    ],
  });
