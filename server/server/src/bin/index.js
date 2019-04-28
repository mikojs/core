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

import defaultMiddleware from '@cat-org/default-middleware';
import react from '@cat-org/react-middleware';

import server from '../index';

// TODO: add checking should use middleware
(async () => {
  try {
    const {
      cliOptions: { filenames, outFile },
    } = parseArgv(process.argv);
    const babelOptions = process.argv
      .slice(2)
      .filter((argv: string) => !['-w', '--watch'].includes(argv))
      .join(' ');
    // $FlowFixMe flow not yet support
    const dir = filenames?.map((filename: string) =>
      outFile
        ? path.dirname(filename).replace(/^\.\//, '')
        : filename.replace(/^\.\//, ''),
    );

    if (!dir)
      throw new Error('Must use to build the folder like: `server src -d lib`');

    await execa.shell(`babel ${babelOptions}`, {
      stdio: 'inherit',
    });

    // eslint-disable-next-line flowtype/no-unused-expressions
    server.init()
      |> server.use(defaultMiddleware)
      |> server.use(await react())
      |> server.run(parseInt(process.env.PORT || 8000, 10));

    chokidar
      .watch(dir, {
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
