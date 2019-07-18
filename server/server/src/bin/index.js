#! /usr/bin/env node
// @flow

import path from 'path';

import parseArgv from '@babel/cli/lib/babel/options';
import dirCommand from '@babel/cli/lib/babel/dir';
import debug from 'debug';

import { requireModule } from '@cat-org/utils';

import findOptionsPath from 'utils/findOptionsPath';
import logger from 'utils/logger';

const debugLog = debug('server:bin');

(async () => {
  const dev = process.env.NODE_ENV !== 'production';
  const opts = parseArgv(process.argv);
  const customFile = opts.cliOptions.outFile;

  if (customFile) {
    logger.info('Run with custom server');

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

  const context = {
    src: opts.cliOptions.filenames[0],
    dir: opts.cliOptions.outDir,
    dev,
    watch: opts.cliOptions.watch,
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
  };

  debugLog(context);

  await requireModule(
    customFile
      ? path.resolve(customFile)
      : path.resolve(__dirname, '../defaults'),
  )(context);
})();
