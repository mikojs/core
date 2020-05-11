// @flow

import path from 'path';
import http from 'http';

import getPort from 'get-port';
import fetch, { type Body as BodyType } from 'node-fetch';

import { mockUpdate, type mergeDirEventType } from '@mikojs/utils/lib/mergeDir';

import buildApi from '../index';

describe('server', () => {
  beforeEach(() => {
    mockUpdate.clear();
  });

  test.each`
    pathname             | canFind  | updateEvent
    ${'/api'}            | ${true}  | ${'init'}
    ${'/id'}             | ${true}  | ${'init'}
    ${'/test/not-found'} | ${false} | ${'init'}
    ${'/test/api'}       | ${true}  | ${'init'}
    ${'/api'}            | ${false} | ${'unlink'}
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
      const server = http.createServer(
        buildApi(
          folderPath,
          updateEvent === 'init' ? undefined : { dev: true },
        ),
      );
      const port = await getPort();
      const url = `http://localhost:${port}${pathname}`;

      server.listen(port);

      if (updateEvent !== 'init') {
        expect(mockUpdate.cache).toHaveLength(1);
        mockUpdate.cache[0](
          updateEvent,
          path.resolve(folderPath, `.${pathname}`),
        );
      }

      expect(
        await fetch(url).then((res: BodyType) =>
          canFind ? res.json() : res.text(),
        ),
      ).toEqual(canFind ? { key: 'value' } : 'Not found');

      server.close();
    },
  );
});
