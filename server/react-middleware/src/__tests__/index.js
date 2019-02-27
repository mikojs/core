/**
 * @jest-environment node
 *
 * @flow
 */

import { type ServerType as koaServerType } from 'koa';
import fetch, { type Response as ResponseType } from 'node-fetch';

import runServer from './__ignore__/server';

let server: koaServerType;
let domain: string;

describe('react middleware', () => {
  beforeAll(async () => {
    const { server: newServer, domain: newDomain } = await runServer();

    server = newServer;
    domain = newDomain;
  });

  test.each`
    urlPath                       | chunkNames
    ${'/'}                        | ${['pages/index']}
    ${'/?key=value'}              | ${['pages/index']}
    ${'/otherPath'}               | ${['pages/otherPath']}
    ${'/otherFolder/otherFolder'} | ${['pages/otherFolder/otherFolder/index']}
    ${'/custom'}                  | ${['pages/custom/index']}
  `(
    'get $urlPath',
    async ({
      urlPath,
      chunkNames,
    }: {
      urlPath: string,
      chunkNames: $ReadOnlyArray<string>,
    }) => {
      const isCustom = /custom/.test(urlPath);

      expect(
        await fetch(`${domain}${urlPath}`).then((res: ResponseType) =>
          res.text(),
        ),
      ).toBe(
        [
          isCustom ? '' : '<html><head></head><body>',
          '<main id="__CAT__">',
          `<div>${isCustom ? 'test data' : urlPath.replace(/\?.*$/, '')}</div>`,
          `<script>var __CHUNKS_NAMES__ = ${JSON.stringify(
            chunkNames,
          )};</script>`,
          '</main>',
          `<script>var __CAT_DATA__ = ${JSON.stringify({
            url: urlPath,
            chunkName: chunkNames[0],
            initialProps: isCustom
              ? {
                  head: null,
                }
              : {
                  path: urlPath.replace(/\?.*$/, ''),
                  head: null,
                },
            Page: null,
            lazyPage: null,
            mainInitialProps: isCustom
              ? {
                  value: 'test data',
                }
              : {},
          }).replace(/"/g, '&quot;')};</script>`,
          `<script src="/assets${
            isCustom ? '/custom' : ''
          }/commons.js" async=""></script>`,
          `<script src="/assets${
            isCustom ? '/custom' : ''
          }/client.js" async=""></script>`,
          isCustom ? '' : '</body></html>',
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
      await fetch(`${domain}${urlPath}`).then((res: ResponseType) =>
        res.text(),
      ),
    ).toMatch(/<main id="__CAT__">.*custom error.*<\/main>/);
  });

  afterAll(() => {
    server.close();
  });
});
