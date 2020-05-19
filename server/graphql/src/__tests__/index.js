// @flow

import path from 'path';
import http from 'http';

import getPort from 'get-port';
import fetch, { type Body as BodyType } from 'node-fetch';

import { mockUpdate } from '@mikojs/utils/lib/mergeDir';

import buildGraphql from '../index';

import testings from './__ignore__/testings';

const folderPath = path.resolve(__dirname, './__ignore__/graphql');

describe('graphql', () => {
  beforeEach(() => {
    mockUpdate.clear();
  });

  test.each(testings)('%s', async (query: string, expected: {}) => {
    const port = await getPort();
    const server = http.createServer(
      (req: http.IncomingMessage, res: http.ServerResponse) => {
        buildGraphql(folderPath)(req, res);
      },
    );

    server.listen(port);

    expect(
      await fetch(`http://localhost:${port}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
        }),
      }).then((res: BodyType) => res.json()),
    ).toEqual({
      data: expected,
    });

    server.close();
  });
});
