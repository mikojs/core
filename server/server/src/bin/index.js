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
import { invariant, emptyFunction } from 'fbjs';

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

/** defaultReact */
class DefaultReact {
  /**
   * @example
   * new DefaultReact('folder path')
   *
   * @param {string} foldePath - folder path
   * @param {Object} options - koa-react options
   */
  constructor(foldePath: string, options?: {}) {}

  /**
   * @example
   * defaultReact.buildJs()
   */
  buildJs = emptyFunction;

  /**
   * @example
   * defaultReact.middleware()
   *
   * @return {Function} - koa-react middleware
   */
  middleware = () => defaultMiddleware;
}

/** defaultGraphql */
class DefaultGraphql {
  /**
   * @example
   * new DefaultGraphql('folder path')
   *
   * @param {string} foldePath - folder path
   * @param {Object} options - koa-graphql options
   */
  constructor(foldePath: string, options?: {}) {}

  /**
   * @example
   * defaultGraphql.relay()
   */
  relay = emptyFunction;

  /**
   * @example
   * defaultGraphql.middleware()
   *
   * @param {Object} options - koa-graphql options
   *
   * @return {Function} - koa-graphql middleware
   */
  middleware = (options?: {}) => defaultMiddleware;
}

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
): Promise<http$Server> => {
  const react = new (loadModule('@cat-org/koa-react', DefaultReact))(
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
  );
  const graphql = new (loadModule('@cat-org/koa-graphql', DefaultGraphql))(
    path.resolve(context.dir, './graphql'),
  );

  if (context.dev) {
    if (process.env.NODE_ENV !== 'test')
      graphql.relay(['--src', context.dir, '--watch']);
  } else {
    await graphql.relay(['--src', context.dir]);
    await react.buildJs();
  }

  return (
    (await server.init(context))
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
    |> server.run(port, callback)
  );
};

(() => {
  if (module.parent) return;

  const {
    cliOptions: { outDir },
  } = parseArgv(process.argv);

  invariant(outDir, 'Must use `--out-dir` or `-d` to build the server');

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
