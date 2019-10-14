// @flow

import path from 'path';

import chalk from 'chalk';

import { createLogger } from '@mikojs/utils';

import configs from './configs';

const logger = createLogger('@mikojs/configs');

export type filesDataType = $ReadOnlyArray<{|
  filePath: string,
  content: string,
|}>;

/**
 * @example
 * findFiles('cliName')
 *
 * @param {string} cliName - cli name
 *
 * @return {object} - configFiles object to generate the files
 */
const findFiles = (cliName: string): ?{ [string]: filesDataType } => {
  const {
    alias: cli = cliName,
    configFiles = {},
    ignore: getIgnore,
    ignoreName,
  } = configs.store[cliName];
  const ignore = getIgnore?.([]) || [];

  if (Object.keys(configFiles).length === 0) {
    logger
      .fail('Can not generate the config file, You can:')
      .fail('')
      .fail(
        chalk`  - Add the path of the config in {cyan \`configs.${cliName}.configFiles.${cli}\`}`,
      )
      .fail(chalk`  - Run command with {cyan \`--configs-files\`} options`)
      .fail('');
    return null;
  }

  return (Object.keys(configFiles): $ReadOnlyArray<string>).reduce(
    (result: {}, configCliName: string): {} => {
      const configPath = configFiles[configCliName];

      if (!configPath) return result;

      if (typeof configPath === 'string') {
        const ignoreFilePath =
          !ignoreName || ignore.length === 0
            ? undefined
            : path.resolve(
                configs.rootDir,
                path.dirname(configPath),
                ignoreName,
              );

        return {
          ...result,
          [configCliName]: [
            {
              filePath: path.resolve(configs.rootDir, configPath),
              content: `/* eslint-disable */ module.exports = require('@mikojs/configs')('${configCliName}', __filename, ${
                !ignoreFilePath ? 'undefined' : `'${ignoreFilePath}'`
              });`,
            },
            ...(!ignoreFilePath
              ? []
              : [
                  {
                    filePath: ignoreFilePath,
                    content: ignore.join('\n'),
                  },
                ]),
          ],
        };
      }

      return {
        ...result,
        ...findFiles(configCliName),
      };
    },
    {},
  );
};

export default findFiles;
