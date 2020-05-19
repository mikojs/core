// @flow

import path from 'path';

import { type Body as BodyType } from 'node-fetch';

import { mockUpdate, type mergeDirEventType } from '@mikojs/utils/lib/mergeDir';

import buildApi from '../index';
import testingServer from '../testingServer';

const server = testingServer();
const folderPath = path.resolve(__dirname, './__ignore__');

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
      await server.run(buildApi(folderPath));

      if (updateEvent === 'unlink') {
        expect(mockUpdate.cache).toHaveLength(1);

        mockUpdate.cache[0](
          updateEvent,
          path.resolve(folderPath, `.${pathname}.js`),
        );
      }

      expect(
        await server
          .fetch(pathname)
          .then((res: BodyType) => (canFind ? res.json() : res.text())),
      ).toEqual(canFind ? { key: 'value' } : 'Not found');
    },
  );

  afterAll(() => {
    server.close();
  });
});
