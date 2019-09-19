#! /usr/bin/env node
// @flow

import path from 'path';
import net from 'net';

import parseArgv from '@babel/cli/lib/babel/options';
import dirCommand from '@babel/cli/lib/babel/dir';
import debug from 'debug';
import execa, {
  type ExecaPromise as execaPromiseType,
  type ExecaError as execaErrorType,
} from 'execa';
import getPort from 'get-port';
import chalk from 'chalk';

import { handleUnhandledRejection } from '@mikojs/utils';

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

  const port = opts.cliOptions.watch ? await getPort() : null;
  const serverArgu = [
    customFile
      ? path.resolve(customFile)
      : path.resolve(__dirname, '../defaults'),
    '--src',
    opts.cliOptions.filenames[0],
    '--dir',
    opts.cliOptions.outDir,
    ...(opts.cliOptions.watch ? ['--watch'] : []),
    ...(port ? ['--watch-port', port] : []),
  ];

  let subprocess: execaPromiseType = execa(
    path.resolve(__dirname, './server.js'),
    serverArgu,
    {
      stdio: 'inherit',
    },
  );

  if (!port) {
    await subprocess.catch(({ exitCode }: execaErrorType) => {
      process.exit(exitCode);
    });
    return;
  }

  const server = net.createServer((socket: net.Socket) => {
    let timeout: TimeoutID;

    socket.setEncoding('utf8');
    socket.on('data', (data: string) => {
      switch (data) {
        case 'restart':
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            logger.log(
              'Restart the server',
              '',
              chalk`- Use {cyan rs} to restart the server`,
              chalk`- Use {cyan exit} or {cyan ctrl + c} to stop the server`,
              '',
            );

            subprocess.cancel();
            subprocess = execa(
              path.resolve(__dirname, './server.js'),
              serverArgu,
              {
                stdio: 'inherit',
              },
            );
          }, 100);
          break;

        case 'exit':
          process.exit(0);
          break;

        default:
          throw logger.fail(`Can not use ${data} to operate the server`);
      }
    });
  });

  server.listen(port, undefined, undefined, () => {
    debugLog(`Open watch server at ${port}`);
    logger.log(
      'In the watch mode, you can do:',
      '',
      chalk`- Use {cyan rs} to restart the server`,
      chalk`- Use {cyan exit} or {cyan ctrl + c} to stop the server`,
      '',
    );
  });
})();
