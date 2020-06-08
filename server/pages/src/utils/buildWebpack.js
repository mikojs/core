// @flow

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';

import { type middlewareType } from '@mikojs/server';

/**
 * @return {middlewareType} - webpack middleware
 */
export default async (): Promise<middlewareType<>> => {
  const compiler = webpack({});
  const middleware = webpackDevMiddleware(compiler);

  await new Promise(resolve => middleware.waitUntilValid(resolve));

  return async (req: http.IncomingMessage, res: http.ServerResponse) => {
    await middleware(req, res);
  };
};
