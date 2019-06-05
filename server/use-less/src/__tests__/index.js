// @flow

import useCss from '@cat-org/use-css';

import useLess from '../index.js';

describe('use-less', () => {
  test('use @cat-org/ues-less with @cat-org/use-css', () => {
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
