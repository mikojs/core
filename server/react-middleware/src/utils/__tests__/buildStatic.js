// @flow

import Koa from 'koa';
import getPort from 'get-port';

import { buildStatic } from '../buildStatic';

test('buildStatic', async () => {
  const server = new Koa().listen(await getPort());

  expect(await buildStatic(server)).toBeUndefined();

  server.close();
});
