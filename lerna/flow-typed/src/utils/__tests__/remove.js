// @flow

import fs from 'fs';
import path from 'path';

import rimraf from 'rimraf';

import remove from '../remove';

jest.mock('fs');

test('remove', async () => {
  // $FlowFixMe jest mock
  fs.lstatSync.mockImplementation((filePath: string) => ({
    isSymbolicLink: jest.fn().mockReturnValue(!/__mocks__/.test(filePath)),
  }));

  expect(await remove()).toBeUndefined();
  expect(rimraf).toHaveBeenCalledTimes(1);
  expect(rimraf.mock.calls[0][0]).toBe(path.resolve('.flowconfig'));
});
