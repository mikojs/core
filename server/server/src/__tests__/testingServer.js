// @flow

import {
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

import testingServer, { type fetchResultType } from '../testingServer';

jest.unmock('output-file-sync');

const server = testingServer();

describe('testing erver', () => {
  beforeAll(async () => {
    await server.use((req: IncomingMessageType, res: ServerResponseType) => {
      res.end(req.url);
    });
  });

  test('fetch', async () => {
    expect(
      await server.fetch('/').then((res: fetchResultType) => res.text()),
    ).toBe('/');
  });

  afterAll(() => {
    server.close();
  });
});
