// @flow

import path from 'path';

import buildWorker from '@mikojs/worker';

import buildCache from './utils/buildCache';
import typeof * as workerType from './utils/worker';

/**
 * @example
 * miko('babel')
 *
 * @param {string} configName - config name
 *
 * @return {object} - config object
 */
export default (configName: string): {} => {
  buildWorker<workerType>(path.resolve(__dirname, './utils/worker.js')).then(
    (worker: workerType) => {
      worker.addTracking(configName, process.pid);
    },
  );

  return (
    buildCache()
      .load()
      .get(configName)
      ?.config?.({}) || {}
  );
};
