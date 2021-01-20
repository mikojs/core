// @flow

import rimraf from 'rimraf';

import rimrafSync from '../rimrafSync';

test('rimraf sync', async () => {
  rimraf.mockImplementation(
    (filePath: string, callback: (err: mixed) => void) =>
      callback(new Error('Remove folder error.')),
  );

  await expect(rimrafSync(__dirname)).rejects.toThrow('Remove folder error.');
});
