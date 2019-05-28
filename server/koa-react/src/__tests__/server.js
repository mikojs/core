/**
 * @jest-environment node
 *
 * @flow
 */

import path from 'path';

import fetch from 'node-fetch';
// $FlowFixMe jest mock
import { webpack } from 'webpack';
import { outputFileSync } from 'output-file-sync';

import runningServer from './__ignore__/server';
import * as constants from './__ignore__/constants';

let server: http$Server;
let domain: string;

describe.each`
  dev      | useStatic
  ${true}  | ${false}
  ${false} | ${false}
  ${true}  | ${true}
  ${false} | ${true}
`(
  'koa react with dev = $dev, useStatic = $useStatic',
  ({ dev, useStatic }: {| dev: boolean, useStatic: boolean |}) => {
    const publicPath = dev ? '/assets' : '/public/js';
    const isStatic = !dev && useStatic;
    const request = !isStatic
      ? fetch
      : (url: string): {| status: 200, text: () => string |} => {
          const filePath = url
            .replace(
              domain,
              path.resolve(__dirname, '../../node_modules/test-static'),
            )
            .replace(/\/(\?.*)?$/, '');
          const index = outputFileSync.destPaths.findIndex(
            (destPath: string) =>
              destPath.replace(/\/index.html$/, '') === filePath,
          );

          if (index === -1) throw new Error(`can not found ${url}`);

          return {
            status: 200,
            text: () => outputFileSync.contents[index],
          };
        };

    beforeAll(async () => {
      webpack.stats = {
        hasErrors: () => false,
        toJson: () => ({
          assetsByChunkName: {
            client: 'client.js',
          },
        }),
      };
      outputFileSync.destPaths = [];
      outputFileSync.contents = [];

      const { server: newServer, domain: newDomain } = await runningServer(
        dev,
        useStatic,
      );

      server = newServer;
      domain = newDomain;
    });

    test.each`
      urlPath                       | chunkNames                                 | head                      | main                          | initialProps
      ${'/'}                        | ${['pages/index']}                         | ${constants.head}         | ${'/'}                        | ${{ path: '/' }}
      ${'/?key=value'}              | ${['pages/index']}                         | ${constants.head}         | ${'/'}                        | ${{ path: '/' }}
      ${'/otherPath'}               | ${['pages/otherPath']}                     | ${constants.head}         | ${'/otherPath'}               | ${{ path: '/otherPath' }}
      ${'/otherFolder/otherFolder'} | ${['pages/otherFolder/otherFolder/index']} | ${constants.head}         | ${'/otherFolder/otherFolder'} | ${{ path: '/otherFolder/otherFolder' }}
      ${'/custom/'}                 | ${['pages/custom/index']}                  | ${''}                     | ${'test data'}                | ${{}}
      ${'/error'}                   | ${['pages/error']}                         | ${constants.head}         | ${constants.errorMain}        | ${{}}
      ${'/custom/error'}            | ${['pages/custom/error']}                  | ${''}                     | ${'custom error'}             | ${{}}
      ${'/notFound'}                | ${['pages/notFound']}                      | ${constants.notFoundHead} | ${constants.notFoundMain}     | ${{}}
      ${'/custom/notFound'}         | ${['pages/custom/notFound']}               | ${''}                     | ${'Page not found'}           | ${{}}
    `(
      'get $urlPath',
      async ({
        urlPath,
        chunkNames,
        head,
        main,
        initialProps,
      }: {|
        urlPath: string,
        chunkNames: $ReadOnlyArray<string>,
        head: string,
        main: string,
        initialProps: {| path?: string |},
      |}) => {
        const isCustom = /custom/.test(urlPath);
        const result = await request(`${domain}${urlPath}`);

        expect(result.status).toBe(
          urlPath === '/notFound' && !isStatic ? 404 : 200,
        );
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
                originalUrl: isStatic
                  ? urlPath.replace(/notFound/, '*').replace(/\?.*$/, '')
                  : urlPath,
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
            `<script data-react-helmet="true" src="${publicPath}${
              isCustom ? '/custom' : ''
            }/commons.js" async=""></script>`,
            `<script data-react-helmet="true" src="${publicPath}${
              isCustom ? '/custom' : ''
            }/client.js" async=""></script>`,
            isCustom ? '' : '</body></html>',
          ].join(''),
        );
      },
    );

    test('handle commons not found', async () => {
      const result = await request(`${domain}${publicPath}/commons.js`);

      expect(result.status).toBe(200);
      expect(await result.text()).toBe('');
    });

    afterAll(() => {
      server.close();
    });
  },
);
