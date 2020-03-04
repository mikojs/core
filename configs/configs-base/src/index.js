// @flow

import { type configsType } from '@mikojs/configs/lib/types';

import exec from './base/exec';
import babel from './base/babel';
import prettier from './base/prettier';
import lint from './base/lint';
import lintStaged from './base/lintStaged';
import jest from './base/jest';
import server from './base/server';

export default ({
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
