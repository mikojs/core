// @flow

import buildHelpers from '../index';

test('helpers', () => {
  const helpers = buildHelpers();
  const chokidar = helpers('chokidar');

  expect(helpers('chokidar')).toEqual(chokidar);
});
