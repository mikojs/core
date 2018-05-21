// @flow

const babelConfig = require('./babel.config');

module.exports = babelConfig
  .addAliasToModuleResolver({
    'cat-utils/lib': './packages/cat-utils/lib',
  })
  .addPlugin('transform-imports', 0, {
    'cat-utils': {
      transform: 'cat-utils/lib/${member}',
    },
    'fbjs': {
      transform: 'fbjs/lib/${member}',
    },
  })
  .getConfigs;
