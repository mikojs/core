// @flow

import path from 'path';
import http from 'http';

import getPort from 'get-port';
import fetch, { type Body as BodyType } from 'node-fetch';

import { chainingLogger } from '@mikojs/utils';
import { mockUpdate, type mergeDirEventType } from '@mikojs/utils/lib/mergeDir';

import buildApi from '../index';
import buildCli from '../buildCli';

const folderPath = path.resolve(__dirname, './__ignore__');
const logger = {
  ...chainingLogger,
  start: jest.fn(),
};

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
      const mockLog = jest.fn();
      let countLog: number = 0;

      global.console.log = mockLog;

      const port = await getPort();
      const url = `http://localhost:${port}${pathname}`;
      const server = await (updateEvent !== 'init'
        ? buildCli(['node', 'server', '-p', port], folderPath, logger, () =>
            buildApi(folderPath, {
              dev: true,
              logger,
            }),
          )
        : new Promise(resolve => {
            const runningServer = http.createServer(
              (req: http.IncomingMessage, res: http.ServerResponse) => {
                buildApi(folderPath)(req, res);
              },
            );

            runningServer.listen(port);
            resolve(runningServer);
          }));

      if (updateEvent !== 'init') {
        expect(mockUpdate.cache).toHaveLength(1);

        countLog += 1;
        mockUpdate.cache[0](
          updateEvent,
          path.resolve(folderPath, `.${pathname}.js`),
        );

        if (updateEvent === 'unlink') countLog += 1;
      }

      expect(mockLog).toHaveBeenCalledTimes(countLog);
      expect(
        await fetch(url).then((res: BodyType) =>
          canFind ? res.json() : res.text(),
        ),
      ).toEqual(canFind ? { key: 'value' } : 'Not found');

      server.close();
    },
  );
});
