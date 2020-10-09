// @flow

import path from 'path';

import findCacheDir from 'find-cache-dir';
import cryptoRandomString from 'crypto-random-string';
import outputFileSync from 'output-file-sync';

import { requireModule } from '@mikojs/utils';

import watcher, { type dataType, type callbackType } from './utils/watcher';

export type fileDataType = {|
  exists: boolean,
  filePath: string,
  pathname: string,
|};

export type buildType = (fileData: fileDataType) => string;

type toolsType = {|
  writeToCache?: (filePath: string, content: string) => void,
  getFromCache?: <C>(filePath: string) => C,
  watcher?: (filePath: string, callback: callbackType) => Promise<() => void>,
|};

const cacheDir = findCacheDir({ name: '@mikojs/merge-dir', thunk: true });
const cache = {};
const tools = {
  writeToCache: outputFileSync,
  getFromCache: requireModule,
  watcher,
};

/**
 * @return {Array} - closes array
 */
const ready = async () => [
  ...(await Promise.all(
    Object.keys(cache).map(async (key: string): Promise<() => void> => {
      const close = cache[key];

      delete cache[key];

      return close();
    }),
  )),
  ...(Object.keys(cache).length === 0 ? [] : await ready()),
];

export default {
  /**
   * @param {string} cacheFilePath - cache file path
   *
   * @return {any} - any function from cache
   */
  get: <C>(cacheFilePath: string): C => tools.getFromCache(cacheFilePath),

  /**
   * @param {string} folderPath - folder path
   * @param {buildType} build - build cache function
   *
   * @return {string} - cache file path
   */
  set: (folderPath: string, build: buildType): string => {
    const hash = cryptoRandomString({ length: 10, type: 'alphanumeric' });
    const cacheFilePath = cacheDir(`${hash}.js`);

    tools.writeToCache(
      cacheFilePath,
      `module.exports = () => {
  throw new Error('Should run build mode');
};`,
    );

    /**
     * @return {Function} - close function
     */
    cache[hash] = () =>
      tools.watcher(folderPath, (data: $ReadOnlyArray<dataType>) => {
        tools.writeToCache(
          cacheFilePath,
          data.reduce(
            (result: string, { exists, filePath }: dataType): string => {
              delete require.cache[filePath];
              requireModule(filePath);

              return build({
                exists,
                filePath,
                pathname: path
                  .relative(folderPath, filePath)
                  .replace(/\.js$/, '')
                  .replace(/index$/, '')
                  .replace(/^/, '/')
                  .replace(/\[([^[\]]*)\]/g, ':$1'),
              });
            },
            '',
          ),
        );
      });

    return cacheFilePath;
  },

  /**
   * @param {toolsType} newTools - new tools functions
   */
  updateTools: (newTools: toolsType) => {
    Object.keys(newTools).forEach((key: string) => {
      tools[key] = newTools[key];
    });
  },

  /**
   * @return {Promise} - close function
   */
  ready: async (): Promise<() => void> => {
    const closes = await ready();

    return () => closes.forEach((close: () => void) => close());
  },
};
