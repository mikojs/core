#! /usr/bin/env node
// @flow

import path from 'path';

import execa from 'execa';
import debug from 'debug';
import npmWhich from 'npm-which';
import getPort from 'get-port';
import findProcess from 'find-process';
import chalk from 'chalk';

import { handleUnhandledRejection, createLogger } from '@mikojs/utils';

import configs from 'utils/configs';
import cliOptions from 'utils/cliOptions';
import generateFiles from 'utils/generateFiles';

const logger = createLogger('@mikojs/configs');

handleUnhandledRejection();

(async () => {
  const options = cliOptions(process.argv);

  if (typeof options === 'boolean') {
    if (!options) process.exit(1);
    return;
  }

  const { cli, argv, env, cliName } = options;
  const debugLog = debug(`configs:bin[${cliName}]`);
  const { customConfigsPath } = configs;

  if (customConfigsPath)
    logger
      .info('Using external configuration')
      .info(`Location: ${customConfigsPath}`);

  switch (cli) {
    case 'install':
      await execa(argv[0], argv.slice(1), {
        stdio: 'inherit',
      });
      return;

    default: {
      try {
        const [existServer] = await findProcess(
          'name',
          '@mikojs/configs',
          true,
        );

        debugLog(existServer);

        const port = existServer
          ? existServer.cmd.split(/ /).slice(-1)[0]
          : await getPort();

        debugLog(port);

        if (!existServer)
          execa(path.resolve(__dirname, './runServer.js'), [port], {
            detached: true,
          });

        // [start]
        // handle config and ignore files
        if (!generateFiles(cliName, port)) {
          process.exit(1);
          return;
        }

        // run command
        logger.log(
          chalk`Run command: {gray ${[path.basename(cli), ...argv].join(' ')}}`,
        );

        const { exitCode } = await execa(
          npmWhich(process.cwd()).sync('node'),
          [cli, ...argv],
          {
            stdio: 'inherit',
            env,
          },
        );

        debugLog(exitCode);
        process.exit(exitCode);
      } catch (e) {
        logger.log('Run command fail');
        debugLog(e);

        process.exit(e.exitCode || 1);
      }
      return;
    }
  }
})();
