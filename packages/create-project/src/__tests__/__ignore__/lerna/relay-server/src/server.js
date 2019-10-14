// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';

import server, { type contextType } from '@mikojs/server';
import base from '@mikojs/koa-base';
import Graphql from '@mikojs/koa-graphql';
import React from '@mikojs/koa-react';

/**
 * @example
 * server(context)
 *
 * @param {contextType} context - the context of the server
 *
 * @return {object} - http server
 */
export default async ({
  src,
  dir,
  dev,
  watch,
  port,
  close,
}: contextType): Promise<http$Server> => {
  const graphql = new Graphql(path.resolve(dir, './graphql'));
  const react = new React(path.resolve(dir, './pages'), { dev });

  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'test') {
    await graphql.relay(['--src', src]);

    if (dev && watch) graphql.relay(['--src', src, '--watch']);

    if (process.env.SKIP_SERVER) close();
  }

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
    |> server.use(await react.middleware())
    |> server.run(port)
    |> (dev && watch
      ? server.watch(dir, [graphql.update, react.update])
      : emptyFunction.thatReturnsArgument)
  );
};
