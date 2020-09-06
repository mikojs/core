// @flow

import fs from 'fs';

import rimraf from 'rimraf';
import isRunning from 'is-running';
import debug from 'debug';
import { emptyFunction } from 'fbjs';

import { mockChoice } from '@mikojs/utils';

export type cacheType = {|
  getFilePaths: () => $ReadOnlyArray<string>,
  add: (pid: number, filePath: string) => cacheType,
  delete: (filePath: string) => Promise<cacheType>,
  kill: () => Promise<cacheType>,
  hasWorkingPids: () => boolean,
|};

const debugLog = debug('miko:worker:buildCache');

/**
 * @return {cacheType} - cache object
 */
export default (): cacheType => {
  const cache = {};
  const result = {
    /**
     * @return {Array} - file path array
     */
    getFilePaths: () => Object.keys(cache),

    /**
     * @param {number} pid - process id
     * @param {string} filePath - file path
     *
     * @return {cacheType} - cahce object
     */
    add: (pid: number, filePath: string): cacheType => {
      if (!cache[filePath]) cache[filePath] = [];

      cache[filePath].push(pid);
      debugLog({ pid, filePath });
      debugLog(cache);

      return result;
    },

    /**
     * @param {string} filePath - file path
     *
     * @return {cacheType} - cahce object
     */
    delete: (filePath: string) =>
      new Promise<cacheType>(resolve => {
        if (fs.existsSync(filePath))
          rimraf(filePath, () => {
            delete cache[filePath];
            debugLog(`Remove existing file: ${filePath}`);
            debugLog(cache);
            resolve(result);
          });
        else {
          delete cache[filePath];
          debugLog(`File does not exist: ${filePath}`);
          debugLog(cache);
          resolve(result);
        }
      }),

    /**
     * @return {cacheType} - cahce object
     */
    kill: async (): Promise<cacheType> => {
      await Promise.all(
        Object.keys(cache).map((filePath: string): Promise<cacheType> => {
          debugLog({
            filePath,
            pids: cache[filePath],
          });
          cache[filePath].forEach((pid: number) => {
            mockChoice(
              process.env.NODE_ENV === 'test',
              emptyFunction,
              process.kill,
            )(pid);
          });

          return result.delete(filePath);
        }),
      );

      return result;
    },

    /**
     * @return {boolean} - has working pids or not
     */
    hasWorkingPids: () =>
      Object.keys(cache).reduce(
        (hasWorkingPids: boolean, cacheFilePath: string): boolean => {
          const newPids = cache[cacheFilePath].filter(isRunning);

          if (newPids.length !== cache[cacheFilePath].length)
            debugLog(
              `Cache: ${JSON.stringify(
                { ...cache, [cacheFilePath]: newPids },
                null,
                2,
              )}`,
            );

          cache[cacheFilePath] = newPids;

          return hasWorkingPids || newPids.length !== 0;
        },
        false,
      ),
  };

  return result;
};
