// @flow

import path from 'path';

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

      await server.run(buildGraphql(folderPath));

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
              query: `
                {
                  version
                }
              `,
            }),
          })
          .then((res: fetchResultType) => (canQuery ? res.json() : res.text())),
      ).toEqual(
        !canQuery
          ? 'Not found'
          : {
              data: {
                version: '1.0.0',
              },
            },
      );
    },
  );

  afterAll(() => {
    server.close();
  });
});
