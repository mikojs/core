// @flow

import { type fileDataType } from '@mikojs/server';

import buildCache from '../buildCache';

import testings from './__ignore__/testings';

describe('build cache', () => {
  test.each(testings)(
    '%s',
    (info: string, fileData: fileDataType, expected: string) => {
      expect(buildCache(fileData)).toMatch(expected);
    },
  );
});
