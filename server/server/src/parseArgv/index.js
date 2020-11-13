// @flow

import fs from 'fs';
import path from 'path';
import { type Server as ServerType } from 'http';

import ora from 'ora';
import chalk from 'chalk';

import commander, { type optionsType } from '@mikojs/commander';
import { createLogger, requireModule } from '@mikojs/utils';
import tools from '@mikojs/merge-dir/lib/utils/tools';

import server, { type middlewareType } from '../index';

import buildLog from './buildLog';
import getDefaultOptions, {
  type defaultOptionsType as getDefaultOptionsDefaultOptionsType,
} from './getDefaultOptions';
import handleErrorMessage from './handleErrorMessage';

export type defaultOptionsType = getDefaultOptionsDefaultOptionsType;

/**
 * @param {string} name - command name
 * @param {Function} buildOptions - build the command options for the server
 * @param {Function} buildMiddleware - build the middleware for the server
 * @param {Array} argv - command line
 *
 * @return {ServerType} - server or null
 */
export default async <Req = {}, Res = {}>(
  name: string,
  buildOptions: (defaultOptions: defaultOptionsType) => optionsType,
  buildMiddleware: (
    sourcePath: string,
    prefix?: string,
  ) => middlewareType<Req, Res>,
  argv: $ReadOnlyArray<string>,
): Promise<?ServerType> => {
  const logger = createLogger(`@mikojs/${name}`, ora({ discardStdin: false }));
  const defaultOptions = getDefaultOptions(name);
  const result = await commander(buildOptions(defaultOptions))(argv);
  const [
    command,
    sourcePath,
    { port = 3000, prefix }: {| port: number, prefix?: string |} = {},
  ] = result;

  if (!Object.keys(defaultOptions.commands).includes(command)) return result;

  server.set(command === 'start' ? 'run' : command);

  try {
    const resolvedPath = path.resolve(sourcePath);
    const middleware = fs.lstatSync(resolvedPath).isFile()
      ? requireModule<middlewareType<Req, Res>>(resolvedPath)
      : buildMiddleware(resolvedPath, prefix);

    if (command === 'build') {
      logger.start('Building the server');
      (await server.ready())();
      logger.succeed(chalk`Use {green ${name} start} to run the server`);

      return null;
    }

    logger.start('Preparing the server');

    return await server.run(middleware, port, () => {
      logger.succeed(
        chalk`Running the server on {underline http://localhost:${port}}`,
      );
      tools.set({ log: buildLog(name, logger) });
    });
  } catch (e) {
    logger.fail(handleErrorMessage(name, e));
    throw e;
  }
};
