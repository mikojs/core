// @flow

import Koa, { type Middleware as koaMiddlewareType } from 'koa';

import { handleUnhandledRejection } from '@mikojs/utils';

import buildRouter, {
  type returnType as buildRouterReturnType,
} from './utils/buildRouter';
import buildServer from './utils/buildServer';

type routerType = Koa | buildRouterReturnType;

export type contextType = {|
  src: string,
  dir: string,
  dev: boolean,
  watch: boolean,
  port?: number,
  restart: () => void,
  close: () => void,
|};

handleUnhandledRejection();

export default {
  ...['start', 'get', 'post', 'put', 'del', 'all'].reduce(
    (result: { [string]: $Call<typeof buildRouter, string> }, key: string) => ({
      ...result,
      [key]: buildRouter(key),
    }),
    {},
  ),
  ...buildServer(),

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
};
