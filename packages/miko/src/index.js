// @flow

import path from 'path';

import buildWorker from '@mikojs/worker';

import cache, { type initialConfigsType } from './utils/cache';

import typeof * as workerType from './worker';

// $FlowFixMe FIXME: Owing to utils/cache use pipline
export type configsType = initialConfigsType;

/**
 * @param {string} configName - config name
 *
 * @return {object} - config object
 */
export default (configName: string): {} => {
  const { config, configFile, ignoreFile } = cache.get(configName);

  (buildWorker<workerType>(path.resolve(__dirname, './worker/index.js')): $Call<
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
