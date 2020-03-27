// @flow

import fs from 'fs';

import rimraf from 'rimraf';
import debug from 'debug';

type cacheType = {|
  add: (pid: number, filePath: string) => cacheType,
  delete: (filePath: string) => Promise<cacheType>,
  kill: () => Promise<cacheType>,
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
            process.kill(pid, 0);
          });

          return result.delete(filePath);
        }),
      );

      return result;
    },
  };

  return result;
};
