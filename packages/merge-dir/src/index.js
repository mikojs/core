// @flow

import path from 'path';

import debug from 'debug';
import findCacheDir from 'find-cache-dir';
import cryptoRandomString from 'crypto-random-string';

import { requireModule } from '@mikojs/utils';

import tools from './utils/tools';
import { type dataType, type closeType } from './utils/watcher';
import getFileInfo from './utils/getFileInfo';

export type fileDataType = {|
  exists: boolean,
  filePath: string,
  pathname: string,
|};

type buildType = (fileData: fileDataType) => string;
type cacheType = {| [string]: Promise<closeType> |};

const debugLog = debug('merge-dir');
const cacheDir = findCacheDir({ name: '@mikojs/merge-dir', thunk: true });
const cacheId = cryptoRandomString({
  length: 10,
  type: 'alphanumeric',
});
const cache: cacheType = {};

debugLog({ cacheDir: cacheDir() });

export default {
  /**
   * @param {string} cacheFilePath - cache file path
   *
   * @return {any} - any function from cache
   */
  get: <C>(cacheFilePath: string): ((...argv: $ReadOnlyArray<mixed>) => C) => {
    /**
     * @param {Array} argv - function argv
     *
     * @return {any} - the result of the function
     */
    const cacheFunc = (...argv: $ReadOnlyArray<mixed>) =>
      tools.getFromCache(cacheFilePath)(...argv);

    debugLog({ cacheFilePath });
    cacheFunc.cacheId = cacheId;

    return cacheFunc;
  },

  /**
   * @param {string} folderPath - folder path
   * @param {buildType} build - build cache function
   * @param {string} prefix - pathname prefix
   *
   * @return {string} - cache file path
   */
  set: (folderPath: string, build: buildType, prefix?: string): string => {
    const relativePath = path.relative(cacheDir(), folderPath);
    const cacheFilePath = cacheDir(
      `${cryptoRandomString({ length: 10, type: 'alphanumeric' })}.js`,
    );

    debugLog({ folderPath, prefix, relativePath, cacheFilePath });
    cache[relativePath] = tools.watcher(
      folderPath,
      (data: $ReadOnlyArray<dataType>) => {
        tools.writeToCache(
          cacheFilePath,
          data.reduce((result: string, { exists, name }: dataType): string => {
            const { filePath, pathname } = getFileInfo(
              folderPath,
              name,
              prefix,
            );

            debugLog({ filePath, pathname });
            delete require.cache[filePath];

            return requireModule(filePath).cacheId === cacheId
              ? result
              : build({ exists, filePath, pathname });
          }, ''),
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

    debugLog(cache);

    return () => closes.forEach((close: () => void) => close());
  },
};
