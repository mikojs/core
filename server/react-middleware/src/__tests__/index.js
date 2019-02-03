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
        folderPath: path.resolve(__dirname, './__ignore__/custom'),
        basename: '/custom',
      }),
    );

    app.use(
      await react({
        folderPath: path.resolve(__dirname, './__ignore__/default'),
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
          `<script>var __CAT_DATA__ = {&quot;url&quot;:&quot;${urlPath}&quot;};</script>`,
          '<script async="" src="/assets/commons.js"></script>',
          `<script async="" src="/assets/pages/${chunkName}.js"></script>`,
          '<script async="" src="/assets/client.js"></script>',
          '</body></html>',
        ].join(''),
      );
    },
  );

  test.each`
    urlPath
    ${'/error'}
    ${'/custom/error'}
  `('get Error', async ({ urlPath }: { urlPath: string }) => {
    expect(
      await fetch(`http://localhost:${port}${urlPath}`).then(
        (res: ResponseType) => res.text(),
      ),
    ).toMatch(
      new RegExp(
        [
          /custom/.test(urlPath) ? '' : '<html><head></head><body>',
          '<main id="__cat__">.*custom error.*</main>',
          '<script>var __CAT_DATA__ = {};</script>',
          `<script async="" src="/assets${
            !/custom/.test(urlPath) ? '' : '/custom'
          }/commons.js"></script>`,
          `<script async="" src="/assets/pages${urlPath}.js"></script>`,
          `<script async="" src="/assets${
            !/custom/.test(urlPath) ? '' : '/custom'
          }/client.js"></script>`,
          /custom/.test(urlPath) ? '' : '</body></html>',
        ].join(''),
      ),
    );
  });

  test('no getInitialProps', async () => {
    expect(
      await fetch(`http://localhost:${port}/noGetInitialProps`).then(
        (res: ResponseType) => res.text(),
      ),
    ).toBe(
      [
        '<html><head></head><body>',
        '<main id="__cat__"><div>noGetInitialProps</div></main>',
        '<script>var __CAT_DATA__ = {};</script>',
        '<script async="" src="/assets/commons.js"></script>',
        '<script async="" src="/assets/pages/noGetInitialProps.js"></script>',
        '<script async="" src="/assets/client.js"></script>',
        '</body></html>',
      ].join(''),
    );
  });

  test('get custom page', async () => {
    expect(
      await fetch(`http://localhost:${port}/custom`).then((res: ResponseType) =>
        res.text(),
      ),
    ).toBe(
      [
        '<main id="__cat__"><div>test data</div></main>',
        '<script>var __CAT_DATA__ = {};</script>',
        '<script async="" src="/assets/custom/commons.js"></script>',
        '<script async="" src="/assets/pages/custom/index.js"></script>',
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
    const result = await fetch(`http://localhost:${port}/not_found`);

    expect(result.status).toBe(404);
    expect(await result.text()).toBe(
      [
        '<html><head><title>404 | Page not found</title></head><body>',
        '<main id="__cat__"><div>page not found</div></main>',
        '<script>var __CAT_DATA__ = {};</script>',
        '<script async="" src="/assets/commons.js"></script>',
        '<script async="" src="/assets/pages/notFound.js"></script>',
        '<script async="" src="/assets/client.js"></script>',
        '</body></html>',
      ].join(''),
    );
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
