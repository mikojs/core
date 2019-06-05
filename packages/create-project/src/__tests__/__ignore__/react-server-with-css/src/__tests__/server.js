/**
 * @jest-environment node
 *
 * @flow
 */

import path from 'path';

import fetch, { type Response as ResponseType } from 'node-fetch';

import server from '@cat-org/server/lib/bin';

let runningServer: http$Server;

describe('server', () => {
  beforeAll(async () => {
    runningServer = await server({
      dev: true,
      src: path.resolve(__dirname, '..'),
      dir: path.resolve(__dirname, '..'),
      babelOptions: false,
    });
  });

  describe('pages', () => {
    test('/', async () => {
      expect(
        await fetch('http://localhost:8000').then((res: ResponseType) =>
          res.text(),
        ),
      ).toBeDefined();
    });
  });

  afterAll(() => {
    runningServer.close();
  });
});
