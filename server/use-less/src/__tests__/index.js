// @flow

import useCss from '@mikojs/use-css';

import useLess from '../index.js';

describe('use-less', () => {
  test('use @mikojs/ues-less with @mikojs/use-css', () => {
    expect(
      // TODO: use pipeline
      useLess(useCss()).config(
        {
          config: {},
          devMiddleware: {},
        },
        true,
      ).config,
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
  });

  test('splitChunks is false', () => {
    expect(
      useLess().config(
        {
          config: {
            module: {
              rules: [
                {
                  test: /\.css$/,
                  use: [
                    {
                      loader: 'less-loader',
                    },
                  ],
                },
              ],
            },
            optimization: {
              splitChunks: false,
            },
          },
          devMiddleware: {},
        },
        true,
      ).config,
    ).toEqual({
      module: {
        rules: [
          {
            test: /\.(css|less)$/,
            use: [
              {
                loader: 'less-loader',
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
  });
});
