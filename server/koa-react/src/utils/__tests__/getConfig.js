// @flow

import path from 'path';

import buildCache from '../buildCache';
import getConfig from '../getConfig';

test('get config', () => {
  const cache = buildCache(__dirname, {});

  cache.addPage(path.resolve(__dirname, './0.js'));
  cache.addPage(path.resolve(__dirname, './1.js'));

  expect(getConfig(__dirname, {}, cache, __dirname)).toMatchObject({
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            minChunks: 1.5,
          },
        },
      },
    },
  });
});
