// @flow

module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-flow',
  ],
  plugins: [
    ['transform-imports', {
      'cat-utils': {
        transform: 'cat-utils/lib/${member}',
      },
      fbjs: {
        transform: 'fbjs/lib/${member}',
      },
    }],
    ['module-resolver', {
      root: ['./src'],
    }],
    '@babel/plugin-proposal-optional-chaining',
    'add-module-exports',
  ],
  ignore: process.env.NODE_ENV === 'test' ? [] : [
    '**/__tests__/**',
  ],
};
