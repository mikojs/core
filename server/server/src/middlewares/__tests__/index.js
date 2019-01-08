// @flow

import path from 'path';

import Koa from 'koa';

import { Middlewares } from '..';

describe('middlewares', () => {
  test('can not find `test` middleware', () => {
    expect(() => {
      new Middlewares().use('test')(new Koa());
    }).toThrow(/can not find `test` middleware/);
  });

  test('middleware error', () => {
    expect(() => {
      new Middlewares().useMiddleware(
        new Koa(),
        path.resolve(__dirname, './__ignore__'),
        'error',
      );
    }).toThrow(/middleware error/);
  });
});
