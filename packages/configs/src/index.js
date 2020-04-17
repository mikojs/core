// @flow

import { type configsType } from '@mikojs/miko/lib/types';

import babel from './configs/babel';
import prettier from './configs/prettier';
import lint from './configs/lint';
import lintStaged from './configs/lintStaged';
import jest from './configs/jest';
import miko from './configs/miko';

export default ({
  // miko
  miko,

  // babel
  babel,

  // prettier
  prettier,

  // eslint
  lint,

  // lint-staged
  'lint-staged': lintStaged,

  // jest
  jest,
}: configsType);
