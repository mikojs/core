// @flow

import Koa, { type Middleware as koaMiddlewareType } from 'koa';

import { handleUnhandledRejection } from '@mikojs/utils';

import buildRouter, {
  type returnType as buildRouterReturnType,
} from './utils/buildRouter';
import buildServer from './utils/buildServer';

import helpers from './helpers';

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
  ...buildServer(),
  helpers,

  start: buildRouter('start'),
  get: buildRouter('get'),
  post: buildRouter('post'),
  put: buildRouter('put'),
  del: buildRouter('del'),
  all: buildRouter('all'),

  use: (middleware: koaMiddlewareType) => <-R: routerType>(router: R): R => {
    router.use(middleware);

    return router;
  },

  end: (router: buildRouterReturnType) => <-R: routerType>(
    parentRouter: R,
  ): R => {
    // FIXME
    // eslint-disable-next-line flowtype/no-unused-expressions
    router?.end();
    parentRouter.use(router.routes());
    parentRouter.use(router.allowedMethods());

    return parentRouter;
  },
};
