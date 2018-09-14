// @flow

const babel = {
  install: (): $ReadOnlyArray<string> => [
    '@babel/cli',
    '@babel/core',
    '@babel/preset-env',
    '@babel/preset-flow',
    '@babel/plugin-proposal-optional-chaining',
    '@cat-org/babel-plugin-transform-flow',
  ],
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
  install: (): $ReadOnlyArray<string> => [
    '@cat-org/eslint-config-cat',
    'babel-eslint',
    'eslint',
    'eslint-watch',
    'eslint-config-fbjs',
    'eslint-config-google',
    'eslint-config-prettier',
    'eslint-import-resolver-babel-module',
    'eslint-plugin-babel',
    'eslint-plugin-flowtype',
    'eslint-plugin-import',
    'eslint-plugin-jsdoc',
    'eslint-plugin-jsx-a11y',
    'eslint-plugin-prettier',
    'eslint-plugin-react',
    'eslint-plugin-relay',
  ],
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
    prettier: true,
  },
};

const jest = {
  install: (): $ReadOnlyArray<string> => [
    'jest',
    'babel-jest',
    'babel-core@^7.0.0-0',
  ],
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
    install: (): $ReadOnlyArray<string> => ['prettier'],
    config: (): {} => require('configs/prettier'),
    run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
      ...argv,
      '--write',
    ],
  },

  // lint-staged
  'lint-staged': {
    install: (): $ReadOnlyArray<string> => ['husky', 'lint-staged'],
    config: (): {} => require('configs/lintsteged'),
    configFiles: {
      prettier: true,
      lint: true,
    },
  },

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
