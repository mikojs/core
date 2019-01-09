// @flow

import Koa from 'koa';

import middlewares from '../index';

describe('middlewares', () => {
  test('can not find `test` middleware', () => {
    expect(() => {
      middlewares('test')(new Koa());
    }).toThrow(/can not find `test` middleware/);
  });
});
