// @flow

import { setMainFunction } from 'output-file-sync';

import reset from './__ignore__/reset';
import babel from './__ignore__/babel';
import { transformFileOptions } from './__ignore__/constants';

test('parse error', () => {
  expect(() => {
    reset();
    babel();
  }).toThrowError('@cat-org/babel-plugin-transform-flow TypeError');
});

test('write error', () => {
  expect(() => {
    setMainFunction(() => {
      throw new Error('error');
    });
    reset(transformFileOptions);
    babel();
  }).toThrowError(`@cat-org/babel-plugin-transform-flow Error: error`);
});
