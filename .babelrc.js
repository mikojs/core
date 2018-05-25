// @flow

const babelConfig = require('./babel.config');

const configs = babelConfig
  .addAliasToModuleResolver({
    'cat-utils/lib': './packages/cat-utils/lib',
  })
  .addPlugin('transform-imports', 0, {
    'cat-utils': {
      transform: 'cat-utils/lib/${member}',
    },
    fbjs: {
      transform: 'fbjs/lib/${member}',
    },
  });

module.exports = (
  process.env.NODE_ENV !== 'test' ?
    configs :
    configs.addPreset('@babel/preset-stage-0', 1, {
      decoratorsLegacy: true,
    })
).getConfigs;
