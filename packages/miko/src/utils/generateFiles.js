// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import outputFileSync from 'output-file-sync';

import createLogger from '@mikojs/logger';

import configsCache from './configsCache';

const logger = createLogger('@mikojs/miko:generateFiles');

/**
 * @return {Array} - generating files
 */
export default (): $ReadOnlyArray<string> => {
  const gitignore = [configsCache.resolve, path.resolve]
    .reduce((result: string, getPath: (filePath: string) => string): string => {
      const filePath = getPath('./.gitignore');

      return !result && fs.existsSync(filePath)
        ? fs.readFileSync(filePath, 'utf-8')
        : result;
    }, '')
    .replace(/^#.*$/gm, '');

  return configsCache
    .keys()
    .reduce(
      (result: $ReadOnlyArray<string>, key: string): $ReadOnlyArray<string> => {
        if (key === 'miko') return result;

        const { configFile, ignoreFile } = configsCache.get(key);

        logger.debug({ key, configFile, ignoreFile });

        return [configFile, ignoreFile]
          .filter(Boolean)
          .reduce(
            (
              subResult: $ReadOnlyArray<string>,
              argu: [string, string],
            ): $ReadOnlyArray<string> => {
              const filename = path.basename(argu[0]);

              if (!new RegExp(filename).test(gitignore))
                logger.warn(
                  chalk`{red ${filename}} should be added in {bold {gray .gitignore}}`,
                );

              logger.debug(argu);
              outputFileSync(...argu);

              return [...subResult, argu[0]];
            },
            result,
          );
      },
      [],
    );
};
