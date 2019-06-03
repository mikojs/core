// @flow

import React from '../index';

test('can not found folder', async () => {
  await expect(new React('/test')).rejects.toThrow('folder can not be found.');
});
