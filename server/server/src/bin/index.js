#! /usr/bin/env node
/**
 * fixme-flow-file-annotation
 *
 * Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import path from 'path';

import parseArgv from '@babel/cli/lib/babel/options';
import fileCommand from '@babel/cli/lib/babel/file';
import dirCommand from '@babel/cli/lib/babel/dir';
import { emptyFunction } from 'fbjs';
import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';

import { requireModule } from '@cat-org/utils';

import server from '../index';

import { version } from '../../package.json';

import defaultMiddleware from 'defaults/middleware';
import DefaultReact from 'defaults/react';
import DefaultGraphql from 'defaults/graphql';

import loadModule from 'utils/loadModule';
import findOptionsPath from 'utils/findOptionsPath';
import logger from 'utils/logger';

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
          config,
        ))
      |> ((config: {}) =>
        loadModule(
          '@cat-org/use-less',
          emptyFunction.thatReturnsArgument,
          config,
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
    process.argv.filter(
      (argv: string) =>
        !options.some(
          ({ short, long }: { short: string, long: string }) =>
            short === argv || long === argv,
        ),
    ),
  );
  const customFile = opts.cliOptions.outFile;

  if (customFile) {
    const { log } = console;

    logger.info('Run with custom server');

    if (opts.cliOptions.verbose)
      log(
        `${path.relative(
          process.cwd(),
          opts.cliOptions.filenames[0],
        )} -> ${path.relative(process.cwd(), opts.cliOptions.outFile)}`,
      );

    await fileCommand({
      ...opts,
      cliOptions: {
        ...opts.cliOptions,
        watch: false,
      },
    });

    const { src, dir } = findOptionsPath(
      opts.cliOptions.filenames[0],
      opts.cliOptions.outFile,
    );

    opts.babelOptions = {
      ...opts.babelOptions,
      ignore: opts.cliOptions.filenames,
    };
    opts.cliOptions = {
      ...opts.cliOptions,
      outFile: undefined,
      filenames: [src],
      outDir: dir,
    };
  }

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

  await (customFile ? requireModule(path.resolve(customFile)) : run)({
    src: opts.cliOptions.filenames[0],
    dir: opts.cliOptions.outDir,
    dev,
    watch: opts.cliOptions.watch,
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
  });
})();

export default run;
