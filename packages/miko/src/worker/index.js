// @flow

import cache from './cache';
import checkingTimer from './checkingTimer';

export { cache };

/**
 * @param {number} pid - process pid
 * @param {Array} filePaths - file path array or file path string
 */
export const addTracking = (
  pid: number,
  filePaths: string | $ReadOnlyArray<string>,
) => {
  (filePaths instanceof Array ? filePaths : [filePaths]).map(
    (filePath: string) => {
      cache.add(pid, filePath);
    },
  );
  checkingTimer.clear();
  checkingTimer(cache, 0);
};

/**
 */
export const killAllEvents = async () => {
  await cache.kill();
};
