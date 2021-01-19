// @flow

import fs from 'fs';
import path from 'path';

import rimraf from 'rimraf';

import link from '../link';

jest.mock('fs');

describe('link', () => {
  beforeEach(() => {
    fs.symlinkSync.mockClear();
    rimraf.mockClear();
  });

  test.each`
    remove
    ${false}
    ${true}
  `('remove = $remove', async ({ remove }: {| remove: boolean |}) => {
    // $FlowFixMe jest mock
    fs.existsSync.mockImplementation(
      (filePath: string) => !/__mocks__/.test(filePath),
    );
    // $FlowFixMe jest mock
    fs.lstatSync.mockImplementation((filePath: string) => ({
      isSymbolicLink: jest.fn().mockReturnValue(!/__mocks__/.test(filePath)),
    }));
    await link(remove);

    if (remove) {
      expect(rimraf).toHaveBeenCalledTimes(1);
      expect(rimraf.mock.calls[0][0]).toBe(path.resolve('./.flowconfig'));
    } else {
      expect(fs.symlinkSync).toHaveBeenCalledTimes(1);
      expect(fs.symlinkSync).toHaveBeenCalledWith(
        path.resolve('./.flowconfig'),
        path.resolve('./__mocks__/@lerna/.flowconfig'),
      );
    }
  });
});
