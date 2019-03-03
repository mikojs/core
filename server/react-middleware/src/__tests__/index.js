// @flow

import reactMiddleware from '../index';

test('can not found folder', async () => {
  await expect(reactMiddleware()).rejects.toThrow('folder can not be found.');
});
