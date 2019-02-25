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
  `(
    'get $urlPath',
    async ({
      urlPath,
      chunkNames,
    }: {
      urlPath: string,
      chunkNames: $ReadOnlyArray<string>,
    }) => {
      expect(
        await fetch(`${domain}${urlPath}`).then((res: ResponseType) =>
          res.text(),
        ),
      ).toBe(
        [
          '<html><head></head><body>',
          '<main id="__CAT__">',
          `<div>${urlPath.replace(/\?.*$/, '')}</div>`,
          `<script>var __CHUNKS_NAMES__ = ${JSON.stringify(
            chunkNames,
          )};</script>`,
          '</main>',
          `<script>var __CAT_DATA__ = ${JSON.stringify({
            url: urlPath,
            chunkName: chunkNames[0],
            initialProps: {
              path: urlPath.replace(/\?.*$/, ''),
              head: null,
            },
            Page: null,
            lazyPage: null,
            mainInitialProps: {},
          }).replace(/"/g, '&quot;')};</script>`,
          '<script src="/assets/commons.js" async=""></script>',
          '<script src="/assets/client.js" async=""></script>',
          '</body></html>',
        ].join(''),
      );
    },
  );

  afterAll(() => {
    server.close();
  });
});
