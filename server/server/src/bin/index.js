#! /usr/bin/env node
// @flow

import path from 'path';
import net from 'net';

import parseArgv from '@babel/cli/lib/babel/options';
import debug from 'debug';
import execa, {
  type ExecaPromise as execaPromiseType,
  type ExecaError as execaErrorType,
} from 'execa';
import getPort from 'get-port';
import chalk from 'chalk';
import transformer from 'strong-log-transformer';

import { handleUnhandledRejection, createLogger } from '@mikojs/utils';

import findOptionsPath from 'utils/findOptionsPath';

const debugLog = debug('server:bin');
const logger = createLogger('@mikojs/server');

handleUnhandledRejection();

(async () => {
  // [start] babel build
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

  let babelSubprocess: execaPromiseType = execa(
    path.resolve(__dirname, './runBabel.js'),
    [
      JSON.stringify({
        ...opts,
        cliOptions: {
          ...opts.cliOptions,
          watch: false,
        },
      }),
    ],
  );

  babelSubprocess.stdout
    .pipe(transformer({ tag: chalk`{gray   {bold @mikojs/server} [babel]}` }))
    .pipe(process.stdout);
  babelSubprocess.stderr
    .pipe(transformer({ tag: chalk`{red ✖ {bold @mikojs/server} [babel]}` }))
    .pipe(process.stderr);

  await babelSubprocess.catch((e: execaErrorType) => {
    if (dev && opts.cliOptions.watch) debugLog(e);
    else process.exit(e.exitCode || 1);
  });

  if (dev && opts.cliOptions.watch) {
    // TODO: https://github.com/eslint/eslint/issues/11899
    // eslint-disable-next-line require-atomic-updates
    babelSubprocess = execa(path.resolve(__dirname, './runBabel.js'), [
      JSON.stringify({
        ...opts,
        cliOptions: {
          ...opts.cliOptions,
          skipInitialBuild: true,
          watch: true,
        },
      }),
    ]);

    babelSubprocess.stdout
      .pipe(transformer({ tag: chalk`{gray   {bold @mikojs/server} [babel]}` }))
      .pipe(process.stdout);
    babelSubprocess.stderr
      .pipe(transformer({ tag: chalk`{red ✖ {bold @mikojs/server} [babel]}` }))
      .pipe(process.stderr);
  }
  // [end] babel build

  const port = await getPort();
  let subprocess: execaPromiseType;
  debugLog(port);

  const server = net.createServer((socket: net.Socket) => {
    let timeout: TimeoutID;

    socket.setEncoding('utf8');

    socket.write(
      JSON.stringify({
        serverFile: customFile
          ? path.resolve(customFile)
          : path.resolve(__dirname, '../defaults'),
        src: opts.cliOptions.filenames[0],
        dir: opts.cliOptions.outDir,
        dev,
        watch: opts.cliOptions.watch,
        port: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
      }),
    );

    socket.on('data', async (data: string) => {
      debug(data);

      switch (data) {
        case 'restart':
          clearTimeout(timeout);
          timeout = setTimeout(async () => {
            logger
              .info('Restart the server')
              .info('')
              .info(chalk`  - Use {cyan rs} to restart the server`)
              .info(
                chalk`  - Use {cyan close} or {cyan ctrl + c} to stop the server`,
              )
              .info('');

            subprocess.cancel();
            await subprocess.catch(debugLog);
            // TODO: https://github.com/eslint/eslint/issues/11899
            // eslint-disable-next-line require-atomic-updates
            subprocess = execa(
              path.resolve(__dirname, './runServer.js'),
              [port],
              {
                stdio: 'inherit',
              },
            );
          }, 100);
          break;

        case 'close':
          subprocess.cancel();
          babelSubprocess.cancel();
          await subprocess.catch(debugLog);
          await babelSubprocess.catch(debugLog);
          server.close();
          break;

        default:
          throw new Error(`Can not use ${data} to operate the server`);
      }
    });

    socket.on('close', async () => {
      debugLog('client close');
    });
  });

  server.listen(port, () => {
    debugLog(`Open watch server at ${port}`);

    subprocess = execa(path.resolve(__dirname, './runServer.js'), [port], {
      stdio: 'inherit',
    });

    if (dev && opts.cliOptions.watch)
      logger
        .info('In the watch mode, you can do:')
        .info('')
        .info(chalk`  - Use {cyan rs} to restart the server`)
        .info(chalk`  - Use {cyan close} or {cyan ctrl + c} to stop the server`)
        .info('');
  });
})();
