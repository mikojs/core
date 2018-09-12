// @flow

import path from 'path';

import chalk from 'chalk';

import printInfos from './printInfos';
import cliOptions from './cliOptions';
import configs from './configs';
import worker from './worker';

const CONFIG_FILES = {
  babel: 'babel.config.js',
  eslint: '.eslintrc.js',
  esw: '.eslintrc.js',
  prettier: '.prettierrc.js',
  'lint-staged': '.lintstagedrc.js',
  jest: 'jest.config.js',
};

const CONFIG_IGNORE = {
  eslint: '.eslintignore',
  esw: '.eslintignore',
  prettier: '.prettierignore',
};

/**
 * find config files with merging by cliName
 *
 * @example
 * findConfigFiles('cliName')
 *
 * @param {string} cliName - cli name
 *
 * @return {Object} - configFiles
 */
const findConfigFiles = (cliName: string): {} => {
  const { alias: cli = cliName, configFiles = {} } = configs.store[cliName];

  if (!configFiles[cliName]) {
    if (!CONFIG_FILES[cli])
      printInfos(
        [
          'Can not generate the config file',
          chalk`Add the path of the config in {cyan \`configs.${cliName}.configFiles.${cli}\`}`,
        ],
        true,
      );

    configFiles[cliName] = path.resolve(configs.rootDir, CONFIG_FILES[cli]);
  }

  return Object.keys(configFiles).reduce(
    (result: {}, configCliName: string): {} => {
      const configPath = configFiles[configCliName];

      if (!configPath) return result;

      if (typeof configPath === 'string')
        return {
          ...result,
          [configCliName]: configPath,
        };

      return {
        ...result,
        ...findConfigFiles(configCliName),
      };
    },
    {},
  );
};

export default async (): Promise<void> => {
  const configFiles = findConfigFiles(cliOptions.cliName);

  await Promise.all(
    Object.keys(configFiles).map(
      async (configCliName: string): Promise<void> => {
        const {
          alias: configCli = configCliName,
          ignoreName = CONFIG_IGNORE[configCli],
          ignore: getIgnore,
        } = configs.store[configCliName];
        const configPath = configFiles[configCliName];
        const ignore = getIgnore?.([]) || [];

        await worker.writeFile(
          configPath,
          `/* eslint-disable */ module.exports = require('@cat-org/configs')('${configCliName}', __filename);`,
        );

        if (ignoreName && ignore.length !== 0)
          await worker.writeFile(
            path.resolve(path.dirname(configPath), ignoreName),
            ignore.join('\n'),
          );
      },
    ),
  );
};
