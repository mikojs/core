// @flow

// TODO import isRunning from 'is-running';
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
  debugLog({ filePath, pid });
  debugLog(cache);

  // TODO: auto close server
};

/**
 * @example
 * killAllEvents()
 */
export const killAllEvents = () => {
  // TODO: remove all cache and kill all process
};
