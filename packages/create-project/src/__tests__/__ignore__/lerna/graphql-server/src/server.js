// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';

import server, { type contextType } from '@mikojs/server';
import base from '@mikojs/koa-base';
import Graphql from '@mikojs/koa-graphql';

/**
 * @example
 * server(context)
 *
 * @param {contextType} context - the context of the server
 *
 * @return {object} - http server
 */
export default ({
  dir,
  dev,
  watch,
  port,
}: contextType): Promise<http$Server> => {
  const graphql = new Graphql(path.resolve(dir, './graphql'));

  return (
    server.init()
    |> server.use(base)
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
    |> server.run(port)
    |> (dev && watch
      ? server.watch(dir, [graphql.update])
      : emptyFunction.thatReturnsArgument)
  );
};
