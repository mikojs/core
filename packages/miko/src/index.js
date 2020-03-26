// @flow

import path from 'path';

import { cosmiconfigSync } from 'cosmiconfig';
import debug from 'debug';

import buildWorker from '@mikojs/worker';

import buildCache from './utils/buildCache';
import typeof * as workerType from './utils/worker';

const debugLog = debug('miko');

/**
 * @example
 * miko('babel')
 *
 * @param {string} configName - config name
 *
 * @return {object} - config object
 */
export default (configName: string): {} => {
  const cache = buildCache();
  const config = cosmiconfigSync('miko').search();

  debugLog(config);
  cache.init(config?.config);
  buildWorker<workerType>(path.resolve(__dirname, './utils/worker.js')).then(
    (worker: workerType) => {
      worker.addTracking(configName, process.pid);
    },
  );

  return cache.get(configName)?.config?.({}) || {};
};
