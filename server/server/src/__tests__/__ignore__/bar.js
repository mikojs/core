// @flow

import path from 'path';

import server from '../..';
import build from './build';

export default server.create(build)(path.resolve(__dirname, './folder/bar'));
