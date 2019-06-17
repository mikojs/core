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
      filePath: string | false,
      output: string | false,
      logInfo: string | false,
    ) => {
      const mockLog = jest.fn();

      global.console.log = mockLog;
      transformSync(content, options);

      expect(outputFileSync.destPaths).toEqual(filePath ? [filePath] : []);
      expect(outputFileSync.contents).toEqual(output ? [output] : []);

      if (logInfo) expect(mockLog).toHaveBeenCalledWith(logInfo);
      else expect(mockLog).not.toHaveBeenCalled();
    },
  );
});
