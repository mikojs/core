// @flow

import { end } from '@mikojs/worker';

import buildCache from './buildCache';

export const TIME_TO_CHECK = 100;
export const TIME_TO_REMOVE_FILES = 500;
export const TIME_TO_CLOSE_SERVER = 5000;

const cache = buildCache();
let timer: TimeoutID;

/**
 * @example
 * addTracking('babel', 123)
 *
 * @param {number} pid - pid number
 * @param {string} filePath - file path
 */
export const addTracking = (pid: number, filePath: string) => {
  cache.add(pid, filePath);
  clearTimeout(timer);

  /**
   * @example
   * checking(0)
   *
   * @param {number} checkedTimes - checked times
   */
  const checking = (checkedTimes: number) => {
    if (cache.hasWorkingPids()) {
      timer = setTimeout(checking, TIME_TO_CHECK, 0);
      return;
    }

    if (
      checkedTimes >= TIME_TO_REMOVE_FILES / TIME_TO_CHECK &&
      Object.keys(cache).length !== 0
    ) {
      cache.delete(Object.keys(cache)[0]).then(() => {
        timer = setTimeout(
          checking,
          TIME_TO_CHECK,
          Object.keys(cache).length === 0 ? 0 : checkedTimes,
        );
      });
      return;
    }

    if (checkedTimes >= TIME_TO_CLOSE_SERVER / TIME_TO_CHECK) {
      clearTimeout(timer);
      end(__filename);
      return;
    }

    timer = setTimeout(checking, TIME_TO_CHECK, checkedTimes + 1);
  };

  checking(0);
};

/**
 * @example
 * killAllEvents()
 */
export const killAllEvents = async () => {
  await cache.kill();
  await end(__filename);
};
