// @flow

import path from 'path';
import http from 'http';

import getPort from 'get-port';
import fetch, { type Body as BodyType } from 'node-fetch';

import buildApi from '../index';

describe('server', () => {
  test.each`
    pathname             | canFind
    ${'/api'}            | ${true}
    ${'/id'}             | ${true}
    ${'/test/not-found'} | ${false}
    ${'/test/api'}       | ${true}
  `(
    'fetch $pathname',
    async ({ pathname, canFind }: {| pathname: string, canFind: boolean |}) => {
      const server = http.createServer(
        buildApi(path.resolve(__dirname, './__ignore__')),
      );
      const port = await getPort();
      const url = `http://localhost:${port}${pathname}`;

      server.listen(port);

      expect(
        await fetch(url).then((res: BodyType) =>
          canFind ? res.json() : res.text(),
        ),
      ).toEqual(canFind ? { key: 'value' } : 'Not found');

      server.close();
    },
  );
});
