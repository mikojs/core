#! /usr/bin/env node
/**
 * fixme-flow-file-annotation
 *
 * Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import path from 'path';

import chokidar from 'chokidar';
import execa from 'execa';
import parseArgv from '@babel/cli/lib/babel/options';

import server from '../index';

import loadMiddleware from 'utils/loadMiddleware';

// TODO: add checking should use middleware
(async () => {
  try {
    const {
      cliOptions: { outDir },
    } = parseArgv(process.argv);

    if (!outDir)
      throw new Error('Must use `--out-dir` or `-d` to build the server');

    const isProduction = process.env.NODE_ENV === 'production';
    const babelOptions = process.argv
      .slice(2)
      .filter((argv: string) => !['-w', '--watch'].includes(argv))
      .join(' ');

    await execa.shell(`babel ${babelOptions}`, {
      stdio: 'inherit',
    });

    // TODO: avoid to trigger webpack again
    await new Promise(resolve => setTimeout(resolve, 1000));

    // eslint-disable-next-line flowtype/no-unused-expressions
    server.init()
      |> server.use(loadMiddleware('@cat-org/default-middleware'))
      |> server.use(
        await loadMiddleware(
          '@cat-org/react-middleware',
          path.resolve(outDir, './pages'),
          {
            dev: !isProduction,
          },
        ),
      )
      |> server.run(parseInt(process.env.PORT || 8000, 10));

    if (!isProduction) return;

    chokidar
      .watch(path.resolve(outDir), {
        ignoreInitial: true,
      })
      .on('change', (filePath: string) => {
        if (/\.jsx?/.test(filePath)) delete require.cache[filePath];
      });

    await execa.shell(`babel --skip-initial-build -w ${babelOptions}`, {
      stdio: 'inherit',
    });
  } catch (e) {
    throw e;
  }
})();
