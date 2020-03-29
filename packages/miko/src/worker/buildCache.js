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
 * @example
 * buildCache()
 *
 * @return {cacheType} - cache object
 */
export default (): cacheType => {
  const cache = {};
  const result = {
    getFilePaths: () => Object.keys(cache),

    add: (pid: number, filePath: string): cacheType => {
      if (!cache[filePath]) cache[filePath] = [];

      cache[filePath].push(pid);
      debugLog({ pid, filePath });
      debugLog(cache);

      return result;
    },

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
            )(pid, 0);
          });

          return result.delete(filePath);
        }),
      );

      return result;
    },

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
