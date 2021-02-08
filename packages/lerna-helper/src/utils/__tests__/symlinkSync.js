// @flow

import path from 'path';

import rimraf from 'rimraf';

import symlinkSync from '../symlinkSync';

import init from './__ignore__/init';

jest.mock('fs');

test('symlink sync', async () => {
  const filePath = path.resolve('./.flowconfig');
  const errorMessage = 'Remove folder error.';

  init();
  rimraf.mockImplementation((_: string, callback: (err: mixed) => void) =>
    callback(new Error(errorMessage)),
  );

  await expect(symlinkSync(filePath, filePath, true)).rejects.toThrow(
    errorMessage,
  );
});
