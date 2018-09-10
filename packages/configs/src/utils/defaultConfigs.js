// @flow

const babel = {
  config: (): {} => require('configs/babel'),
  run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
    ...argv,
    'src',
    '-d',
    'lib',
    '--verbose',
  ],
};

const lint = {
  alias: 'esw',
  config: (): {} => require('configs/eslint'),
  ignore: (): $ReadOnlyArray<string> => [
    // node
    'node_modules',

    // babel
    'lib',

    // flow
    'flow-typed/npm',

    // jest
    'coverage',

    // add checking other configs
    '!.*.js',
  ],
  run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
    ...argv,
    '--cache',
  ],
  env: {
    NODE_ENV: 'test',
  },
  configFiles: {
    babel: true,
  },
};

const jest = {
  config: (): {} => require('configs/jest'),
  configFiles: {
    babel: true,
  },
};

export default {
  // babel
  babel,
  'babel:lerna': {
    ...babel,
    alias: 'babel',
    run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
      ...babel.run(argv),
      '--config-file',
      '../../babel.config.js',
    ],
  },

  // eslint
  lint,
  'lint:watch': {
    ...lint,
    alias: 'esw',
    run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
      ...lint.run(argv),
      '-w',
      '--rule',
      'prettier/prettier: off',
      '--quiet',
    ],
  },

  // prettier
  prettier: {
    config: (): {} => require('configs/prettier'),
    run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
      ...argv,
      '--write',
    ],
  },

  // lint-staged
  'lint-staged': (): {} => require('configs/lintsteged'),

  // jest
  jest,
  test: {
    ...jest,
    alias: 'jest',
    run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
      ...argv,
      '--silent',
    ],
  },
};
