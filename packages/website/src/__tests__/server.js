/**
 * @jest-environment node
 *
 * @flow
 */

import path from 'path';

import fetch, { type Response as ResponseType } from 'node-fetch';

import server from '@cat-org/server/lib/bin';

import { version } from '../../package.json';

let runningServer: http$Server;

describe('server', () => {
  beforeAll(async () => {
    runningServer = await server({
      dev: true,
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

  describe('graphql', () => {
    test('version', async () => {
      expect(
        await fetch('http://localhost:8000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            query: `
  {
    version
  }
`,
          }),
        }).then((res: ResponseType) => res.json()),
      ).toEqual({
        data: {
          version,
        },
      });
    });
  });

  afterAll(() => {
    runningServer.close();
  });
});
