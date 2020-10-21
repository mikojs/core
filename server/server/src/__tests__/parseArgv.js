// @flow

import http, {
  type ServerResponse as ServerResponseType,
  type IncomingMessage as IncomingMessageType,
} from 'http';

import { emptyFunction } from 'fbjs';
import fetch, { type Response as ResponseType } from 'node-fetch';

import { type eventType } from '../index';
import parseArgv, { handleErrorMessage } from '../parseArgv';

describe('parse argv', () => {
  test('could not find a build error', () => {
    expect(
      handleErrorMessage('server', new Error('Cannot find module main.js')),
    ).toMatch(/Could not find a valid build./);
  });

  test.each`
    event
    ${'build'}
    ${'start'}
  `(
    'run commands with event = $event',
    async ({ event }: {| event: eventType |}) => {
      const server = await parseArgv(
        'server',
        '1.0.0',
        emptyFunction.thatReturns(
          (req: IncomingMessageType, res: ServerResponseType) => {
            res.end('test');
          },
        ),
        ['node', 'server', event, __dirname],
      );

      if (event === 'build') expect(server).toBeNull();
      else {
        expect(server).toBeInstanceOf(http.Server);
        expect(
          await fetch('http://localhost:3000').then((res: ResponseType) =>
            res.text(),
          ),
        ).toBe('test');
      }

      if (server) server.close();
    },
  );

  test('parse argv error', async () => {
    await expect(
      parseArgv(
        'server',
        '1.0.0',
        () => {
          throw new Error('error');
        },
        ['node', 'server', 'start', __dirname],
      ),
    ).rejects.toThrow('error');
  });
});
