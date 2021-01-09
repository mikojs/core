// @flow

import path from 'path';

import buildWorker from '@mikojs/worker';

// $FlowFixMe FIXME: Owing to utils/configsCache use pipline
import configsCache, { type initialConfigsType } from './utils/configsCache';
import { type mikoConfigsType as parseArgvMikoConfigsType } from './utils/parseArgv';

import typeof * as workerType from './worker';

// $FlowFixMe FIXME: Owing to utils/configsCache use pipline
export type configsType = initialConfigsType;
export type mikoConfigsType = parseArgvMikoConfigsType;

/**
 * @param {string} configName - config name
 *
 * @return {object} - config object
 */
export default (configName: string): {} => {
  const { config, configFile, ignoreFile } = configsCache.get(configName);

  (async () => {
    const worker = await buildWorker<workerType>(
      path.resolve(__dirname, './worker/index.js'),
    );

    [configFile, ignoreFile]
      .filter(Boolean)
      .forEach(([filePath]: [string, string]) => {
        worker.addTracking(process.pid, filePath);
      });
  })();

  return config?.({}) || {};
};
