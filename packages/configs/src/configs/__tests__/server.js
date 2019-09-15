// @flow

import server from '../server';

describe('server', () => {
  test('install', () => {
    expect(server.install(['yarn', 'add', '--dev'])).toEqual([
      'yarn',
      'add',
      'koa',
      '@mikojs/server',
      '@mikojs/koa-base',
    ]);
  });
});
