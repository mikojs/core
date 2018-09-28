// @flow

export default {
  install: (install: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
    ...install,
    '@babel/cli',
    '@babel/core',
    '@babel/preset-env',
    '@babel/preset-flow',
    '@babel/plugin-transform-flow-comments',
    '@babel/plugin-proposal-optional-chaining',
  ],
  config: (): {} => ({
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
      '@babel/transform-flow-comments',
      '@babel/proposal-optional-chaining',
      [
        'module-resolver',
        {
          root: ['./src'],
        },
      ],
    ],
    ignore:
      process.env.NODE_ENV === 'test'
        ? []
        : ['**/__tests__/**', '**/__mocks__/**'],
    overrides: [],
  }),
  run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
    ...argv,
    'src',
    '-d',
    'lib',
    '--verbose',
  ],
};
