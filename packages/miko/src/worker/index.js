// @flow

import { end } from '@mikojs/worker';

import buildCache from './buildCache';
import checkingTimer from './checkingTimer';

const cache = buildCache();

/**
 * @example
 * addTracking('babel', 123)
 *
 * @param {number} pid - pid number
 * @param {string} filePath - file path
 */
export const addTracking = (pid: number, filePath: string) => {
  cache.add(pid, filePath);
  checkingTimer.clear();
  checkingTimer(cache, 0);
};

/**
 * @example
 * killAllEvents()
 */
export const killAllEvents = async () => {
  await cache.kill();
  await end(__filename);
};
