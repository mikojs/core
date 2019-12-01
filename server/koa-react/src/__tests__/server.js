/**
 * @jest-environment node
 *
 * @flow
 */

import path from 'path';

import fetch from 'node-fetch';
import webpack from 'webpack';
import outputFileSync from 'output-file-sync';

import runningServer from './__ignore__/server';
import pagesTestings from './__ignore__/pagesTestings';

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
    const mockLog = jest.fn();
    const publicPath = dev ? '/assets' : '/public/js';
    const isStatic = !dev && useStatic;
    const request = !isStatic
      ? fetch
      : (url: string): ({| status: 200, text: () => string |}) => {
          const filePath = url
            .replace(
              domain,
              path.resolve(__dirname, '../../node_modules/test-static'),
            )
            .replace(/\/(\?.*)?$/, '');
          const data = outputFileSync.mock.calls.find(
            ([outputFilePath]: [string]) =>
              outputFilePath.replace(/\/index.html$/, '') === filePath,
          );

          if (!data) throw new Error(`can not found ${url}`);

          return {
            status: 200,
            text: () => data[1],
          };
        };

    beforeAll(async () => {
      global.console.log = mockLog;
      // $FlowFixMe jest mock
      webpack.mockCallbackArguments.mockReturnValue([
        null,
        {
          hasErrors: () => false,
          toJson: () => ({
            assetsByChunkName: {
              client: 'client.js',
            },
          }),
        },
      ]);
      outputFileSync.mockClear();

      const { server: newServer, domain: newDomain } = await runningServer(
        dev,
        useStatic,
      );

      server = newServer;
      domain = newDomain;
    });

    test.each(pagesTestings)(
      'get %s',
      async (
        urlPath: string,
        chunkName: string,
        head: string,
        main: string,
        pageInitialProps: {},
        mainInitialProps: {},
      ) => {
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
            '<!DOCTYPE html>',
            head,
            '<main id="__MIKOJS__">',
            `<div>${main}</div>`,
            '</main>',
            `<script data-react-helmet="true">var __MIKOJS_DATA__ = ${JSON.stringify(
              {
                mainInitialProps,
                pageInitialProps,
                chunkName,
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

    if (!dev)
      test('build js had shown the information', () => {
        expect(mockLog).toHaveBeenCalledTimes(2);
      });

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
