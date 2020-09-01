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
      expected: [string, string] | null,
    ) => {
      transformSync(content, options);

      if (expected) expect(outputFileSync.mock.calls[0]).toEqual(expected);
      else expect(outputFileSync).not.toHaveBeenCalled();
    },
  );
});
