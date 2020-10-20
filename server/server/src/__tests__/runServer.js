// @flow

import http, {
  type ServerResponse as ServerResponseType,
  type IncomingMessage as IncomingMessageType,
} from 'http';

import fetch, { type Response as ResponseType } from 'node-fetch';
import getPort from 'get-port';

import { type eventType } from '../index';
import runServer from '../runServer';

describe('run server', () => {
  test.each`
    event
    ${'build'}
    ${'start'}
  `(
    'run server with event = $event',
    async ({ event }: {| event: eventType |}) => {
      const port = await getPort();
      const server = await runServer(
        event,
        port,
        (req: IncomingMessageType, res: ServerResponseType) => {
          res.end('test');
        },
      );

      if (event === 'build') expect(server).toBeNull();
      else {
        expect(server).toBeInstanceOf(http.Server);
        expect(
          await fetch(`http://localhost:${port}`).then((res: ResponseType) =>
            res.text(),
          ),
        ).toBe('test');
      }

      if (server) server.close();
    },
  );
});
