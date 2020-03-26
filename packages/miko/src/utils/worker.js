// @flow

// TODO import isRunning from 'is-running';
import rimraf from 'rimraf';
import debug from 'debug';

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
export const killAllEvents = () => {
  Object.keys(cache).forEach((filePath: string) => {
    debugLog({
      filePath,
      pids: cache[filePath],
    });
    cache[filePath].forEach((pid: number) => {
      process.kill(pid, 0);
    });
    rimraf(filePath, () => {
      delete cache[filePath];
    });
  });
  // TODO: close server
};
