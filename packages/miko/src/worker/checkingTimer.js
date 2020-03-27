// @flow

import { end } from '@mikojs/worker';

import { type cacheType } from './buildCache';

export const TIME_TO_CHECK = 100;
export const TIME_TO_REMOVE_FILES = 500;
export const TIME_TO_CLOSE_SERVER = 5000;

let timer: TimeoutID;

/**
 * @example
 * checking(cache, 0)
 *
 * @param {cacheType} cache - cache
 * @param {number} checkedTimes - checked times
 */
const checking = (cache: cacheType, checkedTimes: number) => {
  if (cache.hasWorkingPids()) {
    timer = setTimeout(checking, TIME_TO_CHECK, cache, 0);
    return;
  }

  const [filePath] = cache.getFilePaths();

  if (checkedTimes >= TIME_TO_REMOVE_FILES / TIME_TO_CHECK && !filePath) {
    cache.delete(filePath).then(() => {
      timer = setTimeout(
        checking,
        TIME_TO_CHECK,
        cache,
        cache.getFilePaths().length === 0 ? 0 : checkedTimes,
      );
    });
    return;
  }

  if (checkedTimes >= TIME_TO_CLOSE_SERVER / TIME_TO_CHECK) {
    clearTimeout(timer);
    end(__filename);
    return;
  }

  timer = setTimeout(checking, TIME_TO_CHECK, cache, checkedTimes + 1);
};

checking.clear = () => {
  clearTimeout(timer);
};

export default checking;
