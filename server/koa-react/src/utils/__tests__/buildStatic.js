// @flow

import Koa from 'koa';
import getPort from 'get-port';

import { buildStatic } from '../buildStatic';

test('build static', async () => {
  const server = new Koa().listen(await getPort());

  expect(await buildStatic(server)).toBeUndefined();

  server.close();
});
