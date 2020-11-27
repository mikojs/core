// @flow

import fs from 'fs';
import path from 'path';
import EventEmitter from 'events';

import debug from 'debug';
import findCacheDir from 'find-cache-dir';
import cryptoRandomString from 'crypto-random-string';

import { requireModule } from '@mikojs/utils';

import tools, { type fileDataType as toolsFileDataType } from './utils/tools';
import { type eventType, type dataType, type closeType } from './utils/watcher';
import getFileInfo from './utils/getFileInfo';

export type mergeEventType = eventType;
export type fileDataType = toolsFileDataType;

type buildType = (fileData: fileDataType) => string;
type cacheType = {|
  [string]: {|
    cacheFilePath: string,
    watcher: Promise<closeType>,
  |},
|};

interface mergeDirType extends EventEmitter {
  set: (event: eventType) => void;
  use: <A: $ReadOnlyArray<mixed>, C>(
    folderPath: string,
    prefix: ?string,
    build: buildType,
  ) => (...argv: A) => C;
  ready: () => Promise<closeType>;
}

const debugLog = debug('merge-dir');
const cacheDir = findCacheDir({ name: '@mikojs/merge-dir', thunk: true });
const cacheId = cryptoRandomString({
  length: 10,
  type: 'alphanumeric',
});
const cache: cacheType = {};
let event: eventType = 'dev';

debugLog({ cacheDir: cacheDir() });

/** */
class MergeDir extends EventEmitter {
  /**
   * @param {eventType} newEvent - new event type
   */
  set = (newEvent: eventType) => {
    event = newEvent;
  };

  /**
   * @param {string} folderPath - folder path
   * @param {string} prefix - pathname prefix
   * @param {buildType} build - build cache function
   *
   * @return {any} - any function from cache
   */
  use = <A: $ReadOnlyArray<mixed>, C>(
    folderPath: string,
    prefix: ?string,
    build: buildType,
  ): ((...argv: A) => C) => {
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
    const cacheFunc = (...argv: A) =>
      tools.getFromCache(cacheFilePath)(...argv);

    debugLog({ folderPath, prefix, relativePath, cacheFilePath });
    cacheFunc.cacheId = cacheId;
    cache[relativePath] = {
      cacheFilePath,
      watcher: tools.watcher(
        folderPath,
        event,
        (data: $ReadOnlyArray<dataType>) => {
          delete require.cache[cacheFilePath];
          tools.writeToCache(
            cacheFilePath,
            data.reduce(
              (result: string, { exists, name }: dataType): string => {
                const { filePath, pathname } = getFileInfo(
                  folderPath,
                  name,
                  prefix,
                );
                const fileData = {
                  exists,
                  filePath: path.relative(cacheFilePath, filePath),
                  pathname,
                };

                debugLog(fileData);
                this.emit('update', {
                  ...fileData,
                  filePath: path.relative(process.cwd(), filePath),
                });
                delete require.cache[filePath];

                return fs.existsSync(filePath) &&
                  requireModule(filePath).cacheId === cacheId
                  ? result
                  : build(fileData);
              },
              '',
            ),
          );
          this.emit('dnoe');
        },
      ),
    };

    return cacheFunc;
  };

  /**
   * @return {Promise} - close function
   */
  ready = async (): Promise<closeType> => {
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
  };
}

export default (new MergeDir(): mergeDirType);
