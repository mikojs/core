// @flow

import { type webpackMiddlewarweOptionsType } from '@mikojs/koa-react';

import useCss from '../index.js';

describe('use-css', () => {
  test.each`
    config
    ${{}}
    ${{ module: {} }}
    ${{ module: { rules: [] } }}
  `(
    'config = $config',
    ({
      config,
    }: {|
      config: $PropertyType<webpackMiddlewarweOptionsType, 'config'>,
    |}) => {
      expect(
        useCss().webpackMiddlewarweOptions(
          {
            config,
            devMiddleware: {},
          },
          false,
        ).config,
      ).toEqual({
        module: {
          rules: [
            {
              test: /\.css$/,
              use: [
                {
                  loader: 'style-loader',
                },
                {
                  loader: 'css-loader',
                },
              ],
            },
          ],
        },
        optimization: {
          splitChunks: {
            cacheGroups: {
              styles: {
                name: 'styles',
                test: /\.css$/,
                chunks: 'all',
                enforce: true,
              },
            },
          },
        },
      });
    },
  );
});
