// @flow

import path from 'path';

import Koa from 'koa';
import getPort from 'get-port';
import fetch, { type Response as ResponseType } from 'node-fetch';

import Graphql from '../index';

let server: http$Server;
let port: number;

beforeAll(async () => {
  const app = new Koa();
  const graphql = new Graphql(path.resolve(__dirname, './__ignore__'));

  app.use(graphql.middleware());
  port = await getPort();
  server = app.listen(port);
});

test('graphql-middleware', async () => {
  expect(
    await fetch(`http://localhost:${port}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: `
  {
    version
    users {
      id
      event {
        id
        name
      }
    }
  }
`,
      }),
    }).then((res: ResponseType) => res.json()),
  ).toEqual({
    data: {
      version: '1.0.0',
      users: [
        {
          id: 'user-id',
          event: {
            id: 'event-id',
            name: 'event-name',
          },
        },
      ],
    },
  });
});

afterAll(() => {
  server.close();
});
