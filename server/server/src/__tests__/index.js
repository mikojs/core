// @flow

import server from '../index';
import testingServer, { type fetchResultType } from '../testingServer';

import foo from './__ignore__/foo';

import watcher from 'utils/watcher';

describe.each`
  mockWatcher
  ${true}
  ${false}
`(
  'server with mockWatcher = $mockWatcher',
  ({ mockWatcher }: {| mockWatcher: boolean |}) => {
    beforeAll(async () => {
      if (!mockWatcher) server.set({ watcher });

      await testingServer.run(foo);
    });

    test('fetch', async () => {
      expect(
        await testingServer
          .fetch('/')
          .then((res: fetchResultType) => res.text()),
      ).toBe('/');
    });

    afterAll(() => {
      testingServer.close();
    });
  },
);
