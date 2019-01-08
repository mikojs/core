// @flow

import path from 'path';

import Koa, { type ServerType as koaServerType } from 'koa';
import getPort from 'get-port';
import fetch, { type Response as ResponseType } from 'node-fetch';

import react from '..';

describe('react middleware', () => {
  let server: koaServerType;
  let port: number;

  beforeAll(async () => {
    const app = new Koa();

    react(app, {
      folderPath: path.resolve(__dirname, './__ignore__'),
    });

    port = await getPort();
    server = app.listen(port);
  });

  test.each`
    urlPath
    ${'/'}
    ${'/temp'}
    ${'/test/temp'}
  `('get $urlPath', async ({ urlPath }: { urlPath: string }) => {
    expect(
      await fetch(`http://localhost:${port}${urlPath}`).then(
        (res: ResponseType) => res.text(),
      ),
    ).toBe(`<div data-reactroot="">${urlPath}</div>`);
  });

  test('can not find folder', () => {
    expect(() => {
      react(new Koa());
    }).toThrow('folder can not be found.');
  });

  afterAll(() => {
    server.close();
  });
});
