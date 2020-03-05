// @flow

import server from '../server';

describe('server', () => {
  test('install', () => {
    expect(server.install(['--dev'])).toEqual([
      'koa',
      '@mikojs/server',
      '@mikojs/koa-base',
    ]);
  });
});
