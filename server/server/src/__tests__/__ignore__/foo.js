// @flow

import path from 'path';

import server, { type middlewareType } from '../../index';
import build from './build';

export default (server.create(build)(
  path.resolve(__dirname, './folder'),
): middlewareType<void>);
