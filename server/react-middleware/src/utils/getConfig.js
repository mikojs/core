// @flow

import path from 'path';

import TerserPlugin from 'terser-webpack-plugin';

import { type dataType, type routeDataType } from './getData';

const CLIENT_PATH = path.resolve(__dirname, './client.js');

// TODO: add testing to check config
export default (
  dev: boolean,
  folderPath: string,
  basename: ?string,
  { routesData, templates }: dataType,
) => ({
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'eval' : false,
  entry: !basename
    ? {
        client: [CLIENT_PATH],
      }
    : {
        [`${basename.replace(/^\//, '')}/client`]: [CLIENT_PATH],
      },
  output: {
    path: dev ? undefined : path.resolve('./public/js'),
    publicPath: '/assets/',
    filename: dev ? '[name].js' : '[name].[chunkhash:8].min.js',
    chunkFilename: dev ? '[name].js' : '[name].[chunkhash:8].min.js',
  },
  optimization: {
    minimize: !dev,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: false,
        cache: true,
      }),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        commons: {
          name: !basename
            ? 'commons'
            : `${basename.replace(/^\//, '')}/commons`,
          chunks: 'all',
          minChunks: routesData.length > 2 ? routesData.length * 0.5 : 2,
        },
      },
    },
  },
  module: {
    rules: [
      {
        include: [CLIENT_PATH],
        loader: 'string-replace-loader',
        options: {
          multiple: [
            {
              search: '/** replace routesData */',
              replace: `[${routesData
                .map(
                  // TODO: add testing to check data
                  ({ routePath, chunkName, filePath }: routeDataType): string =>
                    `{ ${[
                      'exact: true',
                      `path: ${JSON.stringify(routePath)}`,
                      `component: {${[
                        `loader: () => import(/* webpackChunkName: "${chunkName}" */ '${filePath}')`,
                        `moduleId: require.resolveWeak('${filePath}')`,
                      ].join(', ')}}`,
                    ].join(', ')} }`,
                )
                .join(', ')}] ||`,
            },
            {
              search: '[\'|"](.|/)*templates/Main[\'|"]',
              replace: `"${templates.main}"`,
              flags: 'g',
            },
            {
              search: '[\'|"](.|/)*templates/Error[\'|"]',
              replace: `"${templates.error}"`,
              flags: 'g',
            },
          ],
        },
      },
      {
        include: [folderPath, path.resolve(__dirname, '../Core.js')],
        loader: 'string-replace-loader',
        options: {
          search: 'module.exports = ((.|\n)*);',
          replace: `module.exports = require('react-hot-loader/root').hot($1)`,
          flags: 'g',
        },
      },
      {
        test: /\.jsx?$/,
        include: /node_modules/,
        use: ['react-hot-loader/webpack'],
      },
    ],
  },
});
