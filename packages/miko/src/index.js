// @flow

import path from 'path';

import { invariant } from 'fbjs';

import buildWorker from '@mikojs/worker';

// $FlowFixMe FIXME: Owing to utils/configsCache use pipline
import configsCache, { type initialConfigsType } from './utils/configsCache';
import { type mikoConfigsType as parseArgvMikoConfigsType } from './utils/addCustomCommands';

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
  const { config, configFile } = configsCache.get(configName);

  (async () => {
    const worker = await buildWorker<workerType>(
      path.resolve(__dirname, './worker/index.js'),
    );

    invariant(configFile, 'Could not find config.');
    worker.addTracking(process.pid, configFile);
  })();

  return config?.({}) || {};
};
