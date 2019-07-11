// @flow

import getConfig from '../getConfig';
import Cache from '../Cache';

jest.mock(
  '../Cache',
  () =>
    class MockCache {
      routesData = [];
      cacheDir = () => {};
    },
);

test('routes data is smaller then 2', async () => {
  expect(
    getConfig(
      false,
      '/',
      undefined,
      undefined,
      new Cache('/folderPath', () => []),
    ).optimization.splitChunks.cacheGroups.commons.minChunks,
  ).toBe(2);
});
