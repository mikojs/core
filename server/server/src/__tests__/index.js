// @flow

import path from 'path';

import server from '../index';
import testingServer, {
  type fetchResultType,
} from './__ignore__/testingServer';

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

      await testingServer.run(
        path.resolve(__dirname, './__ignore__/folder/foo'),
      );
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
