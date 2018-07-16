// @flow

export default ({
  presets: ['@babel/preset-env', '@babel/preset-flow'],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    [
      'module-resolver',
      {
        root: ['./src'],
      },
    ],
    '@cat-org/babel-plugin-transform-flow',
  ],
  ignore: process.env.NODE_ENV === 'test' ? [] : ['**/__tests__/**'],
  overrides: [],
}: {
  // just for @cat-org/root test src/__tests__/checkBabelConfig.js
  // eslint-disable-next-line flowtype/no-mutable-array
  plugins: Array<string | [string, {}]>,
});
