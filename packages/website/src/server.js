/**
 * fixme-flow-file-annotation
 *
 * TODO: Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import path from 'path';

import server, { type contextType } from '@mikojs/server';
import { type returnType as chokidarType } from '@mikojs/server/lib/helpers/buildChokidar';
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
export default async ({ port }: contextType): Promise<http$Server> => {
  const src = path.resolve(__dirname, '../src');
  const dev = process.env.NODE_ENV !== 'production';
  const graphql = koaGraphql(path.resolve(__dirname, './graphql'));
  const react = koaReact(
    path.resolve(__dirname, './pages'),
    { dev, exclude: /__generated__/ } |> useCss |> useLess,
  );
  const chokidar: chokidarType = server.helpers('chokidar');

  chokidar
    .add(__dirname)
    .on(['add', 'change'], graphql.update)
    .on(['add', 'change'], react.update);

  server
    .on(['build', 'run'], () =>
      graphql.runRelayCompiler(['--src', src, '--exclude', '**/server.js']),
    )
    .on('watch', () =>
      graphql.runRelayCompiler([
        '--src',
        src,
        '--watch',
        '--exclude',
        '**/server.js',
      ]),
    )
    .on(['build', 'watch'], react.runWebpack)
    .on('watch', chokidar.run);

  return (
    (await server.init({ dev, port }))
    |> server.use(base)
    |> ('/graphql'
      |> server.start
      |> server.use(
        graphql.middleware({
          graphiql: dev,
          pretty: dev,
        }),
      )
      |> server.end)
    |> server.use(react.middleware)
    |> server.run
  );
};
