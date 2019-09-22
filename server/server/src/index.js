// @flow

import path from 'path';

import Koa, { type Middleware as koaMiddlewareType } from 'koa';
import Router from 'koa-router';
import chokidar from 'chokidar';
import chalk from 'chalk';
import debug from 'debug';
import ora from 'ora';
import { emptyFunction } from 'fbjs';

import {
  handleUnhandledRejection,
  mockChoice,
  createLogger,
} from '@mikojs/utils';

import Endpoint from './utils/Endpoint';

type routerType = Router | Endpoint | Koa;

type watchFuncType = (filePath: string) => void;

export type contextType = {|
  src: string,
  dir: string,
  dev?: boolean,
  watch?: boolean,
  port?: number,
  restart?: () => void,
  close?: () => void,
|};

const debugLog = debug('server');
const logger = createLogger('@mikojs/server', ora());

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
  start: (prefix: ?string): Router => {
    debugLog({
      method: 'start',
      prefix,
    });

    return prefix ? new Router({ prefix }) : new Router();
  },

  get: (prefix: string) => new Endpoint(prefix, 'get'),
  post: (prefix: string) => new Endpoint(prefix, 'post'),
  put: (prefix: string) => new Endpoint(prefix, 'put'),
  del: (prefix: string) => new Endpoint(prefix, 'del'),
  all: (prefix: string) => new Endpoint(prefix, 'all'),

  use: (middleware: koaMiddlewareType) => <-R: routerType>(router: R): R => {
    router.use(middleware);

    return router;
  },

  end: (
    router: Router | Endpoint,
  ): (<-R: Router | Koa>(parentRouter: R) => R) => {
    if (router instanceof Endpoint)
      return <-R: Router | Koa>(parentRouter: R): R => {
        /**
         * TODO: https://github.com/facebook/flow/issues/2282
         * instanceof not work
         *
         * $FlowFixMe
         */
        const {
          // $FlowFixMe
          urlPattern,
          // $FlowFixMe
          method,
          // $FlowFixMe
          middlewares,
        } =
          // $FlowFixMe
          router;

        if (!(parentRouter instanceof Router))
          throw new Error(`\`server.${method}\` is not under \`server.start\``);

        switch (method) {
          case 'get':
            parentRouter.get(urlPattern, ...middlewares);
            break;

          case 'post':
            parentRouter.post(urlPattern, ...middlewares);
            break;

          case 'put':
            parentRouter.put(urlPattern, ...middlewares);
            break;

          case 'del':
            parentRouter.del(urlPattern, ...middlewares);
            break;

          case 'all':
            parentRouter.all(urlPattern, ...middlewares);
            break;

          default:
            throw new Error(
              `can not find \`${method}\` method in \`koa-router\``,
            );
        }

        return parentRouter;
      };

    return <-R: Router | Koa>(parentRouter: R): R => {
      /**
       * TODO: https://github.com/facebook/flow/issues/2282
       * instanceof not work
       */
      parentRouter.use(
        // $FlowFixMe
        router.routes(),
      );
      parentRouter.use(
        // $FlowFixMe
        router.allowedMethods(),
      );

      return parentRouter;
    };
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

  init: (): Koa => {
    mockChoice(
      process.env.NODE_ENV === 'test',
      emptyFunction,
      logger.start,
      'Server start',
    );

    return new Koa();
  },

  run: (port?: number = 8000) => (app: Koa): Promise<http$Server> =>
    new Promise(resolve => {
      const server = app.listen(port, () => {
        mockChoice(
          process.env.NODE_ENV === 'test',
          emptyFunction,
          logger.succeed,
          chalk`Running server at port: {gray {bold ${port.toString()}}}`,
        );

        resolve(server);
      });
    }),
};
