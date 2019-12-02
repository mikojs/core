// @flow

import execa from 'execa';

import getUser from '../getUser';

test('not set git user', async () => {
  execa.mockRejectedValue(new Error('not set git user'));

  await expect(getUser()).rejects.toThrow(
    'Run `git config --global user.name <username>` before creating project',
  );
});
