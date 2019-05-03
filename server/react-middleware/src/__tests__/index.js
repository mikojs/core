// @flow

import reactMiddleware from '../index';

test('can not found folder', async () => {
  await expect(reactMiddleware('/test')).rejects.toThrow(
    'folder can not be found.',
  );
});
