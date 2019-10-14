#! /usr/bin/env node
// @flow

import path from 'path';

import execa from 'execa';
import debug from 'debug';
import npmWhich from 'npm-which';
import getPort from 'get-port';
import chalk from 'chalk';

import { handleUnhandledRejection, createLogger } from '@mikojs/utils';

import configs from 'utils/configs';
import cliOptions from 'utils/cliOptions';
import findMainServer from 'utils/findMainServer';
import sendToServer from 'utils/sendToServer';
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

    case 'remove':
      return;

    default: {
      const debugPort = !process.env.DEBUG_PORT
        ? -1
        : parseInt(process.env.DEBUG_PORT, 10);

      if (
        process.env.DEBUG_PORT &&
        (await getPort({ port: debugPort })) === debugPort
      )
        throw new Error('Can not find the debug server');

      try {
        const mainServer = await findMainServer();
        const port = mainServer?.port || (await getPort());

        debugLog({ mainServer, port });

        if (!mainServer) {
          execa(path.resolve(__dirname, './runServer.js'), [port], {
            detached: true,
            stdio: 'ignore',
          }).unref();
          await new Promise(resolve =>
            sendToServer('{}', () => {
              debugLog('connect');
              resolve();
            }),
          );
        }

        // [start]
        // handle config and ignore files
        if (!(await generateFiles(cliName))) {
          process.exit(1);
          return;
        }

        // run command
        logger.log(
          chalk`Run command: {gray ${[path.basename(cli), ...argv].join(' ')}}`,
        );

        await execa(npmWhich(process.cwd()).sync('node'), [cli, ...argv], {
          stdio: 'inherit',
          env,
        });
      } catch (e) {
        logger.log('Run command fail');
        debugLog(e);
        process.exit(e.exitCode || 1);
      }
      return;
    }
  }
})();
