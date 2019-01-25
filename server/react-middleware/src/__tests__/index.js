// @flow

import path from 'path';

import Koa, { type ServerType as koaServerType } from 'koa';
import getPort from 'get-port';
import fetch, { type Response as ResponseType } from 'node-fetch';
import { watchCallback } from 'chokidar';

import react from '../index';

describe('react middleware', () => {
  let server: koaServerType;
  let port: number;

  beforeAll(async () => {
    const app = new Koa();

    app.use(
      await react({
        folderPath: path.resolve(__dirname, './__ignore__/default'),
      }),
    );

    app.use(
      await react({
        folderPath: path.resolve(__dirname, './__ignore__/custom'),
        basename: '/custom',
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
          `<main id="__cat__"><div>${urlPath}</div></main>`,
          '<script async="" src="/assets/commons.js"></script>',
          `<script async="" src="/assets/pages/${chunkName}.js"></script>`,
          '<script async="" src="/assets/client.js"></script>',
          '</body></html>',
        ].join(''),
      );
    },
  );

  test('get custom page', async () => {
    expect(
      await fetch(`http://localhost:${port}/custom`).then((res: ResponseType) =>
        res.text(),
      ),
    ).toBe(
      [
        '<main id="__cat__"><div>/</div></main>',
        '<script async="" src="/assets/custom/commons.js"></script>',
        `<script async="" src="/assets/pages/custom/index.js"></script>`,
        '<script async="" src="/assets/custom/client.js"></script>',
      ].join(''),
    );
  });

  test('handle commons not found', async () => {
    const result = await fetch(`http://localhost:${port}/assets/commons.js`);

    expect(result.status).toBe(200);
    expect(await result.text()).toBe('');
  });

  test('page not found', async () => {
    expect(
      await fetch(`http://localhost:${port}/not_found`).then(
        (res: ResponseType) => res.text(),
      ),
    ).toBe('Not Found');
  });

  test('can not find folder', async () => {
    await expect(react()).rejects.toThrow('folder can not be found.');
  });

  describe.each`
    filePath
    ${'index'}
    ${'index.js'}
  `('trigger chokidar file change', ({ filePath }: { filePath: string }) => {
    test(`work with filePath = ${filePath}`, () => {
      watchCallback(filePath);
    });
  });

  afterAll(() => {
    server.close();
  });
});
