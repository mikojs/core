// @flow

import fs from 'fs';

import findCacheDir from 'find-cache-dir';
import { areEqual } from 'fbjs';
import moment from 'moment';
import outputFileSync from 'output-file-sync';
import rimraf from 'rimraf';
import debug from 'debug';

import configs from './configs';

const debugLog = debug('configs-scripts:worker');
const cacheDir = findCacheDir({
  name: 'configs',
  thunk: true,
  cwd: configs.rootDir,
});

export const cachePath = cacheDir('configs-scripts.json');
export const cacheLockPath = cacheDir('configs-scripts.lock');

debugLog(`Cache path: ${cachePath}`);
debugLog(`Cache lock path: ${cacheLockPath}`);

/** Use to control file */
class Worker {
  /**
   * Open cache file
   *
   * @example
   * worker.openCache()
   *
   * @return {Object} - cache
   */
  openCache = (): {} => {
    try {
      if (fs.existsSync(cachePath)) {
        const { lastUsed, ...cache } = JSON.parse(
          fs.readFileSync(cachePath, 'utf-8'),
        );

        if (moment().diff(lastUsed, 'minutes') < 1) {
          debugLog('Use cache');
          return cache;
        }

        debugLog('Reset cache, cache out time');
      } else debugLog('Not find cache');
    } catch (e) {
      debugLog(`Parse error: ${e}`);
    }

    return {};
  };

  /**
   * Get cache
   *
   * @example
   * worker.getCache();
   *
   * @return {Object} - cache
   */
  getCache = async (): Promise<{}> => {
    // Use to block getting cache, avoid getting in the same time
    await new Promise(resolve => {
      setTimeout(resolve, Math.floor(Math.random() * 100));
    });

    if (!fs.existsSync(cacheLockPath)) {
      const cache = this.openCache();

      outputFileSync(cacheLockPath, JSON.stringify(cache, null, 2));
      rimraf.sync(cachePath);
      debugLog('Open cache, set cache lock');
      return cache;
    }

    debugLog('Find cache lock, waiting');

    const newCache = await new Promise(resolve => {
      setTimeout(() => {
        this.getCache().then(resolve);
      }, 100);
    });

    return newCache;
  };

  /**
   * Write cache
   *
   * @example
   * worker.writeCache({})
   *
   * @param {string} cache - cache
   */
  writeCache = async (cache: {}): Promise<void> => {
    const newCache = JSON.stringify(
      {
        ...cache,
        lastUsed: moment().format(),
      },
      null,
      2,
    );

    outputFileSync(cachePath, newCache);
    rimraf.sync(cacheLockPath);
    debugLog(`Write cache: ${newCache}`);
  };

  /**
   * Write file
   *
   * @example
   * worker.writeFile('file path', 'content')
   *
   * @param {string} filePath - file path to write file
   * @param {string} content - file content
   */
  writeFile = async (filePath: string, content: string): Promise<void> => {
    const cache = await this.getCache();

    outputFileSync(filePath, content);

    if (!cache[filePath]) cache[filePath] = { keys: [] };

    cache[filePath].keys.push({
      cwd: process.cwd(),
      argv: process.argv,
    });
    cache[filePath].using = moment().format();
    debugLog(`Write file: ${JSON.stringify({ filePath, content }, null, 2)}`);
    this.writeCache(cache);
  };

  /**
   * Set file to be used
   *
   * @example
   * worker.usingFile('file path');
   *
   * @param {string} filePath - file path to be used
   */
  usingFile = (filePath: string) => {
    const cache = this.openCache();

    cache[filePath].using = moment().format();
    debugLog(
      `Using file: ${JSON.stringify(
        { filePath, using: moment().format() },
        null,
        2,
      )}`,
    );
    this.writeCache(cache);
  };

  /**
   * Remove files
   *
   * @example
   * worker.removeFiles()
   */
  removeFiles = async (): Promise<void> => {
    const cache = await this.getCache();
    let removeFilesAgain: boolean = false;

    Object.keys(cache).forEach((filePath: string) => {
      cache[filePath].keys = cache[filePath].keys.filter(
        (key: string): boolean =>
          !areEqual(key, {
            cwd: process.cwd(),
            argv: process.argv,
          }),
      );

      if (cache[filePath].keys.length === 0 && fs.existsSync(filePath)) {
        if (moment().diff(cache[filePath].using, 'seconds') > 0.5) {
          delete cache[filePath];
          rimraf.sync(filePath);
          debugLog(`Remove file: ${filePath}`);
        } else removeFilesAgain = true;
      }
    });

    this.writeCache(cache);

    if (removeFilesAgain) {
      debugLog('Wait 0.5s to remove file');
      await new Promise(resolve => {
        setTimeout(() => {
          this.removeFiles().then(resolve);
        }, 500);
      });
      return;
    }
  };
}

export default new Worker();
