// @flow

import { cosmiconfigSync } from 'cosmiconfig';
import debug from 'debug';

import buildCache from './utils/buildCache';

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

  return cache.get(configName)?.config?.({}) || {};
};
