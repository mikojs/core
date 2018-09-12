// @flow

import fs from 'fs';

import findCacheDir from 'find-cache-dir';
import { areEqual } from 'fbjs';
import moment from 'moment';
import outputFileSync from 'output-file-sync';
import rimraf from 'rimraf';

import configs from './configs';

const cacheDir = findCacheDir({
  name: 'configs',
  thunk: true,
  cwd: configs.rootDir,
});
const cachePath = cacheDir('configs-scripts.json');
const cacheLockPath = cacheDir('configs-scripts.lock');

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
  openCache = (): {} =>
    fs.existsSync(cachePath)
      ? JSON.parse(fs.readFileSync(cachePath, 'utf-8'))
      : {};

  /**
   * get cache
   *
   * @example
   * worker.getCache();
   *
   * @return {Object} - cache
   */
  getCache = async (): Promise<{}> => {
    if (!fs.existsSync(cacheLockPath)) {
      const cache = this.openCache();

      outputFileSync(cacheLockPath, JSON.stringify(cache, null, 2));
      rimraf.sync(cachePath);
      return cache;
    }

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
    outputFileSync(cachePath, JSON.stringify(cache, null, 2));
    rimraf.sync(cacheLockPath);
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
        } else {
          removeFilesAgain = true;
        }
      }
    });

    this.writeCache(cache);

    if (removeFilesAgain) {
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
