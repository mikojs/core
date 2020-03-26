// @flow

import path from 'path';

import rimraf from 'rimraf';
import debug from 'debug';

import { type cacheType } from './buildCache';

const debugLog = debug('miko:removeFiles');

/**
 * @example
 * removeFiles('/cwd', cache)
 *
 * @param {string} cwd - cwd path
 * @param {cacheType} cache - configs cache
 */
export default async (cwd: string, cache: cacheType) => {
  debugLog(cwd);
  await Promise.all(
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
              !configFilename || !config
                ? null
                : path.resolve(cwd, configFilename),
              !ignoreFilename || !ignore
                ? null
                : path.resolve(cwd, ignoreFilename),
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
};
