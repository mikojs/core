// @flow

import path from 'path';

import { type middlewareType } from '@mikojs/server';

import testingServer, { type fetchResultType } from '../testingServer';
import router from './__ignore__/router';

describe.each`
  folderPathOrMiddleware
  ${path.resolve(__dirname, './__ignore__')}
  ${router}
`(
  'router with folderPathOrMiddleware = $folderPathOrMiddleware',
  ({
    folderPathOrMiddleware,
  }: {|
    folderPathOrMiddleware: string | middlewareType<>,
  |}) => {
    beforeAll(async () => {
      await testingServer.run(folderPathOrMiddleware);
    });

    test.each`
      url      | expected
      ${'/'}   | ${'/ {}'}
      ${'/id'} | ${'/id {"id":"id"}'}
    `(
      'fetch $url',
      async ({ url, expected }: {| url: string, expected: string |}) => {
        expect(
          await testingServer
            .fetch(url)
            .then((res: fetchResultType) => res.text()),
        ).toBe(expected);
      },
    );

    test('not found', async () => {
      expect(
        await testingServer
          .fetch('/a/notFound')
          .then((res: fetchResultType) => res.status),
      ).toBe(404);
    });

    afterAll(() => {
      testingServer.close();
    });
  },
);
