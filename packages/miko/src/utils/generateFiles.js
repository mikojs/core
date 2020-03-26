// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import debug from 'debug';
import outputFileSync from 'output-file-sync';

import { createLogger } from '@mikojs/utils';

import cache from './cache';

const logger = createLogger('@mikojs/miko');
const debugLog = debug('miko:generateFiles');

/**
 * @example
 * generateFiles()
 *
 * @param {Array} configNames - config names
 */
export default (configNames: $ReadOnlyArray<string>) => {
  const gitFilePath = cache.resolve('./.gitignore');
  const gitignore = (!fs.existsSync(gitFilePath)
    ? ''
    : fs.readFileSync(gitFilePath, 'utf-8')
  ).replace(/^#.*$/gm, '');

  cache
    .keys()
    .filter((key: string) =>
      configNames.length === 0 ? true : configNames.includes(key),
    )
    .forEach((key: string) => {
      const { filenames, config, ignore } = cache.get(key);
      const configFilename = filenames?.config;
      const ignoreFilename = filenames?.ignore;

      [
        !configFilename || !config
          ? null
          : [
              cache.resolve(configFilename),
              `/* eslint-disable */ module.exports = require('@mikojs/miko')('${key}');`,
            ],
        !ignoreFilename || !ignore
          ? null
          : [cache.resolve(ignoreFilename), ignore([]).join('\n')],
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
