// @flow

import Koa, { type Context as koaContextType } from 'koa';
import getPort from 'get-port';
import fetch, { type Response as ResponseType } from 'node-fetch';

import base from '../index';

describe('koa base', () => {
  let server: http$Server;
  let port: number;

  beforeAll(async () => {
    const app = new Koa();

    app.use(base);
    app.use(async (ctx: koaContextType, next: () => Promise<void>) => {
      if (ctx.request.body instanceof Object) ctx.body = ctx.request.body;
      await next();
    });

    port = await getPort();
    server = app.listen(port);
  });

  test('work', async () => {
    expect(
      await fetch(`http://localhost:${port}`, {
        method: 'post',
        body: JSON.stringify({ key: 'value' }),
        headers: { 'Content-Type': 'application/json' },
      }).then((res: ResponseType) => res.json()),
    ).toEqual({
      key: 'value',
    });
  });

  afterAll(() => {
    server.close();
  });
});
