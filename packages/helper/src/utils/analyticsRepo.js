// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import readPkgUp from 'read-pkg-up';

import logger from './logger';

type analyticsRepoType = {};

const pkgInfo = readPkgUp.sync();

/**
 * @example
 * getList('root')
 *
 * @param {string} rootFolder - root floder
 *
 * @return {Object} - get list
 */
const getList = (
  rootFolder: string,
): {
  hasRootFolder: boolean,
  folderList: $ReadOnlyArray<string>,
} => {
  try {
    return {
      hasRootFolder: true,
      folderList: fs.readdirSync(
        path.resolve(
          pkgInfo.path ? path.dirname(pkgInfo.path) : process.cwd(),
          rootFolder,
        ),
      ),
    };
  } catch (e) {
    return {
      hasRootFolder: false,
      folderList: [],
    };
  }
};

export default (rootFolder: string): analyticsRepoType => {
  const { hasRootFolder, folderList } = getList(rootFolder);

  if (!hasRootFolder)
    logger.error(
      'Can not find the root folder',
      chalk`Use {cyan \`-h\`} to get the more information`,
    );

  return folderList.reduce(
    (result: analyticsRepoType, key: string): analyticsRepoType => {
      // TODO
      switch (key) {
        default:
          return result;
      }
    },
    pkgInfo.pkg,
  );
};
