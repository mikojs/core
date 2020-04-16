// @flow

import { type configsType } from './types';

import babel from './configs/babel';
import prettier from './configs/prettier';
import lint from './configs/lint';
import lintStaged from './configs/lintStaged';
import jest from './configs/jest';
import miko from './configs/miko';

export default ({
  miko,

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
}: configsType);
