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

import server from '../index';

import loadModule from 'utils/loadModule';

const {
  cliOptions: { outDir },
} = parseArgv(process.argv);

if (!outDir)
  throw new Error('Must use `--out-dir` or `-d` to build the server');

const context = {
  dev: process.env.NODE_ENV !== 'production',
  dir: outDir,
  babelOptions: process.argv
    .slice(2)
    .filter((argv: string) => !['-w', '--watch'].includes(argv))
    .join(' '),
};

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

(async () => {
  // eslint-disable-next-line flowtype/no-unused-expressions
  (await server.init(context))
    |> server.use(loadModule('@cat-org/default-middleware', defaultMiddleware))
    |> server.use(
      await loadModule(
        '@cat-org/react-middleware',
        defaultMiddleware,
        path.resolve(context.dir, './pages'),
        { dev: context.dev }
          |> loadModule('@cat-org/use-css', emptyFunction.thatReturnsArgument)
          |> loadModule('@cat-org/use-less', emptyFunction.thatReturnsArgument),
      ),
    )
    |> server.run(parseInt(process.env.PORT || 8000, 10));
})();
