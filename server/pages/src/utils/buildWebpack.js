// @flow

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';

import { type middlewareType } from '@mikojs/server';

/**
 * @return {middlewareType} - webpack middleware
 */
export default (): middlewareType<> => {
  const compiler = webpack({});
  const middleware = webpackDevMiddleware(compiler);
  let isDone: boolean = false;

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
