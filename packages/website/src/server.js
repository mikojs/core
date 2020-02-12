/**
 * fixme-flow-file-annotation
 *
 * TODO: Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import path from 'path';

import { emptyFunction } from 'fbjs';

import server, { type contextType } from '@mikojs/server';
import base from '@mikojs/koa-base';
import koaGraphql from '@mikojs/koa-graphql';
import koaReact from '@mikojs/koa-react';
import useCss from '@mikojs/use-css';
import useLess from '@mikojs/use-less';

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
}: contextType): Promise<?http$Server> => {
  const graphql = koaGraphql(path.resolve(dir, './graphql'));

  await graphql.runRelayCompiler(['--src', src, '--exclude', '**/server.js']);

  if (dev && watch)
    graphql.runRelayCompiler([
      '--src',
      src,
      '--watch',
      '--exclude',
      '**/server.js',
    ]);

  if (process.env.SKIP_SERVER) {
    close();
    return null;
  }

  const react = await koaReact(
    path.resolve(dir, './pages'),
    { dev, exclude: /__generated__/ } |> useCss |> useLess,
  );

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
