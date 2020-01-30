// @flow

import path from 'path';

import Koa from 'koa';
import getPort from 'get-port';
import fetch, { type Response as ResponseType } from 'node-fetch';
import execa from 'execa';

import graphql from '../index';

const { update, middleware, runRelayCompiler, query } = graphql(
  path.resolve(__dirname, './__ignore__/schema'),
);

describe('graphql', () => {
  beforeAll(() => {
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

  test('run relay compiler', async () => {
    await runRelayCompiler([]);

    expect(execa).toHaveBeenCalledTimes(1);
    expect(execa).toHaveBeenCalledWith(
      'relay-compiler',
      [
        '--schema',
        path.resolve('./node_modules/.cache/koa-graphql/schema.graphql'),
      ],
      {
        stdio: 'inherit',
      },
    );
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
