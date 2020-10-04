// @flow

import path from 'path';

import debug from 'debug';

import worker from '@mikojs/worker';

import { type cacheType } from './cache';

export const TIME_TO_CHECK = 100;
export const TIME_TO_REMOVE_FILES = 5000;
export const TIME_TO_CLOSE_SERVER = 5000;

const debugLog = debug('miko:worker:checkingTimer');
let timer: TimeoutID;

/**
 * @param {cacheType} cache - cache
 * @param {number} checkedTimes - checked times
 */
const checking = (cache: cacheType, checkedTimes: number) => {
  if (cache.hasWorkingPids()) {
    timer = setTimeout(checking, TIME_TO_CHECK, cache, 0);
    return;
  }

  const [filePath] = cache.getFilePaths();

  if (checkedTimes >= TIME_TO_REMOVE_FILES / TIME_TO_CHECK && filePath) {
    debugLog(`delete file: ${filePath}`);
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
    debugLog('close server');
    clearTimeout(timer);
    worker.end(path.resolve(__dirname, './index.js'));
    return;
  }

  timer = setTimeout(checking, TIME_TO_CHECK, cache, checkedTimes + 1);
};

/**
 */
checking.clear = () => {
  debugLog('clear');
  clearTimeout(timer);
};

export default checking;
