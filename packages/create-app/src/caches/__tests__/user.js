// @flow

import { execa } from 'execa';

import user from '../user';

describe('user', () => {
  it('get user', async (): Promise<void> => {
    user.isInit = false;

    expect(await user.get('test')).toEqual({
      username: 'git config --get user.name',
      email: 'git config --get user.email',
    });
  });

  it('can not get user.name', async (): Promise<void> => {
    user.isInit = false;

    execa.mainFunction = () => {
      throw new Error('can not get user.name');
    };

    expect(user.get('test')).rejects.toBe('process.exit');
  });
});
