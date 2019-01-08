// @flow

import { execa } from 'execa';

import { getUser } from '../getUser';

describe('get user', () => {
  test('work', async () => {
    expect(await getUser()).toEqual([
      'git config --get user.name',
      'git config --get user.email',
    ]);
  });

  test('not set git user', async () => {
    execa.mainFunction = () => {
      throw new Error('not set git user');
    };

    await expect(getUser()).rejects.toThrow('process exit');
  });
});
