// @flow

import fs from 'fs';
import path from 'path';

import { getPackagesSync } from '@lerna/project';

type packageType = {|
  name: string,
  manifestLocation: string,
|};

const cacheFolder = path.resolve('./node_modules/.cache/flow-typed');

/**
 * @param {string} folderPath - folder path
 */
const mkdirSync = (folderPath: string) => {
  if (fs.existsSync(folderPath)) return;

  mkdirSync(path.dirname(folderPath));
  fs.mkdirSync(folderPath);
};

/**
 * @param {string} sourceFolder - source folder
 * @param {string} targetFolder - target folder
 *
 * @return {string} - command string
 */
const copy = (sourceFolder: string, targetFolder: string): string => {
  mkdirSync(targetFolder);

  return `rm -rf ${targetFolder} && cp -r ${sourceFolder} ${targetFolder}`;
};

export default {
  /**
   * @return {string} - command string
   */
  save: (): string => {
    mkdirSync(cacheFolder);

    return getPackagesSync()
      .map(({ name, manifestLocation }: packageType) =>
        copy(
          path.resolve(manifestLocation, '../flow-typed/npm'),
          path.resolve(cacheFolder, name),
        ),
      )
      .join(' && ');
  },

  /**
   * @return {string} - command string
   */
  restore: (): string =>
    !fs.existsSync(cacheFolder)
      ? 'echo "no cache"'
      : getPackagesSync()
          .map(({ name, manifestLocation }: packageType) =>
            copy(
              path.resolve(cacheFolder, name),
              path.resolve(manifestLocation, '../flow-typed/npm'),
            ),
          )
          .join(' && '),
};
