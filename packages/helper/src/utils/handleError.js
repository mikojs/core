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
const handleCommandNotFound = async (notFoundModule: string): Promise<?{}> => {
  const packages = {
    babel: ['@babel/core', '@babel/cli'],
  }[notFoundModule] || [notFoundModule];

  debugLog(`notFoundModule: ${notFoundModule}`);
  logger.warn(chalk`Can not find command: {red ${notFoundModule}}`);
  logger.start(chalk`Try to install: {red ${packages.join(', ')}}`);

  try {
    const result = await execa.shell(
      `npm i --no-package-lock ${packages.join(' ')}`,
    );

    logger.succeed(chalk`{cyan ${packages.join(', ')}} have installed`);
    cache.push('packages', packages);

    return result;
  } catch (e) {
    debugLog(e);

    return logger.fail(chalk`Install fail

{gray ${e.stderr || e.message}}`);
  }
};

export default (errMessage: string): ?Promise<?{}> => {
  debugLog(`errMessage: ${errMessage}`);

  if (/command not found/.test(errMessage))
    return handleCommandNotFound(
      errMessage.replace(/.*: (.*): command not found\n/, '$1'),
    );

  return null;
};
