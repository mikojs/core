// @flow

import Koa from 'koa';
import getPort from 'get-port';

import { buildStatic } from '../buildStatic';

test('buildStatic', async () => {
  expect(await buildStatic(new Koa().listen(await getPort()))).toBeUndefined();
});
