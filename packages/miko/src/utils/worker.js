// @flow

import fs from 'fs';

import isRunning from 'is-running';
import rimraf from 'rimraf';
import debug from 'debug';

import { end } from '@mikojs/worker';

export const TIME_TO_CHECK = 100;
export const TIME_TO_REMOVE_FILES = 500;
export const TIME_TO_CLOSE_SERVER = 5000;

const debugLog = debug('miko:worker');
const cache = {};
let timer: TimeoutID;

/**
 * @example
 * removeFilePath('/filePath', () => {})
 *
 * @param {string} filePath - file path
 * @param {Function} callback - callback function
 */
const removeFilePath = (filePath: string, callback: () => void) => {
  if (!fs.existsSync(filePath)) {
    delete cache[filePath];
    debugLog(`File does not exist: ${filePath}`);
    debugLog(cache);
    callback();
    return;
  }

  rimraf(filePath, () => {
    delete cache[filePath];
    debugLog(`Remove existing file: ${filePath}`);
    debugLog(cache);
    callback();
  });
};

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
  clearTimeout(timer);

  /**
   * @example
   * checking(0)
   *
   * @param {number} checkedTimes - checked times
   */
  const checking = (checkedTimes: number) => {
    const hasWorkingPids = Object.keys(cache).reduce(
      (result: boolean, cacheFilePath: string): boolean => {
        const newPids = cache[cacheFilePath].filter(isRunning);

        if (newPids.length !== cache[cacheFilePath].length)
          debugLog(
            `Cache: ${JSON.stringify(
              { ...cache, [cacheFilePath]: newPids },
              null,
              2,
            )}`,
          );

        cache[cacheFilePath] = newPids;

        return result || newPids.length !== 0;
      },
      false,
    );

    if (hasWorkingPids) {
      timer = setTimeout(checking, TIME_TO_CHECK, 0);
      return;
    }

    if (
      checkedTimes >= TIME_TO_REMOVE_FILES / TIME_TO_CHECK &&
      Object.keys(cache).length !== 0
    ) {
      removeFilePath(Object.keys(cache)[0], () => {
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
  await Promise.all(
    Object.keys(cache).map(
      (filePath: string) =>
        new Promise(resolve => {
          debugLog({
            filePath,
            pids: cache[filePath],
          });
          cache[filePath].forEach((pid: number) => {
            process.kill(pid, 0);
          });
          removeFilePath(filePath, resolve);
        }),
    ),
  );
  await end(__filename);
};
