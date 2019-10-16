// @flow

import path from 'path';

import Koa from 'koa';
import getPort from 'get-port';
import fetch, { type Response as ResponseType } from 'node-fetch';
import { outputFileSync } from 'output-file-sync';

import Graphql from '../index';

const graphqlFolder = path.resolve(__dirname, './__ignore__/schema');
const additionalSchema = {
  typeDefs: `
  extend type Query {
    key: String!
  }
`,
  resolvers: {
    Query: {
      key: () => 'value',
    },
  },
};

const requestQuery = `
  {
    key
  }
`;

const requestResult = {
  data: {
    key: 'value',
  },
};

describe('graphql', () => {
  test('relay', () => {
    const graphql = new Graphql(graphqlFolder);

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
    const port = await getPort();
    const graphql = new Graphql(graphqlFolder);

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

  test.each`
    info        | option
    ${'string'} | ${additionalSchema}
    ${'array'}  | ${{ ...additionalSchema, typeDefs: [additionalSchema.typeDefs] }}
  `(
    'additional schema with $info',
    async ({ option }: {| option: typeof additionalSchema |}) => {
      expect(
        await new Graphql(graphqlFolder, option).query(requestQuery),
      ).toEqual(requestResult);
    },
  );

  test.each`
    filePath                                          | isEqual
    ${'./__ignore__/schemaChanged/key.js'}            | ${true}
    ${'./__ignore__/schemaChanged/emptyResolvers.js'} | ${false}
    ${'./notIncludePath.js'}                          | ${false}
  `(
    'update resolver when file is changed with filePath = $filePath',
    async ({ filePath, isEqual }: {| filePath: string, isEqual: boolean |}) => {
      const graphql = new Graphql(graphqlFolder, additionalSchema);

      expect(await graphql.query(requestQuery)).toEqual(requestResult);

      graphql.update(path.resolve(__dirname, filePath));

      const result = await graphql.query(requestQuery);

      (isEqual ? expect(result) : expect(result).not).toEqual({
        data: {
          key: 'test',
        },
      });
    },
  );
});
