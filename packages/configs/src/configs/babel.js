// @flow

export default {
  presets: [
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
      },
    ],
    '@babel/flow',
  ],
  plugins: [
    '@babel/proposal-optional-chaining',
    [
      'module-resolver',
      {
        root: ['./src'],
      },
    ],
    '@cat-org/transform-flow',
  ],
  ignore:
    process.env.NODE_ENV === 'test'
      ? []
      : /* istanbul ignore next */ ['**/__tests__/**', '**/__mocks__/**'],
  overrides: [],
};
