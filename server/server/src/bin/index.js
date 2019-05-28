#! /usr/bin/env node
/**
 * fixme-flow-file-annotation
 *
 * Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import path from 'path';

import { type Context as koaContextType } from 'koa';
import { emptyFunction } from 'fbjs';

import parseArgv from '@babel/cli/lib/babel/options';

import server, { type contextType as serverContextType } from '../index';

import loadModule from 'utils/loadModule';

/**
 * @example
 * defaultMiddleware(ctx, next)
 *
 * @param {Object} ctx - koa context
 * @param {Function} next - koa next function
 */
const defaultMiddleware = async (
  ctx: koaContextType,
  next: () => Promise<void>,
) => {
  await next();
};

/**
 * @example
 * run(context)
 *
 * @param {Object} context - server context
 * @param {number} port - server port
 * @param {Function} callback - server callback
 *
 * @return {Koa} - koa server
 */
const run = async (
  context: serverContextType,
  port?: number = parseInt(process.env.PORT || 8000, 10),
  callback?: () => void,
) =>
  (await server.init(context))
  |> server.use(loadModule('@cat-org/koa-base', defaultMiddleware))
  |> (undefined
    |> server.start
    |> ('/graphql'
      |> server.all
      |> server.use(
        loadModule(
          '@cat-org/koa-graphql',
          defaultMiddleware,
          path.resolve(context.dir, './graphql'),
          {
            graphiql: context.dev,
            pretty: context.dev,
          },
        ),
      )
      |> server.end)
    |> server.end)
  |> server.use(
    await loadModule(
      '@cat-org/koa-react',
      defaultMiddleware,
      path.resolve(context.dir, './pages'),
      { dev: context.dev }
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
    ),
  )
  |> server.run(port, callback);

(() => {
  if (module.parent) return;

  const {
    cliOptions: { outDir },
  } = parseArgv(process.argv);

  if (!outDir)
    throw new Error('Must use `--out-dir` or `-d` to build the server');

  run({
    dev: process.env.NODE_ENV !== 'production',
    dir: outDir,
    babelOptions: process.argv
      .slice(2)
      .filter((argv: string) => !['-w', '--watch'].includes(argv))
      .join(' '),
  });
})();

export default run;
