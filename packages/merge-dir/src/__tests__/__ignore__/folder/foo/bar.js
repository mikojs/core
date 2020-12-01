// @flow

import path from 'path';

import build, { type funcType } from '../../build';

export default (build(
  path.resolve(__dirname, '../../folder/bar'),
  '/bar',
): funcType);
