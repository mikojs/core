// @flow

import path from 'path';

import outputFileSync from 'output-file-sync';
import debug from 'debug';

import { type cacheType } from './buildCache';

const debugLog = debug('miko:generateFiles');

/**
 * @example
 * generateFiles('/cwd', cache)
 *
 * @param {string} cwd - cwd path
 * @param {cacheType} cache - configs cache
 */
export default (cwd: string, cache: cacheType) => {
  debugLog(cwd);

  cache.keys().forEach((key: string) => {
    const { filenames, config, ignore } = cache.get(key);
    const configFilename = filenames?.config;
    const ignoreFilename = filenames?.ignore;

    [
      !configFilename || !config
        ? null
        : [
            path.resolve(cwd, configFilename),
            `/* eslint-disable */ module.exports = require('@mikojs/miko')('${key}');`,
          ],
      !ignoreFilename || !ignore
        ? null
        : [path.resolve(cwd, ignoreFilename), ignore([]).join('\n')],
    ]
      .filter(Boolean)
      .forEach((argu: [string, string]) => {
        debugLog(argu);
        outputFileSync(...argu);
      });
  });
};
