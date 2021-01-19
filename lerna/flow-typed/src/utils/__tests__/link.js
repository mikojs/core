// @flow

import fs from 'fs';
import path from 'path';

import rimraf from 'rimraf';

import link from '../link';

jest.mock('fs');

describe('link', () => {
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
    fs.existsSync.mockImplementation(
      (filePath: string) => !/__mocks__/.test(filePath),
    );
    // $FlowFixMe jest mock
    fs.lstatSync.mockImplementation((filePath: string) => ({
      isSymbolicLink: jest.fn().mockReturnValue(!/__mocks__/.test(filePath)),
    }));
    await link(remove);

    if (remove) {
      expect(rimraf).toHaveBeenCalledTimes(3);
      [
        './.flowconfig',
        './node_modules/lerna',
        './node_modules/@mikojs/test',
      ].forEach((filePath: string, index: number) => {
        expect(rimraf.mock.calls[index][0]).toBe(path.resolve(filePath));
      });
    } else {
      expect(fs.symlinkSync).toHaveBeenCalledTimes(1);
      expect(fs.symlinkSync).toHaveBeenCalledWith(
        path.resolve('./.flowconfig'),
        path.resolve('./__mocks__/@lerna/.flowconfig'),
      );
    }
  });
});
