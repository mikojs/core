// @flow

import rimraf from 'rimraf';

import rimrafSync from '../rimrafSync';

test('rimraf sync', async () => {
  const errorMessage = 'Remove folder error.';

  rimraf.mockImplementation(
    (filePath: string, callback: (err: mixed) => void) =>
      callback(new Error(errorMessage)),
  );

  await expect(rimrafSync(__dirname)).rejects.toThrow(errorMessage);
});
