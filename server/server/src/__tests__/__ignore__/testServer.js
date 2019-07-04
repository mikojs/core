/**
 * fixme-flow-file-annotation
 *
 * Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import { type Context as koaContextType } from 'koa';

import server from '../../index';

const context = {
  dev: false,
  dir: 'lib',
  babelOptions: [],
};

/**
 * @example
 * customMiddleware('test')
 *
 * @param {string} newBody - new body
 *
 * @return {Function} - koa middleware
 */
const customMiddleware = (newBody: string) => async (
  ctx: koaContextType,
  next: () => Promise<void>,
) => {
  ctx.body = [...(ctx.body || []), newBody];
  await next();
};

/**
 * @example
 * testServer()
 *
 * @return {httpServer} - http server
 */
export default async () =>
  (await server.init(context))
  |> server.use(customMiddleware('entry router'))
  |> ('/test'
    |> server.start
    |> server.use(customMiddleware('test'))
    |> ('/get'
      |> server.get
      |> server.use(customMiddleware('get'))
      |> server.end)
    |> ('/post'
      |> server.post
      |> server.use(customMiddleware('post'))
      |> server.end)
    |> ('/put'
      |> server.put
      |> server.use(customMiddleware('put'))
      |> server.end)
    |> ('/del'
      |> server.del
      |> server.use(customMiddleware('del'))
      |> server.end)
    |> ('/all'
      |> server.all
      |> server.use(customMiddleware('all'))
      |> server.end)
    |> server.end)
  |> server.run;
