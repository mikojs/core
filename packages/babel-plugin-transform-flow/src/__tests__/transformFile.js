// @flow

import { resetDestPaths, getDestPaths } from 'output-file-sync';

import reset from './__ignore__/reset';
import babel from './__ignore__/babel';
import { transformFileOptions, indexFiles } from './__ignore__/constants';

test('transform file', () => {
  reset(transformFileOptions);
  resetDestPaths();
  babel();

  expect(getDestPaths()).toEqual(indexFiles);
});
