// @flow

import { type fileDataType } from '@mikojs/merge-dir';

import buildRouter from '../buildRouter';

import testings from './__ignore__/testings';

describe('build router', () => {
  test.each(testings)(
    '%s',
    (info: string, fileData: fileDataType, expected: string) => {
      expect(buildRouter(fileData)).toMatch(expected);
    },
  );
});
