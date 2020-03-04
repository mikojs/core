/**
 * fixme-flow-file-annotation
 *
 * TODO: Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import path from 'path';

import server from '@mikojs/server';
import { type returnType as chokidarType } from '@mikojs/server/lib/helpers/buildChokidar';
import { type returnType as babelType } from '@mikojs/server/lib/helpers/buildBabel';
import base from '@mikojs/koa-base';
import koaGraphql from '@mikojs/koa-graphql';
import koaReact from '@mikojs/koa-react';
import useCss from '@mikojs/use-css';
import useLess from '@mikojs/use-less';

(async (): Promise<http$Server> => {
  const src = path.resolve(__dirname, '../src');
  const dev = process.env.NODE_ENV !== 'production';
  const build = Boolean(process.env.BUILD);
  const relayArgv = ['--src', src, '--exclude', 'server.js'];

  const babel: babelType = server.helpers('babel');
  const chokidar: chokidarType = server.helpers('chokidar');
  const graphql = koaGraphql(path.resolve(__dirname, './graphql'));
  const react = koaReact(
    path.resolve(__dirname, './pages'),
    { dev, exclude: /__generated__/ } |> useCss |> useLess,
  );

  babel.command([src, '-d', __dirname]);

  chokidar
    .add(__dirname)
    .on(['add', 'change'], graphql.update)
    .on(['add', 'change'], react.update);

  server
    .on('build', babel.build)
    .on('watch', babel.watch)
    .on('watch', chokidar.watch)
    .on(['build', 'run'], () => graphql.runRelayCompiler(relayArgv))
    .on('watch', () => graphql.runRelayCompiler([...relayArgv, '--watch']))
    .on(['build', 'watch'], react.runWebpack);

  return (
    (await server.init({ dev, build }))
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
})();
