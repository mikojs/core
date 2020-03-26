// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import debug from 'debug';
import outputFileSync from 'output-file-sync';

import { createLogger } from '@mikojs/utils';

import { type cacheType } from './buildCache';

const logger = createLogger('@mikojs/miko');
const debugLog = debug('miko:generateFiles');

/**
 * @example
 * generateFiles('/cwd', cache)
 *
 * @param {string} cwd - cwd path
 * @param {cacheType} cache - configs cache
 */
export default (cwd: string, cache: cacheType) => {
  const gitFilePath = path.resolve(cwd, './.gitignore');
  const gitignore = (!fs.existsSync(gitFilePath)
    ? ''
    : fs.readFileSync(gitFilePath, 'utf-8')
  ).replace(/^#.*$/gm, '');

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
        const filename = path.basename(argu[0]);

        if (!new RegExp(filename).test(gitignore))
          logger.warn(
            chalk`{red ${filename}} should be added in {bold {gray .gitignore}}`,
          );

        debugLog(argu);
        outputFileSync(...argu);
      });
  });
};
