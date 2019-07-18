// @flow

import findOptionsPath from '../findOptionsPath';

test('findOptionsPath', () => {
  expect(findOptionsPath('./src/server.js', './lib/server.js')).toEqual({
    src: './src/',
    dir: './lib/',
  });
});
