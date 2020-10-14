// @flow

import path from 'path';

import debug from 'debug';
import findCacheDir from 'find-cache-dir';
import cryptoRandomString from 'crypto-random-string';
import outputFileSync from 'output-file-sync';

import { requireModule } from '@mikojs/utils';

import buildFile, {
  cacheId,
  type fileDataType as buildFileFileDataType,
  type buildType,
} from './utils/buildFile';
import watcher, { type dataType, type callbackType } from './utils/watcher';

export type fileDataType = buildFileFileDataType;

type toolsType = {|
  writeToCache?: (filePath: string, content: string) => void,
  getFromCache?: <C>(filePath: string) => C,
  watcher?: (filePath: string, callback: callbackType) => Promise<() => void>,
|};

const debugLog = debug('merge-dir');
const cacheDir = findCacheDir({ name: '@mikojs/merge-dir', thunk: true });
const cache = {};
const tools = {
  writeToCache: outputFileSync,
  getFromCache: requireModule,
  watcher,
};

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
      [cryptoRandomString({ length: 10, type: 'alphanumeric' }), 'js'].join(
        '.',
      ),
    );

    debugLog({ folderPath, prefix, relativePath, cacheFilePath });
    cache[relativePath] = tools.watcher(
      folderPath,
      (data: $ReadOnlyArray<dataType>) => {
        tools.writeToCache(
          cacheFilePath,
          buildFile(folderPath, build, prefix, data),
        );
      },
    );

    return cacheFilePath;
  },

  /**
   * @param {toolsType} newTools - new tools functions
   */
  updateTools: (newTools: toolsType) => {
    debugLog(newTools);
    Object.keys(newTools).forEach((key: string) => {
      tools[key] = newTools[key];
    });
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
