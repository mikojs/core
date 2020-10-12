// @flow

import debug from 'debug';
import findCacheDir from 'find-cache-dir';
import cryptoRandomString from 'crypto-random-string';
import outputFileSync from 'output-file-sync';

import { requireModule } from '@mikojs/utils';

import buildFile, {
  type fileDataType as buildFileFileDataType,
  type buildType,
} from './utils/buildFile';
import watcher, {
  type dataType,
  type eventType,
  type callbackType,
} from './utils/watcher';

export type fileDataType = buildFileFileDataType;

type toolsType = {|
  type?: eventType,
  writeToCache?: (filePath: string, content: string) => void,
  getFromCache?: <C>(filePath: string) => C,
  watcher?: (
    filePath: string,
    event: eventType,
    callback: callbackType,
  ) => Promise<() => void>,
|};

const randomOptions = { length: 10, type: 'alphanumeric' };
const cacheId = cryptoRandomString(randomOptions);
const cacheDir = findCacheDir({ name: '@mikojs/merge-dir', thunk: true });
const debugLog = debug('merge-dir');
const cache = {};
const tools = {
  type: 'dev',
  writeToCache: outputFileSync,
  getFromCache: requireModule,
  watcher,
};

debugLog({ cacheId, cacheDir: cacheDir() });

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
    const hash = cryptoRandomString(randomOptions);
    const cacheFilePath = cacheDir(`${hash}.js`);

    debugLog({ folderPath, prefix, hash });
    cache[hash] = tools.watcher(
      folderPath,
      tools.type,
      (data: $ReadOnlyArray<dataType>) => {
        tools.writeToCache(
          cacheFilePath,
          buildFile(folderPath, build, prefix, cacheId, data),
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
