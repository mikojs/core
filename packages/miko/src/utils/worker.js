// @flow

import isRunning from 'is-running';
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
};

/**
 * @example
 * removeTracking()
 *
 * @return {boolean} - is any pids working or not
 */
export const removeTracking = (): boolean => {
  const hasWorkingPids = Object.keys(cache).reduce(
    (result: boolean, configName: string): boolean => {
      cache[configName] = cache[configName].filter(isRunning);

      return result || cache[configName].length !== 0;
    },
    false,
  );

  debugLog({ hasWorkingPids, cache });

  return hasWorkingPids;
};
