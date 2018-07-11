// @flow

export default ({
  presets: ['@babel/preset-env', '@babel/preset-flow'],
  plugins: ['@babel/plugin-proposal-optional-chaining'],
  ignore: process.env.NODE_ENV === 'test' ? [] : ['**/__tests__/**'],
  overrides: [],
}: {
  // just for @cat-org/root test src/__tests__/checkBabelConfig.js
  plugins: Array<string | Array<string | {}>>,
});
