// @flow

import path from 'path';

import { importError } from '@mikojs/utils';

importError.test(
  '@mikojs/lerna-flow-typed',
  path.resolve(__dirname, '../index'),
);
