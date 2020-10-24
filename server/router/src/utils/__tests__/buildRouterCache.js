// @flow

import { type fileType } from '@mikojs/server';

import buildRouterCache from '../buildRouterCache';

import testings from './__ignore__/testings';

describe('build router cache', () => {
  test.each(testings)(
    '%s',
    (info: string, fileData: fileType, expected: string) => {
      expect(buildRouterCache(fileData)).toMatch(expected);
    },
  );
});
