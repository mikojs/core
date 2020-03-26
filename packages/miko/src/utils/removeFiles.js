// @flow

import rimraf from 'rimraf';
import debug from 'debug';

import cache from './cache';

const debugLog = debug('miko:removeFiles');

/**
 * @example
 * removeFiles()
 *
 * @return {Promise} - wait for removing all files
 */
export default () =>
  Promise.all(
    cache
      .keys()
      .reduce(
        (
          result: $ReadOnlyArray<Promise<void>>,
          key: string,
        ): $ReadOnlyArray<Promise<void>> => {
          const { filenames, config, ignore } = cache.get(key);
          const configFilename = filenames?.config;
          const ignoreFilename = filenames?.ignore;

          return [
            ...result,
            ...[
              !configFilename || !config ? null : cache.resolve(configFilename),
              !ignoreFilename || !ignore ? null : cache.resolve(ignoreFilename),
            ]
              .filter(Boolean)
              .map(
                (filePath: string) =>
                  new Promise(resolve => {
                    debugLog(filePath);
                    rimraf(filePath, resolve);
                  }),
              ),
          ];
        },
        [],
      ),
  );
