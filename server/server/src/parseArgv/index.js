// @flow

import fs from 'fs';
import path from 'path';
import { type Server as ServerType } from 'http';

import ora from 'ora';
import chalk from 'chalk';

import { createLogger, requireModule } from '@mikojs/utils';
import commander, { type optionsType } from '@mikojs/commander';
import { type mergeEventType } from '@mikojs/merge-dir';
import tools from '@mikojs/merge-dir/lib/utils/tools';

import server, { type middlewareType } from '../index';

import buildLog from './buildLog';
import getDefaultOptions, {
  type defaultOptionsType as getDefaultOptionsDefaultOptionsType,
} from './getDefaultOptions';
import handleErrorMessage from './handleErrorMessage';

export type defaultOptionsType = getDefaultOptionsDefaultOptionsType;
export type resultType<O> = [
  mergeEventType | string,
  string,
  O & {| port?: number, prefix?: string |},
];

/**
 * @param {string} name - command name
 * @param {Function} buildOptions - build the command options for the server
 * @param {Function} buildMiddleware - build the middleware for the server
 * @param {Array} argv - command line
 *
 * @return {ServerType} - server or null
 */
export default async <Req = {}, Res = {}, O = {}>(
  name: string,
  buildOptions: (defaultOptions: defaultOptionsType) => optionsType,
  buildMiddleware: (
    sourcePath: string,
    prefix?: string,
    options?: O,
  ) => middlewareType<Req, Res>,
  argv: $ReadOnlyArray<string>,
): Promise<?ServerType | resultType<O>> => {
  const logger = createLogger(`@mikojs/${name}`, ora({ discardStdin: false }));
  const defaultOptions = getDefaultOptions(name);
  const result = await commander<resultType<O>>(buildOptions(defaultOptions))(
    argv,
  );
  const [command, sourcePath, { port = 3000, prefix, ...options }] = result;

  if (result.length === 1) {
    logger.fail(
      chalk`Should give a command, use {green -h} to get the more information.`,
    );
    throw new Error('empty command');
  }

  if (command !== 'dev' || command !== 'start' || command !== 'build')
    return result;

  server.set(command === 'start' ? 'run' : command);

  try {
    const resolvedPath = path.resolve(sourcePath);
    const middleware = fs.lstatSync(resolvedPath).isFile()
      ? requireModule<middlewareType<Req, Res>>(resolvedPath)
      : buildMiddleware(resolvedPath, prefix, options);

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
