// @flow

import { execa } from 'execa';

import badges from '../badges';

const ctx = {
  rootPath: '/rootPath',
  pkg: {
    name: 'badges',
    homepage: 'https://cat-org.github.io/core/',
    engines: {
      node: 'node version',
    },
  },
};

describe('badges', () => {
  it('can not find git remote', async (): Promise<void> => {
    execa.mainFunction = () => {
      throw new Error('can not find git remote');
    };

    await expect(badges('readme', ctx)).rejects.toThrow('process exit');
  });

  it('work', async (): Promise<void> => {
    execa.mainFunction = () =>
      'origin\tgit@github.com:cat-org/core.git (fetch)';

    expect(await badges('<!-- badges.start --><!-- badges.end -->', ctx)).toBe(
      `<!-- badges.start -->![github-size][github-size-image] ![engine-node][engine-node-image]

[github-size-image]: https://img.shields.io/github/repo-size/cat-org/core.svg
[engine-node-image]: https://img.shields.io/badge/node-node%20version-green.svg

<!-- badges.end -->`,
    );
  });
});
