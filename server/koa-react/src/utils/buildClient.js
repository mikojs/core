// @flow

import { type Middleware as koaMiddlewareType } from 'koa';
import compose from 'koa-compose';
import mount from 'koa-mount';
import koaStatic from 'koa-static';
import { invariant } from 'fbjs';

import { type webpackMiddlewarweOptionsType } from '../index';

/**
 * @example
 * buildClient(webpackMiddlewarweOptions)
 *
 * @param {webpackMiddlewarweOptionsType} webpackMiddlewarweOptions - webpack middleware options
 *
 * @return {koaMiddlewareType} - koa middleware
 */
export default (
  webpackMiddlewarweOptions: webpackMiddlewarweOptionsType,
): koaMiddlewareType => {
  invariant(
    webpackMiddlewarweOptions.config.output?.publicPath &&
      webpackMiddlewarweOptions.config.output?.path,
    'Both of `publicPath`, `path` in `webpackMiddlewarweOptions.config.output` are required',
  );

  return compose([
    mount(
      // FIXME: invariant should check type
      webpackMiddlewarweOptions.config.output?.publicPath,
      koaStatic(webpackMiddlewarweOptions.config.output?.path),
    ),
  ]);
};
