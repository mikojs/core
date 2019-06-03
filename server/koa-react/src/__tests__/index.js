// @flow

import React from '../index';

test('can not found folder', () => {
  expect(() => new React('/test')).toThrow('folder can not be found.');
});
