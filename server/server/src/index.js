// @flow

import path from 'path';

import Koa, { type Middleware as koaMiddlewareType } from 'koa';
import Router from 'koa-router';
import execa from 'execa';
import chokidar from 'chokidar';
import chalk from 'chalk';
import debug from 'debug';
import { invariant, emptyFunction } from 'fbjs';

import { handleUnhandledRejection } from '@cat-org/utils';

import logger from './utils/logger';
import Endpoint from './utils/Endpoint';

type routerType = Router | Endpoint | Koa;

export type contextType = {|
  src: string,
  dir: string,
  dev?: boolean,
  watch?: boolean,
  babelOptions?: false | $ReadOnlyArray<string>,
  port?: number,
|};

type watchFuncType = (filePath: string) => void;

const debugLog = debug('server');

handleUnhandledRejection();

/** Server */
class Server {
  +context: contextType = {
    src: '',
    dir: '',
    dev: true,
    watch: false,
    babelOptions: false,
  };

  /**
   * @example
   * watchFunc('/new-file-path')
   *
   * @param {string} filePath - file path which is added or modified
   */
  +watchFunc = [
    (filePath: string) => {
      delete require.cache[filePath];
    },
  ];

  /**
   * @example
   * server.init(context)
   *
   * @param {contextType} initContext - init context
   *
   * @return {Promise<Koa>} - koa server
   */
  +init = async (initContext: contextType): Promise<Koa> => {
    Object.keys(initContext).forEach((key: string) => {
      this.context[key] = initContext[key];
    });
    debugLog(this.context);

    const { src, dir, dev, watch, babelOptions } = this.context;

    if (babelOptions) {
      invariant(
        !babelOptions.some((option: string) =>
          ['-d', '--out-dir'].includes(option),
        ),
        'Should not use `-d` or `--out-dir`',
      );

      const options = [src, '-d', dir, ...babelOptions];

      await execa('babel', options, {
        stdio: 'inherit',
      });

      if (dev && watch)
        execa('babel', ['--skip-initial-build', '-w', ...options], {
          stdio: 'inherit',
        });
    }

    logger.start('Server start');

    return new Koa();
  };

  /**
   * @example
   * server.event(() => {})
   *
   * @param {Function} callback - callback function to run;
   *
   * @return {Function} - return the empty function which will return any argument.
   */
  +event = async (
    callback: () =>
      | $ReadOnlyArray<watchFuncType>
      | Promise<$ReadOnlyArray<watchFuncType>>,
  ): emptyFunction.thatReturnsArgument => {
    this.watchFunc.push(...((await callback()) || []));

    return emptyFunction.thatReturnsArgument;
  };

  /**
   * @example
   * server.start(undefined)
   *
   * @param {string} prefix - prefix for router
   *
   * @return {Router} - koa-router
   */
  +start = (prefix: ?string): Router => {
    debugLog({
      method: 'start',
      prefix,
    });

    return prefix ? new Router({ prefix }) : new Router();
  };

  /**
   * @example
   * server.get('/get')
   *
   * @param {string} prefix - prefix for path
   *
   * @return {Endpoint} - end point of the router
   */
  +get = (prefix: string) => new Endpoint(prefix, 'get');

  /**
   * @example
   * server.post('/post')
   *
   * @param {string} prefix - prefix for path
   *
   * @return {Endpoint} - end point of the router
   */
  +post = (prefix: string) => new Endpoint(prefix, 'post');

  /**
   * @example
   * server.put('/put')
   *
   * @param {string} prefix - prefix for path
   *
   * @return {Endpoint} - end point of the router
   */
  +put = (prefix: string) => new Endpoint(prefix, 'put');

  /**
   * @example
   * server.del('/del')
   *
   * @param {string} prefix - prefix for path
   *
   * @return {Endpoint} - end point of the router
   */
  +del = (prefix: string) => new Endpoint(prefix, 'del');

  /**
   * @example
   * server.all('/all')
   *
   * @param {string} prefix - prefix for path
   *
   * @return {Endpoint} - end point of the router
   */
  +all = (prefix: string) => new Endpoint(prefix, 'all');

  /**
   * @example
   * server.use(async (ctx, next) => { await next(); })
   *
   * @param {koaMiddlewareType} middleware - koa middleware
   *
   * @return {Function} - add new middleware to router
   */
  +use = (middleware: koaMiddlewareType) => <-R: routerType>(router: R): R => {
    router.use(middleware);

    return router;
  };

  /**
   * @example
   * server.end(router)
   *
   * @param {Router | Endpoint} router - prev router
   *
   * @return {Function} - add new router to parent router
   */
  +end = (
    router: Router | Endpoint,
  ): (<-R: Router | Koa>(parentRouter: R) => R) => {
    if (router instanceof Endpoint)
      return <-R: Router | Koa>(parentRouter: R): R => {
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

    return <-R: Router | Koa>(parentRouter: R): R => {
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
  };

  /**
   * @example
   * server.watch(server)
   *
   * @param {Koa | Promise<Koa>} server - koa server or Promise to return koa server
   *
   * @return {Koa | Promise<Koa>} - server from the argument
   */
  +watch = <S>(server: S): S => {
    const { dir, dev, watch } = this.context;

    if (dev && watch)
      chokidar
        .watch(path.resolve(dir), {
          ignoreInitial: true,
        })
        .on('all', (event: string, filePath: string) => {
          if (!['add', 'change'].includes(event) || !/\.jsx?$/.test(filePath))
            return;

          this.watchFunc.forEach((update: watchFuncType) => {
            update(filePath);
          });
        });

    return server;
  };

  /**
   * @example
   * server.run(app)
   *
   * @param {Koa} app - koa server
   *
   * @return {Promise} - http server
   */
  +run = (app: Koa): Promise<http$Server> =>
    new Promise(resolve => {
      const { port = 8000 } = this.context;
      const server = app.listen(port, () => {
        logger.succeed(
          chalk`Running server at port: {gray {bold ${port.toString()}}}`,
        );

        resolve(this.watch(server));
      });
    });
}

export default new Server();
