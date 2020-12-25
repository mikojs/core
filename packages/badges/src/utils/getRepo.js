// @flow

import execa from 'execa';
import chalk from 'chalk';

import createLogger from '@mikojs/logger';

const logger = createLogger('@mikojs/badges:getRepo');

type repoType = {|
  username: string,
  projectName: string,
|};

/**
 * @return {repoType} - user name and project name
 */
export default async (): Promise<?repoType> => {
  try {
    const { stdout } = await execa('git', ['remote', '-v']);
    const [username, projectName] = stdout
      .replace(/origin\t.*@.*:(.*).git \(fetch\)(.|\n)*/, '$1')
      .split('/');

    logger.debug({
      username,
      projectName,
    });

    return {
      username,
      projectName,
    };
  } catch (e) {
    logger.debug(e);
    logger.error(chalk`Could not find {green git remote}.`);
    return null;
  }
};
