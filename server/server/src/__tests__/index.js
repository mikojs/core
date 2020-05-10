// @flow

import path from 'path';
import http from 'http';

import getPort from 'get-port';
import fetch, { type Body as BodyType } from 'node-fetch';

import buildApi from '../index';

describe('server', () => {
  test.each`
    pathname
    ${'/api'}
  `('fetch $pathname', async ({ pathname }: {| pathname: string |}) => {
    const server = http.createServer(
      buildApi(path.resolve(__dirname, './__ignore__')),
    );
    const port = await getPort();

    server.listen(port);

    expect(
      await fetch(`http://localhost:${port}${pathname}`).then((res: BodyType) =>
        res.json(),
      ),
    ).toEqual({ key: 'value' });

    server.close();
  });
});
