// @flow

// $FlowFixMe jest mock
import { fs } from 'fs';
// $FlowFixMe jest mock
import { execa } from 'execa';

import badges from '../badges';

jest.mock('fs');

const ctx = {
  rootPath: '/rootPath',
  pkg: {
    name: 'badges',
    homepage: 'https://cat-org.github.io/core',
  },
};

const ALL_BADGES = [
  'circleci',
  'npm',
  'npm-size',
  'github-size',
  'engine-node',
  'license',
  'lerna',
  'git-search-todo',
  'git-search-eslint-disable',
  'git-search-eslint-disable-line',
  'git-search-eslint-disable-next-line',
  'git-search-FlowFixMe',
];

describe('badges', () => {
  test('can not find git remote', async () => {
    execa.mainFunction = () => {
      throw new Error('can not find git remote');
    };

    await expect(badges('readme', ctx)).rejects.toThrow('process exit');
  });

  test.each`
    info                | engines                     | fsExist  | expected
    ${'default ctx'}    | ${undefined}                | ${false} | ${['github-size']}
    ${'using engines'}  | ${{ node: 'node version' }} | ${false} | ${['github-size', 'engine-node']}
    ${'all file exist'} | ${undefined}                | ${true}  | ${ALL_BADGES.filter((key: string) => !['github-size', 'engine-node'].includes(key))}
  `(
    '$info',
    async ({
      engines,
      fsExist,
      expected,
    }: {|
      engines?: {|
        [string]: string,
      |},
      fsExist: boolean,
      expected: $ReadOnlyArray<string>,
    |}) => {
      execa.mainFunction = () =>
        'origin\tgit@github.com:cat-org/core.git (fetch)';
      fs.exist = fsExist;

      const result = await badges('<!-- badges.start --><!-- badges.end -->', {
        ...ctx,
        pkg: !engines
          ? {}
          : {
              ...ctx.pkg,
              engines,
            },
      });

      ALL_BADGES.forEach((key: string) => {
        (expected.includes(key) ? expect(result) : expect(result).not).toMatch(
          new RegExp(key),
        );
      });
    },
  );
});
