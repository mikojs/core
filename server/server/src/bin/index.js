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
import debug from 'debug';

import parseArgv from '@babel/cli/lib/babel/options';
import dirCommand from '@babel/cli/lib/babel/dir';

import server from '../index';

import { version } from '../../package.json';

import defaultMiddleware from 'defaults/middleware';
import DefaultReact from 'defaults/react';
import DefaultGraphql from 'defaults/graphql';

import loadModule from 'utils/loadModule';

const debugLog = debug('server:bin');
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

const {
  skipServer = false,
  skipBuild = false,
  skipRelay = false,
  options,
} = program.parse([...process.argv]);

/**
 * @example
 * run(context)
 *
 * @param {object} context - server context
 *
 * @return {object} - http server
 */
const run = async ({
  src,
  dir,
  dev = true,
  watch = false,
  port,
}: {|
  src: string,
  dir: string,
  dev?: boolean,
  watch?: boolean,
  port?: number,
|}): Promise<http$Server> => {
  debugLog({
    src,
    dir,
    dev,
    watch,
    port,
  });

  const react = new (loadModule('@cat-org/koa-react', DefaultReact))(
    path.resolve(dir, './pages'),
    { dev, exclude: /__generated__/ }
      |> ((config: {}) =>
        loadModule(
          '@cat-org/use-css',
          emptyFunction.thatReturnsArgument,
          options,
        ))
      |> ((config: {}) =>
        loadModule(
          '@cat-org/use-less',
          emptyFunction.thatReturnsArgument,
          options,
        )),
  );
  const graphql = new (loadModule('@cat-org/koa-graphql', DefaultGraphql))(
    path.resolve(dir, './graphql'),
  );

  if (process.env.NODE_ENV !== 'test') {
    if (!skipRelay) {
      await graphql.relay(['--src', src]);

      if (dev && watch) graphql.relay(['--src', src, '--watch']);
    }

    if (!skipBuild && !dev) await react.buildJs();

    if (skipServer) process.exit(0);
  }

  return (
    server.init()
    |> server.use(loadModule('@cat-org/koa-base', defaultMiddleware))
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
    |> (dev
      ? server.watch(dir, [react.update, graphql.update])
      : emptyFunction.thatReturnsArgument)
  );
};

(async () => {
  if (module.parent) return;

  const dev = process.env.NODE_ENV !== 'production';
  const opts = parseArgv(
    process.argv.filter((argv: string) =>
      options.some(
        ({ short, long }: { short: string, long: string }) =>
          short !== argv && long !== argv,
      ),
    ),
  );

  invariant(
    opts.cliOptions.outDir,
    'Must use `--out-dir` or `-d` to build the server',
  );

  await dirCommand({
    ...opts,
    cliOptions: {
      ...opts.cliOptions,
      watch: false,
    },
  });

  if (dev && opts.cliOptions.watch)
    dirCommand({
      ...opts,
      cliOptions: {
        ...opts.cliOptions,
        skipInitialBuild: true,
        watch: true,
      },
    });

  await run({
    src: opts.cliOptions.filenames[0],
    dir: opts.cliOptions.outDir,
    dev,
    watch: opts.cliOptions.watch,
  });
})();

export default run;
