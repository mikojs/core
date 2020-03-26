// @flow

import path from 'path';

import buildWorker from '@mikojs/worker';

import cache from './utils/cache';
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
  const { config, configFile, ignoreFile } = cache.get(configName);

  (buildWorker<workerType>(path.resolve(__dirname, './utils/worker.js')): $Call<
    typeof buildWorker,
    string,
  >).then((worker: workerType) => {
    [configFile, ignoreFile]
      .filter(Boolean)
      .forEach(([filePath]: [string, string]) => {
        worker.addTracking(process.pid, filePath);
      });
  });

  return config?.({}) || {};
};
