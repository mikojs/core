// @flow

import Koa from 'koa';
import getPort from 'get-port';
import fetch, { type Response as ResponseType } from 'node-fetch';
import webpack from 'webpack';

import buildClient, { type ctxType } from '../buildClient';

test('build client', async () => {
  const app = new Koa();
  const port = await getPort();

  app.use(
    buildClient(
      {},
      {
        compiler: webpack({}),
        config: { output: { publicPath: '/public/js' } },
        run: Promise.resolve,
      },
    ),
  );
  // $FlowFixMe TODO: can not extend koa context type
  app.use(async (ctx: ctxType, next: () => Promise<void>) => {
    ctx.body = JSON.stringify(ctx.state);
    await next();
  });

  const server = app.listen(port);

  expect(
    await fetch(`http://localhost:${port}`, {
      headers: {
        'content-type': 'application/json',
      },
    }).then((res: ResponseType) => res.json()),
  ).toEqual({ commonsUrl: '/commons.js', clientUrl: '/client.js' });

  server.close();
});
