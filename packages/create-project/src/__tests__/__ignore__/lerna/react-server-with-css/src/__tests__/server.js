/**
 * @jest-environment node
 *
 * @flow
 */

import path from 'path';

import fetch, { type Response as ResponseType } from 'node-fetch';

import server from '@mikojs/server/lib/defaults';

let runningServer: http$Server;

describe('server', () => {
  beforeAll(async () => {
    runningServer = await server({
      src: path.resolve(__dirname, '..'),
      dir: path.resolve(__dirname, '..'),
    });
  });

  describe('pages', () => {
    test('/', async () => {
      expect(
        await fetch('http://localhost:8000').then((res: ResponseType) =>
          res.text(),
        ),
      ).not.toBe('Not Found');
    });
  });

  afterAll(() => {
    runningServer.close();
  });
});
