// @flow

import path from 'path';

import { cosmiconfigSync } from 'cosmiconfig';
import debug from 'debug';

import { type configsType } from '../types';

import buildCache from './buildCache';

type configObjType = {|
  config: configsType | $ReadOnlyArray<configsType>,
  filepath: string,
|};

const cache = buildCache();
const debugLog = debug('configs:readConfigs');
let rootDir: string = process.cwd();

/**
 * @example
 * loadConfig()
 *
 * @param {configObjType} configObj - config object
 */
const loadConfig = (configObj: ?configObjType) => {
  debugLog(configObj);

  if (!configObj) return;

  const { config: configs, filepath } = configObj;

  rootDir = path.dirname(filepath);

  if (configs instanceof Array) {
    configs.forEach((config: configsType) => {
      loadConfig({
        config,
        filepath,
      });
    });
    return;
  }

  cache.addConfig(configs);
};

loadConfig(cosmiconfigSync('cat').search());

export default {
  rootDir,
  loadConfig,
  get: cache.get,
  all: cache.all,
  addConfigsFilesToConfig: cache.addConfigsFilesToConfig,
};
