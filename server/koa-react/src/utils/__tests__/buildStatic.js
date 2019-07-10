// @flow

import buildStatic from '../buildStatic';
import Cache from '../Cache';

jest.mock('node-fetch', () =>
  jest.fn(async (url: string) => ({
    text: () => url,
  })),
);

test('build static', async () => {
  expect(
    await buildStatic(
      '/commons.js',
      undefined,
      new Cache(),
    ),
  ).toBeUndefined();
});
