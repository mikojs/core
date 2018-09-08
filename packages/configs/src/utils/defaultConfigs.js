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
  run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
    ...argv,
    ...require('configs/eslint/ignore'),
    '--cache',
  ],
  env: {
    NODE_ENV: 'test',
  },
};

const jest = {
  config: (): {} => require('configs/jest'),
  env: {
    NODE_ENV: 'test',
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
