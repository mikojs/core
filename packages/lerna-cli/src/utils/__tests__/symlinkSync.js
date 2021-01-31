// @flow

import fs from 'fs';

import rimraf from 'rimraf';

import symlinkSync from '../symlinkSync';

jest.mock('fs');

describe('rimraf sync', () => {
  beforeEach(() => {
    rimraf.mockClear();
  });

  test('remove fail', async () => {
    const errorMessage = 'Remove folder error.';

    // $FlowFixMe jest mock
    fs.existsSync.mockReturnValue(true);
    // $FlowFixMe jest mock
    fs.lstatSync.mockReturnValue({
      isSymbolicLink: jest.fn().mockReturnValue(true),
    });
    rimraf.mockImplementation(
      (filePath: string, callback: (err: mixed) => void) =>
        callback(new Error(errorMessage)),
    );

    await expect(() => symlinkSync(__dirname, __dirname, true)).rejects.toThrow(
      errorMessage,
    );
  });
});
