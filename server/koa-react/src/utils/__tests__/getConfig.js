// @flow

import getConfig from '../getConfig';

test('routes data is smaller then 2', async () => {
  expect(getConfig).toBeUndefined();
  /** TODO
  expect(
    getConfig(false, '/', undefined, {
      templates: {
        document: 'document',
        main: 'main',
        loading: 'loading',
        error: 'error',
      },
      routesData: [],
    }).optimization.splitChunks.cacheGroups.commons.minChunks,
  ).toBe(2);
  */
});
