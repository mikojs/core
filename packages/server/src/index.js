// @flow

import Koa from 'koa';
import Router from 'koa-router';
import chalk from 'chalk';

import type { Middleware as koaMiddlewareType } from 'koa';

import { handleUnhandledRejection } from '@cat-org/utils';

import logger from './utils/logger';
import Endpoint from './utils/Endpoint';

handleUnhandledRejection();

export default {
  init: () => new Koa(),
  all: (prefix: ?string) => (prefix ? new Router({ prefix }) : new Router()),
  get: (prefix: string) => new Endpoint(prefix, 'get'),
  post: (prefix: string) => new Endpoint(prefix, 'post'),
  put: (prefix: string) => new Endpoint(prefix, 'put'),
  del: (prefix: string) => new Endpoint(prefix, 'del'),

  use: (middleware: koaMiddlewareType) => (
    router: Router | Endpoint | Koa,
  ): Router | Endpoint | Koa => {
    router.use(middleware);

    return router;
  },

  end: (
    router: Router | Endpoint,
  ): ((parentRouter: Router | Endpoint) => Router | Endpoint) => {
    if (router instanceof Endpoint)
      return (parentRouter: Router | Endpoint): Router | Endpoint => {
        /**
         * https://github.com/facebook/flow/issues/2282
         * instanceof not work
         *
         * $FlowFixMe
         */
        const { urlPattern, method, middlewares } = router;

        if (!(parentRouter instanceof Router))
          throw new TypeError(
            `\`server.${method}\` is not under \`server.all\``,
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

          default:
            break;
        }

        return parentRouter;
      };

    return (parentRouter: Router | Endpoint): Router | Endpoint => {
      /**
       * https://github.com/facebook/flow/issues/2282
       * instanceof not work
       *
       * $FlowFixMe
       */
      parentRouter.use(router.routes());
      // $FlowFixMe
      parentRouter.use(router.allowedMethods());

      return parentRouter;
    };
  },

  run: (port?: number = 8000) => (app: Koa) => {
    app.listen(port, () => {
      logger.info(chalk`Running server at port: {gray {bold ${port}}}`);
    });
  },
};
