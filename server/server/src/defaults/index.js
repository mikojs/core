/**
 * fixme-flow-file-annotation
 *
 * TODO: Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import path from 'path';

import { emptyFunction } from 'fbjs';

import server, { type contextType } from '../index';

import defaultMiddleware from './middleware';
import DefaultReact from './react';
import DefaultGraphql from './graphql';

import loadModule from 'utils/loadModule';

/**
 * @example
 * defaults(context)
 *
 * @param {contextType} context - server context
 *
 * @return {object} - http server
 */
export default async ({
  src,
  dir,
  dev = true,
  watch = false,
  port,
  close = emptyFunction,
}: contextType): Promise<http$Server> => {
  const react = new (loadModule('@mikojs/koa-react', DefaultReact))(
    path.resolve(dir, './pages'),
    { dev, exclude: /__generated__/ }
      |> ((config: {}) =>
        loadModule(
          '@mikojs/use-css',
          emptyFunction.thatReturnsArgument,
          config,
        ))
      |> ((config: {}) =>
        loadModule(
          '@mikojs/use-less',
          emptyFunction.thatReturnsArgument,
          config,
        )),
  );
  const graphql = new (loadModule('@mikojs/koa-graphql', DefaultGraphql))(
    path.resolve(dir, './graphql'),
  );

  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'test') {
    if (!process.env.SKIP_RELAY) {
      await graphql.relay(['--src', src]);

      if (dev && watch) graphql.relay(['--src', src, '--watch']);
    }

    if (!process.env.SKIP_BUILD && !dev) await react.buildJs();

    if (process.env.SKIP_SERVER) close();
  }

  return (
    server.init()
    |> server.use(loadModule('@mikojs/koa-base', defaultMiddleware))
    |> (undefined
      |> server.start
      |> ('/graphql'
        |> server.all
        |> server.use(
          graphql.middleware({
            graphiql: dev,
            pretty: dev,
          }),
        )
        |> server.end)
      |> server.end)
    |> server.use(await react.middleware())
    |> server.run(port)
    |> (dev && watch
      ? server.watch(dir, [react.update, graphql.update])
      : emptyFunction.thatReturnsArgument)
  );
};
