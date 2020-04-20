// @flow

import path from 'path';

import buildCache from '../buildCache';
import getConfig from '../getConfig';

test('get config', () => {
  const cache = buildCache(__dirname, {});

  cache.addPage(path.resolve(__dirname, './0.js'));
  cache.addPage(path.resolve(__dirname, './1.js'));

  expect(
    // $FlowFixMe
    // $FlowFixMe
    getConfig(__dirname, {}, cache, __dirname).optimization.splitChunks
      .cacheGroups.commons.minChunks,
  ).toBe(1.5);
});
