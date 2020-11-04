// @flow

import path from 'path';

import { type graphqlType } from '../index';
import testingServer, { type fetchResultType } from '../testingServer';
import graphql from './__ignore__/graphql';

describe.each`
  folderPathOrMiddleware
  ${path.resolve(__dirname, './__ignore__/schemas')}
  ${graphql}
`(
  'graphql with folderPathOrMiddleware = $folderPathOrMiddleware',
  ({
    folderPathOrMiddleware,
  }: {|
    folderPathOrMiddleware: string | graphqlType,
  |}) => {
    beforeAll(async () => {
      await testingServer.run(folderPathOrMiddleware);
    });

    test('fetch', async () => {
      expect(
        await testingServer
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
          .then((res: fetchResultType) => res.json()),
      ).toEqual({
        data: {
          version: '1.0.0',
        },
      });
    });

    afterAll(() => {
      testingServer.close();
    });
  },
);
