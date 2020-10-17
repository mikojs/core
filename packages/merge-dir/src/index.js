// @flow

import path from 'path';

import debug from 'debug';
import findCacheDir from 'find-cache-dir';
import cryptoRandomString from 'crypto-random-string';

import { requireModule } from '@mikojs/utils';

import tools from './utils/tools';
import { type eventType, type dataType, type closeType } from './utils/watcher';
import getFileInfo from './utils/getFileInfo';

export type fileDataType = {|
  exists: boolean,
  filePath: string,
  pathname: string,
|};

type buildType = (fileData: fileDataType) => string;
type cacheType = {|
  [string]: {|
    cacheFilePath: string,
    watcher: Promise<closeType>,
  |},
|};

const debugLog = debug('merge-dir');
const cacheDir = findCacheDir({ name: '@mikojs/merge-dir', thunk: true });
const cacheId = cryptoRandomString({
  length: 10,
  type: 'alphanumeric',
});
const cache: cacheType = {};
let event: eventType = 'dev';

debugLog({ cacheDir: cacheDir() });

export default {
  /**
   * @param {eventType} newEvent - new event type
   */
  set: (newEvent: eventType) => {
    event = newEvent;
  },

  /**
   * @param {string} folderPath - folder path
   * @param {buildType} build - build cache function
   * @param {string} prefix - pathname prefix
   *
   * @return {any} - any function from cache
   */
  use: <C>(
    folderPath: string,
    build: buildType,
    prefix?: string,
  ): ((...argv: $ReadOnlyArray<mixed>) => C) => {
    const relativePath = path.relative(cacheDir(), folderPath);

    if (event === 'run')
      return tools.getFromCache(
        tools.getFromCache(cacheDir('main.js'))[relativePath],
      );

    const cacheFilePath = cacheDir(
      `${cryptoRandomString({ length: 10, type: 'alphanumeric' })}.js`,
    );

    /**
     * @param {Array} argv - function argv
     *
     * @return {any} - the result of the function
     */
    const cacheFunc = (...argv: $ReadOnlyArray<mixed>) =>
      tools.getFromCache(cacheFilePath)(...argv);

    debugLog({ folderPath, prefix, relativePath, cacheFilePath });
    cacheFunc.cacheId = cacheId;
    cache[relativePath] = {
      cacheFilePath,
      watcher: tools.watcher(
        folderPath,
        event,
        (data: $ReadOnlyArray<dataType>) => {
          tools.writeToCache(
            cacheFilePath,
            data.reduce(
              (result: string, { exists, name }: dataType): string => {
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
              },
              '',
            ),
          );
        },
      ),
    };

    return cacheFunc;
  },

  /**
   * @return {Promise} - close function
   */
  ready: async (): Promise<closeType> => {
    const closes = await Promise.all(
      Object.keys(cache).map((key: string) => cache[key].watcher),
    );

    return () => {
      debugLog(cache);
      closes.forEach((close: closeType) => close());

      if (event === 'build')
        tools.writeToCache(
          cacheDir('main.js'),
          `module.exports = ${JSON.stringify(
            Object.keys(cache).reduce(
              (result: {| [string]: string |}, key: string) => ({
                ...result,
                [key]: cache[key].cacheFilePath,
              }),
              {},
            ),
          )};`,
        );
    };
  },
};
