// @flow

// TODO import isRunning from 'is-running';
import rimraf from 'rimraf';
import debug from 'debug';

import { end } from '@mikojs/worker';

const debugLog = debug('miko:worker');
const cache = {};

/**
 * @example
 * addTracking('babel', 123)
 *
 * @param {number} pid - pid number
 * @param {string} filePath - file path
 */
export const addTracking = (pid: number, filePath: string) => {
  if (!cache[filePath]) cache[filePath] = [];

  cache[filePath].push(pid);
  debugLog({ pid, filePath });
  debugLog(cache);

  // TODO: auto close server
};

/**
 * @example
 * killAllEvents()
 */
export const killAllEvents = async () => {
  await Promise.all(
    Object.keys(cache).map(
      (filePath: string) =>
        new Promise(resolve => {
          debugLog({
            filePath,
            pids: cache[filePath],
          });
          cache[filePath].forEach((pid: number) => {
            process.kill(pid, 0);
          });
          rimraf(filePath, () => {
            delete cache[filePath];
            resolve();
          });
        }),
    ),
  );
  await end(__filename);
};
