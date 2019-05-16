// @flow

import { type configType } from '../types';

import babel from './babel';
import prettier from './prettier';
import lint from './lint';
import lintsteged from './lintsteged';

import jest from './jest';
import jestReact from './jest/react';

export default ({
  // babel
  babel,
  'babel:lerna': {
    ...babel,
    alias: 'babel',
    run: (argv: $ReadOnlyArray<string>) => [
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
    run: (argv: $ReadOnlyArray<string>) => [
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
    run: (argv: $ReadOnlyArray<string>) => [...argv, '--silent'],
  },
  'jest:react': jestReact,
  'test:react': {
    ...jestReact,
    run: (argv: $ReadOnlyArray<string>) => [...argv, '--silent'],
  },
}: {
  [string]: configType,
});
