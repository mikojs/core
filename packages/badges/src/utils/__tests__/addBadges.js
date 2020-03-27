// @flow

import fs from 'fs';
import execa from 'execa';

import addBadges from '../addBadges';

jest.mock('fs');

const ctx = {
  rootPath: '/rootPath',
  pkg: {
    name: 'badges',
    homepage: 'https://mikojs.github.io/core',
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
];

describe('add badges', () => {
  test('can not find git remote', async () => {
    const mockLog = jest.fn();

    global.console.error = mockLog;
    execa.mockRejectedValue(new Error('can not find git remote'));

    expect(await addBadges('readme', ctx)).toBeNull();
    expect(mockLog).toHaveBeenCalled();
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
      execa.mockResolvedValue({
        stdout: 'origin\tgit@github.com:mikojs/core.git (fetch)',
      });
      // $FlowFixMe jest mock
      fs.existsSync.mockReturnValue(fsExist);

      const result = await addBadges(
        '<!-- badges.start --><!-- badges.end -->',
        {
          ...ctx,
          pkg: !engines
            ? {}
            : {
                ...ctx.pkg,
                engines,
              },
        },
      );

      ALL_BADGES.forEach((key: string) => {
        (expected.includes(key) ? expect(result) : expect(result).not).toMatch(
          new RegExp(key),
        );
      });
    },
  );
});