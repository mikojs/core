// @flow

const babelConfig = require('./../../babel.config');

module.exports = babelConfig
  .addPlugin('add-module-exports', -1)
  .getConfigs;
