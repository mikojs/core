// @flow

import http, { type Server as ServerType } from 'http';

import chalk from 'chalk';
import commander from 'commander';

import { version } from '../package.json';

import { type callbackType } from './types';
import buildMiddleware from './index';

/**
 * @param {string} folderPath - folder path
 * @param {number} port - server port
 * @param {callbackType} callback - callback function to handle file
 *
 * @return {ServerType} - server object
 */
export const buildServer = async (
  folderPath: string,
  port: number,
  callback: callbackType,
) =>
  http.createServer(await buildMiddleware(folderPath, callback)).listen(port);

/**
 * @param {string} cliName - cli name
 * @param {number} port - server port
 * @param {Array} argv - process argv
 * @param {callbackType} callback - callback function to handle file
 *
 * @return {ServerType} - server object
 */
export default async (
  cliName: string,
  port: number,
  argv: $ReadOnlyArray<string>,
  callback: callbackType,
): Promise<ServerType> => {
  const folderPath = await new Promise(resolve =>
    new commander.Command(cliName)
      .version(version, '-v, --version')
      .arguments('<folderPath>')
      .description(
        chalk`Example:
  ${cliName} {green folderPath}`,
      )
      .action(resolve)
      .parse(argv),
  );

  return buildServer(folderPath, port, callback);
};
