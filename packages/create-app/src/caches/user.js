// @flow

import execa from 'execa';
import chalk from 'chalk';

import Cache from './index';

import logger from 'utils/logger';

/** user cache */
class User extends Cache<{
  username?: string,
  email?: string,
}> {
  store = {};

  /**
   * @example
   * user.init()
   */
  init = async (): Promise<void> => {
    await Promise.all(
      [
        {
          name: 'username',
          cmd: 'git config --get user.name',
        },
        {
          name: 'email',
          cmd: 'git config --get user.email',
        },
      ].map(
        async ({ name, cmd }: { name: string, cmd: string }): Promise<void> => {
          try {
            this.store[name] = (await execa.shell(cmd)).stdout;
          } catch (e) {
            logger.fail(chalk`Run {green \`${cmd}\`} before creating project`);
          }
        },
      ),
    );
  };
}

export default new User();
