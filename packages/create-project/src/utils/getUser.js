// @flow

import memoizeOne from 'memoize-one';
import execa from 'execa';
import debug from 'debug';
import chalk from 'chalk';
import { emptyFunction } from 'fbjs';

import logger from './logger';

export default memoizeOne(
  () =>
    Promise.all(
      [
        {
          name: 'username',
          args: ['config', '--get', 'user.name'],
        },
        {
          name: 'email',
          args: ['config', '--get', 'user.email'],
        },
      ].map(
        async ({
          name,
          args,
        }: {|
          name: string,
          args: $ReadOnlyArray<string>,
        |}): Promise<string> => {
          try {
            const { stdout } = await execa('git', args);

            return stdout;
          } catch (e) {
            debug('create-project:getUser')(e);
            throw logger.fail(
              chalk`Run {green \`git ${args.join(
                ' ',
              )}\`} before creating project`,
            );
          }
        },
      ),
    ),
  emptyFunction.thatReturnsTrue,
);
