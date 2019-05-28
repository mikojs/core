// @flow

import { initStore } from '../server';

test('init store', async () => {
  const { Component, Page, lazyPage } = initStore();

  expect(Component).toThrow('Can not use init Component');
  expect(Page).toThrow('Can not use init Page');
  await expect(lazyPage()).rejects.toThrow('Can not use init lazy Page');
});
