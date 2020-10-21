// @flow

import path from 'path';
import { type Server as ServerType } from 'http';

import ora from 'ora';
import chalk from 'chalk';
import commander from 'commander';

import { createLogger } from '@mikojs/utils';

import server, { type middlewareType } from './index';

/**
 * @param {string} name - command name
 * @param {string} version - command version
 * @param {Function} buildMiddleware - build the middleware for the server
 * @param {Array} argv - command line
 *
 * @return {ServerType} - server or null
 */
export default (
  name: string,
  version: string,
  buildMiddleware: (folderPath: string) => middlewareType,
  argv: $ReadOnlyArray<string>,
): Promise<?ServerType> =>
  new Promise(resolve => {
    const logger = createLogger(
      `@mikojs/${name}`,
      ora({ discardStdin: false }),
    );
    const program = new commander.Command(name).version(
      version,
      '-v, --version',
    );

    ['dev', 'build', 'start'].forEach((command: 'dev' | 'build' | 'start') => {
      program
        .command(`${command} <folder-path>`)
        .option('-p, --port <port>', 'the port of the folder')
        .action(
          async (folderPath: string, { port = 3000 }: {| port: number |}) => {
            server.set(command === 'start' ? 'run' : command);

            const middleware = buildMiddleware(path.resolve(folderPath));

            if (command === 'build') {
              logger.start('Building the server');
              (await server.ready())();
              logger.succeed(
                chalk`Use {green ${name} start} to run the server`,
              );
              resolve(null);
            } else {
              logger.start('Preparing the server');
              resolve(
                server.run(middleware, port, () => {
                  logger.succeed('Running the server');
                }),
              );
            }
          },
        );
    });

    program.parse([...argv]);
  });
