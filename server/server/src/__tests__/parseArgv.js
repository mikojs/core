// @flow

import http, {
  type ServerResponse as ServerResponseType,
  type IncomingMessage as IncomingMessageType,
} from 'http';

import { emptyFunction } from 'fbjs';
import fetch, { type Response as ResponseType } from 'node-fetch';

import { type eventType } from '../index';
import parseArgv from '../parseArgv';

describe('parse argv', () => {
  test.each`
    event
    ${'build'}
    ${'start'}
  `(
    'run commands with event = $event',
    async ({ event }: {| event: eventType |}) => {
      const server = await parseArgv(
        'name',
        '1.0.0',
        emptyFunction.thatReturns(
          (req: IncomingMessageType, res: ServerResponseType) => {
            res.end('test');
          },
        ),
        ['node', 'name', event, __dirname],
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
});
