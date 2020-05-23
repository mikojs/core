// @flow

import path from 'path';

import { GraphQLError } from 'graphql/error/GraphQLError';

import { mockUpdate, type mergeDirEventType } from '@mikojs/utils/lib/mergeDir';
import testingServer, {
  type fetchResultType,
} from '@mikojs/server/lib/testingServer';

import buildGraphql from '../index';

const server = testingServer();

describe('graphql', () => {
  beforeEach(() => {
    mockUpdate.clear();
  });

  test.each`
    updateEvent | canQuery
    ${'init'}   | ${true}
    ${'unlink'} | ${false}
    ${'error'}  | ${true}
  `(
    'update event: $updateEvent',
    async ({
      updateEvent,
      canQuery,
    }: {|
      updateEvent: mergeDirEventType,
      canQuery: boolean,
    |}) => {
      const folderPath = path.resolve(__dirname, './__ignore__');
      const graphql = buildGraphql(folderPath);
      const query = `
        {
          version
        }
      `;
      const expected = {
        data: {
          version: '1.0.0',
        },
      };

      await server.run(graphql.middleware);

      if (updateEvent !== 'init') {
        expect(mockUpdate.cache).toHaveLength(1);

        mockUpdate.cache[0](
          updateEvent,
          path.resolve(folderPath, `./index.js`),
        );
      }

      expect(
        await server
          .fetch('/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query,
            }),
          })
          .then((res: fetchResultType) => (canQuery ? res.json() : res.text())),
      ).toEqual(canQuery ? expected : 'Not found');
      expect(await graphql.query({ source: query })).toEqual(
        canQuery
          ? expected
          : {
              errors: [new GraphQLError('Must provide a schema.')],
            },
      );
    },
  );

  afterAll(() => {
    server.close();
  });
});
