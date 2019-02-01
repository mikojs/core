// @flow

import memoizeOne from 'memoize-one';
import execa from 'execa';
import debug from 'debug';
import chalk from 'chalk';
import { emptyFunction } from 'fbjs';

import logger from './logger';

/**
 * @example
 * getUser()
 *
 * @return {Promise} - user data
 */
export const getUser = () =>
  Promise.all(
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
      async ({ name, cmd }: { name: string, cmd: string }): Promise<string> => {
        try {
          return await execa
            .shell(cmd)
            .then(({ stdout }: { stdout: string }) => stdout);
        } catch (e) {
          debug('create-project:getUser')(e);
          throw logger.fail(
            chalk`Run {green \`${cmd}\`} before creating project`,
          );
        }
      },
    ),
  );

export default memoizeOne(getUser, emptyFunction.thatReturnsTrue);
