// @flow

import path from 'path';

import router, { type routerType } from '../../index';

export default (router(path.resolve(__dirname, './routes')): routerType);
