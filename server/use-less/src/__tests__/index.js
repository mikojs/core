// @flow

import { type configType } from '@cat-org/react-middleware';
import useCss from '@cat-org/use-css';

import useLess from '../index.js';

describe('use-less', () => {
  test.each`
    config
    ${{}}
  `(
    'config = $config',
    ({ config }: {| config: $PropertyType<configType, 'config'> |}) => {
      expect(
        {}
          |> useCss
          |> useLess
          |> (({
            config: configFunc,
          }: {
            config: $PropertyType<configType, 'config'>,
          }) =>
            configFunc({
              config,
              devMiddleware: {},
            }).config),
      ).toEqual({
        module: {
          rules: [
            {
              test: /\.(css|less)$/,
              use: [
                {
                  loader: 'style-loader',
                },
                {
                  loader: 'css-loader',
                },
                {
                  loader: 'less-loader',
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
                test: /\.(css|less)$/,
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
