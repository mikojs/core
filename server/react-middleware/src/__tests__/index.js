/**
 * @jest-environment node
 *
 * @flow
 */

import { type ServerType as koaServerType } from 'koa';
import fetch from 'node-fetch';

import runServer from './__ignore__/server';
import * as constants from './__ignore__/constants';

let server: koaServerType;
let domain: string;

describe('react middleware', () => {
  beforeAll(async () => {
    const { server: newServer, domain: newDomain } = await runServer();

    server = newServer;
    domain = newDomain;
  });

  test.each`
    urlPath                       | chunkNames                                 | head                      | main                          | initialProps
    ${'/'}                        | ${['pages/index']}                         | ${constants.head}         | ${'/'}                        | ${{ path: '/', head: null }}
    ${'/?key=value'}              | ${['pages/index']}                         | ${constants.head}         | ${'/'}                        | ${{ path: '/', head: null }}
    ${'/otherPath'}               | ${['pages/otherPath']}                     | ${constants.head}         | ${'/otherPath'}               | ${{ path: '/otherPath', head: null }}
    ${'/otherFolder/otherFolder'} | ${['pages/otherFolder/otherFolder/index']} | ${constants.head}         | ${'/otherFolder/otherFolder'} | ${{ path: '/otherFolder/otherFolder', head: null }}
    ${'/custom'}                  | ${['pages/custom/index']}                  | ${''}                     | ${'test data'}                | ${constants.initialProps}
    ${'/notFound'}                | ${['pages/notFound']}                      | ${constants.notFoundHead} | ${constants.notFoundMain}     | ${constants.initialProps}
    ${'/custom/notFound'}         | ${['pages/custom/notFound']}               | ${''}                     | ${'Page not found'}           | ${constants.initialProps}
    ${'/error'}                   | ${['pages/error']}                         | ${constants.head}         | ${constants.errorMain}        | ${constants.initialProps}
    ${'/custom/error'}            | ${['pages/custom/error']}                  | ${''}                     | ${'custom error'}             | ${constants.initialProps}
  `(
    'get $urlPath',
    async ({
      urlPath,
      chunkNames,
      head,
      main,
      initialProps,
    }: {
      urlPath: string,
      chunkNames: $ReadOnlyArray<string>,
      head: string,
      main: string,
      initialProps: { path?: string, head: null },
    }) => {
      const isCustom = /custom/.test(urlPath);
      const result = await fetch(`${domain}${urlPath}`);

      expect(result.status).toBe(urlPath === '/notFound' ? 404 : 200);
      expect(
        (await result.text())
          .replace(/ style="[\w;:,()\-.%# ]*"/g, '')
          .replace(/ data-reactroot=""/g, ''),
      ).toBe(
        [
          head,
          '<main id="__CAT__">',
          `<div>${main}</div>`,
          /error/.test(urlPath)
            ? ''
            : `<script>var __CHUNKS_NAMES__ = ${JSON.stringify(
                chunkNames,
              )};</script>`,
          '</main>',
          `<script data-react-helmet="true">var __CAT_DATA__ = ${JSON.stringify(
            {
              url: urlPath,
              chunkName: chunkNames[0],
              initialProps,
              Page: null,
              lazyPage: null,
              mainInitialProps: isCustom
                ? {
                    value: 'test data',
                  }
                : {},
            },
          )};</script>`,
          `<script data-react-helmet="true" src="/assets${
            isCustom ? '/custom' : ''
          }/commons.js" async=""></script>`,
          `<script data-react-helmet="true" src="/assets${
            isCustom ? '/custom' : ''
          }/client.js" async=""></script>`,
          isCustom ? '' : '</body></html>',
        ].join(''),
      );
    },
  );

  test('handle commons not found', async () => {
    const result = await fetch(`${domain}/assets/commons.js`);

    expect(result.status).toBe(200);
    expect(await result.text()).toBe('');
  });

  afterAll(() => {
    server.close();
  });
});
