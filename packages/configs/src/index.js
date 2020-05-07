// @flow

import { type configsType } from '@mikojs/miko';

import babel from './defaultConfigs/babel';
import prettier from './defaultConfigs/prettier';
import lint from './defaultConfigs/lint';
import lintStaged from './defaultConfigs/lintStaged';
import jest from './defaultConfigs/jest';
import miko from './defaultConfigs/miko';

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
