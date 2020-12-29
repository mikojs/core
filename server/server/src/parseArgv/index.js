// @flow

import fs from 'fs';
import path from 'path';
import { type Server as ServerType } from 'http';

import chalk from 'chalk';

import { requireModule } from '@mikojs/utils';
import commander, { type optionsType } from '@mikojs/commander';
import createLogger from '@mikojs/logger';
import { type mergeEventType } from '@mikojs/merge-dir';

import server, { type middlewareType } from '../index';

import buildLog from './buildLog';
import getDefaultOptions, {
  type defaultOptionsType as getDefaultOptionsDefaultOptionsType,
} from './getDefaultOptions';
import handleErrorMessage from './handleErrorMessage';

export type defaultOptionsType = getDefaultOptionsDefaultOptionsType;

type parsedResultType<O> = [
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
export default async <O: {}, Req = {}, Res = {}>(
  name: string,
  buildOptions: (defaultOptions: defaultOptionsType) => optionsType,
  buildMiddleware: (
    sourcePath: string,
    prefix?: string,
    options?: O,
  ) => middlewareType<Req, Res>,
  argv: $ReadOnlyArray<string>,
): Promise<?ServerType | parsedResultType<O>> => {
  const logger = createLogger(`@mikojs/${name}`);
  const defaultOptions = getDefaultOptions(name);
  const result = await commander<parsedResultType<O>>(
    buildOptions(defaultOptions),
  )(argv);

  if (result.length === 1) {
    logger.error(
      chalk`Should give a command, use {green -h} to get the more information.`,
    );
    throw new Error('Commands could not be empty.');
  }

  const [command, sourcePath, options] = result;

  if (command !== 'dev' && command !== 'start' && command !== 'build')
    return result;

  server.set(command === 'start' ? 'run' : command);

  try {
    const { port = 3000, prefix, ...customOptions } = options;
    const resolvedPath = path.resolve(sourcePath);
    const middleware = fs.lstatSync(resolvedPath).isFile()
      ? requireModule<middlewareType<Req, Res>>(resolvedPath)
      : buildMiddleware(resolvedPath, prefix, customOptions);

    if (command === 'build') {
      logger.start('Server is building.');
      (await server.ready())();
      logger.success(chalk`Use {green ${name} start} to run the server.`);

      return null;
    }

    logger.start('Server is preparing.');

    return await server.run(middleware, port, () => {
      logger.success(
        chalk`Server is running on {underline http://localhost:${port}}.`,
      );
      server.mergeDir.on('update', buildLog('update', name, logger));
      server.mergeDir.on('done', buildLog('done', name, logger));
    });
  } catch (e) {
    logger.error(handleErrorMessage(name, e));
    throw e;
  }
};
