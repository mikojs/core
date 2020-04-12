// @flow

import { type configsType } from '../types';

import exec from './exec';
import babel from './babel';
import prettier from './prettier';
import lint from './lint';
import lintStaged from './lintStaged';
import jest from './jest';
import server from './server';
import miko from './miko';

export default ({
  miko,

  // custom command
  exec,

  // babel
  babel,

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
  'lint-staged': lintStaged,

  // jest
  jest,
  test: {
    ...jest,
    alias: 'jest',
    run: (argv: $ReadOnlyArray<string>) => [...argv, '--silent'],
  },

  // @mikojs/server
  server,
}: configsType);
