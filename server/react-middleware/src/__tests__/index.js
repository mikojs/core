// @flow

import path from 'path';

import Koa, { type ServerType as koaServerType } from 'koa';
import getPort from 'get-port';
import fetch, { type Response as ResponseType } from 'node-fetch';

import react from '../index';

describe('react middleware', () => {
  let server: koaServerType;
  let port: number;

  beforeAll(async () => {
    const app = new Koa();

    app.use(
      await react({
        folderPath: path.resolve(__dirname, './__ignore__'),
      }),
    );

    port = await getPort();
    server = app.listen(port);
  });

  test.each`
    urlPath         | chunkName
    ${'/'}          | ${'index'}
    ${'/temp'}      | ${'temp'}
    ${'/test/temp'} | ${'test/temp/index'}
  `(
    'get $urlPath',
    async ({ urlPath, chunkName }: { urlPath: string, chunkName: string }) => {
      expect(
        await fetch(`http://localhost:${port}${urlPath}`).then(
          (res: ResponseType) => res.text(),
        ),
      ).toBe(
        [
          '<html><head></head><body>',
          `<main id="__cat__"><div data-reactroot="">${urlPath}</div></main>`,
          '<script async="" src="/assets/commons.js"></script>',
          `<script async="" src="/assets/pages/${chunkName}.js"></script>`,
          '<script async="" src="/assets/client.js"></script>',
          '</body></html>',
        ].join(''),
      );
    },
  );

  test('can not find folder', async () => {
    await expect(react()).rejects.toThrow('folder can not be found.');
  });

  afterAll(() => {
    server.close();
  });
});
