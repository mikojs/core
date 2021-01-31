// @flow

import fs from 'fs';
import path from 'path';

import rimraf from 'rimraf';

import linkBin from '../linkBin';

jest.mock('fs');

describe('link bin', () => {
  beforeEach(() => {
    // $FlowFixMe jest mock
    fs.symlinkSync.mockClear();
    rimraf.mockClear();
  });

  test.each`
    remove
    ${false}
    ${true}
  `('remove = $remove', async ({ remove }: {| remove: boolean |}) => {
    // $FlowFixMe jest mock
    fs.existsSync.mockImplementation((filePath: string) =>
      /test/.test(filePath),
    );
    // $FlowFixMe jest mock
    fs.lstatSync.mockImplementation((filePath: string) => ({
      isSymbolicLink: jest.fn().mockReturnValue(/test/.test(filePath)),
    }));
    await linkBin(remove);

    if (remove) {
      expect(rimraf).toHaveBeenCalledTimes(1);
      expect(rimraf.mock.calls[0][0]).toBe(
        path.resolve('./test/lib/bin/index.js'),
      );
    } else {
      expect(fs.symlinkSync).toHaveBeenCalledTimes(1);
      expect(fs.symlinkSync).toHaveBeenCalledWith(
        path.resolve('./node_modules/.bin/core'),
        path.resolve('./lib/bin/index.js'),
      );
    }
  });
});
