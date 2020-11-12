// @flow

import fs from 'fs';
import path from 'path';
import { type Server as ServerType } from 'http';

import ora from 'ora';
import chalk from 'chalk';

import commander, { type optionsType } from '@mikojs/commander';
import { createLogger, requireModule } from '@mikojs/utils';
import tools, {
  type fileDataType,
  type toolsType,
} from '@mikojs/merge-dir/lib/utils/tools';

import server, { type middlewareType } from './index';

export type defaultOptionsType = $Diff<optionsType, {| version: mixed |}>;

/**
 * @param {string} name - command name
 * @param {createLogger} logger - command logger
 *
 * @return {toolsType} - tools.log
 */
export const buildLog = (
  name: string,
  logger: $Call<typeof createLogger, string>,
): $NonMaybeType<$PropertyType<toolsType, 'log'>> => (
  fileData: fileDataType | 'done',
) => {
  if (fileData === 'done') logger.succeed('The server is updated');
  else
    logger
      .info(
        fileData.exists
          ? chalk`File {green (${fileData.filePath})} is changed`
          : chalk`File {red (${fileData.filePath})} is removed`,
      )
      .start('The server is updating');
};

/**
 * @param {string} name - command name
 * @param {Error} err - err message
 *
 * @return {string} - new error message
 */
export const handleErrorMessage = (name: string, err: Error): string =>
  /^Cannot find module.*main.js/.test(err.message)
    ? chalk`Could not find a valid build. Try using {green ${name} build} before running the server`
    : err.message.replace(/\nRequire stack:(.|\n)*/, '');

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
  const defaultCommand = {
    args: '<source-path>',
    options: [
      {
        flags: '-p, --port <port>',
        description: chalk`the port of the {green ${name}} server`,
      },
      {
        flags: '--prefix <prefix>',
        description: chalk`the prefix of the {green ${name}} server`,
      },
    ],
  };

  const [
    command,
    sourcePath,
    { port = 3000, prefix }: {| port: number, prefix?: string |},
  ] = await commander(
    buildOptions({
      name,
      description: chalk`control a {green ${name}} server`,
      commands: {
        dev: {
          ...defaultCommand,
          description: chalk`start a {green ${name}} server in the {cyan dev} mode`,
        },
        start: {
          ...defaultCommand,
          description: chalk`start a {green ${name}} server in the {cyan prod} mode`,
        },
        build: {
          ...defaultCommand,
          description: chalk`build a {cyan prod} {green ${name}} server`,
        },
      },
    }),
  )(argv);

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
