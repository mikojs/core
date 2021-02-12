// @flow

import path from 'path';

import chalk from 'chalk';
import execa from 'execa';
import readPkgUp from 'read-pkg-up';

import getContext from '../getContext';

const stdout = 'origin\tgit@github.com:mikojs/core.git (fetch)';

describe('get context', () => {
  test('could not find git remote', async () => {
    await expect(getContext(__dirname)).rejects.toThrow(
      chalk`Could not find {green git remote}.`,
    );
  });

  test('could not get the root path', async () => {
    execa.mockResolvedValue({ stdout });
    readPkgUp.mockResolvedValue({});

    await expect(getContext(__dirname)).rejects.toThrow(
      'Could not find the root path.',
    );
  });

  test('could get all context', async () => {
    execa.mockResolvedValue({ stdout });
    readPkgUp.mockResolvedValue({
      path: path.resolve(__dirname, './package.json'),
      packageJson: {},
    });

    expect(await getContext(__dirname)).toEqual({
      repoInfo: 'mikojs/core',
      rootPath: __dirname,
    });
  });
});
