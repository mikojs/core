// @flow

import { transformSync } from '@babel/core';
import outputFileSync from 'output-file-sync';

import testings from './__ignore__/testings';

describe('babel-plugin-transform-flow', () => {
  beforeEach(() => {
    outputFileSync.mockReset();
  });

  test.each(testings)(
    '%s',
    (
      info: string,
      options: {},
      content: string,
      expected: $ReadOnlyArray<[string, string]>,
      logInfo: string | false,
    ) => {
      const mockLog = jest.fn();

      global.console.log = mockLog;
      transformSync(content, options);

      expect(outputFileSync.mock.calls).toEqual(
        expected.length === 0 ? [] : [expected],
      );

      if (logInfo) expect(mockLog).toHaveBeenCalledWith(logInfo);
      else expect(mockLog).not.toHaveBeenCalled();
    },
  );
});
