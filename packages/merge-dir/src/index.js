// @flow

import fs from 'fs';
import path from 'path';

import { invariant } from 'fbjs';
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

const randomOptions = { length: 10, type: 'alphanumeric' };
const cacheId = cryptoRandomString(randomOptions);
const cacheDir = findCacheDir({ name: '@mikojs/merge-dir', thunk: true });
const cache = {};
const tools = {
  writeToCache: outputFileSync,
  getFromCache: requireModule,
  watcher,
};

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

    cache[hash] = tools.watcher(
      folderPath,
      (data: $ReadOnlyArray<dataType>) => {
        tools.writeToCache(
          cacheFilePath,
          data.reduce(
            (result: string, { exists, relativePath }: dataType): string => {
              const filePath = path.resolve(folderPath, relativePath);

              invariant(
                !fs.existsSync(filePath.replace(/\.js$/, '')),
                `You should not use \`folder: ${relativePath.replace(
                  /\.js$/,
                  '',
                )}\` and \`file: ${relativePath}\` at the same time.`,
              );

              const pathname = [
                prefix,
                relativePath
                  .replace(/\.js$/, '')
                  .replace(/\/?index$/, '')
                  .replace(/\[([^[\]]*)\]/g, ':$1'),
              ]
                .filter(Boolean)
                .join('/')
                .replace(/^([^/])/, '/$1')
                .replace(/^$/, '/');

              delete require.cache[filePath];

              return requireModule(filePath).cacheId === cacheId
                ? result
                : build({
                    exists,
                    filePath,
                    pathname,
                  });
            },
            '',
          ),
        );
      },
    );

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
    const closes = await Promise.all(
      Object.keys(cache).map((key: string) => cache[key]),
    );

    return () => closes.forEach((close: () => void) => close());
  },
};
