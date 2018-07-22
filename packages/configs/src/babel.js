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
  ignore:
    process.env.NODE_ENV === 'test'
      ? []
      : /* istanbul ignore next */ ['**/__tests__/**'],
  overrides: [],
}: {
  // just for tests
  // eslint-disable-next-line flowtype/no-mutable-array
  plugins: Array<string | [string, {}]>,
  ignore: [] | ['**/__tests__/**'],
});
