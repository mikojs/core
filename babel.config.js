// @flow

// eslint-disable-next-line flowtype/require-return-type
const babelConfigs = (() => {
  try {
    if (process.env.NODE_ENV === 'test') throw new Error('test');

    return require('./packages/configs/lib/babel');
  } catch (e) {
    return {
      presets: ['@babel/preset-env', '@babel/preset-flow'],
      plugins: ['@babel/plugin-proposal-optional-chaining'],
      ignore: process.env.NODE_ENV === 'test' ? [] : ['**/__tests__/**'],
    };
  }
})();

babelConfigs.plugins.push(
  [
    'transform-imports',
    {
      '@cat-org/utils': {
        transform: '@cat-org/utils/lib/${member}',
      },
      fbjs: {
        transform: 'fbjs/lib/${member}',
      },
    },
  ],
  [
    'module-resolver',
    {
      root: ['./src'],
    },
  ],
  'add-module-exports',
);

module.exports = babelConfigs;
