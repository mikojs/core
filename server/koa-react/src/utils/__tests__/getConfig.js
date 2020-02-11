// @flow

import path from 'path';

import getCache from '../getCache';
import getConfig from '../getConfig';

test('get config', () => {
  const cache = getCache(__dirname, {});

  cache.addPage(path.resolve(__dirname, './0.js'));
  cache.addPage(path.resolve(__dirname, './1.js'));

  expect(
    // $FlowFixMe
    getConfig(__dirname, {}, cache, __dirname).optimization.splitChunks
      .cacheGroups.commons.minChunks,
  ).toBe(1.5);
});
