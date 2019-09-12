#! /usr/bin/env node
// @flow

import path from 'path';

import parseArgv from '@babel/cli/lib/babel/options';
import dirCommand from '@babel/cli/lib/babel/dir';
import debug from 'debug';
import execa, {
  type ExecaPromise as execaPromiseType,
  type ExecaError as execaErrorType,
} from 'execa';
import chokidar from 'chokidar';

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
    logger.info('Run the custom server');
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

  const serverArgu = [
    customFile
      ? path.resolve(customFile)
      : path.resolve(__dirname, '../defaults'),
    '--src',
    opts.cliOptions.filenames[0],
    '--dir',
    opts.cliOptions.outDir,
    ...(opts.cliOptions.watch ? ['--watch'] : []),
  ];

  let subprocess: execaPromiseType = execa(
    path.resolve(__dirname, './server.js'),
    serverArgu,
    {
      stdio: 'inherit',
    },
  );

  if (!customFile || !opts.cliOptions.watch) {
    await subprocess.catch(({ exitCode }: execaErrorType) => {
      process.exit(exitCode);
    });
    return;
  }

  logger.log(
    'Use `rs` to restart the custom server',
    'Use `exit` or `ctrl + c` to stop the custom server',
  );

  let timeout: TimeoutID;
  /**
   * @example
   * restart()
   */
  const restart = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      logger.log(
        'Restart the custom server',
        'Use `rs` to restart the custom server',
        'Use `exit` or `ctrl + c` to stop the custom server',
      );

      subprocess.cancel();
      subprocess = execa(path.resolve(__dirname, './server.js'), serverArgu, {
        stdio: 'inherit',
      });
    }, 100);
  };

  chokidar.watch(path.resolve(opts.cliOptions.outDir)).on('change', restart);
  process.stdin.on('data', (data: Buffer) => {
    const str = data
      .toString()
      .trim()
      .toLowerCase();

    if (str === 'rs') restart();
    else if (str === 'exit') process.exit(0);
  });
})();
