// @flow

import react from '../index';

test('can not found folder', async () => {
  await expect(react('/test')).rejects.toThrow('folder can not be found.');
});
