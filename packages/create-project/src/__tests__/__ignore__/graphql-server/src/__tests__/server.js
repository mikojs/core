/**
 * @jest-environment node
 *
 * @flow
 */

import path from 'path';

import fetch, { type Response as ResponseType } from 'node-fetch';

import server from '@cat-org/server/lib/defaults';

import { version } from '../../package.json';

let runningServer: http$Server;

describe('server', () => {
  beforeAll(async () => {
    runningServer = await server({
      src: path.resolve(__dirname, '..'),
      dir: path.resolve(__dirname, '..'),
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
