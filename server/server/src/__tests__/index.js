// @flow

import path from 'path';

import { mockUpdate, type mergeDirEventType } from '@mikojs/utils/lib/mergeDir';

import buildApi from '../index';
import testingServer, { type fetchResultType } from '../testingServer';

const server = testingServer();

describe('server', () => {
  beforeEach(() => {
    mockUpdate.clear();
  });

  test.each`
    pathname             | canFind  | updateEvent
    ${'/'}               | ${true}  | ${'init'}
    ${'/?key=value'}     | ${true}  | ${'init'}
    ${'/api'}            | ${true}  | ${'init'}
    ${'/value'}          | ${true}  | ${'init'}
    ${'/test/not-found'} | ${false} | ${'init'}
    ${'/test'}           | ${true}  | ${'init'}
    ${'/test/api'}       | ${true}  | ${'init'}
    ${'/test/api'}       | ${false} | ${'unlink'}
    ${'/api'}            | ${true}  | ${'error'}
  `(
    'fetch $pathname',
    async ({
      pathname,
      canFind,
      updateEvent,
    }: {|
      pathname: string,
      canFind: boolean,
      updateEvent: mergeDirEventType,
    |}) => {
      const folderPath = path.resolve(__dirname, './__ignore__');

      await server.run(buildApi(folderPath));

      if (updateEvent !== 'init') {
        expect(mockUpdate.cache).toHaveLength(1);

        mockUpdate.cache[0](
          updateEvent,
          path.resolve(folderPath, `.${pathname}.js`),
        );
      }

      expect(
        await server
          .fetch(pathname)
          .then((res: fetchResultType) => (canFind ? res.json() : res.text())),
      ).toEqual(canFind ? { key: 'value' } : 'Not found');
    },
  );

  afterAll(() => {
    server.close();
  });
});
