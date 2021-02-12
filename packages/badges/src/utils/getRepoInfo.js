// @flow

import execa from 'execa';
import chalk from 'chalk';

import createLogger from '@mikojs/logger';

const logger = createLogger('@mikojs/badges:getRepo');

/**
 * @return {string} - repo info
 */
export default async (): Promise<string> => {
  try {
    const { stdout } = await execa('git', ['remote', '-v']);

    logger.debug(stdout);

    return stdout.replace(/origin\t.*@.*:(.*).git \(fetch\)(.|\n)*/, '$1');
  } catch (e) {
    logger.debug(e);
    throw new Error(chalk`Could not find {green git remote}.`);
  }
};
