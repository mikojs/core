// @flow

import Koa from 'koa';

import middlewares from '..';

describe('middlewares', () => {
  it('can not find `test` middleware', () => {
    expect(() => {
      middlewares('test')(new Koa());
    }).toThrow(/can not find `test` middleware/);
  });
});
