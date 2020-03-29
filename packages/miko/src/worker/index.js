// @flow

import worker from '@mikojs/worker';

import buildCache from './buildCache';
import checkingTimer from './checkingTimer';

export const cache = buildCache();

/**
 * @example
 * startTracking()
 */
export const startTracking = () => {
  checkingTimer.clear();
  checkingTimer(cache, 0);
};

/**
 * @example
 * addTracking('babel', 123)
 *
 * @param {number} pid - pid number
 * @param {string} filePath - file path
 */
export const addTracking = (pid: number, filePath: string) => {
  cache.add(pid, filePath);
  startTracking();
};

/**
 * @example
 * killAllEvents()
 */
export const killAllEvents = async () => {
  await cache.kill();
  await worker.end(__filename);
};
