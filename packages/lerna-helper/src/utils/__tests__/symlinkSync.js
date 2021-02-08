// @flow

import path from 'path';

import rimraf from 'rimraf';

import symlinkSync from '../symlinkSync';

test('symlink sync', async () => {
  const filePath = path.resolve(__dirname, '../../../.flowconfig');
  const errorMessage = 'Remove folder error.';

  rimraf.mockImplementation((_: string, callback: (err: mixed) => void) =>
    callback(new Error(errorMessage)),
  );

  await expect(symlinkSync(filePath, filePath, true)).rejects.toThrow(
    errorMessage,
  );
});
