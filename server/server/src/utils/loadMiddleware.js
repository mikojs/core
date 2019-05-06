// @flow

import {
  type Context as koaContextType,
  type Middleware as koaMiddlewareType,
} from 'koa';

export default (
  moduleName: string,
  ...options: $ReadOnlyArray<mixed>
): koaMiddlewareType => {
  try {
    if (options.length === 0)
      return require(moduleName).default || require(moduleName);

    return (require(moduleName).default || require(moduleName))(...options);
  } catch (e) {
    if (/Cannot find module/.test(e.message))
      return async (ctx: koaContextType, next: () => Promise<void>) => {
        await next();
      };

    throw e;
  }
};
