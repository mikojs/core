// @flow

import path from 'path';

import Koa from 'koa';

import { Middlewares } from '..';

describe('middlewares', () => {
  it('can not find `test` middleware', () => {
    expect(() => {
      new Middlewares().use('test')(new Koa());
    }).toThrow(/can not find `test` middleware/);
  });

  it('middleware error', () => {
    expect(() => {
      new Middlewares().useMiddleware(
        new Koa(),
        path.resolve(__dirname, './__ignore__'),
        'error',
      );
    }).toThrow(/middleware error/);
  });
});
