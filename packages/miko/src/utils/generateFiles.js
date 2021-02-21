// @flow

import path from 'path';

import chalk from 'chalk';
import outputFileSync from 'output-file-sync';
import dotgitignore from 'dotgitignore';
import { invariant } from 'fbjs';

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

        const { configFile } = configsCache.get(key);

        logger.debug({ key, configFile });
        invariant(configFile, 'Could not find config.');
        outputFileSync(...configFile);

        const filename = path.basename(configFile[0]);

        if (!gitignore.ignore(filename))
          logger.warn(
            chalk`{red ${filename}} should be added in {bold {gray .gitignore}}.`,
          );

        return [...result, configFile[0]];
      },
      [],
    );
};
