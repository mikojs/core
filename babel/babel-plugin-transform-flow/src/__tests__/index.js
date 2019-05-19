// @flow

import { transformSync } from '@babel/core';
import { outputFileSync } from 'output-file-sync';

import testings from './__ignore__/testings';

describe('babel-plugin-transform-flow', () => {
  beforeEach(() => {
    outputFileSync.destPaths = [];
    outputFileSync.contents = [];
  });

  test.each(testings)(
    '%s',
    (
      info: string,
      options: {},
      content: string,
      filePath: string,
      output: string,
      logInfo: string,
    ) => {
      const mockLog = jest.fn();

      global.console.log = mockLog;
      transformSync(content, options);

      expect(outputFileSync.destPaths).toEqual([filePath]);
      expect(outputFileSync.contents).toEqual([output]);

      if (logInfo) expect(mockLog).toHaveBeenCalledWith(logInfo);
      else expect(mockLog).not.toHaveBeenCalled();
    },
  );
});
