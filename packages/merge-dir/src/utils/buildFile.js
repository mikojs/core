// @flow

import fs from 'fs';
import path from 'path';

import { invariant } from 'fbjs';
import debug from 'debug';
import cryptoRandomString from 'crypto-random-string';

import { requireModule } from '@mikojs/utils';

import { type dataType } from './watcher';

export type fileDataType = {|
  exists: boolean,
  filePath: string,
  pathname: string,
|};

export type buildType = (fileData: fileDataType) => string;

const debugLog = debug('merge-dir:buildFile');

export const cacheId: string = cryptoRandomString({
  length: 10,
  type: 'alphanumeric',
});

debugLog({ cacheId });

/**
 * @param {string} folderPath - folder path
 * @param {buildType} build - build cache function
 * @param {string} prefix - pathname prefix
 * @param {Array} data - the data from the watcher
 *
 * @return {string} - file content
 */
export default (
  folderPath: string,
  build: buildType,
  prefix?: string,
  data: $ReadOnlyArray<dataType>,
): string =>
  data.reduce((result: string, { exists, relativePath }: dataType): string => {
    const filePath = path.resolve(folderPath, relativePath);

    debugLog({ exists, relativePath });
    invariant(
      !fs.existsSync(filePath.replace(/\.js$/, '')),
      `You should not use \`folder: ${relativePath.replace(
        /\.js$/,
        '',
      )}\` and \`file: ${relativePath}\` at the same time.`,
    );

    const pathname = [
      prefix,
      relativePath
        .replace(/\.js$/, '')
        .replace(/\/?index$/, '')
        .replace(/\[([^[\]]*)\]/g, ':$1'),
    ]
      .filter(Boolean)
      .join('/')
      .replace(/^([^/])/, '/$1')
      .replace(/^$/, '/');

    debugLog({ pathname });
    delete require.cache[filePath];

    return requireModule(filePath).cacheId === cacheId
      ? result
      : build({
          exists,
          filePath,
          pathname,
        });
  }, '');
