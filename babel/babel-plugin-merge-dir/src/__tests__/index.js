// @flow

import { transformSync } from '@babel/core';
import outputFileSync from 'output-file-sync';

import testings from './__ignore__/testings';

describe('babel-plugin-merge-dir', () => {
  beforeEach(() => {
    outputFileSync.mockClear();
  });

  test.each(testings)(
    '%s',
    (
      info: string,
      options: {},
      content: string,
      expected: [string, string],
    ) => {
      transformSync(content, options);

      expect(outputFileSync.mock.calls[0]).toEqual(expected);
    },
  );
});
