// @flow

import debug from 'debug';
import execa from 'execa';
import chalk from 'chalk';

import logger from './logger';
import cache from './cache';

const debugLog = debug('helper:handleError');

/**
 * @example
 * handleNotFound(': babel: command not found');
 *
 * @param {string} notFoundModule - not found module
 */
const handleCommandNotFound = async (
  notFoundModule: string,
): Promise<boolean> => {
  const packages = {
    babel: ['@babel/core', '@babel/cli'],
  }[notFoundModule] || [notFoundModule];

  logger.warn(chalk`Can not find command: {red ${notFoundModule}}`);
  logger.start(chalk`Try to install: {red ${packages.join(', ')}}`);

  try {
    await execa.shell(
      `npm i --no-package-lock --no-save ${packages.join(' ')}`,
    );

    logger.succeed(chalk`{cyan ${packages.join(', ')}} have installed`);
    cache.push('packages', packages);

    return true;
  } catch (e) {
    debugLog(e);

    logger.warn(chalk`Install {cyan ${packages.join(', ')}} fail

{gray ${e.stderr || e.message}}`);
    return false;
  }
};

export default (errMessage: string): Promise<boolean> | boolean => {
  if (/command not found/.test(errMessage))
    return handleCommandNotFound(
      errMessage.replace(/.*: (.*): command not found\n/, '$1'),
    );

  return false;
};
