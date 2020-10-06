// @flow

import path from 'path';

import findCacheDir from 'find-cache-dir';
import cryptoRandomString from 'crypto-random-string';
import outputFileSync from 'output-file-sync';

import { requireModule } from '@mikojs/utils';

import watcher, { type dataType } from './watcher';

type buildDataType = {|
  exists: boolean,
  filePath: string,
  pathname: string,
|};

type buildType = (data: buildDataType) => string;

const cacheDir = findCacheDir({ name: '@mikojs/server', thunk: true });
const cache = {};
const tools = {
  writeToCache: outputFileSync,
  getFromCache: requireModule,
  watcher,
};

export default {
  get: tools.getFromCache,

  /**
   * @param {string} folderPath - folder path
   * @param {buildType} build - build middleware cache function
   *
   * @return {string} - cache file path
   */
  set: (folderPath: string, build: buildType): string => {
    const hash = cryptoRandomString({ length: 10, type: 'alphanumeric' });
    const cacheFilePath = cacheDir(`${hash}.js`);

    cache[hash] = tools.watcher(
      folderPath,
      (data: $ReadOnlyArray<dataType>) => {
        cache.writeToCache(
          cacheFilePath,
          data.reduce(
            (result: string, { exists, filePath }: dataType) =>
              build({
                exists,
                filePath,
                pathname: path
                  .relative(folderPath, filePath)
                  .replace(/\.js$/, '')
                  .replace(/index$/, '')
                  .replace(/^/, '/')
                  .replace(/\[([^[\]]*)\]/g, ':$1'),
              }),
            '',
          ),
        );
      },
    );

    return cacheFilePath;
  },

  /**
   * @return {Promise} - close function
   */
  ready: async (): Promise<() => void> => {
    const closes = await Promise.all(
      Object.keys(cache).map((key: string) => cache[key]),
    );

    return () => closes.forEach((close: () => void) => close());
  },
};
