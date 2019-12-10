// @flow

import rimraf from 'rimraf';

import remove from '../remove';

test('remove', async () => {
  const result = remove(['flow-typed', 'install'], __dirname);

  rimraf.mock.calls.forEach(([, callback]: [string, () => void]) => {
    callback();
  });

  expect(await result).toBeUndefined();
});
