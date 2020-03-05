// @flow

import path from 'path';

import configs from './configs';

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
 * @return {object} - configsFiles object to generate the files
 */
const findFiles = (cliName: string): ?{ [string]: filesDataType } => {
  const { configsFiles = {}, ignore: getIgnore } = configs.get(cliName);
  const { name: ignoreName, ignore = [] } = getIgnore?.() || {};

  if (Object.keys(configsFiles).length === 0) return null;

  return (Object.keys(configsFiles): $ReadOnlyArray<string>).reduce(
    (result: {}, configCliName: string): {} => {
      const configPath = configsFiles[configCliName];

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
