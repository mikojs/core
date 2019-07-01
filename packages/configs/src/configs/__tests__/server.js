// @flow

import server from '../server';

describe('server', () => {
  test('install', () => {
    expect(server.install(['yarn', 'add', '--dev'])).toEqual([
      'yarn',
      'add',
      'koa',
      '@cat-org/server',
      '@cat-org/koa-base',
    ]);
  });
});
