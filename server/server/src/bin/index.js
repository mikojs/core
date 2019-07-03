#! /usr/bin/env node
/**
 * fixme-flow-file-annotation
 *
 * Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import path from 'path';

import { invariant, emptyFunction } from 'fbjs';
import commander from 'commander';
import chalk from 'chalk';

import type reactType from '@cat-org/koa-react';
import type graphqlType from '@cat-org/koa-graphql';

import parseArgv from '@babel/cli/lib/babel/options';

import server, { type contextType as serverContextType } from '../index';

import { version } from '../../package.json';

import defaultMiddleware from 'defaults/middleware';
import DefaultReact from 'defaults/react';
import DefaultGraphql from 'defaults/graphql';

import loadModule from 'utils/loadModule';

const program = new commander.Command('server')
  .version(version, '-v, --version')
  .usage(chalk`{gray [options]}`)
  .description(
    chalk`Example:
  server {gray --skip-build}`,
  )
  .option('--skip-server', 'skip run server, just run command')
  .option('--skip-build', 'skip build js')
  .option('--skip-relay', 'skip run relay-compiler')
  .allowUnknownOption();

let react: reactType | DefaultReact;
let graphql: graphqlType | DefaultGraphql;

/**
 * @example
 * run(context)
 *
 * @param {serverContext} context - server context
 *
 * @return {Koa} - koa server
 */
const run = async (context: serverContextType): Promise<http$Server> => {
  context.dev = context.dev || true;
  context.watch = context.watch || false;

  return (
    (await server.init(context))
    |> (await server.event(async () => {
      react = new (loadModule('@cat-org/koa-react', DefaultReact))(
        path.resolve(context.dir, './pages'),
        { dev: context.dev, exclude: /__generated__/ }
          |> ((options: {}) =>
            loadModule(
              '@cat-org/use-css',
              emptyFunction.thatReturnsArgument,
              options,
            ))
          |> ((options: {}) =>
            loadModule(
              '@cat-org/use-less',
              emptyFunction.thatReturnsArgument,
              options,
            )),
      );
      graphql = new (loadModule('@cat-org/koa-graphql', DefaultGraphql))(
        path.resolve(context.dir, './graphql'),
        { dev: context.dev && context.watch },
      );

      if (process.env.NODE_ENV !== 'test') {
        const {
          skipServer = false,
          skipBuild = false,
          skipRelay = false,
        } = program.parse([...process.argv]);

        if (!skipRelay) {
          await graphql.relay(['--src', context.src]);

          if (context.dev && context.watch)
            graphql.relay(['--src', context.src, '--watch']);
        }

        if (!skipBuild && !context.dev) await react.buildJs();

        if (skipServer) process.exit(0);
      }
    }))
    |> server.use(loadModule('@cat-org/koa-base', defaultMiddleware))
    |> (undefined
      |> server.start
      |> ('/graphql'
        |> server.all
        |> server.use(
          graphql.middleware({
            graphiql: context.dev,
            pretty: context.dev,
          }),
        )
        |> server.end)
      |> server.end)
    |> server.use(await react.middleware())
    |> server.run
  );
};

(async () => {
  if (module.parent) return;

  const filterArgv = process.argv.filter(
    (argv: string) =>
      !['--skip-server', '--skip-build', '--skip-relay'].includes(argv),
  );
  const {
    cliOptions: {
      filenames: [src],
      outDir,
      watch,
    },
  } = parseArgv(filterArgv);

  invariant(src && outDir, 'Must use `--out-dir` or `-d` to build the server');

  await run({
    src,
    dir: outDir,
    dev: process.env.NODE_ENV !== 'production',
    watch,
    babelOptions: filterArgv
      .slice(2)
      .filter(
        (argv: string) =>
          ![src, outDir, '-d', '--out-dir', '-w', '--watch'].includes(argv),
      ),
  });
})();

export default run;
