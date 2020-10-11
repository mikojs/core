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

const cacheDir = findCacheDir({ name: '@mikojs/merge-dir', thunk: true });
const cache = {
  watchers: {},
  prefixs: [],
};
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
  get: <C>(cacheFilePath: string): C => tools.getFromCache(cacheFilePath),

  /**
   * @param {string} folderPath - folder path
   * @param {buildType} build - build cache function
   * @param {string} prefix - pathname prefix
   *
   * @return {string} - cache file path
   */
  set: (folderPath: string, build: buildType, prefix?: string): string => {
    const hash = cryptoRandomString({ length: 10, type: 'alphanumeric' });
    const cacheFilePath = cacheDir(`${hash}.js`);

    if (prefix) cache.prefixs.push(prefix);

    cache.watchers[hash] = tools.watcher(
      folderPath,
      (data: $ReadOnlyArray<dataType>) => {
        tools.writeToCache(
          cacheFilePath,
          data.reduce(
            (result: string, { exists, filePath }: dataType): string => {
              const relativePath = path
                .relative(folderPath, filePath)
                .replace(/\.js$/, '');

              invariant(
                !fs.existsSync(filePath.replace(/\.js$/, '')),
                `You should not use \`folder: ${relativePath}\` and \`file: ${relativePath}.js\` at the same time.`,
              );

              const pathname = [
                prefix,
                relativePath
                  .replace(/\/?index$/, '')
                  .replace(/\[([^[\]]*)\]/g, ':$1'),
              ]
                .filter(Boolean)
                .join('/')
                .replace(/^([^/])/, '/$1')
                .replace(/^$/, '/');

              if (
                cache.prefixs.some(
                  (cachePrefix: string) =>
                    cachePrefix !== prefix && pathname.startsWith(cachePrefix),
                )
              )
                return result;

              delete require.cache[filePath];
              requireModule(filePath);

              return build({
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
      Object.keys(cache.watchers).map((key: string) => cache[key]),
    );

    return () => closes.forEach((close: () => void) => close());
  },
};
