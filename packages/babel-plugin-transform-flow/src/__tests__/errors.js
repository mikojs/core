// @flow

import reset from './__ignore__/reset';
import babel from './__ignore__/babel';

test('parse error', () => {
  expect(() => {
    reset();
    babel();
  }).toThrowError('@cat-org/babel-plugin-transform-flow TypeError');
});
