// @flow

import path from 'path';
import http from 'http';

import getPort from 'get-port';
import fetch, { type Body as BodyType } from 'node-fetch';

import { chainingLogger } from '@mikojs/utils';
import { mockUpdate, type mergeDirEventType } from '@mikojs/utils/lib/mergeDir';

import buildApi from '../index';
import buildCli from '../buildCli';

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
      const port = await getPort();
      const url = `http://localhost:${port}${pathname}`;
      const server = await (updateEvent !== 'init'
        ? buildCli(
            ['node', 'server', '-f', folderPath, '-p', port],
            { ...chainingLogger, start: jest.fn() },
            buildApi,
          )
        : new Promise(resolve => {
            const runningServer = http.createServer(buildApi(folderPath));

            runningServer.listen(port);
            resolve(runningServer);
          }));

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
