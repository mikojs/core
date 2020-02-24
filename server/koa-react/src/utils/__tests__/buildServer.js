/**
 * @jest-environment node
 *
 * @flow
 */

import path from 'path';

import Koa from 'koa';
import getPort from 'get-port';
import fetch, { type Response as ResponseType } from 'node-fetch';

import buildCache from '../buildCache';
import buildServer, { type ctxType } from '../buildServer';

describe('build server', () => {
  test('not found', async () => {
    const app = new Koa();
    const port = await getPort();

    // $FlowFixMe TODO: can not extend koa context type
    app.use(buildServer({}, buildCache(__dirname, {})));

    const server = app.listen(port);

    expect(
      await fetch(
        `http://localhost:${port}/not found`,
      ).then((res: ResponseType) => res.text()),
    ).toMatch(/404 | Page not found/);

    server.close();
  });

  test('commons js', async () => {
    const app = new Koa();
    const port = await getPort();

    // $FlowFixMe TODO: can not extend koa context type
    app.use(async (ctx: ctxType, next: () => Promise<void>) => {
      ctx.state.commonsUrl = '/commons';
      await next();
    });
    // $FlowFixMe TODO: can not extend koa context type
    app.use(buildServer({}, buildCache(__dirname, {})));

    const server = app.listen(port);

    expect(
      await fetch(
        `http://localhost:${port}/commons`,
      ).then((res: ResponseType) => res.text()),
    ).toBe('');

    server.close();
  });

  test('not html', async () => {
    const app = new Koa();
    const port = await getPort();

    // $FlowFixMe TODO: can not extend koa context type
    app.use(buildServer({}, buildCache(__dirname, {})));

    const server = app.listen(port);

    expect(
      await fetch(`http://localhost:${port}/foo.js`, {
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
      }).then((res: ResponseType) => res.text()),
    ).toBe('Not Found');

    server.close();
  });

  test('render error', async () => {
    const app = new Koa();
    const port = await getPort();
    const cache = buildCache(__dirname, {});

    cache.addPage(path.resolve(__dirname, './__ignore__/ErrorComponent.js'));
    // $FlowFixMe TODO: can not extend koa context type
    app.use(buildServer({}, cache));

    const server = app.listen(port);

    expect(
      await fetch(
        `http://localhost:${port}/__ignore__/ErrorComponent`,
      ).then((res: ResponseType) => res.text()),
    ).toMatch(/error component/);

    server.close();
  });
});
