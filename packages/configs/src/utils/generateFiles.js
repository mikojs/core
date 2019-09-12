// @flow

import path from 'path';

import chalk from 'chalk';
import debug from 'debug';
import moment from 'moment';
import outputFileSync from 'output-file-sync';

import logger from './logger';
import configs from './configs';
import worker from './worker';

const debugLog = debug('configs:generateFiles');

type filesDataType = $ReadOnlyArray<{|
  filePath: string,
  content: string,
|}>;

/**
 * @example
 * findFiles('cliName')
 *
 * @param {string} cliName - cli name
 * @param {Array} customConfigFiles - custom config filenames
 *
 * @return {object} - configFiles object to generate the files
 */
const findFiles = (
  cliName: string,
  customConfigFiles?: ?$ReadOnlyArray<string>,
): { [string]: filesDataType } => {
  const {
    alias: cli = cliName,
    configFiles = {},
    ignore: getIgnore,
    ignoreName,
  } = configs.store[cliName];
  const ignore = getIgnore?.([]) || [];

  if (Object.keys(configFiles).length === 0)
    throw logger.fail(
      'Can not generate the config file, You can:',
      chalk`  - Add the path of the config in {cyan \`configs.${cliName}.configFiles.${cli}\`}`,
      chalk`  - Run command with {cyan \`--configs-files\`} options`,
    );

  if (customConfigFiles instanceof Array)
    customConfigFiles.forEach((key: string) => {
      configFiles[key] = true;
    });

  return (Object.keys(configFiles): $ReadOnlyArray<string>).reduce(
    (result: {}, configCliName: string): {} => {
      const configPath = configFiles[configCliName];

      if (!configPath) return result;

      if (typeof configPath === 'string')
        return {
          ...result,
          [configCliName]: [
            {
              filePath: path.resolve(configs.rootDir, configPath),
              content: `/* eslint-disable */ module.exports = require('@cat-org/configs')('${configCliName}', __filename);`,
            },
            ...(!ignoreName || ignore.length === 0
              ? []
              : [
                  {
                    filePath: path.resolve(
                      configs.rootDir,
                      path.dirname(configPath),
                      ignoreName,
                    ),
                    content: ignore.join('\n'),
                  },
                ]),
          ],
        };

      return {
        ...result,
        ...findFiles(configCliName),
      };
    },
    {},
  );
};

/**
 * @example
 * generateFiles('cli')
 *
 * @param {string} cliName - cli name
 * @param {Array} customConfigFiles - custom config filenames
 */
export default (
  cliName: string,
  customConfigFiles: ?$ReadOnlyArray<string>,
) => {
  const files = findFiles(cliName, customConfigFiles);
  const cache = {
    pid: process.pid,
    using: moment().format(),
  };

  debugLog(`Config files: ${JSON.stringify(files, null, 2)}`);

  Object.keys(files).forEach((key: string) => {
    files[key].forEach(
      ({ filePath, content }: $ElementType<filesDataType, number>) => {
        debugLog(`Generate config: ${filePath}`);
        outputFileSync(filePath, content);
        worker.writeCache({
          ...cache,
          filePath,
        });
      },
    );
  });
};
