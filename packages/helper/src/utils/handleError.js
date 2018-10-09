// @flow

import path from 'path';

import execa from 'execa';
import mkdirp from 'mkdirp';
import chalk from 'chalk';

import { pkgFolder } from './analyticsRepo';
import logger from './logger';

/**
 * @example
 * handleNotFound(': babel: command not found');
 *
 * @param {string} notFoundModule - not found module
 */
const handleCommandNotFound = async (notFoundModule: string): Promise<?{}> => {
  const packageName =
    {
      babel: '@babel/core @babel/cli',
    }[notFoundModule] || notFoundModule;

  try {
    // make dir
    const tempPackages = path.resolve(
      pkgFolder,
      './node_modules/temp-packages',
    );

    mkdirp.sync(tempPackages);

    logger.info(
      chalk`Can not find command → {red ${notFoundModule}}`,
      chalk`Try to install → {cyan ${packageName.replace(/ /g, ', ')}}`,
    );

    return execa.shell(`npm i --no-package-lock ${packageName}`, {
      cwd: tempPackages,
    });
  } catch (e) {
    if (e.statusCode === 404) return null;

    throw e;
  }
};

export default (errMessage: string): ?Promise<?{}> => {
  if (/command not found/.test(errMessage))
    return handleCommandNotFound(
      errMessage.replace(/.*: (.*): command not found\n/, '$1'),
    );

  return null;
};
