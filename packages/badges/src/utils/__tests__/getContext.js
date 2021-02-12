// @flow

import path from 'path';

import chalk from 'chalk';
import execa from 'execa';

import getContext from '../getContext';

const stdout = 'origin\tgit@github.com:mikojs/badges.git (fetch)';

describe('get context', () => {
  test('could not find git remote', async () => {
    await expect(getContext(__dirname)).rejects.toThrow(
      chalk`Could not find {green git remote}.`,
    );
  });

  test('could not get the root path', async () => {
    execa.mockResolvedValue({ stdout });

    await expect(getContext(path.resolve('..'))).rejects.toThrow(
      'Could not find the root path.',
    );
  });

  test('could get all context', async () => {
    execa.mockResolvedValue({ stdout });

    expect(await getContext(__dirname)).toEqual(
      expect.objectContaining({
        repoInfo: 'mikojs/badges',
        rootPath: path.resolve(__dirname, '../../..'),
      }),
    );
  });
});
