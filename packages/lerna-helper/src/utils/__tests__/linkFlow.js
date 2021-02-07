// @flow

import fs from 'fs';
import path from 'path';

import rimraf from 'rimraf';

import linkFlow from '../linkFlow';

import init from './__ignore__/init';

jest.mock('fs');

describe('link flow', () => {
  beforeEach(init);

  test.each`
    remove
    ${false}
    ${true}
  `('remove = $remove', async ({ remove }: {| remove: boolean |}) => {
    await linkFlow(remove);

    if (remove) {
      expect(rimraf).toHaveBeenCalledTimes(2);
      ['./.flowconfig', './node_modules/lerna'].forEach(
        (filePath: string, index: number) => {
          expect(rimraf.mock.calls[index][0]).toBe(path.resolve(filePath));
        },
      );
    } else {
      expect(fs.symlinkSync).toHaveBeenCalledTimes(2);
      expect(fs.symlinkSync).toHaveBeenCalledWith(
        path.resolve('./.flowconfig'),
        path.resolve('./test/.flowconfig'),
      );
    }
  });
});
