// @flow

// TODO import isRunning from 'is-running';
import debug from 'debug';

const debugLog = debug('miko:worker');
const cache = {};

/**
 * @example
 * addTracking('babel', 123)
 *
 * @param {string} configName - config name
 * @param {number} pid - pid number
 */
export const addTracking = (configName: string, pid: number) => {
  if (!cache[configName]) cache[configName] = [];

  cache[configName].push(pid);
  debugLog({ configName, pid });
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
