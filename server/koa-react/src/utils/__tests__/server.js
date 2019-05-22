// @flow

import { initStore } from '../server';

test('init store', async () => {
  const { Page, lazyPage } = initStore();

  expect(Page).toThrow('Can not use init Page');
  await expect(lazyPage()).rejects.toThrow('Can not use init lazy Page');
});
