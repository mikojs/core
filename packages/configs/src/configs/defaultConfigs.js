// @flow

import babel from 'configs/babel';
import prettier from 'configs/prettier';
import lint from 'configs/lint';
import lintsteged from 'configs/lintsteged';
import jest from 'configs/jest';

export default ({
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

  // prettier
  prettier,

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

  // lint-staged
  'lint-staged': lintsteged,

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
}: {
  [string]: {
    alias?: string,
    install?: (argv: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
    config?: (argv: $ReadOnlyArray<mixed>) => mixed,
    ignore?: (argv: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
    ignoreName?: string,
    run?: (argv: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
    env?: {},
    configFiles?: {},
  },
  babel: {
    install: (argv: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
    config: (argv: $ReadOnlyArray<mixed>) => mixed,
    run: (argv: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
  },
  lint: {
    install: (argv: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
    config: (argv: $ReadOnlyArray<mixed>) => mixed,
    run: (argv: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
  },
});
