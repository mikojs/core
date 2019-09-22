// @flow

import memoizeOne from 'memoize-one';
import execa from 'execa';
import debug from 'debug';
import { emptyFunction } from 'fbjs';

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
            throw new Error(
              `Run \`git ${args.join(' ')}\` before creating project`,
            );
          }
        },
      ),
    ),
  emptyFunction.thatReturnsTrue,
);
