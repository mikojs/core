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

import server from '../index';

import loadMiddleware from 'utils/loadMiddleware';

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

(async () => {
  // eslint-disable-next-line flowtype/no-unused-expressions
  (await server.init(context))
    |> server.use(loadMiddleware('@cat-org/default-middleware'))
    |> server.use(
      await loadMiddleware(
        '@cat-org/react-middleware',
        path.resolve(context.dir, './pages'),
        {
          dev: context.dev,
        },
      ),
    )
    |> server.run(parseInt(process.env.PORT || 8000, 10));
})();
