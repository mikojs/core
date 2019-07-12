// @flow

import path from 'path';

import { outputFileSync } from 'output-file-sync';

import Graphql from '../index';

import runServer from './__ignore__/runServer';

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
    const graphql = new Graphql(path.resolve(__dirname, './__ignore__/schema'));

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

  describe('middleware', () => {
    test('basic usage', async () => {
      const { server, request } = await runServer();

      expect(
        await request(`
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
        `),
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

    test('additional schema with string', async () => {
      const { server, request } = await runServer(additionalSchema);

      expect(await request(requestQuery)).toEqual(requestResult);

      server.close();
    });

    test('additional schema with array', async () => {
      const { server, request } = await runServer({
        ...additionalSchema,
        typeDefs: [additionalSchema.typeDefs],
      });

      expect(await request(requestQuery)).toEqual(requestResult);

      server.close();
    });

    test.each`
      filePath                                          | isEqual
      ${'./__ignore__/schemaChanged/key.js'}            | ${true}
      ${'./__ignore__/schemaChanged/emptyResolvers.js'} | ${false}
      ${'./notIncludePath.js'}                          | ${false}
    `(
      'update resolver when file is changed with filePath = $filePath',
      async ({
        filePath,
        isEqual,
      }: {|
        filePath: string,
        isEqual: boolean,
      |}) => {
        const { server, graphql, request } = await runServer(additionalSchema);

        expect(await request(requestQuery)).toEqual(requestResult);

        graphql.update(path.resolve(__dirname, filePath));

        const result = await request(requestQuery);

        (isEqual ? expect(result) : expect(result).not).toEqual({
          data: {
            key: 'test',
          },
        });

        server.close();
      },
    );
  });
});
