// @flow

import path from 'path';

import { type EmptyFunctionType } from 'fbjs/lib/emptyFunction';

import build from './build';

export default (build(path.resolve(__dirname, './folder/foo')): $PropertyType<
  EmptyFunctionType,
  'thatReturnsArgument',
>);
