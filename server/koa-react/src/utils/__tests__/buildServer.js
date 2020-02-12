/**
 * @jest-environment node
 *
 * @flow
 */

import Koa from 'koa';
import webpack from 'koa-webpack';
import getPort from 'get-port';
import fetch, { type Response as ResponseType } from 'node-fetch';

import getCache from '../getCache';
import buildServer from '../buildServer';

describe('build server', () => {
  test('commons js', async () => {
    const app = new Koa();
    const port = await getPort();

    app.use(await webpack());
    // $FlowFixMe TODO: can not extend koa context type
    app.use(buildServer({}, getCache(__dirname, {})));

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

    app.use(await webpack());
    // $FlowFixMe TODO: can not extend koa context type
    app.use(buildServer({}, getCache(__dirname, {})));

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
});
