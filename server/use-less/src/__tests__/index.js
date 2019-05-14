// @flow

import { type configType } from '@cat-org/react-middleware';

import useLess from '../index.js';

describe('use-less', () => {
  test.each`
    config
    ${{}}
    ${{ module: {} }}
    ${{ module: { rules: [] } }}
  `(
    'config = $config',
    ({ config }: {| config: $PropertyType<configType, 'config'> |}) => {
      expect(
        useLess().config(
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
              test: /\.less$/,
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
      });
    },
  );
});
