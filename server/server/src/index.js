// @flow

import path from 'path';

import Koa, { type Middleware as koaMiddlewareType } from 'koa';
import chokidar from 'chokidar';

import { handleUnhandledRejection } from '@mikojs/utils';

import buildRouter, {
  type returnType as buildRouterReturnType,
} from './utils/buildRouter';
import buildServer from './utils/buildServer';

type routerType = Koa | buildRouterReturnType;

type watchFuncType = (filePath: string) => void;

export type contextType = {|
  src: string,
  dir: string,
  dev: boolean,
  watch: boolean,
  port?: number,
  restart: () => void,
  close: () => void,
|};

/**
 * @example
 * removeCache('/file-path')
 *
 * @param {string} filePath - remvoe cache from file path
 */
const removeCache = (filePath: string) => {
  delete require.cache[filePath];
};

handleUnhandledRejection();

export default {
  ...['start', 'get', 'post', 'put', 'del', 'all'].reduce(
    (result: { [string]: $Call<typeof buildRouter, string> }, key: string) => ({
      ...result,
      [key]: buildRouter(key),
    }),
    {},
  ),

  use: (middleware: koaMiddlewareType) => <-R: routerType>(router: R): R => {
    router.use(middleware);

    return router;
  },

  end: (router: buildRouterReturnType) => <-R: routerType>(
    parentRouter: R,
  ): R => {
    if (router.type === 'router') router.end();

    parentRouter.use(router.routes());
    parentRouter.use(router.allowedMethods());

    return parentRouter;
  },

  watch: (dir: string, watchFuncs: $ReadOnlyArray<watchFuncType>) => <R>(
    router: R,
  ): R => {
    chokidar
      .watch(path.resolve(dir), {
        ignoreInitial: true,
      })
      .on('all', (event: string, filePath: string) => {
        if (!['add', 'change'].includes(event) || !/\.jsx?$/.test(filePath))
          return;

        [removeCache, ...watchFuncs].forEach((watchFunc: watchFuncType) => {
          watchFunc(filePath);
        });
      });

    return router;
  },

  ...buildServer(),
};
