// @flow

import path from 'path';

import { GraphQLError } from 'graphql/error/GraphQLError';
import execa from 'execa';

import { mockUpdate, type mergeDirEventType } from '@mikojs/utils/lib/mergeDir';
import testingServer, {
  type fetchResultType,
} from '@mikojs/server/lib/testingServer';

import buildGraphql from '../index';

const server = testingServer();

describe('graphql', () => {
  beforeEach(() => {
    mockUpdate.clear();
    execa.mockClear();
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
      graphql.relayCompiler([]);

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
      expect(execa).toHaveBeenCalledTimes(2);
      expect(execa).toHaveBeenCalledWith(
        'relay-compiler',
        [
          '--schema',
          path.resolve('./node_modules/.cache/graphql/schema.graphql'),
        ],
        {
          preferLocal: true,
          stdio: 'inherit',
        },
      );
    },
  );

  afterAll(() => {
    server.close();
  });
});
