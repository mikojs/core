// @flow

import crypto from 'crypto';

import findCacheDir from 'find-cache-dir';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import debug from 'debug';

import { type optionsType, type middlewareType } from '@mikojs/server';

import { type routesType } from '../index';

import getDefaultConfig from './getDefaultConfig';
import generateClient from './generateClient';

const debugLog = debug('pages:buildWebpack');
const chunkHash = crypto
  .createHmac('sha256', `@mikojs/pages ${new Date().toString()}`)
  .digest('hex')
  .slice(0, 8);
const cacheDir = findCacheDir({
  name: chunkHash,
  thunk: true,
});

/**
 * @param {routesType} routes - routes
 * @param {string} folderPath - folder path
 * @param {optionsType} options - options
 *
 * @return {middlewareType} - webpack middleware
 */
export default (
  routes: routesType,
  folderPath: string,
  options: optionsType,
): middlewareType<> => {
  const { basename } = options;
  const clientName = [basename, 'client.js'].filter(Boolean).join('/');
  const clientPath = cacheDir(clientName);
  const compiler = webpack(
    getDefaultConfig(
      routes,
      folderPath,
      options,
      chunkHash,
      clientName,
      clientPath,
      [basename, 'commons.js'].filter(Boolean).join('/'),
    ),
  );

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
