// @flow

import { transformSync } from '@babel/core';
import outputFileSync from 'output-file-sync';

import testings, { type testingType } from './__ignore__/testings';

describe('babel-plugin-transform-flow', () => {
  beforeEach(() => {
    outputFileSync.mockClear();
  });

  test.each(testings)(
    '%s',
    (
      info: $ElementType<testingType, 0>,
      options: $ElementType<testingType, 1>,
      content: $ElementType<testingType, 2>,
      expected: $ElementType<testingType, 3>,
      logInfo: $ElementType<testingType, 4>,
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
