#! /usr/bin/env node
// @flow

import path from 'path';

import parseArgv from '@babel/cli/lib/babel/options';
import dirCommand from '@babel/cli/lib/babel/dir';
import debug from 'debug';
import execa from 'execa';

import { handleUnhandledRejection } from '@cat-org/utils';

import findOptionsPath from 'utils/findOptionsPath';
import logger from 'utils/logger';

const debugLog = debug('server:bin');

handleUnhandledRejection();

(async () => {
  const dev = process.env.NODE_ENV !== 'production';
  const opts = parseArgv(process.argv);
  const customFile = opts.cliOptions.outFile;

  if (customFile) {
    logger.info('Run with custom server');
    debugLog(opts);

    const { src, dir } = findOptionsPath(
      opts.cliOptions.filenames[0],
      opts.cliOptions.outFile,
    );

    opts.cliOptions = {
      ...opts.cliOptions,
      outFile: undefined,
      filenames: [src],
      outDir: dir,
    };
  }

  debugLog(opts);

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

  execa(
    path.resolve(__dirname, './server.js'),
    [
      customFile
        ? path.resolve(customFile)
        : path.resolve(__dirname, '../defaults'),
      '--src',
      opts.cliOptions.filenames[0],
      '--dir',
      opts.cliOptions.outDir,
      ...(opts.cliOptions.watch ? ['--watch'] : []),
    ],
    {
      stdio: 'inherit',
    },
  );
})();
