// @flow

import path from 'path';

import chalk from 'chalk';
import outputFileSync from 'output-file-sync';
import dotgitignore from 'dotgitignore';

import createLogger from '@mikojs/logger';

import configsCache from './configsCache';

const logger = createLogger('@mikojs/miko:generateFiles');

/**
 * @return {Array} - generating files
 */
export default (): $ReadOnlyArray<string> => {
  const gitignore = dotgitignore();

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

              if (!gitignore.ignore(filename))
                logger.warn(
                  chalk`{red ${filename}} should be added in {bold {gray .gitignore}}.`,
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
