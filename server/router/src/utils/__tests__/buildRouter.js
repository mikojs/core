// @flow

import { type fileDataType } from '@mikojs/server';

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
