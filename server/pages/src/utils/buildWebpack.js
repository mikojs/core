// @flow

import crypto from 'crypto';

import findCacheDir from 'find-cache-dir';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import debug from 'debug';

import { type middlewareType } from '@mikojs/server';

import { type routesType } from '../index';

import generateClient from './generateClient';

const debugLog = debug('pages:buildWebpack');
const chunkHash = crypto
  .createHmac('sha256', `@mikojs/pages ${new Date().toString()}`)
  .digest('hex')
  .slice(0, 8);
const clientPath = findCacheDir({
  name: chunkHash,
  thunk: true,
})('client.js');

/**
 * @param {routesType} routes - routes
 *
 * @return {middlewareType} - webpack middleware
 */
export default (routes: routesType): middlewareType<> => {
  const compiler = webpack({});
  const middleware = webpackDevMiddleware(compiler);
  let isDone: boolean = false;

  debugLog({ chunkHash, clientPath });
  generateClient(routes, clientPath);
  middleware.waitUntilValid(() => {
    isDone = true;
  });

  return async (req: http.IncomingMessage, res: http.ServerResponse) => {
    if (isDone) {
      await middleware(req, res);
      return;
    }

    // TODO: should auto reload
    res.write('Waitting for webpack');
    res.end();
  };
};
