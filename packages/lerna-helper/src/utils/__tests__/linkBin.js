// @flow

import fs from 'fs';
import path from 'path';

import rimraf from 'rimraf';

import linkBin from '../linkBin';

import init from './__ignore__/init';

jest.mock('fs');

describe('link bin', () => {
  beforeEach(init);

  test.each`
    remove
    ${false}
    ${true}
  `('remove = $remove', async ({ remove }: {| remove: boolean |}) => {
    await linkBin(remove);

    if (remove) {
      expect(rimraf).toHaveBeenCalledTimes(1);
      expect(rimraf.mock.calls[0][0]).toBe(
        path.resolve('./node_modules/.bin/core'),
      );
    } else {
      expect(fs.symlinkSync).toHaveBeenCalledTimes(1);
      expect(fs.symlinkSync).toHaveBeenCalledWith(
        path.resolve('./test/lib/bin/index.js'),
        path.resolve('./node_modules/.bin/test'),
      );
    }
  });
});
