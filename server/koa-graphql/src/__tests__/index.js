// @flow

import path from 'path';

import Koa from 'koa';
import getPort from 'get-port';
import fetch, { type Response as ResponseType } from 'node-fetch';
import { outputFileSync } from 'output-file-sync';

import Graphql from '../index';

describe('graphql', () => {
  test('relay', () => {
    const graphql = new Graphql(path.resolve(__dirname, './__ignore__'));

    outputFileSync.destPaths = [];
    outputFileSync.contents = [];
    graphql.relay([]);

    expect(outputFileSync.destPaths).toEqual([
      path.resolve('./node_modules/.cache/koa-graphql/schema.graphql'),
    ]);
    expect(outputFileSync.contents).toEqual([
      `type Event {
  id: ID!
  name: String!
}

type Query {
  version: String!
  users: [User!]!
}

type User {
  id: ID!
  event: Event!
}
`,
    ]);
  });

  test('middleware', async () => {
    const app = new Koa();
    const graphql = new Graphql(path.resolve(__dirname, './__ignore__'));
    const port = await getPort();

    app.use(graphql.middleware());

    const server = app.listen(port);

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

    server.close();
  });
});
