// @flow

import { type fileType } from '@mikojs/server';

import buildRouter from '../buildRouter';

import testings from './__ignore__/testings';

describe('build router', () => {
  test.each(testings)(
    '%s',
    (info: string, fileData: fileType, expected: string) => {
      expect(buildRouter(fileData)).toMatch(expected);
    },
  );
});
