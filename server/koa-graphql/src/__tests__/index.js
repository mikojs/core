// @flow

import path from 'path';

import Koa from 'koa';
import getPort from 'get-port';
import fetch, { type Response as ResponseType } from 'node-fetch';
import outputFileSync from 'output-file-sync';

import graphql from '../index';

const { update, middleware, runRelayCompiler, query } = graphql(
  path.resolve(__dirname, './__ignore__/schema'),
);

describe('graphql', () => {
  beforeEach(() => {
    outputFileSync.mockClear();
    update(path.resolve(__dirname, './__ignore__/schemaUpdated/index.js'));
  });

  test('middleware', async () => {
    const app = new Koa();
    const port = await getPort();

    app.use(middleware());

    const server = app.listen(port);

    expect(
      await fetch(`http://localhost:${port}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            {
              version
            }
          `,
        }),
      }).then((res: ResponseType) => res.json()),
    ).toEqual({
      data: {
        version: '2.0.0',
      },
    });

    server.close();
  });

  test('run relay compiler', () => {
    runRelayCompiler([]);

    expect(outputFileSync).toHaveBeenCalledTimes(1);
  });

  test('query', async () => {
    expect(
      await query({
        source: `
          {
            version
          }
        `,
      }),
    ).toEqual({
      data: {
        version: '2.0.0',
      },
    });
  });
});
