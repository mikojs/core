// @flow

import fs from 'fs';

import debug from 'debug';
import findCacheDir from 'find-cache-dir';
import outputFileSync from 'output-file-sync';

import logger from './logger';

const debugLog = debug('helper:cache');
const cacheDir = findCacheDir({ name: 'helper', thunk: true });
const DEFAULT_STORE = {
  packages: [],
};

/** cache class */
export class Cache {
  cachePath = '';

  store = DEFAULT_STORE;

  /**
   * @example
   * new Cache(true)
   *
   * @param {boolean} isProd - is Production
   */
  constructor(isProd: boolean) {
    if (!cacheDir)
      logger.fail('Run `yarn init` or `npm init` before running `helper`');

    this.cachePath = cacheDir(isProd ? 'prod.json' : 'dev.json');
    this.store = fs.existsSync(this.cachePath)
      ? require(this.cachePath)
      : DEFAULT_STORE;

    debugLog(`cachePath: ${this.cachePath}`);
    debugLog(`store: ${JSON.stringify(this.store, null, 2)}`);
  }

  /**
   * @example
   * cache.wirteStore()
   */
  writeStore = () => {
    outputFileSync(this.cachePath, JSON.stringify(this.store, null, 2));
  };

  /**
   * @example
   * cache.push('name', ['data'])
   *
   * @param {string} name - push data name
   * @param {Array} newData - new data array
   */
  push = (name: string, newData: $ReadOnlyArray<string>) => {
    this.store[name].push(...newData);
    this.writeStore();

    debugLog(`push: ${name}, [${newData.join(', ')}]`);
  };
}

export default new Cache(process.env.NODE_ENV === 'production');
