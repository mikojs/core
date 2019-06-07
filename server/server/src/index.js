// @flow

import path from 'path';

import Koa, { type Middleware as koaMiddlewareType } from 'koa';
import Router from 'koa-router';
import execa from 'execa';
import chokidar from 'chokidar';
import chalk from 'chalk';
import debug from 'debug';
import { emptyFunction } from 'fbjs';

import { handleUnhandledRejection } from '@cat-org/utils';

import logger from './utils/logger';
import Endpoint from './utils/Endpoint';

type routerType = Router | Endpoint | Koa;

export type contextType = {|
  dev: boolean,
  src: string,
  dir: string,
  babelOptions: string | false,
|};

const debugLog = debug('server');
const context: contextType = {
  dev: true,
  src: '',
  dir: '',
  babelOptions: false,
};

handleUnhandledRejection();

export default {
  init: async (
    initContext: contextType,
    callback: () => void | Promise<void> = emptyFunction,
  ): Promise<Koa> => {
    Object.keys(initContext).forEach((key: string) => {
      context[key] = initContext[key];
    });
    debugLog(context);

    const { dev, babelOptions } = context;

    if (babelOptions) {
      const options = babelOptions
        .split(/ /)
        .filter((argv: string) => !['-w', '--watch'].includes(argv))
        .join(' ');

      if (dev) {
        await execa.shell(`babel ${options}`, {
          stdio: 'inherit',
        });
        execa.shell(`babel --skip-initial-build -w ${options}`, {
          stdio: 'inherit',
        });
      } else
        await execa.shell(`babel ${options}`, {
          stdio: 'inherit',
        });
    }

    logger.start('Server start');

    // TODO: avoid to trigger webpack again
    await new Promise(resolve => setTimeout(resolve, 1000));
    await callback();

    return new Koa();
  },

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

  use: (middleware: koaMiddlewareType) => <R: routerType>(router: R): R => {
    router.use(middleware);

    return router;
  },

  end: (
    router: Router | Endpoint,
  ): (<R: Router | Koa>(parentRouter: R) => R) => {
    if (router instanceof Endpoint)
      return <R: Router | Koa>(parentRouter: R): R => {
        /**
         * https://github.com/facebook/flow/issues/2282
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
          throw logger.fail(
            `\`server.${method}\` is not under \`server.start\``,
          );

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
            throw logger.fail(
              `can not find \`${method}\` method in \`koa-router\``,
            );
        }

        return parentRouter;
      };

    return <R: Router | Koa>(parentRouter: R): R => {
      /**
       * https://github.com/facebook/flow/issues/2282
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

  run: (port?: number = 8000, callback?: () => void = emptyFunction) => (
    app: Koa,
  ): http$Server => {
    debugLog(port);

    return app.listen(parseInt(port, 10), () => {
      const { dev, dir } = context;

      logger.succeed(
        chalk`Running server at port: {gray {bold ${port.toString()}}}`,
      );

      if (dev)
        chokidar
          .watch(path.resolve(dir), {
            ignoreInitial: true,
          })
          .on('change', (filePath: string) => {
            if (/\.jsx?/.test(filePath)) delete require.cache[filePath];
          });

      callback();
    });
  },
};
