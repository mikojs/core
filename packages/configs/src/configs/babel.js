// @flow

export default {
  install: (install: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
    ...install,
    '@babel/cli',
    '@babel/core',
    '@babel/preset-env',
    '@babel/preset-flow',
    '@babel/plugin-proposal-optional-chaining',
    '@cat-org/babel-plugin-transform-flow',
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
      '@babel/proposal-optional-chaining',
      [
        'module-resolver',
        {
          root: ['./src'],
        },
      ],
      ...(process.env.NODE_ENV === 'test'
        ? []
        : [
            [
              '@cat-org/transform-flow',
              {
                config: {
                  plugins: [
                    // FIXME: remove when flow support optional-chaining
                    '@babel/proposal-optional-chaining',
                  ],
                },
              },
            ],
          ]),
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
