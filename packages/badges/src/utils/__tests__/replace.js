// @flow

import fs from 'fs';

import execa from 'execa';

import replace from '../replace';

import testings, { type testingType } from './__ignore__/testings';

const context = {
  rootPath: 'rootPath',
  repoInfo: 'repoInfo',
  name: 'name',
  homepage: 'homepage',
  engines: {
    node: '>= 1.0.0',
    npm: '>= 1.0.0',
    yarn: '>= 1.0.0',
  },
};

jest.mock('fs');

describe('replace', () => {
  test('could not find pattern in context', () => {
    expect(() => replace('{{ not.found }}', context)).toThrow(
      'Could not find not.found in context',
    );
  });

  test.each(testings)(
    '%s',
    (
      info: $ElementType<testingType, 0>,
      fsExist: $ElementType<testingType, 1>,
      expected: $ElementType<testingType, 2>,
    ) => {
      execa.mockResolvedValue({
        stdout: 'origin\tgit@github.com:mikojs/core.git (fetch)',
      });
      // $FlowFixMe jest mock
      fs.existsSync.mockReturnValue(fsExist);

      const result = replace(
        '<!-- badges.start --><!-- badges.end -->',
        context,
      );

      expected.forEach((key: string) => {
        expect(result).toMatch(new RegExp(key));
      });
    },
  );
});
